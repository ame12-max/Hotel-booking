import React, { useState } from 'react';
import { Plus, Edit, Trash2, Users, Square, Bed } from 'lucide-react';
import toast from 'react-hot-toast';

const RoomTypeManagement = ({ roomTypes = [], onRoomTypeCreate, onRoomTypeUpdate, onRoomTypeDelete }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingRoomType, setEditingRoomType] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    capacity: '',
    base_price: '',
    size_sqft: '',
    bed_type: '',
    amenities: []
  });

  const amenityOptions = [
    'WiFi', 'TV', 'AC', 'Coffee Maker', 'Mini Bar', 'Jacuzzi', 
    'Work Desk', 'Express Check-in', 'Ocean View', 'Balcony'
  ];

  const bedTypes = ['King', 'Queen', 'Double', 'Twin', 'Single', 'King + Sofa Bed', 'Queen + Sofa Bed'];

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      capacity: '',
      base_price: '',
      size_sqft: '',
      bed_type: '',
      amenities: []
    });
    setEditingRoomType(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const payload = {
        ...formData,
        capacity: parseInt(formData.capacity),
        base_price: parseFloat(formData.base_price),
        size_sqft: formData.size_sqft ? parseInt(formData.size_sqft) : null,
        amenities: Array.isArray(formData.amenities) ? formData.amenities : []
      };

      if (editingRoomType) {
        await onRoomTypeUpdate(editingRoomType.id, payload);
        toast.success('Room type updated successfully');
      } else {
        await onRoomTypeCreate(payload);
        toast.success('Room type created successfully');
      }
      
      setShowForm(false);
      resetForm();
    } catch (error) {
      console.error('Failed to save room type:', error);
      toast.error(error.response?.data?.error || 'Failed to save room type');
    }
  };

  const handleEdit = (roomType) => {
    setEditingRoomType(roomType);
    setFormData({
      name: roomType.name || '',
      description: roomType.description || '',
      capacity: roomType.capacity?.toString() || '2',
      base_price: roomType.base_price?.toString() || '',
      size_sqft: roomType.size_sqft?.toString() || '',
      bed_type: roomType.bed_type || '',
      amenities: Array.isArray(roomType.amenities) ? roomType.amenities : []
    });
    setShowForm(true);
  };

  const handleDelete = async (roomType) => {
    if (!window.confirm(`Are you sure you want to delete "${roomType.name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await onRoomTypeDelete(roomType.id);
    } catch (error) {
      console.error('Failed to delete room type:', error);
      toast.error(error.response?.data?.error || 'Failed to delete room type');
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

  // Safe room types array with fallback
  const safeRoomTypes = Array.isArray(roomTypes) ? roomTypes : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Room Type Management</h3>
          <p className="text-sm text-gray-600">Manage room categories and pricing</p>
        </div>
        
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
        >
          <Plus className="h-4 w-4" />
          <span>Add Room Type</span>
        </button>
      </div>

      {/* Room Types Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {safeRoomTypes.map((roomType) => (
          roomType && (
            <div key={roomType.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="mb-4">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  {roomType.name || 'Unnamed Room Type'}
                </h4>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {roomType.description || 'No description available'}
                </p>
                
                <div className="grid grid-cols-2 gap-3 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4" />
                    <span>{roomType.capacity || 2} guests</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Square className="h-4 w-4" />
                    <span>{roomType.size_sqft || 'N/A'} sq ft</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Bed className="h-4 w-4" />
                    <span>{roomType.bed_type || 'Not specified'}</span>
                  </div>
                  <div className="text-green-600 font-semibold">
                    birr {roomType.base_price || 0}/night
                  </div>
                </div>
              </div>

              {/* Amenities */}
              {roomType.amenities && roomType.amenities.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-4">
                  {roomType.amenities.slice(0, 3).map((amenity, index) => (
                    <span
                      key={index}
                      className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded"
                    >
                      {amenity}
                    </span>
                  ))}
                  {roomType.amenities.length > 3 && (
                    <span className="text-gray-500 text-xs">
                      +{roomType.amenities.length - 3} more
                    </span>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(roomType)}
                  className="flex-1 flex items-center justify-center bg-blue-100 text-blue-700 py-2 px-3 rounded text-sm hover:bg-blue-200 transition-colors duration-200"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </button>
                <button 
                  onClick={() => handleDelete(roomType)}
                  className="flex items-center justify-center bg-red-100 text-red-700 py-2 px-3 rounded text-sm hover:bg-red-200 transition-colors duration-200"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </button>
              </div>
            </div>
          )
        ))}
      </div>

      {safeRoomTypes.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Bed className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No room types found</h3>
          <p className="text-gray-600 mb-4">Create room types to start adding rooms to hotels.</p>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Add First Room Type
          </button>
        </div>
      )}

      {/* Room Type Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {editingRoomType ? 'Edit Room Type' : 'Add New Room Type'}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Room Type Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Standard King, Deluxe Suite"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Base Price (Birr) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.base_price}
                      onChange={(e) => setFormData({ ...formData, base_price: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0.00"
                      required
                    />
                  </div>
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
                    placeholder="Describe the room type and its features"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Capacity *
                    </label>
                    <select
                      value={formData.capacity}
                      onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select capacity</option>
                      {[1, 2, 3, 4, 5, 6].map(num => (
                        <option key={num} value={num}>
                          {num} {num === 1 ? 'Guest' : 'Guests'}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Size (sq ft)
                    </label>
                    <input
                      type="number"
                      value={formData.size_sqft}
                      onChange={(e) => setFormData({ ...formData, size_sqft: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., 300"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bed Type *
                    </label>
                    <select
                      value={formData.bed_type}
                      onChange={(e) => setFormData({ ...formData, bed_type: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select bed type</option>
                      {bedTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Room Amenities
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {amenityOptions.map((amenity) => (
                      <label
                        key={amenity}
                        className="flex items-center space-x-2 p-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
                      >
                        <input
                          type="checkbox"
                          checked={formData.amenities.includes(amenity)}
                          onChange={() => handleAmenityToggle(amenity)}
                          className="text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{amenity}</span>
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
                    {editingRoomType ? 'Update Room Type' : 'Create Room Type'}
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

export default RoomTypeManagement;