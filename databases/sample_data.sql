-- Ethiopian Hotels Sample Data
INSERT INTO hotels (name, address, city, state, country, zip_code, rating, description, amenities) VALUES
('Sheraton Addis', 'Taitu Street', 'Addis Ababa', 'Addis Ababa', 'Ethiopia', '1000', 4.8, 
 'Luxury hotel in the heart of Addis Ababa with panoramic city views', 
 '["WiFi", "Pool", "Spa", "Gym", "Restaurant", "Bar", "Conference Rooms"]'),
 
('Hilton Addis Ababa', 'Menelik II Avenue', 'Addis Ababa', 'Addis Ababa', 'Ethiopia', '1000', 4.6,
 'Iconic hotel located in the commercial heart of the city',
 '["WiFi", "Pool", "Spa", "Business Center", "Multiple Restaurants"]'),
 
('Radisson Blu Hotel', 'Kazanchis Business District', 'Addis Ababa', 'Addis Ababa', 'Ethiopia', '1000', 4.5,
 'Modern hotel in Addis Ababa''s business district',
 '["WiFi", "Pool", "Fitness Center", "Restaurant", "Airport Shuttle"]'),
 
('Jupiter International Hotel', 'Cazanchis', 'Addis Ababa', 'Addis Ababa', 'Ethiopia', '1000', 4.2,
 'Comfortable hotel with excellent service and amenities',
 '["WiFi", "Restaurant", "Bar", "Conference Facilities"]'),
 
('Elilly International Hotel', 'African Avenue', 'Addis Ababa', 'Addis Ababa', 'Ethiopia', '1000', 4.3,
 'Contemporary hotel offering modern comforts',
 '["WiFi", "Pool", "Spa", "Gym", "Restaurant"]'),
 
('Skylight Hotel', 'Bole International Airport', 'Addis Ababa', 'Addis Ababa', 'Ethiopia', '1000', 4.7,
 'Ethiopian Airlines premier hotel near the airport',
 '["WiFi", "Pool", "Spa", "Multiple Restaurants", "Airport Shuttle"]'),
 
('Ghion Hotel', 'Ras Desta Damtew Street', 'Addis Ababa', 'Addis Ababa', 'Ethiopia', '1000', 4.0,
 'Historic hotel with beautiful gardens and traditional architecture',
 '["WiFi", "Gardens", "Restaurant", "Cultural Shows"]'),
 
('Capital Hotel and Spa', 'Haile Gebreselassie Road', 'Addis Ababa', 'Addis Ababa', 'Ethiopia', '1000', 4.4,
 'Boutique hotel with luxurious spa facilities',
 '["WiFi", "Spa", "Fitness Center", "Restaurant", "Pool"]'),
 
('Saba Hotel', 'Megenagna', 'Addis Ababa', 'Addis Ababa', 'Ethiopia', '1000', 4.1,
 'Modern hotel in the bustling Megenagna area',
 '["WiFi", "Restaurant", "Bar", "Conference Rooms"]'),
 
('Atlas Hotel', 'Bole Road', 'Addis Ababa', 'Addis Ababa', 'Ethiopia', '1000', 4.2,
 'Contemporary hotel with excellent dining options',
 '["WiFi", "Restaurant", "Bar", "Fitness Center"]');

-- Add rooms for Sheraton Addis (hotel_id = 3)
INSERT INTO rooms (hotel_id, room_type_id, room_number, floor, status) VALUES
(3, 1, '101', 1, 'AVAILABLE'),
(3, 1, '102', 1, 'AVAILABLE'),
(3, 1, '103', 1, 'AVAILABLE'),
(3, 2, '201', 2, 'AVAILABLE'),
(3, 2, '202', 2, 'AVAILABLE'),
(3, 3, '301', 3, 'AVAILABLE'),
(3, 3, '302', 3, 'AVAILABLE');

-- Add rooms for Hilton Addis Ababa (hotel_id = 4)
INSERT INTO rooms (hotel_id, room_type_id, room_number, floor, status) VALUES
(4, 1, '101', 1, 'AVAILABLE'),
(4, 1, '102', 1, 'AVAILABLE'),
(4, 2, '201', 2, 'AVAILABLE'),
(4, 2, '202', 2, 'AVAILABLE'),
(4, 3, '301', 3, 'AVAILABLE'),
(4, 3, '302', 3, 'AVAILABLE');

-- Add rooms for other hotels...
INSERT INTO rooms (hotel_id, room_type_id, room_number, floor, status) VALUES
(5, 1, '101', 1, 'AVAILABLE'),
(5, 1, '102', 1, 'AVAILABLE'),
(6, 1, '101', 1, 'AVAILABLE'),
(6, 2, '201', 2, 'AVAILABLE'),
(7, 1, '101', 1, 'AVAILABLE'),
(8, 1, '101', 1, 'AVAILABLE'),
(9, 1, '101', 1, 'AVAILABLE'),
(10, 1, '101', 1, 'AVAILABLE'),
(11, 1, '101', 1, 'AVAILABLE'),
(12, 1, '101', 1, 'AVAILABLE');