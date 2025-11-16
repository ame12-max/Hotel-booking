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

  // Get current search parameters
  const getSearchParams = () => {
    const city = searchParams.get('city') || '';
    const checkinDate = searchParams.get('checkinDate') || '';
    const checkoutDate = searchParams.get('checkoutDate') || '';
    const guests = parseInt(searchParams.get('guests')) || 1;

    console.log('Current URL params:', { city, checkinDate, checkoutDate, guests });
    return { city, checkinDate, checkoutDate, guests };
  };

  // Load initial search when component mounts
  useEffect(() => {
    const params = getSearchParams();
    console.log('Component mounted with params:', params);
    
    if (params.city) {
      console.log('Initial search triggered with city:', params.city);
      handleSearch(params);
    } else {
      console.log('No city parameter found, waiting for user search');
    }
  }, [searchParams]);

  const handleSearch = async (searchData) => {
    console.log('handleSearch called with:', searchData);
    setLoading(true);
    setSelectedHotel(null);
    setAvailableRooms([]);
    setHotels([]);

    try {
      // Search for hotels
      console.log('Calling searchHotels API...');
      const hotelsResponse = await bookingsService.searchHotels(searchData);
      console.log('Hotels API response:', hotelsResponse);
      
      const hotelsData = hotelsResponse.data.data || hotelsResponse.data || [];
      console.log('Processed hotels data:', hotelsData);
      setHotels(hotelsData);
      
      if (hotelsData.length === 0) {
        toast.error('No hotels found for your search criteria');
      } else {
        toast.success(`Found ${hotelsData.length} hotels`);
      }
    } catch (error) {
      console.error('Search failed:', error);
      console.error('Error details:', error.response?.data);
      toast.error(error.response?.data?.error || 'Failed to search hotels');
    } finally {
      setLoading(false);
    }
  };

  const handleHotelSelect = async (hotel) => {
    console.log('Hotel selected:', hotel);
    setSelectedHotel(hotel);
    setLoading(true);
    setAvailableRooms([]);

    try {
      const params = getSearchParams();
      console.log('Fetching rooms for hotel:', hotel.id, 'with dates:', params.checkinDate, params.checkoutDate);
      
      const roomsResponse = await bookingsService.getAvailableRooms({
        hotelId: hotel.id,
        checkinDate: params.checkinDate,
        checkoutDate: params.checkoutDate
      });
      
      console.log('Rooms API response:', roomsResponse);
      const roomsData = roomsResponse.data.data || roomsResponse.data || [];
      console.log('Processed rooms data:', roomsData);
      setAvailableRooms(roomsData);
      
      if (roomsData.length === 0) {
        toast.error('No available rooms found for selected dates');
      } else {
        toast.success(`Found ${roomsData.length} available rooms`);
      }
    } catch (error) {
      console.error('Failed to fetch rooms:', error);
      console.error('Error details:', error.response?.data);
      toast.error(error.response?.data?.error || 'Failed to fetch available rooms');
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

  // Get current search params for RoomCard
  const currentSearchParams = getSearchParams();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Form */}
        <div className="mb-8">
          <SearchForm 
            onSearch={handleSearch} 
            initialValues={currentSearchParams}
          />
        </div>

        {loading && <LoadingSpinner text="Searching..." />}

        {/* Results */}
        {!selectedHotel ? (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {hotels.length > 0 ? `Found ${hotels.length} Hotels` : 'Search for Hotels'}
            </h2>
            <div className="text-sm text-gray-600">
                      {hotels.length || 'Multiple'} Hotels are available
                    </div>
                    {console.log("the hotels data" + hotels)}
            {console.log('Hotels state:', hotels)}
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hotels.map(hotel => (
                <div key={hotel.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-300 cursor-pointer">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
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
                      <span>{hotel.rating || 'N/A'}</span>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {hotel.description || 'No description available'}
                  </p>

                  <div className="flex items-center justify-between mb-4">
                    <div className="text-sm text-gray-600">
                      {filteredRooms.length || 'Multiple'} rooms available
                    </div>
                    <div className="text-lg font-semibold text-green-600">
                      {hotel.min_price ? `From Birr ${hotel.min_price}` : 'Prices vary'}
                    </div>
                  </div>

                  <button
                    onClick={() => handleHotelSelect(hotel)}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                  >
                    View Rooms
                  </button>
                </div>
              ))}
            </div>

            {hotels.length === 0 && !loading && currentSearchParams.city && (
              <div className="text-center py-12">
                <Hotel className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No hotels found</h3>
                <p className="text-gray-600">
                  No hotels found for "{currentSearchParams.city}". Try a different city or search criteria.
                </p>
              </div>
            )}

            {!currentSearchParams.city && !loading && (
              <div className="text-center py-12">
                <Hotel className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Search for Hotels</h3>
                <p className="text-gray-600">
                  Enter a city and dates to find available hotels.
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
              
              <div className="text-center">
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
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Min Price
                    </label>
                    <input
                      type="number"
                      value={filters.minPrice}
                      onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
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
                {console.log('Filtered rooms:', filteredRooms)}
                {filteredRooms.map(room => (
                  <RoomCard
                    key={room.id}
                    room={room}
                    searchParams={currentSearchParams}
                  />
                ))}
              </div>
            )}

            {filteredRooms.length === 0 && !loading && (
              <div className="text-center py-12">
                <Hotel className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {availableRooms.length === 0 ? 'No rooms available' : 'No rooms match your filters'}
                </h3>
                <p className="text-gray-600 mb-4">
                  {availableRooms.length === 0 
                    ? 'There are no available rooms for the selected dates at this hotel.'
                    : 'Try adjusting your filters to see more rooms.'
                  }
                </p>
                {availableRooms.length === 0 ? (
                  <button
                    onClick={() => setSelectedHotel(null)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Back to Hotels
                  </button>
                ) : (
                  <button
                    onClick={() => setFilters({
                      minPrice: '',
                      maxPrice: '',
                      roomType: '',
                      capacity: ''
                    })}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;