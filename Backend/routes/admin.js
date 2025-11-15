import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import pool from '../config/database.js';

const router = express.Router();

// All admin routes require authentication
router.use(authenticateToken);

// Middleware to check if user is admin
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

// Get all hotels (admin only)
// routes/admin.js - Fixed hotels endpoint
router.get('/hotels', requireAdmin, async (req, res) => {
  try {
    const [hotels] = await pool.execute(`
      SELECT 
        h.*,
        COUNT(r.id) as room_count
      FROM hotels h
      LEFT JOIN rooms r ON h.id = r.hotel_id
      GROUP BY h.id
      ORDER BY h.created_at DESC
    `);

    // Parse amenities that could be JSON arrays or comma-separated strings
    const hotelsWithAmenities = hotels.map(hotel => {
      let amenities = [];
      
      if (hotel.amenities) {
        try {
          // First try to parse as JSON
          amenities = JSON.parse(hotel.amenities);
        } catch (jsonError) {
          try {
            // If JSON parsing fails, try splitting by comma
            if (typeof hotel.amenities === 'string') {
              amenities = hotel.amenities.split(',').map(item => item.trim()).filter(item => item.length > 0);
            }
          } catch (splitError) {
            console.error(`Failed to parse amenities for hotel ${hotel.name}:`, splitError);
            amenities = [];
          }
        }
      }
      
      return {
        ...hotel,
        amenities: amenities
      };
    });

    res.json({
      success: true,
      data: hotelsWithAmenities
    });

  } catch (error) {
    console.error('Get hotels failed:', error);
    res.status(500).json({ error: 'Failed to fetch hotels' });
  }
});

// Also fix the room types endpoint
router.get('/room-types', requireAdmin, async (req, res) => {
  try {
    const [roomTypes] = await pool.execute(`
      SELECT * FROM room_types ORDER BY created_at DESC
    `);

    // Parse amenities that could be JSON arrays or comma-separated strings
    const roomTypesWithAmenities = roomTypes.map(roomType => {
      let amenities = [];
      
      if (roomType.amenities) {
        try {
          amenities = JSON.parse(roomType.amenities);
        } catch (jsonError) {
          try {
            if (typeof roomType.amenities === 'string') {
              amenities = roomType.amenities.split(',').map(item => item.trim()).filter(item => item.length > 0);
            }
          } catch (splitError) {
            console.error(`Failed to parse room type amenities:`, splitError);
            amenities = [];
          }
        }
      }
      
      return {
        ...roomType,
        amenities: amenities
      };
    });

    res.json({
      success: true,
      data: roomTypesWithAmenities
    });

  } catch (error) {
    console.error('Get room types failed:', error);
    res.status(500).json({ error: 'Failed to fetch room types' });
  }
});

// Get all rooms (admin only)
router.get('/rooms', requireAdmin, async (req, res) => {
  try {
    const [rooms] = await pool.execute(`
      SELECT 
        r.*,
        h.name as hotel_name,
        rt.name as room_type_name,
        rt.base_price,
        rt.capacity
      FROM rooms r
      JOIN hotels h ON r.hotel_id = h.id
      JOIN room_types rt ON r.room_type_id = rt.id
      ORDER BY h.name, r.room_number
    `);

    res.json({
      success: true,
      data: rooms
    });

  } catch (error) {
    console.error('Get rooms failed:', error);
    res.status(500).json({ error: 'Failed to fetch rooms' });
  }
});

// Update room status (admin only)
router.put('/rooms/:roomId/status', requireAdmin, async (req, res) => {
  const { roomId } = req.params;
  const { status } = req.body;

  const validStatuses = ['AVAILABLE', 'OCCUPIED', 'MAINTENANCE', 'CLEANING'];
  
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  try {
    await pool.execute(
      'UPDATE rooms SET status = ? WHERE id = ?',
      [status, roomId]
    );

    // Log the action
    await pool.execute(
      `INSERT INTO transaction_log (user_id, action, table_name, record_id, details)
       VALUES (?, 'ROOM_STATUS_UPDATED', 'rooms', ?, ?)`,
      [req.user.id, roomId, `Room ${roomId} status updated to ${status}`]
    );

    res.json({
      success: true,
      message: 'Room status updated successfully'
    });

  } catch (error) {
    console.error('Update room status failed:', error);
    res.status(500).json({ error: 'Failed to update room status' });
  }
});

