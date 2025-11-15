import React, { useState } from 'react';
import { Plus, Edit, Wifi, Coffee, Tv, Car, Square, Users, Bed } from 'lucide-react';
import { formatCurrency, getStatusColor } from '../../utils/formatters';

const RoomManagement = ({ rooms, onStatusUpdate, onAddRoom }) => {
  const [showAddForm, setShowAddForm] = useState(false);
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

  const filteredRooms = rooms.filter(room => {
    if (filter.status && room.status !== filter.status) return false;
    if (filter.hotel && room.hotel_id.toString() !== filter.hotel) return false;
    return true;
  });

  const hotels = [...new Set(rooms.map(room => ({ id: room.hotel_id, name: room.hotel_name })))];
  const roomTypes = [...new Set(rooms.map(room => ({ id: room.room_type_id, name: room.room_type_name })))];
  
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
      await onAddRoom(newRoomData);
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
            {hotels.map(hotel => (
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
              <div>
                <h4 className="text-lg font-semibold text-gray-900">
                  Room {room.room_number}
                </h4>
                <p className="text-sm text-gray-600">{room.hotel_name}</p>
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
                <span className="font-medium">{room.room_type_name}</span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Floor</span>
                <span className="font-medium">{room.floor}</span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Price</span>
                <span className="font-medium text-green-600">
                  {formatCurrency(room.base_price)}/night
                </span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Capacity</span>
                <span className="font-medium">{room.capacity} guests</span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex space-x-2">
              <button className="flex-1 bg-gray-100 text-gray-700 py-2 px-3 rounded text-sm hover:bg-gray-200 transition-colors duration-200">
                <Edit className="h-4 w-4 inline mr-1" />
                Edit
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
                    className="input-field"
                    required
                  >
                    <option value="">Select Hotel</option>
                    {hotels.map(hotel => (
                      <option key={hotel.id} value={hotel.id}>{hotel.name}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Room Type
                  </label>
                  <select
                    value={newRoomData.room_type_id}
                    onChange={(e) => setNewRoomData({...newRoomData, room_type_id: e.target.value})}
                    className="input-field"
                    required
                  >
                    <option value="">Select Room Type</option>
                    {roomTypes.map(type => (
                      <option key={type.id} value={type.id}>{type.name}</option>
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
                      value={newRoomData.room_number}
                      onChange={(e) => setNewRoomData({...newRoomData, room_number: e.target.value})}
                      className="input-field"
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
                      onChange={(e) => setNewRoomData({...newRoomData, floor: parseInt(e.target.value)})}
                      className="input-field"
                      placeholder="e.g., 1"
                      min="1"
                    />
                  </div>
                </div>
                
                <div className="flex space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="flex-1 btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 btn-primary"
                  >
                    Add Room
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