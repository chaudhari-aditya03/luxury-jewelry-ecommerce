# 🔧 Backend Setup & Data Initialization Guide

## Changes Made

### 1. Fixed Database Name in application.properties
- Changed database name from `jewelry_ecommerce` to `jewelry_shop`
- This matches the database you have created

### 2. Created DataInitializer Component
- Location: `backend/src/main/java/com/jewelryshop/config/DataInitializer.java`
- Automatically runs on application startup
- Creates sample data if not exists

## Sample Data Created

### Users (2 accounts)

#### Admin Account
- **Email**: admin@gmail.com
- **Password**: admin@2005
- **Role**: ADMIN
- **Full Name**: Admin User
- **Phone**: 9876543210

#### Regular User Account
- **Email**: aditya@gmail.com
- **Password**: aditya@2005
- **Role**: USER
- **Full Name**: Aditya Kumar
- **Phone**: 9123456780

### Categories (4 categories)
1. Rings
2. Necklaces
3. Earrings
4. Bracelets

### Products (5 jewelry items)

1. **Diamond Solitaire Ring**
   - SKU: RING-DS-001
   - Price: ₹45,000 (Discount: ₹42,000)
   - Stock: 15 units
   - Category: Rings
   - Featured: Yes

2. **Classic Pearl Necklace**
   - SKU: NECK-CPL-002
   - Price: ₹28,000 (Discount: ₹25,000)
   - Stock: 20 units
   - Category: Necklaces
   - Featured: Yes

3. **Diamond Stud Earrings**
   - SKU: EAR-DS-003
   - Price: ₹65,000 (Discount: ₹60,000)
   - Stock: 12 units
   - Category: Earrings
   - Featured: No

4. **Gold Chain Bracelet**
   - SKU: BRAC-GC-004
   - Price: ₹38,000 (Discount: ₹35,000)
   - Stock: 18 units
   - Category: Bracelets
   - Featured: No

5. **Emerald Gemstone Ring**
   - SKU: RING-EM-005
   - Price: ₹72,000 (Discount: ₹68,000)
   - Stock: 8 units
   - Category: Rings
   - Featured: Yes

## How to Start the Backend

### Option 1: Using PowerShell Script
```powershell
cd d:\clientsProjects\E-Commerce_Website\backend
.\start-backend.ps1
```

### Option 2: Using Maven Directly
```powershell
cd d:\clientsProjects\E-Commerce_Website\backend
mvn spring-boot:run
```

### Option 3: Using IDE (IntelliJ IDEA or Eclipse)
1. Open the backend folder in your IDE
2. Right-click on `JewelryEcommerceApplication.java`
3. Select "Run" or "Debug"

## What Happens on Startup

1. ✅ Spring Boot application starts
2. ✅ Connects to MySQL database `jewelry_shop`
3. ✅ Creates tables automatically (if not exist)
4. ✅ DataInitializer checks for existing data
5. ✅ If no data exists, creates:
   - 2 users (admin + regular user)
   - 4 categories
   - 5 products with images

## Verify the Setup

### Check Console Logs
You should see these messages:
```
🔄 Starting data initialization...
✅ Admin user created: admin@gmail.com
✅ Regular user created: aditya@gmail.com
✅ Categories created: Rings, Necklaces, Earrings, Bracelets
✅ 5 products created successfully
✅ Data initialization completed successfully!
🚀 Jewelry E-Commerce Backend Started Successfully!
```

### Test the APIs

#### 1. Test Admin Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"admin@gmail.com\",\"password\":\"admin@2005\"}"
```

#### 2. Test User Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"aditya@gmail.com\",\"password\":\"aditya@2005\"}"
```

#### 3. Test Get Products
```bash
curl http://localhost:8080/api/products
```

#### 4. Test Get Categories
```bash
curl http://localhost:8080/api/categories
```

## Troubleshooting

### Issue: "Email is already registered"
**Solution**: The users already exist. Use the login endpoint instead.

### Issue: "Products already exist"
**Solution**: Data has already been initialized. No need to restart.

### Issue: "Access to database denied"
**Solution**: Check MySQL credentials in `application.properties`:
```properties
spring.datasource.username=root
spring.datasource.password=aditya
```

### Issue: "Database 'jewelry_shop' doesn't exist"
**Solution**: The database will be created automatically. Ensure MySQL is running:
```powershell
# Check if MySQL is running
Get-Service -Name MySQL*
```

### Issue: Maven not found
**Solution**: 
1. Install Maven from: https://maven.apache.org/download.cgi
2. Add Maven bin folder to PATH
3. Restart PowerShell

## Frontend Configuration

The frontend is already configured to connect to the backend:
- **API Base URL**: http://localhost:8080/api
- **Configuration File**: `frontend/.env`

## Next Steps

1. ✅ Restart the backend (to initialize data)
2. ✅ Start the frontend: `cd frontend && npm run dev`
3. ✅ Open browser: http://localhost:5173
4. ✅ Test login with:
   - Admin: admin@gmail.com / admin@2005
   - User: aditya@gmail.com / aditya@2005
5. ✅ Browse products in the shop page
6. ✅ Admin can access admin panel at: http://localhost:5173/admin

## Important Notes

- ⚠️ Passwords are encrypted using BCrypt
- ⚠️ JWT tokens expire after 24 hours (86400000 ms)
- ⚠️ CORS is configured for localhost:5173 and localhost:3000
- ⚠️ All timestamps use UTC timezone
- ⚠️ Product images use Unsplash placeholder URLs
