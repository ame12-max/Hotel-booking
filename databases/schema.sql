DROP DATABASE IF EXISTS hotel_booking;
CREATE DATABASE hotel_booking ;
USE hotel_booking;

-- Users table
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(50),
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('USER','ADMIN') DEFAULT 'USER',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Hotels table
CREATE TABLE hotels (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  country VARCHAR(100),
  zip_code VARCHAR(20),
  rating DECIMAL(2,1),
  description TEXT,
  amenities JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Room types table
CREATE TABLE room_types (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  capacity INT NOT NULL,
  base_price DECIMAL(10,2) NOT NULL,
  amenities JSON,
  size_sqft INT,
  bed_type VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Rooms table
-- i use hotel id as as a forign key
CREATE TABLE rooms (
  id INT AUTO_INCREMENT PRIMARY KEY,
  hotel_id INT NOT NULL,
  room_type_id INT NOT NULL,
  room_number VARCHAR(50) NOT NULL,
  floor INT,
  status ENUM('AVAILABLE','OCCUPIED','MAINTENANCE','CLEANING') DEFAULT 'AVAILABLE',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_rooms_hotel FOREIGN KEY (hotel_id) REFERENCES hotels(id) ON DELETE CASCADE,
  CONSTRAINT fk_rooms_type FOREIGN KEY (room_type_id) REFERENCES room_types(id) ON DELETE RESTRICT,
  UNIQUE KEY uk_hotel_room (hotel_id, room_number),
  INDEX idx_hotel_status (hotel_id, status)
) ENGINE=InnoDB;

-- Bookings table
CREATE TABLE bookings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  room_id INT NOT NULL,
  checkin_date DATE NOT NULL,
  checkout_date DATE NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  status ENUM('PENDING','CONFIRMED','CANCELLED','COMPLETED','FAILED') DEFAULT 'PENDING',
  guest_count INT DEFAULT 1,
  special_requests TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_bookings_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_bookings_room FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE RESTRICT,
  INDEX idx_room_dates (room_id, checkin_date, checkout_date),
  INDEX idx_user_status (user_id, status),
  INDEX idx_dates_status (checkin_date, checkout_date, status),
  CHECK (checkout_date > checkin_date)
) ENGINE=InnoDB;

-- Payments table
CREATE TABLE payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  booking_id INT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  method ENUM('CREDIT_CARD','DEBIT_CARD','PAYPAL','BANK_TRANSFER') NOT NULL,
  status ENUM('PENDING','SUCCESS','FAILED','REFUNDED','CANCELLED') DEFAULT 'PENDING',
  transaction_ref VARCHAR(255) UNIQUE,
  payment_details JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_payments_booking FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
  INDEX idx_booking_status (booking_id, status),
  INDEX idx_transaction_ref (transaction_ref)
) ENGINE=InnoDB;

-- Transaction audit log table
CREATE TABLE transaction_log (
  id INT AUTO_INCREMENT PRIMARY KEY,
  booking_id INT,
  user_id INT,
  action VARCHAR(100) NOT NULL,
  table_name VARCHAR(50),
  record_id INT,
  old_values JSON,
  new_values JSON,
  details TEXT,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_txn_booking FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE SET NULL,
  CONSTRAINT fk_txn_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_action_created (action, created_at),
  INDEX idx_booking_created (booking_id, created_at)
) ENGINE=InnoDB;

-- Stored Procedure for Atomic Booking
DELIMITER $$

CREATE PROCEDURE sp_create_booking(
  IN p_user_id INT,
  IN p_room_id INT,
  IN p_checkin_date DATE,
  IN p_checkout_date DATE,
  IN p_total_price DECIMAL(10,2),
  IN p_guest_count INT,
  IN p_special_requests TEXT,
  IN p_payment_method ENUM('CREDIT_CARD','DEBIT_CARD','PAYPAL','BANK_TRANSFER'),
  OUT p_booking_id BIGINT,
  OUT p_success BOOLEAN,
  OUT p_message VARCHAR(255)
)
BEGIN
  DECLARE v_room_exists INT DEFAULT 0;
  DECLARE v_overlapping_bookings INT DEFAULT 0;
  DECLARE v_booking_count INT DEFAULT 0;
  DECLARE EXIT HANDLER FOR SQLEXCEPTION
  BEGIN
    ROLLBACK;
    SET p_success = FALSE;
    SET p_message = 'Database error occurred';
  END;

  START TRANSACTION;

  -- Lock the room for update
  SELECT COUNT(*) INTO v_room_exists 
  FROM rooms 
  WHERE id = p_room_id AND status = 'AVAILABLE'
  FOR UPDATE;

  IF v_room_exists = 0 THEN
    ROLLBACK;
    SET p_success = FALSE;
    SET p_message = 'Room not available or does not exist';
  ELSE
    -- Check for overlapping bookings
    SELECT COUNT(*) INTO v_overlapping_bookings
    FROM bookings
    WHERE room_id = p_room_id 
      AND status IN ('PENDING', 'CONFIRMED')
      AND NOT (p_checkout_date <= checkin_date OR p_checkin_date >= checkout_date);

    IF v_overlapping_bookings > 0 THEN
      ROLLBACK;
      SET p_success = FALSE;
      SET p_message = 'Room already booked for selected dates';
    ELSE
      -- Create booking
      INSERT INTO bookings (
        user_id, room_id, checkin_date, checkout_date, 
        total_price, guest_count, special_requests, status
      ) VALUES (
        p_user_id, p_room_id, p_checkin_date, p_checkout_date,
        p_total_price, p_guest_count, p_special_requests, 'CONFIRMED'
      );

      SET p_booking_id = LAST_INSERT_ID();

      -- Create payment record
      INSERT INTO payments (
        booking_id, amount, method, status, transaction_ref
      ) VALUES (
        p_booking_id, p_total_price, p_payment_method, 'SUCCESS', 
        CONCAT('TXN-', UNIX_TIMESTAMP(), '-', p_booking_id)
      );

      -- Update room status
      UPDATE rooms SET status = 'OCCUPIED' WHERE id = p_room_id;

      -- Log transaction
      INSERT INTO transaction_log (
        booking_id, user_id, action, table_name, record_id, details
      ) VALUES (
        p_booking_id, p_user_id, 'BOOKING_CREATED', 'bookings', p_booking_id,
        CONCAT('Booking created for room ', p_room_id, ' from ', p_checkin_date, ' to ', p_checkout_date)
      );

      COMMIT;
      SET p_success = TRUE;
      SET p_message = 'Booking created successfully';
    END IF;
  END IF;
END$$

DELIMITER ;

