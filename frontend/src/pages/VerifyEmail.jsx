import React, { useEffect, useMemo, useState } from 'react';
import { Button, Input, message, Spin } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, MailOutlined } from '@ant-design/icons';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { authService } from '../services';
import { useAuth } from '../context/AuthContext';

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { pendingVerificationEmail, setPendingVerificationEmail, completeExternalLogin } = useAuth();
  const [status, setStatus] = useState('idle');
  const [emailInput, setEmailInput] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [messageText, setMessageText] = useState('Enter the 6-digit code we emailed you after registration.');
  const [welcomeCoupon, setWelcomeCoupon] = useState(null);
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendSeconds, setResendSeconds] = useState(60);

  const queryEmail = searchParams.get('email');
  const resolvedEmail = useMemo(
    () => emailInput || queryEmail || pendingVerificationEmail,
    [emailInput, queryEmail, pendingVerificationEmail]
  );

  useEffect(() => {
    if (!emailInput && (queryEmail || pendingVerificationEmail)) {
      setEmailInput(queryEmail || pendingVerificationEmail);
    }
  }, [emailInput, queryEmail, pendingVerificationEmail]);

  useEffect(() => {
    if (resendSeconds <= 0) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setResendSeconds((current) => Math.max(0, current - 1));
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [resendSeconds]);

  const verify = async () => {
    if (!resolvedEmail) {
      message.error('Please enter the email used for registration.');
      return;
    }

    if (!otpCode.trim()) {
      message.error('Please enter the 6-digit verification code.');
      return;
    }

    try {
      setVerifying(true);
      const response = await authService.verifyOtp(resolvedEmail, otpCode.trim());
      const authData = response.data?.data;
      const verifiedEmail = authData?.user?.email || resolvedEmail;

      setEmailInput(verifiedEmail);
      setPendingVerificationEmail('');
      localStorage.removeItem('pendingVerificationEmail');

      if (authData?.token) {
        await completeExternalLogin(authData.token);
      }

      if (authData?.welcomeCouponCode) {
        setWelcomeCoupon({
          code: authData.welcomeCouponCode,
          message: authData.welcomeCouponMessage,
        });
      }

      setStatus('success');
      setMessageText(response.data?.message || 'Email verified successfully');
      message.success(response.data?.message || 'Email verified successfully');
    } catch (error) {
      setStatus('error');
      setMessageText(error?.response?.data?.message || 'Verification code is invalid or expired.');
    } finally {
      setVerifying(false);
    }
  };

  const resendVerification = async () => {
    if (!resolvedEmail) {
      message.error('Please enter the email address used for registration.');
      return;
    }

    try {
      setResending(true);
      await authService.resendOtp(resolvedEmail);
      message.success('Verification code sent again.');
      setStatus('idle');
      setMessageText('We sent another verification code. Check your inbox.');
      setResendSeconds(60);
    } catch (error) {
      message.error(error?.response?.data?.message || 'Unable to resend verification email.');
    } finally {
      setResending(false);
    }
  };

  const isOtpComplete = otpCode.trim().length === 6;

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
            Confirm your email to activate your account and continue with your orders, wishlist, and checkout.
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
              {welcomeCoupon ? (
                <div className="mx-auto mt-6 max-w-md rounded-3xl border border-[#eadfca] bg-[#faf6ea] p-5 text-left">
                  <p className="text-xs uppercase tracking-[0.28em] text-gold">Welcome reward</p>
                  <h3 className="mt-2 text-xl font-semibold text-charcoal-700">{welcomeCoupon.code}</h3>
                  <p className="mt-2 text-sm leading-7 text-muted">{welcomeCoupon.message}</p>
                </div>
              ) : null}
              <Button type="primary" className="mt-6 !h-12 !rounded-full !border-0" onClick={() => navigate('/shop')}>
                Continue to shop
              </Button>
            </div>
          ) : status === 'error' ? (
            <div className="text-center py-4">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#fff1f2] text-[#ef4444]">
                <CloseCircleOutlined style={{ fontSize: 32 }} />
              </div>
              <p className="page-eyebrow">Verification failed</p>
              <h2 className="mt-3 text-3xl font-semibold text-charcoal-700">Code expired or invalid</h2>
              <p className="mt-2 text-sm leading-7 text-muted">{messageText}</p>
              <div className="mt-6 space-y-4">
                <Input
                  value={resolvedEmail}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="Enter your email"
                  className="!h-12 !rounded-full"
                />
                <Input
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                  inputMode="numeric"
                  className="!h-12 !rounded-full"
                />
                <Button type="primary" block className="!h-12 !rounded-full !border-0" onClick={verify} loading={verifying} disabled={verifying || !isOtpComplete}>
                  Verify email
                </Button>
                <Button
                  block
                  className="!h-12 !rounded-full"
                  onClick={resendVerification}
                  loading={resending}
                  disabled={resending || resendSeconds > 0}
                >
                  {resendSeconds > 0 ? `Resend available in ${resendSeconds}s` : 'Resend verification code'}
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#faf6ea] text-gold">
                <MailOutlined style={{ fontSize: 28 }} />
              </div>
              <p className="page-eyebrow">Verify account</p>
              <h2 className="mt-3 text-3xl font-semibold text-charcoal-700">Enter verification code</h2>
              <p className="mt-2 text-sm leading-7 text-muted">{messageText}</p>
              <div className="mt-6 space-y-4">
                <Input
                  value={resolvedEmail}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="Enter your email"
                  className="!h-12 !rounded-full"
                />
                <Input
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                  inputMode="numeric"
                  className="!h-12 !rounded-full"
                />
                <Button type="primary" block className="!h-12 !rounded-full !border-0" onClick={verify} loading={verifying} disabled={verifying || !isOtpComplete}>
                  Verify email
                </Button>
                <Button
                  block
                  className="!h-12 !rounded-full"
                  onClick={resendVerification}
                  loading={resending}
                  disabled={resending || resendSeconds > 0}
                >
                  {resendSeconds > 0 ? `Resend available in ${resendSeconds}s` : 'Resend verification code'}
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
