-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: bondor_bati_site
-- ------------------------------------------------------
-- Server version	10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `admins`
--

DROP TABLE IF EXISTS `admins`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `admins` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('superadmin','manager') NOT NULL DEFAULT 'manager',
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_admin_username` (`username`),
  UNIQUE KEY `uq_admin_email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admins`
--

LOCK TABLES `admins` WRITE;
/*!40000 ALTER TABLE `admins` DISABLE KEYS */;
INSERT INTO `admins` VALUES (1,'Super Admin','admin','admin@bondorbati_site.com','$2y$10$0gVr/gubmrtMjt4FG/kXtO51pk9Sc2.tC/gs7Fr/rfLbctfvVRmnq','superadmin',1,'2026-10-02 21:44:12','2026-10-02 22:00:19'),(3,'Jihan','jihan','jihan@bondorbati.com','$2y$10$gcWms5qBOWIQCQB34BMTXuSAH02qU2tPyVycd/QTQyWKuTuRPr8zm','superadmin',1,'2026-10-02 21:55:54','2026-10-02 21:55:54');
/*!40000 ALTER TABLE `admins` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `catering_bookings`
--

DROP TABLE IF EXISTS `catering_bookings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `catering_bookings` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `booking_number` varchar(32) NOT NULL,
  `menu_name` varchar(160) NOT NULL,
  `guest_count` smallint(5) unsigned NOT NULL DEFAULT 30,
  `client_name` varchar(100) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `event_date` datetime NOT NULL,
  `venue` varchar(500) NOT NULL,
  `notes` text DEFAULT NULL,
  `status` enum('pending','confirmed','completed','cancelled') NOT NULL DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_booking_number` (`booking_number`),
  KEY `idx_catering_status` (`status`),
  KEY `idx_catering_event` (`event_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `catering_bookings`
--

