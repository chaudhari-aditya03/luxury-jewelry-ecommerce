# Jewelry E-Commerce Frontend - Complete Implementation

This is a production-ready e-commerce frontend built with React (Vite), Tailwind CSS, and modern best practices.

## 🚀 Features

### User Features
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ JWT authentication with context API
- ✅ Protected routes
- ✅ Product catalog with filters and search
- ✅ Product details with variants and reviews
- ✅ Shopping cart with coupon support
- ✅ Checkout flow with address management
- ✅ User dashboard/account management
- ✅ Order history tracking
- ✅ Wishlist functionality
- ✅ Dark mode support

### Admin Features
- ✅ Admin dashboard with analytics
- ✅ Sales charts (Monthly, Category distribution)
- ✅ Product management (CRUD)
- ✅ Order management with status updates
- ✅ User management with blocking/unblocking
- ✅ Real-time statistics

### Technical Stack
- **Framework**: React 19+ with Vite
- **Styling**: Tailwind CSS 4 with custom theme
- **Forms**: React Hook Form with validation
- **Routing**: React Router v6 with protected routes
- **State Management**: Context API + localStorage
- **HTTP Client**: Axios with JWT interceptors
- **Charts**: Recharts for analytics
- **Components**: Headless UI + custom components
- **Animations**: Tailwind animations + CSS transitions
- **Icons**: Heroicons

## 📁 Project Structure

```
frontend/
├── public/                         # Static assets
├── src/
│   ├── assets/
│   │   ├── images/                # Image files
│   │   └── icons/                 # Icon files
│   ├── components/
│   │   ├── common/                # Reusable UI components
│   │   │   ├── Button.jsx         # Button component
│   │   │   ├── Input.jsx          # Form input
│   │   │   ├── Select.jsx         # Select dropdown
│   │   │   ├── Modal.jsx          # Modal dialog
│   │   │   ├── Pagination.jsx     # Pagination control
│   │   │   ├── Skeleton.jsx       # Loading skeleton
│   │   │   ├── Alert.jsx          # Alert messages
│   │   │   ├── Toast.jsx          # Toast notifications
│   │   │   ├── Navbar.jsx         # Navigation bar
│   │   │   ├── Footer.jsx         # Footer component
│   │   │   └── RadioGroup.jsx     # Radio input group
│   │   └── product/
│   │       └── ProductCard.jsx    # Product card component
│   ├── pages/
│   │   ├── Home.jsx               # Landing page
│   │   ├── Shop.jsx               # Product listing
│   │   ├── ProductDetail.jsx      # Product details
│   │   ├── Cart.jsx               # Shopping cart
│   │   ├── Checkout.jsx           # Checkout page
│   │   ├── Login.jsx              # Login page
│   │   ├── Register.jsx           # Registration
│   │   └── Account.jsx            # User account dashboard
│   ├── admin/
│   │   └── pages/
│   │       ├── Dashboard.jsx      # Admin dashboard
│   │       ├── Products.jsx       # Product management
│   │       ├── Orders.jsx         # Order management
│   │       └── Users.jsx          # User management
│   ├── layouts/
│   │   ├── MainLayout.jsx         # Main layout with navbar/footer
│   │   └── AdminLayout.jsx        # Admin layout with sidebar
│   ├── routes/
│   │   ├── ProtectedRoute.jsx     # Protected route wrapper
│   │   └── AdminRoute.jsx         # Admin-only route wrapper
│   ├── context/
│   │   ├── AuthContext.jsx        # Authentication state
│   │   └── ThemeContext.jsx       # Dark mode state
│   ├── services/
│   │   ├── apiClient.js           # Axios instance
│   │   └── index.js               # API service methods
│   ├── hooks/
│   │   └── index.js               # Custom hooks
│   ├── utils/
│   │   └── helpers.js             # Utility functions
│   ├── App.jsx                    # Main app routing
│   ├── main.jsx                   # Entry point
│   └── index.css                  # Global styles
├── .env.example                   # Environment variables template
├── tailwind.config.js             # Tailwind configuration
├── postcss.config.js              # PostCSS configuration
├── vite.config.js                 # Vite configuration
├── eslint.config.js               # ESLint configuration
└── package.json                   # Dependencies & scripts
```

## 🎨 Design System

