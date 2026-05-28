import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Gift, ShieldCheck, Truck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const [loading, setLoading] = useState(false);
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const payload = {
        fullName: `${values.firstName} ${values.lastName}`.trim(),
        email: values.email,
        password: values.password,
        phone: values.phone,
      };
      await registerUser(payload);
      message.success('Account created! Welcome to LuxeJewels.');
      navigate('/shop');
    } catch (error) {
      const apiMessage = error?.response?.data?.message;
      const details = error?.response?.data?.error;
      if (!error?.response) {
        message.error('Cannot connect to server. Please check your connection.');
      } else {
        message.error(apiMessage || details || 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      <aside className="auth-brand-panel">
        <Link to="/" className="group flex items-center gap-3 no-underline">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-luxury text-white shadow-[0_10px_30px_rgba(17,17,17,0.15)] transition-transform duration-300 group-hover:scale-105">
            <Sparkles className="h-5 w-5 text-gold" />
          </div>
          <div>
            <p className="font-display text-xl font-semibold tracking-[0.14em] text-white">JEWELRY</p>
            <p className="text-[11px] uppercase tracking-[0.45em] text-white/60">Luxury Maison</p>
          </div>
        </Link>

        <div className="max-w-lg space-y-6">
          <p className="page-eyebrow text-white/70">Join the maison</p>
          <h2 className="font-display text-5xl font-semibold leading-tight text-white">
            Create your
            <span className="block text-gold">exclusive account.</span>
          </h2>
          <p className="max-w-md text-lg leading-8 text-white/72">
            Get early access to new collections, exclusive member discounts, and personalized jewelry recommendations.
          </p>
          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            {[
              { icon: Gift, text: 'Welcome discount on first order' },
              { icon: Truck, text: 'Free shipping on orders over ₹5,000' },
              { icon: ShieldCheck, text: 'Exclusive member-only collections' },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.text} className="flex items-center gap-3 rounded-[1.25rem] border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-md">
                  <Icon className="h-4 w-4 text-gold" />
                  <span className="text-sm text-white/85">{item.text}</span>
                </div>
              );
            })}
          </div>
        </div>

        <p className="text-sm text-white/45">50,000+ happy customers · Hallmark certified</p>
      </aside>

      <main className="auth-card">
        <div className="auth-card-panel">
          <div className="mb-8 lg:hidden">
            <Link to="/" className="inline-flex items-center gap-2 no-underline">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-luxury text-white">
                <Sparkles className="h-4 w-4 text-gold" />
              </div>
              <div>
                <p className="font-display text-lg font-semibold tracking-[0.12em] text-luxury">JEWELRY</p>
                <p className="text-[10px] uppercase tracking-[0.35em] text-muted">Luxury Maison</p>
              </div>
            </Link>
          </div>

          <div className="mb-8">
            <p className="page-eyebrow">Create account</p>
            <h1 className="mt-3 text-3xl font-semibold text-charcoal-700">Register</h1>
            <p className="mt-2 text-sm leading-7 text-muted">Join thousands of jewelry enthusiasts.</p>
          </div>

          <Form name="register" onFinish={onFinish} layout="vertical" size="large">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Form.Item name="firstName" label="First Name" rules={[{ required: true, message: 'Required' }]}>
                <Input placeholder="John" className="!h-12 !rounded-full" />
              </Form.Item>

              <Form.Item name="lastName" label="Last Name" rules={[{ required: true, message: 'Required' }]}>
                <Input placeholder="Doe" className="!h-12 !rounded-full" />
              </Form.Item>
            </div>

            <Form.Item name="email" label="Email Address" rules={[
              { required: true, message: 'Email is required' },
              { type: 'email', message: 'Enter a valid email' },
            ]}>
              <Input placeholder="you@example.com" className="!h-12 !rounded-full" />
            </Form.Item>

            <Form.Item name="phone" label="Phone Number" rules={[{ required: true, message: 'Phone number is required' }]}>
              <Input placeholder="+91 98765 43210" className="!h-12 !rounded-full" />
            </Form.Item>

            <Form.Item name="password" label="Password" rules={[
              { required: true, message: 'Password is required' },
              { min: 6, message: 'At least 6 characters' },
            ]} hasFeedback>
              <Input.Password
                placeholder="Min. 6 characters"
                className="!h-12 !rounded-full"
                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
              />
            </Form.Item>

            <Form.Item
              name="confirm"
              label="Confirm Password"
              dependencies={['password']}
              hasFeedback
              rules={[
                { required: true, message: 'Please confirm your password' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) return Promise.resolve();
                    return Promise.reject(new Error('Passwords do not match'));
                  },
                }),
              ]}
            >
              <Input.Password
                placeholder="Repeat your password"
                className="!h-12 !rounded-full"
                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
              />
            </Form.Item>

            <Form.Item className="mb-0">
              <Button type="primary" htmlType="submit" block loading={loading} className="!h-12 !rounded-full !border-0 !text-base">
                Create Account
              </Button>
            </Form.Item>
          </Form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-gold no-underline hover:underline">
                Sign in
              </Link>
            </p>
          </div>

          <p className="mt-6 text-center text-xs leading-6 text-muted">
            By creating an account, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </main>
    </div>
  );
};

export default RegisterPage;
