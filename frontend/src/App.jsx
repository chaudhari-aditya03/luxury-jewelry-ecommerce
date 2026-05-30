import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { App as AntdApp, ConfigProvider } from 'antd';
import { theme } from './styles/theme';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './routes/ProtectedRoute';
import AdminRoute from './routes/AdminRoute';

// Layouts
import MainLayout from './layouts/MainLayout';

// Pages
import HomePage from './pages/Home';
import AboutPage from './pages/About';
import ContactPage from './pages/Contact';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import OAuthSuccessPage from './pages/OAuthSuccess';
import OAuthErrorPage from './pages/OAuthError';
import VerifyEmailPage from './pages/VerifyEmail';
import EmailVerificationRequiredPage from './pages/EmailVerificationRequiredPage';
import ForgotPasswordPage from './pages/ForgotPassword';
import ResetPasswordPage from './pages/ResetPassword';
import ShopPage from './pages/Shop';
import ProductDetailPage from './pages/ProductDetail';
import CartPage from './pages/Cart';
import CheckoutPage from './pages/Checkout';
import AccountPage from './pages/Account';
import MyCouponsPage from './pages/MyCoupons';
import WishlistPage from './pages/Wishlist';

// Admin Pages
import AdminDashboard from './admin/pages/Dashboard';
import AdminProducts from './admin/pages/Products';
import AdminCategories from './admin/pages/Categories';
import AdminOrders from './admin/pages/Orders';
import AdminUsers from './admin/pages/Users';
import AdminUserEdit from './admin/pages/UserEdit';
import AdminCoupons from './admin/pages/Coupons';
import AdminAnalytics from './admin/pages/Analytics';
import AdminPayments from './admin/pages/Payments';
import AdminProfile from './admin/pages/Profile';
import AdminSettings from './admin/pages/Settings';
import AdminReviews from './admin/pages/Reviews';
import AdminDiscountManagement from './admin/pages/AdminDiscountManagement';

// Error Pages
const NotFoundPage = () => (
  <MainLayout>
    <div className="section">
      <div className="container-custom text-center">
        <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">404</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
          Page not found
        </p>
        <a href="/" className="btn-primary inline-block">
          Go Home
        </a>
      </div>
    </div>
  </MainLayout>
);

function App() {
  return (
    <ThemeProvider>
      <ConfigProvider theme={theme}>
        <AuthProvider>
          <AntdApp>
            <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
              <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/oauth-success" element={<OAuthSuccessPage />} />
              <Route path="/oauth-error" element={<OAuthErrorPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/verify-email" element={<VerifyEmailPage />} />
              <Route path="/verify-email-required" element={<EmailVerificationRequiredPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              <Route path="/shop" element={<ShopPage />} />
              <Route path="/product/:id" element={<ProductDetailPage />} />
              <Route path="/our-story" element={<AboutPage />} />
              <Route path="/about" element={<Navigate to="/our-story" replace />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route
                path="/cart"
                element={
                  <ProtectedRoute>
                    <CartPage />
                  </ProtectedRoute>
                }
              />
              <Route path="/wishlist" element={<WishlistPage />} />

              {/* Protected Routes */}
              <Route
                path="/checkout"
                element={
                  <ProtectedRoute>
                    <CheckoutPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/account"
                element={
                  <ProtectedRoute>
                    <AccountPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/account/*"
                element={
                  <ProtectedRoute>
                    <AccountPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-coupons"
                element={
                  <ProtectedRoute>
                    <MyCouponsPage />
                  </ProtectedRoute>
                }
              />

              {/* Admin Routes */}
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/dashboard"
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/products"
                element={
                  <AdminRoute>
                    <AdminProducts />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/categories"
                element={
                  <AdminRoute>
                    <AdminCategories />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/orders"
                element={
                  <AdminRoute>
                    <AdminOrders />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <AdminRoute>
                    <AdminUsers />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/customers"
                element={
                  <AdminRoute>
                    <AdminUsers />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/users/edit/:id"
                element={
                  <AdminRoute>
                    <AdminUserEdit />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/coupons"
                element={
                  <AdminRoute>
                    <AdminCoupons />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/analytics"
                element={
                  <AdminRoute>
                    <AdminAnalytics />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/payments"
                element={
                  <AdminRoute>
                    <AdminPayments />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/profile"
                element={
                  <AdminRoute>
                    <AdminProfile />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/settings"
                element={
                  <AdminRoute>
                    <AdminSettings />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/reviews"
                element={
                  <AdminRoute>
                    <AdminReviews />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/discounts"
                element={
                  <AdminRoute>
                    <AdminDiscountManagement />
                  </AdminRoute>
                }
              />

              {/* Fallback Route */}
              <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Router>
          </AntdApp>
        </AuthProvider>
      </ConfigProvider>
    </ThemeProvider>
  );
}

export default App;
