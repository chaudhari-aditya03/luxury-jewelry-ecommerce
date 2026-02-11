# 💎 Jewelry E-Commerce Platform

A full-stack, production-ready e-commerce platform for jewelry products built with **Spring Boot** (Backend) and **React + Vite** (Frontend).

---

## 🚀 Quick Start

### Prerequisites
- ✅ Java 17+
- ✅ Maven 3.6+
- ✅ MySQL 8.0+
- ✅ Node.js 18+
- ✅ npm 9+

### One-Command Start

```powershell
# From root directory
.\start-all.ps1
```

This will:
1. Start backend on `http://localhost:8080`
2. Start frontend on `http://localhost:5173`
3. Open both in separate terminal windows

### Manual Start

**Backend:**
```powershell
cd backend
mvn spring-boot:run
```

**Frontend:**
```powershell
cd frontend
npm install  # First time only
npm run dev
```

### First Time Setup

1. **Install MySQL** and create database (or let it auto-create):
   ```sql
   CREATE DATABASE jewelry_shop;
   ```

2. **Configure Database** (if needed):
   - Edit `backend/src/main/resources/application.properties`
   - Update username and password

3. **Install Dependencies:**
   ```powershell
   cd backend && mvn clean install
   cd frontend && npm install
   ```

4. **Run the application** using start scripts above

---

## 📁 Project Structure

```
E-Commerce_Website/
├── backend/                     # Spring Boot Backend
│   ├── src/main/java/
│   │   └── com/jewelryshop/
│   │       ├── controller/     # REST API Controllers
│   │       ├── service/        # Business Logic Layer
│   │       ├── repository/     # Data Access Layer
│   │       ├── entity/         # JPA Entities
│   │       ├── dto/            # Data Transfer Objects
│   │       ├── security/       # JWT & Security Config
│   │       ├── config/         # Spring Configuration
│   │       └── exception/      # Exception Handling
│   ├── src/main/resources/
│   │   └── application.properties
│   ├── pom.xml
│   └── start-backend.ps1       # Backend startup script
│
├── frontend/                    # React + Vite Frontend
│   ├── src/
│   │   ├── components/         # Reusable UI Components
│   │   ├── pages/             # Page Components
│   │   ├── admin/             # Admin Panel Pages
│   │   ├── layouts/           # Layout Components
│   │   ├── context/           # React Context (Auth, Theme)
│   │   ├── services/          # API Integration Layer
│   │   ├── hooks/             # Custom React Hooks
│   │   ├── utils/             # Utility Functions
│   │   └── assets/            # Images, Icons
│   ├── public/
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── .env.local             # Environment configuration
│   └── start-frontend.ps1     # Frontend startup script
│
├── start-all.ps1              # Start both servers
├── INTEGRATION_COMPLETE.md    # ✅ Setup completion guide
├── SETUP_AND_RUN.md          # Complete setup instructions
├── API_INTEGRATION_GUIDE.md  # API integration patterns
└── README.md                  # This file
```

---

## 🎯 Features

### Customer Features
- ✅ User Registration & Authentication (JWT)
- ✅ Product Browsing with Search & Filters
- ✅ Product Details with Variants & Reviews
- ✅ Shopping Cart with Coupon Support
- ✅ Wishlist Management
- ✅ Multi-Address Management
- ✅ Order Placement & Tracking
- ✅ Order History
- ✅ User Profile Management
- ✅ Responsive Design (Mobile, Tablet, Desktop)
- ✅ Dark Mode Support

### Admin Features
- ✅ Dashboard with Analytics (Charts & Stats)
- ✅ Product Management (CRUD)
- ✅ Category Management (CRUD)
- ✅ Order Management (View, Update Status)
- ✅ User Management (View, Block/Unblock)
- ✅ Coupon Management (CRUD)
- ✅ Sales Analytics & Reports

### Technical Features
- ✅ RESTful API Architecture
- ✅ JWT Token Authentication
- ✅ Role-Based Access Control (USER, ADMIN)
- ✅ Password Encryption (BCrypt)
- ✅ CORS Configuration
- ✅ Pagination Support
- ✅ API Documentation (Swagger UI)
- ✅ Form Validation
- ✅ Error Handling
- ✅ Loading States & Skeletons
- ✅ Toast Notifications

---

## 🛠️ Tech Stack

