import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';
let authToken = '';
let adminToken = '';

async function testEndpoint(method, url, data = null, token = null, description = '') {
  const config = {
    method,
    url: `${API_BASE}${url}`,
    headers: {}
  };

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (data && (method === 'post' || method === 'put')) {
    config.data = data;
  }

  if (data && method === 'get') {
    config.params = data;
  }

  try {
    console.log(`\n🔍 Testing: ${description}`);
    console.log(`${method.toUpperCase()} ${url}`);
    
    const response = await axios(config);
    console.log(`✅ SUCCESS: ${response.status}`);
    console.log('Response:', response.data);
    
    return response.data;
  } catch (error) {
    console.log(`❌ FAILED: ${error.response?.status || error.code}`);
    console.log('Error:', error.response?.data || error.message);
    return null;
  }
}

async function runAllTests() {
  console.log('🚀 Starting Comprehensive API Tests...\n');

  // 1. Test Public Endpoints
  console.log('📋 ========== PUBLIC ENDPOINTS ==========');
  
  await testEndpoint('get', '/health', null, null, 'Health Check');
  await testEndpoint('get', '/bookings/search/hotels', { city: 'New York' }, null, 'Search Hotels');
  await testEndpoint('get', '/bookings/available', { 
    hotelId: 1, 
    checkinDate: '2024-01-15', 
    checkoutDate: '2024-01-20' 
  }, null, 'Available Rooms');
  await testEndpoint('get', '/bookings/rooms/1', null, null, 'Room Details');

  // 2. Test User Authentication
  console.log('\n🔐 ========== AUTHENTICATION ==========');
  
  const registerResponse = await testEndpoint('post', '/auth/register', {
    name: 'Test User',
    email: `testuser${Date.now()}@example.com`,
    phone: '+1234567890',
    password: 'password123'
  }, null, 'User Registration');

  if (registerResponse) {
    authToken = registerResponse.token;
  }

  const loginResponse = await testEndpoint('post', '/auth/login', {
    email: 'john@example.com',
    password: 'password123'
  }, null, 'User Login');

  if (loginResponse) {
    authToken = loginResponse.token;
  }

  // 3. Test Protected User Endpoints
  console.log('\n👤 ========== USER ENDPOINTS ==========');
  
  await testEndpoint('get', '/auth/profile', null, authToken, 'User Profile');
  await testEndpoint('get', '/bookings/my-bookings', null, authToken, 'My Bookings');

  // Test booking creation if rooms are available
  const availableRooms = await testEndpoint('get', '/bookings/available', {
    hotelId: 1,
    checkinDate: '2024-02-01',
    checkoutDate: '2024-02-03'
  }, null, 'Check Available Rooms for Booking');

  if (availableRooms && availableRooms.data.length > 0) {
    const bookingResponse = await testEndpoint('post', '/bookings', {
      roomId: availableRooms.data[0].id,
      checkinDate: '2024-02-01',
      checkoutDate: '2024-02-03',
      guestCount: 2,
      paymentMethod: 'CREDIT_CARD'
    }, authToken, 'Create Booking');

    // Test cancel booking if booking was created
    if (bookingResponse && bookingResponse.bookingId) {
      await testEndpoint('put', `/bookings/${bookingResponse.bookingId}/cancel`, null, authToken, 'Cancel Booking');
    }
  }

  // 4. Test Admin Endpoints
  console.log('\n👨‍💼 ========== ADMIN ENDPOINTS ==========');
  
  // Login as admin
  const adminLogin = await testEndpoint('post', '/auth/login', {
    email: 'admin@hotel.com',
    password: 'admin123'
  }, null, 'Admin Login');

  if (adminLogin) {
    adminToken = adminLogin.token;

    await testEndpoint('get', '/admin/stats', null, adminToken, 'Admin Stats');
    await testEndpoint('get', '/admin/bookings', null, adminToken, 'All Bookings');
    await testEndpoint('get', '/admin/transaction-logs', null, adminToken, 'Transaction Logs');
    await testEndpoint('get', '/admin/hotels', null, adminToken, 'All Hotels');
    await testEndpoint('get', '/admin/room-types', null, adminToken, 'All Room Types');
    await testEndpoint('get', '/admin/rooms', null, adminToken, 'All Rooms');

    // Test room status update
    await testEndpoint('put', '/admin/rooms/1/status', { status: 'MAINTENANCE' }, adminToken, 'Update Room Status');
    await testEndpoint('put', '/admin/rooms/1/status', { status: 'AVAILABLE' }, adminToken, 'Restore Room Status');
  }

  console.log('\n🎉 ========== ALL TESTS COMPLETED ==========');
}

runAllTests().catch(console.error);