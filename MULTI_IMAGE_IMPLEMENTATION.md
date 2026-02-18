# Multi-Image Product System - Implementation Guide

## Overview

This e-commerce platform now supports multiple product images similar to Amazon, where each product can have:
- **1 Main Image** - The primary product image displayed in listings and as the default in product details
- **3 Side View Images** - Additional angles/views of the product for customers to examine

## Database Structure

### ProductImage Table
```sql
CREATE TABLE product_images (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    product_id BIGINT NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (product_id) REFERENCES products(id)
);
```

**Fields:**
- `id`: Unique identifier for the image
- `product_id`: Reference to the product
- `image_url`: Full URL of the image (from cloud storage or public CDN)
- `is_primary`: Boolean flag - TRUE for main image, FALSE for side views

## Backend Structure

### DTOs

#### ProductImageRequest
```java
{
    "imageUrl": "https://example.com/image.jpg",
    "isPrimary": true
}
```

#### ProductRequest
```java
{
    "name": "Product Name",
    "description": "...",
    "price": 99.99,
    "discountPrice": 79.99,
    "stockQuantity": 50,
    "categoryId": 1,
    "images": [
        {"imageUrl": "main-image.jpg", "isPrimary": true},
        {"imageUrl": "side1.jpg", "isPrimary": false},
        {"imageUrl": "side2.jpg", "isPrimary": false},
        {"imageUrl": "side3.jpg", "isPrimary": false}
    ]
}
```

### Service Layer (ProductServiceImpl)

**Image Handling:**
- Validates that at least one image is provided
- Sets the first image as primary if not explicitly marked
- Creates product_images records for all images
- On update, deletes old images and creates new ones

## Admin Panel (Products.jsx)

### Features
1. **4 Image Input Fields:**
   - Main Image (Required) - Marked with blue "MAIN" badge
   - Side View 1 (Optional) - Green "SIDE" badge
   - Side View 2 (Optional) - Purple "SIDE" badge
   - Side View 3 (Optional) - Orange "SIDE" badge

2. **Image Preview:**
   - Thumbnail preview below each URL input
   - Shows the image URL for reference
   - Real-time validation of URLs

3. **Image Management:**
   - Admin pastes image URLs from Google Drive, Dropbox, or any public CDN
   - Images are stored as URLs in the database (no server file storage)
   - All images are required to be publicly accessible

### Workflow
```
Admin Panel (Products.jsx)
    ↓
Paste Image URLs
    ↓
Form Submission
    ↓
ProductRequest with 4 images
    ↓
Backend ProductServiceImpl
    ↓
ProductImage entities saved
    ↓
Database: product_images table
```

## Frontend - Shopping Experience

### ProductDetail Page (ProductDetail.jsx)

**Layout:**
```
┌─────────────────────────────┐
│     MAIN IMAGE              │
│  (Large display area)       │
│                             │
└─────────────────────────────┘

MAIN IMAGE
┌──────┐
│      │  (High resolution)
└──────┘

SIDE VIEWS (3)
┌─────┬─────┬─────┐
│ S1  │ S2  │ S3  │
└─────┴─────┴─────┘
```

**Features:**
1. **Large Main Image Display** - Primary product image
2. **Main Image Thumbnail** - Click to view it in the main display
3. **Side Views Section** - Up to 3 additional images
4. **Interactive Gallery:**
   - Click any thumbnail to display in main viewer
   - Hover effect shows it's clickable
   - Selected image gets golden border
   - Clear "MAIN IMAGE" and "SIDE VIEWS" labels

### ProductCard (ProductCard.jsx)
- Automatically displays the main image (isPrimary = true)
- Falls back to first image if no primary is set
- Maintains zoom effect on hover

## How to Use

### Adding a Product

1. **Admin Login** → Products Panel
2. **Click "+ Add Product"**
3. **Fill Basic Details:**
   - Product Name
   - Category
   - Price & Discount
   - Stock Quantity
   - Description

4. **Add Images:**
   - **Main Image URL:** Paste main product image URL (required)
   - **Side View URLs:** Paste additional angle images (optional)
   - Preview thumbnails appear automatically

5. **Click "Create"**
6. **Product created with all images**

### Editing a Product

1. **Admin Panel** → Click edit icon
2. **Pre-filled Images:**
   - Main image loaded in "Main Image URL"
   - Side views loaded in their respective fields
3. **Modify images as needed**
4. **Click "Update"**

### Viewing as Customer

1. **Browse Shop** or **Search Product**
2. **Click Product Card** → ProductDetail page
3. **See Main Image** with side view thumbnails below
4. **Click Side View** to see that angle
5. **Gallery updates** when you click different images

## Image URL Sources

**Recommended providers:**

1. **Google Drive:**
   - Upload image
   - Share → "Anyone with link"
   - Get shareable link
   - Replace `?usp=sharing` with `?usp=sharing&export=view`

2. **Imgur:**
   - Upload image
   - Copy direct link

3. **Cloudinary:**
   - Upload image
   - Copy public URL

