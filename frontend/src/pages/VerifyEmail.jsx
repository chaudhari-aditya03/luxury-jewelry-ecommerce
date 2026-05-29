import React, { useEffect, useMemo, useState } from 'react';
import { Button, message, Spin } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, MailOutlined, ReloadOutlined } from '@ant-design/icons';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { authService } from '../services';
import { useAuth } from '../context/AuthContext';

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { pendingVerificationEmail, setPendingVerificationEmail } = useAuth();
  const [status, setStatus] = useState('loading');
  const [email, setEmail] = useState('');
  const [messageText, setMessageText] = useState('Verifying your email...');

  const token = searchParams.get('token');
  const queryEmail = searchParams.get('email');
  const resolvedEmail = useMemo(() => queryEmail || pendingVerificationEmail || email, [queryEmail, pendingVerificationEmail, email]);

  useEffect(() => {
    if (!token) {
      setStatus('idle');
      setMessageText('Enter your email address to resend the verification link.');
      return;
    }

    const verify = async () => {
      try {
        setStatus('loading');
        const response = await authService.verifyEmail(token);
        const verifiedEmail = response.data?.data?.email || queryEmail || pendingVerificationEmail;
        if (verifiedEmail) {
          setEmail(verifiedEmail);
          setPendingVerificationEmail('');
          localStorage.removeItem('pendingVerificationEmail');
        }
        setStatus('success');
        setMessageText(response.data?.message || 'Email verified successfully');
      } catch (error) {
        setStatus('error');
        setMessageText(error?.response?.data?.message || 'Verification link is invalid or expired.');
      }
    };

    void verify();
  }, [token, queryEmail, pendingVerificationEmail, setPendingVerificationEmail]);

  const resendVerification = async () => {
    if (!resolvedEmail) {
      message.error('Please enter the email address used for registration.');
      return;
    }

    try {
      await authService.resendVerificationEmail(resolvedEmail);
      message.success('Verification email sent again.');
      setStatus('idle');
      setMessageText('We sent another verification email. Check your inbox.');
    } catch (error) {
      message.error(error?.response?.data?.message || 'Unable to resend verification email.');
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
          <p className="page-eyebrow text-white/70">Email verification</p>
          <h2 className="font-display text-5xl font-semibold leading-tight text-white">
            Secure your
            <span className="block text-gold">account access.</span>
          </h2>
          <p className="max-w-md text-lg leading-8 text-white/72">
            Confirm your email to activate your account and continue with your order history, wishlist, and checkout.
          </p>
        </div>
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

          {status === 'loading' ? (
            <div className="flex min-h-[360px] flex-col items-center justify-center text-center">
              <Spin size="large" />
              <p className="mt-4 text-sm text-muted">{messageText}</p>
            </div>
          ) : status === 'success' ? (
            <div className="text-center py-4">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#ecfdf5] text-[#22c55e]">
                <CheckCircleOutlined style={{ fontSize: 32 }} />
              </div>
              <p className="page-eyebrow">Verified</p>
              <h2 className="mt-3 text-3xl font-semibold text-charcoal-700">Email verified</h2>
              <p className="mt-2 text-sm leading-7 text-muted">{messageText}</p>
              <Button type="primary" className="mt-6 !h-12 !rounded-full !border-0" onClick={() => navigate('/login')}>
                Continue to login
              </Button>
            </div>
          ) : status === 'error' ? (
            <div className="text-center py-4">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#fff1f2] text-[#ef4444]">
                <CloseCircleOutlined style={{ fontSize: 32 }} />
              </div>
              <p className="page-eyebrow">Verification failed</p>
              <h2 className="mt-3 text-3xl font-semibold text-charcoal-700">Link expired</h2>
              <p className="mt-2 text-sm leading-7 text-muted">{messageText}</p>
              <div className="mt-6 space-y-4">
                <input
                  value={resolvedEmail}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full rounded-full border border-[#eadfca] px-4 py-3 outline-none"
                />
                <Button type="primary" block className="!h-12 !rounded-full !border-0" onClick={resendVerification}>
                  Resend verification email
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#faf6ea] text-gold">
                <MailOutlined style={{ fontSize: 28 }} />
              </div>
              <p className="page-eyebrow">Verify account</p>
              <h2 className="mt-3 text-3xl font-semibold text-charcoal-700">Please verify your email</h2>
              <p className="mt-2 text-sm leading-7 text-muted">{messageText}</p>
              <div className="mt-6 space-y-4">
                <input
                  value={resolvedEmail}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full rounded-full border border-[#eadfca] px-4 py-3 outline-none"
                />
                <Button type="primary" block className="!h-12 !rounded-full !border-0" onClick={resendVerification}>
                  Resend verification email
                </Button>
              </div>
            </div>
          )}

          <div className="mt-6 border-t border-[#eadfca] pt-6 text-center">
            <Link to="/login" className="text-sm text-muted no-underline transition-colors hover:text-gold">
              Back to Sign In
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default VerifyEmailPage;