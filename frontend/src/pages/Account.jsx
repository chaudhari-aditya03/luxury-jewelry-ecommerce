import React, { useEffect, useState } from 'react';
import {
  Table, Tag, Form, Input, Row, Col, Modal, message, Spin
} from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import { useAuth } from '../context/AuthContext';
import { formatPrice, formatDate } from '../utils/helpers';
import { orderService, userService } from '../services';

const AccountPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [profileForm] = Form.useForm();
  const [addressForm] = Form.useForm();
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [selectedOrderForCancel, setSelectedOrderForCancel] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [isCancellingOrder, setIsCancellingOrder] = useState(false);

  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [sectionErrors, setSectionErrors] = useState({});

  // Determine active tab from URL
  const getTabFromPath = () => {
    if (location.pathname.includes('/account/orders')) return 'orders';
    if (location.pathname.includes('/account/addresses')) return 'addresses';
    if (location.pathname.includes('/account/wishlist')) return 'wishlist';
    return 'profile';
  };
  const [activeTab, setActiveTab] = useState(getTabFromPath());

  useEffect(() => {
    setActiveTab(getTabFromPath());
  }, [location.pathname]);

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

      const nextErrors = {};

      if (profileRes.status === 'fulfilled') {
        const profileData = profileRes.value.data?.data;
        setProfile(profileData);
        profileForm.setFieldsValue({
          fullName: profileData?.fullName || user?.fullName,
          email: profileData?.email || user?.email,
          phone: profileData?.phone,
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
        setWishlistItems(wishlistRes.value.data?.data || []);
      } else {
        nextErrors.wishlist = wishlistRes.reason?.response?.data?.message || 'Failed to load wishlist';
        setWishlistItems([]);
      }

      setSectionErrors(nextErrors);

      if (Object.keys(nextErrors).length > 0) {
        message.warning('Some account sections could not be loaded. The available sections are shown.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAccountData();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleProfileSave = async (values) => {
    setIsSavingProfile(true);
    try {
      const response = await userService.updateProfile(values);
      setProfile(response.data?.data);
      message.success('Profile updated successfully');
      setEditMode(false);
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsSavingProfile(false);
    }
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
      fetchAccountData();
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

  const canCancelOrder = (order) => (
    !['CANCELLED', 'DELIVERED', 'RETURNED'].includes(order?.status)
  );

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
        cancelReason.trim() || 'Cancelled by customer from account page'
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

  const orderColumns = [
    {
      title: 'Order ID',
      dataIndex: 'orderId',
      key: 'orderId',
      render: text => <span className="font-mono text-sm font-semibold text-gray-800">{text}</span>
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: text => <span className="text-gray-600 text-sm">{formatDate(text)}</span>
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      render: text => <span className="font-semibold text-gray-900">{formatPrice(text)}</span>
    },
    {
      title: 'Order Status',
      dataIndex: 'status',
      key: 'status',
      render: status => {
        const map = {
          DELIVERED: { color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0', label: 'Delivered' },
          PROCESSING: { color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe', label: 'Processing' },
          PLACED: { color: '#d97706', bg: '#fffbeb', border: '#fde68a', label: 'Placed' },
          SHIPPED: { color: '#7c3aed', bg: '#f5f3ff', border: '#ddd6fe', label: 'Shipped' },
          CANCELLED: { color: '#dc2626', bg: '#fef2f2', border: '#fecaca', label: 'Cancelled' },
          RETURNED: { color: '#dc2626', bg: '#fef2f2', border: '#fecaca', label: 'Returned' },
        };
        const s = map[status] || { color: '#6b7280', bg: '#f9fafb', border: '#e5e7eb', label: status };
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
            style={{ color: s.color, background: s.bg, border: `1px solid ${s.border}` }}>
            {s.label}
          </span>
        );
      }
    },
    {
      title: 'Payment',
      dataIndex: 'paymentStatus',
      key: 'paymentStatus',
      render: status => {
        const map = {
          PAID: { color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0' },
          PENDING: { color: '#d97706', bg: '#fffbeb', border: '#fde68a' },
          FAILED: { color: '#dc2626', bg: '#fef2f2', border: '#fecaca' },
          REFUNDED: { color: '#6b7280', bg: '#f9fafb', border: '#e5e7eb' },
        };
        const s = map[status] || map['PENDING'];
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
            style={{ color: s.color, background: s.bg, border: `1px solid ${s.border}` }}>
            {status || 'PENDING'}
          </span>
        );
      }
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        canCancelOrder(record) ? (
          <button
            onClick={() => openCancelOrderModal(record)}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-red-200 text-red-600 hover:bg-red-50"
          >
            Cancel Order
          </button>
        ) : (
          <span className="text-xs text-gray-400">Not available</span>
        )
      )
    },
  ];

  const navItems = [
    { key: 'profile', label: 'My Profile', icon: '👤' },
    { key: 'orders', label: 'My Orders', icon: '📦' },
    { key: 'addresses', label: 'Addresses', icon: '📍' },
    { key: 'wishlist', label: 'Wishlist', icon: '❤️' },
  ];

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center" style={{ minHeight: '70vh' }}>
          <div className="text-center">
            <Spin size="large" />
            <p className="mt-4 text-gray-500">Loading your account…</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen py-10" style={{ background: '#faf9f7' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Profile Header Card */}
          <div className="rounded-2xl p-6 mb-8 flex flex-col sm:flex-row items-center sm:items-start gap-6"
            style={{
              background: 'linear-gradient(145deg, #0f0f0f 0%, #1a1a1a 70%, #2a2010 100%)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
            }}>
            {/* Avatar */}
            <div className="w-20 h-20 rounded-full flex items-center justify-center text-3xl flex-shrink-0 font-bold text-white"
              style={{ background: 'linear-gradient(135deg, #D4AF37, #b8860b)' }}>
              {(profile?.fullName || user?.fullName || 'U')[0].toUpperCase()}
            </div>

            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-2xl font-bold text-white mb-1">
                {profile?.fullName || user?.fullName || 'User'}
              </h2>
              <p className="text-gray-400 mb-3">{profile?.email || user?.email}</p>
              <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold"
                  style={{ background: 'rgba(212,175,55,0.2)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.3)' }}>
                  💎 {profile?.role || 'MEMBER'}
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium text-gray-400 border border-gray-700">
                  📦 {orders.length} Orders
                </span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-red-400 border border-red-900 hover:bg-red-900/20 transition-colors"
            >
              <span>🚪</span> Logout
            </button>
          </div>

          {/* Main Layout */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar Nav */}
            <div className="lg:w-56 flex-shrink-0">
              <div className="bg-white rounded-2xl p-3 shadow-sm" style={{ border: '1px solid rgba(0,0,0,0.05)' }}>
                <nav className="space-y-1">
                  {navItems.map(item => (
                    <button
                      key={item.key}
                      onClick={() => setActiveTab(item.key)}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-150 text-left"
                      style={activeTab === item.key
                        ? { background: 'linear-gradient(135deg, rgba(212,175,55,0.12), rgba(184,134,11,0.08))', color: '#b8860b', borderLeft: '3px solid #D4AF37' }
                        : { color: '#4b5563' }}
                    >
                      <span className="text-lg">{item.icon}</span>
                      {item.label}
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 min-w-0">
              <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8" style={{ border: '1px solid rgba(0,0,0,0.05)' }}>

                {/* Profile Tab */}
                {activeTab === 'profile' && (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-gray-900">Personal Information</h3>
                      <button
                        onClick={() => setEditMode(!editMode)}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                        style={editMode
                          ? { background: '#f3f4f6', color: '#374151' }
                          : { background: 'rgba(212,175,55,0.1)', color: '#b8860b', border: '1px solid rgba(212,175,55,0.3)' }}>
                        {editMode ? '✕ Cancel' : '✏️ Edit Profile'}
                      </button>
                    </div>

                    {sectionErrors.profile && (
                      <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                        {sectionErrors.profile}
                      </div>
                    )}

                    {editMode ? (
                      <Form form={profileForm} layout="vertical" onFinish={handleProfileSave} size="large">
                        <Form.Item name="fullName" label="Full Name" rules={[{ required: true, message: 'Name is required' }]}>
                          <Input className="rounded-lg" />
                        </Form.Item>
                        <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Email is required' }]}>
                          <Input className="rounded-lg" />
                        </Form.Item>
                        <Form.Item name="phone" label="Phone">
                          <Input className="rounded-lg" />
                        </Form.Item>
                        <div className="flex gap-3">
                          <button type="button" onClick={() => setEditMode(false)}
                            className="px-5 py-2 rounded-lg border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50">
                            Cancel
                          </button>
                          <button type="submit"
                            disabled={isSavingProfile}
                            className="px-5 py-2 rounded-lg text-white text-sm font-semibold border-0 disabled:opacity-50"
                            style={{ background: 'linear-gradient(135deg, #D4AF37, #b8860b)' }}>
                            {isSavingProfile ? 'Saving…' : 'Save Changes'}
                          </button>
                        </div>
                      </Form>
                    ) : (
                      <div className="space-y-4">
                        {[
                          { label: 'Full Name', value: profile?.fullName, icon: '👤' },
                          { label: 'Email Address', value: profile?.email, icon: '✉️' },
                          { label: 'Phone Number', value: profile?.phone || 'Not provided', icon: '📱' },
                          { label: 'Member Since', value: profile?.createdAt ? formatDate(profile.createdAt) : '-', icon: '📅' },
                        ].map(row => (
                          <div key={row.label} className="flex items-center gap-4 p-4 rounded-xl"
                            style={{ background: '#faf9f7', border: '1px solid rgba(0,0,0,0.04)' }}>
                            <span className="text-xl">{row.icon}</span>
                            <div>
                              <p className="text-xs text-gray-400 font-medium mb-0.5">{row.label}</p>
                              <p className="text-gray-800 font-medium">{row.value || '-'}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Orders Tab */}
                {activeTab === 'orders' && (
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Order History</h3>
                    <div className="mb-5 rounded-xl border px-4 py-3 text-sm"
                      style={{ background: '#fffbeb', borderColor: '#fde68a', color: '#92400e' }}>
                      Need to cancel an order? Use the <span className="font-semibold">Cancel Order</span> button for eligible orders.
                    </div>
                    {sectionErrors.orders && (
                      <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                        {sectionErrors.orders}
                      </div>
                    )}
                    {orders.length === 0 ? (
                      <div className="text-center py-16">
                        <div className="text-5xl mb-4">📦</div>
                        <p className="text-gray-500 text-lg mb-2">No orders yet</p>
                        <p className="text-gray-400 text-sm mb-6">Start shopping to see your orders here.</p>
                        <a href="/shop" className="inline-flex items-center px-6 py-3 rounded-full text-white font-semibold no-underline"
                          style={{ background: 'linear-gradient(135deg, #D4AF37, #b8860b)' }}>
                          Browse Collection
                        </a>
                      </div>
                    ) : (
                      <div className="overflow-x-auto -mx-2">
                        <Table
                          columns={orderColumns}
                          dataSource={orders}
                          pagination={{ pageSize: 8 }}
                          size="small"
                          className="rounded-xl overflow-hidden"
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* Addresses Tab */}
                {activeTab === 'addresses' && (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-gray-900">Saved Addresses</h3>
                      <button
                        onClick={() => openAddressModal()}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white border-0"
                        style={{ background: 'linear-gradient(135deg, #D4AF37, #b8860b)' }}>
                        + Add New
                      </button>
                    </div>

                    {sectionErrors.addresses && (
                      <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                        {sectionErrors.addresses}
                      </div>
                    )}

                    {addresses.length === 0 ? (
                      <div className="text-center py-16">
                        <div className="text-5xl mb-4">📍</div>
                        <p className="text-gray-500 mb-4">No saved addresses yet</p>
                        <button onClick={() => openAddressModal()}
                          className="px-6 py-2.5 rounded-full text-white font-semibold border-0 text-sm"
                          style={{ background: 'linear-gradient(135deg, #D4AF37, #b8860b)' }}>
                          Add Your First Address
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {addresses.map(addr => (
                          <div key={addr.id} className="relative p-5 rounded-xl border"
                            style={{ border: addr.isDefault ? '1.5px solid #D4AF37' : '1px solid #e5e7eb', background: addr.isDefault ? 'rgba(212,175,55,0.03)' : '#fff' }}>
                            {addr.isDefault && (
                              <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-xs font-semibold"
                                style={{ background: 'rgba(212,175,55,0.12)', color: '#D4AF37' }}>
                                Default
                              </span>
                            )}
                            <p className="font-semibold text-gray-900 mb-1">{addr.fullName}</p>
                            <p className="text-gray-600 text-sm">
                              {addr.addressLine1}
                              {addr.addressLine2 ? `, ${addr.addressLine2}` : ''}, {addr.city}, {addr.state} – {addr.postalCode}
                            </p>
                            <p className="text-gray-400 text-sm mt-1">📱 {addr.phone}</p>
                            <div className="flex gap-3 mt-4">
                              <button onClick={() => openAddressModal(addr)}
                                className="text-xs font-medium px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50">
                                Edit
                              </button>
                              <button onClick={() => handleAddressDelete(addr.id)}
                                className="text-xs font-medium px-3 py-1.5 rounded-lg text-red-500 border border-red-200 hover:bg-red-50">
                                Delete
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Wishlist Tab */}
                {activeTab === 'wishlist' && (
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-6">My Wishlist</h3>
                    {sectionErrors.wishlist && (
                      <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                        {sectionErrors.wishlist}
                      </div>
                    )}
                    {wishlistItems.length === 0 ? (
                      <div className="text-center py-16">
                        <div className="text-5xl mb-4">❤️</div>
                        <p className="text-gray-500 mb-4">Your wishlist is empty</p>
                        <a href="/shop" className="inline-flex items-center px-6 py-3 rounded-full text-white font-semibold no-underline text-sm"
                          style={{ background: 'linear-gradient(135deg, #D4AF37, #b8860b)' }}>
                          Discover Jewelry
                        </a>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {wishlistItems.map((item, i) => (
                          <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-yellow-200 transition-colors">
                            <div>
                              <p className="font-semibold text-gray-900">{item.productName}</p>
                              <p className="text-sm text-gray-400">{formatPrice(Number(item.productPrice ?? 0))}</p>
                            </div>
                            <a href={`/product/${item.productId}`}
                              className="text-xs font-medium px-3 py-1.5 rounded-lg no-underline"
                              style={{ color: '#b8860b', background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.2)' }}>
                              View
                            </a>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Address Modal */}
      <Modal
        title={editingAddressId ? 'Edit Address' : 'Add New Address'}
        open={isAddressModalOpen}
        onOk={handleAddressSave}
        onCancel={() => setIsAddressModalOpen(false)}
        okText="Save Address"
        okButtonProps={{ style: { background: 'linear-gradient(135deg, #D4AF37, #b8860b)', border: 'none' } }}
      >
        <Form form={addressForm} layout="vertical" className="mt-4">
          <Form.Item name="fullName" label="Full Name" rules={[{ required: true, message: 'Full name is required' }]}>
            <Input className="rounded-lg" />
          </Form.Item>
          <Form.Item name="phone" label="Phone" rules={[{ required: true, message: 'Phone is required' }]}>
            <Input className="rounded-lg" />
          </Form.Item>
          <Form.Item name="addressLine1" label="Address Line 1" rules={[{ required: true, message: 'Address is required' }]}>
            <Input className="rounded-lg" />
          </Form.Item>
          <Form.Item name="addressLine2" label="Address Line 2 (Optional)">
            <Input className="rounded-lg" />
          </Form.Item>
          <Row gutter={12}>
            <Col span={8}>
              <Form.Item name="city" label="City" rules={[{ required: true, message: 'Required' }]}>
                <Input className="rounded-lg" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="state" label="State" rules={[{ required: true, message: 'Required' }]}>
                <Input className="rounded-lg" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="postalCode" label="PIN Code" rules={[{ required: true, message: 'Required' }]}>
                <Input className="rounded-lg" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="country" label="Country">
            <Input className="rounded-lg" />
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
        <p className="text-sm text-gray-600 mb-3">
          You are cancelling order <span className="font-semibold">{selectedOrderForCancel?.orderId}</span>.
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
    </MainLayout>
  );
};

export default AccountPage;
