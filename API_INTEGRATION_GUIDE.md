# 🎯 API Integration Guide

## Frontend ↔️ Backend Communication

This guide explains how the frontend and backend communicate, and how to work with the API integration.

---

## 🌐 Base Configuration

### Frontend API Client
**File:** `frontend/src/services/apiClient.js`

```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
```

### Environment Variable
**File:** `frontend/.env.local`

```env
VITE_API_URL=http://localhost:8080/api
```

---

## 🔐 Authentication Flow

### 1. Registration

**Frontend:**
```javascript
// src/context/AuthContext.jsx
const register = async (userData) => {
  const response = await authService.register(userData);
  const authData = response.data.data;
  
  localStorage.setItem('authToken', authData.token);
  localStorage.setItem('authUser', JSON.stringify(authData.user));
  setUser(authData.user);
};
```

**Backend:**
```
POST /api/auth/register
Body: {
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "password": "Password@123"
}

Response: {
  "success": true,
  "message": "User registered successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "type": "Bearer",
    "user": {
      "id": 1,
      "fullName": "John Doe",
      "email": "john@example.com",
      "role": "USER",
      ...
    }
  }
}
```

### 2. Login

**Frontend:**
```javascript
const login = async (email, password) => {
  const response = await authService.login(email, password);
  const authData = response.data.data;
  
  localStorage.setItem('authToken', authData.token);
  setUser(authData.user);
};
```

**Backend:**
```
POST /api/auth/login
Body: {
  "email": "john@example.com",
  "password": "Password@123"
}

Response: Same as registration
```

### 3. Token Management

**Request Interceptor:**
```javascript
// Automatically attaches token to all requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

**Response Interceptor:**
```javascript
// Handles 401 errors (token expired)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

---

## 📦 API Response Format

All backend responses follow this structure:

```javascript
{
  "success": boolean,      // true for success, false for error
  "message": string,       // Human-readable message
  "data": any,            // Response payload
  "timestamp": string     // ISO 8601 timestamp
}
```

**Success Example:**
```json
{
  "success": true,
  "message": "Product fetched successfully",
  "data": {
    "id": 1,
    "name": "Gold Ring",
    "price": 25000.00,
    ...
  },
  "timestamp": "2026-02-10T10:30:00"
}
```

**Error Example:**
```json
{
  "success": false,
  "message": "Product not found",
  "data": null,
  "timestamp": "2026-02-10T10:30:00"
}
```

---

## 🛍️ Common API Operations

### Products

#### Get All Products (with pagination)
```javascript
// Frontend
const { data } = await productService.getAllProducts(0, 12);
const products = data.data.content; // Spring Page object

// Backend
GET /api/products?page=0&size=12

Response: {
  "success": true,
  "data": {
    "content": [...products],
    "totalElements": 100,
    "totalPages": 9,
    "number": 0,
    "size": 12
  }
}
```

#### Get Product by ID
```javascript
// Frontend
const { data } = await productService.getProductById(1);
const product = data.data;

// Backend
GET /api/products/1

Response: {
  "success": true,
  "data": {
    "id": 1,
    "name": "Gold Necklace",
    "price": 45000.00,
    "category": {...},
    "images": [...],
    "variants": [...]
  }
}
```

#### Search Products
```javascript
// Frontend
const { data } = await productService.searchProducts('gold ring', 0, 12);

// Backend
GET /api/products/search?keyword=gold%20ring&page=0&size=12
```

### Cart Operations

#### Get Cart
```javascript
// Frontend
const { data } = await cartService.getCart();
const cart = data.data;

// Backend
GET /api/cart
Authorization: Bearer {token}

Response: {
  "success": true,
  "data": {
    "items": [
      {
        "id": 1,
        "product": {...},
        "quantity": 2,
        "price": 25000.00
      }
    ],
    "subtotal": 50000.00,
    "discount": 0,
    "total": 50000.00
  }
}
```

