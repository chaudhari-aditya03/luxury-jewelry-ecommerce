import apiClient from './apiClient';

export const authService = {
  login: (email, password) =>
    apiClient.post('/auth/login', { email, password }),

  sendOtp: (userData) =>
    apiClient.post('/auth/send-otp', userData),

  register: (userData) =>
    apiClient.post('/auth/register', userData),

  verifyOtp: (email, otpCode) =>
    apiClient.post('/auth/verify-otp', { email, otpCode }),

  resendOtp: (email) =>
    apiClient.post('/auth/resend-otp', { email }),

  verifyEmail: (email, otpCode) =>
    apiClient.post('/auth/verify-email', { email, otpCode }),

  resendVerificationEmail: (email) =>
    apiClient.post('/auth/resend-verification', { email }),

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    localStorage.removeItem('email');
    localStorage.removeItem('profileImage');
    localStorage.removeItem('pendingVerificationEmail');
  },

  getCurrentUser: () =>
    apiClient.get('/auth/me'),

  forgotPassword: (email) =>
    apiClient.post('/auth/forgot-password', { email }),

  resetPassword: (token, newPassword, confirmPassword = newPassword) =>
    apiClient.post('/auth/reset-password', { token, newPassword, confirmPassword }),

  validateResetToken: (token) =>
    apiClient.post('/auth/validate-reset-token', { token }),

  getGoogleLoginUrl: () => {
    const baseUrl = apiClient.defaults.baseURL || '/api';
    return `${baseUrl}/auth/google`;
  },
};

export const productService = {
  getAllProducts: (page = 0, size = 12, filters = {}) =>
    apiClient.get('/products', { params: { page, size, ...filters } }),

  getProductById: (id) =>
    apiClient.get(`/products/${id}`),

  searchProducts: (query, page = 0, size = 12) =>
    apiClient.get('/products/search', { params: { keyword: query, page, size } }),

  getCategories: () =>
    apiClient.get('/categories'),

  getProductByCategory: (categoryId, page = 0, size = 12) =>
    apiClient.get(`/products/category/${categoryId}`, { params: { page, size } }),

  getFeaturedProducts: (limit = 10) =>
    apiClient.get('/products/featured', { params: { limit } }),
};

export const cartService = {
  getCart: () =>
    apiClient.get('/cart'),

  addToCart: (productId, quantity = 1, variantId = null) =>
    apiClient.post('/cart/add', { productId, quantity, variantId }),

  updateCartItem: (productId, quantity) =>
    apiClient.put('/cart/update', { productId, quantity }),

  removeFromCart: (productId) =>
    apiClient.delete(`/cart/remove/${productId}`),

  clearCart: () =>
    apiClient.delete('/cart/clear'),

  applyCoupon: (code, orderAmount) =>
    couponService.applyCoupon(code, orderAmount),
};

export const couponService = {
  applyCoupon: (code, orderAmount) =>
    apiClient.post('/coupons/apply', { code, orderAmount }),

  getMyCoupons: () =>
    apiClient.get('/coupons/my'),

  getAvailableCoupons: () =>
    apiClient.get('/coupons/available'),

  getCouponAnalytics: () =>
    apiClient.get('/admin/coupons/analytics'),
};

export const orderService = {
  placeOrder: (orderData) =>
    apiClient.post('/orders/place', orderData),

  getMyOrders: () =>
    apiClient.get('/orders/my'),

  getOrderById: (id) =>
    apiClient.get(`/orders/${id}`),

  cancelOrder: (id, reason) =>
    apiClient.put(`/orders/cancel/${id}`, { reason }),

  createPayment: (orderId, amount = null) =>
    apiClient.post('/payment/create', { orderId, amount }),

  confirmUpiPayment: (orderId, paymentReference) =>
    apiClient.post('/payment/confirm-upi', { orderId, paymentReference }),
};

