-- 创建数据库
CREATE DATABASE IF NOT EXISTS backend CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE backend;

-- 用户表
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    email VARCHAR(100),
    phone VARCHAR(20),
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    last_login_at DATETIME,
    INDEX idx_users_role (role),
    INDEX idx_users_status (status),
    INDEX idx_users_created_at (created_at)
);

-- 资产表
CREATE TABLE IF NOT EXISTS assets (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    name VARCHAR(50) NOT NULL,
    type VARCHAR(20) NOT NULL,
    quantity DECIMAL(18,6) NOT NULL,
    price DECIMAL(18,6) NOT NULL,
    current_value DECIMAL(18,6) NOT NULL,
    cost_price DECIMAL(18,6) NOT NULL,
    profit_rate DECIMAL(10,2),
    crypto_type VARCHAR(20),
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_assets_user_id (user_id),
    INDEX idx_assets_type (type),
    INDEX idx_assets_crypto_type (crypto_type)
);

-- 资产历史表
CREATE TABLE IF NOT EXISTS asset_history (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    asset_id BIGINT NOT NULL,
    date DATE NOT NULL,
    price DECIMAL(18,6) NOT NULL,
    value DECIMAL(18,6) NOT NULL,
    percentage DECIMAL(10,2) NOT NULL,
    created_at DATETIME NOT NULL,
    FOREIGN KEY (asset_id) REFERENCES assets(id) ON DELETE CASCADE,
    INDEX IX_asset_history_asset_date (asset_id, date)
);

-- 消息表
CREATE TABLE IF NOT EXISTS messages (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    content LONGTEXT NOT NULL,
    crypto_type VARCHAR(20) NOT NULL,
    market_impact VARCHAR(20) NOT NULL,
    publish_time DATETIME NOT NULL,
    created_at DATETIME NOT NULL,
    INDEX idx_messages_crypto_type (crypto_type),
    INDEX idx_messages_market_impact (market_impact),
    INDEX idx_messages_publish_time (publish_time)
);

-- 用户消息关联表
CREATE TABLE IF NOT EXISTS user_messages (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    message_id BIGINT NOT NULL,
    is_read TINYINT(1) NOT NULL DEFAULT 0,
    read_at DATETIME,
    created_at DATETIME NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (message_id) REFERENCES messages(id) ON DELETE CASCADE,
    UNIQUE KEY uk_user_message (user_id, message_id),
    INDEX idx_user_messages_is_read (is_read),
    INDEX idx_user_messages_created_at (created_at)
);

-- 操作日志表
CREATE TABLE IF NOT EXISTS operation_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    operator_id BIGINT NOT NULL,
    operation VARCHAR(100) NOT NULL,
    operation_type VARCHAR(20) NOT NULL,
    target_entity VARCHAR(50),
    target_id BIGINT,
    details LONGTEXT,
    ip_address VARCHAR(50),
    user_agent VARCHAR(500),
    created_at DATETIME NOT NULL,
    FOREIGN KEY (operator_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_operation_logs_operator_id (operator_id),
    INDEX idx_operation_logs_operation_type (operation_type),
    INDEX idx_operation_logs_created_at (created_at)
);

-- 报告表
CREATE TABLE IF NOT EXISTS reports (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    analyst_id BIGINT NOT NULL,
    reviewer_id BIGINT,
    title VARCHAR(200) NOT NULL,
    crypto_type VARCHAR(20) NOT NULL,
    confidence_index DECIMAL(5,2) NOT NULL,
    expected_change DECIMAL(8,2),
    content LONGTEXT NOT NULL,
    status VARCHAR(20) NOT NULL,
    review_comment LONGTEXT,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    reviewed_at DATETIME,
    publish_at DATETIME,
    FOREIGN KEY (analyst_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (reviewer_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_reports_analyst_id (analyst_id),
    INDEX idx_reports_reviewer_id (reviewer_id),
    INDEX idx_reports_crypto_type (crypto_type),
    INDEX idx_reports_status (status),
    INDEX idx_reports_created_at (created_at)
);

-- 系统设置表
CREATE TABLE IF NOT EXISTS system_settings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(100) NOT NULL,
    setting_value LONGTEXT NOT NULL,
    description VARCHAR(200),
    data_type VARCHAR(20) NOT NULL,
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    INDEX idx_system_settings_key (setting_key),
    INDEX idx_system_settings_is_active (is_active)
);

-- 插入初始数据

-- 插入管理员用户（密码：admin123）
INSERT INTO users (username, password, name, role, status, created_at, updated_at) 
VALUES ('admin', '$2a$10$e4f8Q7R6T5Y4U3I2O1P0N9M8L7K6J5H4G3F2E1D0C9B8A7', '管理员', 'admin', 'active', NOW(), NOW());

-- 插入系统设置
INSERT INTO system_settings (setting_key, setting_value, description, data_type, created_at, updated_at) 
VALUES 
('system_name', '资产管理系统', '系统名称', 'string', NOW(), NOW()),
('system_version', '1.0.0', '系统版本', 'string', NOW(), NOW()),
('crypto_currencies', '["BTC", "ETH", "SOL", "DOT", "ADA"]', '支持的加密货币类型', 'json', NOW(), NOW()),
('asset_types', '["股票", "债券", "基金", "房产", "现金", "加密货币"]', '支持的资产类型', 'json', NOW(), NOW());