#### Add to Cart
```javascript
// Frontend
await cartService.addToCart(productId, 1);

// Backend
POST /api/cart/add
Authorization: Bearer {token}
Body: {
  "productId": 1,
  "quantity": 1,
  "variantId": null
}
```

#### Update Cart Item
```javascript
// Frontend
await cartService.updateCartItem(cartItemId, 3);

// Backend
PUT /api/cart/update
Body: {
  "cartItemId": 1,
  "quantity": 3
}
```

### Orders

#### Place Order
```javascript
// Frontend
const orderData = {
  addressId: 1,
  paymentMethod: 'UPI',
  notes: 'Please deliver before 5 PM'
};
const { data } = await orderService.placeOrder(orderData);

// Backend
POST /api/orders/place
Body: {
  "addressId": 1,
  "paymentMethod": "UPI",
  "notes": "Please deliver before 5 PM"
}

Response: {
  "success": true,
  "message": "Order placed successfully",
  "data": {
    "id": 123,
    "orderNumber": "ORD-2026-123",
    "status": "PENDING",
    "total": 50000.00,
    "items": [...],
    ...
  }
}
```

#### Get My Orders
```javascript
// Frontend
const { data } = await orderService.getMyOrders();
const orders = data.data;

// Backend
GET /api/orders/my
Authorization: Bearer {token}

Response: {
  "success": true,
  "data": [
    {
      "id": 123,
      "orderNumber": "ORD-2026-123",
      "status": "DELIVERED",
      "total": 50000.00,
      "createdAt": "2026-02-10T10:00:00"
    }
  ]
}
```

### Wishlist

#### Get Wishlist
```javascript
// Frontend
const { data } = await userService.getWishlist();
const wishlist = data.data;

// Backend
GET /api/wishlist
Authorization: Bearer {token}
```

#### Add to Wishlist
```javascript
// Frontend
await userService.addToWishlist(productId);

// Backend
POST /api/wishlist/add
Body: {
  "productId": 1
}
```

### Address Management

#### Get All Addresses
```javascript
// Frontend
const { data } = await userService.getAddresses();
const addresses = data.data;

// Backend
GET /api/addresses
Authorization: Bearer {token}
```

#### Add Address
```javascript
// Frontend
const addressData = {
  fullName: 'John Doe',
  phone: '9876543210',
  street: '123 Main St',
  city: 'Mumbai',
  state: 'Maharashtra',
  pincode: '400001',
  type: 'HOME'
};
await userService.addAddress(addressData);

// Backend
POST /api/addresses
Body: {
  "fullName": "John Doe",
  "phone": "9876543210",
  "street": "123 Main St",
  "city": "Mumbai",
  "state": "Maharashtra",
  "pincode": "400001",
  "type": "HOME"
}
```

---

## 🔧 Admin Operations

All admin endpoints require `ADMIN` role:

### Products Management
```javascript
// Create Product
await adminService.createProduct(productData);
POST /api/admin/products

// Update Product
await adminService.updateProduct(id, productData);
PUT /api/admin/products/{id}

// Delete Product
await adminService.deleteProduct(id);
DELETE /api/admin/products/{id}
```

### Order Management
```javascript
// Get All Orders
await adminService.getAllOrders(0, 10, 'PENDING');
GET /api/admin/orders?page=0&size=10&status=PENDING

// Update Order Status
await adminService.updateOrderStatus(orderId, 'DELIVERED');
PUT /api/admin/orders/{orderId}/status
Body: { "status": "DELIVERED" }
```

### User Management
```javascript
// Get All Users
await adminService.getAllUsers(0, 10);
GET /api/admin/users?page=0&size=10

// Block User
await adminService.blockUser(userId);
PUT /api/admin/users/{userId}/block

// Unblock User
await adminService.unblockUser(userId);
PUT /api/admin/users/{userId}/unblock
```

---

## 🐛 Debugging API Calls

