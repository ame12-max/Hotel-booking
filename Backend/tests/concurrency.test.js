import pool from '../config/database.js';

const simulateConcurrentBookings = async () => {
  const testRoomId = 1;
  const testUserId = 2;
  const testDates = {
    checkinDate: '2024-01-15',
    checkoutDate: '2024-01-20'
  };

  console.log('Starting concurrency test...');
  console.log(`Testing room ${testRoomId} for dates ${testDates.checkinDate} to ${testDates.checkoutDate}`);

  // Simulate 5 concurrent booking attempts
  const promises = Array(5).fill().map((_, index) => 
    new Promise(async (resolve) => {
      const conn = await pool.getConnection();
      
      try {
        await conn.beginTransaction();

        // Lock room
        const [room] = await conn.execute(
          'SELECT id FROM rooms WHERE id = ? FOR UPDATE',
          [testRoomId]
        );

        if (room.length === 0) {
          await conn.rollback();
          resolve({ success: false, error: 'Room not found', attempt: index + 1 });
          return;
        }

        // Check overlap
        const [overlap] = await conn.execute(
          `SELECT COUNT(*) as overlap_count 
           FROM bookings 
           WHERE room_id = ? 
           AND status IN ('PENDING', 'CONFIRMED')
           AND NOT (? <= checkout_date OR ? >= checkin_date)`,
          [testRoomId, testDates.checkoutDate, testDates.checkinDate]
        );

        if (overlap[0].overlap_count > 0) {
          await conn.rollback();
          resolve({ success: false, error: 'Room already booked', attempt: index + 1 });
          return;
        }

        // Create booking
        const [bookingResult] = await conn.execute(
          `INSERT INTO bookings (user_id, room_id, checkin_date, checkout_date, total_price, status)
           VALUES (?, ?, ?, ?, 500.00, 'CONFIRMED')`,
          [testUserId, testRoomId, testDates.checkinDate, testDates.checkoutDate]
        );

        // Create payment
        await conn.execute(
          `INSERT INTO payments (booking_id, amount, method, status, transaction_ref)
           VALUES (?, 500.00, 'CREDIT_CARD', 'SUCCESS', ?)`,
          [bookingResult.insertId, `TEST-TXN-${Date.now()}-${index}`]
        );

        // Update room
        await conn.execute(
          'UPDATE rooms SET status = "OCCUPIED" WHERE id = ?',
          [testRoomId]
        );

        await conn.commit();
        resolve({ success: true, bookingId: bookingResult.insertId, attempt: index + 1 });

      } catch (error) {
        await conn.rollback();
        resolve({ success: false, error: error.message, attempt: index + 1 });
      } finally {
        conn.release();
      }
    })
  );

  const results = await Promise.all(promises);
  
  console.log('\n=== CONCURRENCY TEST RESULTS ===');
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  
  console.log(`Total attempts: ${results.length}`);
  console.log(`Successful bookings: ${successful.length}`);
  console.log(`Failed bookings: ${failed.length}`);
  
  successful.forEach(result => {
    console.log(`✓ Attempt ${result.attempt}: SUCCESS (Booking ID: ${result.bookingId})`);
  });
  
  failed.forEach(result => {
    console.log(`✗ Attempt ${result.attempt}: FAILED - ${result.error}`);
  });

  // Cleanup test data
  const cleanupConn = await pool.getConnection();
  try {
    await cleanupConn.execute('DELETE FROM payments WHERE transaction_ref LIKE "TEST-TXN-%"');
    await cleanupConn.execute('DELETE FROM bookings WHERE id IN (SELECT booking_id FROM transaction_log WHERE details LIKE "%TEST%")');
    await cleanupConn.execute('UPDATE rooms SET status = "AVAILABLE" WHERE id = ?', [testRoomId]);
    console.log('\nTest data cleaned up successfully');
  } finally {
    cleanupConn.release();
  }
};

// Run the test
simulateConcurrentBookings().catch(console.error);