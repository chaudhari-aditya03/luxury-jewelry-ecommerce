# 🚀 Quick Deployment Reference

## URLs After Deployment

```
Frontend (Vercel):  https://jewelryeshop.vercel.app
Backend (Render):   https://your-backend.onrender.com
Admin Panel:        https://jewelryeshop.vercel.app/admin
API Docs:           https://your-backend.onrender.com/swagger-ui.html
```

## 🔑 Essential Environment Variables

### Backend (Render)
```bash
DATABASE_URL=jdbc:mysql://host:3306/jewelry_ecommerce
DATABASE_USERNAME=your_username
DATABASE_PASSWORD=your_password
JWT_SECRET=your_generated_secret
RAZORPAY_KEY_ID=rzp_xxx
RAZORPAY_KEY_SECRET=secret_xxx
CORS_ALLOWED_ORIGINS=https://jewelryeshop.vercel.app/
SERVER_PORT=8080
SPRING_PROFILES_ACTIVE=prod
```

### Frontend (Vercel)
```bash
VITE_API_URL=https://your-backend.onrender.com/api
VITE_RAZORPAY_KEY_ID=rzp_xxx
VITE_APP_NAME=Jewelry Store
VITE_ENABLE_REVIEWS=true
VITE_ENABLE_WISHLIST=true
VITE_ENABLE_COUPONS=true
```

## 📝 Deployment Order

1. ✅ **Database** (Railway/PlanetScale) - Get connection URL
2. ✅ **Backend** (Render) - Deploy with DB credentials, get backend URL
3. ✅ **Frontend** (Vercel) - Deploy with backend URL
4. ✅ **Update CORS** - Add Vercel URL to backend CORS settings

## 🛠️ Generate JWT Secret

```bash
# Mac/Linux
openssl rand -base64 64

# Windows PowerShell
[Convert]::ToBase64String((1..64 | ForEach-Object { Get-Random -Maximum 256 }))
```

## 🔍 Quick Troubleshooting

| Issue | Solution |
|-------|----------|
| CORS Error | Update CORS_ALLOWED_ORIGINS in Render, redeploy |
| 404 API | Check VITE_API_URL has `/api` suffix |
| Build Fails (Backend) | Java 17, check pom.xml |
| Build Fails (Frontend) | Node >= 18, check package.json |
| DB Connection | Verify DATABASE_URL format and credentials |

## 📦 Build Commands

### Backend (Render)
```bash
Build: mvn clean package -DskipTests
Start: java -Dspring.profiles.active=prod -jar target/jewelry-ecommerce-1.0.0.jar
```

### Frontend (Vercel)
```bash
Build: npm run build
Output: dist
```

## 🔗 Important Links

- [Full Deployment Guide](DEPLOYMENT_GUIDE.md)
- [Backend Guide](backend/RENDER_DEPLOYMENT.md)
- [Frontend Guide](frontend/VERCEL_DEPLOYMENT.md)

## 👤 Default Admin

```
Email: admin@jewelryshop.com
Password: admin123
```

**⚠️ Change password after first login!**
