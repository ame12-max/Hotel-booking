import React, { useState, useEffect } from "react";
import {
  BarChart3,
  Users,
  Hotel,
  DollarSign,
  Calendar,
  Settings,
  Building,
  Bed,
  FileText,
} from "lucide-react";
import toast from "react-hot-toast";
import { bookingsService } from "../services/bookings";
import StatsCard from "../components/admin/StatsCard";
import BookingTable from "../components/admin/BookingTable";
import RoomManagement from "../components/admin/RoomManagement";
import HotelManagement from "../components/admin/HotelManagement";
import RoomTypeManagement from "../components/admin/RoomTypeManagement";
import LoadingSpinner from "../components/common/LoadingSpinner";
import TransactionLogs from "../components/admin/TransactionLogs";
import Setting from "../components/admin/Settings"; // Import the Settings component

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Load stats and bookings
      const [statsResponse, bookingsResponse] = await Promise.all([
        bookingsService.getAdminStats(),
        bookingsService.getAllBookings(),
      ]);

      setStats(statsResponse.data.stats);
      setBookings(bookingsResponse.data.data || []);

      // Load additional data based on active tab to avoid unnecessary requests
      if (activeTab === "rooms" || activeTab === "room-types") {
        await loadRoomsAndTypes();
      }
      if (activeTab === "hotels") {
        await loadHotels();
      }
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const loadRoomsAndTypes = async () => {
    try {
      const [roomsResponse, roomTypesResponse, hotelsResponse] =
        await Promise.all([
          bookingsService.getAllRooms(),
          bookingsService.getAllRoomTypes(),
          bookingsService.getAllHotels(), // Load hotels for room management
        ]);
      setRooms(roomsResponse.data.data || []);
      setRoomTypes(roomTypesResponse.data.data || []);
      setHotels(hotelsResponse.data.data || []);
    } catch (error) {
      console.error("Failed to load rooms and room types:", error);
      toast.error("Failed to load rooms data");
    }
  };

  const loadHotels = async () => {
    try {
      const hotelsResponse = await bookingsService.getAllHotels();
      console.log("🏨 Hotels loaded in AdminDashboard:", hotelsResponse.data);
      setHotels(hotelsResponse.data.data || []);
    } catch (error) {
      console.error("Failed to load hotels:", error);
      toast.error("Failed to load hotels data");
    }
  };

  // Refresh data when tab changes
  useEffect(() => {
    if (!loading) {
      if (
        activeTab === "rooms" &&
        (rooms.length === 0 || hotels.length === 0)
      ) {
        loadRoomsAndTypes();
      } else if (activeTab === "hotels" && hotels.length === 0) {
        loadHotels();
      } else if (activeTab === "room-types" && roomTypes.length === 0) {
        loadRoomsAndTypes();
      }
    }
  }, [activeTab, loading]);

  const handleBookingStatusUpdate = async (bookingId, newStatus) => {
    try {
      await bookingsService.updateBookingStatus(bookingId, newStatus);
      toast.success(`Booking status updated to ${newStatus}`);
      // Refresh bookings data
      const response = await bookingsService.getAllBookings();
      setBookings(response.data.data || []);
    } catch (error) {
      console.error("Failed to update booking status:", error);
      toast.error("Failed to update booking status");
    }
  };

  const handleRoomStatusUpdate = async (roomId, newStatus) => {
    try {
      await bookingsService.updateRoomStatus(roomId, newStatus);
      toast.success(`Room status updated to ${newStatus}`);
      // Refresh rooms data
      const response = await bookingsService.getAllRooms();
      setRooms(response.data.data || []);
    } catch (error) {
      console.error("Failed to update room status:", error);
      toast.error("Failed to update room status");
    }
  };

  const handleHotelCreate = async (hotelData) => {
    try {
      const response = await bookingsService.createHotel(hotelData);
      toast.success("Hotel created successfully");
      setHotels((prev) => [...prev, response.data.hotel]);
      return response;
    } catch (error) {
      console.error("Failed to create hotel:", error);
      toast.error("Failed to create hotel");
      throw error;
    }
  };

  const handleHotelUpdate = async (hotelId, hotelData) => {
    try {
      const response = await bookingsService.updateHotel(hotelId, hotelData);
      toast.success("Hotel updated successfully");
      setHotels((prev) =>
        prev.map((hotel) =>
          hotel.id === hotelId ? { ...hotel, ...hotelData } : hotel
        )
      );
      return response;
    } catch (error) {
      console.error("Failed to update hotel:", error);
      toast.error("Failed to update hotel");
      throw error;
    }
  };

  const handleHotelDelete = async (hotelId) => {
    try {
      await bookingsService.deleteHotel(hotelId);
      toast.success("Hotel deleted successfully");
      // Refresh hotels data
      const hotelsResponse = await bookingsService.getAllHotels();
      setHotels(hotelsResponse.data.data || []);
    } catch (error) {
      console.error("Failed to delete hotel:", error);
      toast.error(error.response?.data?.error || "Failed to delete hotel");
      throw error;
    }
  };

  const handleRoomTypeCreate = async (roomTypeData) => {
    try {
      const response = await bookingsService.createRoomType(roomTypeData);
      toast.success("Room type created successfully");
      setRoomTypes((prev) => [...prev, response.data.roomType]);
      return response;
    } catch (error) {
      console.error("Failed to create room type:", error);
      toast.error("Failed to create room type");
      throw error;
    }
  };

  const handleRoomTypeUpdate = async (roomTypeId, roomTypeData) => {
    try {
      const response = await bookingsService.updateRoomType(
        roomTypeId,
        roomTypeData
      );
      toast.success("Room type updated successfully");
      setRoomTypes((prev) =>
        prev.map((roomType) =>
          roomType.id === roomTypeId
            ? { ...roomType, ...roomTypeData }
            : roomType
        )
      );
      return response;
    } catch (error) {
      console.error("Failed to update room type:", error);
      toast.error("Failed to update room type");
      throw error;
    }
  };

  const handleRoomTypeDelete = async (roomTypeId) => {
    try {
      await bookingsService.deleteRoomType(roomTypeId);
      toast.success("Room type deleted successfully");
      // Refresh room types data
      const roomTypesResponse = await bookingsService.getAllRoomTypes();
      setRoomTypes(roomTypesResponse.data.data || []);
    } catch (error) {
      console.error("Failed to delete room type:", error);
      toast.error(error.response?.data?.error || "Failed to delete room type");
      throw error;
    }
  };

  const handleAddRoom = async (roomData) => {
    try {
      const response = await bookingsService.createRoom(roomData);
      toast.success("Room created successfully");
      // Refresh rooms data
      const roomsResponse = await bookingsService.getAllRooms();
      setRooms(roomsResponse.data.data || []);
      return response;
    } catch (error) {
      console.error("Failed to create room:", error);
      toast.error("Failed to create room");
      throw error;
    }
  };

  const handleEditRoom = async (roomId, roomData) => {
    try {
      const response = await bookingsService.updateRoom(roomId, roomData);
      toast.success("Room updated successfully");
      // Refresh rooms data
      const roomsResponse = await bookingsService.getAllRooms();
      setRooms(roomsResponse.data.data || []);
      return response;
    } catch (error) {
      console.error("Failed to update room:", error);
      toast.error("Failed to update room");
      throw error;
    }
  };

  const handleDeleteRoom = async (roomId) => {
    try {
      await bookingsService.deleteRoom(roomId);
      toast.success("Room deleted successfully");
      // Refresh rooms data
      const roomsResponse = await bookingsService.getAllRooms();
      setRooms(roomsResponse.data.data || []);
    } catch (error) {
      console.error("Failed to delete room:", error);
      toast.error("Failed to delete room");
    }
  };

  const tabs = [
    { id: "overview", name: "Overview", icon: BarChart3 },
    { id: "bookings", name: "Bookings", icon: Calendar },
    { id: "rooms", name: "Rooms", icon: Hotel },
    { id: "hotels", name: "Hotels", icon: Building },
    { id: "room-types", name: "Room Types", icon: Bed },
    { id: "transaction-logs", name: "Transaction Logs", icon: FileText },
    { id: "settings", name: "Settings", icon: Settings },
  ];

  if (loading && activeTab === "overview") {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <LoadingSpinner text="Loading admin dashboard..." />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Manage your hotel booking system and monitor performance
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <IconComponent className="h-5 w-5" />
                    <span>{tab.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === "overview" && stats && (
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                  title="Total Revenue"
                  value={stats.totalRevenue}
                  icon="revenue"
                  trend={12.5}
                  description="From all successful bookings"
                />
                <StatsCard
                  title="Total Bookings"
                  value={stats.totalBookings}
                  icon="bookings"
                  trend={8.2}
                  description="All time bookings count"
                />
                <StatsCard
                  title="Total Users"
                  value={stats.totalUsers}
                  icon="users"
                  trend={15.3}
                  description="Registered users"
                />
                <StatsCard
                  title="Total Hotels"
                  value={stats.totalHotels}
                  icon="hotels"
                  trend={5.7}
                  description="Registered hotels"
                />
              </div>

              {/* Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Recent Bookings
                  </h3>
                  <div className="space-y-3">
                    {bookings.slice(0, 5).map((booking) => (
                      <div
                        key={booking.id}
                        className="flex items-center justify-between py-2"
                      >
                        <div>
                          <div className="font-medium text-gray-900">
                            {booking.user_name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {booking.room_type} •{" "}
                            {formatCurrency(booking.total_price)}
                          </div>
                        </div>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            booking.status
                          )}`}
                        >
                          {booking.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    System Health
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">
                          Database Connections
                        </span>
                        <span className="font-medium text-green-600">
                          Healthy
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full w-3/4"></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">API Response Time</span>
                        <span className="font-medium text-green-600">Fast</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full w-4/5"></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">
                          Transaction Success Rate
                        </span>
                        <span className="font-medium text-green-600">
                          99.8%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full w-full"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "bookings" && (
            <BookingTable
              bookings={bookings}
              onStatusUpdate={handleBookingStatusUpdate}
            />
          )}

          {activeTab === "rooms" && (
            <RoomManagement
              rooms={rooms}
              hotels={hotels}
              roomTypes={roomTypes}
              onStatusUpdate={handleRoomStatusUpdate}
              onAddRoom={handleAddRoom}
              onEditRoom={handleEditRoom}
              onDeleteRoom={handleDeleteRoom}
            />
          )}

          {activeTab === "transaction-logs" && <TransactionLogs />}

          {activeTab === "hotels" && (
            <HotelManagement
              hotels={hotels}
              onHotelCreate={handleHotelCreate}
              onHotelUpdate={handleHotelUpdate}
              onHotelDelete={handleHotelDelete}
            />
          )}

          {activeTab === "room-types" && (
            <RoomTypeManagement
              roomTypes={roomTypes}
              onRoomTypeCreate={handleRoomTypeCreate}
              onRoomTypeUpdate={handleRoomTypeUpdate}
              onRoomTypeDelete={handleRoomTypeDelete}
            />
          )}

          {activeTab === "settings" && (
            <Setting />
          )}
        </div>
      </div>
    </div>
  );
};

// Helper function for status colors
const getStatusColor = (status) => {
  const colors = {
    PENDING: "bg-yellow-100 text-yellow-800",
    CONFIRMED: "bg-green-100 text-green-800",
    CANCELLED: "bg-red-100 text-red-800",
    COMPLETED: "bg-blue-100 text-blue-800",
    FAILED: "bg-gray-100 text-gray-800",
  };
  return colors[status] || "bg-gray-100 text-gray-800";
};

// Helper function for formatting currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

export default AdminDashboard;