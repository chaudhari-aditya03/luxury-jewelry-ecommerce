import React, { useState } from 'react';
import { Form, Input, Button, Checkbox, message } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const { login, isAdmin } = useAuth();
  const navigate = useNavigate();

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
      } else {
        message.error(apiMessage || 'Login failed. Please try again.');
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
          <p className="page-eyebrow text-white/70">Welcome back</p>
          <h2 className="font-display text-5xl font-semibold leading-tight text-white">
            Timeless elegance
            <span className="block text-gold">awaits you.</span>
          </h2>
          <p className="max-w-md text-lg leading-8 text-white/72">
            Discover handcrafted jewelry that tells your story. Premium gold, diamonds, and gemstones, presented with a calm, editorial experience.
          </p>
          <div className="flex flex-wrap gap-3">
            {['Free Shipping', 'Certified Authentic', '24/7 Support'].map((tag) => (
              <span key={tag} className="rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-sm font-medium text-white/85 backdrop-blur-md">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <p className="text-sm text-white/45">Trusted by 50,000+ customers worldwide</p>
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
            <p className="page-eyebrow">Sign In</p>
            <h1 className="mt-3 text-3xl font-semibold text-charcoal-700">Welcome back</h1>
            <p className="mt-2 text-sm leading-7 text-muted">Sign in to your account to continue.</p>
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
              <Input placeholder="you@example.com" className="!h-12 !rounded-full" />
            </Form.Item>

            <Form.Item
              name="password"
              label="Password"
              rules={[{ required: true, message: 'Password is required' }]}
            >
              <Input.Password
                placeholder="Enter your password"
                className="!h-12 !rounded-full"
                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
              />
            </Form.Item>

            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox className="text-sm text-muted">Remember me</Checkbox>
              </Form.Item>
              <Link to="/forgot-password" className="text-sm font-medium text-gold no-underline hover:underline">
                Forgot password?
              </Link>
            </div>

            <Form.Item>
              <Button type="primary" htmlType="submit" block loading={loading} className="!h-12 !rounded-full !border-0 !text-base">
                Sign In
              </Button>
            </Form.Item>
          </Form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted">
              Don't have an account?{' '}
              <Link to="/register" className="font-semibold text-gold no-underline hover:underline">
                Create one free
              </Link>
            </p>
          </div>

          <p className="mt-8 text-center text-xs leading-6 text-muted">
            By signing in, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;

