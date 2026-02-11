# E-Commerce Platform Setup & Running Guide

## 📋 Prerequisites

### Backend Requirements
- ✅ Java 17 or higher
- ✅ Maven 3.6+
- ✅ MySQL 8.0+
- ✅ IDE (IntelliJ IDEA / Eclipse / VS Code with Java extensions)

### Frontend Requirements
- ✅ Node.js 18+ and npm 9+
- ✅ Modern web browser

---

## 🚀 Quick Start

### Step 1: Database Setup

1. **Install MySQL** (if not already installed)
2. **Create Database** (Auto-creates on first run, or manually):
```sql
CREATE DATABASE jewelry_shop;
```

3. **Update Database Credentials** (if needed):
   - Edit `backend/src/main/resources/application.properties`
   ```properties
   spring.datasource.username=root
   spring.datasource.password=your_password
   ```

### Step 2: Backend Setup

```powershell
# Navigate to backend directory
cd backend

# Clean and install dependencies
mvn clean install

# Run the backend
mvn spring-boot:run
```

**Backend will start at:** `http://localhost:8080`

**Swagger UI:** `http://localhost:8080/swagger-ui.html`

### Step 3: Frontend Setup

```powershell
# Open a new terminal and navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

**Frontend will start at:** `http://localhost:5173`

---

## 📦 Detailed Setup

### Backend Configuration

#### 1. Application Properties
File: `backend/src/main/resources/application.properties`

```properties
# Server Port
server.port=8080

# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/jewelry_shop?createDatabaseIfNotExist=true
spring.datasource.username=root
spring.datasource.password=your_password

# JWT Secret (Change in production)
jwt.secret=5367566B59703373367639792F423F4528482B4D6251655468576D5A71347437
jwt.expiration=86400000

# Razorpay (Optional - for payments)
razorpay.key.id=your_key_id
razorpay.key.secret=your_key_secret
```

#### 2. Run Modes

**Development Mode:**
```powershell
mvn spring-boot:run
```

**Production Build:**
```powershell
mvn clean package
java -jar target/jewelry-ecommerce-1.0.0.jar
```

#### 3. Verify Backend
- Check console: "🚀 Jewelry E-Commerce Backend Started Successfully!"
- Test API: `http://localhost:8080/api/categories`
- Swagger Docs: `http://localhost:8080/swagger-ui.html`

### Frontend Configuration

#### 1. Environment Variables
File: `frontend/.env.local` (Already created)

```env
VITE_API_URL=http://localhost:8080/api
NODE_ENV=development
```

#### 2. Install Dependencies
```powershell
npm install
```

Dependencies installed:
- React 19.2.0
- React Router v6
- Tailwind CSS 4
- Axios
- React Hook Form
- Recharts
- And more...

#### 3. Run Development Server
```powershell
npm run dev
```

#### 4. Build for Production
```powershell
npm run build
npm run preview  # Preview production build
```

---

## 🧪 Testing the Integration

### 1. Test Backend API Directly

```powershell
# Get all categories
curl http://localhost:8080/api/categories

# Register a new user
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "password": "Password@123"
  }'
```

### 2. Test Frontend Features

1. **Open Browser:** Navigate to `http://localhost:5173`
2. **Register Account:** Click "Register" and create an account
3. **Login:** Use the credentials you just created
4. **Browse Products:** Navigate to Shop page
5. **Add to Cart:** Add products to cart
6. **Checkout:** Complete the checkout process

### 3. Test Admin Panel

**Default Admin Credentials** (Create manually in DB):
```sql
-- After first user registration, update their role to ADMIN
UPDATE users SET role = 'ADMIN' WHERE email = 'your@email.com';
```

Or use test credentials if seeded:
- Email: `admin@example.com`
- Password: `Admin@123456`

---

## 📁 Project Structure

```
E-Commerce_Website/
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/jewelryshop/
│   │   │   │   ├── controller/     # REST API Controllers
│   │   │   │   ├── service/        # Business Logic
│   │   │   │   ├── repository/     # Database Access
│   │   │   │   ├── entity/         # JPA Entities
│   │   │   │   ├── dto/            # Data Transfer Objects
│   │   │   │   ├── security/       # JWT & Security
│   │   │   │   ├── config/         # Spring Configuration
│   │   │   │   └── exception/      # Exception Handling
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   └── test/
│   ├── pom.xml
│   └── README.md
│
└── frontend/
    ├── src/
    │   ├── components/      # Reusable UI Components
    │   ├── pages/          # Page Components
    │   ├── admin/          # Admin Panel
    │   ├── layouts/        # Layout Components
    │   ├── context/        # React Context (Auth, Theme)
    │   ├── services/       # API Service Layer
    │   ├── hooks/          # Custom React Hooks
    │   ├── utils/          # Utility Functions
    │   ├── assets/         # Images, Icons
    │   ├── App.jsx         # Main App Component
    │   └── main.jsx        # Entry Point
    ├── public/
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    └── README.md
```

---