4. **AWS S3:**
   - Upload to S3 bucket
   - Make bucket public
   - Copy object URL

5. **Any CDN:**
   - Ensure image is publicly accessible
   - Copy full image URL

## API Endpoints

### Create Product with Multiple Images
```
POST /api/admin/products
Content-Type: application/json

{
    "name": "Emerald Ring",
    "price": 999,
    "discountPrice": 799,
    "categoryId": 1,
    "stockQuantity": 10,
    "description": "...",
    "images": [
        {"imageUrl": "https://...", "isPrimary": true},
        {"imageUrl": "https://...", "isPrimary": false},
        {"imageUrl": "https://...", "isPrimary": false},
        {"imageUrl": "https://...", "isPrimary": false}
    ]
}
```

### Update Product Images
```
PUT /api/admin/products/{id}
Content-Type: application/json

{
    "name": "...",
    "images": [
        {"imageUrl": "https://...", "isPrimary": true},
        ...
    ]
}
```

### Response
```json
{
    "success": true,
    "message": "Product created successfully",
    "data": {
        "id": 1,
        "name": "Emerald Ring",
        "images": [
            {
                "id": 101,
                "imageUrl": "https://...",
                "isPrimary": true
            },
            {
                "id": 102,
                "imageUrl": "https://...",
                "isPrimary": false
            }
        ]
    }
}
```

## Database Query Examples

### Get all images of a product
```sql
SELECT * FROM product_images WHERE product_id = 1 ORDER BY is_primary DESC;
```

### Get primary image
```sql
SELECT * FROM product_images WHERE product_id = 1 AND is_primary = TRUE LIMIT 1;
```

### Add new image to existing product
```sql
INSERT INTO product_images (product_id, image_url, is_primary) 
VALUES (1, 'https://example.com/new-image.jpg', FALSE);
```

## Frontend Files Modified

1. **frontend/src/admin/pages/Products.jsx**
   - Updated to accept 4 image URLs
   - New state management for productImages object
   - Updated onSubmit to send images with isPrimary flag

2. **frontend/src/pages/ProductDetail.jsx**
   - Separates main image from side views
   - Better gallery organization
   - Clear labels for image sections

3. **frontend/src/components/product/ProductCard.jsx**
   - Already displays primary image

## Backend Files Modified

1. **src/main/java/com/jewelryshop/dto/ProductImageRequest.java** (NEW)
   - DTO for image with isPrimary flag

2. **src/main/java/com/jewelryshop/dto/ProductRequest.java**
   - Added `images` field for new format
   - Kept `imageUrls` for backward compatibility

3. **src/main/java/com/jewelryshop/service/impl/ProductServiceImpl.java**
   - Updated createProduct() to handle multiple images
   - Updated updateProduct() to handle multiple images
   - Supports both old (imageUrls) and new (images) formats

## Backward Compatibility

The system supports both old and new formats:

**Old Format (Still Works):**
```json
{
    "imageUrls": ["url1", "url2", "url3"]
}
```

**New Format (Recommended):**
```json
{
    "images": [
        {"imageUrl": "url1", "isPrimary": true},
        {"imageUrl": "url2", "isPrimary": false}
    ]
}
```

The backend automatically handles conversion and sets isPrimary accordingly.

## Images Organization

### In Database
```
product_images table:
- Main image: is_primary = TRUE
- Side views: is_primary = FALSE
- Can have up to 4 images total
```

### In Admin Panel
```
Main Image:     [URL input] [Preview]
Side View 1:    [URL input] [Preview]
Side View 2:    [URL input] [Preview]
Side View 3:    [URL input] [Preview]
```

### In Shopping Experience
```
ProductCard:        Shows main image only
ProductDetail:      Main + 3 side view thumbnails
Gallery:            Click to switch between views
```

## Best Practices

1. **Image Quality:**
   - Use high-resolution images (at least 600x600px)
   - Compress images for faster loading
   - Use consistent aspect ratios

2. **URL Management:**
   - Use direct image URLs only
   - Ensure URLs are permanent and publicly accessible
   - Test URLs before saving

3. **Main Image:**
   - Make main image the best representation
   - Should be clear, well-lit product photo
   - Front/natural angle recommended

4. **Side Views:**
   - Show different angles (left, right, back sides)
   - Show product in use when applicable
   - Helps customers make informed decisions

## Troubleshooting

**Issue:** Image not showing in gallery
- **Solution:** Verify image URL is publicly accessible

**Issue:** Wrong image shows as main
- **Solution:** Check isPrimary flag, re-save product

**Issue:** Side views not appearing
- **Solution:** Ensure side view URLs are valid

**Issue:** Database showing multiple primary images
- **Solution:** Only one image per product should have is_primary = TRUE

## Future Enhancements

1. **Drag-to-reorder** images in admin panel
2. **Image zooming** feature in product detail
3. **Image alt text** customization
4. **Image carousel/slider** for mobile
5. **360-degree view** integration
6. **Direct upload** from admin panel (optional)

---

**Version:** 1.0
**Last Updated:** February 13, 2026
**Status:** Production Ready
