CREATE DATABASE IF NOT EXISTS camprent
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE camprent;

SET NAMES utf8mb4;

CREATE TABLE IF NOT EXISTS users (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(190) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(30) DEFAULT NULL,
    role ENUM('user', 'admin') NOT NULL DEFAULT 'user',
    status ENUM('active', 'inactive', 'blocked') NOT NULL DEFAULT 'active',
    last_login_at DATETIME DEFAULT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_users_email (email),
    KEY idx_users_role_status (role, status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS packages (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    name VARCHAR(120) NOT NULL,
    price INT UNSIGNED NOT NULL,
    capacity TINYINT UNSIGNED NOT NULL,
    description TEXT NOT NULL,
    image VARCHAR(500) NOT NULL,
    status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
    billing_unit ENUM('night', 'trip') NOT NULL DEFAULT 'night',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_packages_name (name),
    KEY idx_packages_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS bbq_menus (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    name VARCHAR(120) NOT NULL,
    description VARCHAR(500) DEFAULT NULL,
    price INT UNSIGNED NOT NULL,
    status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_bbq_menus_name (name),
    KEY idx_bbq_menus_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS bookings (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    booking_code VARCHAR(32) NOT NULL,
    user_id BIGINT UNSIGNED DEFAULT NULL,
    package_id INT UNSIGNED DEFAULT NULL,
    customer_name VARCHAR(120) NOT NULL,
    customer_email VARCHAR(190) NOT NULL,
    customer_phone VARCHAR(30) NOT NULL,
    package_name_snapshot VARCHAR(120) NOT NULL,
    location VARCHAR(190) NOT NULL DEFAULT 'Gunung Bromo, Jawa Timur',
    booking_date_start DATE NOT NULL,
    booking_date_end DATE NOT NULL,
    duration INT UNSIGNED NOT NULL DEFAULT 1,
    duration_unit ENUM('malam', 'perjalanan') NOT NULL DEFAULT 'malam',
    billing_unit ENUM('night', 'trip') NOT NULL DEFAULT 'night',
    guest_count SMALLINT UNSIGNED NOT NULL DEFAULT 1,
    package_price BIGINT UNSIGNED NOT NULL,
    bbq_price BIGINT UNSIGNED NOT NULL DEFAULT 0,
    total BIGINT UNSIGNED NOT NULL,
    notes TEXT DEFAULT NULL,
    status ENUM('Menunggu', 'Dikonfirmasi', 'Diproses', 'Selesai', 'Dibatalkan') NOT NULL DEFAULT 'Menunggu',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_bookings_code (booking_code),
    KEY idx_bookings_user_created (user_id, created_at),
    KEY idx_bookings_status_date (status, booking_date_start),
    CONSTRAINT fk_bookings_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_bookings_package FOREIGN KEY (package_id) REFERENCES packages (id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS booking_bbq_items (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    booking_id BIGINT UNSIGNED NOT NULL,
    bbq_menu_id INT UNSIGNED DEFAULT NULL,
    menu_name_snapshot VARCHAR(120) NOT NULL,
    quantity SMALLINT UNSIGNED NOT NULL DEFAULT 1,
    unit_price BIGINT UNSIGNED NOT NULL,
    subtotal BIGINT UNSIGNED NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_booking_bbq_booking (booking_id),
    CONSTRAINT fk_booking_bbq_booking FOREIGN KEY (booking_id) REFERENCES bookings (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_booking_bbq_menu FOREIGN KEY (bbq_menu_id) REFERENCES bbq_menus (id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS payment_transactions (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    booking_id BIGINT UNSIGNED NOT NULL,
    payment_method ENUM('QRIS', 'Transfer Bank', 'Cash di Lokasi') NOT NULL,
    amount BIGINT UNSIGNED NOT NULL,
    status ENUM('Menunggu Pembayaran', 'Lunas', 'Ditolak', 'Kedaluwarsa') NOT NULL DEFAULT 'Menunggu Pembayaran',
    payment_reference VARCHAR(120) DEFAULT NULL,
    proof_file VARCHAR(500) DEFAULT NULL,
    customer_note TEXT DEFAULT NULL,
    verified_by BIGINT UNSIGNED DEFAULT NULL,
    paid_at DATETIME DEFAULT NULL,
    verified_at DATETIME DEFAULT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_payment_booking_created (booking_id, created_at),
    KEY idx_payment_status (status),
    CONSTRAINT fk_payment_booking FOREIGN KEY (booking_id) REFERENCES bookings (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_payment_verifier FOREIGN KEY (verified_by) REFERENCES users (id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS admin_activity_logs (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    admin_user_id BIGINT UNSIGNED DEFAULT NULL,
    action VARCHAR(80) NOT NULL,
    entity_type VARCHAR(60) NOT NULL,
    entity_id VARCHAR(64) DEFAULT NULL,
    description TEXT DEFAULT NULL,
    ip_address VARCHAR(45) DEFAULT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_admin_logs_user_created (admin_user_id, created_at),
    KEY idx_admin_logs_entity (entity_type, entity_id),
    CONSTRAINT fk_admin_logs_user FOREIGN KEY (admin_user_id) REFERENCES users (id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS app_settings (
    setting_key VARCHAR(100) NOT NULL,
    setting_value TEXT NOT NULL,
    is_public TINYINT(1) NOT NULL DEFAULT 0,
    updated_by BIGINT UNSIGNED DEFAULT NULL,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (setting_key),
    CONSTRAINT fk_settings_user FOREIGN KEY (updated_by) REFERENCES users (id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO users (name, email, password_hash, phone, role)
SELECT 'User CampRent', 'user@camprent.id', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', '081234567890', 'user'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'user@camprent.id');

INSERT INTO users (name, email, password_hash, phone, role)
SELECT 'Administrator', 'admin@camprent.id', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', '081234567891', 'admin'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'admin@camprent.id');

INSERT INTO packages (name, price, capacity, description, image, status, billing_unit)
SELECT 'Solo Backpacker', 95000, 1, 'Paket camping untuk satu orang.', 'img/OIP (2).jpg', 'active', 'night'
WHERE NOT EXISTS (SELECT 1 FROM packages WHERE name = 'Solo Backpacker');

INSERT INTO packages (name, price, capacity, description, image, status, billing_unit)
SELECT 'Ekonomi', 150000, 2, 'Paket camping ekonomis untuk dua orang.', 'img/OIP.jpg', 'active', 'night'
WHERE NOT EXISTS (SELECT 1 FROM packages WHERE name = 'Ekonomi');

INSERT INTO packages (name, price, capacity, description, image, status, billing_unit)
SELECT 'VIP Sunrise', 350000, 2, 'Paket camping dengan pengalaman menikmati sunrise.', 'img/OIP (1).jpg', 'active', 'night'
WHERE NOT EXISTS (SELECT 1 FROM packages WHERE name = 'VIP Sunrise');

INSERT INTO packages (name, price, capacity, description, image, status, billing_unit)
SELECT 'Glamping Luxury', 600000, 4, 'Camping dengan fasilitas glamping yang nyaman.', 'img/OIP.jpg', 'active', 'night'
WHERE NOT EXISTS (SELECT 1 FROM packages WHERE name = 'Glamping Luxury');

INSERT INTO packages (name, price, capacity, description, image, status, billing_unit)
SELECT 'Family Ultimate', 850000, 6, 'Paket camping keluarga dengan fasilitas lengkap.', 'img/OIP (1).jpg', 'active', 'night'
WHERE NOT EXISTS (SELECT 1 FROM packages WHERE name = 'Family Ultimate');

INSERT INTO packages (name, price, capacity, description, image, status, billing_unit)
SELECT 'Jeep Sunrise Bromo', 650000, 4, 'Tur jeep sunrise di Bromo untuk maksimal 4 orang. Tidak termasuk paket camping.', 'img/OIP (2).jpg', 'active', 'trip'
WHERE NOT EXISTS (SELECT 1 FROM packages WHERE name = 'Jeep Sunrise Bromo');

INSERT INTO bbq_menus (name, description, price)
SELECT 'BBQ Chicken', 'Menu ayam BBQ.', 50000
WHERE NOT EXISTS (SELECT 1 FROM bbq_menus WHERE name = 'BBQ Chicken');

INSERT INTO bbq_menus (name, description, price)
SELECT 'BBQ Beef', 'Menu daging sapi BBQ.', 75000
WHERE NOT EXISTS (SELECT 1 FROM bbq_menus WHERE name = 'BBQ Beef');

INSERT INTO bbq_menus (name, description, price)
SELECT 'BBQ Sausage', 'Menu sosis BBQ.', 40000
WHERE NOT EXISTS (SELECT 1 FROM bbq_menus WHERE name = 'BBQ Sausage');

INSERT INTO bbq_menus (name, description, price)
SELECT 'BBQ Package', 'Paket BBQ lengkap.', 150000
WHERE NOT EXISTS (SELECT 1 FROM bbq_menus WHERE name = 'BBQ Package');

INSERT INTO app_settings (setting_key, setting_value, is_public)
SELECT 'business_name', 'CampRent', 1
WHERE NOT EXISTS (SELECT 1 FROM app_settings WHERE setting_key = 'business_name');

INSERT INTO app_settings (setting_key, setting_value, is_public)
SELECT 'business_location', 'Gunung Bromo, Jawa Timur', 1
WHERE NOT EXISTS (SELECT 1 FROM app_settings WHERE setting_key = 'business_location');
