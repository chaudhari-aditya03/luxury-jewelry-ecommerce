# Complete Guide: Image Upload & Display in E-Commerce Platform

## Production-Level Image Handling Solution

### 📁 Project Structure
```
backend/
├── uploads/                     # Image storage directory
├── src/main/java/com/jewelryshop/
│   ├── config/
│   │   └── WebConfig.java      # Static resource configuration
│   ├── controller/
│   │   └── ProductController.java
│   ├── service/
│   │   ├── FileUploadService.java
│   │   └── impl/FileUploadServiceImpl.java
│   └── resources/
│       └── application.properties
frontend/
├── src/
│   ├── utils/
│   │   └── helpers.js          # Image URL helper
│   └── components/
```

---

## 🔧 Backend Configuration

### 1. **FileUploadService.java** (Interface)
```java
package com.jewelryshop.service;

import org.springframework.web.multipart.MultipartFile;

public interface FileUploadService {
    String uploadFile(MultipartFile file);
    void deleteFile(String fileUrl);
}
```

### 2. **FileUploadServiceImpl.java** (Implementation)
```java
package com.jewelryshop.service.impl;

import com.jewelryshop.service.FileUploadService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class FileUploadServiceImpl implements FileUploadService {

    @Value("${file.upload.dir:uploads}")
    private String uploadDir;

    private static final String[] ALLOWED_EXTENSIONS = {"jpg", "jpeg", "png", "gif", "webp"};
    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

    @Override
    public String uploadFile(MultipartFile file) {
        try {
            log.info("Starting file upload. Upload directory: {}", uploadDir);
            
            // Validate file
            validateFile(file);

            // Create upload directory if it doesn't exist
            File uploadDirectory = new File(uploadDir);
            if (!uploadDirectory.exists()) {
                boolean created = uploadDirectory.mkdirs();
                log.info("Created upload directory: {} (success: {})", uploadDir, created);
            }

            // Generate unique filename
            String originalFilename = file.getOriginalFilename();
            String fileExtension = getFileExtension(originalFilename);
            String newFilename = UUID.randomUUID() + "." + fileExtension;

            // Save file
            Path filePath = Paths.get(uploadDir, newFilename).toAbsolutePath();
            Files.write(filePath, file.getBytes());

            log.info("File uploaded successfully: {}", newFilename);

            // Return relative URL path
            return "/uploads/" + newFilename;

        } catch (IOException e) {
            log.error("Error uploading file: {}", e.getMessage(), e);
            throw new RuntimeException("File upload failed: " + e.getMessage());
        }
    }

    @Override
    public void deleteFile(String fileUrl) {
        try {
            if (fileUrl == null || fileUrl.isEmpty()) {
                return;
            }

            String filename = fileUrl.contains("/") ? 
                fileUrl.substring(fileUrl.lastIndexOf("/") + 1) : fileUrl;

            Path filePath = Paths.get(uploadDir, filename);
            if (Files.exists(filePath)) {
                Files.delete(filePath);
                log.info("File deleted successfully: {}", filename);
            }
        } catch (IOException e) {
            log.error("Error deleting file: {}", e.getMessage());
        }
    }

    private void validateFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new RuntimeException("File is empty");
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new RuntimeException("File size exceeds maximum limit of 5MB");
        }

        String fileExtension = getFileExtension(file.getOriginalFilename());
        boolean isAllowed = false;
        for (String ext : ALLOWED_EXTENSIONS) {
            if (ext.equalsIgnoreCase(fileExtension)) {
                isAllowed = true;
                break;
            }
        }

        if (!isAllowed) {
            throw new RuntimeException("File type not allowed. Allowed types: " + 
                String.join(", ", ALLOWED_EXTENSIONS));
        }
    }

    private String getFileExtension(String filename) {
        if (filename == null || filename.lastIndexOf(".") == -1) {
            return "";
        }
        return filename.substring(filename.lastIndexOf(".") + 1);
    }
}
```

### 3. **ProductController.java** (Upload Endpoint)
```java
@PostMapping("/admin/upload-image")
@PreAuthorize("hasRole('ADMIN')")
@Operation(summary = "Upload product image (Admin)")
public ResponseEntity<ApiResponse<Map<String, Object>>> uploadImage(
        @RequestParam("file") MultipartFile file) {
    log.info("Uploading image file: {}", file.getOriginalFilename());
    
    String imageUrl = fileUploadService.uploadFile(file);
    
    Map<String, Object> response = new HashMap<>();
    response.put("imageUrl", imageUrl);
    response.put("fileName", file.getOriginalFilename());
    response.put("fileSize", file.getSize());
    response.put("mimeType", file.getContentType());
    
    return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.success("Image uploaded successfully", response));
}
```

