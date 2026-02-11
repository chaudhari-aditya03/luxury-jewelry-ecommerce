# ✅ Integration Setup Complete!

## 🎉 What's Been Configured

### Frontend Setup
✅ **Environment Configuration**
- Created `.env.local` with backend API URL: `http://localhost:8080/api`
- Configured Vite to proxy API requests

✅ **API Services Updated**
- All service methods now match backend endpoints exactly
- Updated pagination (0-indexed to match Spring)
- Fixed authentication flow to handle backend response format
- Updated cart, order, wishlist, and address endpoints
- Added proper error handling

✅ **Auth Context Updated**
- Fixed login/register to extract data from `response.data.data`
- Updated isAdmin check to support both 'ADMIN' and 'admin'
- Proper JWT token management

✅ **PowerShell Scripts Created**
- `frontend/start-frontend.ps1` - Start frontend server
- `backend/start-backend.ps1` - Start backend server
- `start-all.ps1` - Start both servers simultaneously

### Backend Verification
✅ **CORS Configuration**
- Already configured to allow `http://localhost:5173`
- Supports all required HTTP methods

✅ **JWT Authentication**
- Configured with 24-hour token expiration
- Proper security filters in place

✅ **Database Setup**
- MySQL configuration ready
- Auto-creates database on first run

---

## 🚀 How to Run

### Quick Start (Recommended)

From the root directory:
```powershell
.\start-all.ps1
```

This will:
1. Check all prerequisites (Java, Maven, Node.js, npm)
2. Start backend in a new window
3. Start frontend in a new window (after 15 seconds)
4. Display all access URLs

### Manual Start

**Terminal 1 - Backend:**
```powershell
cd backend
.\start-backend.ps1
```

**Terminal 2 - Frontend:**
```powershell
cd frontend
.\start-frontend.ps1
```

### First Time Setup

**Install Frontend Dependencies:**
```powershell
cd frontend
npm install
```

**Verify MySQL:**
```powershell
# Make sure MySQL is running
mysql -u root -p
```

---

## 🌐 Access Points

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://localhost:5173 | React application |
| **Backend API** | http://localhost:8080/api | REST API endpoints |
| **Swagger UI** | http://localhost:8080/swagger-ui.html | API documentation |

---

## 🔐 Test the Integration

### 1. Register a New User

**Frontend:**
1. Open http://localhost:5173/register
2. Fill in the form:
   - First Name: John
   - Last Name: Doe
   - Email: john@example.com
   - Phone: 9876543210
   - Password: Password@123
3. Click "Register"

**Backend will:**
- Create user in database
- Return JWT token
- Auto-login the user

### 2. Browse Products

**Frontend:**
1. Click "Shop" in navbar
2. Products will be fetched from backend API
3. Use search/filters

**Backend endpoint:**
```
GET /api/products?page=0&size=12
```

### 3. Add to Cart

**Frontend:**
1. Click "Add to Cart" on any product
2. Cart icon will update with count

**Backend endpoint:**
```
POST /api/cart/add
Authorization: Bearer {your-token}
Body: { "productId": 1, "quantity": 1 }
```

### 4. Place Order

**Frontend:**
1. Go to Cart
2. Click "Proceed to Checkout"
3. Fill in address
4. Select payment method
5. Click "Place Order"

**Backend endpoint:**
```
POST /api/orders/place
Authorization: Bearer {your-token}
Body: { "addressId": 1, "paymentMethod": "UPI" }
```

---

## 📊 API Endpoint Mapping

### Authentication
| Frontend Service | Backend Endpoint | Method |
|-----------------|------------------|--------|
| `authService.register()` | `/api/auth/register` | POST |
| `authService.login()` | `/api/auth/login` | POST |
| `authService.getCurrentUser()` | `/api/auth/me` | GET |

### Products
| Frontend Service | Backend Endpoint | Method |
|-----------------|------------------|--------|
| `productService.getAllProducts()` | `/api/products` | GET |
| `productService.getProductById(id)` | `/api/products/{id}` | GET |
| `productService.searchProducts(q)` | `/api/products/search?keyword={q}` | GET |
| `productService.getCategories()` | `/api/categories` | GET |
| `productService.getProductByCategory(id)` | `/api/products/category/{id}` | GET |
| `productService.getFeaturedProducts()` | `/api/products/featured` | GET |

### Cart
| Frontend Service | Backend Endpoint | Method |
|-----------------|------------------|--------|
| `cartService.getCart()` | `/api/cart` | GET |
| `cartService.addToCart()` | `/api/cart/add` | POST |
| `cartService.updateCartItem()` | `/api/cart/update` | PUT |
| `cartService.removeFromCart(id)` | `/api/cart/remove/{id}` | DELETE |
| `cartService.clearCart()` | `/api/cart/clear` | DELETE |
| `cartService.applyCoupon()` | `/api/cart/coupon/apply` | POST |

### Orders
| Frontend Service | Backend Endpoint | Method |
|-----------------|------------------|--------|
| `orderService.placeOrder()` | `/api/orders/place` | POST |
| `orderService.getMyOrders()` | `/api/orders/my` | GET |
| `orderService.getOrderById(id)` | `/api/orders/{id}` | GET |
| `orderService.cancelOrder(id)` | `/api/orders/cancel/{id}` | PUT |

### User & Addresses
| Frontend Service | Backend Endpoint | Method |
|-----------------|------------------|--------|
| `userService.getProfile()` | `/api/users/profile` | GET |
| `userService.updateProfile()` | `/api/users/profile` | PUT |
| `userService.getAddresses()` | `/api/addresses` | GET |
| `userService.addAddress()` | `/api/addresses` | POST |
| `userService.updateAddress(id)` | `/api/addresses/{id}` | PUT |
| `userService.deleteAddress(id)` | `/api/addresses/{id}` | DELETE |

