import React, { useEffect } from 'react';
import { Spin, message } from 'antd';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const OAuthSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { completeExternalLogin } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');

    const finishOAuth = async () => {
      if (!token) {
        message.error('Missing OAuth token.');
        navigate('/oauth-error?message=Missing OAuth token', { replace: true });
        return;
      }

      try {
        await completeExternalLogin(token);
        message.success('Google login successful');
        navigate('/shop', { replace: true });
      } catch (error) {
        const apiMessage = error?.response?.data?.message || 'OAuth login failed';
        navigate(`/oauth-error?message=${encodeURIComponent(apiMessage)}`, { replace: true });
      }
    };

    void finishOAuth();
  }, [searchParams, completeExternalLogin, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f5ef]">
      <div className="text-center">
        <Spin size="large" />
        <p className="mt-4 text-gray-700">Finishing your Google sign-in...</p>
      </div>
    </div>
  );
};

export default OAuthSuccessPage;