### 4. **WebConfig.java** (Static Resource Handler)
```java
package com.jewelryshop.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.io.File;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${file.upload.dir:uploads}")
    private String uploadDir;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Serve uploaded files from the uploads directory
        File uploadDirectory = new File(uploadDir);
        String absolutePath = uploadDirectory.getAbsolutePath();
        
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:" + absolutePath + "/")
                .setCachePeriod(3600); // Cache for 1 hour
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:3000", "http://localhost:5173")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }
}
```

### 5. **application.properties**
```properties
# =====================================================
# FILE UPLOAD CONFIGURATION
# =====================================================
spring.servlet.multipart.enabled=true
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=50MB
file.upload.dir=uploads

# =====================================================
# CORS CONFIGURATION
# =====================================================
cors.allowed.origins=http://localhost:3000,http://localhost:5173
cors.allowed.methods=GET,POST,PUT,DELETE,OPTIONS
cors.allowed.headers=*
cors.allow.credentials=true
```

---

## 🎨 Frontend Configuration

### 1. **Helper Function (utils/helpers.js)**
```javascript
/**
 * Converts relative image URLs to absolute URLs
 * @param {string} imageUrl - Relative or absolute image URL
 * @returns {string} - Absolute image URL
 */
export const getImageUrl = (imageUrl) => {
  if (!imageUrl) return 'https://via.placeholder.com/300';
  
  // If it's already a full URL (http/https), return as is
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  
  // If it's a relative path, prepend the backend base URL
  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
  const BASE_URL = API_BASE.replace('/api', '');
  
  // Remove leading slash if present
  const cleanPath = imageUrl.startsWith('/') ? imageUrl : '/' + imageUrl;
  
  return BASE_URL + cleanPath;
};
```

### 2. **API Service (services/index.js)**
```javascript
export const adminService = {
  // Upload product image
  uploadProductImage: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post('/admin/upload-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  
  // Other admin methods...
};
```

### 3. **React Component Usage**

#### **Admin Product Form (Upload)**
```jsx
import { Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { adminService } from '../../services';
import { getImageUrl } from '../../utils/helpers';

const AdminProducts = () => {
  const [fileList, setFileList] = useState([]);

  const handleUploadImage = async (file) => {
    try {
      const response = await adminService.uploadProductImage(file);
      const imageUrl = response.data.data.imageUrl;
      message.success('Image uploaded successfully');
      return imageUrl;
    } catch (error) {
      message.error('Failed to upload image');
      return null;
    }
  };

  const handleSubmit = async (values) => {
    // Upload images
    const imageUrls = [];
    for (const file of fileList) {
      if (file.originFileObj) {
        const imageUrl = await handleUploadImage(file.originFileObj);
        if (imageUrl) imageUrls.push(imageUrl);
      } else if (file.url) {
        imageUrls.push(file.url);
      }
    }

    const productData = {
      ...values,
      imageUrls: imageUrls, // Store array of image URLs
    };

    await adminService.createProduct(productData);
  };

  return (
    <Upload
      listType="picture-card"
      fileList={fileList}
      onChange={({ fileList }) => setFileList(fileList)}
      beforeUpload={() => false} // Prevent auto upload
    >
      {fileList.length < 5 && <div><UploadOutlined /> Upload</div>}
    </Upload>
  );
};
```

#### **Product Display (View)**
```jsx
import { getImageUrl } from '../utils/helpers';

const ProductCard = ({ product }) => {
  return (
    <div className="product-card">
      <img 
        src={getImageUrl(product.image)} 
        alt={product.name}
        onError={(e) => {
          e.target.src = 'https://via.placeholder.com/300';
        }}
      />
      <h3>{product.name}</h3>
      <p>{formatPrice(product.price)}</p>
    </div>
  );
};
```

#### **Product Table (Admin)**
```jsx
const columns = [
  {
    title: 'Image',
    dataIndex: 'image',
    key: 'image',
    render: (src) => (
      <img 
        src={getImageUrl(src)} 
        alt="product" 
        style={{ width: 50, height: 50, objectFit: 'cover' }} 
      />
    )
  },
  // Other columns...
];
```

---

## 📊 Database Schema

```sql
-- Product table with image URL column
CREATE TABLE products (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    -- Other columns...
);

-- Product Images table (for multiple images)
CREATE TABLE product_images (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_id BIGINT NOT NULL,
    image_url VARCHAR(500) NOT NULL,  -- Store relative path: /uploads/uuid.jpg
    is_primary BOOLEAN DEFAULT FALSE,
    display_order INT DEFAULT 0,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);
```

---

## ✅ Testing Steps

### 1. **Create uploads directory**
```powershell
# In backend root directory
mkdir uploads
```

### 2. **Test backend endpoint**
```bash
curl -X POST http://localhost:8080/api/admin/upload-image \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@/path/to/image.jpg"
```

Expected response:
```json
{
  "success": true,
  "message": "Image uploaded successfully",
  "data": {
    "imageUrl": "/uploads/abc-123-def.jpg",
    "fileName": "image.jpg",
    "fileSize": 125478,
    "mimeType": "image/jpeg"
  }
}
```