### Color Palette
- **Primary**: Gold (#b8956a) - Luxury jewelry branding
- **Secondary**: Ivory (#b4b4a1) - Soft background
- **Dark**: Gray-900 (#1f2937) - Text on light
- **Light**: White (#ffffff) - Backgrounds

### Typography
- **Display**: Playfair Display (serif) - Headings
- **Body**: Segoe UI (sans-serif) - Content

### Components
All components follow Material Design principles with custom modifications for jewelry theme.

## 🔧 Setup Instructions

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. **Clone and navigate**
```bash
cd frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Create environment file**
```bash
cp .env.example .env.local
```

4. **Update API URL** (if needed)
Edit `.env.local`:
```
VITE_API_URL=http://localhost:8080/api
```

### Development

**Start development server:**
```bash
npm run dev
```
Server runs at: `http://localhost:5173`

**Build for production:**
```bash
npm run build
```

**Preview production build:**
```bash
npm run preview
```

**Lint code:**
```bash
npm run lint
```

## 🔐 Authentication Flow

1. **Login/Register**
   - User submits credentials via form
   - API returns JWT token
   - Token stored in localStorage
   - User state saved in AuthContext
   
2. **Auto-login on Refresh**
   - AuthProvider checks localStorage on mount
   - Restores user state if token exists
   - Token auto-attached to requests via interceptor

3. **Protected Routes**
   - ProtectedRoute wrapper checks authentication
   - Redirects to /login if not authenticated
   - Shows loading indicator during auth check

4. **Logout**
   - Clear localStorage tokens
   - Reset user state
   - Redirect to home page

5. **API Error Handling**
   - 401 errors trigger auto-redirect to login
   - Toast notifications for error messages
   - Global interceptor handles responses

## 🎯 API Integration

All API calls use the `services` layer:

```javascript
// Import service
import { productService, cartService, orderService } from '../services';

// Use in components
const products = await productService.getAllProducts(1, 12);
const cart = await cartService.getCart();
const order = await orderService.placeOrder(orderData);
```

### Available Services
- `authService` - Login, register, logout
- `productService` - Products, categories, search
- `cartService` - Cart operations
- `orderService` - Orders, payments
- `userService` - Profile, addresses, wishlist
- `reviewService` - Product reviews
- `adminService` - Admin operations
- `analyticsService` - Dashboard analytics

## 📱 Responsive Breakpoints

- **Mobile**: < 640px (sm)
- **Tablet**: 640px - 1024px (md, lg)
- **Desktop**: > 1024px (xl)

## 🌙 Dark Mode

- Auto-detects system preference
- Toggle button in navbar
- Persists in localStorage
- All components fully styled

## 📝 Form Validation

Forms use React Hook Form with custom validation:
- Email validation
- Password strength (8+ chars, uppercase, number)
- Phone validation (10 digit Indian format)
- Custom error messages

## 🧩 Reusable Components

### Button
```jsx
<Button variant="primary" size="lg" isLoading={false}>
  Click me
</Button>
```

### Input
```jsx
<Input 
  label="Email" 
  error={errors.email?.message}
  icon={<EnvelopeIcon />}
  {...register('email')}
/>
```

### Modal
```jsx
<Modal isOpen={isOpen} onClose={onClose} title="Confirm">
  <p>Are you sure?</p>
</Modal>
```

### Alert
```jsx
<Alert type="success" message="Success!" />
```

## 🚀 Deployment

### Build Optimization
- Minified + tree-shaking
- Code splitting for routes
- Image optimization
- CSS purging

### Environment Setup
1. Build: `npm run build` → creates `/dist`
2. Deploy `/dist` to hosting (Vercel, Netlify, AWS)
3. Set environment variables on platform
4. Configure API URL for production

## 🔍 Common Issues

### CORS Errors
- API proxy configured in vite.config.js
- For development: proxy requests to backend
- For production: backend must allow frontend URL

### 401 Unauthorized
- Token missing or expired
- Check localStorage for authToken
- Login again if needed
- Check API_URL is correct

### Styling Not Applied
- Run: `npm install`
- Clear cache: Delete node_modules, package-lock.json
- Restart dev server
- Check tailwind.config.js

## 📚 Additional Resources

- [React Hooks Guide](https://react.dev)
- [Tailwind CSS Docs](https://tailwindcss.com)
- [React Router v6](https://reactrouter.com)
- [React Hook Form](https://react-hook-form.com)
- [Axios Docs](https://axios-http.com)
- [Recharts](https://recharts.org)

## 🐛 Troubleshooting

### Port 5173 Already in Use
```bash
# Kill process on port
npx kill-port 5173
# Or specify different port
npm run dev -- --port 5174
```

### Module Not Found
```bash
# Clear npm cache
npm cache clean --force
npm install
```

### CSS Changes Not Reflecting
```bash
# Clear Tailwind cache
rm -rf .next
npm run dev
```

## 📋 Webpack/Build Notes

- Uses Vite for fast development
- Tree-shaking enabled
- Dynamic imports for route splitting
- Minification in production
- Source maps for debugging

## 🔄 State Management

- **Auth**: Context API + localStorage
- **Theme**: Context API + localStorage
- **Cart**: Local state (can be moved to context)
- **Forms**: React Hook Form

## 🚢 Production Checklist

- [ ] Enable HTTPS
- [ ] Set up API endpoints
- [ ] Configure environment variables
- [ ] Test all routes
- [ ] Verify authentication
- [ ] Check responsive design
- [ ] Optimize images
- [ ] Set up error tracking (Sentry)
- [ ] Configure analytics
- [ ] Set up CDN for assets
- [ ] Test payment integration
- [ ] Security headers configured

## 📧 Support

For issues or questions:
1. Check documentation
2. Review code comments
3. Check browser console for errors
4. Verify API connection
5. Check environment variables

---

**Version**: 1.0.0  
**Last Updated**: 2024-01-15  
**Status**: Production Ready ✅
