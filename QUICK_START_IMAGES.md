# Quick Start Guide - Image Upload Fix

## ✅ What's Already Configured

Your project now has a complete production-ready image upload system:

### Backend (✅ Complete)
- ✅ FileUploadService with validation
- ✅ WebConfig serving static resources from absolute path
- ✅ CORS properly configured
- ✅ Upload endpoint at `/api/admin/upload-image`
- ✅ Images saved to `uploads/` directory

### Frontend (✅ Complete)
- ✅ `getImageUrl()` helper function
- ✅ Updated all components (Products, Shop, Cart, ProductDetail)
- ✅ Proper error handling with placeholders

---

## 🚀 Quick Start

### 1. Start Backend
```powershell
cd backend
.\start-backend.ps1
```

### 2. Start Frontend
```powershell
cd frontend
npm run dev
```

### 3. Test Image Upload
1. Login as admin
2. Go to **Admin → Products**
3. Click **Add Product** or edit existing
4. Upload an image
5. Save product
6. Image should display correctly!

---

## 🧪 Verify Setup

### Check 1: Uploads Directory Exists
```powershell
# Should see 'uploads' folder in backend directory
ls backend\uploads
```

### Check 2: Backend Serves Static Files
1. Upload an image through admin panel
2. Note the filename from the response
3. Visit: `http://localhost:8080/uploads/[filename].jpg`
4. Should display the image directly

### Check 3: Frontend Displays Images
1. Go to Shop page
2. Images should load from backend
3. Check browser console - no CORS errors

---

## 🐛 Troubleshooting

### Images not displaying?

**1. Check Backend Logs**
```
Look for: "File uploaded successfully: [filename]"
```

**2. Check Browser Console**
```
Look for CORS errors or 404 errors
```

**3. Test Direct Access**
```
Open in browser: http://localhost:8080/uploads/[filename].jpg
```

**4. Verify Database**
```sql
SELECT id, name, image_url FROM product_images LIMIT 5;
-- Should show: /uploads/uuid.jpg
```

**5. Clear Cache**
```
Ctrl + Shift + R in browser
```

---

## 📁 File Paths Reference

### Stored in Database
```
/uploads/abc-123-def.jpg
```

### Served by Backend
```
http://localhost:8080/uploads/abc-123-def.jpg
```

### Displayed in Frontend
```jsx
getImageUrl('/uploads/abc-123-def.jpg')
// Returns: http://localhost:8080/uploads/abc-123-def.jpg
```

---

## 🔥 Common Issues & Solutions

### Issue 1: "File not found" (404)
**Cause:** uploads directory missing or wrong path
**Solution:**
```powershell
mkdir uploads
# Restart backend
```

### Issue 2: CORS Error
**Cause:** Frontend origin not allowed
**Solution:** Already fixed in WebConfig.java ✅

### Issue 3: Image shows alt text only
**Cause:** Wrong URL construction
**Solution:** Use `getImageUrl()` helper ✅

### Issue 4: Upload succeeds but image doesn't load
**Cause:** Static resource handler not configured correctly
**Solution:** Already fixed with absolute path ✅

---

## 📝 Current Configuration Summary

### Backend (application.properties)
```properties
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=50MB
file.upload.dir=uploads
```

### WebConfig.java
```java
✅ Absolute path resolution
✅ CORS for localhost:3000 and localhost:5173
✅ Static resource handler for /uploads/**
```

### Frontend (helpers.js)
```javascript
✅ getImageUrl() converts relative to absolute URLs
✅ Handles missing images with placeholders
✅ Supports http/https URLs
```

---

## 🎯 Next Steps

Your image system is **fully configured**. Just:

1. ✅ Uploads directory created
2. ✅ All code is in place
3. ✅ Start both servers
4. ✅ Test upload through admin panel

**The images should work perfectly now!** 🎉

---

## 💡 Tips

- Keep `uploads/` in .gitignore
- Use cloud storage (S3) for production
- Consider image compression
- Generate thumbnails for better performance
- Add alt text for accessibility

---

For detailed implementation, see: [IMAGE_UPLOAD_GUIDE.md](./IMAGE_UPLOAD_GUIDE.md)
