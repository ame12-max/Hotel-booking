import express from 'express';
import { 
  createBooking, 
  cancelBooking, 
  getAvailableRooms,
  getUserBookings,
  getRoomDetails,
  searchHotels  // Add this import
} from '../controllers/bookingController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/search/hotels', searchHotels);
router.get('/available', getAvailableRooms);
router.get('/rooms/:roomId', getRoomDetails);

// Protected routes (require authentication)
router.get('/my-bookings', authenticateToken, getUserBookings);
router.post('/', authenticateToken, createBooking);
router.put('/:bookingId/cancel', authenticateToken, cancelBooking);

export default router;