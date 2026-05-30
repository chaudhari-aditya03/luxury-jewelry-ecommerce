import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  MailOutlined,
  PhoneOutlined,
  LockOutlined,
  UserOutlined,
  GiftOutlined,
  ClockCircleOutlined,
  StarOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Gift, ShieldCheck, Truck, Crown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const benefits = [
  { icon: GiftOutlined, title: 'Welcome Discount', text: 'Receive priority offers on your first curated purchase.' },
  { icon: Crown, title: 'Exclusive Collections', text: 'Unlock members-only launches and private edits.' },
  { icon: ClockCircleOutlined, title: 'Faster Checkout', text: 'Save time with seamless account details and repeat orders.' },
  { icon: StarOutlined, title: 'Personalized Picks', text: 'Discover jewelry recommendations tailored to your taste.' },
  { icon: SafetyCertificateOutlined, title: 'Verified Service', text: 'Enjoy secure ordering with trusted account protection.' },
];

const passwordRules = [
  'Minimum 8 characters',
  'One uppercase letter',
  'One number',
  'One special character',
];

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
      const verificationData = await registerUser(payload);
      message.success('Account created. Please verify your email to continue.');
      navigate(`/verify-email?email=${encodeURIComponent(verificationData?.email || values.email)}`);
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
      <aside className="auth-brand-panel auth-brand-panel--register">
        <div className="auth-brand-hero auth-brand-hero--register">
          <div className="auth-brand-hero__overlay" />
          <div className="auth-brand-hero__copy">
            <Link to="/" className="auth-brand-logo group no-underline">
              <span className="auth-brand-logo__mark">
                <Sparkles className="h-5 w-5 text-gold" />
              </span>
              <span>
                <span className="auth-brand-logo__title">LUXURY MAISON</span>
                <span className="auth-brand-logo__subtitle">Fine Jewelry House</span>
              </span>
            </Link>

            <div className="auth-brand-story">
              <p className="page-eyebrow text-white/75">Join the maison</p>
              <h2 className="auth-brand-title">
                Create your
                <span className="block text-gold">exclusive account.</span>
              </h2>
              <p className="auth-brand-description">
                Join our luxury community for early access to fine jewelry drops, private member benefits, and personalized recommendations.
              </p>

              <div className="auth-trust-grid auth-trust-grid--compact" aria-label="Membership benefits">
                {[
                  { icon: Gift, text: 'Welcome Discount' },
                  { icon: ShieldCheck, text: 'Secure Shopping' },
                  { icon: Truck, text: 'Fast Delivery' },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.text} className="auth-glass-chip">
                      <Icon className="h-4 w-4 text-gold" />
                      <span>{item.text}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="auth-benefit-panel">
              {benefits.map((benefit) => {
                const Icon = benefit.icon;
                return (
                  <div key={benefit.title} className="auth-benefit-card">
                    <span className="auth-benefit-card__icon"><Icon /></span>
                    <div>
                      <p className="auth-benefit-card__title">{benefit.title}</p>
                      <p className="auth-benefit-card__text">{benefit.text}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </aside>

      <main className="auth-card">
        <div className="auth-card-panel auth-card-panel--register">
          <div className="auth-mobile-brand lg:hidden">
            <Link to="/" className="auth-brand-logo no-underline">
              <span className="auth-brand-logo__mark">
                <Sparkles className="h-4 w-4 text-gold" />
              </span>
              <span>
                <span className="auth-brand-logo__title">LUXURY MAISON</span>
                <span className="auth-brand-logo__subtitle">Fine Jewelry House</span>
              </span>
            </Link>
          </div>

          <div className="auth-form-header">
            <p className="page-eyebrow">Create account</p>
            <h1 className="auth-form-title">Create Your Account</h1>
            <p className="auth-form-subtitle">Join our exclusive jewelry community.</p>
          </div>

          <Form name="register" onFinish={onFinish} layout="vertical" size="large">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Form.Item name="firstName" label="First Name" rules={[{ required: true, message: 'Required' }]}>
                <Input placeholder="John" prefix={<UserOutlined className="text-gold/80" />} className="auth-input !h-12 !rounded-full" aria-label="First name" />
              </Form.Item>

              <Form.Item name="lastName" label="Last Name" rules={[{ required: true, message: 'Required' }]}>
                <Input placeholder="Doe" prefix={<UserOutlined className="text-gold/80" />} className="auth-input !h-12 !rounded-full" aria-label="Last name" />
              </Form.Item>
            </div>

            <Form.Item
              name="email"
              label="Email Address"
              rules={[
                { required: true, message: 'Email is required' },
                { type: 'email', message: 'Enter a valid email' },
              ]}
            >
              <Input placeholder="you@example.com" prefix={<MailOutlined className="text-gold/80" />} className="auth-input !h-12 !rounded-full" aria-label="Email address" />
            </Form.Item>

            <Form.Item name="phone" label="Phone Number" rules={[{ required: true, message: 'Phone number is required' }]}>
              <Input placeholder="+91 98765 43210" prefix={<PhoneOutlined className="text-gold/80" />} className="auth-input !h-12 !rounded-full" aria-label="Phone number" />
            </Form.Item>

            <Form.Item
              name="password"
              label="Password"
              rules={[
                { required: true, message: 'Password is required' },
                { min: 6, message: 'At least 6 characters' },
              ]}
              hasFeedback
            >
              <Input.Password
                placeholder="Min. 6 characters"
                prefix={<LockOutlined className="text-gold/80" />}
                className="auth-input !h-12 !rounded-full"
                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                aria-label="Password"
              />
            </Form.Item>

            <div className="auth-password-panel" aria-label="Password requirements">
              <div className="auth-password-panel__header">
                <span>Password requirements</span>
                <span>Secure your account</span>
              </div>
              <div className="auth-password-rules">
                {passwordRules.map((rule) => (
                  <div key={rule} className="auth-password-rule">
                    <span className="auth-password-rule__dot" aria-hidden="true" />
                    <span>{rule}</span>
                  </div>
                ))}
              </div>
            </div>

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
                prefix={<LockOutlined className="text-gold/80" />}
                className="auth-input !h-12 !rounded-full"
                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                aria-label="Confirm password"
              />
            </Form.Item>

            <Form.Item className="mb-0">
              <Button type="primary" htmlType="submit" block loading={loading} className="auth-primary-btn !h-12 !rounded-full !border-0 !text-base">
                Create Account
              </Button>
            </Form.Item>
          </Form>

          <div className="auth-card-footer">
            <p className="text-sm text-muted">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-gold no-underline hover:underline">
                Sign in
              </Link>
            </p>
            <div className="auth-footer-badges">
              <span><ShieldCheck className="h-3.5 w-3.5" /> Faster checkout</span>
              <span><Sparkles className="h-3.5 w-3.5" /> Priority access</span>
            </div>
          </div>

          <p className="auth-legal-copy">
            By creating an account, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </main>
    </div>
  );
};

export default RegisterPage;