LOCK TABLES `catering_bookings` WRITE;
/*!40000 ALTER TABLE `catering_bookings` DISABLE KEYS */;
/*!40000 ALTER TABLE `catering_bookings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `catering_menus`
--

DROP TABLE IF EXISTS `catering_menus`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `catering_menus` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `category` varchar(50) NOT NULL,
  `badge_text` varchar(50) NOT NULL,
  `title` varchar(160) NOT NULL,
  `items` text NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `catering_menus`
--

LOCK TABLES `catering_menus` WRITE;
/*!40000 ALTER TABLE `catering_menus` DISABLE KEYS */;
INSERT INTO `catering_menus` VALUES (1,'regular','MENU 1','Saffron Polao Menu','Saffron Polao\nChicken Tandoori / Chicken Roast\nMutton / Beef / Chicken Rezala\nChicken Jali Kabab / Shami Kabab\nSeasonal piece salad\nDessert: Shahi Zarda / Firni\nBeverage: Fresh Yogurt Borhani',1,'2026-10-03 05:47:20','2026-10-03 05:47:20'),(2,'regular','MENU 2','Beef Kaliya Menu','Plain Polao\nBeef Kaliya\nChicken Roast\nChicken Jali Kabab / Shami Kabab\nSeasonal piece salad\nDessert: Shahi Zarda / Firni\nBeverage: Fresh Yogurt Borhani',1,'2026-10-03 05:47:20','2026-10-03 05:47:20'),(3,'regular','MENU 3','Classic Rezala Menu','Plain Polao\nMutton / Beef / Chicken Rezala\nChicken Roast\nChicken Jali Kabab / Shami Kabab\nSeasonal piece salad\nDessert: Shahi Zarda / Firni\nBeverage: Fresh Yogurt Borhani',1,'2026-10-03 05:47:20','2026-10-03 05:47:20'),(4,'premium','PREMIUM 4','Shahi Mutton Kacchi','Shahi Mutton Kacchi Biriyani\nChicken Tandoori / Chicken Roast\nShahi Sheermal Roti / Chapati\nBeef Kaliya / Chicken Karahi Gosht\nAloo-Bokharar Chatney\nSeasonal piece salad\nDessert & Beverage included',1,'2026-10-03 05:47:20','2026-10-03 05:47:20');
/*!40000 ALTER TABLE `catering_menus` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `menu_items`
--

DROP TABLE IF EXISTS `menu_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `menu_items` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `day_index` tinyint(3) unsigned NOT NULL,
  `day_name` varchar(50) NOT NULL,
  `tier` enum('standard','premium') NOT NULL,
  `name` varchar(160) NOT NULL,
  `description` varchar(500) NOT NULL,
  `price` int(10) unsigned NOT NULL,
  `emoji` varchar(16) NOT NULL DEFAULT '?',
  `is_available` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_menu_day_tier` (`day_index`,`tier`),
  KEY `idx_menu_availability` (`is_available`,`day_index`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `menu_items`
--

LOCK TABLES `menu_items` WRITE;
/*!40000 ALTER TABLE `menu_items` DISABLE KEYS */;
INSERT INTO `menu_items` VALUES (1,0,'শনি','standard','সোনালী মুরগি ভুনা','ভাত (মিনিকেট), সোনালী মুরগি ভুনা, ভর্তা/ভাজি, ঘন ডাল, সালাদ।',135,'🍗',1,'2026-08-25 14:38:40','2026-08-25 14:38:40'),(2,0,'শনি','premium','সোনালী মুরগি ভু','ভাত (মিনিকেট), সোনালী মুরগি ভুনা, ভর্তা, ভাজি, ডাল ভুনা, সালাদ।',180,'🍗',1,'2026-08-25 14:38:40','2026-08-25 15:11:57'),(3,1,'রবি','standard','রুই মাছের ভুনা','ভাত (মিনিকেট), রুই মাছের ভুনা, ভাজি/ভর্তা, ঘন ডাল, সালাদ।',135,'🐟',1,'2026-08-25 14:38:40','2026-08-25 14:38:40'),(4,1,'রবি','premium','রুই মাছের ভুনা (Special)','ভাত (মিনিকেট), রুই মাছের ভুনা, ভাজি, ভর্তা, ডাল ভুনা, সালাদ।',180,'🐟',1,'2026-08-25 14:38:40','2026-08-25 14:38:40'),(5,2,'সোম','standard','সোনালি মুরগির ভুনা','ভাত (মিনিকেট), সোনালি মুরগির ভুনা, ভাজি/ভর্তা, ঘন ডাল, সালাদ।',135,'🍗',1,'2026-08-25 14:38:40','2026-08-25 14:38:40'),(6,2,'সোম','premium','সোনালি মুরগির ভুনা (Special)','ভাত (মিনিকেট), সোনালি মুরগির ভুনা, ভাজি, ভর্তা, ডাল ভুনা, সালাদ।',180,'🍗',1,'2026-08-25 14:38:40','2026-08-25 14:38:40'),(7,3,'মঙ্গল','standard','তেলাপিয়া মাছের ভুনা','ভাত (মিনিকেট), বড় তেলাপিয়া মাছের ভুনা, ভর্তা/ভাজি, ঘন ডাল, সালাদ।',135,'🐠',1,'2026-08-25 14:38:40','2026-08-25 14:38:40'),(8,3,'মঙ্গল','premium','পাবদা মাছের ভুনা','ভাত (মিনিকেট), পাবদা মাছের ভুনা, ভর্তা, ভাজি, ডাল ভুনা, সালাদ।',180,'🐠',1,'2026-08-25 14:38:40','2026-08-25 14:38:40'),(9,4,'বুধ','standard','রুই মাছের ডিমের ভুনা','ভাত (মিনিকেট), রুই মাছের ডিমের ভুনা, ভর্তা/ভাজি, ঘন ডাল, সালাদ।',135,'🍲',1,'2026-08-25 14:38:40','2026-08-25 14:38:40'),(10,4,'বুধ','premium','রুই মাছের ডিমের ভুনা (Special)','ভাত (মিনিকেট), রুই মাছের ডিমের ভুনা, ভর্তা, ভাজি, ডাল ভুনা, সালাদ।',180,'🍲',1,'2026-08-25 14:38:40','2026-08-25 14:38:40'),(11,5,'বৃহস্পতি','standard','মেজবানি গরুর মাংস','ভাত (মিনিকেট), মেজবানি গরুর মাংস বা সোনালি মুরগির ভুনা, ঘন ডাল, সালাদ।',135,'🥩',1,'2026-08-25 14:38:40','2026-08-25 14:38:40'),(12,5,'বৃহস্পতি','premium','মেজবানি গরুর মাংস (Special)','ভাত (মিনিকেট), মেজবানি গরুর মাংস বা সোনালি মুরগির ভুনা, ডাল ভুনা, সালাদ।',180,'🥩',1,'2026-08-25 14:38:40','2026-08-25 14:38:40');
/*!40000 ALTER TABLE `menu_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `order_items` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `order_id` bigint(20) unsigned NOT NULL,
  `menu_item_id` bigint(20) unsigned DEFAULT NULL,
  `item_name` varchar(160) NOT NULL,
  `tier` varchar(20) NOT NULL,
  `unit_price` int(10) unsigned NOT NULL,
  `quantity` smallint(5) unsigned NOT NULL,
  `line_total` int(10) unsigned NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `fk_order_items_menu` (`menu_item_id`),
  KEY `idx_order_items_order` (`order_id`),
  CONSTRAINT `fk_order_items_menu` FOREIGN KEY (`menu_item_id`) REFERENCES `menu_items` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_order_items_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `orders` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `order_number` varchar(32) NOT NULL,
  `customer_name` varchar(100) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `address` varchar(500) NOT NULL,
  `delivery_date` date NOT NULL,
  `notes` varchar(500) DEFAULT NULL,
  `subtotal` int(10) unsigned NOT NULL,
  `delivery_fee` int(10) unsigned NOT NULL DEFAULT 0,
  `total` int(10) unsigned NOT NULL,
  `status` enum('pending','confirmed','preparing','out_for_delivery','delivered','cancelled') NOT NULL DEFAULT 'pending',
  `idempotency_key` varchar(80) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_order_number` (`order_number`),
  UNIQUE KEY `uq_order_idempotency` (`idempotency_key`),
  KEY `idx_order_tracking` (`order_number`,`phone`),
  KEY `idx_order_delivery` (`delivery_date`,`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `success_stories`
--

DROP TABLE IF EXISTS `success_stories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `success_stories` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `client_name` varchar(100) NOT NULL,
  `rating` tinyint(3) unsigned NOT NULL DEFAULT 5,
  `content` varchar(1000) NOT NULL,
  `is_visible` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `success_stories`
--

LOCK TABLES `success_stories` WRITE;
/*!40000 ALTER TABLE `success_stories` DISABLE KEYS */;
INSERT INTO `success_stories` VALUES (1,'Ahmed Hasan',5,'The authentic Chittagong flavor I\'ve been looking for! The beef mezbani was absolutely incredible and the delivery was right on time.',1,'2026-08-25 14:38:49','2026-08-25 14:38:49'),(2,'Sadia Rahman',5,'Best lunch service for our office team. The packaging in tiffin boxes keeps everything warm and fresh. Highly recommend the Rui Maach.',1,'2026-08-25 14:38:49','2026-08-25 14:38:49'),(3,'Tanvir Islam',5,'I order the premium menu every week. The quality is consistently excellent and it truly feels like a hearty home-cooked meal.',1,'2026-08-25 14:38:49','2026-08-25 14:38:49');
/*!40000 ALTER TABLE `success_stories` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-10-03 13:40:59
