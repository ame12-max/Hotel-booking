import api from "./api";

export const bookingsService = {
  // Search & Availability
  searchHotels: (params) => api.get("/bookings/search/hotels", { params }),

  getAvailableRooms: (params) => api.get("/bookings/available", { params }),

  getRoomDetails: (roomId) => api.get(`/bookings/rooms/${roomId}`),

  // Booking Management
  createBooking: (bookingData) => api.post("/bookings", bookingData),

  getUserBookings: () => api.get("/bookings/my-bookings"),

  cancelBooking: (bookingId) => api.put(`/bookings/${bookingId}/cancel`),

  // Admin endpoints
  getAdminStats: () => api.get("/admin/stats"),

  getAllBookings: () => api.get("/admin/bookings"),

  getTransactionLogs: (params) =>
    api.get("/admin/transaction-logs", { params }),

  // Hotel Management
  getAllHotels: () => api.get("/admin/hotels"),

  createHotel: (hotelData) => api.post("/admin/hotels", hotelData),

  updateHotel: (hotelId, hotelData) =>
    api.put(`/admin/hotels/${hotelId}`, hotelData),
  deleteHotel: (hotelId) => api.delete(`/admin/hotels/${hotelId}`), 

  // Room Management
  getAllRooms: () => api.get("/admin/rooms"),

  createRoom: (roomData) => api.post("/admin/rooms", roomData),

  updateRoom: (roomId, roomData) => api.put(`/admin/rooms/${roomId}`, roomData),

  deleteRoom: (roomId) => api.delete(`/admin/rooms/${roomId}`),

  updateRoomStatus: (roomId, status) =>
    api.put(`/admin/rooms/${roomId}/status`, { status }),

  // Room Type Management
  getAllRoomTypes: () => api.get("/admin/room-types"),

  createRoomType: (roomTypeData) => api.post("/admin/room-types", roomTypeData),

  updateRoomType: (roomTypeId, roomTypeData) =>
    api.put(`/admin/room-types/${roomTypeId}`, roomTypeData),

  deleteRoomType: (roomTypeId) => api.delete(`/admin/room-types/${roomTypeId}`),

  // Booking Status Management
  updateBookingStatus: (bookingId, status) =>
    api.put(`/admin/bookings/${bookingId}/status`, { status }),
};
