import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Hotel, MapPin, Star, Trash2, Search, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock data - replace with actual API call
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        setLoading(true);
        // TODO: Replace with actual API call
        // const response = await fetch(`${API_BASE_URL}/api/wishlist`);
        // const data = await response.json();
        
        // Mock data
        setTimeout(() => {
          setWishlist([
            {
              id: 1,
              hotel: {
                id: 7,
                name: 'Hilton Addis Ababa',
                address: 'Menelik II Avenue',
                city: 'Addis Ababa',
                rating: 4.6,
                image: '/api/placeholder/400/250',
                price: 350,
                description: 'Luxury hotel in the heart of Addis Ababa with premium amenities',
                amenities: ['WiFi', 'Pool', 'Spa', 'Restaurant', 'Gym']
              },
              added_at: '2024-01-15'
            },
            {
              id: 2,
              hotel: {
                id: 10,
                name: 'Elilly International Hotel',
                address: 'African Avenue',
                city: 'Addis Ababa',
                rating: 4.3,
                image: '/api/placeholder/400/250',
                price: 280,
                description: 'Modern hotel with excellent service and facilities',
                amenities: ['WiFi', 'Business Center', 'Restaurant', 'Bar']
              },
              added_at: '2024-01-10'
            },
            {
              id: 3,
              hotel: {
                id: 13,
                name: 'Capital Hotel and Spa',
                address: 'Haile Gebreselassie Road',
                city: 'Addis Ababa',
                rating: 4.4,
                image: '/api/placeholder/400/250',
                price: 320,
                description: 'Luxurious spa hotel with premium accommodations',
                amenities: ['Spa', 'Pool', 'WiFi', 'Restaurant', 'Fitness Center']
              },
              added_at: '2024-01-08'
            }
          ]);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Failed to fetch wishlist:', error);
        toast.error('Failed to load wishlist');
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  const removeFromWishlist = async (hotelId) => {
    try {
      // TODO: Replace with actual API call
      // await fetch(`${API_BASE_URL}/api/wishlist/${hotelId}`, { method: 'DELETE' });
      
      setWishlist(prev => prev.filter(item => item.id !== hotelId));
      toast.success('Removed from wishlist');
    } catch (error) {
      console.error('Failed to remove from wishlist:', error);
      toast.error('Failed to remove from wishlist');
    }
  };

  const clearWishlist = async () => {
    if (window.confirm('Are you sure you want to clear your entire wishlist?')) {
      try {
        // TODO: Replace with actual API call
        // await fetch(`${API_BASE_URL}/api/wishlist`, { method: 'DELETE' });
        
        setWishlist([]);
        toast.success('Wishlist cleared');
      } catch (error) {
        console.error('Failed to clear wishlist:', error);
        toast.error('Failed to clear wishlist');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white rounded-2xl shadow-sm p-6">
                  <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
            <p className="text-gray-600 mt-2">
              Your saved hotels and dream destinations
            </p>
          </div>
          
          {wishlist.length > 0 && (
            <div className="mt-4 md:mt-0 flex space-x-3">
              <Link
                to="/search"
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
              >
                <Search className="h-4 w-4 mr-2" />
                Find More Hotels
              </Link>
              <button
                onClick={clearWishlist}
                className="flex items-center px-4 py-2 border border-red-300 text-red-600 rounded-lg font-semibold hover:bg-red-50 transition-colors duration-200"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All
              </button>
            </div>
          )}
        </div>

        {wishlist.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
            <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Your wishlist is empty</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Start exploring amazing hotels and save your favorites to plan your next trip.
            </p>
            <Link
              to="/search"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
            >
              <Search className="h-4 w-4 mr-2" />
              Explore Hotels
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlist.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
                {/* Hotel Image */}
                <div className="relative h-48 bg-gray-200">
                  <img
                    src={item.hotel.image}
                    alt={item.hotel.name}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => removeFromWishlist(item.id)}
                    className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-lg hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  <div className="absolute top-3 left-3">
                    <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
                      Saved
                    </span>
                  </div>
                </div>
                
                {/* Hotel Info */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-gray-900 text-lg line-clamp-2">
                      {item.hotel.name}
                    </h3>
                    <div className="flex items-center space-x-1 ml-2 flex-shrink-0">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600">{item.hotel.rating}</span>
                    </div>
                  </div>

                  <div className="flex items-center text-gray-500 text-sm mb-3">
                    <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                    <span className="line-clamp-1">{item.hotel.address}, {item.hotel.city}</span>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {item.hotel.description}
                  </p>

                  {/* Amenities */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {item.hotel.amenities.slice(0, 3).map((amenity, index) => (
                      <span
                        key={index}
                        className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded"
                      >
                        {amenity}
                      </span>
                    ))}
                    {item.hotel.amenities.length > 3 && (
                      <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                        +{item.hotel.amenities.length - 3} more
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div>
                      <span className="text-2xl font-bold text-gray-900">${item.hotel.price}</span>
                      <span className="text-gray-500 text-sm"> / night</span>
                    </div>
                    <div className="flex space-x-2">
                      <Link
                        to={`/hotels/${item.hotel.id}`}
                        className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors duration-200 text-sm"
                      >
                        View Details
                      </Link>
                      <Link
                        to={`/search?hotel=${item.hotel.id}`}
                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 text-sm"
                      >
                        <Calendar className="h-4 w-4 mr-1" />
                        Book Now
                      </Link>
                    </div>
                  </div>

                  <div className="mt-3 text-xs text-gray-500">
                    Added on {new Date(item.added_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Stats */}
        {wishlist.length > 0 && (
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-2xl p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">{wishlist.length}</div>
                <div className="text-blue-800 text-sm">Saved Hotels</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  ${wishlist.reduce((total, item) => total + item.hotel.price, 0)}
                </div>
                <div className="text-blue-800 text-sm">Average Price</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {Math.max(...wishlist.map(item => item.hotel.rating))}
                </div>
                <div className="text-blue-800 text-sm">Highest Rating</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;