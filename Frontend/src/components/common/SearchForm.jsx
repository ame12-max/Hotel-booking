import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Star, Hotel, ChevronDown, ChevronUp } from 'lucide-react';

const SearchForm = ({ onSearch, initialValues = {}, className = '' }) => {
  const [searchParams, setSearchParams] = useState({
    city: initialValues.city || '',
  });

  const [allHotels, setAllHotels] = useState([]);
  const [filteredHotels, setFilteredHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSearchSection, setShowSearchSection] = useState(true);
  const inputRef = useRef(null);

  // Fetch all hotels data when component mounts
  useEffect(() => {
    fetchAllHotels();
  }, []);

  const fetchAllHotels = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/bookings/hotels/all');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch hotels: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setAllHotels(data.data);
        setFilteredHotels(data.data); // Initially show all hotels
        console.log(`✅ Loaded ${data.data.length} hotels`);
      }
    } catch (error) {
      console.error('❌ Failed to fetch hotels:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter hotels based on search input
  const handleSearchChange = (value) => {
    setSearchParams({ city: value });
    
    if (value.trim() === '') {
      // If search is empty, show all hotels
      setFilteredHotels(allHotels);
    } else {
      // Filter hotels by city or name
      const filtered = allHotels.filter(hotel => 
        hotel.city?.toLowerCase().includes(value.toLowerCase()) ||
        hotel.name?.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredHotels(filtered);
    }
  };

  const handleHotelSelect = (hotel) => {
    setSearchParams({ city: hotel.city });
    
    // Hide search section when hotel is selected
    setShowSearchSection(false);
    
    // Trigger search with selected hotel's city
    onSearch({
      city: hotel.city
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!searchParams.city.trim()) {
      alert('Please enter a city or hotel name');
      return;
    }

    // Hide search section when form is submitted
    setShowSearchSection(false);
    
    onSearch({
      city: searchParams.city
    });
  };

  const toggleSearchSection = () => {
    setShowSearchSection(!showSearchSection);
  };

  const handleBackToSearch = () => {
    setShowSearchSection(true);
    setSearchParams({ city: '' });
    setFilteredHotels(allHotels);
  };

  return (
    <div className={`bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 ${className}`}>
      {/* Search Section - Collapsible */}
      {showSearchSection ? (
        <>
          {/* Header with toggle button */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Find Your Perfect Stay</h2>
            <button
              onClick={toggleSearchSection}
              className="flex items-center text-gray-500 hover:text-gray-700"
            >
              <span className="text-sm mr-2">Minimize</span>
              <ChevronUp className="h-4 w-4" />
            </button>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSubmit}>
            <div className="relative">
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                📍 Search Hotels by City or Name
              </label>
              <div className="relative" ref={inputRef}>
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
                <input
                  type="text"
                  value={searchParams.city}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500 bg-white text-lg font-medium transition-all duration-300 hover:border-blue-300"
                  placeholder="Enter city name or hotel name..."
                />
                
                {/* Loading Indicator */}
                {loading && (
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-4 px-6 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-bold text-lg"
              >
                🔍 Search Hotels
              </button>
            </div>
          </form>

          {/* Hotels List */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                {searchParams.city ? `Hotels in "${searchParams.city}"` : 'All Available Hotels'}
              </h3>
              <span className="text-sm text-gray-500">
                {filteredHotels.length} {filteredHotels.length === 1 ? 'hotel' : 'hotels'} found
              </span>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-gray-600">Loading hotels...</span>
              </div>
            ) : filteredHotels.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Hotel className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                <p>No hotels found matching your search</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                {filteredHotels.map((hotel) => (
                  <div
                    key={hotel.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200 cursor-pointer bg-white"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-gray-900 text-sm line-clamp-2 flex-1">
                        {hotel.name}
                      </h4>
                      <div className="flex items-center ml-2">
                        <Star className="h-3 w-3 text-yellow-400 fill-current" />
                        <span className="text-xs text-gray-600 ml-1">{hotel.rating}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center text-xs text-gray-500 mb-1">
                      <MapPin className="h-3 w-3 mr-1" />
                      <span className="line-clamp-1">{hotel.city}</span>
                    </div>
                    
                    <div className="text-xs text-gray-500 line-clamp-2">
                      {hotel.address}
                    </div>

                    <div className="mt-3">
                      <button
                        onClick={() => handleHotelSelect(hotel)}
                        className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-200"
                      >
                        View Rooms
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Search Suggestions */}
          <div className="mt-6">
            <h4 className="text-sm font-semibold text-gray-800 mb-3">Popular Cities:</h4>
            <div className="flex flex-wrap gap-2">
              {['Addis Ababa', 'Bahir Dar', 'Injibara'].map((city) => (
                <button
                  key={city}
                  onClick={() => handleSearchChange(city)}
                  className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm transition-colors duration-200"
                >
                  {city}
                </button>
              ))}
            </div>
          </div>
        </>
      ) : (
        /* Collapsed Search Section */
        <div className="text-center">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Searching in {searchParams.city}
            </h3>
            <p className="text-gray-600 mb-4">
              Currently showing results for <strong>{searchParams.city}</strong>
            </p>
            <button
              onClick={handleBackToSearch}
              className="flex items-center justify-center mx-auto bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg transition-colors duration-200"
            >
              <ChevronDown className="h-4 w-4 mr-2" />
              Change Search
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchForm;