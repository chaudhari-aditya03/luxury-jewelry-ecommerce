# Demo Credentials for Testing

## Admin Account
- **Email**: admin@example.com
- **Password**: Admin@123456
- **Access**: Full admin panel access with analytics, product/order/user management

## Customer Account
- **Email**: customer@example.com
- **Password**: Customer@123456
- **Access**: Customer features - shop, cart, orders, account

## Test Account
- **Email**: test@example.com
- **Password**: Test@123456
- **Access**: Standard customer access

## Test Data

### Coupon Codes
- `SAVE10` - 10% discount (minimum ₹5,000)
- `WELCOME500` - ₹500 off (minimum ₹2,000)

### Test Payment Methods
- **UPI**: Any UPI ID (demo mode accepts any)
- **Card**: Use test card numbers (demo)
- **COD**: Cash on delivery (no payment needed in demo)

## Feature Testing Checklist

### Authentication
- [ ] Register new account
- [ ] Login with credentials
- [ ] Auto-login on page refresh
- [ ] Logout functionality

### Shopping
- [ ] Browse products with filters
- [ ] Search products
- [ ] View product details
- [ ] Add to cart
- [ ] Update cart quantities
- [ ] View cart summary
- [ ] Apply coupon codes

### Checkout
- [ ] Select/add addresses
- [ ] Choose payment method
- [ ] Place order
- [ ] See order confirmation

### Account
- [ ] View profile info
- [ ] Update profile
- [ ] View order history
- [ ] Manage addresses
- [ ] View wishlist

### Admin (when logged in as admin)
- [ ] View dashboard analytics
- [ ] Manage products (CRUD)
- [ ] Manage categories
- [ ] Manage orders
- [ ] View users
- [ ] Manage coupons
- [ ] View detailed analytics

### UI/UX
- [ ] Dark mode toggle
- [ ] Responsive design (mobile, tablet, desktop)
- [ ] Loading states
- [ ] Error messages
- [ ] Success notifications
- [ ] Form validation

## Development Tips

### Mock API Data
- All pages include dummy data for testing
- Actual API calls will work once backend is running
- Check console for network requests

### Local Storage
- Authentication tokens stored in localStorage
- Theme preference persisted
- Cart data can be added to localStorage

### Browser DevTools
- Check Network tab for API calls (once backend is running)
- Check Console for any JS errors
- Check Application tab to view localStorage data

## Common Test Scenarios

### Scenario 1: New User Journey
1. Go to home page
2. Click "Register"
3. Create account with test data
4. Browse shop
5. Add products to cart
6. Proceed to checkout
7. Complete order

### Scenario 2: Admin Testing
1. Login with admin credentials
2. Navigate to admin panel
3. View dashboard analytics
4. Test product management
5. Check order management
6. Verify user management

### Scenario 3: Cart & Checkout
1. Add multiple products to cart
2. Apply coupon code
3. Update quantities
4. Remove items
5. Verify order summary
6. Complete checkout flow

## Backend Connection

When backend is running on http://localhost:8080:

1. API calls will hit the real backend
2. Authentication will use real JWT tokens
3. Data will persist in database
4. Email notifications will be sent

## Troubleshooting Testing

**Issue**: Products not loading
- Check API_URL in .env.local
- Verify backend is running
- Check browser console for errors

**Issue**: Login not working
- Check credentials
- Clear localStorage and cookies
- Check backend is running

**Issue**: Styling looks broken
- Clear browser cache (Ctrl+Shift+Delete)
- Restart dev server (npm run dev)
- Check if Tailwind classes are generated

## Performance Testing

### Lighthouse
- Open DevTools → Lighthouse
- Run audits to check performance
- Target score: 90+

### Network Tab
- Monitor API response times
- Check bundle sizes
- Verify caching headers

---

**Last Updated**: 2024-01-15  
**Version**: 1.0.0
