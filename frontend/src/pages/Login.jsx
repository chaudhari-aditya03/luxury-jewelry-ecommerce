import React, { useState } from 'react';
import { Form, Input, Button, Checkbox, message } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
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
    <div className="min-h-screen flex">
      {/* Left — brand panel */}
      <div
        className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(145deg, #0f0f0f 0%, #1a1a1a 60%, #2a2010 100%)' }}
      >
        {/* Background glow */}
        <div className="absolute inset-0 opacity-20"
          style={{ background: 'radial-gradient(ellipse at 30% 70%, #D4AF37 0%, transparent 60%)' }} />

        {/* Logo */}
        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-3 no-underline">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
              style={{ background: 'linear-gradient(135deg, #D4AF37, #b8860b)' }}>
              💎
            </div>
            <span className="text-2xl font-bold text-white font-display tracking-wide">LuxeJewels</span>
          </Link>
        </div>

        {/* Center quote */}
        <div className="relative z-10 flex-1 flex flex-col justify-center">
          <h2 className="text-5xl font-bold text-white font-display leading-tight mb-6">
            Timeless<br />
            <span style={{ color: '#D4AF37' }}>Elegance</span><br />
            Awaits You
          </h2>
          <p className="text-gray-400 text-lg leading-relaxed max-w-sm">
            Discover handcrafted jewelry that tells your story. Premium gold, diamonds, and gemstones — certified authentic.
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-3 mt-8">
            {['Free Shipping', 'Certified Authentic', '24/7 Support'].map(tag => (
              <span key={tag}
                className="px-4 py-1.5 rounded-full text-sm font-medium border"
                style={{ borderColor: '#D4AF37', color: '#D4AF37', background: 'rgba(212,175,55,0.08)' }}>
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom tagline */}
        <div className="relative z-10 text-gray-600 text-sm">
          Trusted by 50,000+ customers worldwide
        </div>
      </div>

      {/* Right — form panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 bg-white">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base"
              style={{ background: 'linear-gradient(135deg, #D4AF37, #b8860b)' }}>
              💎
            </div>
            <span className="text-xl font-bold font-display" style={{ color: '#1a1a1a' }}>LuxeJewels</span>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h1>
            <p className="text-gray-500">Sign in to your account to continue</p>
          </div>

          <Form name="login" initialValues={{ remember: true }} onFinish={onFinish} layout="vertical" size="large">
            <Form.Item
              name="email"
              label={<span className="text-gray-700 font-medium">Email Address</span>}
              rules={[
                { required: true, message: 'Email is required' },
                { type: 'email', message: 'Enter a valid email' }
              ]}
            >
              <Input
                placeholder="you@example.com"
                className="rounded-lg h-12"
                style={{ borderColor: '#e5e7eb' }}
              />
            </Form.Item>

            <Form.Item
              name="password"
              label={<span className="text-gray-700 font-medium">Password</span>}
              rules={[{ required: true, message: 'Password is required' }]}
            >
              <Input.Password
                placeholder="Enter your password"
                className="rounded-lg h-12"
                style={{ borderColor: '#e5e7eb' }}
                iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
              />
            </Form.Item>

            <div className="flex items-center justify-between mb-6">
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox className="text-gray-600">Remember me</Checkbox>
              </Form.Item>
              <Link to="/forgot-password" className="text-sm font-medium hover:underline"
                style={{ color: '#D4AF37' }}>
                Forgot password?
              </Link>
            </div>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                loading={loading}
                className="h-12 rounded-lg text-base font-semibold border-0"
                style={{ background: 'linear-gradient(135deg, #D4AF37, #b8860b)', color: '#fff' }}
              >
                Sign In
              </Button>
            </Form.Item>
          </Form>

          <div className="mt-6 text-center">
            <p className="text-gray-500">
              Don't have an account?{' '}
              <Link to="/register" className="font-semibold hover:underline" style={{ color: '#D4AF37' }}>
                Create one free
              </Link>
            </p>
          </div>

          <p className="text-center text-xs text-gray-400 mt-8">
            By signing in, you agree to our{' '}
            <span className="underline cursor-pointer">Terms of Service</span> and{' '}
            <span className="underline cursor-pointer">Privacy Policy</span>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

