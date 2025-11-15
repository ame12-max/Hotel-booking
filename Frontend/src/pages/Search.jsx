import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { bookingsService } from '../services/bookings';
import SearchForm from '../components/common/SearchForm';
import RoomCard from '../components/booking/RoomCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { Filter, X, Hotel, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';

const Search = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [hotels, setHotels] = useState([]);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    roomType: '',
    capacity: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  const initialSearchParams = {
    city: searchParams.get('city') || '',
    checkinDate: searchParams.get('checkinDate') || '',
    checkoutDate: searchParams.get('checkoutDate') || '',
    guests: parseInt(searchParams.get('guests')) || 1
  };

  useEffect(() => {
    if (initialSearchParams.city) {
      handleSearch(initialSearchParams);
    }
  }, []);

  const handleSearch = async (searchParams) => {
    setLoading(true);
    setSelectedHotel(null);
    setAvailableRooms([]);

    try {
      // Search for hotels
      const hotelsResponse = await bookingsService.searchHotels(searchParams);
      setHotels(hotelsResponse.data.data || []);
      
      if (hotelsResponse.data.data.length === 0) {
        toast.error('No hotels found for your search criteria');
      }
    } catch (error) {
      console.error('Search failed:', error);
      toast.error('Failed to search hotels');
    } finally {
      setLoading(false);
    }
  };

  const handleHotelSelect = async (hotel) => {
    setSelectedHotel(hotel);
    setLoading(true);

    try {
      const roomsResponse = await bookingsService.getAvailableRooms({
        hotelId: hotel.id,
        checkinDate: initialSearchParams.checkinDate,
        checkoutDate: initialSearchParams.checkoutDate
      });
      setAvailableRooms(roomsResponse.data.data || []);
      
      if (roomsResponse.data.data.length === 0) {
        toast.error('No available rooms found for selected dates');
      }
    } catch (error) {
      console.error('Failed to fetch rooms:', error);
      toast.error('Failed to fetch available rooms');
    } finally {
      setLoading(false);
    }
  };

  const filteredRooms = availableRooms.filter(room => {
    if (filters.minPrice && room.base_price < parseFloat(filters.minPrice)) return false;
    if (filters.maxPrice && room.base_price > parseFloat(filters.maxPrice)) return false;
    if (filters.roomType && room.room_type !== filters.roomType) return false;
    if (filters.capacity && room.capacity < parseInt(filters.capacity)) return false;
    return true;
  });

  const roomTypes = [...new Set(availableRooms.map(room => room.room_type))];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Form */}
        <div className="mb-8">
          <SearchForm 
            onSearch={handleSearch} 
            initialValues={initialSearchParams}
          />
        </div>

        {loading && <LoadingSpinner text="Searching..." />}

        {/* Results */}
        {!selectedHotel ? (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Found {hotels.length} Hotels
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hotels.map(hotel => (
                <div key={hotel.id} className="card p-6 hover:shadow-lg transition-shadow duration-300 cursor-pointer">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {hotel.name}
                      </h3>
                      <div className="flex items-center space-x-1 text-gray-600 mb-2">
                        <MapPin className="h-4 w-4" />
                        <span className="text-sm">{hotel.city}, {hotel.country}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                      <span>★</span>
                      <span>{hotel.rating}</span>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {hotel.description}
                  </p>

                  <div className="flex items-center justify-between mb-4">
                    <div className="text-sm text-gray-600">
                      {hotel.total_rooms} rooms available
                    </div>
                    <div className="text-lg font-semibold text-green-600">
                      From {hotel.min_price ? `$${hotel.min_price}` : 'N/A'}
                    </div>
                  </div>

                  <button
                    onClick={() => handleHotelSelect(hotel)}
                    className="w-full btn-primary py-2"
                  >
                    View Rooms
                  </button>
                </div>
              ))}
            </div>

            {hotels.length === 0 && !loading && (
              <div className="text-center py-12">
                <Hotel className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No hotels found</h3>
                <p className="text-gray-600">
                  Try adjusting your search criteria or browse different dates.
                </p>
              </div>
            )}
          </div>
        ) : (
          <div>
            {/* Back button and hotel info */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => setSelectedHotel(null)}
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
              >
                <X className="h-4 w-4" />
                <span>Back to hotels</span>
              </button>
              
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedHotel.name}
                </h2>
                <p className="text-gray-600">{selectedHotel.address}</p>
              </div>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Filter className="h-4 w-4" />
                <span>Filters</span>
              </button>
            </div>

            {/* Filters */}
            {showFilters && (
              <div className="card p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Min Price
                    </label>
                    <input
                      type="number"
                      value={filters.minPrice}
                      onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
                      className="input-field"
                      placeholder="0"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Max Price
                    </label>
                    <input
                      type="number"
                      value={filters.maxPrice}
                      onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
                      className="input-field"
                      placeholder="1000"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Room Type
                    </label>
                    <select
                      value={filters.roomType}
                      onChange={(e) => setFilters({...filters, roomType: e.target.value})}
                      className="input-field"
                    >
                      <option value="">All Types</option>
                      {roomTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Min Capacity
                    </label>
                    <select
                      value={filters.capacity}
                      onChange={(e) => setFilters({...filters, capacity: e.target.value})}
                      className="input-field"
                    >
                      <option value="">Any</option>
                      <option value="1">1 Guest</option>
                      <option value="2">2 Guests</option>
                      <option value="3">3 Guests</option>
                      <option value="4">4+ Guests</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 mt-4">
                  <button
                    onClick={() => setFilters({
                      minPrice: '',
                      maxPrice: '',
                      roomType: '',
                      capacity: ''
                    })}
                    className="btn-secondary"
                  >
                    Reset
                  </button>
                </div>
              </div>
            )}

            {/* Available Rooms */}
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Available Rooms ({filteredRooms.length})
            </h3>

            {loading ? (
              <LoadingSpinner text="Loading rooms..." />
            ) : (
              <div className="space-y-6">
                {filteredRooms.map(room => (
                  <RoomCard
                    key={room.id}
                    room={room}
                    searchParams={initialSearchParams}
                  />
                ))}
              </div>
            )}

            {filteredRooms.length === 0 && !loading && (
              <div className="text-center py-12">
                <Hotel className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No rooms available
                </h3>
                <p className="text-gray-600 mb-4">
                  No rooms match your current filters for the selected dates.
                </p>
                <button
                  onClick={() => setFilters({
                    minPrice: '',
                    maxPrice: '',
                    roomType: '',
                    capacity: ''
                  })}
                  className="btn-primary"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;