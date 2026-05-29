import React from 'react';
import { Button } from 'antd';
import { useNavigate, useSearchParams } from 'react-router-dom';

const OAuthErrorPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const errorMessage = searchParams.get('message') || 'OAuth login failed.';

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f5ef] px-4">
      <div className="max-w-xl w-full bg-white rounded-2xl shadow-sm border border-[#eadfca] p-8 text-center">
        <h1 className="text-2xl font-semibold text-[#2b2622]">Google Sign-In Failed</h1>
        <p className="mt-4 text-sm text-gray-600">Google login failed.</p>
        <p className="mt-2 text-xs text-gray-500 break-words">{errorMessage}</p>
        <div className="mt-6 flex justify-center gap-3">
          <Button onClick={() => navigate('/login', { replace: true })}>Back to Login</Button>
          <Button type="primary" onClick={() => navigate('/login', { replace: true })}>Try Again</Button>
        </div>
      </div>
    </div>
  );
};

export default OAuthErrorPage;
