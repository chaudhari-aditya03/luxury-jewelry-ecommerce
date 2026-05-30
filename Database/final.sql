-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
--
-- Host: zephyr.proxy.rlwy.net    Database: railway
-- ------------------------------------------------------
-- Server version	9.4.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `activity_logs`
--

DROP TABLE IF EXISTS `activity_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `activity_logs` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `activity_type` varchar(255) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `description` varchar(500) NOT NULL,
  `entity_id` bigint DEFAULT NULL,
  `entity_type` varchar(255) DEFAULT NULL,
  `ip_address` varchar(500) DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `user_id` bigint NOT NULL,
  `browser` varchar(200) DEFAULT NULL,
  `device` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_activity_user` (`user_id`),
  KEY `idx_activity_type` (`activity_type`),
  KEY `idx_activity_created` (`created_at`),
  CONSTRAINT `FK5bm1lt4f4eevt8lv2517soakd` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `activity_logs`
--

LOCK TABLES `activity_logs` WRITE;
/*!40000 ALTER TABLE `activity_logs` DISABLE KEYS */;
INSERT INTO `activity_logs` VALUES (1,'ADD_TO_CART','2026-05-28 05:06:39.472156','Added product \'Emerald Gemstone Ring\' (qty: 1) to cart',5,'PRODUCT',NULL,'SUCCESS',3,NULL,NULL),(2,'PURCHASE','2026-05-28 05:08:06.873866','Placed order ORD-2026-41FA2633 with total amount: ₹68000.00',1,'ORDER',NULL,'SUCCESS',3,NULL,NULL),(3,'ADD_TO_CART','2026-05-28 06:07:21.834034','Added product \'Classic Pearl Necklace\' (qty: 1) to cart',2,'PRODUCT',NULL,'SUCCESS',3,NULL,NULL),(4,'PURCHASE','2026-05-28 06:07:54.033827','Placed order ORD-2026-4E75D8C9 with total amount: ₹25000.00',2,'ORDER',NULL,'SUCCESS',3,NULL,NULL),(5,'ADD_TO_CART','2026-05-28 08:17:59.061574','Added product \'Diamond Necklace\' (qty: 1) to cart',12,'PRODUCT',NULL,'SUCCESS',3,NULL,NULL),(6,'ADD_TO_CART','2026-05-28 08:19:01.157684','Added product \'Gold Necklace\' (qty: 1) to cart',13,'PRODUCT',NULL,'SUCCESS',5,NULL,NULL),(7,'PURCHASE','2026-05-28 08:19:02.958566','Placed order ORD-2026-E2F40A95 with total amount: ₹85000.00',3,'ORDER',NULL,'SUCCESS',3,NULL,NULL),(8,'ADD_TO_CART','2026-05-28 08:19:34.657313','Added product \'Diamond Ring\' (qty: 1) to cart',8,'PRODUCT',NULL,'SUCCESS',5,NULL,NULL),(9,'ADD_TO_CART','2026-05-28 08:19:47.758151','Added product \'Diamond Ring\' (qty: 1) to cart',8,'PRODUCT',NULL,'SUCCESS',5,NULL,NULL),(10,'ADD_TO_CART','2026-05-28 08:21:50.251523','Added product \'Gold Chain Bracelet\' (qty: 1) to cart',4,'PRODUCT',NULL,'SUCCESS',5,NULL,NULL),(11,'ADD_TO_CART','2026-05-28 08:21:57.535014','Added product \'Gold Chain Bracelet\' (qty: 1) to cart',4,'PRODUCT',NULL,'SUCCESS',5,NULL,NULL),(12,'ADD_TO_CART','2026-05-28 08:32:07.615481','Added product \'Gold Necklace\' (qty: 1) to cart',13,'PRODUCT',NULL,'SUCCESS',5,NULL,NULL),(13,'PURCHASE','2026-05-28 08:32:31.882222','Placed order ORD-2026-4B878CF4 with total amount: ₹368000.00',4,'ORDER',NULL,'SUCCESS',5,NULL,NULL),(14,'ADD_TO_CART','2026-05-28 16:53:37.906997','Added product \'Gold Necklace\' (qty: 1) to cart',13,'PRODUCT',NULL,'SUCCESS',3,NULL,NULL),(15,'PURCHASE','2026-05-28 16:57:26.407390','Placed order ORD-2026-D32A5D94 with total amount: ₹75000.00',5,'ORDER',NULL,'SUCCESS',3,NULL,NULL);
/*!40000 ALTER TABLE `activity_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `addresses`
--

DROP TABLE IF EXISTS `addresses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `addresses` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `address_line1` varchar(200) DEFAULT NULL,
  `address_line2` varchar(200) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `country` varchar(100) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  `full_name` varchar(100) DEFAULT NULL,
  `is_default` bit(1) DEFAULT NULL,
  `phone` varchar(15) DEFAULT NULL,
  `postal_code` varchar(20) DEFAULT NULL,
  `state` varchar(100) DEFAULT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK1fa36y2oqhao3wgg2rw1pi459` (`user_id`),
  CONSTRAINT `FK1fa36y2oqhao3wgg2rw1pi459` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `addresses`
--

LOCK TABLES `addresses` WRITE;
/*!40000 ALTER TABLE `addresses` DISABLE KEYS */;
INSERT INTO `addresses` VALUES (1,'At . Amrutnagar , Sangamner',NULL,'Sangamner','India','2026-05-28 05:07:50.394344','Aditya Bapusaheb Chaudhari',_binary '\0','7709648063','422605','Maharashtra',3),(2,'Sangamner',NULL,'Ahmednagar','India','2026-05-28 08:26:16.260315','Pratiksha Dattatray Dighe',_binary '\0','9579920770','422605','Maharashtra',5);
/*!40000 ALTER TABLE `addresses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cart`
--

DROP TABLE IF EXISTS `cart`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_9emlp6m95v5er2bcqkjsw48he` (`user_id`),
  KEY `idx_cart_user` (`user_id`),
  CONSTRAINT `FKg5uhi8vpsuy0lgloxk2h4w5o6` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart`
--

LOCK TABLES `cart` WRITE;
/*!40000 ALTER TABLE `cart` DISABLE KEYS */;
INSERT INTO `cart` VALUES (1,'2026-05-28 05:06:38.284620','2026-05-28 05:06:38.284620',3),(2,'2026-05-28 08:19:00.687721','2026-05-28 08:19:00.687721',5);
/*!40000 ALTER TABLE `cart` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cart_items`
--

DROP TABLE IF EXISTS `cart_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart_items` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `quantity` int NOT NULL,
  `cart_id` bigint NOT NULL,
  `product_id` bigint NOT NULL,
  `variant_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK99e0am9jpriwxcm6is7xfedy3` (`cart_id`),
  KEY `FK1re40cjegsfvw58xrkdp6bac6` (`product_id`),
  KEY `FK5yyw1o0dor9gmxfra1dqvn4qa` (`variant_id`),
  CONSTRAINT `FK1re40cjegsfvw58xrkdp6bac6` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  CONSTRAINT `FK5yyw1o0dor9gmxfra1dqvn4qa` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`id`),
  CONSTRAINT `FK99e0am9jpriwxcm6is7xfedy3` FOREIGN KEY (`cart_id`) REFERENCES `cart` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart_items`
--

LOCK TABLES `cart_items` WRITE;
/*!40000 ALTER TABLE `cart_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `cart_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `description` text,
  `name` varchar(100) NOT NULL,
  `parent_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKsaok720gsu4u2wrgbk10b5n8d` (`parent_id`),
  CONSTRAINT `FKsaok720gsu4u2wrgbk10b5n8d` FOREIGN KEY (`parent_id`) REFERENCES `categories` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'2026-05-28 04:59:43.449551',NULL,'Rings',NULL),(2,'2026-05-28 04:59:45.835207',NULL,'Necklaces',NULL),(3,'2026-05-28 04:59:47.612771',NULL,'Earrings',NULL),(4,'2026-05-28 04:59:49.811425',NULL,'Bracelets',NULL);
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contact_messages`
--

DROP TABLE IF EXISTS `contact_messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contact_messages` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `email` varchar(150) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `subject` varchar(255) DEFAULT NULL,
  `message` text,
  `replied` bit(1) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contact_messages`
--

LOCK TABLES `contact_messages` WRITE;
/*!40000 ALTER TABLE `contact_messages` DISABLE KEYS */;
/*!40000 ALTER TABLE `contact_messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `coupon_usage`
--

DROP TABLE IF EXISTS `coupon_usage`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `coupon_usage` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `coupon_id` bigint DEFAULT NULL,
  `user_id` bigint DEFAULT NULL,
  `order_id` bigint DEFAULT NULL,
  `used_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `coupon_usage`
--

LOCK TABLES `coupon_usage` WRITE;
/*!40000 ALTER TABLE `coupon_usage` DISABLE KEYS */;
/*!40000 ALTER TABLE `coupon_usage` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `coupons`
--

DROP TABLE IF EXISTS `coupons`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `coupons` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `code` varchar(50) NOT NULL,
  `discount_type` enum('PERCENT','FIXED') NOT NULL,
  `discount_value` decimal(10,2) NOT NULL,
  `expiry_date` date DEFAULT NULL,
  `is_active` bit(1) DEFAULT NULL,
  `min_order_amount` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_eplt0kkm9yf2of2lnx6c1oy9b` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `coupons`
--

LOCK TABLES `coupons` WRITE;
/*!40000 ALTER TABLE `coupons` DISABLE KEYS */;
/*!40000 ALTER TABLE `coupons` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `email_verification_tokens`
--

DROP TABLE IF EXISTS `email_verification_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `email_verification_tokens` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `token` varchar(255) DEFAULT NULL,
  `expires_at` datetime DEFAULT NULL,
  `used` bit(1) DEFAULT NULL,
  `user_id` bigint DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `email_verification_tokens_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `email_verification_tokens`
--

LOCK TABLES `email_verification_tokens` WRITE;
/*!40000 ALTER TABLE `email_verification_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `email_verification_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `otp_verifications`
--

DROP TABLE IF EXISTS `otp_verifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `otp_verifications` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `email` varchar(120) NOT NULL,
  `otp` varchar(6) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `expires_at` datetime(6) NOT NULL,
  `verified` bit(1) NOT NULL,
  `attempt_count` int NOT NULL,
  `resend_count` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_otp_verifications_email` (`email`),
  KEY `idx_otp_verifications_email_verified` (`email`,`verified`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `otp_verifications`
--

LOCK TABLES `otp_verifications` WRITE;
/*!40000 ALTER TABLE `otp_verifications` DISABLE KEYS */;
/*!40000 ALTER TABLE `otp_verifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pending_registrations`
--

DROP TABLE IF EXISTS `pending_registrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pending_registrations` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `email` varchar(120) NOT NULL,
  `full_name` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `phone` varchar(15) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  `expires_at` datetime(6) NOT NULL,
  `consumed` bit(1) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_pending_registrations_email` (`email`),
  KEY `idx_pending_registrations_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pending_registrations`
--

LOCK TABLES `pending_registrations` WRITE;
/*!40000 ALTER TABLE `pending_registrations` DISABLE KEYS */;
/*!40000 ALTER TABLE `pending_registrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inventory_logs`
--

DROP TABLE IF EXISTS `inventory_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inventory_logs` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `product_id` bigint DEFAULT NULL,
  `old_stock` int DEFAULT NULL,
  `new_stock` int DEFAULT NULL,
  `reason` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inventory_logs`
--

LOCK TABLES `inventory_logs` WRITE;
/*!40000 ALTER TABLE `inventory_logs` DISABLE KEYS */;
/*!40000 ALTER TABLE `inventory_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `newsletter_subscribers`
--

DROP TABLE IF EXISTS `newsletter_subscribers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `newsletter_subscribers` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `email` varchar(255) DEFAULT NULL,
  `subscribed_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `newsletter_subscribers`
--

LOCK TABLES `newsletter_subscribers` WRITE;
/*!40000 ALTER TABLE `newsletter_subscribers` DISABLE KEYS */;
/*!40000 ALTER TABLE `newsletter_subscribers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `title` varchar(255) DEFAULT NULL,
  `message` text,
  `is_read` bit(1) DEFAULT NULL,
  `user_id` bigint DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_items` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `price` decimal(10,2) NOT NULL,
  `quantity` int NOT NULL,
  `order_id` bigint NOT NULL,
  `product_id` bigint NOT NULL,
  `variant_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKbioxgbv59vetrxe0ejfubep1w` (`order_id`),
  KEY `FKocimc7dtr037rh4ls4l95nlfi` (`product_id`),
  KEY `FKemq71edpbn9wsxnxncfn1algp` (`variant_id`),
  CONSTRAINT `FKbioxgbv59vetrxe0ejfubep1w` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  CONSTRAINT `FKemq71edpbn9wsxnxncfn1algp` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`id`),
  CONSTRAINT `FKocimc7dtr037rh4ls4l95nlfi` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
INSERT INTO `order_items` VALUES (1,68000.00,1,1,5,NULL),(2,25000.00,1,2,2,NULL),(3,85000.00,1,3,12,NULL),(4,75000.00,2,4,13,NULL),(5,74000.00,2,4,8,NULL),(6,35000.00,2,4,4,NULL),(7,75000.00,1,5,13,NULL);
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_tracking`
--

DROP TABLE IF EXISTS `order_tracking`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_tracking` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `order_id` bigint DEFAULT NULL,
  `status` varchar(100) DEFAULT NULL,
  `remarks` text,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  CONSTRAINT `order_tracking_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_tracking`
--

LOCK TABLES `order_tracking` WRITE;
/*!40000 ALTER TABLE `order_tracking` DISABLE KEYS */;
/*!40000 ALTER TABLE `order_tracking` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `address_snapshot` text,
  `cancellation_reason` text,
  `created_at` datetime(6) NOT NULL,
  `discount_amount` decimal(10,2) DEFAULT NULL,
  `final_amount` decimal(10,2) NOT NULL,
  `order_number` varchar(100) NOT NULL,
  `order_status` enum('PLACED','PROCESSING','SHIPPED','DELIVERED','CANCELLED','RETURNED') NOT NULL,
  `payment_method` enum('UPI','COD') NOT NULL,
  `payment_status` enum('PENDING','PAID','FAILED','REFUNDED') NOT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_nthkiu7pgmnqnu86i2jyoe2v7` (`order_number`),
  KEY `idx_orders_user` (`user_id`),
  KEY `idx_orders_status` (`order_status`),
  CONSTRAINT `FK32ql8ubntj5uh44ph9659tiih` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1,'{\"id\":1,\"user\":{\"id\":3,\"fullName\":\"Aditya  Chaudhari\",\"email\":\"adityachaudhari312005@gmail.com\",\"password\":\"$2a$10$D0UDSCfjY.cEqoz5yIZrjeVo3l9m03DZFk9pLgDAErb/4vEeuuSgW\",\"phone\":\"7709648063\",\"role\":\"USER\",\"isActive\":true,\"emailVerified\":false,\"lastLogin\":null,\"createdAt\":\"2026-05-28T10:35:05.724268\",\"updatedAt\":\"2026-05-28T10:35:05.724268\",\"deletedAt\":null},\"fullName\":\"Aditya Bapusaheb Chaudhari\",\"phone\":\"7709648063\",\"addressLine1\":\"At . Amrutnagar , Sangamner\",\"addressLine2\":null,\"city\":\"Sangamner\",\"state\":\"Maharashtra\",\"postalCode\":\"422605\",\"country\":\"India\",\"isDefault\":false,\"createdAt\":\"2026-05-28T10:37:50.394344\"}',NULL,'2026-05-28 05:08:05.850626',0.00,68000.00,'ORD-2026-41FA2633','PLACED','COD','PENDING',68000.00,'2026-05-28 05:08:05.850626',3),(2,'{\"id\":1,\"user\":{\"id\":3,\"fullName\":\"Aditya  Chaudhari\",\"email\":\"adityachaudhari312005@gmail.com\",\"password\":\"$2a$10$D0UDSCfjY.cEqoz5yIZrjeVo3l9m03DZFk9pLgDAErb/4vEeuuSgW\",\"phone\":\"7709648063\",\"role\":\"USER\",\"isActive\":true,\"emailVerified\":false,\"lastLogin\":\"2026-05-28T06:06:39.855636\",\"createdAt\":\"2026-05-28T05:05:05.724268\",\"updatedAt\":\"2026-05-28T06:06:40.1318\",\"deletedAt\":null},\"fullName\":\"Aditya Bapusaheb Chaudhari\",\"phone\":\"7709648063\",\"addressLine1\":\"At . Amrutnagar , Sangamner\",\"addressLine2\":null,\"city\":\"Sangamner\",\"state\":\"Maharashtra\",\"postalCode\":\"422605\",\"country\":\"India\",\"isDefault\":false,\"createdAt\":\"2026-05-28T05:07:50.394344\"}',NULL,'2026-05-28 06:07:53.632576',0.00,25000.00,'ORD-2026-4E75D8C9','PLACED','COD','PENDING',25000.00,'2026-05-28 06:07:53.632576',3),(3,'{\"id\":1,\"user\":{\"id\":3,\"fullName\":\"Aditya  Chaudhari\",\"email\":\"adityachaudhari312005@gmail.com\",\"password\":\"$2a$10$D0UDSCfjY.cEqoz5yIZrjeVo3l9m03DZFk9pLgDAErb/4vEeuuSgW\",\"phone\":\"7709648063\",\"role\":\"USER\",\"isActive\":true,\"emailVerified\":false,\"lastLogin\":\"2026-05-28T07:14:48.14453\",\"createdAt\":\"2026-05-28T05:05:05.724268\",\"updatedAt\":\"2026-05-28T07:14:48.19251\",\"deletedAt\":null},\"fullName\":\"Aditya Bapusaheb Chaudhari\",\"phone\":\"7709648063\",\"addressLine1\":\"At . Amrutnagar , Sangamner\",\"addressLine2\":null,\"city\":\"Sangamner\",\"state\":\"Maharashtra\",\"postalCode\":\"422605\",\"country\":\"India\",\"isDefault\":false,\"createdAt\":\"2026-05-28T05:07:50.394344\"}',NULL,'2026-05-28 08:19:02.660371',0.00,85000.00,'ORD-2026-E2F40A95','PLACED','COD','PENDING',85000.00,'2026-05-28 08:19:02.660371',3),(4,'{\"id\":2,\"user\":{\"id\":5,\"fullName\":\"Pratiksha Dighe\",\"email\":\"pratiksha@gmail.com\",\"password\":\"$2a$10$WIEtyGVTNMXHcDI8okjyAuHbIbfPFf4VWDH9Y.Wq6eJCIXX.tlq3q\",\"phone\":\"9579920770\",\"role\":\"USER\",\"isActive\":true,\"emailVerified\":false,\"lastLogin\":null,\"createdAt\":\"2026-05-28T08:17:20.157974\",\"updatedAt\":\"2026-05-28T08:17:20.157974\",\"deletedAt\":null},\"fullName\":\"Pratiksha Dattatray Dighe\",\"phone\":\"9579920770\",\"addressLine1\":\"Sangamner\",\"addressLine2\":null,\"city\":\"Ahmednagar\",\"state\":\"Maharashtra\",\"postalCode\":\"422605\",\"country\":\"India\",\"isDefault\":false,\"createdAt\":\"2026-05-28T08:26:16.260315\"}',NULL,'2026-05-28 08:32:31.715334',0.00,368000.00,'ORD-2026-4B878CF4','PLACED','COD','PENDING',368000.00,'2026-05-28 08:32:31.715334',5),(5,'{\"id\":1,\"user\":{\"id\":3,\"fullName\":\"Aditya  Chaudhari\",\"email\":\"adityachaudhari312005@gmail.com\",\"password\":\"$2a$10$D0UDSCfjY.cEqoz5yIZrjeVo3l9m03DZFk9pLgDAErb/4vEeuuSgW\",\"phone\":\"7709648063\",\"role\":\"USER\",\"isActive\":true,\"emailVerified\":false,\"lastLogin\":\"2026-05-28T16:47:20.407364\",\"createdAt\":\"2026-05-28T05:05:05.724268\",\"updatedAt\":\"2026-05-28T16:47:20.531018\",\"deletedAt\":null},\"fullName\":\"Aditya Bapusaheb Chaudhari\",\"phone\":\"7709648063\",\"addressLine1\":\"At . Amrutnagar , Sangamner\",\"addressLine2\":null,\"city\":\"Sangamner\",\"state\":\"Maharashtra\",\"postalCode\":\"422605\",\"country\":\"India\",\"isDefault\":false,\"createdAt\":\"2026-05-28T05:07:50.394344\"}',NULL,'2026-05-28 16:57:26.108516',0.00,75000.00,'ORD-2026-D32A5D94','PLACED','UPI','PAID',75000.00,'2026-05-28 16:58:53.931858',3);
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_reset_tokens`
--

DROP TABLE IF EXISTS `password_reset_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `password_reset_tokens` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `expires_at` datetime(6) NOT NULL,
  `token` varchar(100) NOT NULL,
  `used` bit(1) NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_71lqwbwtklmljk3qlsugr1mig` (`token`),
  KEY `FKk3ndxg5xp6v7wd4gjyusp15gq` (`user_id`),
  CONSTRAINT `FKk3ndxg5xp6v7wd4gjyusp15gq` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_reset_tokens`
--

LOCK TABLES `password_reset_tokens` WRITE;
/*!40000 ALTER TABLE `password_reset_tokens` DISABLE KEYS */;
INSERT INTO `password_reset_tokens` VALUES (4,'2026-05-29 08:09:31.147966','2026-05-29 09:09:31.147966','69fa0836c6b84eafb652cdf87bd937d5',_binary '\0',3),(5,'2026-05-29 16:01:33.926838','2026-05-29 17:01:33.926867','a3e72bee6a364e95936177da53758af2',_binary '\0',6);
/*!40000 ALTER TABLE `password_reset_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payments` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `amount` decimal(10,2) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `payment_gateway` varchar(100) DEFAULT NULL,
  `payment_reference` varchar(200) DEFAULT NULL,
  `retry_count` int DEFAULT NULL,
  `status` enum('SUCCESS','FAILED','PENDING') NOT NULL,
  `transaction_id` varchar(200) DEFAULT NULL,
  `order_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK81gagumt0r8y3rmudcgpbk42l` (`order_id`),
  CONSTRAINT `FK81gagumt0r8y3rmudcgpbk42l` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payments`
--

LOCK TABLES `payments` WRITE;
/*!40000 ALTER TABLE `payments` DISABLE KEYS */;
INSERT INTO `payments` VALUES (1,68000.00,'2026-05-28 05:08:14.591244','Cash on Delivery',NULL,0,'PENDING','COD-ORD-2026-41FA2633',1),(2,25000.00,'2026-05-28 06:07:55.959336','Cash on Delivery',NULL,0,'PENDING','COD-ORD-2026-4E75D8C9',2),(3,85000.00,'2026-05-28 08:19:05.584976','Cash on Delivery',NULL,0,'PENDING','COD-ORD-2026-E2F40A95',3),(4,368000.00,'2026-05-28 08:32:33.349102','Cash on Delivery',NULL,0,'PENDING','COD-ORD-2026-4B878CF4',4),(5,75000.00,'2026-05-28 16:57:28.010542','UPI QR','1234',0,'SUCCESS','UPI-424C1228-1CE',5);
/*!40000 ALTER TABLE `payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_images`
--

DROP TABLE IF EXISTS `product_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_images` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `file_size` bigint DEFAULT NULL,
  `image_name` varchar(255) DEFAULT NULL,
  `image_path` varchar(500) DEFAULT NULL,
  `image_url` varchar(500) DEFAULT NULL,
  `is_primary` bit(1) DEFAULT NULL,
  `mime_type` varchar(100) DEFAULT NULL,
  `uploaded_at` datetime(6) DEFAULT NULL,
  `product_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKqnq71xsohugpqwf3c9gxmsuy` (`product_id`),
  CONSTRAINT `FKqnq71xsohugpqwf3c9gxmsuy` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_images`
--

LOCK TABLES `product_images` WRITE;
/*!40000 ALTER TABLE `product_images` DISABLE KEYS */;
INSERT INTO `product_images` VALUES (1,NULL,NULL,NULL,'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500',_binary '',NULL,NULL,1),(2,NULL,NULL,NULL,'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500',_binary '',NULL,NULL,2),(3,NULL,NULL,NULL,'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500',_binary '',NULL,NULL,3),(4,NULL,NULL,NULL,'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=500',_binary '',NULL,NULL,4),(5,NULL,NULL,NULL,'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500',_binary '',NULL,NULL,5),(6,NULL,NULL,NULL,'https://res.cloudinary.com/dla6tieky/image/upload/v1779952406/jewelry_shop/products/zh6dwh8ixfawynsncq3p.png',_binary '',NULL,'2026-05-28 07:13:29.249876',6),(7,NULL,NULL,NULL,'https://res.cloudinary.com/dla6tieky/image/upload/v1779953084/jewelry_shop/products/woc9rxn09dyakvurkllk.png',_binary '',NULL,'2026-05-28 07:24:47.272091',7),(8,NULL,NULL,NULL,'https://res.cloudinary.com/dla6tieky/image/upload/v1779953138/jewelry_shop/products/xiifzwf4mla0dakl43ls.png',_binary '',NULL,'2026-05-28 07:25:39.845728',8),(9,NULL,NULL,NULL,'https://res.cloudinary.com/dla6tieky/image/upload/v1779953224/jewelry_shop/products/sfkkz6n2jqrkfivrqlrx.png',_binary '',NULL,'2026-05-28 07:27:05.767783',9),(10,NULL,NULL,NULL,'https://res.cloudinary.com/dla6tieky/image/upload/v1779953274/jewelry_shop/products/gbeytyojuq3fuhlx1tw4.jpg',_binary '',NULL,'2026-05-28 07:27:56.092172',10),(11,NULL,NULL,NULL,'https://res.cloudinary.com/dla6tieky/image/upload/v1779953328/jewelry_shop/products/fduini7eped5af6jxswh.png',_binary '',NULL,'2026-05-28 07:28:49.968471',11),(12,NULL,NULL,NULL,'https://res.cloudinary.com/dla6tieky/image/upload/v1779953686/jewelry_shop/products/h9ct3wl1x8amtnfymmlx.png',_binary '',NULL,'2026-05-28 07:34:47.716372',12),(13,NULL,NULL,NULL,'https://res.cloudinary.com/dla6tieky/image/upload/v1779953875/jewelry_shop/products/pdocsqenm7m3ik6xni11.jpg',_binary '',NULL,'2026-05-28 07:37:56.640311',13);
/*!40000 ALTER TABLE `product_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_questions`
--

DROP TABLE IF EXISTS `product_questions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_questions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `question` text,
  `answer` text,
  `created_at` datetime DEFAULT NULL,
  `product_id` bigint DEFAULT NULL,
  `user_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_questions`
--

LOCK TABLES `product_questions` WRITE;
/*!40000 ALTER TABLE `product_questions` DISABLE KEYS */;
/*!40000 ALTER TABLE `product_questions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_variants`
--

DROP TABLE IF EXISTS `product_variants`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_variants` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `additional_price` decimal(10,2) DEFAULT NULL,
  `stock_quantity` int DEFAULT NULL,
  `variant_name` varchar(100) DEFAULT NULL,
  `product_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKosqitn4s405cynmhb87lkvuau` (`product_id`),
  CONSTRAINT `FKosqitn4s405cynmhb87lkvuau` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_variants`
--

LOCK TABLES `product_variants` WRITE;
/*!40000 ALTER TABLE `product_variants` DISABLE KEYS */;
/*!40000 ALTER TABLE `product_variants` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `deleted_at` datetime(6) DEFAULT NULL,
  `description` text,
  `discount_price` decimal(10,2) DEFAULT NULL,
  `is_active` bit(1) DEFAULT NULL,
  `is_featured` bit(1) DEFAULT NULL,
  `name` varchar(150) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `sku` varchar(100) DEFAULT NULL,
  `stock_quantity` int DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `category_id` bigint DEFAULT NULL,
  `discount_percentage` decimal(5,2) DEFAULT '0.00',
  `original_price` decimal(10,2) DEFAULT NULL,
  `is_new_arrival` bit(1) DEFAULT b'0',
  `is_best_seller` bit(1) DEFAULT b'0',
  `is_trending` bit(1) DEFAULT b'0',
  `average_rating` decimal(3,2) DEFAULT '0.00',
  `total_reviews` int DEFAULT '0',
  `view_count` bigint DEFAULT '0',
  `sold_count` bigint DEFAULT '0',
  `brand` varchar(100) DEFAULT NULL,
  `material` varchar(100) DEFAULT NULL,
  `metal_type` varchar(100) DEFAULT NULL,
  `gemstone` varchar(100) DEFAULT NULL,
  `purity` varchar(50) DEFAULT NULL,
  `weight` decimal(10,2) DEFAULT NULL,
  `gender` enum('MEN','WOMEN','UNISEX') DEFAULT NULL,
  `occasion` varchar(100) DEFAULT NULL,
  `slug` varchar(255) DEFAULT NULL,
  `meta_title` varchar(255) DEFAULT NULL,
  `meta_description` text,
  `sale_end_date` datetime(6) DEFAULT NULL,
  `sale_start_date` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_fhmd06dsmj6k0n90swsh8ie9g` (`sku`),
  KEY `idx_products_category` (`category_id`),
  CONSTRAINT `FKog2rp4qthbtt2lfyhfo32lsw9` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,'2026-05-28 04:59:56.213509','2026-05-28 06:09:51.755405','Elegant 18K white gold solitaire ring featuring a brilliant 1-carat diamond with VS1 clarity and F color grade. Perfect for engagements and special occasions.',42000.00,_binary '\0',_binary '','Diamond Solitaire Ring',45000.00,'RING-DS-001',15,'2026-05-28 06:09:51.831749',1,0.00,NULL,_binary '\0',_binary '\0',_binary '\0',0.00,0,0,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(2,'2026-05-28 04:59:58.811673',NULL,'Timeless freshwater pearl necklace with 7-8mm pearls on a 14K gold clasp. Features 18-inch length suitable for all occasions.',25000.00,_binary '',_binary '','Classic Pearl Necklace',28000.00,'NECK-CPL-002',19,'2026-05-28 06:07:54.331357',2,0.00,NULL,_binary '\0',_binary '\0',_binary '\0',0.00,0,0,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(3,'2026-05-28 05:00:02.460482',NULL,'Beautiful pair of diamond stud earrings set in platinum. Each earring features a 0.5-carat round brilliant diamond with excellent cut.',60000.00,_binary '',_binary '\0','Diamond Stud Earrings',65000.00,'EAR-DS-003',12,'2026-05-28 05:00:02.460482',3,0.00,NULL,_binary '\0',_binary '\0',_binary '\0',0.00,0,0,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(4,'2026-05-28 05:00:04.972179',NULL,'Sophisticated 22K gold chain bracelet with intricate design. Weighs approximately 15 grams and features secure lobster clasp.',35000.00,_binary '',_binary '\0','Gold Chain Bracelet',38000.00,'BRAC-GC-004',16,'2026-05-28 08:32:31.958196',4,0.00,NULL,_binary '\0',_binary '\0',_binary '\0',0.00,0,0,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(5,'2026-05-28 05:00:08.070616','2026-05-28 06:10:05.692944','Stunning emerald ring featuring a 2-carat natural Colombian emerald surrounded by micro-pave diamonds in 18K yellow gold setting.',68000.00,_binary '\0',_binary '','Emerald Gemstone Ring',72000.00,'RING-EM-005',7,'2026-05-28 06:10:05.693947',1,0.00,NULL,_binary '\0',_binary '\0',_binary '\0',0.00,0,0,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(6,'2026-05-28 06:12:04.734753',NULL,'Add a touch of elegance with this stunning green diamond ring, crafted to shine with luxury and sophistication.\nPerfect for special occasions, it brings a bold, royal charm to every look.\n',74900.00,_binary '',_binary '','Green Diamond Ring',75000.00,'JW-566A6220',15,'2026-05-28 06:12:04.734753',1,0.00,NULL,_binary '\0',_binary '\0',_binary '\0',0.00,0,0,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(7,'2026-05-28 07:24:47.195555',NULL,'A classic gold diamond ring designed with timeless beauty and sparkle.\nIts elegant finish makes it perfect for daily wear and celebrations.',47000.00,_binary '',_binary '\0','Gold Diamond Ring',50000.00,'JW-ED60A9DF',50,'2026-05-28 07:24:47.195555',1,0.00,NULL,_binary '\0',_binary '\0',_binary '\0',0.00,0,0,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(8,'2026-05-28 07:25:39.770907',NULL,'A graceful rose gold ring with a soft romantic shine.\nIdeal for gifting, it adds a modern and feminine touch to every look.',74000.00,_binary '',_binary '\0','Diamond Ring',75000.00,'JW-EF049B69',8,'2026-05-28 08:32:31.957931',1,0.00,NULL,_binary '\0',_binary '\0',_binary '\0',0.00,0,0,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(9,'2026-05-28 07:27:05.717412',NULL,'Elegant diamond studs designed to add timeless sparkle to your look.\nPerfect for daily wear, office styling, and special occasions.',50000.00,_binary '',_binary '','Green Diamond Stud Earrings',50500.00,'JW-7D3B1268',20,'2026-05-28 07:27:05.717412',3,0.00,NULL,_binary '\0',_binary '\0',_binary '\0',0.00,0,0,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(10,'2026-05-28 07:27:56.068140',NULL,'Classic gold hoops crafted for a bold and stylish appearance.\nLightweight and versatile, they pair beautifully with every outfit.',75000.00,_binary '',_binary '\0','Gold Hoop Earrings',80000.00,'JW-D01CF7DD',5,'2026-05-28 07:27:56.068140',3,0.00,NULL,_binary '\0',_binary '\0',_binary '\0',0.00,0,0,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(11,'2026-05-28 07:28:49.870203',NULL,'\nGraceful pearl drop earrings that bring soft elegance and charm.\nIdeal for weddings, parties, and traditional occasions',89000.00,_binary '',_binary '\0','Pearl Drop Earrings',90000.00,'JW-225BAC8B',50,'2026-05-28 07:28:49.870203',3,0.00,NULL,_binary '\0',_binary '\0',_binary '\0',0.00,0,0,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(12,'2026-05-28 07:34:47.692018',NULL,'\nA stunning diamond necklace crafted to add timeless sparkle and elegance.\nPerfect for weddings, parties, and every special celebration.',85000.00,_binary '',_binary '','Diamond Necklace',90000.00,'JW-4525472F',49,'2026-05-28 08:19:03.164136',2,0.00,NULL,_binary '\0',_binary '\0',_binary '\0',0.00,0,0,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(13,'2026-05-28 07:37:56.615626',NULL,'\nA classic gold necklace designed with rich shine and graceful beauty.\nIdeal for traditional occasions, festive wear, and daily elegance',75000.00,_binary '',_binary '\0','Gold Necklace',78000.00,'JW-228146D0',47,'2026-05-28 16:57:26.610513',2,0.00,NULL,_binary '\0',_binary '\0',_binary '\0',0.00,0,0,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `returns`
--

DROP TABLE IF EXISTS `returns`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `returns` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `order_id` bigint DEFAULT NULL,
  `reason` text,
  `status` varchar(100) DEFAULT NULL,
  `refund_amount` decimal(10,2) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `returns`
--

LOCK TABLES `returns` WRITE;
/*!40000 ALTER TABLE `returns` DISABLE KEYS */;
/*!40000 ALTER TABLE `returns` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reviews`
--

DROP TABLE IF EXISTS `reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reviews` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `comment` text,
  `created_at` datetime(6) NOT NULL,
  `rating` int NOT NULL,
  `product_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_reviews_product` (`product_id`),
  KEY `FKcgy7qjc1r99dp117y9en6lxye` (`user_id`),
  CONSTRAINT `FKcgy7qjc1r99dp117y9en6lxye` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FKpl51cejpw4gy5swfar8br9ngi` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reviews`
--

LOCK TABLES `reviews` WRITE;
/*!40000 ALTER TABLE `reviews` DISABLE KEYS */;
/*!40000 ALTER TABLE `reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_sessions`
--

DROP TABLE IF EXISTS `user_sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_sessions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint DEFAULT NULL,
  `token` varchar(500) DEFAULT NULL,
  `login_time` datetime DEFAULT NULL,
  `logout_time` datetime DEFAULT NULL,
  `device` varchar(255) DEFAULT NULL,
  `ip_address` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_sessions`
--

LOCK TABLES `user_sessions` WRITE;
/*!40000 ALTER TABLE `user_sessions` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `deleted_at` datetime(6) DEFAULT NULL,
  `email` varchar(120) NOT NULL,
  `email_verified` bit(1) DEFAULT NULL,
  `full_name` varchar(100) NOT NULL,
  `is_active` bit(1) DEFAULT NULL,
  `last_login` datetime(6) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(15) DEFAULT NULL,
  `role` enum('USER','ADMIN') NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `provider` varchar(30) DEFAULT NULL,
  `provider_id` varchar(255) DEFAULT NULL,
  `profile_picture` varchar(500) DEFAULT NULL,
  `verification_sent_at` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_6dotkott2kjsp8vw4d0m25fb7` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'2026-05-28 04:59:34.361765',NULL,'admin@gmail.com',_binary '','Admin User',_binary '',NULL,'$2a$10$uBPuJ6diJr.T8.vuoYw/9eFRELmptKOIRYEXJL0qoE9nVcFj.YRd6','9876543210','ADMIN','2026-05-29 15:57:32.718387',NULL,NULL,NULL,NULL),(2,'2026-05-28 04:59:37.099606',NULL,'aditya@gmail.com',_binary '','Aditya Kumar',_binary '',NULL,'$2a$10$1v/mZ1oqpDrY6tD9D4k9XO7nVRFe22B54L6mq4m1im7j93B62Hhhy','9123456780','USER','2026-05-29 15:57:35.599791',NULL,NULL,NULL,NULL),(3,'2026-05-28 05:05:05.724268',NULL,'adityachaudhari312005@gmail.com',_binary '\0','Aditya  Chaudhari',_binary '','2026-05-28 16:47:20.407364','$2a$10$D0UDSCfjY.cEqoz5yIZrjeVo3l9m03DZFk9pLgDAErb/4vEeuuSgW','7709648063','USER','2026-05-28 16:47:20.531018',NULL,NULL,NULL,NULL),(4,'2026-05-28 05:14:46.147555',NULL,'superadmin@gmail.com',_binary '\0','Super Admin',_binary '','2026-05-28 07:12:53.646047','$2a$10$uSxCKm70VYFoYbFr4HfqUup47ZOJxccRuU6ysEr25SVKlN0rSpY1e','7709648063','ADMIN','2026-05-28 07:12:53.769424',NULL,NULL,NULL,NULL),(5,'2026-05-28 08:17:20.157974',NULL,'pratiksha@gmail.com',_binary '\0','Pratiksha Dighe',_binary '',NULL,'$2a$10$WIEtyGVTNMXHcDI8okjyAuHbIbfPFf4VWDH9Y.Wq6eJCIXX.tlq3q','9579920770','USER','2026-05-28 08:17:20.157974',NULL,NULL,NULL,NULL),(6,'2026-05-29 14:25:06.473306',NULL,'adityachaudhariedu312005@gmail.com',_binary '','Aditya Chaudhari',_binary '',NULL,'OAUTH2_USER','9270498357','USER','2026-05-29 15:59:35.706041','google','108370860996490333757','https://lh3.googleusercontent.com/a/ACg8ocKGPrNunTCMguksS8RbC1fCX9Fd86UaDE6T30d4dsrFOwkdS7RJ=s96-c',NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `wishlist`
--

DROP TABLE IF EXISTS `wishlist`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wishlist` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `product_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK6p7qhvy1bfkri13u29x6pu8au` (`product_id`),
  KEY `FKtrd6335blsefl2gxpb8lr0gr7` (`user_id`),
  CONSTRAINT `FK6p7qhvy1bfkri13u29x6pu8au` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  CONSTRAINT `FKtrd6335blsefl2gxpb8lr0gr7` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wishlist`
--

LOCK TABLES `wishlist` WRITE;
/*!40000 ALTER TABLE `wishlist` DISABLE KEYS */;
INSERT INTO `wishlist` VALUES (1,'2026-05-28 08:22:13.659008',9,5),(2,'2026-05-28 08:22:23.389753',7,5),(3,'2026-05-28 08:25:08.007291',11,5);
/*!40000 ALTER TABLE `wishlist` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-29 21:37:27
