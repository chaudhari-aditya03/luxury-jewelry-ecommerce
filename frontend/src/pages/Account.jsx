import React, { useEffect, useState } from 'react';
import { Alert, Button, Col, Form, Input, Modal, Row, Spin, message } from 'antd';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  CreditCard,
  Heart,
  LogOut,
  MapPin,
  Package,
  Sparkles,
  User,
} from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import { useAuth } from '../context/AuthContext';
import { formatPrice, formatDate, getImageUrl } from '../utils/helpers';
import { orderService, userService } from '../services';
import './Account.css';

const statusStyles = {
  DELIVERED: { label: 'Delivered', tone: 'emerald' },
  PROCESSING: { label: 'Processing', tone: 'gold' },
  PLACED: { label: 'Placed', tone: 'gold' },
  SHIPPED: { label: 'Shipped', tone: 'gold' },
  CANCELLED: { label: 'Cancelled', tone: 'neutral' },
  RETURNED: { label: 'Returned', tone: 'neutral' },
};

const paymentStyles = {
  PAID: { label: 'Paid', tone: 'emerald' },
  PENDING: { label: 'Pending', tone: 'gold' },
  FAILED: { label: 'Failed', tone: 'neutral' },
  REFUNDED: { label: 'Refunded', tone: 'neutral' },
};

const mapWishlistItem = (item) => ({
  id: item.productId || item.id,
  productId: item.productId || item.id,
  name: item.productName || item.name || 'Saved Piece',
  price: Number(item.productPrice ?? item.salePrice ?? item.price ?? 0),
  originalPrice: Number(item.originalPrice ?? item.productOriginalPrice ?? item.mrp ?? item.productPrice ?? item.price ?? 0),
  image: getImageUrl(item.productImage || item.imageUrl || item.image),
  rating: Number(item.averageRating ?? item.rating ?? 0),
  category: item.categoryName || item.category || 'Jewelry',
});

const getInitials = (fullName) => {
  const parts = String(fullName || 'U').trim().split(/\s+/).filter(Boolean);
  return parts.slice(0, 2).map((part) => part[0]?.toUpperCase()).join('') || 'U';
};

const StatusBadge = ({ status, fallback = 'neutral', type = 'order' }) => {
  const styles = type === 'payment' ? paymentStyles : statusStyles;
  const meta = styles[status] || { label: status || 'Unknown', tone: fallback };
  return <span className={`account-badge account-badge--${meta.tone}`}>{meta.label}</span>;
};

