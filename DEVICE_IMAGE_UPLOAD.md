# Device Image Upload System - Complete Implementation

## Overview
Admins can now upload product images from their device. Images are stored on the backend server and displayed across the website.

## How It Works

### 1. Frontend Flow
- **Admin clicks** "Select Images from Your Device" button in Product form
- **Selects up to 4 images** from their computer
- **Component automatically uploads** each image to the backend
- **Backend returns image URL** (e.g., `/uploads/uuid-filename.jpg`)
- **Frontend stores URLs** in the form state
- **Images appear as previews** while editing
- **Product is saved** with image URLs stored in database

### 2. Backend Flow
```
MultipartFile (on /api/products/admin/upload-image)
    ↓
FileUploadService.uploadFile(file)
    ↓
Validates: file type, size (max 5MB), extension
    ↓
Generates unique filename with UUID
    ↓
Saves to: uploads/ directory
    ↓
Returns: /uploads/{uuid-filename}
    ↓
WebConfig serves /uploads/** from file:uploads/
    ↓
Frontend accesses: http://localhost:8080/uploads/{uuid-filename}
```

### 3. Database Storage
Images are stored as URLs in `product_images` table:
```
product_images:
  - id: 1
  - product_id: 5
  - image_url: /uploads/a1b2c3d4-image.jpg  ← URL to access from website
  - image_name: uploaded-filename.jpg
  - image_path: /uploads/a1b2c3d4-image.jpg
  - file_size: 245678
  - mime_type: image/jpeg
  - is_primary: 1
  - uploaded_at: 2026-02-13...
```

## Files Modified

### Frontend
1. **src/components/GoogleDrivePicker.jsx** (renamed Purpose: File Upload)
   - Handles file selection from device
   - Uploads to `/api/products/admin/upload-image`
   - Includes auth token in request
   - Shows upload progress

2. **src/admin/pages/Products.jsx**
   - Imports FileUpload component
   - `handleFileUpload()` - processes uploaded files
   - Maps uploaded files to imageUrls state
   - Displays image previews

### Backend (Already Configured)
1. **ProductController.java**
   - Endpoint: `POST /api/products/admin/upload-image`
   - Requires: @PreAuthorize("ADMIN"), MultipartFile
   - Returns: imageUrl, fileName, fileSize, mimeType

2. **FileUploadService.java**
   - Validates image files
   - Generates unique filenames
   - Saves to `uploads/` directory
   - Returns image path

3. **WebConfig.java**
   - Maps `/uploads/**` to `file:uploads/`
   - Allows serving uploaded images

## Step-by-Step Usage

### For Admin (Adding Product)
1. Go to Admin → Products → Add Product
2. Fill in product details (name, price, category, etc.)
3. Scroll to "Product Images" section
4. Click "📤 Select Images from Your Device"
5. Choose 1-4 images from your computer
6. Wait for upload progress to complete
7. Images appear as previews below
8. (Optional) Remove any image with "Remove" button
9. Click "Add Product" to save

### For Admin (Editing Product)
1. Go to Products → Click Edit on a product
2. Current images are shown in previews
3. To add more images: Click "Select Images from Your Device"
4. To remove: Click "Remove"
5. Click "Update" to save changes

### For Customers
1. Images display normally in Shop and Product Detail pages
2. Gallery shows main image + 3 side view thumbnails
3. Click thumbnails to change main image

## Validation & Constraints

### File Validation
- ✅ Must be image format (jpg, jpeg, png, gif, webp)
- ✅ Maximum file size: 5MB
- ✅ Maximum 4 images per product

### Image Assignment
- Image 1 (first selected) → Main Image
- Image 2 (second selected) → Side View 1
- Image 3 (third selected) → Side View 2
- Image 4 (fourth selected) → Side View 3

## Technical Details

### Upload Endpoint
```
POST /api/products/admin/upload-image
Content-Type: multipart/form-data
Authorization: Bearer {authToken}

Request:
- file: MultipartFile

Response (201 Created):
{
  "success": true,
  "message": "Image uploaded successfully",
  "data": {
    "imageUrl": "/uploads/a1b2c3d4-e5f6.jpg",
    "fileName": "original-filename.jpg",
    "fileSize": 123456,
    "mimeType": "image/jpeg"
  }
}
```

### File Storage
```
Project Root/
├── uploads/
│   ├── a1b2c3d4-e5f6.jpg
│   ├── b2c3d4e5-f6g7.png
│   └── ... (more uploaded images)
├── backend/
├── frontend/
└── ...
```

### Image URLs
The `imageUrl` returned is a relative path that gets displayed as:
- Database stores: `/uploads/a1b2c3d4-e5f6.jpg`
- Browser accesses: `http://localhost:8080/uploads/a1b2c3d4-e5f6.jpg`
- In production: `https://yourdomain.com/uploads/a1b2c3d4-e5f6.jpg`

## Error Handling

| Error | Cause | Solution |
|-------|-------|----------|
| "Please login first" | No auth token | Login to admin account |
| "Upload failed" | Server error | Check backend logs |
| "Not an image file" | Wrong file type | Select jpg/png/gif/webp |
| "File size exceeded" | File > 5MB | Compress image and retry |
| "No images uploaded" | Upload failed silently | Check file size & type |

## Benefits of This Approach

✅ **Images stored on server** - Not in database (saves space, faster load)
✅ **Accessible from website** - Direct URL serving via WebConfig
✅ **Scalable** - Can handle large images with relative URLs
✅ **Secure** - Requires admin authentication
✅ **Validated** - File type & size checking on backend
✅ **Organized** - UUID filenames prevent conflicts
✅ **Automatic** - No manual processing needed

## Future Enhancements

- Add image compression before storage
- Add drag-and-drop upload
- Add bulk delete of old images
- Add image CDN support
- Add backup/archive of deleted images
