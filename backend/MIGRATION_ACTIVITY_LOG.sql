-- Migration: Create ActivityLog table
-- Created: 2026-03-10
-- Purpose: Track user activities like login, add_to_cart, purchase, etc.

CREATE TABLE IF NOT EXISTS activity_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    activity_type VARCHAR(50) NOT NULL,
    description VARCHAR(500) NOT NULL,
    entity_type VARCHAR(50),
    entity_id BIGINT,
    status VARCHAR(50),
    ip_address VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    KEY idx_activity_user (user_id),
    KEY idx_activity_type (activity_type),
    KEY idx_activity_created (created_at),
    CONSTRAINT fk_activity_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Index for performance on common queries
CREATE INDEX idx_activity_user_type ON activity_logs(user_id, activity_type);
