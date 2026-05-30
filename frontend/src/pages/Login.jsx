import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Checkbox, message } from 'antd';
import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  MailOutlined,
  LockOutlined,
  GoogleOutlined,
  SafetyCertificateOutlined,
  CreditCardOutlined,
  GiftOutlined,
  HeartOutlined,
} from '@ant-design/icons';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Sparkles, Chrome, Crown, ShieldCheck, Truck, Gem } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services';

const trustBadges = [
  { icon: Crown, label: 'Hallmark Certified' },
  { icon: SafetyCertificateOutlined, label: 'Secure Payments' },
  { icon: Truck, label: 'Free Shipping' },
  { icon: HeartOutlined, label: 'Lifetime Support' },
];

const stats = [
  { value: '50k+', label: 'Happy Clients' },
  { value: '24/7', label: 'Concierge Support' },
  { value: '100%', label: 'Certified Pieces' },
];

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const { login, isAdmin, completeExternalLogin } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    const oauth2 = searchParams.get('oauth2');
    if (token && oauth2) {
      const hydrateOauthLogin = async () => {
        try {
          setLoading(true);
          await completeExternalLogin(token);
          message.success('Google login successful');
          navigate('/shop', { replace: true });
        } catch (error) {
          message.error('Google login failed. Please try again.');
        } finally {
          setLoading(false);
        }
      };

      void hydrateOauthLogin();
    }
  }, [searchParams, completeExternalLogin, navigate]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const authData = await login(values.email, values.password);
      message.success('Welcome back!');
      const userRole = authData?.user?.role;
      if (userRole === 'ADMIN' || userRole === 'admin' || isAdmin) {
        navigate('/admin');
      } else {
        navigate('/shop');
      }
    } catch (error) {
      const status = error?.response?.status;
      const apiMessage = error?.response?.data?.message;
      if (!error?.response) {
        message.error('Cannot connect to server. Please check your connection.');
      } else if (status === 401) {
        message.error(apiMessage || 'Invalid email or password.');
      } else if (apiMessage?.toLowerCase().includes('verify your email')) {
        message.error(apiMessage || 'Please verify your email before signing in.');
      } else {
        message.error(apiMessage || 'Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      <aside className="auth-brand-panel auth-brand-panel--login">
        <div className="auth-brand-hero auth-brand-hero--login">
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
              <p className="page-eyebrow text-white/75">Welcome back</p>
              <h2 className="auth-brand-title">
                Timeless elegance
                <span className="block text-gold">awaits you.</span>
              </h2>
              <p className="auth-brand-description">
                Discover handcrafted jewelry designed for modern sophistication, presented with the calm, editorial confidence of a world-class maison.
              </p>

              <div className="auth-trust-grid" aria-label="Luxury trust indicators">
                {trustBadges.map((badge) => {
                  const Icon = badge.icon;
                  return (
                    <div key={badge.label} className="auth-glass-chip">
                      <Icon className="h-4 w-4 text-gold" />
                      <span>{badge.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="auth-stats-grid" aria-label="Brand statistics">
              {stats.map((stat) => (
                <div key={stat.label} className="auth-stat-card">
                  <span className="auth-stat-card__value">{stat.value}</span>
                  <span className="auth-stat-card__label">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </aside>

      <main className="auth-card">
        <div className="auth-card-panel auth-card-panel--login">
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
            <p className="page-eyebrow">Sign In</p>
            <h1 className="auth-form-title">Welcome Back</h1>
            <p className="auth-form-subtitle">Sign in to continue your luxury shopping experience.</p>
          </div>

          <Form name="login" initialValues={{ remember: true }} onFinish={onFinish} layout="vertical" size="large">
            <Form.Item
              name="email"
              label="Email Address"
              rules={[
                { required: true, message: 'Email is required' },
                { type: 'email', message: 'Enter a valid email' }
              ]}
            >
              <Input
                placeholder="you@example.com"
                prefix={<MailOutlined className="text-gold/80" />}
                className="auth-input !h-12 !rounded-full"
                aria-label="Email address"
              />
            </Form.Item>

            <Form.Item
              name="password"
              label="Password"
              rules={[{ required: true, message: 'Password is required' }]}
            >
              <Input.Password
                placeholder="Enter your password"
                prefix={<LockOutlined className="text-gold/80" />}
                className="auth-input !h-12 !rounded-full"
                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                aria-label="Password"
              />
            </Form.Item>

            <div className="auth-form-meta">
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox className="auth-checkbox">Remember me</Checkbox>
              </Form.Item>
              <Link to="/forgot-password" className="text-sm font-medium text-gold no-underline hover:underline">
                Forgot password?
              </Link>
            </div>

            <Form.Item>
              <Button type="primary" htmlType="submit" block loading={loading} className="auth-primary-btn !h-12 !rounded-full !border-0 !text-base">
                Sign In
              </Button>
            </Form.Item>

            <div className="auth-social-stack">
              <Button
                block
                className="auth-secondary-btn !h-12 !rounded-full"
                onClick={() => window.location.assign(authService.getGoogleLoginUrl())}
              >
                <span className="inline-flex items-center justify-center gap-2">
                  <Chrome className="h-4 w-4" />
                  Continue with Google
                </span>
              </Button>
              <Button block className="auth-secondary-btn auth-secondary-btn--muted !h-12 !rounded-full" disabled>
                <span className="inline-flex items-center justify-center gap-2">
                  <Gem className="h-4 w-4" />
                  Continue with Apple
                </span>
              </Button>
            </div>
          </Form>

          <div className="auth-card-footer">
            <p className="text-sm text-muted">
              Don't have an account?{' '}
              <Link to="/register" className="font-semibold text-gold no-underline hover:underline">
                Create one free
              </Link>
            </p>
            <div className="auth-footer-badges">
              <span><ShieldCheck className="h-3.5 w-3.5" /> Secure session</span>
              <span><GiftOutlined className="h-3.5 w-3.5" /> Premium access</span>
            </div>
          </div>

          <p className="auth-legal-copy">
            By signing in, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;

