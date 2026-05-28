import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { MailOutlined, ArrowLeftOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
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
          <p className="page-eyebrow text-white/70">Account recovery</p>
          <h2 className="font-display text-5xl font-semibold leading-tight text-white">
            Reset your
            <span className="block text-gold">password safely.</span>
          </h2>
          <p className="max-w-md text-lg leading-8 text-white/72">
            No worries. Enter your email and we will send you a link to reset your password.
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

          {!sent ? (
            <>
              <div className="mb-8 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#faf6ea] text-gold">
                  <MailOutlined style={{ fontSize: 28 }} />
                </div>
                <p className="page-eyebrow">Forgot password</p>
                <h1 className="mt-3 text-3xl font-semibold text-charcoal-700">Check your inbox</h1>
                <p className="mt-2 text-sm leading-7 text-muted">
                  Enter your email and we will send you a link to reset your password.
                </p>
              </div>

              <Form name="forgot-password" onFinish={onFinish} layout="vertical" size="large">
                <Form.Item
                  name="email"
                  label="Email Address"
                  rules={[
                    { required: true, message: 'Email is required' },
                    { type: 'email', message: 'Enter a valid email address' }
                  ]}
                >
                  <Input placeholder="you@example.com" prefix={<MailOutlined className="text-gray-400" />} className="!h-12 !rounded-full" />
                </Form.Item>

                <Form.Item className="mb-4">
                  <Button type="primary" htmlType="submit" block loading={loading} className="!h-12 !rounded-full !border-0 !text-base">
                    Send Reset Link
                  </Button>
                </Form.Item>
              </Form>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#ecfdf5] text-[#22c55e]">
                <CheckCircleOutlined style={{ fontSize: 32 }} />
              </div>
              <p className="page-eyebrow">Email sent</p>
              <h2 className="mt-3 text-3xl font-semibold text-charcoal-700">Check your inbox</h2>
              <p className="mt-2 text-sm leading-7 text-muted">We've sent a password reset link to:</p>
              <p className="mt-2 font-semibold text-gold">{submittedEmail}</p>
              <p className="mt-4 text-xs leading-6 text-muted">The link expires in 1 hour. Check your spam folder if you don't see it.</p>

              <button
                onClick={() => { setSent(false); setSubmittedEmail(''); }}
                className="mt-6 text-sm font-medium text-gold underline-offset-4 hover:underline"
              >
                Didn't receive it? Send again
              </button>
            </div>
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

export default ForgotPasswordPage;