### Frontend Console
```javascript
// Add debug logging in apiClient.js
apiClient.interceptors.request.use((config) => {
  console.log('🚀 API Request:', config.method.toUpperCase(), config.url);
  console.log('📦 Data:', config.data);
  return config;
});

apiClient.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', response.config.url, response.status);
    console.log('📦 Data:', response.data);
    return response;
  },
  (error) => {
    console.error('❌ API Error:', error.config.url);
    console.error('📛 Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);
```

### Backend Logs
Check Spring Boot console for:
```
2026-02-10 10:30:00 INFO  - HTTP GET /api/products
2026-02-10 10:30:00 DEBUG - Request params: {page=0, size=12}
2026-02-10 10:30:00 INFO  - Response: 200 OK
```

### Browser DevTools
1. Open DevTools (F12)
2. Go to **Network** tab
3. Filter by **XHR** or **Fetch**
4. Click on any request to see:
   - Request Headers (Authorization token)
   - Request Payload
   - Response Data
   - Status Code

---

## ⚠️ Common Errors & Solutions

### 401 Unauthorized
```
Error: Request failed with status code 401
```
**Solution:**
- Token expired or invalid
- Login again
- Check localStorage for 'authToken'

### 403 Forbidden
```
Error: Request failed with status code 403
```
**Solution:**
- User doesn't have required role (e.g., trying to access admin endpoint)
- Check user role in localStorage 'authUser'

### 404 Not Found
```
Error: Request failed with status code 404
```
**Solution:**
- API endpoint doesn't exist
- Check backend controller mappings
- Verify URL in service method

### CORS Error
```
Access to XMLHttpRequest at 'http://localhost:8080/api/...' from origin 'http://localhost:5173' has been blocked by CORS policy
```
**Solution:**
- Check backend CorsConfig.java
- Ensure frontend origin is allowed
- Restart backend server

### Network Error
```
Error: Network Error
```
**Solution:**
- Backend server not running
- Check if http://localhost:8080 is accessible
- Verify VITE_API_URL in .env.local

---

## 📊 API Testing Tools

### Swagger UI
- URL: http://localhost:8080/swagger-ui.html
- Interactive API documentation
- Test endpoints directly

### Postman/Thunder Client
Example collection structure:
```
- Auth
  - Register
  - Login
- Products
  - Get All Products
  - Get Product by ID
- Cart
  - Get Cart
  - Add to Cart
```

### curl Examples
```powershell
# Register
curl -X POST http://localhost:8080/api/auth/register `
  -H "Content-Type: application/json" `
  -d '{"firstName":"John","lastName":"Doe","email":"john@example.com","phone":"9876543210","password":"Password@123"}'

# Login
curl -X POST http://localhost:8080/api/auth/login `
  -H "Content-Type: application/json" `
  -d '{"email":"john@example.com","password":"Password@123"}'

# Get Products (with token)
curl http://localhost:8080/api/products `
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 🚀 Best Practices

1. **Always handle loading states**
   ```javascript
   const [loading, setLoading] = useState(false);
   
   const fetchData = async () => {
     setLoading(true);
     try {
       const { data } = await productService.getAllProducts();
       setProducts(data.data);
     } catch (error) {
       console.error(error);
     } finally {
       setLoading(false);
     }
   };
   ```

2. **Handle errors gracefully**
   ```javascript
   try {
     await cartService.addToCart(productId, 1);
     toast.success('Added to cart!');
   } catch (error) {
     toast.error(error.response?.data?.message || 'Failed to add to cart');
   }
   ```

3. **Use response data correctly**
   ```javascript
   // Backend returns: { success, message, data }
   const response = await productService.getAllProducts();
   const products = response.data.data; // Access nested data
   ```

4. **Check authentication before protected calls**
   ```javascript
   if (!isAuthenticated) {
     navigate('/login');
     return;
   }
   await cartService.addToCart(productId, 1);
   ```

---

**Happy integrating! 🎉**
