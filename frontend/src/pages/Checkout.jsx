import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import MainLayout from '../layouts/MainLayout';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import RadioGroup from '../components/common/RadioGroup';
import Alert from '../components/common/Alert';
import { formatPrice } from '../utils/helpers';
import { validatePhone } from '../utils/helpers';

const CheckoutPage = () => {
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      pincode: '',
    },
  });

  // Dummy order data
  const cartTotal = 95000;
  const shipping = 0;
  const total = cartTotal + shipping;

  const onSubmit = async (data) => {
    // Simulate order placement
    console.log('Order data:', { ...data, paymentMethod });
    setOrderPlaced(true);
  };

  if (orderPlaced) {
    return (
      <MainLayout>
        <div className="section">
          <div className="container-custom max-w-2xl text-center">
            <div className="card p-12 space-y-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h1 className="text-4xl font-bold">Order Confirmed!</h1>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                Thank you for your purchase. Your order has been placed successfully.
              </p>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 space-y-2 text-left">
                <p>
                  <strong>Order ID:</strong> ORD-2024-001234
                </p>
                <p>
                  <strong>Total Amount:</strong> {formatPrice(total)}
                </p>
                <p>
                  <strong>Estimated Delivery:</strong> 3-5 business days
                </p>
              </div>
              <Button size="lg" onClick={() => navigate('/account/orders')}>
                View My Orders
              </Button>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="section">
        <div className="container-custom max-w-4xl">
          <h1 className="text-4xl font-bold mb-8">Checkout</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                {/* Shipping Address */}
                <div className="card p-6">
                  <h2 className="text-xl font-bold mb-6">Shipping Address</h2>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="First Name"
                        error={errors.firstName?.message}
                        {...register('firstName', { required: 'Required' })}
                      />
                      <Input
                        label="Last Name"
                        error={errors.lastName?.message}
                        {...register('lastName', { required: 'Required' })}
                      />
                    </div>
                    <Input
                      label="Email"
                      type="email"
                      error={errors.email?.message}
                      {...register('email', { required: 'Required' })}
                    />
                    <Input
                      label="Phone"
                      error={errors.phone?.message}
                      {...register('phone', {
                        required: 'Required',
                        validate: (v) => validatePhone(v) || 'Invalid phone',
                      })}
                    />
                    <Input
                      label="Address"
                      error={errors.address?.message}
                      {...register('address', { required: 'Required' })}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="City"
                        error={errors.city?.message}
                        {...register('city', { required: 'Required' })}
                      />
                      <Input
                        label="State"
                        error={errors.state?.message}
                        {...register('state', { required: 'Required' })}
                      />
                    </div>
                    <Input
                      label="Pincode"
                      error={errors.pincode?.message}
                      {...register('pincode', { required: 'Required' })}
                    />
                  </div>
                </div>

                {/* Payment Method */}
                <div className="card p-6">
                  <h2 className="text-xl font-bold mb-6">Payment Method</h2>
                  <div className="space-y-3">
                    {[
                      { id: 'upi', label: 'UPI (Recommended)' },
                      { id: 'card', label: 'Debit/Credit Card' },
                      { id: 'cod', label: 'Cash on Delivery' },
                    ].map((method) => (
                      <label key={method.id} className="flex items-center gap-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-rose-gold-50 dark:hover:bg-rose-gold-900/10 transition-colors">
                        <input
                          type="radio"
                          name="payment"
                          value={method.id}
                          checked={paymentMethod === method.id}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="w-4 h-4 text-rose-gold-500"
                        />
                        <span className="font-medium">{method.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Terms */}
                <label className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <input type="checkbox" className="mt-1" required />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    I agree to the terms and conditions and have read the privacy policy
                  </span>
                </label>

                <Button type="submit" variant="primary" size="lg" className="w-full">
                  Place Order
                </Button>
              </form>
            </div>

            {/* Order Summary */}
            <div className="lg:sticky lg:top-24 h-max">
              <div className="card p-6 space-y-6">
                <h2 className="font-bold text-xl">Order Summary</h2>

                {/* Items */}
                <div className="space-y-3 border-b border-gray-200 dark:border-gray-700 pb-6">
                  <div className="flex justify-between text-sm">
                    <span>Diamond Ring x1</span>
                    <span>{formatPrice(45000)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Gold Necklace x2</span>
                    <span>{formatPrice(50000)}</span>
                  </div>
                </div>

                {/* Totals */}
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatPrice(cartTotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="text-green-600">FREE</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t border-gray-200 dark:border-gray-700 pt-3">
                    <span>Total</span>
                    <span className="text-rose-gold-500">{formatPrice(total)}</span>
                  </div>
                </div>

                {/* Trust Badges */}
                <Alert
                  type="info"
                  message="Your payment is secure and encrypted"
                  closeable={false}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CheckoutPage;
