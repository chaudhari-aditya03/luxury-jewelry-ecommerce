import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, authenticated, isLoading, needsVerification, user, pendingVerificationEmail } = useAuth();
  const userIsAuthenticated = typeof isAuthenticated === 'function' ? isAuthenticated() : (authenticated ?? isAuthenticated);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-gold-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!userIsAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (needsVerification) {
    return <Navigate to={`/verify-email-required?email=${encodeURIComponent(user?.email || pendingVerificationEmail || '')}`} replace />;
  }

  return children;
};

export default ProtectedRoute;