### Backend
| Technology | Version | Purpose |
|-----------|---------|---------|
| **Spring Boot** | 3.2.2 | Application Framework |
| **Spring Data JPA** | 3.2.2 | ORM Layer |
| **Spring Security** | 3.2.2 | Authentication & Authorization |
| **MySQL** | 8.0+ | Database |
| **JWT (jjwt)** | 0.12.3 | Token Generation |
| **ModelMapper** | 3.2.0 | DTO Mapping |
| **Swagger/OpenAPI** | 2.3.0 | API Documentation |
| **Lombok** | - | Boilerplate Reduction |
| **Maven** | 3.6+ | Build Tool |

### Frontend
| Technology | Version | Purpose |
|-----------|---------|---------|
| **React** | 19.2.0 | UI Library |
| **Vite** | 7.3.1 | Build Tool & Dev Server |
| **Tailwind CSS** | 4.1.18 | CSS Framework |
| **React Router** | 7.1.3 | Routing |
| **Axios** | 1.6.5 | HTTP Client |
| **React Hook Form** | 7.50.1 | Form Handling |
| **Recharts** | 2.10.3 | Charts & Analytics |
| **Heroicons** | 2.0.18 | Icons |
| **React Toastify** | 10.0.3 | Notifications |

---

## 🌐 API Endpoints

### Base URLs
- Backend API: `http://localhost:8080/api`
- Swagger UI: `http://localhost:8080/swagger-ui.html`
- Frontend: `http://localhost:5173`

### Public Endpoints
```
POST   /api/auth/register       # Register new user
POST   /api/auth/login          # Login user
GET    /api/products            # Get all products
GET    /api/products/{id}       # Get product details
GET    /api/products/search     # Search products
GET    /api/categories          # Get all categories
```

### Protected Endpoints (Requires Auth)
```
GET    /api/auth/me             # Get current user
GET    /api/cart                # Get user cart
POST   /api/cart/add            # Add to cart
GET    /api/orders/my           # Get user orders
POST   /api/orders/place        # Place order
GET    /api/wishlist            # Get wishlist
GET    /api/addresses           # Get addresses
POST   /api/reviews             # Add product review
```

### Admin Endpoints (Requires ADMIN Role)
```
POST   /api/admin/products      # Create product
PUT    /api/admin/products/{id} # Update product
GET    /api/admin/orders        # Get all orders
GET    /api/admin/users         # Get all users
GET    /api/admin/analytics/summary  # Dashboard stats
```

**Full API documentation:** http://localhost:8080/swagger-ui.html

---

## 📖 Documentation

| Document | Description |
|----------|-------------|
| **[INTEGRATION_COMPLETE.md](INTEGRATION_COMPLETE.md)** | ✅ Setup completion checklist & verification |
| **[SETUP_AND_RUN.md](SETUP_AND_RUN.md)** | Complete setup instructions with troubleshooting |
| **[API_INTEGRATION_GUIDE.md](API_INTEGRATION_GUIDE.md)** | API integration patterns & examples |
| **[frontend/FRONTEND.md](frontend/FRONTEND.md)** | Frontend architecture & components |
| **[frontend/DEMO_CREDENTIALS.md](frontend/DEMO_CREDENTIALS.md)** | Test accounts & demo data |
| **[frontend/QUICKSTART.md](frontend/QUICKSTART.md)** | 5-minute quick start |
| **[frontend/COMPONENTS_INVENTORY.md](frontend/COMPONENTS_INVENTORY.md)** | UI components reference |
| **[backend/DEPLOYMENT_GUIDE.md](backend/DEPLOYMENT_GUIDE.md)** | Backend deployment guide |

---

## 🎨 Design System

### Color Palette (Jewelry Theme)
- **Gold Primary:** `#b8956a` (luxury, elegance)
- **Ivory Secondary:** `#f5f5dc` (premium feel)
- **Dark Backgrounds:** `#1f2937` (modern, professional)
- **Text:** Gray scale for hierarchy

### UI Patterns
- **Shadows:** Soft, Gentle, Premium (3 levels)
- **Animations:** Fade-in, Slide-up, Pulse
- **Border Radius:** 8px (rounded, modern)
- **Typography:** System fonts with clear hierarchy

### Responsive Breakpoints
- **Mobile:** < 640px
- **Tablet:** 640px - 1024px
- **Desktop:** > 1024px

---

## 🧪 Testing

### Backend Testing
```powershell
cd backend
mvn test
```