export const userService = {
  getProfile: () =>
    apiClient.get('/users/profile'),

  updateProfile: (userData) =>
    apiClient.put('/users/update', userData),

  addAddress: (addressData) =>
    apiClient.post('/addresses', addressData),

  updateAddress: (id, addressData) =>
    apiClient.put(`/addresses/${id}`, addressData),

  deleteAddress: (id) =>
    apiClient.delete(`/addresses/${id}`),

  getAddresses: () =>
    apiClient.get('/addresses'),

  addToWishlist: (productId) =>
    apiClient.post('/wishlist/add', null, { params: { productId } }),

  removeFromWishlist: (productId) =>
    apiClient.delete(`/wishlist/remove/${productId}`),

  getWishlist: () =>
    apiClient.get('/wishlist'),
};

export const reviewService = {
  addReview: (reviewData) =>
    apiClient.post('/reviews', reviewData),

  getProductReviews: (productId, page = 0, size = 10) =>
    apiClient.get(`/reviews/product/${productId}`, { params: { page, size } }),

  updateReview: (id, reviewData) =>
    apiClient.put(`/reviews/${id}`, reviewData),

  deleteReview: (id) =>
    apiClient.delete(`/reviews/${id}`),
};

export const adminService = {
  // Product Management
  createProduct: (productData) =>
    apiClient.post('/admin/products', productData),

  updateProduct: (id, productData) =>
    apiClient.put(`/admin/products/${id}`, productData),

  deleteProduct: (id) =>
    apiClient.delete(`/admin/products/${id}`),

  // Category Management
  createCategory: (categoryData) =>
    apiClient.post('/admin/categories', categoryData),

  updateCategory: (id, categoryData) =>
    apiClient.put(`/admin/categories/${id}`, categoryData),

  deleteCategory: (id) =>
    apiClient.delete(`/admin/categories/${id}`),

  // Order Management
  getAllOrders: (page = 0, size = 10) =>
    apiClient.get('/admin/orders', { params: { page, size } }),

  updateOrderStatus: (orderId, statusData) =>
    apiClient.put(`/admin/orders/status/${orderId}`, statusData),

  // User Management
  getAllUsers: (page = 0, size = 10) =>
    apiClient.get('/admin/users', { params: { page, size } }),

  getUserById: (userId) =>
    apiClient.get(`/admin/users/${userId}`),

  updateUser: (userId, userData) =>
    apiClient.put(`/admin/users/${userId}`, userData),

  deleteUser: (userId) =>
    apiClient.delete(`/admin/users/${userId}`),

  blockUser: (userId) =>
    apiClient.put(`/admin/users/block/${userId}`),

  // Coupon Management
  createCoupon: (couponData) =>
    apiClient.post('/admin/coupons', couponData),

  getAllCoupons: () =>
    apiClient.get('/admin/coupons'),

  getCouponById: (id) =>
    apiClient.get(`/admin/coupons/${id}`),

  updateCoupon: (id, couponData) =>
    apiClient.put(`/admin/coupons/${id}`, couponData),

  toggleCouponStatus: (id, active) =>
    apiClient.put(`/admin/coupons/${id}/status`, null, { params: { active } }),

  deleteCoupon: (id) =>
    apiClient.delete(`/admin/coupons/${id}`),

  uploadProductImage: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post('/admin/upload-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  // Analytics
  getDashboardSummary: () =>
    apiClient.get('/admin/analytics/summary'),

  getMonthlySales: (year = 2026) =>
    apiClient.get('/admin/analytics/monthly', { params: { year } }),

  updateProductDiscount: (id, payload) =>
    apiClient.put(`/admin/products/${id}/discount`, payload),

  removeProductDiscount: (id) =>
    apiClient.delete(`/admin/products/${id}/discount`),

  scheduleProductSale: (id, payload) =>
    apiClient.post(`/admin/products/${id}/schedule-sale`, payload),

  // Payment Management
  getAllPayments: (page = 0, size = 10) =>
    apiClient.get('/payment/admin/payments', { params: { page, size } }),

  updatePaymentStatus: (orderId, status) =>
    apiClient.put('/payment/admin/status', null, { params: { orderId, status } }),
};

export const categoryService = {
  getAllCategories: () =>
    apiClient.get('/categories'),

  getCategoryById: (id) =>
    apiClient.get(`/categories/${id}`),
};

export default apiClient;
