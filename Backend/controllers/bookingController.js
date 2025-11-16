import pool from '../config/database.js';

export const createBooking = async (req, res) => {
  const {
    roomId,
    checkinDate,
    checkoutDate,
    guestCount = 1,
    specialRequests = '',
    paymentMethod
  } = req.body;

  const userId = req.user.id;
  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    // Calculate total price
    const [roomData] = await conn.execute(
      `SELECT r.id, rt.base_price, h.name as hotel_name, rt.name as room_type
       FROM rooms r
       JOIN room_types rt ON r.room_type_id = rt.id
       JOIN hotels h ON r.hotel_id = h.id
       WHERE r.id = ? AND r.status = 'AVAILABLE'
       FOR UPDATE`,
      [roomId]
    );

    if (roomData.length === 0) {
      await conn.rollback();
      return res.status(404).json({ 
        error: 'Room not available or does not exist' 
      });
    }

    const basePrice = roomData[0].base_price;
    const nights = Math.ceil(
      (new Date(checkoutDate) - new Date(checkinDate)) / (1000 * 60 * 60 * 24)
    );
    const totalPrice = basePrice * nights;

    // Check for overlapping bookings with pessimistic locking
    const [overlapping] = await conn.execute(
      `SELECT COUNT(*) as overlap_count 
       FROM bookings 
       WHERE room_id = ? 
       AND status IN ('PENDING', 'CONFIRMED')
       AND NOT (? <= checkout_date OR ? >= checkin_date)`,
      [roomId, checkoutDate, checkinDate]
    );

    if (overlapping[0].overlap_count > 0) {
      await conn.rollback();
      return res.status(409).json({ 
        error: 'Room already booked for selected dates' 
      });
    }

    // Create booking
    const [bookingResult] = await conn.execute(
      `INSERT INTO bookings (
        user_id, room_id, checkin_date, checkout_date, 
        total_price, guest_count, special_requests, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, 'CONFIRMED')`,
      [userId, roomId, checkinDate, checkoutDate, totalPrice, guestCount, specialRequests]
    );

    const bookingId = bookingResult.insertId;

    // Create payment record
    const transactionRef = `TXN-${Date.now()}-${bookingId}`;
    await conn.execute(
      `INSERT INTO payments (
        booking_id, amount, method, status, transaction_ref
      ) VALUES (?, ?, ?, 'SUCCESS', ?)`,
      [bookingId, totalPrice, paymentMethod, transactionRef]
    );

    // Update room status
    await conn.execute(
      'UPDATE rooms SET status = ? WHERE id = ?',
      ['OCCUPIED', roomId]
    );

    // Log transaction
    await conn.execute(
      `INSERT INTO transaction_log (
        booking_id, user_id, action, table_name, record_id, details, ip_address
      ) VALUES (?, ?, 'BOOKING_CREATED', 'bookings', ?, ?, ?)`,
      [
        bookingId, 
        userId, 
        bookingId,
        `User ${userId} booked room ${roomId} from ${checkinDate} to ${checkoutDate}`,
        req.ip
      ]
    );

    await conn.commit();

    res.status(201).json({
      success: true,
      bookingId,
      transactionRef,
      totalPrice,
      message: 'Booking created successfully'
    });

  } catch (error) {
    await conn.rollback();
    
    // Log the error
    console.error('Booking transaction failed:', error);
    
    res.status(500).json({ 
      error: 'Booking failed due to system error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  } finally {
    conn.release();
  }
};

export const cancelBooking = async (req, res) => {
  const { bookingId } = req.params;
  const userId = req.user.id;
  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    // Get booking details with lock
    const [bookings] = await conn.execute(
      `SELECT b.*, r.id as room_id 
       FROM bookings b 
       JOIN rooms r ON b.room_id = r.id 
       WHERE b.id = ? AND b.user_id = ?
       FOR UPDATE`,
      [bookingId, userId]
    );

    if (bookings.length === 0) {
      await conn.rollback();
      return res.status(404).json({ error: 'Booking not found' });
    }

    const booking = bookings[0];

    if (booking.status === 'CANCELLED') {
      await conn.rollback();
      return res.status(400).json({ error: 'Booking already cancelled' });
    }

    // Update booking status
    await conn.execute(
      'UPDATE bookings SET status = ? WHERE id = ?',
      ['CANCELLED', bookingId]
    );

    // Update room status
    await conn.execute(
      'UPDATE rooms SET status = ? WHERE id = ?',
      ['AVAILABLE', booking.room_id]
    );

    // Update payment status
    await conn.execute(
      'UPDATE payments SET status = ? WHERE booking_id = ?',
      ['REFUNDED', bookingId]
    );

    // Log transaction
    await conn.execute(
      `INSERT INTO transaction_log (
        booking_id, user_id, action, table_name, record_id, details
      ) VALUES (?, ?, 'BOOKING_CANCELLED', 'bookings', ?, ?)`,
      [bookingId, userId, bookingId, `Booking ${bookingId} cancelled by user ${userId}`]
    );

    await conn.commit();

    res.json({
      success: true,
      message: 'Booking cancelled successfully'
    });

  } catch (error) {
    await conn.rollback();
    console.error('Cancel booking failed:', error);
    res.status(500).json({ error: 'Cancellation failed' });
  } finally {
    conn.release();
  }
};