// Update booking status (admin only)
router.put('/bookings/:bookingId/status', requireAdmin, async (req, res) => {
  const { bookingId } = req.params;
  const { status } = req.body;

  const validStatuses = ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED', 'FAILED'];
  
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    // Get current booking details
    const [bookings] = await conn.execute(
      'SELECT room_id FROM bookings WHERE id = ?',
      [bookingId]
    );

    if (bookings.length === 0) {
      await conn.rollback();
      return res.status(404).json({ error: 'Booking not found' });
    }

    const roomId = bookings[0].room_id;

    // Update booking status
    await conn.execute(
      'UPDATE bookings SET status = ? WHERE id = ?',
      [status, bookingId]
    );

    // Update room status based on booking status
    let roomStatus = 'AVAILABLE';
    if (status === 'CONFIRMED') {
      roomStatus = 'OCCUPIED';
    } else if (status === 'MAINTENANCE') {
      roomStatus = 'MAINTENANCE';
    }

    await conn.execute(
      'UPDATE rooms SET status = ? WHERE id = ?',
      [roomStatus, roomId]
    );

    // Log the action
    await conn.execute(
      `INSERT INTO transaction_log (booking_id, user_id, action, table_name, record_id, details)
       VALUES (?, ?, 'BOOKING_STATUS_UPDATED', 'bookings', ?, ?)`,
      [bookingId, req.user.id, bookingId, `Booking ${bookingId} status updated to ${status}`]
    );

    await conn.commit();

    res.json({
      success: true,
      message: 'Booking status updated successfully'
    });

  } catch (error) {
    await conn.rollback();
    console.error('Update booking status failed:', error);
    res.status(500).json({ error: 'Failed to update booking status' });
  } finally {
    conn.release();
  }
});

