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
  `sale_start_date` datetime(6) DEFAULT NULL,
  `sale_end_date` datetime(6) DEFAULT NULL,
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
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_fhmd06dsmj6k0n90swsh8ie9g` (`sku`),
  KEY `idx_products_category` (`category_id`),
  CONSTRAINT `FKog2rp4qthbtt2lfyhfo32lsw9` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-29 12:08:22
