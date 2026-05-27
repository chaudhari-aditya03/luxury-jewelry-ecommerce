import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message, Alert } from 'antd';
import { LockOutlined, EyeInvisibleOutlined, EyeTwoTone, CheckCircleOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { authService } from '../services';

const ResetPasswordPage = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [tokenValid, setTokenValid] = useState(true);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setTokenValid(false);
    }
  }, [token]);

  const onFinish = async ({ newPassword }) => {
    setLoading(true);
    try {
      await authService.resetPassword(token, newPassword);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (error) {
      const apiMessage = error?.response?.data?.message;
      if (!error?.response) {
        message.error('Cannot connect to server. Please try again.');
      } else if (error?.response?.status === 400) {
        message.error(apiMessage || 'Reset link is invalid or expired. Please request a new one.');
        setTokenValid(false);
      } else {
        message.error(apiMessage || 'Failed to reset password. Please try again.');
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
        <div className="absolute top-20 left-20 w-64 h-64 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #D4AF37, transparent)' }} />
        <div className="absolute bottom-20 right-20 w-48 h-48 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #D4AF37, transparent)' }} />
      </div>

      <div className="relative w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-10"
          style={{ boxShadow: '0 20px 60px rgba(212,175,55,0.15), 0 4px 20px rgba(0,0,0,0.08)' }}>

          {/* Logo */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center text-lg"
              style={{ background: 'linear-gradient(135deg, #D4AF37, #b8860b)' }}>
              💎
            </div>
            <span className="text-xl font-bold font-display">LuxeJewels</span>
          </div>

          {success ? (
            /* Success state */
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ background: 'rgba(34,197,94,0.12)' }}>
                <CheckCircleOutlined style={{ fontSize: 32, color: '#22c55e' }} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Password reset!</h2>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                Your password has been changed successfully. Redirecting you to login…
              </p>
              <Link to="/login">
                <Button
                  type="primary"
                  block
                  className="h-11 rounded-lg font-semibold border-0"
                  style={{ background: 'linear-gradient(135deg, #D4AF37, #b8860b)' }}
                >
                  Go to Login
                </Button>
              </Link>
            </div>
          ) : !tokenValid ? (
            /* Invalid token state */
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ background: 'rgba(239,68,68,0.1)' }}>
                <span className="text-3xl">⚠️</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Invalid reset link</h2>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                This password reset link is invalid or has expired. Please request a new one.
              </p>
              <Link to="/forgot-password">
                <Button
                  type="primary"
                  block
                  className="h-11 rounded-lg font-semibold border-0"
                  style={{ background: 'linear-gradient(135deg, #D4AF37, #b8860b)' }}
                >
                  Request New Link
                </Button>
              </Link>
            </div>
          ) : (
            /* Form state */
            <>
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ background: 'rgba(212,175,55,0.12)' }}>
                  <LockOutlined style={{ fontSize: 28, color: '#D4AF37' }} />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Set new password</h1>
                <p className="text-gray-500 text-sm">
                  Choose a strong password you haven't used before.
                </p>
              </div>

              <Form name="reset-password" onFinish={onFinish} layout="vertical" size="large">
                <Form.Item
                  name="newPassword"
                  label={<span className="text-gray-700 font-medium">New Password</span>}
                  rules={[
                    { required: true, message: 'Password is required' },
                    { min: 6, message: 'At least 6 characters' }
                  ]}
                  hasFeedback
                >
                  <Input.Password
                    placeholder="Min. 6 characters"
                    className="rounded-lg h-12"
                    style={{ borderColor: '#e5e7eb' }}
                    iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                  />
                </Form.Item>

                <Form.Item
                  name="confirmPassword"
                  label={<span className="text-gray-700 font-medium">Confirm New Password</span>}
                  dependencies={['newPassword']}
                  hasFeedback
                  rules={[
                    { required: true, message: 'Please confirm your password' },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('newPassword') === value) return Promise.resolve();
                        return Promise.reject(new Error('Passwords do not match'));
                      },
                    }),
                  ]}
                >
                  <Input.Password
                    placeholder="Repeat your new password"
                    className="rounded-lg h-12"
                    style={{ borderColor: '#e5e7eb' }}
                    iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                  />
                </Form.Item>

                {/* Password strength hints */}
                <div className="mb-5 p-3 rounded-lg text-xs text-gray-500 space-y-1"
                  style={{ background: '#fafaf8', border: '1px solid #f0e8d8' }}>
                  <p className="font-medium text-gray-600 mb-1.5">Password requirements:</p>
                  <p>• Minimum 6 characters</p>
                  <p>• Mix of letters and numbers recommended</p>
                </div>

                <Form.Item className="mb-0">
                  <Button
                    type="primary"
                    htmlType="submit"
                    block
                    loading={loading}
                    className="h-12 rounded-lg text-base font-semibold border-0"
                    style={{ background: 'linear-gradient(135deg, #D4AF37, #b8860b)', color: '#fff' }}
                  >
                    Reset Password
                  </Button>
                </Form.Item>
              </Form>
            </>
          )}

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

export default ResetPasswordPage;