// Get all bookings (admin only)
router.get('/bookings', requireAdmin, async (req, res) => {
  try {
    const [bookings] = await pool.execute(`
      SELECT 
        b.id, b.checkin_date, b.checkout_date, b.total_price, b.status,
        b.guest_count, b.special_requests, b.created_at,
        u.name as user_name, u.email as user_email, u.phone as user_phone,
        r.room_number, r.floor,
        rt.name as room_type, rt.capacity,
        h.name as hotel_name, h.city as hotel_city,
        p.status as payment_status, p.transaction_ref, p.amount as payment_amount
      FROM bookings b
      JOIN users u ON b.user_id = u.id
      JOIN rooms r ON b.room_id = r.id
      JOIN room_types rt ON r.room_type_id = rt.id
      JOIN hotels h ON r.hotel_id = h.id
      LEFT JOIN payments p ON b.id = p.booking_id
      ORDER BY b.created_at DESC
    `);

    res.json({
      success: true,
      data: bookings,
      count: bookings.length
    });

  } catch (error) {
    console.error('Get bookings failed:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// Get transaction logs (admin only)
router.get('/transaction-logs', requireAdmin, async (req, res) => {
  const { page = 1, limit = 50 } = req.query;
  const offset = (page - 1) * limit;

  try {
    const [logs] = await pool.execute(`
      SELECT 
        tl.*,
        u.name as user_name,
        b.id as booking_id
      FROM transaction_log tl
      LEFT JOIN users u ON tl.user_id = u.id
      LEFT JOIN bookings b ON tl.booking_id = b.id
      ORDER BY tl.created_at DESC
      LIMIT ? OFFSET ?
    `, [parseInt(limit), offset]);

    const [total] = await pool.execute('SELECT COUNT(*) as total FROM transaction_log');

    res.json({
      success: true,
      data: logs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: total[0].total
      }
    });

  } catch (error) {
    console.error('Get transaction logs failed:', error);
    res.status(500).json({ error: 'Failed to fetch transaction logs' });
  }
});

// Add new hotel (admin only)
router.post('/hotels', requireAdmin, async (req, res) => {
  const {
    name,
    address,
    city,
    state,
    country,
    zip_code,
    rating,
    description,
    amenities = []
  } = req.body;

  try {
    const [result] = await pool.execute(
      `INSERT INTO hotels (name, address, city, state, country, zip_code, rating, description, amenities)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, address, city, state, country, zip_code, rating, description, JSON.stringify(amenities)]
    );

    // Log the action
    await pool.execute(
      `INSERT INTO transaction_log (user_id, action, table_name, record_id, details)
       VALUES (?, 'HOTEL_CREATED', 'hotels', ?, ?)`,
      [req.user.id, result.insertId, `Admin created hotel: ${name}`]
    );

    res.status(201).json({
      success: true,
      hotelId: result.insertId,
      message: 'Hotel created successfully'
    });

  } catch (error) {
    console.error('Add hotel failed:', error);
    res.status(500).json({ error: 'Failed to add hotel' });
  }
});

// Add new room type (admin only)
router.post('/room-types', requireAdmin, async (req, res) => {
  const {
    name,
    description,
    capacity,
    base_price,
    amenities = [],
    size_sqft,
    bed_type
  } = req.body;

  try {
    const [result] = await pool.execute(
      `INSERT INTO room_types (name, description, capacity, base_price, amenities, size_sqft, bed_type)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [name, description, capacity, base_price, JSON.stringify(amenities), size_sqft, bed_type]
    );

    await pool.execute(
      `INSERT INTO transaction_log (user_id, action, table_name, record_id, details)
       VALUES (?, 'ROOM_TYPE_CREATED', 'room_types', ?, ?)`,
      [req.user.id, result.insertId, `Admin created room type: ${name}`]
    );

    res.status(201).json({
      success: true,
      roomTypeId: result.insertId,
      message: 'Room type created successfully'
    });

  } catch (error) {
    console.error('Add room type failed:', error);
    res.status(500).json({ error: 'Failed to add room type' });
  }
});

// Add new room (admin only)
router.post('/rooms', requireAdmin, async (req, res) => {
  const {
    hotel_id,
    room_type_id,
    room_number,
    floor = 1
  } = req.body;

  try {
    const [result] = await pool.execute(
      `INSERT INTO rooms (hotel_id, room_type_id, room_number, floor)
       VALUES (?, ?, ?, ?)`,
      [hotel_id, room_type_id, room_number, floor]
    );

    await pool.execute(
      `INSERT INTO transaction_log (user_id, action, table_name, record_id, details)
       VALUES (?, 'ROOM_CREATED', 'rooms', ?, ?)`,
      [req.user.id, result.insertId, `Admin created room: ${room_number}`]
    );

    res.status(201).json({
      success: true,
      roomId: result.insertId,
      message: 'Room created successfully'
    });

  } catch (error) {
    console.error('Add room failed:', error);
    res.status(500).json({ error: 'Failed to add room' });
  }
});

// Get system statistics (admin only)
router.get('/stats', requireAdmin, async (req, res) => {
  try {
    const [
      [totalBookings],
      [totalUsers],
      [totalHotels],
      [revenue],
      [recentBookings]
    ] = await Promise.all([
      pool.execute('SELECT COUNT(*) as count FROM bookings'),
      pool.execute('SELECT COUNT(*) as count FROM users'),
      pool.execute('SELECT COUNT(*) as count FROM hotels'),
      pool.execute('SELECT COALESCE(SUM(amount), 0) as total FROM payments WHERE status = "SUCCESS"'),
      pool.execute(`
        SELECT COUNT(*) as count 
        FROM bookings 
        WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
      `)
    ]);

    res.json({
      success: true,
      stats: {
        totalBookings: totalBookings[0].count,
        totalUsers: totalUsers[0].count,
        totalHotels: totalHotels[0].count,
        totalRevenue: revenue[0].total,
        recentBookings: recentBookings[0].count
      }
    });

  } catch (error) {
    console.error('Get stats failed:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

export default router;