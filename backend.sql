/*
 Navicat Premium Dump SQL

 Source Server         : test
 Source Server Type    : MySQL
 Source Server Version : 110502 (11.5.2-MariaDB)
 Source Host           : localhost:3306
 Source Schema         : backend

 Target Server Type    : MySQL
 Target Server Version : 110502 (11.5.2-MariaDB)
 File Encoding         : 65001

 Date: 16/12/2025 19:00:07
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for asset_history
-- ----------------------------
DROP TABLE IF EXISTS `asset_history`;
CREATE TABLE `asset_history`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `asset_id` bigint NOT NULL,
  `date` date NOT NULL,
  `price` decimal(18, 6) NOT NULL,
  `value` decimal(18, 6) NOT NULL,
  `percentage` decimal(10, 2) NOT NULL,
  `created_at` datetime NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `IX_asset_history_asset_date`(`asset_id` ASC, `date` ASC) USING BTREE,
  CONSTRAINT `asset_history_ibfk_1` FOREIGN KEY (`asset_id`) REFERENCES `assets` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of asset_history
-- ----------------------------

-- ----------------------------
-- Table structure for assets
-- ----------------------------
DROP TABLE IF EXISTS `assets`;
CREATE TABLE `assets`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `quantity` decimal(18, 6) NOT NULL,
  `price` decimal(18, 6) NOT NULL,
  `current_value` decimal(18, 6) NOT NULL,
  `cost_price` decimal(18, 6) NOT NULL,
  `profit_rate` decimal(10, 2) NULL DEFAULT NULL,
  `crypto_type` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_assets_user_id`(`user_id` ASC) USING BTREE,
  INDEX `idx_assets_type`(`type` ASC) USING BTREE,
  INDEX `idx_assets_crypto_type`(`crypto_type` ASC) USING BTREE,
  CONSTRAINT `assets_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;-- ----------------------------
-- Records of assets
-- ----------------------------
INSERT INTO `assets` VALUES (1, 1, 'BTC', '加密货币', 66.666667, 60000.000000, 4000000.000000, 60000.000000, 0.00, 'BTC', '2025-12-16 08:21:47', '2025-12-16 08:21:47');
INSERT INTO `assets` VALUES (2, 1, 'ETH', '加密货币', 1750.000000, 2000.000000, 3500000.000000, 2000.000000, 0.00, 'ETH', '2025-12-16 08:21:47', '2025-12-16 08:21:47');
INSERT INTO `assets` VALUES (3, 1, 'SOL', '加密货币', 15000.000000, 100.000000, 1500000.000000, 100.000000, 0.00, 'SOL', '2025-12-16 08:21:47', '2025-12-16 08:21:47');
INSERT INTO `assets` VALUES (4, 1, 'USDT', '加密货币', 1000000.000000, 1.000000, 1000000.000000, 1.000000, 0.00, 'USDT', '2025-12-16 08:21:47', '2025-12-16 08:21:47');

-- ----------------------------
-- Table structure for cryptocurrencies
-- ----------------------------
DROP TABLE IF EXISTS `cryptocurrencies`;
CREATE TABLE `cryptocurrencies`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` decimal(18, 6) NOT NULL,
  `price_currency` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `symbol` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 31 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of cryptocurrencies
-- ----------------------------
INSERT INTO `cryptocurrencies` VALUES (1, '2025-12-16 03:39:48.575429', '比特币', 605828.060000, 'CNY', 'BTC', '2025-12-16 03:39:48.575429');
INSERT INTO `cryptocurrencies` VALUES (2, '2025-12-16 03:39:48.633415', '以太币', 20820.100000, 'CNY', 'ETH', '2025-12-16 03:39:48.633415');
INSERT INTO `cryptocurrencies` VALUES (3, '2025-12-16 03:39:48.635420', '泰达币', 7.040000, 'CNY', 'USDT', '2025-12-16 03:39:48.635420');
INSERT INTO `cryptocurrencies` VALUES (4, '2025-12-16 03:39:48.637417', '币安币', 6027.100000, 'CNY', 'BNB', '2025-12-16 03:39:48.637417');
INSERT INTO `cryptocurrencies` VALUES (5, '2025-12-16 03:39:48.639399', '瑞波币', 13.300000, 'CNY', 'XRP', '2025-12-16 03:39:48.639399');
INSERT INTO `cryptocurrencies` VALUES (6, '2025-12-16 03:39:48.641395', '美元币', 7.040000, 'CNY', 'USDC', '2025-12-16 03:39:48.641395');
INSERT INTO `cryptocurrencies` VALUES (7, '2025-12-16 03:39:48.643483', 'Solana', 895.200000, 'CNY', 'SOL', '2025-12-16 03:39:48.643483');
INSERT INTO `cryptocurrencies` VALUES (8, '2025-12-16 03:39:48.644480', '波场币', 1.960000, 'CNY', 'TRX', '2025-12-16 03:39:48.644480');
INSERT INTO `cryptocurrencies` VALUES (9, '2025-12-16 03:39:48.646475', '狗狗币', 0.911300, 'CNY', 'DOGE', '2025-12-16 03:39:48.646475');
INSERT INTO `cryptocurrencies` VALUES (10, '2025-12-16 03:39:48.647472', '艾达币', 2.720000, 'CNY', 'ADA', '2025-12-16 03:39:48.647472');
INSERT INTO `cryptocurrencies` VALUES (11, '2025-12-16 03:39:48.649466', '比特币现金', 3788.700000, 'CNY', 'BCH', '2025-12-16 03:39:48.649466');
INSERT INTO `cryptocurrencies` VALUES (12, '2025-12-16 03:39:48.650493', 'Hyperliquid', 192.650000, 'CNY', 'HYPE', '2025-12-16 03:39:48.650493');
INSERT INTO `cryptocurrencies` VALUES (13, '2025-12-16 03:39:48.651461', 'Chainlink', 90.320000, 'CNY', 'LINK', '2025-12-16 03:39:48.651461');
INSERT INTO `cryptocurrencies` VALUES (14, '2025-12-16 03:39:48.652459', 'UNUS SED LEO', 65.070000, 'CNY', 'LEO', '2025-12-16 03:39:48.652459');
INSERT INTO `cryptocurrencies` VALUES (15, '2025-12-16 03:39:48.653483', 'Monero', 2869.880000, 'CNY', 'XMR', '2025-12-16 03:39:48.653483');
INSERT INTO `cryptocurrencies` VALUES (16, '2025-12-16 03:46:05.554220', '比特币', 605828.060000, 'CNY', 'BTC', '2025-12-16 03:46:05.554220');
INSERT INTO `cryptocurrencies` VALUES (17, '2025-12-16 03:46:05.594481', '以太币', 20820.100000, 'CNY', 'ETH', '2025-12-16 03:46:05.594481');
INSERT INTO `cryptocurrencies` VALUES (18, '2025-12-16 03:46:05.595479', '泰达币', 7.040000, 'CNY', 'USDT', '2025-12-16 03:46:05.595479');
INSERT INTO `cryptocurrencies` VALUES (19, '2025-12-16 03:46:05.597474', '币安币', 6027.100000, 'CNY', 'BNB', '2025-12-16 03:46:05.597474');
INSERT INTO `cryptocurrencies` VALUES (20, '2025-12-16 03:46:05.598471', '瑞波币', 13.300000, 'CNY', 'XRP', '2025-12-16 03:46:05.598471');
INSERT INTO `cryptocurrencies` VALUES (21, '2025-12-16 03:46:05.600466', '美元币', 7.040000, 'CNY', 'USDC', '2025-12-16 03:46:05.600466');
INSERT INTO `cryptocurrencies` VALUES (22, '2025-12-16 03:46:05.602461', 'Solana', 895.200000, 'CNY', 'SOL', '2025-12-16 03:46:05.602461');
INSERT INTO `cryptocurrencies` VALUES (23, '2025-12-16 03:46:05.603458', '波场币', 1.960000, 'CNY', 'TRX', '2025-12-16 03:46:05.603458');
INSERT INTO `cryptocurrencies` VALUES (24, '2025-12-16 03:46:05.605452', '狗狗币', 0.911300, 'CNY', 'DOGE', '2025-12-16 03:46:05.605452');
INSERT INTO `cryptocurrencies` VALUES (25, '2025-12-16 03:46:05.607448', '艾达币', 2.720000, 'CNY', 'ADA', '2025-12-16 03:46:05.607448');
INSERT INTO `cryptocurrencies` VALUES (26, '2025-12-16 03:46:05.609443', '比特币现金', 3788.700000, 'CNY', 'BCH', '2025-12-16 03:46:05.609443');
INSERT INTO `cryptocurrencies` VALUES (27, '2025-12-16 03:46:05.610439', 'Hyperliquid', 192.650000, 'CNY', 'HYPE', '2025-12-16 03:46:05.610439');
INSERT INTO `cryptocurrencies` VALUES (28, '2025-12-16 03:46:05.611437', 'Chainlink', 90.320000, 'CNY', 'LINK', '2025-12-16 03:46:05.611437');
INSERT INTO `cryptocurrencies` VALUES (29, '2025-12-16 03:46:05.613431', 'UNUS SED LEO', 65.070000, 'CNY', 'LEO', '2025-12-16 03:46:05.613431');
INSERT INTO `cryptocurrencies` VALUES (30, '2025-12-16 03:46:05.614429', 'Monero', 2869.880000, 'CNY', 'XMR', '2025-12-16 03:46:05.614429');

-- ----------------------------
-- Table structure for messages
-- ----------------------------
DROP TABLE IF EXISTS `messages`;
CREATE TABLE `messages`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `title` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `crypto_type` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `market_impact` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `publish_time` datetime NOT NULL,
  `created_at` datetime NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_messages_crypto_type`(`crypto_type` ASC) USING BTREE,
  INDEX `idx_messages_market_impact`(`market_impact` ASC) USING BTREE,
  INDEX `idx_messages_publish_time`(`publish_time` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of messages
-- ----------------------------

-- ----------------------------
-- Table structure for operation_logs
-- ----------------------------
DROP TABLE IF EXISTS `operation_logs`;
CREATE TABLE `operation_logs`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `operator_id` bigint NOT NULL,
  `operation` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `operation_type` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `target_entity` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `target_id` bigint NULL DEFAULT NULL,
  `details` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `ip_address` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `user_agent` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `created_at` datetime NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_operation_logs_operator_id`(`operator_id` ASC) USING BTREE,
  INDEX `idx_operation_logs_operation_type`(`operation_type` ASC) USING BTREE,
  INDEX `idx_operation_logs_created_at`(`created_at` ASC) USING BTREE,
  CONSTRAINT `operation_logs_ibfk_1` FOREIGN KEY (`operator_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of operation_logs
-- ----------------------------

-- ----------------------------
-- Table structure for reports
-- ----------------------------
DROP TABLE IF EXISTS `reports`;
CREATE TABLE `reports`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `analyst_id` bigint NOT NULL,
  `reviewer_id` bigint NULL DEFAULT NULL,
  `title` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `crypto_type` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `confidence_index` decimal(5, 2) NOT NULL,
  `expected_change` decimal(8, 2) NULL DEFAULT NULL,
  `content` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `review_comment` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `reviewed_at` datetime NULL DEFAULT NULL,
  `publish_at` datetime NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_reports_analyst_id`(`analyst_id` ASC) USING BTREE,
  INDEX `idx_reports_reviewer_id`(`reviewer_id` ASC) USING BTREE,
  INDEX `idx_reports_crypto_type`(`crypto_type` ASC) USING BTREE,
  INDEX `idx_reports_status`(`status` ASC) USING BTREE,
  INDEX `idx_reports_created_at`(`created_at` ASC) USING BTREE,
  CONSTRAINT `reports_ibfk_1` FOREIGN KEY (`analyst_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `reports_ibfk_2` FOREIGN KEY (`reviewer_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of reports
-- ----------------------------

-- ----------------------------
-- Table structure for system_settings
-- ----------------------------
DROP TABLE IF EXISTS `system_settings`;
CREATE TABLE `system_settings`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `setting_key` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `setting_value` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `data_type` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_system_settings_key`(`setting_key` ASC) USING BTREE,
  INDEX `idx_system_settings_is_active`(`is_active` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of system_settings
-- ----------------------------
INSERT INTO `system_settings` VALUES (1, 'system_name', '资产管理系统', '系统名称', 'string', 1, '2025-12-16 08:21:47', '2025-12-16 08:21:47');
INSERT INTO `system_settings` VALUES (2, 'system_version', '1.0.0', '系统版本', 'string', 1, '2025-12-16 08:21:47', '2025-12-16 08:21:47');
INSERT INTO `system_settings` VALUES (3, 'crypto_currencies', '[\"BTC\", \"ETH\", \"SOL\", \"DOT\", \"ADA\"]', '支持的加密货币类型', 'json', 1, '2025-12-16 08:21:47', '2025-12-16 08:21:47');
INSERT INTO `system_settings` VALUES (4, 'asset_types', '[\"股票\", \"债券\", \"基金\", \"房产\", \"现金\", \"加密货币\"]', '支持的资产类型', 'json', 1, '2025-12-16 08:21:47', '2025-12-16 08:21:47');

-- ----------------------------
-- Table structure for user_messages
-- ----------------------------
DROP TABLE IF EXISTS `user_messages`;
CREATE TABLE `user_messages`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `message_id` bigint NOT NULL,
  `is_read` tinyint(1) NOT NULL DEFAULT 0,
  `read_at` datetime NULL DEFAULT NULL,
  `created_at` datetime NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_user_message`(`user_id` ASC, `message_id` ASC) USING BTREE,
  UNIQUE INDEX `UKmvla84vf6earpp9wj1ye4ll10`(`user_id` ASC, `message_id` ASC) USING BTREE,
  INDEX `message_id`(`message_id` ASC) USING BTREE,
  INDEX `idx_user_messages_is_read`(`is_read` ASC) USING BTREE,
  INDEX `idx_user_messages_created_at`(`created_at` ASC) USING BTREE,
  CONSTRAINT `user_messages_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `user_messages_ibfk_2` FOREIGN KEY (`message_id`) REFERENCES `messages` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user_messages
-- ----------------------------

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `username` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `last_login_at` datetime NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `username`(`username` ASC) USING BTREE,
  INDEX `idx_users_role`(`role` ASC) USING BTREE,
  INDEX `idx_users_status`(`status` ASC) USING BTREE,
  INDEX `idx_users_created_at`(`created_at` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES (1, 'admin', '$2a$10$e4f8Q7R6T5Y4U3I2O1P0N9M8L7K6J5H4G3F2E1D0C9B8A7', '管理员', 'admin', 'active', NULL, NULL, '2025-12-16 08:21:47', '2025-12-16 08:21:47', NULL);

SET FOREIGN_KEY_CHECKS = 1;
