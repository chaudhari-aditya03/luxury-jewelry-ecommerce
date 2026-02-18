# 🏗️ Deployment Architecture

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                          USERS                                   │
│                     (Web Browsers)                              │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ HTTPS
                         │
         ┌───────────────┴───────────────┐
         │                               │
         │                               │
         ▼                               ▼
┌─────────────────┐             ┌─────────────────┐
│   VERCEL CDN    │             │  ADMIN USERS    │
│   (Frontend)    │             │  /admin route   │
└────────┬────────┘             └────────┬────────┘
         │                               │
         │ React SPA                     │
         │ Vite Build                    │
         │                               │
         └───────────────┬───────────────┘
                         │
                         │ API Calls (HTTPS)
                         │ CORS Headers Required
                         │
                         ▼
              ┌──────────────────────┐
              │   RENDER.COM         │
              │   (Backend API)      │
              │                      │
              │  Spring Boot App     │
              │  Port: 8080          │
              │  Health: /api/health │
              └──────────┬───────────┘
                         │
                         │ JDBC Connection
                         │ SSL Enabled
                         │
         ┌───────────────┼───────────────┐
         │               │               │
         ▼               ▼               ▼
┌────────────┐  ┌────────────┐  ┌────────────┐
│  RAILWAY   │  │ RAZORPAY   │  │   LOCAL    │
│  DATABASE  │  │  PAYMENT   │  │  UPLOADS/  │
│  (MySQL)   │  │  GATEWAY   │  │   CLOUD    │
└────────────┘  └────────────┘  └────────────┘
```

---

## Component Details

### 1. Frontend (Vercel)
**URL**: `https://your-app.vercel.app`

- **Framework**: React 18 + Vite
- **Hosting**: Vercel Edge Network (CDN)
- **Auto-Deploy**: On git push to main
- **Environment**: Node.js build environment
- **Output**: Static files (HTML, CSS, JS)
- **Routing**: SPA with client-side routing

**Features**:
- ⚡ Edge caching
- 📱 Mobile responsive
- 🔒 HTTPS by default
- 🌍 Global CDN
- 🔄 Instant rollbacks
- 🌿 Preview deployments

---

### 2. Backend (Render)
**URL**: `https://your-backend.onrender.com`

- **Framework**: Spring Boot 3.2.2
- **Runtime**: Java 17
- **Hosting**: Render Web Service
- **Auto-Deploy**: On git push to main
- **Build**: Maven
- **HTTP Server**: Embedded Tomcat

**Endpoints**:
- `/api/health` - Health check
- `/api/auth/*` - Authentication
- `/api/products/*` - Product management
- `/api/orders/*` - Order management
- `/api/admin/*` - Admin operations

**Features**:
- 🔒 HTTPS by default
- 🔄 Auto-redeploy
- 📊 Built-in metrics
- 📝 Log streaming
- ⚡ Health monitoring

---

### 3. Database (Railway/PlanetScale)
**Type**: MySQL 8.0+

- **Hosting**: Railway or PlanetScale
- **Connection**: SSL/TLS encrypted
- **Backup**: Automatic (platform-dependent)
- **Scaling**: Vertical scaling available

**Tables**:
- `users`, `roles`, `user_roles`
- `products`, `categories`
- `orders`, `order_items`
- `cart`, `cart_items`
- `reviews`, `wishlist`
- `addresses`, `coupons`, `payments`

---

### 4. Payment Gateway (Razorpay)
**Integration**: Server-side + Client-side

- **Test Mode**: For development
- **Live Mode**: For production
- **Security**: PCI DSS compliant
- **Features**: Card, UPI, Netbanking, Wallets

---

## 🔄 Request Flow

### User Browsing Products

```
1. User → https://your-app.vercel.app
   ↓
2. Vercel CDN → Serves React SPA (cached)
   ↓
3. React App → Loads in browser
   ↓
4. App requests products → GET https://backend.onrender.com/api/products
   ↓
5. CORS Check → Vercel origin allowed?
   ↓
6. Backend → Queries MySQL database
   ↓
7. Database → Returns product data
   ↓
8. Backend → JSON response to frontend
   ↓
9. React → Renders products to user
```

### User Making Purchase

```
1. User adds to cart → State stored in React
   ↓
2. User clicks checkout → POST /api/orders
   ↓
3. Backend validates → Checks user, products, stock
   ↓
4. Creates order → Stores in database
   ↓
5. Initiates payment → Razorpay API call
   ↓
6. Frontend → Opens Razorpay modal
   ↓
7. User pays → Razorpay processes
   ↓
8. Webhook/Callback → Updates order status
   ↓
9. Order confirmed → Email sent (if configured)
```

### Admin Managing Products

```
1. Admin → https://your-app.vercel.app/admin
   ↓
2. React checks auth → JWT token valid?
   ↓
3. Protected route → Renders admin panel
   ↓
4. Admin uploads image → POST /api/admin/products
   ↓
5. Backend validates → Admin role check
   ↓
6. Saves image → Local uploads/ or cloud storage
   ↓
7. Creates product → Inserts into database
   ↓
8. Returns success → Frontend updates UI
```

---

## 🌐 Network & Security

### HTTPS Encryption
```
User ←→ [TLS 1.3] ←→ Vercel CDN
User ←→ [TLS 1.3] ←→ Render API
Backend ←→ [SSL] ←→ Database
```

### CORS Configuration
```
Origin: https://your-app.vercel.app
       ↓
Backend: CORS_ALLOWED_ORIGINS check
       ↓
Allowed? → Set CORS headers
       ↓
Response: Access-Control-Allow-Origin: https://your-app.vercel.app
```

