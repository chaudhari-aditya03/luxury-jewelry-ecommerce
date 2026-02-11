<!-- Quick Start Guide for Frontend Development -->

# 🚀 Quick Start Guide

## Prerequisites
- Node.js 16+ ([Download](https://nodejs.org))
- Code Editor (VS Code recommended)
- Git (optional)

## 5-Minute Setup

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

Server starts at: **http://localhost:5173**

### 3. Open in Browser
Click the link or navigate to `http://localhost:5173`

## 🎯 First Steps

1. **Explore the home page** - See the landing page design
2. **Navigate to shop** - Browse products with filters
3. **Register/Login** - Create an account (demo credentials in DEMO_CREDENTIALS.md)
4. **Add to cart** - Test shopping functionality
5. **Try checkout** - Test the checkout flow (no real payment needed in demo)
6. **Admin panel** - Login as admin to see analytics and management features

## 📁 Key Files to Know

```
frontend/
├── src/App.jsx           # Main routing configuration
├── src/components/       # Reusable UI components
├── src/pages/            # Page components
├── src/admin/            # Admin pages
├── src/context/          # Auth & Theme state
├── src/services/         # API service layer
├── src/utils/            # Utility functions
├── tailwind.config.js    # Tailwind CSS theme
└── vite.config.js        # Vite configuration
```

## 🔧 Available Commands

```bash
# Development
npm run dev          # Start dev server (with hot reload)

# Build
npm run build        # Build for production
npm run preview      # Preview production build locally

# Code Quality
npm run lint         # Check code for issues
```

## 🎨 Customization

### Colors
Edit `tailwind.config.js` to change the gold/ivory theme:
```javascript
gold: {
  600: '#b8956a',  // primary color
  // ... other shades
}
```

### API Endpoint
Edit `.env.local` to point to your backend:
```
VITE_API_URL=http://localhost:8080/api
```

### Component Styling
All components are in `src/components/` - customize as needed

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| Port 5173 in use | `npx kill-port 5173` then restart |
| Module errors | `npm install` then `npm run dev` |
| Styles not working | Clear cache: Delete `.next`, restart dev server |
| API errors | Check backend is running, verify API URL in .env |

## 📚 Resource Links

- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [React Router](https://reactrouter.com)
- [Vite Documentation](https://vitejs.dev)

## 🚀 Next Steps

1. **Explore the code** - Start in `src/App.jsx`
2. **Understand the structure** - Check `src/pages/` and `src/components/`
3. **Modify and customize** - Try changing colors, text, components
4. **Connect to backend** - Set up your backend API
5. **Deploy** - Build and deploy to production

## 📖 Full Documentation

For complete documentation, see **FRONTEND.md**

---

**Need help?** Check FRONTEND.md or DEMO_CREDENTIALS.md
