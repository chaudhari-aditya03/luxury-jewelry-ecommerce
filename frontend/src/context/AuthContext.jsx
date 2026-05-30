import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pendingVerificationEmail, setPendingVerificationEmail] = useState('');

  const persistAuthState = (token, currentUser) => {
    if (token) {
      localStorage.setItem('token', token);
      localStorage.setItem('authToken', token);
    }

    if (currentUser) {
      localStorage.setItem('authUser', JSON.stringify(currentUser));
      localStorage.setItem('user', JSON.stringify(currentUser));
      if (currentUser.role) {
        localStorage.setItem('role', currentUser.role);
      }
      if (currentUser.email) {
        localStorage.setItem('email', currentUser.email);
      }
      if (currentUser.profilePicture) {
        localStorage.setItem('profileImage', currentUser.profilePicture);
      }
    }
  };

  const clearAuthState = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    localStorage.removeItem('email');
    localStorage.removeItem('profileImage');
    localStorage.removeItem('pendingVerificationEmail');
  };

  const loadCurrentUser = async () => {
    const response = await authService.getCurrentUser();
    const currentUser = response.data?.data;

    if (!currentUser) {
      throw new Error('Unable to load current user');
    }

    setUser(currentUser);
    persistAuthState(localStorage.getItem('authToken') || localStorage.getItem('token'), currentUser);

    if (currentUser?.emailVerified === false && currentUser?.email) {
      setPendingVerificationEmail(currentUser.email);
      localStorage.setItem('pendingVerificationEmail', currentUser.email);
    }

    return currentUser;
  };

  useEffect(() => {
    const token = localStorage.getItem('authToken') || localStorage.getItem('token');
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
        persistAuthState(token, currentUser);

        if (currentUser?.emailVerified === false && currentUser?.email) {
          setPendingVerificationEmail(currentUser.email);
          localStorage.setItem('pendingVerificationEmail', currentUser.email);
        }
      } catch (err) {
        console.error('Failed to validate saved auth session:', err);
        clearAuthState();
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

      persistAuthState(authData.token, authData.user);
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
      const response = await authService.sendOtp(userData);
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

  const loginWithOAuth = async (token) => {
    try {
      setError(null);
      persistAuthState(token, null);
      return await loadCurrentUser();
    } catch (err) {
      clearAuthState();
      setUser(null);
      throw err;
    }
  };

  const completeExternalLogin = async (token) => loginWithOAuth(token);

  const logout = () => {
    authService.logout();
    clearAuthState();
    setUser(null);
    setError(null);
    setPendingVerificationEmail('');
  };

  const isAuthenticated = () => !!user;
  const authenticated = !!user;
  const isAdmin = user?.role === 'ADMIN' || user?.role === 'admin';
  const needsVerification = user?.emailVerified === false;

  const value = {
    user,
    isAuthenticated,
    authenticated,
    isAdmin,
    needsVerification,
    pendingVerificationEmail,
    isLoading,
    error,
    login,
    loginWithOAuth,
    register,
    loadCurrentUser,
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