### 3. **Test static resource access**
```bash
# Direct browser access
http://localhost:8080/uploads/abc-123-def.jpg
```

### 4. **Test from React**
Open browser console and check:
```javascript
console.log(getImageUrl('/uploads/abc-123-def.jpg'));
// Should output: http://localhost:8080/uploads/abc-123-def.jpg
```

---

## 🚨 Common Mistakes & Solutions

### ❌ **Mistake 1: Wrong Resource Location**
```java
// WRONG - Relative path
registry.addResourceHandler("/uploads/**")
    .addResourceLocations("file:uploads/");

// CORRECT - Absolute path
File uploadDirectory = new File(uploadDir);
String absolutePath = uploadDirectory.getAbsolutePath();
registry.addResourceHandler("/uploads/**")
    .addResourceLocations("file:" + absolutePath + "/");
```

### ❌ **Mistake 2: Missing CORS Configuration**
```java
// WRONG - No CORS, frontend can't access
@Override
public void addResourceHandlers(ResourceHandlerRegistry registry) {
    registry.addResourceHandler("/uploads/**")
            .addResourceLocations("file:uploads/");
}

// CORRECT - Add CORS mapping
@Override
public void addCorsMappings(CorsRegistry registry) {
    registry.addMapping("/**")
            .allowedOrigins("http://localhost:3000", "http://localhost:5173")
            .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
            .allowedHeaders("*")
            .allowCredentials(true);
}
```

### ❌ **Mistake 3: Storing Full URLs in Database**
```java
// WRONG - Store full URL (breaks in production)
product.setImageUrl("http://localhost:8080/uploads/image.jpg");

// CORRECT - Store relative path
product.setImageUrl("/uploads/image.jpg");
```

### ❌ **Mistake 4: Hardcoded Backend URL in Frontend**
```jsx
// WRONG - Hardcoded URL
<img src={`http://localhost:8080${product.image}`} />

// CORRECT - Use helper function
<img src={getImageUrl(product.image)} />
```

### ❌ **Mistake 5: No Error Handling for Missing Images**
```jsx
// WRONG - No fallback
<img src={getImageUrl(product.image)} alt={product.name} />

// CORRECT - Add error handler
<img 
  src={getImageUrl(product.image)} 
  alt={product.name}
  onError={(e) => {
    e.target.src = 'https://via.placeholder.com/300';
  }}
/>
```

---

## 🚀 Production Deployment

### **Option 1: Cloud Storage (Recommended)**
Use AWS S3, Google Cloud Storage, or Azure Blob Storage
- Better performance
- Automatic CDN
- Scalable
- No server storage limits

### **Option 2: Local Storage with Nginx**
```nginx
server {
    listen 80;
    server_name example.com;

    location /uploads/ {
        alias /var/www/app/uploads/;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    location / {
        proxy_pass http://localhost:8080;
    }
}
```

### **Environment Variables**
```properties
# Development
file.upload.dir=uploads

# Production
file.upload.dir=/var/www/app/uploads
```

---

## 📝 Best Practices

### ✅ **1. Security**
- Validate file types (whitelist approach)
- Limit file sizes
- Use UUID for filenames (prevent overwriting)
- Sanitize filenames
- Store files outside webroot if possible

### ✅ **2. Performance**
- Enable caching on static resources
- Use CDN for production
- Compress images before saving
- Generate thumbnails for listings

### ✅ **3. Maintainability**
- Store relative paths in database
- Use environment variables for configuration
- Centralize image handling logic
- Add proper logging

### ✅ **4. User Experience**
- Show upload progress
- Provide image preview before upload
- Display placeholder for missing images
- Lazy load images on scroll

---

## 🔍 Debugging Checklist

- [ ] uploads directory exists and has write permissions
- [ ] Backend is running on correct port (8080)
- [ ] CORS is properly configured
- [ ] Image file was actually uploaded (check uploads folder)
- [ ] Database has correct image path (/uploads/filename.jpg)
- [ ] Frontend is using getImageUrl() helper
- [ ] Browser console shows no CORS errors
- [ ] Direct URL access works: http://localhost:8080/uploads/filename.jpg
- [ ] Network tab shows 200 response for image requests

---

## 📞 Support

If images still don't display:
1. Check browser console for errors
2. Check backend logs for upload errors
3. Verify uploads directory permissions
4. Test direct URL access in browser
5. Verify CORS headers in network tab

---

**Current Implementation Status: ✅ Complete**

All components are already implemented in your project:
- ✅ Backend upload service
- ✅ Static resource configuration
- ✅ Frontend helper function
- ✅ React components updated

**Next Steps:**
1. Restart backend: `cd backend && ./start-backend.ps1`
2. Restart frontend: `cd frontend && npm run dev`
3. Test image upload in Admin → Products
