import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { TrashIcon } from '@heroicons/react/24/outline';
import MainLayout from '../layouts/MainLayout';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Alert from '../components/common/Alert';
import { formatPrice } from '../utils/helpers';

const CartPage = () => {
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  // Dummy cart items
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: 'Diamond Ring',
      price: 45000,
      quantity: 1,
      image: 'https://via.placeholder.com/100x100?text=Ring',
    },
    {
      id: 2,
      name: 'Gold Necklace',
      price: 25000,
      quantity: 2,
      image: 'https://via.placeholder.com/100x100?text=Necklace',
    },
  ]);

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discount = appliedCoupon ? (subtotal * 0.1) : 0;
  const shipping = subtotal > 5000 ? 0 : 200;
  const total = subtotal - discount + shipping;

  const handleApplyCoupon = () => {
    if (couponCode.toUpperCase() === 'SAVE10') {
      setAppliedCoupon({ code: couponCode, discount: 10 });
    }
  };

  const handleRemoveItem = (id) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const handleUpdateQuantity = (id, newQuantity) => {
    if (newQuantity <= 0) return;
    setCartItems(
      cartItems.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  if (cartItems.length === 0) {
    return (
      <MainLayout>
        <div className="section">
          <div className="container-custom text-center">
            <h1 className="text-4xl font-bold mb-4">Your Cart is Empty</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Continue shopping to add items to your cart
            </p>
            <Link to="/shop">
              <Button size="lg">Continue Shopping</Button>
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="section">
        <div className="container-custom">
          <h1 className="text-4xl font-bold mb-8">Shopping Cart</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="card p-6 flex gap-6">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-2">{item.name}</h3>
                      <p className="text-rose-gold-500 font-bold mb-4">
                        {formatPrice(item.price)}
                      </p>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() =>
                            handleUpdateQuantity(item.id, item.quantity - 1)
                          }
                          className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                        >
                          −
                        </button>
                        <span className="px-4 py-1 bg-gray-100 dark:bg-gray-700 rounded">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            handleUpdateQuantity(item.id, item.quantity + 1)
                          }
                          className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="text-right space-y-4">
                      <p className="font-bold text-lg">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-red-600 hover:text-red-700 transition-colors"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <Link to="/shop" className="text-rose-gold-500 hover:text-rose-gold-600 mt-6 inline-block">
                ← Continue Shopping
              </Link>
            </div>

            {/* Order Summary */}
            <div className="lg:sticky lg:top-24 h-max">
              <div className="card p-6 space-y-6">
                <h2 className="font-bold text-xl">Order Summary</h2>

                {appliedCoupon && (
                  <Alert
                    type="success"
                    message={`Coupon ${appliedCoupon.code} applied! Save {appliedCoupon.discount}%`}
                    closeable
                    onClose={() => setAppliedCoupon(null)}
                  />
                )}

                {/* Coupon */}
                <div>
                  <label className="block text-sm font-bold mb-2">Coupon Code</label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter coupon"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                    />
                    <Button
                      variant="secondary"
                      onClick={handleApplyCoupon}
                      disabled={!couponCode || appliedCoupon}
                    >
                      Apply
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Tip: Try "SAVE10"</p>
                </div>

                {/* Price Details */}
                <div className="space-y-3 border-t border-gray-200 dark:border-gray-700 pt-6">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount ({appliedCoupon?.discount}%)</span>
                      <span>-{formatPrice(discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>
                      {shipping === 0 ? (
                        <span className="text-green-600">FREE</span>
                      ) : (
                        formatPrice(shipping)
                      )}
                    </span>
                  </div>
                  {shipping > 0 && (
                    <p className="text-xs text-gray-500">
                      Free shipping on orders above ₹5,000
                    </p>
                  )}
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-3 flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>

                {/* Checkout */}
                <Link to="/checkout" className="block">
                  <Button variant="primary" size="lg" className="w-full">
                    Proceed to Checkout
                  </Button>
                </Link>

                <button className="w-full py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CartPage;