const AccountPage = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [profileForm] = Form.useForm();
  const [addressForm] = Form.useForm();

  const [isLoading, setIsLoading] = useState(true);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [selectedOrderForCancel, setSelectedOrderForCancel] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [isCancellingOrder, setIsCancellingOrder] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [sectionErrors, setSectionErrors] = useState({});
  const [orderDetailOpen, setOrderDetailOpen] = useState(false);
  const [orderDetailLoading, setOrderDetailLoading] = useState(false);
  const [orderDetailError, setOrderDetailError] = useState('');
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);

  const getTabFromPath = () => {
    if (location.pathname.includes('/account/orders')) return 'orders';
    if (location.pathname.includes('/account/addresses')) return 'addresses';
    if (location.pathname.includes('/account/wishlist')) return 'wishlist';
    if (location.pathname.includes('/account/payments')) return 'payments';
    return 'profile';
  };

  useEffect(() => {
    setActiveTab(getTabFromPath());
  }, [location.pathname]);

  useEffect(() => {
    if (!isAuthenticated) {
      setIsLoading(false);
      setProfile(null);
      setOrders([]);
      setAddresses([]);
      setWishlistItems([]);
      setSectionErrors({});
      return;
    }

    let isMounted = true;

    const fetchAccountData = async () => {
      setIsLoading(true);
      setSectionErrors({});

      try {
        const [profileRes, ordersRes, addressesRes, wishlistRes] = await Promise.allSettled([
          userService.getProfile(),
          orderService.getMyOrders(),
          userService.getAddresses(),
          userService.getWishlist(),
        ]);

        if (!isMounted) {
          return;
        }

        const nextErrors = {};

        if (profileRes.status === 'fulfilled') {
          const profileData = profileRes.value.data?.data;
          setProfile(profileData);
          profileForm.setFieldsValue({
            fullName: profileData?.fullName || user?.fullName,
            email: profileData?.email || user?.email,
            phone: profileData?.phone || user?.phone,
          });
        } else {
          nextErrors.profile = profileRes.reason?.response?.data?.message || 'Failed to load profile';
          setProfile(user);
          profileForm.setFieldsValue({
            fullName: user?.fullName,
            email: user?.email,
            phone: user?.phone,
          });
        }

        if (ordersRes.status === 'fulfilled') {
          const ordersData = ordersRes.value.data?.data || [];
          setOrders(ordersData.map((item) => ({
            key: item.id,
            id: item.id,
            orderId: item.orderNumber,
            date: item.createdAt,
            total: Number(item.finalAmount ?? item.totalAmount ?? 0),
            status: item.orderStatus,
            paymentStatus: item.paymentStatus,
          })));
        } else {
          nextErrors.orders = ordersRes.reason?.response?.data?.message || 'Failed to load orders';
          setOrders([]);
        }

        if (addressesRes.status === 'fulfilled') {
          setAddresses(addressesRes.value.data?.data || []);
        } else {
          nextErrors.addresses = addressesRes.reason?.response?.data?.message || 'Failed to load addresses';
          setAddresses([]);
        }

        if (wishlistRes.status === 'fulfilled') {
          const wishlistData = wishlistRes.value.data?.data || [];
          setWishlistItems(wishlistData.map(mapWishlistItem));
        } else {
          nextErrors.wishlist = wishlistRes.reason?.response?.data?.message || 'Failed to load wishlist';
          setWishlistItems([]);
        }

        setSectionErrors(nextErrors);

        if (Object.keys(nextErrors).length > 0) {
          message.warning('Some account sections could not be loaded. The available sections are shown.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchAccountData();

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, user, profileForm]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const confirmLogout = () => {
    Modal.confirm({
      title: 'Sign out of Luxury Maison?',
      content: 'You will be signed out of your account on this device.',
      okText: 'Logout',
      cancelText: 'Stay Signed In',
      okButtonProps: { danger: true },
      onOk: handleLogout,
    });
  };

  const handleProfileSave = async (values) => {
    setIsSavingProfile(true);
    try {
      const response = await userService.updateProfile({
        fullName: values.fullName,
        email: values.email,
        phone: values.phone,
      });
      setProfile(response.data?.data);
      message.success('Profile updated successfully');
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const resetProfileForm = () => {
    profileForm.setFieldsValue({
      fullName: profile?.fullName || user?.fullName,
      email: profile?.email || user?.email,
      phone: profile?.phone || user?.phone,
    });
  };

  const openAddressModal = (address = null) => {
    if (address) {
      setEditingAddressId(address.id);
      addressForm.setFieldsValue(address);
    } else {
      setEditingAddressId(null);
      addressForm.resetFields();
      addressForm.setFieldsValue({ country: 'India', isDefault: false });
    }
    setIsAddressModalOpen(true);
  };

  const handleAddressSave = async () => {
    try {
      const values = await addressForm.validateFields();
      if (editingAddressId) {
        await userService.updateAddress(editingAddressId, values);
        message.success('Address updated');
      } else {
        await userService.addAddress(values);
        message.success('Address added');
      }
      setIsAddressModalOpen(false);
      const response = await userService.getAddresses();
      setAddresses(response.data?.data || []);
    } catch (error) {
      if (error?.response) {
        message.error(error.response?.data?.message || 'Failed to save address');
      }
    }
  };

  const handleAddressDelete = async (id) => {
    try {
      await userService.deleteAddress(id);
      message.success('Address deleted');
      setAddresses((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to delete address');
    }
  };

  const canCancelOrder = (order) => !['CANCELLED', 'DELIVERED', 'RETURNED'].includes(order?.status);

  const openCancelOrderModal = (order) => {
    setSelectedOrderForCancel(order);
    setCancelReason('');
    setIsCancelModalOpen(true);
  };

  const handleCancelOrder = async () => {
    if (!selectedOrderForCancel?.id) return;

    setIsCancellingOrder(true);
    try {
      await orderService.cancelOrder(
        selectedOrderForCancel.id,
        cancelReason.trim() || 'Cancelled by customer from account page',
      );

      setOrders((prev) => prev.map((order) => (
        order.id === selectedOrderForCancel.id
          ? { ...order, status: 'CANCELLED' }
          : order
      )));

      message.success(`Order ${selectedOrderForCancel.orderId} cancelled successfully`);
      setIsCancelModalOpen(false);
      setSelectedOrderForCancel(null);
      setCancelReason('');
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to cancel order');
    } finally {
      setIsCancellingOrder(false);
    }
  };

  const handleViewOrderDetails = async (order) => {
    setSelectedOrderDetails(order);
    setOrderDetailError('');
    setOrderDetailOpen(true);
    setOrderDetailLoading(true);

    try {
      const response = await orderService.getOrderById(order.id);
      setSelectedOrderDetails(response.data?.data || order);
    } catch (error) {
      setOrderDetailError(error.response?.data?.message || 'Failed to load order details');
    } finally {
      setOrderDetailLoading(false);
    }
  };

  const navigateToTab = (tabKey) => {
    setActiveTab(tabKey);
    const paths = {
      profile: '/account',
      orders: '/account/orders',
      addresses: '/account/addresses',
      wishlist: '/account/wishlist',
      payments: '/account/payments',
    };

    if (paths[tabKey]) {
      navigate(paths[tabKey]);
    }
  };

  const navItems = [
    {
      key: 'profile',
      label: 'Profile Details',
      description: 'Update your personal information',
      icon: User,
    },
    {
      key: 'orders',
      label: 'My Orders',
      description: 'Recent purchases and status',
      icon: Package,
    },
    {
      key: 'wishlist',
      label: 'Wishlist',
      description: 'Saved pieces for later',
      icon: Heart,
    },
    {
      key: 'addresses',
      label: 'Addresses',
      description: 'Delivery and billing details',
      icon: MapPin,
    },
    {
      key: 'payments',
      label: 'Payments',
      description: 'Payment history and status',
      icon: CreditCard,
    },
    {
      key: 'logout',
      label: 'Logout',
      description: 'Sign out securely',
      icon: LogOut,
    },
  ];

  const primaryAddress = addresses.find((address) => address.isDefault) || addresses[0];
  const profileName = profile?.fullName || user?.fullName || 'Maison Member';
  const profileEmail = profile?.email || user?.email || 'member@jewelrymaison.com';
  const memberSince = formatDate(profile?.createdAt || profile?.joinedDate || profile?.updatedAt);
  const hiddenForms = (
    <div aria-hidden="true" className="hidden">
      <Form form={profileForm} />
      <Form form={addressForm} />
    </div>
  );

  if (!isAuthenticated) {
    return (
      <MainLayout>
        <section className="account-page section">
          <div className="account-shell">
            {hiddenForms}
            <div className="account-auth-card text-center">
              <div className="account-empty-icon mx-auto">
                <Sparkles className="h-8 w-8" />
              </div>
              <p className="account-kicker">Luxury Maison</p>
              <h1 className="account-auth-title mt-3">Welcome to Luxury Maison</h1>
              <p className="account-auth-subtitle">
                Sign in to manage your profile, orders, wishlist, and saved details.
              </p>
              <div className="account-button-row justify-center mt-8">
                <Link to="/login">
                  <Button type="primary" size="large" className="account-primary-btn" aria-label="Sign in to your account">
                    Sign In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="large" className="account-secondary-btn" aria-label="Create a new account">
                    Create Account
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </MainLayout>
    );
  }

  if (isLoading) {
    return (
      <MainLayout>
        <section className="account-page section">
          <div className="account-shell">
            {hiddenForms}
            <div className="account-panel text-center">
              <Spin size="large" />
              <p className="mt-4 font-display text-2xl font-semibold text-[#1f1f1f]">Loading your account dashboard</p>
              <p className="mt-2 text-sm text-[#6b7280]">Preparing your profile, orders, wishlist, and saved details.</p>
            </div>
          </div>
        </section>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <section className="account-page section">
        <div className="account-shell">
          <header className="account-hero">
            <div className="account-hero-grid">
              <div>
                <div className="flex flex-wrap items-center gap-4">
                  <div className="account-avatar">{getInitials(profileName)}</div>
                  <div>
                    <p className="account-kicker">Maison Member</p>
                    <h1 className="account-title">{profileName}</h1>
                    <p className="account-subtitle">{profileEmail}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="account-pill account-pill--gold">Maison Member</span>
                      <span className="account-pill account-pill--neutral">{orders.length} Orders</span>
                      <span className="account-pill account-pill--neutral">{wishlistItems.length} Saved</span>
                    </div>
                  </div>
                </div>

                <div className="account-button-row mt-6">
                  <Button className="account-primary-btn" onClick={() => navigateToTab('profile')} aria-label="Edit profile details">
                    Edit Profile
                  </Button>
                  <Button className="account-secondary-btn" onClick={() => navigateToTab('wishlist')} aria-label="View wishlist">
                    View Wishlist
                  </Button>
                  <Button className="account-danger-btn" onClick={confirmLogout} aria-label="Logout of your account">
                    Logout
                  </Button>
                </div>
              </div>

              <div className="account-summary-grid">
                <div className="account-summary-item">
                  <p className="account-summary-label">Member Since</p>
                  <p className="account-summary-value">{memberSince}</p>
                </div>
                <div className="account-summary-item">
                  <p className="account-summary-label">Wishlist</p>
                  <p className="account-summary-value">{wishlistItems.length.toLocaleString('en-IN')} pieces</p>
                </div>
                <div className="account-summary-item">
                  <p className="account-summary-label">Addresses</p>
                  <p className="account-summary-value">{addresses.length.toLocaleString('en-IN')} saved</p>
                </div>
                <div className="account-summary-item">
                  <p className="account-summary-label">Concierge</p>
                  <p className="account-summary-value">Premium support</p>
                </div>
              </div>
            </div>
          </header>

          <div className="account-layout">
            <aside className="account-sidebar">
              <div className="account-panel">
                <div className="account-nav-grid">
                  {navItems.map((item) => {
                    const Icon = item.icon;

                    return (
                      <button
                        key={item.key}
                        type="button"
                        onClick={() => (item.key === 'logout' ? confirmLogout() : navigateToTab(item.key))}
                        className={`account-nav-card ${activeTab === item.key ? 'is-active' : ''}`}
                        aria-label={item.label}
                      >
                        <div className="flex items-start gap-3">
                          <span className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#faf4e7] text-[#c6a769]">
                            <Icon className="h-4.5 w-4.5" />
                          </span>
                          <div>
                            <p className="account-nav-label">{item.label}</p>
                            <p className="account-nav-description">{item.description}</p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </aside>

            <div className="account-panel">
              {activeTab === 'profile' && (
                <div className="account-form-grid">
                  <div className="account-section-header">
                    <div>
                      <p className="account-section-kicker">Profile details</p>
                      <h2 className="account-section-title">Personal Information</h2>
                      <p className="account-section-subtitle">Update your name, email, and contact number. Addresses are managed separately for clarity.</p>
                    </div>
                  </div>

                  {sectionErrors.profile ? (
                    <Alert type="warning" showIcon message="Profile unavailable" description={sectionErrors.profile} />
                  ) : null}

                  <div className="grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
                    <div className="account-form-card">
                      <Form form={profileForm} layout="vertical" onFinish={handleProfileSave} size="large">
                        <div className="account-mini-grid">
                          <Form.Item name="fullName" label="Full Name" rules={[{ required: true, message: 'Name is required' }]}>
                            <input className="account-text-input" placeholder="Enter your full name" />
                          </Form.Item>
                          <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Email is required' }]}>
                            <input className="account-text-input" type="email" placeholder="Enter your email" />
                          </Form.Item>
                        </div>

                        <Form.Item name="phone" label="Phone Number">
                          <input className="account-text-input" placeholder="Enter your phone number" />
                        </Form.Item>

                        <div className="account-button-row">
                          <Button type="primary" htmlType="submit" loading={isSavingProfile} className="account-primary-btn" aria-label="Save profile changes">
                            Save Changes
                          </Button>
                          <Button className="account-secondary-btn" onClick={resetProfileForm} aria-label="Reset profile changes">
                            Reset
                          </Button>
                        </div>
                      </Form>
                    </div>

                    <div className="account-info-card">
                      <p className="account-section-kicker">Maison profile</p>
                      <h3 className="account-section-title">Your concierge snapshot</h3>
                      <div className="account-divider" />
                      <div className="space-y-4">
                        <div className="account-summary-item">
                          <p className="account-summary-label">Membership</p>
                          <p className="account-summary-value">Maison Member</p>
                        </div>
                        <div className="account-summary-item">
                          <p className="account-summary-label">Primary Email</p>
                          <p className="account-summary-value">{profileEmail}</p>
                        </div>
                        <div className="account-summary-item">
                          <p className="account-summary-label">Primary Address</p>
                          <p className="account-summary-value">
                            {primaryAddress
                              ? `${primaryAddress.fullName || profileName}, ${primaryAddress.addressLine1 || ''}${primaryAddress.addressLine2 ? `, ${primaryAddress.addressLine2}` : ''}`
                              : 'Manage saved addresses for delivery details.'}
                          </p>
                        </div>
                        <div className="account-summary-item">
                          <p className="account-summary-label">Security</p>
                          <p className="account-summary-value">Secure account access enabled</p>
                        </div>
                      </div>

                      <div className="account-button-row mt-5">
                        <Button className="account-secondary-btn" onClick={() => navigateToTab('addresses')} aria-label="Manage saved addresses">
                          Manage Addresses
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'orders' && (
                <div className="account-form-grid">
                  <div className="account-section-header">
                    <div>
                      <p className="account-section-kicker">Order history</p>
                      <h2 className="account-section-title">My Orders</h2>
                      <p className="account-section-subtitle">Recent purchases displayed as elegant cards with status, totals, and quick access to details.</p>
                    </div>
                  </div>

                  {sectionErrors.orders ? (
                    <Alert type="warning" showIcon message="Orders unavailable" description={sectionErrors.orders} />
                  ) : null}

                  {orders.length === 0 ? (
                    <div className="account-empty-card text-center">
                      <div className="account-empty-icon mx-auto">
                        <Package className="h-8 w-8" />
                      </div>
                      <h3 className="account-section-title text-center">No orders yet</h3>
                      <p className="account-subtitle mx-auto max-w-2xl text-center">Start shopping to see your first order history here.</p>
                      <div className="account-button-row justify-center mt-6">
                        <Link to="/shop">
                          <Button type="primary" className="account-primary-btn" aria-label="Browse the collection">
                            Browse Collection
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div className="account-order-grid">
                      {orders.map((order) => (
                        <article key={order.id} className="account-order-card">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <p className="account-section-kicker">Order</p>
                              <h3 className="account-section-title">{order.orderId}</h3>
                              <p className="account-section-subtitle">{formatDate(order?.date || order?.createdAt || order?.orderDate || order?.updatedAt || order?.deliveryDate)}</p>
                            </div>
                            <StatusBadge status={order.status} />
                          </div>

                          <div className="account-divider" />

                          <div className="account-stat-grid">
                            <div className="account-summary-item">
                              <p className="account-summary-label">Total</p>
                              <p className="account-summary-value">{formatPrice(order.total)}</p>
                            </div>
                            <div className="account-summary-item">
                              <p className="account-summary-label">Payment</p>
                              <p className="account-summary-value"><StatusBadge status={order.paymentStatus} type="payment" /></p>
                            </div>
                          </div>

                          <div className="account-order-actions">
                            <Button className="account-primary-btn" onClick={() => handleViewOrderDetails(order)} aria-label={`View details for order ${order.orderId}`}>
                              View Details
                            </Button>
                            {canCancelOrder(order) ? (
                              <Button className="account-danger-btn" onClick={() => openCancelOrderModal(order)} aria-label={`Cancel order ${order.orderId}`}>
                                Cancel Order
                              </Button>
                            ) : null}
                          </div>
                        </article>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'wishlist' && (
                <div className="account-form-grid">
                  <div className="account-section-header">
                    <div>
                      <p className="account-section-kicker">Wishlist preview</p>
                      <h2 className="account-section-title">Saved Pieces</h2>
                      <p className="account-section-subtitle">A quick preview of the jewelry you have saved for later.</p>
                    </div>
                    <Button className="account-secondary-btn" onClick={() => navigateToTab('wishlist')} aria-label="View your wishlist">
                      View Wishlist
                    </Button>
                  </div>

                  {sectionErrors.wishlist ? (
                    <Alert type="warning" showIcon message="Wishlist unavailable" description={sectionErrors.wishlist} />
                  ) : null}

                  {wishlistItems.length === 0 ? (
                    <div className="account-empty-card text-center">
                      <div className="account-empty-icon mx-auto">
                        <Heart className="h-8 w-8" />
                      </div>
                      <h3 className="account-section-title text-center">Your wishlist is empty</h3>
                      <p className="account-subtitle mx-auto max-w-2xl text-center">Save your favourite jewelry pieces and return to them whenever you are ready.</p>
                      <div className="account-button-row justify-center mt-6">
                        <Link to="/shop">
                          <Button type="primary" className="account-primary-btn" aria-label="Continue shopping">
                            Continue Shopping
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="account-preview-grid">
                        {wishlistItems.slice(0, 3).map((item) => (
                          <article key={item.productId} className="account-preview-card">
                            <div className="flex gap-4">
                              <div className="h-24 w-20 overflow-hidden rounded-2xl bg-[#f3ede2]">
                                <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="account-section-kicker">{item.category}</p>
                                <h3 className="account-section-title truncate">{item.name}</h3>
                                <p className="mt-2 text-sm font-semibold text-[#c6a769]">
                                  {formatPrice(item.price)}
                                </p>
                                {item.originalPrice > item.price ? (
                                  <p className="text-xs text-[#8b8b8b] line-through">{formatPrice(item.originalPrice)}</p>
                                ) : null}
                              </div>
                            </div>
                          </article>
                        ))}
                      </div>

                      <div className="account-button-row">
                        <Button className="account-primary-btn" onClick={() => navigateToTab('wishlist')} aria-label="Open the full wishlist">
                          View Wishlist
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              )}

              {activeTab === 'addresses' && (
                <div className="account-form-grid">
                  <div className="account-section-header">
                    <div>
                      <p className="account-section-kicker">Saved addresses</p>
                      <h2 className="account-section-title">Addresses</h2>
                      <p className="account-section-subtitle">Manage delivery details for premium checkout and gifting.</p>
                    </div>
                    <Button className="account-primary-btn" onClick={() => openAddressModal()} aria-label="Add a new address">
                      Add New Address
                    </Button>
                  </div>

                  {sectionErrors.addresses ? (
                    <Alert type="warning" showIcon message="Addresses unavailable" description={sectionErrors.addresses} />
                  ) : null}

                  {addresses.length === 0 ? (
                    <div className="account-empty-card text-center">
                      <div className="account-empty-icon mx-auto">
                        <MapPin className="h-8 w-8" />
                      </div>
                      <h3 className="account-section-title text-center">No saved addresses yet</h3>
                      <p className="account-subtitle mx-auto max-w-2xl text-center">Add your first address to speed up checkout and gifting.</p>
                      <div className="account-button-row justify-center mt-6">
                        <Button className="account-primary-btn" onClick={() => openAddressModal()} aria-label="Add your first address">
                          Add Address
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="account-address-grid">
                      {addresses.map((address) => (
                        <article key={address.id} className="account-address-card relative">
                          {address.isDefault ? (
                            <span className="account-badge account-badge--gold absolute right-4 top-4">Default</span>
                          ) : null}
                          <p className="account-section-kicker">{address.fullName}</p>
                          <h3 className="account-section-title">{address.city}, {address.state}</h3>
                          <p className="account-section-subtitle">
                            {address.addressLine1}
                            {address.addressLine2 ? `, ${address.addressLine2}` : ''}
                            {address.postalCode ? ` • ${address.postalCode}` : ''}
                          </p>
                          <div className="mt-4 space-y-1 text-sm text-[#6b7280]">
                            <p>{address.phone}</p>
                            <p>{address.country || 'India'}</p>
                          </div>
                          <div className="account-address-actions">
                            <Button className="account-secondary-btn" onClick={() => openAddressModal(address)} aria-label={`Edit address for ${address.fullName}`}>
                              Edit
                            </Button>
                            <Button className="account-danger-btn" onClick={() => handleAddressDelete(address.id)} aria-label={`Delete address for ${address.fullName}`}>
                              Delete
                            </Button>
                          </div>
                        </article>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'payments' && (
                <div className="account-form-grid">
                  <div className="account-section-header">
                    <div>
                      <p className="account-section-kicker">Payments</p>
                      <h2 className="account-section-title">Payment History</h2>
                      <p className="account-section-subtitle">A curated overview of recent payment statuses and order totals.</p>
                    </div>
                  </div>

                  <div className="account-payment-grid">
                    {orders.length === 0 ? (
                      <div className="account-empty-card text-center">
                        <div className="account-empty-icon mx-auto">
                          <CreditCard className="h-8 w-8" />
                        </div>
                        <h3 className="account-section-title text-center">No payment records yet</h3>
                        <p className="account-subtitle mx-auto max-w-2xl text-center">Your payment history will appear here once you place an order.</p>
                      </div>
                    ) : (
                      orders.slice(0, 3).map((order) => (
                        <article key={order.id} className="account-payment-card">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="account-section-kicker">{order.orderId}</p>
                              <h3 className="account-section-title">{formatPrice(order.total)}</h3>
                              <p className="account-section-subtitle">{formatDate(order?.date || order?.createdAt || order?.orderDate || order?.updatedAt || order?.deliveryDate)}</p>
                            </div>
                            <StatusBadge status={order.paymentStatus} type="payment" />
                          </div>
                          <div className="account-divider" />
                          <p className="text-sm leading-7 text-[#6b7280]">
                            Payment status is synced from your order history, keeping the dashboard clean and readable.
                          </p>
                        </article>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Modal
        title={editingAddressId ? 'Edit Address' : 'Add New Address'}
        open={isAddressModalOpen}
        onOk={handleAddressSave}
        onCancel={() => setIsAddressModalOpen(false)}
        okText="Save Address"
        okButtonProps={{ className: 'account-primary-btn' }}
        className="account-modal-card"
      >
        <Form form={addressForm} layout="vertical" className="mt-4">
          <Form.Item name="fullName" label="Full Name" rules={[{ required: true, message: 'Full name is required' }]}>
            <input className="account-text-input" />
          </Form.Item>
          <Form.Item name="phone" label="Phone" rules={[{ required: true, message: 'Phone is required' }]}>
            <input className="account-text-input" />
          </Form.Item>
          <Form.Item name="addressLine1" label="Address Line 1" rules={[{ required: true, message: 'Address is required' }]}>
            <input className="account-text-input" />
          </Form.Item>
          <Form.Item name="addressLine2" label="Address Line 2 (Optional)">
            <input className="account-text-input" />
          </Form.Item>
          <Row gutter={12}>
            <Col span={8}>
              <Form.Item name="city" label="City" rules={[{ required: true, message: 'Required' }]}>
                <input className="account-text-input" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="state" label="State" rules={[{ required: true, message: 'Required' }]}>
                <input className="account-text-input" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="postalCode" label="PIN Code" rules={[{ required: true, message: 'Required' }]}>
                <input className="account-text-input" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="country" label="Country">
            <input className="account-text-input" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Cancel Order"
        open={isCancelModalOpen}
        onOk={handleCancelOrder}
        onCancel={() => {
          setIsCancelModalOpen(false);
          setSelectedOrderForCancel(null);
          setCancelReason('');
        }}
        okText={isCancellingOrder ? 'Cancelling...' : 'Confirm Cancel'}
        okButtonProps={{
          danger: true,
          loading: isCancellingOrder,
          disabled: isCancellingOrder,
        }}
      >
        <p className="text-sm text-[#6b7280] mb-3">
          You are cancelling order <span className="font-semibold text-[#1f1f1f]">{selectedOrderForCancel?.orderId}</span>.
        </p>
        <Input.TextArea
          rows={4}
          value={cancelReason}
          onChange={(e) => setCancelReason(e.target.value)}
          placeholder="Reason for cancellation (optional)"
          maxLength={200}
          showCount
        />
      </Modal>

      <Modal
        title={selectedOrderDetails?.orderNumber || selectedOrderDetails?.orderId || 'Order Details'}
        open={orderDetailOpen}
        onCancel={() => setOrderDetailOpen(false)}
        footer={null}
        className="account-modal-card"
      >
        {orderDetailLoading ? (
          <div className="py-10 text-center">
            <Spin />
          </div>
        ) : orderDetailError ? (
          <Alert type="error" showIcon message="Unable to load order details" description={orderDetailError} />
        ) : (
          <div className="account-form-grid">
            <div className="account-summary-item">
              <p className="account-summary-label">Order ID</p>
              <p className="account-summary-value">{selectedOrderDetails?.orderNumber || selectedOrderDetails?.orderId || '-'}</p>
            </div>
            <div className="account-summary-item">
              <p className="account-summary-label">Date</p>
              <p className="account-summary-value">{formatDate(selectedOrderDetails?.createdAt || selectedOrderDetails?.date || selectedOrderDetails?.orderDate || selectedOrderDetails?.updatedAt || selectedOrderDetails?.deliveryDate)}</p>
            </div>
            <div className="account-summary-item">
              <p className="account-summary-label">Status</p>
              <p className="account-summary-value"><StatusBadge status={selectedOrderDetails?.orderStatus || selectedOrderDetails?.status} /></p>
            </div>
            <div className="account-summary-item">
              <p className="account-summary-label">Total</p>
              <p className="account-summary-value">{formatPrice(Number(selectedOrderDetails?.finalAmount ?? selectedOrderDetails?.totalAmount ?? 0))}</p>
            </div>
            <div className="account-summary-item">
              <p className="account-summary-label">Payment</p>
              <p className="account-summary-value"><StatusBadge status={selectedOrderDetails?.paymentStatus} type="payment" /></p>
            </div>
          </div>
        )}
      </Modal>
    </MainLayout>
  );
};

export default AccountPage;
