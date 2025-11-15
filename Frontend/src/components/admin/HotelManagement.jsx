import React, { useState } from 'react';
import { Plus, Edit, Trash2, MapPin, Star, Wifi, Car, Coffee, Dumbbell, Utensils } from 'lucide-react';
import toast from 'react-hot-toast';

const HotelManagement = ({ hotels, onHotelCreate, onHotelUpdate, onHotelDelete }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingHotel, setEditingHotel] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    country: '',
    zip_code: '',
    rating: '',
    description: '',
    amenities: []
  });

  // Updated amenity options without missing icons
  const amenityOptions = [
    { value: 'WiFi', label: 'WiFi', icon: Wifi },
    { value: 'Parking', label: 'Parking', icon: Car },
    { value: 'Restaurant', label: 'Restaurant', icon: Utensils },
    { value: 'Gym', label: 'Fitness Center', icon: Dumbbell },
    { value: 'Bar', label: 'Bar', icon: Coffee },
    { value: 'Business Center', label: 'Business Center' },
    { value: 'Conference Rooms', label: 'Conference Rooms' },
    { value: 'Airport Shuttle', label: 'Airport Shuttle', icon: Car },
    { value: 'Spa', label: 'Spa' },
    { value: 'Room Service', label: 'Room Service' },
    { value: 'Laundry Service', label: 'Laundry Service' },
    { value: 'Concierge', label: 'Concierge' }
  ];

  const resetForm = () => {
    setFormData({
      name: '',
      address: '',
      city: '',
      state: '',
      country: '',
      zip_code: '',
      rating: '',
      description: '',
      amenities: []
    });
    setEditingHotel(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Validate required fields
      if (!formData.name || !formData.address || !formData.city || !formData.country || !formData.rating) {
        toast.error('Please fill in all required fields');
        return;
      }

      const hotelData = {
        ...formData,
        rating: parseFloat(formData.rating),
        amenities: formData.amenities || []
      };

      if (editingHotel) {
        await onHotelUpdate(editingHotel.id, hotelData);
        toast.success('Hotel updated successfully');
      } else {
        await onHotelCreate(hotelData);
        toast.success('Hotel created successfully');
      }
      
      setShowForm(false);
      resetForm();
    } catch (error) {
      console.error('Failed to save hotel:', error);
      toast.error(error.response?.data?.error || 'Failed to save hotel');
    }
  };

  const handleEdit = (hotel) => {
    setEditingHotel(hotel);
    setFormData({
      name: hotel.name || '',
      address: hotel.address || '',
      city: hotel.city || '',
      state: hotel.state || '',
      country: hotel.country || '',
      zip_code: hotel.zip_code || '',
      rating: hotel.rating?.toString() || '',
      description: hotel.description || '',
      amenities: hotel.amenities || []
    });
    setShowForm(true);
  };

  const handleDelete = async (hotel) => {
    console.log('Delete button clicked for hotel:', hotel);
    
    if (!window.confirm(`Are you sure you want to delete "${hotel.name}"? This action cannot be undone.`)) {
      console.log('Delete cancelled by user');
      return;
    }

    try {
      console.log('Calling onHotelDelete with ID:', hotel.id);
      if (onHotelDelete) {
        await onHotelDelete(hotel.id);
        console.log('Delete completed successfully');
      } else {
        console.error('onHotelDelete function is not defined');
        toast.error('Delete functionality not available');
      }
    } catch (error) {
      console.error('Delete operation failed:', error);
      // Error is already handled in onHotelDelete, but we log it here for debugging
    }
  };

  const handleAmenityToggle = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  // Function to render amenity icon with fallback
  const renderAmenityIcon = (amenity) => {
    if (amenity.icon) {
      const IconComponent = amenity.icon;
      return <IconComponent className="h-4 w-4 text-gray-600" />;
    }
    return <div className="h-4 w-4 bg-gray-300 rounded-full"></div>;
  };

  // Debug: Check if onHotelDelete is available
  console.log('HotelManagement props:', { 
    hotelsCount: hotels?.length,
    onHotelCreate: typeof onHotelCreate,
    onHotelUpdate: typeof onHotelUpdate,
    onHotelDelete: typeof onHotelDelete 
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Hotel Management</h3>
          <p className="text-sm text-gray-600">Manage hotel properties and information</p>
        </div>
        
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
        >
          <Plus className="h-4 w-4" />
          <span>Add Hotel</span>
        </button>
      </div>

      {/* Hotels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hotels && hotels.map((hotel) => (
          <div key={hotel.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-gray-900 mb-1">
                  {hotel.name}
                </h4>
                <div className="flex items-center space-x-1 text-sm text-gray-600 mb-2">
                  <MapPin className="h-4 w-4" />
                  <span>{hotel.city}, {hotel.country}</span>
                </div>
                <div className="flex items-center space-x-1 text-sm text-yellow-600">
                  <Star className="h-4 w-4 fill-current" />
                  <span>{hotel.rating}</span>
                </div>
              </div>
            </div>

            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
              {hotel.description}
            </p>

            {/* Amenities */}
            {hotel.amenities && hotel.amenities.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-4">
                {hotel.amenities.slice(0, 3).map((amenity, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                  >
                    {amenity}
                  </span>
                ))}
                {hotel.amenities.length > 3 && (
                  <span className="text-gray-500 text-xs">
                    +{hotel.amenities.length - 3} more
                  </span>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex space-x-2">
              <button
                onClick={() => handleEdit(hotel)}
                className="flex-1 flex items-center justify-center bg-blue-100 text-blue-700 py-2 px-3 rounded text-sm hover:bg-blue-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </button>
              <button 
                onClick={() => handleDelete(hotel)}
                className="flex items-center justify-center bg-red-100 text-red-700 py-2 px-3 rounded text-sm hover:bg-red-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {(!hotels || hotels.length === 0) && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hotels found</h3>
          <p className="text-gray-600 mb-4">Get started by adding your first hotel property.</p>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Add First Hotel
          </button>
        </div>
      )}

      {/* Hotel Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {editingHotel ? 'Edit Hotel' : 'Add New Hotel'}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Hotel Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter hotel name"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Rating *
                    </label>
                    <select
                      value={formData.rating}
                      onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select rating</option>
                      <option value="3.0">3.0 ★</option>
                      <option value="3.5">3.5 ★</option>
                      <option value="4.0">4.0 ★</option>
                      <option value="4.5">4.5 ★</option>
                      <option value="5.0">5.0 ★</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address *
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Full address"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="City"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      State/Province
                    </label>
                    <input
                      type="text"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="State"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Country *
                    </label>
                    <input
                      type="text"
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Country"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ZIP/Postal Code
                  </label>
                  <input
                    type="text"
                    value={formData.zip_code}
                    onChange={(e) => setFormData({ ...formData, zip_code: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="ZIP/Postal Code"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Describe the hotel and its features"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amenities
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                    {amenityOptions.map((amenity) => (
                      <label
                        key={amenity.value}
                        className="flex items-center space-x-2 p-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
                      >
                        <input
                          type="checkbox"
                          checked={formData.amenities.includes(amenity.value)}
                          onChange={() => handleAmenityToggle(amenity.value)}
                          className="text-blue-600 focus:ring-blue-500"
                        />
                        {renderAmenityIcon(amenity)}
                        <span className="text-sm text-gray-700">{amenity.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      resetForm();
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    {editingHotel ? 'Update Hotel' : 'Create Hotel'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HotelManagement;