### Wishlist
| Frontend Service | Backend Endpoint | Method |
|-----------------|------------------|--------|
| `userService.getWishlist()` | `/api/wishlist` | GET |
| `userService.addToWishlist()` | `/api/wishlist/add` | POST |
| `userService.removeFromWishlist(id)` | `/api/wishlist/remove/{id}` | DELETE |

### Admin
| Frontend Service | Backend Endpoint | Method |
|-----------------|------------------|--------|
| `adminService.createProduct()` | `/api/admin/products` | POST |
| `adminService.updateProduct(id)` | `/api/admin/products/{id}` | PUT |
| `adminService.deleteProduct(id)` | `/api/admin/products/{id}` | DELETE |
| `adminService.getAllOrders()` | `/api/admin/orders` | GET |
| `adminService.updateOrderStatus()` | `/api/admin/orders/{id}/status` | PUT |
| `adminService.getAllUsers()` | `/api/admin/users` | GET |
| `adminService.blockUser(id)` | `/api/admin/users/{id}/block` | PUT |
| `adminService.unblockUser(id)` | `/api/admin/users/{id}/unblock` | PUT |
| `adminService.createCategory()` | `/api/admin/categories` | POST |
| `adminService.updateCategory(id)` | `/api/admin/categories/{id}` | PUT |
| `adminService.deleteCategory(id)` | `/api/admin/categories/{id}` | DELETE |
| `adminService.getAllCoupons()` | `/api/admin/coupons` | GET |
| `adminService.createCoupon()` | `/api/admin/coupons` | POST |
| `adminService.updateCoupon(id)` | `/api/admin/coupons/{id}` | PUT |
| `adminService.deleteCoupon(id)` | `/api/admin/coupons/{id}` | DELETE |

---

## 🔍 Troubleshooting

### Frontend Console Errors

**Error: "Network Error"**
```
Solution: Backend is not running. Start backend server.
```

**Error: "401 Unauthorized"**
```
Solution: Token expired or invalid. Login again.
```

**Error: "CORS policy"**
```
Solution: Check backend CorsConfig allows http://localhost:5173
```

### Backend Console Errors

**Error: "Communications link failure"**
```
Solution: MySQL is not running. Start MySQL service.
```

**Error: "Access denied for user 'root'"**
```
Solution: Update database password in application.properties
```

**Error: "Port 8080 already in use"**
```
Solution: Kill process or change port in application.properties
```

### Browser DevTools

**Check Network Tab:**
1. Open DevTools (F12)
2. Go to Network tab
3. Filter by "XHR"
4. Check request/response for each API call

**Check Console:**
- Look for JavaScript errors
- Check if API calls are being made
- Verify response data structure

**Check Application Tab:**
- localStorage → authToken (should be present if logged in)
- localStorage → authUser (should contain user data)

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| `SETUP_AND_RUN.md` | Complete setup guide with detailed instructions |
| `API_INTEGRATION_GUIDE.md` | API integration patterns and examples |
| `frontend/FRONTEND.md` | Frontend architecture and features |
| `frontend/DEMO_CREDENTIALS.md` | Test accounts and demo data |
| `frontend/QUICKSTART.md` | 5-minute quick start guide |
| `frontend/COMPONENTS_INVENTORY.md` | All UI components documentation |
| `backend/DEPLOYMENT_GUIDE.md` | Backend deployment instructions |

---

## ✅ Verification Checklist

Before starting development, verify:

**Backend:**
- [ ] MySQL is installed and running
- [ ] Java 17+ is installed
- [ ] Maven is installed
- [ ] Database credentials are correct in application.properties
- [ ] Backend starts without errors (`mvn spring-boot:run`)
- [ ] Swagger UI is accessible at http://localhost:8080/swagger-ui.html
- [ ] Can access http://localhost:8080/api/categories

**Frontend:**
- [ ] Node.js 18+ is installed
- [ ] npm is installed
- [ ] Dependencies are installed (`npm install`)
- [ ] `.env.local` exists with correct API URL
- [ ] Frontend starts without errors (`npm run dev`)
- [ ] Can access http://localhost:5173
- [ ] Can see homepage with navbar and footer

**Integration:**
- [ ] Frontend can register a new user
- [ ] Registration stores JWT token in localStorage
- [ ] Frontend can login with credentials
- [ ] Can browse products (fetched from backend)
- [ ] Can add product to cart
- [ ] Cart API calls succeed
- [ ] Can place an order
- [ ] Admin panel accessible (after creating admin user)

---

## 🎯 Next Steps

1. **Start Both Servers:**
   ```powershell
   .\start-all.ps1
   ```

2. **Create Admin User:**
   - Register a user via frontend
   - Update role in database:
   ```sql
   UPDATE users SET role = 'ADMIN' WHERE email = 'your@email.com';
   ```

3. **Add Sample Data:**
   - Use admin panel to add categories
   - Add products with images
   - Create coupons

4. **Test Features:**
   - Product browsing and search
   - Cart operations
   - Order placement
   - Admin dashboard
   - User profile management

5. **Customize:**
   - Update branding colors in `tailwind.config.js`
   - Modify product data
   - Add custom features

---

## 🎉 You're All Set!

Both frontend and backend are properly configured and ready to work together!

**Start Command:**
```powershell
.\start-all.ps1
```

**Access URLs:**
- Frontend: http://localhost:5173
- Backend: http://localhost:8080/api
- Swagger: http://localhost:8080/swagger-ui.html

Happy coding! 🚀
