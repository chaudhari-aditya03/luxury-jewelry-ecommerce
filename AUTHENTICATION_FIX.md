# ✅ Authentication Fix & Testing Guide

## Issues Fixed

### 1. Database Name Mismatch
- **Problem**: Backend was looking for `jewelry_ecommerce` database
- **Solution**: Changed to `jewelry_shop` in `application.properties`
- **File**: `backend/src/main/resources/application.properties`

### 2. Registration API Field Mismatch
- **Problem**: Frontend sent `firstName` and `lastName`, backend expected `fullName`
- **Solution**: Updated Register.jsx to combine firstName and lastName
- **File**: `frontend/src/pages/Register.jsx`
- **Change**: `fullName: ${data.firstName} ${data.lastName}`

### 3. Missing Sample Data
- **Problem**: No users or products in database
- **Solution**: Created DataInitializer component
- **File**: `backend/src/main/java/com/jewelryshop/config/DataInitializer.java`

## How to Test

### Step 1: Restart Backend
```powershell
# Stop the current backend if running (Ctrl+C)
cd D:\clientsProjects\E-Commerce_Website\backend

# Start the backend
mvn spring-boot:run
```

**Expected Console Output:**
```
🔄 Starting data initialization...
✅ Admin user created: admin@gmail.com
✅ Regular user created: aditya@gmail.com
✅ Categories created: Rings, Necklaces, Earrings, Bracelets
✅ 5 products created successfully
✅ Data initialization completed successfully!
🚀 Jewelry E-Commerce Backend Started Successfully!
```

### Step 2: Start Frontend
```powershell
cd D:\clientsProjects\E-Commerce_Website\frontend
npm run dev
```

**Expected Output:**
```
VITE v7.3.1  ready in XXX ms
➜  Local:   http://localhost:5173/
```

### Step 3: Test Registration (New User)

1. Open browser: http://localhost:5173/register
2. Fill in the form:
   - First Name: `Test`
   - Last Name: `User`
   - Email: `test@example.com`
   - Phone: `9876543210`
   - Password: `password123`
   - Confirm Password: `password123`
3. Click "Create Account"
4. **Expected**: Redirect to `/account` page with user logged in

**If Registration Fails:**
- Check browser console (F12) for error messages
- Check backend console for detailed errors
- Verify MySQL is running: `Get-Service -Name MySQL*`

### Step 4: Test Login (Existing Users)

#### Test Admin Login
1. Open: http://localhost:5173/login
2. Email: `admin@gmail.com`
3. Password: `admin@2005`
4. Click "Sign In"
5. **Expected**: Redirect to `/account`, should have admin access

#### Test Regular User Login
1. Open: http://localhost:5173/login
2. Email: `aditya@gmail.com`
3. Password: `aditya@2005`
4. Click "Sign In"
5. **Expected**: Redirect to `/account`, normal user access

### Step 5: Verify Data

#### Check Products
1. Navigate to Shop page: http://localhost:5173/shop
2. **Expected**: See 5 products displayed:
   - Diamond Solitaire Ring (₹42,000)
   - Classic Pearl Necklace (₹25,000)
   - Diamond Stud Earrings (₹60,000)
   - Gold Chain Bracelet (₹35,000)
   - Emerald Gemstone Ring (₹68,000)

#### Check Categories Filter
1. On Shop page, use category dropdown
2. **Expected**: See 4 categories:
   - Rings
   - Necklaces
   - Earrings
   - Bracelets

#### Check Featured Products
1. Navigate to Home page: http://localhost:5173/
2. Scroll to "Featured Products" section
3. **Expected**: See 3 featured products:
   - Diamond Solitaire Ring
   - Classic Pearl Necklace
   - Emerald Gemstone Ring

### Step 6: Test Admin Access
1. Login as admin (admin@gmail.com / admin@2005)
2. Navigate to: http://localhost:5173/admin
3. **Expected**: Access to admin dashboard with:
   - Dashboard overview
   - Products management
   - Categories management
   - Orders management
   - Users management
   - Coupons management
   - Analytics

## API Testing (Optional)

### Using curl (PowerShell)

#### Test Login API
```powershell
$body = @{
    email = "admin@gmail.com"
    password = "admin@2005"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method Post -Body $body -ContentType "application/json"
$response
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiJ9...",
    "user": {
      "id": 1,
      "fullName": "Admin User",
      "email": "admin@gmail.com",
      "role": "ADMIN",
      "isActive": true
    }
  },
  "timestamp": "2026-02-10T..."
}
```

#### Test Register API
```powershell
$body = @{
    fullName = "New Test User"
    email = "newuser@test.com"
    password = "test123456"
    phone = "9876543210"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/register" -Method Post -Body $body -ContentType "application/json"
$response
```

