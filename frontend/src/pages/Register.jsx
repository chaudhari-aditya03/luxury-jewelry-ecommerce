import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
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
    <div className="min-h-screen flex">
      {/* Left — brand panel */}
      <div
        className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(145deg, #0f0f0f 0%, #1a1a1a 60%, #2a2010 100%)' }}
      >
        <div className="absolute inset-0 opacity-20"
          style={{ background: 'radial-gradient(ellipse at 70% 30%, #D4AF37 0%, transparent 60%)' }} />

        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-3 no-underline">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
              style={{ background: 'linear-gradient(135deg, #D4AF37, #b8860b)' }}>
              💎
            </div>
            <span className="text-2xl font-bold text-white font-display tracking-wide">LuxeJewels</span>
          </Link>
        </div>

        <div className="relative z-10 flex-1 flex flex-col justify-center">
          <h2 className="text-5xl font-bold text-white font-display leading-tight mb-6">
            Join Our<br />
            <span style={{ color: '#D4AF37' }}>Exclusive</span><br />
            Community
          </h2>
          <p className="text-gray-400 text-lg leading-relaxed max-w-sm">
            Get early access to new collections, exclusive member discounts, and personalized jewelry recommendations.
          </p>

          <div className="mt-8 space-y-4">
            {[
              { icon: '🎁', text: 'Welcome discount on first order' },
              { icon: '📦', text: 'Free shipping on orders over ₹5,000' },
              { icon: '💼', text: 'Exclusive member-only collections' },
            ].map(item => (
              <div key={item.text} className="flex items-center gap-3">
                <span className="text-xl">{item.icon}</span>
                <span className="text-gray-300">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-gray-600 text-sm">
          50,000+ happy customers · Hallmark certified
        </div>
      </div>

      {/* Right — form panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-10 bg-white overflow-y-auto">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base"
              style={{ background: 'linear-gradient(135deg, #D4AF37, #b8860b)' }}>
              💎
            </div>
            <span className="text-xl font-bold font-display" style={{ color: '#1a1a1a' }}>LuxeJewels</span>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create your account</h1>
            <p className="text-gray-500">Join thousands of jewelry enthusiasts</p>
          </div>

          <Form name="register" onFinish={onFinish} layout="vertical" size="large">
            <div className="grid grid-cols-2 gap-4">
              <Form.Item
                name="firstName"
                label={<span className="text-gray-700 font-medium">First Name</span>}
                rules={[{ required: true, message: 'Required' }]}
                className="mb-4"
              >
                <Input placeholder="John" className="rounded-lg h-11" style={{ borderColor: '#e5e7eb' }} />
              </Form.Item>

              <Form.Item
                name="lastName"
                label={<span className="text-gray-700 font-medium">Last Name</span>}
                rules={[{ required: true, message: 'Required' }]}
                className="mb-4"
              >
                <Input placeholder="Doe" className="rounded-lg h-11" style={{ borderColor: '#e5e7eb' }} />
              </Form.Item>
            </div>

            <Form.Item
              name="email"
              label={<span className="text-gray-700 font-medium">Email Address</span>}
              rules={[
                { required: true, message: 'Email is required' },
                { type: 'email', message: 'Enter a valid email' }
              ]}
            >
              <Input placeholder="you@example.com" className="rounded-lg h-11" style={{ borderColor: '#e5e7eb' }} />
            </Form.Item>

            <Form.Item
              name="phone"
              label={<span className="text-gray-700 font-medium">Phone Number</span>}
              rules={[{ required: true, message: 'Phone number is required' }]}
            >
              <Input placeholder="+91 98765 43210" className="rounded-lg h-11" style={{ borderColor: '#e5e7eb' }} />
            </Form.Item>

            <Form.Item
              name="password"
              label={<span className="text-gray-700 font-medium">Password</span>}
              rules={[
                { required: true, message: 'Password is required' },
                { min: 6, message: 'At least 6 characters' }
              ]}
              hasFeedback
            >
              <Input.Password
                placeholder="Min. 6 characters"
                className="rounded-lg h-11"
                style={{ borderColor: '#e5e7eb' }}
                iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
              />
            </Form.Item>

            <Form.Item
              name="confirm"
              label={<span className="text-gray-700 font-medium">Confirm Password</span>}
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
                className="rounded-lg h-11"
                style={{ borderColor: '#e5e7eb' }}
                iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
              />
            </Form.Item>

            <Form.Item className="mb-0">
              <Button
                type="primary"
                htmlType="submit"
                block
                loading={loading}
                className="h-12 rounded-lg text-base font-semibold border-0"
                style={{ background: 'linear-gradient(135deg, #D4AF37, #b8860b)', color: '#fff' }}
              >
                Create Account
              </Button>
            </Form.Item>
          </Form>

          <div className="mt-6 text-center">
            <p className="text-gray-500">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold hover:underline" style={{ color: '#D4AF37' }}>
                Sign in
              </Link>
            </p>
          </div>

          <p className="text-center text-xs text-gray-400 mt-6">
            By creating an account, you agree to our{' '}
            <span className="underline cursor-pointer">Terms of Service</span> and{' '}
            <span className="underline cursor-pointer">Privacy Policy</span>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
