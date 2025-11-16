import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { bookingsService } from '../services/bookings';
import BookingSummary from '../components/booking/BookingSummary';
import PaymentForm from '../components/booking/PaymentForm';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { ArrowLeft, Shield, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const Booking = () => {
  const { roomId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [bookingData, setBookingData] = useState({
    checkinDate: searchParams.get('checkin') || '',
    checkoutDate: searchParams.get('checkout') || '',
    guestCount: parseInt(searchParams.get('guests')) || 1,
    specialRequests: '',
    paymentMethod: 'CREDIT_CARD'
  });

  useEffect(() => {
    fetchRoomDetails();
  }, [roomId]);

  const fetchRoomDetails = async () => {
    setLoading(true);
    try {
      const response = await bookingsService.getRoomDetails(roomId);
      setRoom(response.data.data);
    } catch (error) {
      console.error('Failed to fetch room details:', error);
      toast.error('Failed to load room details');
      navigate('/search');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await bookingsService.createBooking({
        roomId: parseInt(roomId),
        ...bookingData
      });

      if (response.data.success) {
        toast.success('Booking confirmed successfully!');
        navigate('/my-bookings');
      }
    } catch (error) {
      console.error('Booking failed:', error);
      const errorMessage = error.response?.data?.error || 'Booking failed. Please try again.';
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner text="Loading room details..." />
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Room not found</h2>
          <button 
            onClick={() => navigate('/search')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Back to Search
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Complete Your Booking</h1>
          <p className="text-gray-600 mt-2">
            {room.hotel_name} - {room.room_type}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Guest Information */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Guest Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Check-in Date
                    </label>
                    <input
                      type="date"
                      value={bookingData.checkinDate}
                      onChange={(e) => setBookingData({...bookingData, checkinDate: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Check-out Date
                    </label>
                    <input
                      type="date"
                      value={bookingData.checkoutDate}
                      onChange={(e) => setBookingData({...bookingData, checkoutDate: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Number of Guests
                    </label>
                    <select
                      value={bookingData.guestCount}
                      onChange={(e) => setBookingData({...bookingData, guestCount: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {[...Array(room.capacity)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1} {i + 1 === 1 ? 'Guest' : 'Guests'}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Special Requests (Optional)
                  </label>
                  <textarea
                    value={bookingData.specialRequests}
                    onChange={(e) => setBookingData({...bookingData, specialRequests: e.target.value})}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Any special requests or requirements..."
                  />
                </div>
              </div>

              {/* Payment Section */}
              <PaymentForm
                paymentMethod={bookingData.paymentMethod}
                onPaymentMethodChange={(method) => setBookingData({...bookingData, paymentMethod: method})}
              />

              {/* Security Features */}
              <div className="bg-white rounded-lg shadow-sm border border-blue-200 p-6 bg-blue-50">
                <div className="flex items-center space-x-3 mb-3">
                  <Shield className="h-6 w-6 text-blue-600" />
                  <h3 className="text-lg font-semibold text-blue-900">Secure Booking</h3>
                </div>
                <div className="space-y-2 text-sm text-blue-800">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4" />
                    <span>ACID Transaction Guarantee</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4" />
                    <span>No Double-Booking Protection</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4" />
                    <span>Instant Confirmation</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4" />
                    <span>256-bit SSL Encryption</span>
                  </div>
                </div>
              </div>

              {/* Mobile Confirm Button - Hidden on desktop */}
              <div className="lg:hidden">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-green-600 text-white py-4 px-6 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200 font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {submitting ? (
                    <LoadingSpinner size="sm" text="Processing..." />
                  ) : (
                    'Confirm Booking'
                  )}
                </button>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-8 space-y-6">
                <BookingSummary
                  room={room}
                  bookingData={bookingData}
                />
                
                {/* Desktop Confirm Button - Hidden on mobile */}
                <div className="hidden lg:block">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-green-600 text-white py-4 px-6 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200 font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg"
                  >
                    {submitting ? (
                      <LoadingSpinner size="sm" text="Processing..." />
                    ) : (
                      'Confirm Booking'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Booking;