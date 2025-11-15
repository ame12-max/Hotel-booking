import React, { useState, useEffect } from 'react';
import { bookingsService } from '../services/bookings';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { Calendar, MapPin, Users, DollarSign, XCircle, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { formatCurrency, formatDate, getStatusColor, calculateNights } from '../utils/formatters';
import toast from 'react-hot-toast';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await bookingsService.getUserBookings();
      setBookings(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
      toast.error('Failed to load your bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    setCancellingId(bookingId);
    try {
      await bookingsService.cancelBooking(bookingId);
      toast.success('Booking cancelled successfully');
      // Refresh the bookings list
      fetchBookings();
    } catch (error) {
      console.error('Cancel booking failed:', error);
      toast.error(error.response?.data?.error || 'Failed to cancel booking');
    } finally {
      setCancellingId(null);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'CONFIRMED':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'PENDING':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'CANCELLED':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'COMPLETED':
        return <CheckCircle className="h-5 w-5 text-blue-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <LoadingSpinner text="Loading your bookings..." />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
          <p className="text-gray-600 mt-2">
            Manage your hotel reservations and view booking history
          </p>
        </div>

        {bookings.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
            <p className="text-gray-600 mb-6">
              You haven't made any bookings yet. Start exploring hotels to book your stay.
            </p>
            <a
              href="/search"
              className="btn-primary"
            >
              Find Hotels
            </a>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => {
              const nights = calculateNights(booking.checkin_date, booking.checkout_date);
              const isUpcoming = new Date(booking.checkin_date) > new Date();
              const canCancel = booking.status === 'CONFIRMED' && isUpcoming;

              return (
                <div key={booking.id} className="card p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                    {/* Booking Details */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">
                            {booking.room_type} - Room {booking.room_number}
                          </h3>
                          <div className="flex items-center space-x-1 text-gray-600 mt-1">
                            <MapPin className="h-4 w-4" />
                            <span>{booking.hotel_name}, {booking.hotel_city}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(booking.status)}
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                            {booking.status}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        <div className="flex items-center space-x-2 text-sm">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <div>
                            <div className="font-medium">Check-in</div>
                            <div className="text-gray-600">{formatDate(booking.checkin_date)}</div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 text-sm">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <div>
                            <div className="font-medium">Check-out</div>
                            <div className="text-gray-600">{formatDate(booking.checkout_date)}</div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 text-sm">
                          <Users className="h-4 w-4 text-gray-400" />
                          <div>
                            <div className="font-medium">Guests</div>
                            <div className="text-gray-600">{booking.guest_count}</div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 text-sm">
                          <DollarSign className="h-4 w-4 text-gray-400" />
                          <div>
                            <div className="font-medium">Total</div>
                            <div className="text-gray-600">{formatCurrency(booking.total_price)}</div>
                          </div>
                        </div>
                      </div>

                      {booking.special_requests && (
                        <div className="mb-4">
                          <div className="text-sm font-medium text-gray-700 mb-1">Special Requests:</div>
                          <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                            {booking.special_requests}
                          </p>
                        </div>
                      )}

                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Booking ID:</span> #{booking.id}
                        </div>
                        <div>
                          <span className="font-medium">Transaction:</span> {booking.transaction_ref}
                        </div>
                        <div>
                          <span className="font-medium">Payment:</span> 
                          <span className={`ml-1 ${booking.payment_status === 'SUCCESS' ? 'text-green-600' : 'text-red-600'}`}>
                            {booking.payment_status}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col space-y-3 lg:w-48">
                      {canCancel && (
                        <button
                          onClick={() => handleCancelBooking(booking.id)}
                          disabled={cancellingId === booking.id}
                          className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {cancellingId === booking.id ? 'Cancelling...' : 'Cancel Booking'}
                        </button>
                      )}

                      <div className="text-center text-sm text-gray-500">
                        Booked on {formatDate(booking.created_at)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;