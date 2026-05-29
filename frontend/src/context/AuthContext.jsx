import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pendingVerificationEmail, setPendingVerificationEmail] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const savedUser = localStorage.getItem('authUser');
    const pendingEmail = localStorage.getItem('pendingVerificationEmail') || '';
    setPendingVerificationEmail(pendingEmail);

    const hydrateUser = async () => {
      if (!token || !savedUser) {
        setIsLoading(false);
        return;
      }

      try {
        const parsedUser = JSON.parse(savedUser);
        const response = await authService.getCurrentUser();
        const currentUser = response.data?.data || parsedUser;
        setUser(currentUser);

        if (currentUser?.emailVerified === false && currentUser?.email) {
          setPendingVerificationEmail(currentUser.email);
          localStorage.setItem('pendingVerificationEmail', currentUser.email);
        }
      } catch (err) {
        console.error('Failed to validate saved auth session:', err);
        localStorage.removeItem('authToken');
        localStorage.removeItem('authUser');
      } finally {
        setIsLoading(false);
      }
    };

    if (token && savedUser) {
      void hydrateUser();
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await authService.login(email, password);
      const authData = response.data.data; // Backend returns { success, message, data }

      localStorage.setItem('authToken', authData.token);
      localStorage.setItem('authUser', JSON.stringify(authData.user));
      setUser(authData.user);

      return authData;
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await authService.register(userData);
      const verificationData = response.data.data;
      const email = verificationData?.email || userData.email;
      setPendingVerificationEmail(email);
      localStorage.setItem('pendingVerificationEmail', email);
      return verificationData;
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const completeExternalLogin = async (token) => {
    try {
      localStorage.setItem('authToken', token);
      const response = await authService.getCurrentUser();
      const currentUser = response.data?.data;
      if (currentUser) {
        localStorage.setItem('authUser', JSON.stringify(currentUser));
        setUser(currentUser);
        if (currentUser.emailVerified === false && currentUser.email) {
          setPendingVerificationEmail(currentUser.email);
          localStorage.setItem('pendingVerificationEmail', currentUser.email);
        }
      }
      return currentUser;
    } catch (err) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUser');
      throw err;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setError(null);
    setPendingVerificationEmail('');
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'ADMIN' || user?.role === 'admin';
  const needsVerification = user?.emailVerified === false;

  const value = {
    user,
    isAuthenticated,
    isAdmin,
    needsVerification,
    pendingVerificationEmail,
    isLoading,
    error,
    login,
    register,
    completeExternalLogin,
    logout,
    setError,
    setPendingVerificationEmail,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
