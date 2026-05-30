import React, { useEffect, useState } from 'react';
import { Button, message } from 'antd';
import { Link, useSearchParams } from 'react-router-dom';
import { Sparkles, Mail } from 'lucide-react';
import { authService } from '../services';
import { useAuth } from '../context/AuthContext';

const EmailVerificationRequiredPage = () => {
  const [searchParams] = useSearchParams();
  const { pendingVerificationEmail, setPendingVerificationEmail } = useAuth();
  const initialEmail = searchParams.get('email') || pendingVerificationEmail || '';
  const [email, setEmail] = useState(initialEmail);

  useEffect(() => {
    setEmail(initialEmail);
  }, [initialEmail]);

  const resendVerification = async () => {
    if (!email) {
      message.error('Please enter your email address first.');
      return;
    }

    try {
      await authService.resendVerificationEmail(email);
      setPendingVerificationEmail(email);
      message.success('Verification email sent again.');
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
          <p className="page-eyebrow text-white/70">Verification required</p>
          <h2 className="font-display text-5xl font-semibold leading-tight text-white">
            Please verify
            <span className="block text-gold">your email first.</span>
          </h2>
          <p className="max-w-md text-lg leading-8 text-white/72">
            Unverified accounts cannot sign in. Use the button below to resend the verification code.
          </p>
        </div>
      </aside>

      <main className="auth-card">
        <div className="auth-card-panel text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#faf6ea] text-gold">
            <Mail className="h-7 w-7" />
          </div>
          <p className="page-eyebrow">Email verification required</p>
          <h1 className="mt-3 text-3xl font-semibold text-charcoal-700">Please verify your email before login</h1>
          <p className="mt-2 text-sm leading-7 text-muted">{email || 'We sent a verification code to your account email.'}</p>

          <div className="mt-6 space-y-4">
            <Button type="primary" block className="!h-12 !rounded-full !border-0" onClick={resendVerification}>
              Resend verification code
            </Button>
            <Link to="/login" className="block text-sm text-muted no-underline hover:text-gold">Back to login</Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EmailVerificationRequiredPage;