#### Test Get Products API
```powershell
$response = Invoke-RestMethod -Uri "http://localhost:8080/api/products?page=0&size=10" -Method Get
$response.data
```

#### Test Get Categories API
```powershell
$response = Invoke-RestMethod -Uri "http://localhost:8080/api/categories" -Method Get
$response.data
```

## Troubleshooting Common Issues

### Issue: "Email is already registered"
**Cause**: User with that email already exists
**Solution**: Use different email or login with existing credentials

### Issue: "Bad credentials" or "Invalid email or password"
**Cause**: Wrong email or password
**Solution**: 
- Double-check credentials (case-sensitive)
- For seeded users, use exact credentials:
  - Admin: admin@gmail.com / admin@2005
  - User: aditya@gmail.com / aditya@2005

### Issue: "Cannot connect to database"
**Cause**: MySQL not running or wrong credentials
**Solution**:
1. Check MySQL status:
   ```powershell
   Get-Service -Name MySQL*
   ```
2. Start MySQL if stopped:
   ```powershell
   Start-Service -Name MySQL80  # Adjust version number
   ```
3. Verify credentials in `backend/src/main/resources/application.properties`:
   ```properties
   spring.datasource.username=root
   spring.datasource.password=aditya
   ```

### Issue: "CORS error" in browser console
**Cause**: Frontend URL not in CORS whitelist
**Solution**: Check `application.properties` has:
```properties
cors.allowed.origins=http://localhost:3000,http://localhost:5173
```

### Issue: Frontend shows "Network Error"
**Cause**: Backend not running or wrong API URL
**Solution**:
1. Verify backend is running on port 8080
2. Check `frontend/.env`:
   ```
   VITE_API_URL=http://localhost:8080/api
   ```
3. Restart frontend after .env changes

### Issue: Products not showing images
**Cause**: Image URLs are placeholders from Unsplash
**Solution**: This is normal. Images are from Unsplash CDN. If images don't load:
- Check internet connection
- Images will show placeholder icon if Unsplash is blocked

### Issue: "401 Unauthorized" when accessing protected routes
**Cause**: JWT token expired or invalid
**Solution**:
1. Logout and login again
2. Clear browser localStorage:
   ```javascript
   // In browser console (F12)
   localStorage.clear()
   location.reload()
   ```

### Issue: Maven command not found
**Cause**: Maven not installed or not in PATH
**Solution**:
1. Download Maven: https://maven.apache.org/download.cgi
2. Add to PATH or use IDE (IntelliJ/Eclipse) to run
3. Alternative: Right-click `JewelryEcommerceApplication.java` → Run

## Verification Checklist

- [ ] Backend starts without errors
- [ ] Console shows "Data initialization completed successfully"
- [ ] Frontend starts on port 5173
- [ ] Can register new user
- [ ] Can login with admin@gmail.com / admin@2005
- [ ] Can login with aditya@gmail.com / aditya@2005
- [ ] Shop page shows 5 products
- [ ] Home page shows 3 featured products
- [ ] Category filter works
- [ ] Admin can access /admin route
- [ ] Regular user cannot access /admin route (gets redirected)

## Database Verification (MySQL)

```sql
-- Connect to MySQL
mysql -u root -p

-- Use database
USE jewelry_shop;

-- Check users
SELECT id, full_name, email, role, is_active FROM users;

-- Check categories
SELECT id, name FROM categories;

-- Check products
SELECT id, name, price, discount_price, stock_quantity, is_featured FROM products;

-- Check product images
SELECT pi.id, p.name, pi.image_url, pi.is_primary 
FROM product_images pi 
JOIN products p ON pi.product_id = p.id;
```

**Expected Results:**
- 2 users (admin, aditya)
- 4 categories
- 5 products
- 5 product images (one per product)

## Next Steps After Successful Testing

1. ✅ Add more products via admin panel
2. ✅ Test cart functionality
3. ✅ Test checkout flow
4. ✅ Test order placement
5. ✅ Configure Razorpay for payments (if needed)
6. ✅ Test wishlist functionality
7. ✅ Test product reviews
8. ✅ Test user profile updates

## Important Files Modified

1. `backend/src/main/resources/application.properties` - Database name fixed
2. `backend/src/main/java/com/jewelryshop/config/DataInitializer.java` - New file (sample data)
3. `frontend/src/pages/Register.jsx` - Fixed fullName field mapping

## Support

If you encounter any issues not covered here:
1. Check backend console for error stack traces
2. Check browser console (F12) for frontend errors
3. Check MySQL error logs
4. Verify all services are running:
   - MySQL on port 3306
   - Backend on port 8080
   - Frontend on port 5173