### Authentication Flow
```
1. User login → POST /api/auth/login
   ↓
2. Backend validates → Checks DB
   ↓
3. Generates JWT → Signs with JWT_SECRET
   ↓
4. Returns token → {token: "eyJ..."}
   ↓
5. Frontend stores → localStorage
   ↓
6. Subsequent requests → Authorization: Bearer eyJ...
   ↓
7. Backend validates → Verifies signature
   ↓
8. Allows/Denies → Based on token validity
```

---

## 📊 Data Flow

### Product Image Upload
```
Admin (Browser)
    ↓ [FormData with image file]
Frontend (React)
    ↓ [POST /api/admin/products with multipart/form-data]
Backend (Spring Boot)
    ↓ [MultipartFile processing]
File System (uploads/ directory)
    ↓ [Image saved, path stored]
Database (MySQL)
    ↓ [Product record with image path]
```

### Product Display
```
Database (MySQL)
    ↓ [Product data + image paths]
Backend API
    ↓ [JSON with full URLs]
Frontend
    ↓ [Image URLs: http://backend/uploads/image.jpg]
Browser
    ↓ [Renders images]
```

---

## 🔧 Environment Configuration

### Development
```
Frontend (localhost:5173)
    ↓ API calls
Backend (localhost:8080)
    ↓ Queries
Database (localhost:3306 or Railway)
```

### Production
```
Frontend (Vercel CDN)
    ↓ API calls (HTTPS)
Backend (Render)
    ↓ Queries (SSL)
Database (Railway/PlanetScale)
```

---

## 📈 Scaling Strategy

### Horizontal Scaling
- **Frontend**: Automatic (Vercel CDN global distribution)
- **Backend**: Can add more Render instances (paid plans)
- **Database**: Read replicas (platform-dependent)

### Vertical Scaling
- **Backend**: Upgrade Render instance type
- **Database**: Increase RAM/CPU on Railway/PlanetScale

### Caching Strategy
```
Browser Cache → Images, CSS, JS (Vercel caching)
     ↓
CDN Cache → Static assets (Vercel Edge)
     ↓
Application Cache → Can add Redis (optional)
     ↓
Database → Query optimization
```

---

## 🔐 Security Layers

```
┌─────────────────────────────────────┐
│  1. Frontend Security               │
│  - HTTPS only                       │
│  - Security headers (CSP, etc.)     │
│  - Input sanitization               │
│  - XSS protection                   │
└───────────────┬─────────────────────┘
                │
┌───────────────▼─────────────────────┐
│  2. API Security                    │
│  - CORS validation                  │
│  - JWT authentication               │
│  - Rate limiting (optional)         │
│  - Input validation                 │
└───────────────┬─────────────────────┘
                │
┌───────────────▼─────────────────────┐
│  3. Database Security               │
│  - SSL connections                  │
│  - Parameterized queries (JPA)      │
│  - Strong passwords                 │
│  - Regular backups                  │
└─────────────────────────────────────┘
```

---

## 🚀 Deployment Pipeline

```
Developer (You)
    ↓ [git push]
GitHub Repository
    ├─→ [Webhook] → Vercel
    │       ↓
    │   [Build Frontend]
    │       ↓
    │   [Deploy to CDN]
    │       ↓
    │   [Live on vercel.app]
    │
    └─→ [Webhook] → Render
            ↓
        [Build Backend]
            ↓
        [mvn package]
            ↓
        [Deploy to Render]
            ↓
        [Live on render.com]
```

---

## 📊 Monitoring Points

1. **Frontend (Vercel)**
   - Build status
   - Deployment logs
   - Analytics (optional)
   - Web vitals

2. **Backend (Render)**
   - Health check: `/api/health`
   - Build logs
   - Runtime logs
   - Metrics (CPU, Memory)

3. **Database**
   - Connection pool
   - Query performance
   - Storage usage
   - Backup status

4. **External Services**
   - Razorpay transactions
   - Email delivery (if configured)
   - File storage usage

---

## 💰 Cost Breakdown

### Free Tier (Development/Small Scale)
```
Vercel:    $0/month (100GB bandwidth)
Render:    $0/month (with sleep)
Railway:   $0/month ($5 credit)
──────────────────────────────────
Total:     $0/month
```

### Production (Small to Medium Scale)
```
Vercel Pro:        $20/month (better limits)
Render Starter:    $7/month (no sleep)
Railway:           $5-10/month (usage-based)
──────────────────────────────────
Total:             $32-37/month
```

### Production (High Traffic)
```
Vercel Pro:        $20/month
Render Standard:   $25/month (2GB RAM)
Railway:           $20-30/month (more resources)
Cloudflare CDN:    Optional ($20/month)
──────────────────────────────────
Total:             $65-95/month
```

---

## 🎯 Performance Optimization

### Frontend
- ✅ Code splitting (Vite)
- ✅ Lazy loading
- ✅ Image optimization (WebP)
- ✅ CDN caching
- ✅ Compression (Brotli/Gzip)

### Backend
- ✅ Connection pooling (HikariCP)
- ✅ Query optimization (JPA)
- ✅ Response compression
- ⭕ Redis caching (optional)
- ⭕ Load balancing (when needed)

### Database
- ✅ Indexed columns
- ✅ Optimized queries
- ⭕ Read replicas (when needed)
- ⭕ Query caching (when needed)

---

This architecture provides a solid foundation for your e-commerce platform with room to scale as your business grows! 🚀
