-- SQL Migration: Increase Image URL and Path Column Length
-- Purpose: Handle long Cloudinary URLs

-- Modify image_url column in product_images table
ALTER TABLE product_images 
MODIFY COLUMN image_url VARCHAR(1000);

-- Modify image_path column in product_images table
ALTER TABLE product_images 
MODIFY COLUMN image_path VARCHAR(1000);