export const getAvailableRooms = async (req, res) => {
  const { hotelId, checkinDate, checkoutDate, roomTypeId } = req.query;

  try {
    console.log('🔍 Get available rooms request:', { hotelId, checkinDate, checkoutDate, roomTypeId });

    // Validate required parameters
    if (!hotelId) {
      return res.status(400).json({ error: 'Hotel ID is required' });
    }

    // If dates are not provided, set default dates (today and tomorrow)
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    const effectiveCheckinDate = checkinDate && checkinDate.trim() !== '' ? checkinDate : today;
    const effectiveCheckoutDate = checkoutDate && checkoutDate.trim() !== '' ? checkoutDate : tomorrow;

    console.log('📅 Using dates:', { effectiveCheckinDate, effectiveCheckoutDate });

    // Build the query based on whether dates are provided
    let query, params;

    if (checkinDate && checkoutDate && checkinDate.trim() !== '' && checkoutDate.trim() !== '') {
      // Both dates provided - check for booking overlaps
      query = `
        SELECT 
          r.id,
          r.room_number,
          r.floor,
          rt.name as room_type,
          rt.description,
          rt.capacity,
          rt.base_price,
          rt.amenities,
          rt.size_sqft,
          rt.bed_type,
          h.name as hotel_name,
          h.rating as hotel_rating
        FROM rooms r
        JOIN room_types rt ON r.room_type_id = rt.id
        JOIN hotels h ON r.hotel_id = h.id
        WHERE r.status = 'AVAILABLE'
          AND r.hotel_id = ?
          AND r.id NOT IN (
            SELECT b.room_id 
            FROM bookings b 
            WHERE b.status IN ('PENDING', 'CONFIRMED')
            AND NOT (? <= b.checkout_date OR ? >= b.checkin_date)
          )
          ${roomTypeId ? 'AND r.room_type_id = ?' : ''}
        ORDER BY rt.base_price ASC
      `;

      params = roomTypeId 
        ? [hotelId, effectiveCheckoutDate, effectiveCheckinDate, roomTypeId]
        : [hotelId, effectiveCheckoutDate, effectiveCheckinDate];
    } else {
      // No dates provided - just get all available rooms without date checking
      query = `
        SELECT 
          r.id,
          r.room_number,
          r.floor,
          rt.name as room_type,
          rt.description,
          rt.capacity,
          rt.base_price,
          rt.amenities,
          rt.size_sqft,
          rt.bed_type,
          h.name as hotel_name,
          h.rating as hotel_rating
        FROM rooms r
        JOIN room_types rt ON r.room_type_id = rt.id
        JOIN hotels h ON r.hotel_id = h.id
        WHERE r.status = 'AVAILABLE'
          AND r.hotel_id = ?
          ${roomTypeId ? 'AND r.room_type_id = ?' : ''}
        ORDER BY rt.base_price ASC
      `;

      params = roomTypeId ? [hotelId, roomTypeId] : [hotelId];
    }

    console.log('📝 Executing query:', query);
    console.log('📝 With params:', params);

    const [rooms] = await pool.execute(query, params);
    console.log(`✅ Found ${rooms.length} available rooms`);

    // Parse amenities safely - handle both JSON arrays and comma-separated strings
    const roomsWithAmenities = rooms.map(room => {
      let amenities = [];
      
      if (room.amenities) {
        try {
          // First try to parse as JSON array
          amenities = JSON.parse(room.amenities);
        } catch (jsonError) {
          try {
            // If JSON parsing fails, try splitting by comma
            if (typeof room.amenities === 'string') {
              amenities = room.amenities.split(',')
                .map(item => item.trim())
                .filter(item => item.length > 0);
              console.log(`✅ Converted comma-separated amenities to array: ${amenities.join(', ')}`);
            }
          } catch (splitError) {
            console.error(`⚠️ Failed to parse room amenities for room ${room.room_number}:`, splitError);
            amenities = [];
          }
        }
      }
      
      return {
        ...room,
        amenities: amenities
      };
    });

    res.json({
      success: true,
      data: roomsWithAmenities,
      count: roomsWithAmenities.length
    });

  } catch (error) {
    console.error('❌ Get available rooms failed:', error);
    res.status(500).json({ 
      error: 'Failed to fetch available rooms',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const getUserBookings = async (req, res) => {
  const userId = req.user.id;

  try {
    const [bookings] = await pool.execute(
      `SELECT 
        b.id, 
        b.checkin_date, 
        b.checkout_date, 
        b.total_price, 
        b.status,
        b.guest_count, 
        b.special_requests, 
        b.created_at,
        r.room_number, 
        r.floor,
        rt.name as room_type,
        h.name as hotel_name, 
        h.city as hotel_city,
        p.status as payment_status, 
        p.transaction_ref,
        DATEDIFF(b.checkout_date, b.checkin_date) as nights
      FROM bookings b
      JOIN rooms r ON b.room_id = r.id
      JOIN room_types rt ON r.room_type_id = rt.id
      JOIN hotels h ON r.hotel_id = h.id
      LEFT JOIN payments p ON b.id = p.booking_id
      WHERE b.user_id = ?
      ORDER BY b.created_at DESC`,
      [userId]
    );

    res.json({
      success: true,
      data: bookings
    });

  } catch (error) {
    console.error('Get user bookings failed:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
};

export const getRoomDetails = async (req, res) => {
  const { roomId } = req.params;

  try {
    console.log('🔍 Get room details request for room ID:', roomId);

    // First, verify the room exists
    const [roomCheck] = await pool.execute(
      'SELECT id FROM rooms WHERE id = ?',
      [roomId]
    );

    if (roomCheck.length === 0) {
      return res.status(404).json({ error: 'Room not found' });
    }

    // Get detailed room information
    const [rooms] = await pool.execute(
      `SELECT 
        r.id, 
        r.room_number, 
        r.floor, 
        r.status,
        rt.name as room_type, 
        rt.description, 
        rt.capacity, 
        rt.base_price, 
        rt.amenities as room_type_amenities, 
        rt.size_sqft, 
        rt.bed_type,
        h.name as hotel_name, 
        h.address as hotel_address, 
        h.city as hotel_city, 
        h.rating as hotel_rating,
        h.amenities as hotel_amenities
      FROM rooms r
      JOIN room_types rt ON r.room_type_id = rt.id
      JOIN hotels h ON r.hotel_id = h.id
      WHERE r.id = ?`,
      [roomId]
    );

    const roomData = rooms[0];
    console.log('✅ Found room:', roomData.room_number);

    // Safe parsing function
    const safeParseJSON = (str, defaultValue = []) => {
      if (!str) return defaultValue;
      
      try {
        const parsed = JSON.parse(str);
        return Array.isArray(parsed) ? parsed : defaultValue;
      } catch (error) {
        console.log('⚠️ JSON parse failed, using default');
        // If it's a string with commas, split it
        if (typeof str === 'string' && str.includes(',')) {
          return str.split(',').map(item => item.trim()).filter(item => item);
        }
        return defaultValue;
      }
    };

    const room = {
      id: roomData.id,
      room_number: roomData.room_number,
      floor: roomData.floor,
      status: roomData.status,
      room_type: roomData.room_type,
      description: roomData.description,
      capacity: roomData.capacity,
      base_price: roomData.base_price,
      amenities: safeParseJSON(roomData.room_type_amenities, ['WiFi', 'AC', 'TV']), // Default amenities
      size_sqft: roomData.size_sqft,
      bed_type: roomData.bed_type,
      hotel_name: roomData.hotel_name,
      hotel_address: roomData.hotel_address,
      hotel_city: roomData.hotel_city,
      hotel_rating: roomData.hotel_rating,
      hotel_amenities: safeParseJSON(roomData.hotel_amenities, ['WiFi', 'Restaurant']) // Default hotel amenities
    };

    console.log('✅ Room details processed successfully');

    res.json({
      success: true,
      data: room
    });

  } catch (error) {
    console.error('❌ Get room details failed:', error);
    res.status(500).json({ 
      error: 'Failed to fetch room details',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const searchHotels = async (req, res) => {
  const { city, checkinDate, checkoutDate, guests = 1 } = req.query;

  try {
    console.log('🔍 Search request:', { city, checkinDate, checkoutDate, guests });

    // Test the database connection first
    const [test] = await pool.execute('SELECT 1 as test');
    console.log('✅ Database connection OK');

    // Search by both hotel name AND city to be more flexible
    const query = `SELECT 
        h.id,
        h.name,
        h.address,
        h.city,
        h.state,
        h.country,
        h.rating,
        h.description,
        h.amenities
      FROM hotels h
      WHERE h.city LIKE ? OR h.name LIKE ?`;
    
    console.log('📝 Executing query:', query);
    console.log('📝 With params:', [`%${city}%`, `%${city}%`]);

    const [hotels] = await pool.execute(query, [`%${city}%`, `%${city}%`]);
    console.log(`✅ Found ${hotels.length} hotels`);

    // Parse amenities safely - handle both JSON and comma-separated strings
    const hotelsWithAmenities = hotels.map(hotel => {
      let amenities = [];
      
      try {
        // Try to parse as JSON first
        amenities = JSON.parse(hotel.amenities || '[]');
      } catch (jsonError) {
        console.log(`⚠️ Failed to parse amenities as JSON for hotel ${hotel.name}, trying comma separation`);
        
        // If JSON parsing fails, try comma separation
        if (hotel.amenities && typeof hotel.amenities === 'string') {
          amenities = hotel.amenities.split(',').map(item => item.trim());
        } else {
          amenities = [];
        }
      }
      
      return {
        ...hotel,
        amenities: amenities,
        total_rooms: 5, // Default value
        min_price: 89.99, // Default value
        max_price: 399.99 // Default value
      };
    });

    console.log('✅ Successfully processed hotels data');

    res.json({
      success: true,
      data: hotelsWithAmenities
    });

  } catch (error) {
    console.error('❌ Search hotels failed:', error);
    res.status(500).json({ 
      error: 'Failed to search hotels',
      details: error.message 
    });
  }
};
// New controller function for getting all hotels
export const getAllHotels = async (req, res) => {
  try {
    console.log('🏨 Fetching all hotels for autocomplete');

    // Test the database connection first
    const [test] = await pool.execute('SELECT 1 as test');
    console.log('✅ Database connection OK');

    const query = `SELECT 
        h.id,
        h.name,
        h.address,
        h.city,
        h.state,
        h.country,
        h.rating,
        h.amenities
      FROM hotels h
      ORDER BY h.name`;
    
    console.log('📝 Executing query:', query);

    const [hotels] = await pool.execute(query);
    console.log(`✅ Found ${hotels.length} hotels`);

    // Parse amenities safely
    const hotelsWithAmenities = hotels.map(hotel => {
      let amenities = [];
      
      try {
        amenities = JSON.parse(hotel.amenities || '[]');
      } catch (jsonError) {
        if (hotel.amenities && typeof hotel.amenities === 'string') {
          amenities = hotel.amenities.split(',').map(item => item.trim());
        }
      }
      
      return {
        ...hotel,
        amenities: amenities
      };
    });

    console.log('✅ Successfully processed all hotels data');

    res.json({
      success: true,
      data: hotelsWithAmenities
    });

  } catch (error) {
    console.error('❌ Get all hotels failed:', error);
    res.status(500).json({ 
      error: 'Failed to fetch hotels',
      details: error.message 
    });
  }
};

