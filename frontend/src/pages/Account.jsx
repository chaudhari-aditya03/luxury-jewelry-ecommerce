import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import ProtectedRoute from '../routes/ProtectedRoute';
import MainLayout from '../layouts/MainLayout';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Alert from '../components/common/Alert';
import { formatPrice, formatDate } from '../utils/helpers';

const AccountPage = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [editMode, setEditMode] = useState(false);

  // Dummy user orders
  const orders = [
    {
      id: 1,
      orderId: 'ORD-2024-001234',
      date: '2024-01-15',
      total: 95000,
      status: 'delivered',
      items: 3,
    },
    {
      id: 2,
      orderId: 'ORD-2024-001235',
      date: '2024-01-10',
      total: 45000,
      status: 'processing',
      items: 1,
    },
  ];

  // Dummy addresses
  const addresses = [
    {
      id: 1,
      type: 'Home',
      address: '123 Main Street',
      city: 'Delhi',
      state: 'Delhi',
      pincode: '110001',
      isDefault: true,
    },
  ];

  // Dummy wishlist
  const wishlist = [
    {
      id: 1,
      name: 'Diamond Ring',
      price: 45000,
      image: 'https://via.placeholder.com/150x150?text=Ring',
    },
    {
      id: 2,
      name: 'Gold Necklace',
      price: 25000,
      image: 'https://via.placeholder.com/150x150?text=Necklace',
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return 'text-green-600';
      case 'processing':
        return 'text-yellow-600';
      case 'pending':
        return 'text-gray-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <MainLayout>
      <div className="section">
        <div className="container-custom">
          <h1 className="text-4xl font-bold mb-8">My Account</h1>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:sticky lg:top-24 h-max">
              <div className="card divide-y divide-gray-200 dark:divide-gray-700">
                {[
                  { id: 'profile', label: 'Profile' },
                  { id: 'orders', label: 'My Orders' },
                  { id: 'addresses', label: 'Saved Addresses' },
                  { id: 'wishlist', label: 'Wishlist' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full text-left px-6 py-4 transition-colors ${
                      activeTab === tab.id
                        ? 'bg-rose-gold-50 dark:bg-rose-gold-900/20 text-rose-gold-500 font-medium'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
                <button
                  onClick={logout}
                  className="w-full text-left px-6 py-4 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="lg:col-span-3">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className="card p-8">
                  <h2 className="text-2xl font-bold mb-6 flex items-center justify-between">
                    <span>Profile Information</span>
                    <button
                      onClick={() => setEditMode(!editMode)}
                      className="text-sm text-rose-gold-500 hover:text-rose-gold-600 font-medium"
                    >
                      {editMode ? 'Cancel' : 'Edit'}
                    </button>
                  </h2>

                  <div className="space-y-6">
                    {editMode ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <Input label="First Name" defaultValue={user?.firstName} />
                          <Input label="Last Name" defaultValue={user?.lastName} />
                        </div>
                        <Input label="Email" type="email" defaultValue={user?.email} disabled />
                        <Input label="Phone" defaultValue={user?.phone} />
                        <Button variant="primary">Save Changes</Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Name</p>
                          <p className="font-medium">
                            {user?.firstName} {user?.lastName}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
                          <p className="font-medium">{user?.email}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Phone</p>
                          <p className="font-medium">{user?.phone}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Member Since
                          </p>
                          <p className="font-medium">{formatDate(user?.createdAt)}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Orders Tab */}
              {activeTab === 'orders' && (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="card p-6">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Order ID</p>
                          <p className="font-bold">{order.orderId}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Date</p>
                          <p className="font-medium">{formatDate(order.date)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Amount</p>
                          <p className="font-bold text-rose-gold-500">{formatPrice(order.total)}</p>
                        </div>
                        <div className="flex items-center justify-between md:justify-end gap-4">
                          <span className={`font-medium capitalize ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                          <Button variant="secondary" size="sm">
                            View
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Addresses Tab */}
              {activeTab === 'addresses' && (
                <div className="space-y-4">
                  {addresses.map((addr) => (
                    <div key={addr.id} className="card p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <p className="font-bold text-lg">{addr.type}</p>
                          {addr.isDefault && (
                            <span className="inline-block mt-1 px-2 py-1 bg-rose-gold-50 dark:bg-rose-gold-900/20 text-rose-gold-600 text-xs rounded">
                              Default
                            </span>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button variant="secondary" size="sm">
                            Edit
                          </Button>
                          <Button variant="secondary" size="sm">
                            Delete
                          </Button>
                        </div>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400">{addr.address}</p>
                      <p className="text-gray-600 dark:text-gray-400">
                        {addr.city}, {addr.state} {addr.pincode}
                      </p>
                    </div>
                  ))}
                  <Button variant="outline">Add New Address</Button>
                </div>
              )}

              {/* Wishlist Tab */}
              {activeTab === 'wishlist' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {wishlist.map((product) => (
                    <div key={product.id} className="card overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-40 object-cover"
                      />
                      <div className="p-4">
                        <h3 className="font-bold mb-2">{product.name}</h3>
                        <p className="text-rose-gold-500 font-bold mb-4">
                          {formatPrice(product.price)}
                        </p>
                        <Button variant="primary" size="sm" className="w-full">
                          Add to Cart
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default AccountPage;
