CREATE DATABASE IF NOT EXISTS bondor_bati_site
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE bondor_bati_site;

SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS menu_items (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    day_index TINYINT UNSIGNED NOT NULL,
    day_name VARCHAR(50) NOT NULL,
    tier ENUM('standard', 'premium') NOT NULL,
    name VARCHAR(160) NOT NULL,
    description VARCHAR(500) NOT NULL,
    price INT UNSIGNED NOT NULL,
    emoji VARCHAR(16) NOT NULL DEFAULT '🍱',
    is_available BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT chk_menu_day CHECK (day_index BETWEEN 0 AND 5),
    CONSTRAINT chk_menu_price CHECK (price > 0),
    UNIQUE KEY uq_menu_day_tier (day_index, tier),
    KEY idx_menu_availability (is_available, day_index)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS orders (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    order_number VARCHAR(32) NOT NULL,
    customer_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    address VARCHAR(500) NOT NULL,
    delivery_date DATE NOT NULL,
    plan_days TINYINT UNSIGNED NOT NULL DEFAULT 1,
    notes VARCHAR(500) NULL,
    subtotal INT UNSIGNED NOT NULL,
    delivery_fee INT UNSIGNED NOT NULL DEFAULT 0,
    total INT UNSIGNED NOT NULL,
    status ENUM('pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled') NOT NULL DEFAULT 'pending',
    idempotency_key VARCHAR(80) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uq_order_number (order_number),
    UNIQUE KEY uq_order_idempotency (idempotency_key),
    KEY idx_order_tracking (order_number, phone),
    KEY idx_order_delivery (delivery_date, status)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS order_items (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT UNSIGNED NOT NULL,
    menu_item_id BIGINT UNSIGNED NULL,
    item_name VARCHAR(160) NOT NULL,
    tier VARCHAR(20) NOT NULL,
    unit_price INT UNSIGNED NOT NULL,
    quantity SMALLINT UNSIGNED NOT NULL,
    plan_days TINYINT UNSIGNED NOT NULL DEFAULT 1,
    line_total INT UNSIGNED NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_order_items_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    CONSTRAINT fk_order_items_menu FOREIGN KEY (menu_item_id) REFERENCES menu_items(id) ON DELETE SET NULL,
    CONSTRAINT chk_order_item_quantity CHECK (quantity BETWEEN 1 AND 20),
    KEY idx_order_items_order (order_id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS success_stories (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    client_name VARCHAR(100) NOT NULL,
    avatar_url VARCHAR(500) NULL DEFAULT NULL,
    rating TINYINT UNSIGNED NOT NULL DEFAULT 5,
    content TEXT NOT NULL,
    is_visible BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT chk_rating CHECK (rating BETWEEN 1 AND 5)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS catering_bookings (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    booking_number VARCHAR(32) NOT NULL,
    menu_name VARCHAR(160) NOT NULL,
    guest_count SMALLINT UNSIGNED NOT NULL DEFAULT 30,
    client_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    event_date DATETIME NOT NULL,
    venue VARCHAR(500) NOT NULL,
    notes TEXT NULL,
    status ENUM('pending', 'confirmed', 'completed', 'cancelled') NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uq_booking_number (booking_number),
    KEY idx_catering_status (status),
    KEY idx_catering_event (event_date)
) ENGINE=InnoDB;

-- ── Seed menu items (safe upsert) ────────────────────────────────────────────
INSERT INTO menu_items (day_index, day_name, tier, name, description, price, emoji, is_available) VALUES
  (0, 'শনি', 'standard', 'সোনালী মুরগি ভুনা', 'ভাত (মিনিকেট), সোনালী মুরগি ভুনা, ভর্তা/ভাজি, ঘন ডাল, সালাদ।', 135, '🍗', 1),
  (0, 'শনি', 'premium', 'সোনালী মুরগি ভুনা (Special)', 'ভাত (মিনিকেট), সোনালী মুরগি ভুনা, ভর্তা, ভাজি, ডাল ভুনা, সালাদ।', 180, '🍗', 1),
  (1, 'রবি', 'standard', 'রুই মাছের ভুনা', 'ভাত (মিনিকেট), রুই মাছের ভুনা, ভাজি/ভর্তা, ঘন ডাল, সালাদ।', 135, '🐟', 1),
  (1, 'রবি', 'premium', 'রুই মাছের ভুনা (Special)', 'ভাত (মিনিকেট), রুই মাছের ভুনা, ভাজি, ভর্তা, ডাল ভুনা, সালাদ।', 180, '🐟', 1),
  (2, 'সোম', 'standard', 'সোনালি মুরগির ভুনা', 'ভাত (মিনিকেট), সোনালি মুরগির ভুনা, ভাজি/ভর্তা, ঘন ডাল, সালাদ।', 135, '🍗', 1),
  (2, 'সোম', 'premium', 'সোনালি মুরগির ভুনা (Special)', 'ভাত (মিনিকেট), সোনালি মুরগির ভুনা, ভাজি, ভর্তা, ডাল ভুনা, সালাদ।', 180, '🍗', 1),
  (3, 'মঙ্গল', 'standard', 'তেলাপিয়া মাছের ভুনা', 'ভাত (মিনিকেট), বড় তেলাপিয়া মাছের ভুনা, ভর্তা/ভাজি, ঘন ডাল, সালাদ।', 135, '🐠', 1),
  (3, 'মঙ্গল', 'premium', 'পাবদা মাছের ভুনা', 'ভাত (মিনিকেট), পাবদা মাছের ভুনা, ভর্তা, ভাজি, ডাল ভুনা, সালাদ।', 180, '🐠', 1),
  (4, 'বুধ', 'standard', 'রুই মাছের ডিমের ভুনা', 'ভাত (মিনিকেট), রুই মাছের ডিমের ভুনা, ভর্তা/ভাজি, ঘন ডাল, সালাদ।', 135, '🍲', 1),
  (4, 'বুধ', 'premium', 'রুই মাছের ডিমের ভুনা (Special)', 'ভাত (মিনিকেট), রুই মাছের ডিমের ভুনা, ভর্তা, ভাজি, ডাল ভুনা, সালাদ।', 180, '🍲', 1),
  (5, 'বৃহস্পতি', 'standard', 'মেজবানি গরুর মাংস', 'ভাত (মিনিকেট), মেজবানি গরুর মাংস বা সোনালি মুরগির ভুনা, ঘন ডাল, সালাদ।', 135, '🥩', 1),
  (5, 'বৃহস্পতি', 'premium', 'মেজবানি গরুর মাংস (Special)', 'ভাত (মিনিকেট), মেজবানি গরুর মাংস বা সোনালি মুরগির ভুনা, ডাল ভুনা, সালাদ।', 180, '🥩', 1)
ON DUPLICATE KEY UPDATE
  day_name    = VALUES(day_name),
  name        = VALUES(name),
  description = VALUES(description),
  price       = VALUES(price),
  emoji       = VALUES(emoji);

-- ── Seed sample success stories ───────────────────────────────────────────────
INSERT IGNORE INTO success_stories (id, client_name, rating, content, is_visible) VALUES
  (1, 'Sadia Rahman', 5, 'The Bride Menu was an absolute hit at our wedding! The whole roasted lamb was cooked to perfection and the presentation was exactly what we wanted.', 1),
  (2, 'Tanvir Ahmed', 5, 'Bondor Bati''s Weekly Tiffin feels like a warm hug from home. Authentic Chittagong flavors that I can enjoy at my office desk. Highly recommended!', 1),
  (3, 'Fahim Hasan', 5, 'Ordered the Box Menu for our corporate event (50 pax). Smooth delivery, hot food, and everyone loved the Kacchi Biriyani!', 1);

-- ── Catering Menus (Event packages) ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS catering_menus (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    category ENUM('regular', 'premium', 'holud', 'bride', 'box') NOT NULL DEFAULT 'regular',
    badge_text VARCHAR(50) NOT NULL DEFAULT '',
    title VARCHAR(160) NOT NULL,
    items TEXT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    KEY idx_catering_category (category, is_active)
) ENGINE=InnoDB;

INSERT IGNORE INTO catering_menus (id, category, badge_text, title, items, is_active) VALUES
  (1, 'regular', 'REG-1', 'Traditional Feast', 'Plain Polao, Chicken Roast, Beef Rezala, Borhani, Firni, Salad', 1),
  (2, 'premium', 'PREM-1', 'Chittagong Heritage', 'Kacchi Biriyani, Chicken Roast, Beef Kala Bhuna, Borhani, Jorda, Salad', 1),
  (3, 'holud', 'HLD-1', 'Holud Special Platter', 'Khichuri, Fried Hilsha, Begun Bhaja, Chicken Roast, Chutney, Payesh', 1),
  (4, 'bride', 'BRD-1', 'Royal Wedding Package', 'Basmati Kacchi Biriyani, Whole Roast Lamb, Chicken Roast, Shahi Tikka, Borhani, Firni, Paan Platter', 1),
  (5, 'box', 'BOX-1', 'Executive Box Meal', 'Chicken Biriyani / Polao, Chicken Roast, Egg, Salad, Borhani, Water', 1);

-- ── Admin Users ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS admins (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(120) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('superadmin', 'manager') NOT NULL DEFAULT 'manager',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uq_admin_username (username),
    UNIQUE KEY uq_admin_email (email),
    KEY idx_admin_status (is_active)
) ENGINE=InnoDB;

-- Default superadmin user (admin / admin123)
-- bcrypt hash for 'admin123' is $2a$10$w8Pj5fC/5z6bL8XlTqk3g.mG09jIeqzQkF03iE6rI9d7aB1a8pTje (or compatible)
INSERT IGNORE INTO admins (id, name, username, email, password_hash, role, is_active) VALUES
  (1, 'Super Administrator', 'admin', 'admin@bondorbati.com', '$2a$10$N.ZpS0b6LkVqYxG2W2pQae8U51/0h15rP4f4lQGzWj2Qj7xYt26jW', 'superadmin', 1);

-- ── Marquee Scrolling Bar Notices ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS marquee_notices (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    text VARCHAR(255) NOT NULL,
    icon VARCHAR(32) NOT NULL DEFAULT '📢',
    display_order INT UNSIGNED NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    KEY idx_marquee_active (is_active, display_order)
) ENGINE=InnoDB;

INSERT IGNORE INTO marquee_notices (id, text, icon, display_order, is_active) VALUES
  (1, 'Order Cut-off Time: 10:00 PM for Next Day Lunch', '⏰', 1, 1),
  (2, 'Serving specific delivery zones in Dhaka', '🚚', 2, 1),
  (3, 'Authentic Chittagong Heritage Cuisine', '🍱', 3, 1);

