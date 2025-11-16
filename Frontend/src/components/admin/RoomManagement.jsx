import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Wifi, Coffee, Tv, Car, Square, Users, Bed, Building } from 'lucide-react';
import { formatCurrency, getStatusColor } from '../../utils/formatters';

const RoomManagement = ({ rooms, hotels, roomTypes, onStatusUpdate, onAddRoom, onEditRoom, onDeleteRoom }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [filter, setFilter] = useState({
    status: '',
    hotel: ''
  });

  const [newRoomData, setNewRoomData] = useState({
    hotel_id: '',
    room_type_id: '',
    room_number: '',
    floor: 1
  });

  const [editRoomData, setEditRoomData] = useState({
    hotel_id: '',
    room_type_id: '',
    room_number: '',
    floor: 1
  });

  // Debug: Check what data we're receiving
  useEffect(() => {
    console.log('🔍 RoomManagement props:', {
      roomsCount: rooms?.length,
      hotelsCount: hotels?.length,
      roomTypesCount: roomTypes?.length,
      hotels: hotels,
      roomTypes: roomTypes
    });
  }, [rooms, hotels, roomTypes]);

  const filteredRooms = rooms.filter(room => {
    if (filter.status && room.status !== filter.status) return false;
    if (filter.hotel && room.hotel_id?.toString() !== filter.hotel) return false;
    return true;
  });

  // Get unique hotels from rooms for filtering (fallback)
  const availableHotelsForFilter = [...new Set(rooms.map(room => ({ 
    id: room.hotel_id, 
    name: room.hotel_name 
  })))].filter(hotel => hotel.id && hotel.name);

  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'AVAILABLE', label: 'Available' },
    { value: 'OCCUPIED', label: 'Occupied' },
    { value: 'MAINTENANCE', label: 'Maintenance' },
    { value: 'CLEANING', label: 'Cleaning' }
  ];

  const handleAddRoom = async (e) => {
    e.preventDefault();
    try {
      await onAddRoom({
        ...newRoomData,
        hotel_id: parseInt(newRoomData.hotel_id),
        room_type_id: parseInt(newRoomData.room_type_id),
        floor: parseInt(newRoomData.floor)
      });
      setShowAddForm(false);
      setNewRoomData({
        hotel_id: '',
        room_type_id: '',
        room_number: '',
        floor: 1
      });
    } catch (error) {
      console.error('Failed to add room:', error);
    }
  };

  const handleEditRoom = async (e) => {
    e.preventDefault();
    try {
      await onEditRoom(editingRoom.id, {
        ...editRoomData,
        hotel_id: parseInt(editRoomData.hotel_id),
        room_type_id: parseInt(editRoomData.room_type_id),
        floor: parseInt(editRoomData.floor)
      });
      setShowEditForm(false);
      setEditingRoom(null);
    } catch (error) {
      console.error('Failed to edit room:', error);
    }
  };

  const handleDeleteRoom = async (room) => {
    if (!window.confirm(`Are you sure you want to delete Room ${room.room_number}? This action cannot be undone.`)) {
      return;
    }

    try {
      await onDeleteRoom(room.id);
    } catch (error) {
      console.error('Failed to delete room:', error);
    }
  };

  const handleEditClick = (room) => {
    setEditingRoom(room);
    setEditRoomData({
      hotel_id: room.hotel_id?.toString() || '',
      room_type_id: room.room_type_id?.toString() || '',
      room_number: room.room_number || '',
      floor: room.floor || 1
    });
    setShowEditForm(true);
  };

  const resetForms = () => {
    setNewRoomData({
      hotel_id: '',
      room_type_id: '',
      room_number: '',
      floor: 1
    });
    setEditRoomData({
      hotel_id: '',
      room_type_id: '',
      room_number: '',
      floor: 1
    });
    setEditingRoom(null);
  };

  // Get hotels for dropdown - use props first, fallback to derived from rooms
  const hotelsForDropdown = hotels && hotels.length > 0 
    ? hotels 
    : availableHotelsForFilter;

  // Get room types for dropdown
  const roomTypesForDropdown = roomTypes && roomTypes.length > 0 
    ? roomTypes 
    : [...new Set(rooms.map(room => ({ 
        id: room.room_type_id, 
        name: room.room_type || room.room_type_name,
        base_price: room.base_price
      })))].filter(type => type.id && type.name);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Room Management</h3>
          <p className="text-sm text-gray-600">Manage room availability and status</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Filters */}
          <select
            value={filter.status}
            onChange={(e) => setFilter({...filter, status: e.target.value})}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <select
            value={filter.hotel}
            onChange={(e) => setFilter({...filter, hotel: e.target.value})}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            <option value="">All Hotels</option>
            {availableHotelsForFilter.map(hotel => (
              <option key={hotel.id} value={hotel.id}>
                {hotel.name}
              </option>
            ))}
          </select>

          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 text-sm"
          >
            <Plus className="h-4 w-4" />
            <span>Add Room</span>
          </button>
        </div>
      </div>

      {/* Rooms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRooms.map((room) => (
          <div key={room.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-gray-900">
                  Room {room.room_number}
                </h4>
                <p className="text-sm text-gray-600">{room.hotel_name || `Hotel ID: ${room.hotel_id}`}</p>
              </div>
              <select
                value={room.status}
                onChange={(e) => onStatusUpdate(room.id, e.target.value)}
                className={`text-xs font-medium px-2 py-1 rounded-full border-0 focus:ring-2 focus:ring-blue-500 ${getStatusColor(room.status)}`}
              >
                <option value="AVAILABLE">Available</option>
                <option value="OCCUPIED">Occupied</option>
                <option value="MAINTENANCE">Maintenance</option>
                <option value="CLEANING">Cleaning</option>
              </select>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Type</span>
                <span className="font-medium">{room.room_type || room.room_type_name || `Type ID: ${room.room_type_id}`}</span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Floor</span>
                <span className="font-medium">{room.floor}</span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Price</span>
                <span className="font-medium text-green-600">
                  {formatCurrency(room.base_price || room.price || 0)}/night
                </span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Capacity</span>
                <span className="font-medium">{room.capacity || 2} guests</span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex space-x-2">
              <button 
                onClick={() => handleEditClick(room)}
                className="flex-1 flex items-center justify-center bg-blue-100 text-blue-700 py-2 px-3 rounded text-sm hover:bg-blue-200 transition-colors duration-200"
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </button>
              <button 
                onClick={() => handleDeleteRoom(room)}
                className="flex items-center justify-center bg-red-100 text-red-700 py-2 px-3 rounded text-sm hover:bg-red-200 transition-colors duration-200"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredRooms.length === 0 && (
        <div className="text-center py-12">
          <div className="bg-gray-100 rounded-lg p-8">
            <Bed className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No rooms found</h3>
            <p className="text-gray-600">
              {rooms.length === 0 
                ? "No rooms have been added yet. Start by adding your first room."
                : "No rooms match your current filters."
              }
            </p>
          </div>
        </div>
      )}

      {/* Add Room Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Room</h3>
              
              <form onSubmit={handleAddRoom} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hotel
                  </label>
                  <select
                    value={newRoomData.hotel_id}
                    onChange={(e) => setNewRoomData({...newRoomData, hotel_id: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Hotel</option>
                    {hotelsForDropdown && hotelsForDropdown.map(hotel => (
                      <option key={hotel.id} value={hotel.id}>
                        {hotel.name} {hotel.city ? `- ${hotel.city}` : ''}
                      </option>
                    ))}
                  </select>
                  {(!hotelsForDropdown || hotelsForDropdown.length === 0) && (
                    <p className="text-red-500 text-xs mt-1">
                      No hotels available. Please add hotels first in the Hotels section.
                    </p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Room Type
                  </label>
                  <select
                    value={newRoomData.room_type_id}
                    onChange={(e) => setNewRoomData({...newRoomData, room_type_id: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Room Type</option>
                    {roomTypesForDropdown && roomTypesForDropdown.map(type => (
                      <option key={type.id} value={type.id}>
                        {type.name} - {formatCurrency(type.base_price || 0)}/night
                      </option>
                    ))}
                  </select>
                  {(!roomTypesForDropdown || roomTypesForDropdown.length === 0) && (
                    <p className="text-red-500 text-xs mt-1">
                      No room types available. Please add room types first in the Room Types section.
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Room Number
                    </label>
                    <input
                      type="text"
                      value={newRoomData.room_number}
                      onChange={(e) => setNewRoomData({...newRoomData, room_number: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., 101"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Floor
                    </label>
                    <input
                      type="number"
                      value={newRoomData.floor}
                      onChange={(e) => setNewRoomData({...newRoomData, floor: parseInt(e.target.value) || 1})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., 1"
                      min="1"
                      required
                    />
                  </div>
                </div>
                
                <div className="flex space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddForm(false);
                      resetForms();
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!hotelsForDropdown || hotelsForDropdown.length === 0 || !roomTypesForDropdown || roomTypesForDropdown.length === 0}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add Room
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Room Modal */}
      {showEditForm && editingRoom && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Edit Room {editingRoom.room_number}
              </h3>
              
              <form onSubmit={handleEditRoom} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hotel
                  </label>
                  <select
                    value={editRoomData.hotel_id}
                    onChange={(e) => setEditRoomData({...editRoomData, hotel_id: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Hotel</option>
                    {hotelsForDropdown && hotelsForDropdown.map(hotel => (
                      <option key={hotel.id} value={hotel.id}>
                        {hotel.name} {hotel.city ? `- ${hotel.city}` : ''}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Room Type
                  </label>
                  <select
                    value={editRoomData.room_type_id}
                    onChange={(e) => setEditRoomData({...editRoomData, room_type_id: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Room Type</option>
                    {roomTypesForDropdown && roomTypesForDropdown.map(type => (
                      <option key={type.id} value={type.id}>
                        {type.name} - {formatCurrency(type.base_price || 0)}/night
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Room Number
                    </label>
                    <input
                      type="text"
                      value={editRoomData.room_number}
                      onChange={(e) => setEditRoomData({...editRoomData, room_number: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., 101"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Floor
                    </label>
                    <input
                      type="number"
                      value={editRoomData.floor}
                      onChange={(e) => setEditRoomData({...editRoomData, floor: parseInt(e.target.value) || 1})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., 1"
                      min="1"
                      required
                    />
                  </div>
                </div>
                
                <div className="flex space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditForm(false);
                      resetForms();
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Update Room
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

export default RoomManagement;