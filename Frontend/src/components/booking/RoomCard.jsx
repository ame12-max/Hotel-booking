import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Users, Square, Bed, Wifi, Coffee, Car, Tv } from 'lucide-react';
import { formatCurrency, getStatusColor } from '../../utils/formatters';

const RoomCard = ({ room, searchParams }) => {
  const {
    id,
    room_number,
    floor,
    room_type,
    description,
    capacity,
    base_price,
    amenities,
    size_sqft,
    bed_type,
    hotel_name,
    hotel_rating
  } = room;

  const amenityIcons = {
    'WiFi': Wifi,
    'Coffee Maker': Coffee,
    'TV': Tv,
    'Parking': Car,
    'Pool': Coffee, // Using Coffee as placeholder
    'Spa': Coffee,
    'Gym': Coffee,
    'Restaurant': Coffee
  };

  const nights = Math.ceil(
    (new Date(searchParams.checkoutDate) - new Date(searchParams.checkinDate)) / (1000 * 60 * 60 * 24)
  );
  const totalPrice = base_price * nights;

  return (
    <div className="card p-6 hover:shadow-lg transition-shadow duration-300">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Room Image Placeholder */}
        <div className="lg:w-1/3">
          <div className="bg-gray-200 rounded-lg h-48 lg:h-full flex items-center justify-center">
            <div className="text-center text-gray-500">
              <Bed className="h-12 w-12 mx-auto mb-2" />
              <span>Room {room_number}</span>
            </div>
          </div>
        </div>

        {/* Room Details */}
        <div className="lg:w-2/3">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">{room_type}</h3>
              <p className="text-gray-600">Room {room_number} • Floor {floor}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(base_price)}
                <span className="text-sm font-normal text-gray-600">/night</span>
              </div>
              <div className="text-sm text-gray-600">
                {formatCurrency(totalPrice)} for {nights} nights
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4 mb-4 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <Users className="h-4 w-4" />
              <span>{capacity} guests</span>
            </div>
            <div className="flex items-center space-x-1">
              <Square className="h-4 w-4" />
              <span>{size_sqft} sq ft</span>
            </div>
            <div className="flex items-center space-x-1">
              <Bed className="h-4 w-4" />
              <span>{bed_type}</span>
            </div>
          </div>

          <p className="text-gray-700 mb-4 line-clamp-2">{description}</p>

          {/* Amenities */}
          <div className="flex flex-wrap gap-2 mb-4">
            {amenities && amenities.slice(0, 4).map((amenity, index) => {
              const IconComponent = amenityIcons[amenity] || Coffee;
              return (
                <div
                  key={index}
                  className="flex items-center space-x-1 bg-gray-100 px-2 py-1 rounded text-xs text-gray-700"
                >
                  <IconComponent className="h-3 w-3" />
                  <span>{amenity}</span>
                </div>
              );
            })}
            {amenities && amenities.length > 4 && (
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                +{amenities.length - 4} more
              </span>
            )}
          </div>

          {/* Hotel Info */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="font-medium text-gray-900">{hotel_name}</p>
              <div className="flex items-center space-x-1 text-sm text-gray-600">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span>{hotel_rating}</span>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <Link
            to={`/booking/${id}?checkin=${searchParams.checkinDate}&checkout=${searchParams.checkoutDate}&guests=${searchParams.guests}`}
            className="w-full bg-blue-600 text-white text-center py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 font-semibold block"
          >
            Book Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;