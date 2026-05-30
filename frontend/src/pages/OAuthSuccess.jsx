import React, { useEffect } from 'react';
import { Spin, message } from 'antd';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const OAuthSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { loginWithOAuth } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');

    const finishOAuth = async () => {
      if (!token) {
        message.error('Missing OAuth token.');
        navigate('/oauth-error?message=Missing OAuth token in callback URL', { replace: true });
        return;
      }

      try {
        localStorage.setItem('token', token);
        localStorage.setItem('authToken', token);

        const currentUser = await loginWithOAuth(token);
        message.success('Google login successful');

        const role = String(currentUser?.role || '').toUpperCase();
        if (role === 'ADMIN') {
          navigate('/admin/dashboard', { replace: true });
          return;
        }

        navigate('/', { replace: true });
      } catch (error) {
        const apiMessage = error?.response?.data?.message || error?.message || 'OAuth login failed';
        const normalized = String(apiMessage).toLowerCase();
        if (normalized.includes('expired') || normalized.includes('jwt')) {
          navigate(`/oauth-error?message=${encodeURIComponent('JWT is invalid or expired. Please login again.')}`, { replace: true });
          return;
        }
        navigate(`/oauth-error?message=${encodeURIComponent(apiMessage)}`, { replace: true });
      }
    };

    void finishOAuth();
  }, [searchParams, loginWithOAuth, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f5ef] px-4">
      <div className="text-center w-full max-w-sm rounded-2xl border border-[#eadfca] bg-white p-8 shadow-sm">
        <Spin size="large" />
        <p className="mt-4 text-gray-700">Finishing your Google sign-in...</p>
      </div>
    </div>
  );
};

export default OAuthSuccessPage;
