import React from 'react';
import { Calendar, Users, DollarSign } from 'lucide-react';
import { formatCurrency, formatDate, calculateNights } from '../../utils/formatters';

const BookingSummary = ({ room, bookingData, className = '' }) => {
  const nights = calculateNights(bookingData.checkinDate, bookingData.checkoutDate);
  const subtotal = room.base_price * nights;
  const taxes = subtotal * 0.1; // 10% tax
  const total = subtotal + taxes;

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Summary</h3>
      
      {/* Room Info */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-900">{room.room_type}</h4>
        <p className="text-sm text-gray-600">Room {room.room_number} • {room.hotel_name}</p>
      </div>

      {/* Dates & Guests */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>Check-in</span>
          </div>
          <span className="text-sm font-medium text-gray-900">
            {formatDate(bookingData.checkinDate)}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>Check-out</span>
          </div>
          <span className="text-sm font-medium text-gray-900">
            {formatDate(bookingData.checkoutDate)}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Users className="h-4 w-4" />
            <span>Guests</span>
          </div>
          <span className="text-sm font-medium text-gray-900">
            {bookingData.guestCount} {bookingData.guestCount === 1 ? 'guest' : 'guests'}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>Duration</span>
          </div>
          <span className="text-sm font-medium text-gray-900">
            {nights} {nights === 1 ? 'night' : 'nights'}
          </span>
        </div>
      </div>

      {/* Price Breakdown */}
      <div className="border-t border-gray-200 pt-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">
            {formatCurrency(room.base_price)} × {nights} nights
          </span>
          <span className="font-medium">{formatCurrency(subtotal)}</span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Taxes & Fees</span>
          <span className="font-medium">{formatCurrency(taxes)}</span>
        </div>
        
        <div className="flex justify-between text-lg font-semibold text-gray-900 border-t border-gray-200 pt-2">
          <span>Total</span>
          <div className="flex items-center space-x-1">
            <DollarSign className="h-4 w-4" />
            <span>{formatCurrency(total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingSummary;