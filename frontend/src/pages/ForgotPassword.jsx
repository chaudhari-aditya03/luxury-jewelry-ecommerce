import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { MailOutlined, ArrowLeftOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { authService } from '../services';

const ForgotPasswordPage = () => {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');

  const onFinish = async ({ email }) => {
    setLoading(true);
    try {
      await authService.forgotPassword(email);
      setSubmittedEmail(email);
      setSent(true);
    } catch (error) {
      const apiMessage = error?.response?.data?.message;
      if (!error?.response) {
        message.error('Cannot connect to server. Please try again.');
      } else {
        message.error(apiMessage || 'Failed to send reset email. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16"
      style={{ background: 'linear-gradient(135deg, #faf9f7 0%, #f0ead8 100%)' }}>

      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-64 h-64 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #D4AF37, transparent)' }} />
        <div className="absolute bottom-20 left-20 w-48 h-48 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #D4AF37, transparent)' }} />
      </div>

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-10"
          style={{ boxShadow: '0 20px 60px rgba(212,175,55,0.15), 0 4px 20px rgba(0,0,0,0.08)' }}>

          {/* Logo */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center text-lg"
              style={{ background: 'linear-gradient(135deg, #D4AF37, #b8860b)' }}>
              💎
            </div>
            <span className="text-xl font-bold font-display" style={{ color: '#1a1a1a' }}>LuxeJewels</span>
          </div>

          {!sent ? (
            <>
              {/* Header */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.15), rgba(184,134,11,0.1))' }}>
                  <MailOutlined style={{ fontSize: 28, color: '#D4AF37' }} />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Forgot your password?</h1>
                <p className="text-gray-500 text-sm leading-relaxed">
                  No worries! Enter your email and we'll send you a link to reset your password.
                </p>
              </div>

              <Form name="forgot-password" onFinish={onFinish} layout="vertical" size="large">
                <Form.Item
                  name="email"
                  label={<span className="text-gray-700 font-medium">Email Address</span>}
                  rules={[
                    { required: true, message: 'Email is required' },
                    { type: 'email', message: 'Enter a valid email address' }
                  ]}
                >
                  <Input
                    placeholder="you@example.com"
                    prefix={<MailOutlined className="text-gray-400" />}
                    className="rounded-lg h-12"
                    style={{ borderColor: '#e5e7eb' }}
                  />
                </Form.Item>

                <Form.Item className="mb-4">
                  <Button
                    type="primary"
                    htmlType="submit"
                    block
                    loading={loading}
                    className="h-12 rounded-lg text-base font-semibold border-0"
                    style={{ background: 'linear-gradient(135deg, #D4AF37, #b8860b)', color: '#fff' }}
                  >
                    Send Reset Link
                  </Button>
                </Form.Item>
              </Form>
            </>
          ) : (
            /* Success state */
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ background: 'linear-gradient(135deg, rgba(34,197,94,0.15), rgba(22,163,74,0.1))' }}>
                <CheckCircleOutlined style={{ fontSize: 32, color: '#22c55e' }} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Check your inbox</h2>
              <p className="text-gray-500 text-sm leading-relaxed mb-2">
                We've sent a password reset link to:
              </p>
              <p className="font-semibold text-gray-800 mb-6" style={{ color: '#D4AF37' }}>
                {submittedEmail}
              </p>
              <p className="text-gray-400 text-xs leading-relaxed">
                The link expires in 1 hour. Check your spam folder if you don't see it.
              </p>

              <button
                onClick={() => { setSent(false); setSubmittedEmail(''); }}
                className="mt-6 text-sm underline text-gray-500 hover:text-gray-700 bg-transparent border-0 cursor-pointer"
              >
                Didn't receive it? Send again
              </button>
            </div>
          )}

          {/* Back to login */}
          <div className="text-center mt-6 pt-6 border-t border-gray-100">
            <Link to="/login" className="flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-gray-800 no-underline transition-colors">
              <ArrowLeftOutlined />
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
