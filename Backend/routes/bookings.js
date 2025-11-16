import express from 'express';
import { 
  createBooking, 
  cancelBooking, 
  getAvailableRooms,
  getUserBookings,
  getRoomDetails,
  searchHotels,
  getAllHotels
} from '../controllers/bookingController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/search/hotels', searchHotels);
router.get('/available', getAvailableRooms);
router.get('/rooms/:roomId', getRoomDetails);
router.get('/hotels/all', getAllHotels); // New endpoint for all hotels

// Protected routes (require authentication)
router.get('/my-bookings', authenticateToken, getUserBookings);
router.post('/', authenticateToken, createBooking);
router.put('/:bookingId/cancel', authenticateToken, cancelBooking);

export default router;