## 🔧 Common Issues & Solutions

### Backend Issues

| Issue | Solution |
|-------|----------|
| **Maven dependencies not downloading** | Run `mvn clean install -U` to force update |
| **Database connection failed** | Verify MySQL is running: `mysql -u root -p` |
| **Port 8080 already in use** | Change port in `application.properties` or kill process: `netstat -ano | findstr :8080` |
| **JWT authentication fails** | Clear browser localStorage and login again |
| **Entity not found errors** | Run `mvn clean install` to refresh JPA mappings |

### Frontend Issues

| Issue | Solution |
|-------|----------|
| **npm install fails** | Delete `node_modules` and `package-lock.json`, run `npm install` again |
| **Port 5173 already in use** | Change port in `vite.config.js` or kill process |
| **API calls fail (CORS)** | Backend CorsConfig should allow `http://localhost:5173` |
| **Components not updating** | Hard refresh browser (Ctrl+Shift+R) or clear cache |
| **Tailwind styles not applying** | Restart dev server: `npm run dev` |

### Integration Issues

| Issue | Solution |
|-------|----------|
| **CORS errors** | Verify backend `CorsConfig.java` allows frontend origin |
| **401 Unauthorized** | Check JWT token in browser localStorage (DevTools > Application) |
| **API not found (404)** | Verify backend is running on port 8080 and API endpoints match |
| **Image upload fails** | Check backend file upload configuration |

---

## 🎯 Available API Endpoints

### Public Endpoints
```
GET    /api/categories              # Get all categories
GET    /api/products                # Get all products (paginated)
GET    /api/products/{id}           # Get product details
GET    /api/products/search         # Search products
POST   /api/auth/register           # Register new user
POST   /api/auth/login              # Login user
```

### Protected Endpoints (Requires Authentication)
```
GET    /api/auth/me                 # Get current user
GET    /api/cart                    # Get user cart
POST   /api/cart/add                # Add to cart
PUT    /api/cart/update             # Update cart item
DELETE /api/cart/remove/{id}        # Remove from cart
POST   /api/orders/place            # Place order
GET    /api/orders/my               # Get user orders
GET    /api/addresses               # Get user addresses
POST   /api/addresses               # Add new address
GET    /api/wishlist                # Get wishlist
POST   /api/wishlist/add            # Add to wishlist
POST   /api/reviews                 # Add product review
```

### Admin Endpoints (Requires ADMIN Role)
```
POST   /api/admin/products          # Create product
PUT    /api/admin/products/{id}     # Update product
DELETE /api/admin/products/{id}     # Delete product
GET    /api/admin/orders            # Get all orders
PUT    /api/admin/orders/{id}/status # Update order status
GET    /api/admin/users             # Get all users
PUT    /api/admin/users/{id}/block  # Block user
GET    /api/admin/analytics/summary # Dashboard analytics
```

---

## 📊 Database Schema

The application uses JPA with Hibernate to auto-create tables on first run:

**Main Tables:**
- `users` - User accounts
- `products` - Product catalog
- `categories` - Product categories
- `cart_items` - Shopping cart items
- `orders` - Order records
- `order_items` - Order line items
- `addresses` - User addresses
- `reviews` - Product reviews
- `wishlist_items` - User wishlist
- `coupons` - Discount coupons
- `payments` - Payment records

---

## 🔐 Security Features

1. **JWT Authentication** - Token-based auth with 24hr expiration
2. **Password Encryption** - BCrypt password hashing
3. **Role-Based Access** - USER and ADMIN roles
4. **CORS Protection** - Configured allowed origins
5. **SQL Injection Prevention** - JPA parameterized queries
6. **XSS Protection** - Input validation and sanitization

---

## 🚢 Deployment

### Backend Deployment

**Option 1: JAR File**
```powershell
mvn clean package
java -jar target/jewelry-ecommerce-1.0.0.jar
```

**Option 2: Docker** (Create Dockerfile)
```dockerfile
FROM openjdk:17-jdk-slim
COPY target/*.jar app.jar
ENTRYPOINT ["java","-jar","/app.jar"]
```

### Frontend Deployment

**Build:**
```powershell
npm run build
```

**Deploy to:**
- Vercel: `vercel deploy`
- Netlify: Drag `dist` folder
- AWS S3: Upload `dist` folder

---

## 📞 Support

For issues or questions:
1. Check this guide first
2. Review backend logs in console
3. Check frontend browser console (F12)
4. Verify all services are running
5. Check API endpoints in Swagger UI

---

## ✅ Verification Checklist

Before starting development:
- [ ] MySQL is installed and running
- [ ] Java 17+ is installed
- [ ] Maven is installed
- [ ] Node.js 18+ is installed
- [ ] Database created (jewelry_shop)
- [ ] Backend starts without errors
- [ ] Frontend starts without errors
- [ ] Can access Swagger UI
- [ ] Can access frontend UI
- [ ] Registration works
- [ ] Login works
- [ ] API calls succeed

---

**You're all set! Happy coding! 🎉**