### Frontend Testing (Manual)
1. **Registration Flow:**
   - Register → Login → Browse Products → Add to Cart → Checkout

2. **Admin Flow:**
   - Create admin user → Login → Access admin panel → Manage products

### API Testing
- **Swagger UI:** http://localhost:8080/swagger-ui.html
- **Postman:** Import collection from docs
- **curl:** Examples in API_INTEGRATION_GUIDE.md

---

## 🔐 Security

### Implemented
- ✅ JWT token authentication (24hr expiration)
- ✅ Password encryption (BCrypt)
- ✅ Role-based access control (USER, ADMIN)
- ✅ CORS protection
- ✅ SQL injection prevention (JPA)
- ✅ XSS protection (input validation)
- ✅ HTTPS ready for production

### Best Practices
- Change JWT secret in production
- Use environment variables for secrets
- Enable HTTPS in production
- Regular security audits
- Rate limiting for API endpoints

---

## 🐛 Troubleshooting

### Common Issues

**Backend won't start:**
- Check MySQL is running
- Verify database credentials
- Check port 8080 is available

**Frontend won't start:**
- Run `npm install`
- Check port 5173 is available
- Verify .env.local exists

**CORS errors:**
- Verify backend CORS config includes frontend URL
- Check both servers are running
- Clear browser cache

**401 Unauthorized:**
- JWT token expired → Login again
- Token not sent → Check localStorage
- Invalid token → Clear storage and login

**See SETUP_AND_RUN.md for complete troubleshooting guide**

---

## 🚢 Deployment

### Backend Deployment
```powershell
cd backend
mvn clean package
java -jar target/jewelry-ecommerce-1.0.0.jar
```

**Deploy to:**
- Heroku, AWS Elastic Beanstalk, Google Cloud Run
- Docker container
- Traditional servlet container

### Frontend Deployment
```powershell
cd frontend
npm run build
```

**Deploy to:**
- Vercel (recommended): `vercel deploy`
- Netlify: Drag & drop `dist` folder
- AWS S3 + CloudFront
- GitHub Pages

**See deployment guides in docs folder**

---

## 📊 Database Schema

**Auto-generated tables:**
- `users` - User accounts & authentication
- `products` - Product catalog
- `categories` - Product categories
- `cart_items` - Shopping cart
- `orders` - Order records
- `order_items` - Order line items
- `addresses` - User shipping addresses
- `reviews` - Product reviews
- `wishlist_items` - User wishlist
- `coupons` - Discount coupons
- `payments` - Payment records

**JPA auto-creates tables on first run with `spring.jpa.hibernate.ddl-auto=update`**

---

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

### Code Style
- **Backend:** Follow Spring Boot conventions
- **Frontend:** Use ESLint configuration
- **Commits:** Use conventional commits

---

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👨‍💻 Development Team

**Project Type:** Full-Stack E-Commerce Platform  
**Architecture:** Microservices-ready  
**Status:** Production Ready ✅

---

## 📞 Support

### Get Help
1. Check documentation files
2. Review troubleshooting section
3. Check backend logs (console output)
4. Check frontend console (F12 in browser)
5. Test API with Swagger UI

### Resources
- **Backend logs:** Check terminal where backend is running
- **Frontend logs:** Browser DevTools → Console
- **API testing:** Swagger UI at http://localhost:8080/swagger-ui.html
- **Database:** Use MySQL Workbench or CLI

---

## ✅ Project Status

| Component | Status | Version |
|-----------|--------|---------|
| Backend API | ✅ Complete | 1.0.0 |
| Frontend UI | ✅ Complete | 1.0.0 |
| Authentication | ✅ Working | JWT |
| Database | ✅ Configured | MySQL 8.0 |
| Admin Panel | ✅ Complete | Full featured |
| Documentation | ✅ Complete | Comprehensive |
| Integration | ✅ Complete | Fully connected |

---

## 🎉 Getting Started Now

```powershell
# 1. Clone/Navigate to project
cd E-Commerce_Website

# 2. Start everything
.\start-all.ps1

# 3. Access the application
# Frontend: http://localhost:5173
# Backend:  http://localhost:8080/api
# Swagger:  http://localhost:8080/swagger-ui.html

# 4. Create admin user (after registration)
# In MySQL:
UPDATE users SET role = 'ADMIN' WHERE email = 'your@email.com';

# 5. Start developing! 🚀
```

---

**Made with ❤️ using Spring Boot & React**

**Happy Coding! 🎉**
