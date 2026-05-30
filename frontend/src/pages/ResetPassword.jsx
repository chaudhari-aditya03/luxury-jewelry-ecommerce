import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message, Alert } from 'antd';
import { LockOutlined, EyeInvisibleOutlined, EyeTwoTone, CheckCircleOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
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
      return;
    }

    const validateToken = async () => {
      try {
        await authService.validateResetToken(token);
        setTokenValid(true);
      } catch (error) {
        setTokenValid(false);
      }
    };

    void validateToken();
  }, [token]);

  const onFinish = async ({ newPassword, confirmPassword }) => {
    setLoading(true);
    try {
      await authService.resetPassword(token, newPassword, confirmPassword);
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
          <p className="page-eyebrow text-white/70">Password recovery</p>
          <h2 className="font-display text-5xl font-semibold leading-tight text-white">
            Reset your
            <span className="block text-gold">password securely.</span>
          </h2>
          <p className="max-w-md text-lg leading-8 text-white/72">
            Choose a strong password you have not used before, then return to the maison experience.
          </p>
        </div>

        <p className="text-sm text-white/45">Protected account access for the maison experience.</p>
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

          {success ? (
            <div className="text-center py-4">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#ecfdf5] text-[#22c55e]">
                <CheckCircleOutlined style={{ fontSize: 32 }} />
              </div>
              <p className="page-eyebrow">Success</p>
              <h2 className="mt-3 text-3xl font-semibold text-charcoal-700">Password reset</h2>
              <p className="mt-2 text-sm leading-7 text-muted">Your password has been changed successfully. Redirecting you to login…</p>
              <Link to="/login" className="mt-6 inline-flex w-full items-center justify-center no-underline">
                <Button type="primary" block className="!h-11 !rounded-full !border-0">
                  Go to Login
                </Button>
              </Link>
            </div>
          ) : !tokenValid ? (
            <div className="text-center py-4">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#fff1f2] text-[#ef4444]">
                <span className="text-3xl">⚠️</span>
              </div>
              <p className="page-eyebrow">Invalid link</p>
              <h2 className="mt-3 text-3xl font-semibold text-charcoal-700">Invalid reset link</h2>
              <p className="mt-2 text-sm leading-7 text-muted">This password reset link is invalid or has expired. Please request a new one.</p>
              <Link to="/forgot-password" className="mt-6 inline-flex w-full items-center justify-center no-underline">
                <Button type="primary" block className="!h-11 !rounded-full !border-0">
                  Request New Link
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-8 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#faf6ea] text-gold">
                  <LockOutlined style={{ fontSize: 28 }} />
                </div>
                <p className="page-eyebrow">Set new password</p>
                <h1 className="mt-3 text-3xl font-semibold text-charcoal-700">Choose a strong password</h1>
                <p className="mt-2 text-sm leading-7 text-muted">Choose a strong password you have not used before.</p>
              </div>

              <Form name="reset-password" onFinish={onFinish} layout="vertical" size="large">
                <Form.Item
                  name="newPassword"
                  label="New Password"
                  rules={[
                    { required: true, message: 'Password is required' },
                    { min: 6, message: 'At least 6 characters' }
                  ]}
                  hasFeedback
                >
                  <Input.Password
                    placeholder="Min. 6 characters"
                    className="!h-12 !rounded-full"
                    iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                  />
                </Form.Item>

                <Form.Item
                  name="confirmPassword"
                  label="Confirm New Password"
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
                    className="!h-12 !rounded-full"
                    iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                  />
                </Form.Item>

                <div className="mb-5 rounded-[1.25rem] border border-[#eadfca] bg-[#faf8f1] p-4 text-xs leading-6 text-muted">
                  <p className="mb-2 font-medium text-charcoal-700">Password requirements:</p>
                  <p>Minimum 8 characters</p>
                  <p>Use a strong mix of letters, numbers, and symbols</p>
                </div>

                <Form.Item className="mb-0">
                  <Button type="primary" htmlType="submit" block loading={loading} className="!h-12 !rounded-full !border-0 !text-base">
                    Reset Password
                  </Button>
                </Form.Item>
              </Form>
            </>
          )}

          <div className="mt-6 border-t border-[#eadfca] pt-6 text-center">
            <Link to="/login" className="inline-flex items-center justify-center gap-2 text-sm text-muted no-underline transition-colors hover:text-gold">
              <ArrowLeftOutlined />
              Back to Sign In
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ResetPasswordPage;
