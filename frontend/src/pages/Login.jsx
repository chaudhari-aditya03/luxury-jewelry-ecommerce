import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { EnvelopeIcon, LockClosedIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import MainLayout from '../layouts/MainLayout';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Alert from '../components/common/Alert';
import { useAuth } from '../context/AuthContext';
import { validateEmail } from '../utils/helpers';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [generalError, setGeneralError] = useState(null);
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data) => {
    try {
      setGeneralError(null);
      const authData = await login(data.email, data.password);
      
      // Redirect based on user role
      if (authData.user.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/account');
      }
    } catch (error) {
      setGeneralError(error.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <MainLayout>
      <div className="min-h-screen flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <div className="card p-8 md:p-12">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Welcome Back
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Sign in to your account to continue
              </p>
            </div>

            {/* Alert */}
            {generalError && (
              <Alert
                type="error"
                message={generalError}
                onClose={() => setGeneralError(null)}
                closeable
              />
            )}

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Email */}
              <Input
                label="Email Address"
                type="email"
                placeholder="you@example.com"
                icon={<EnvelopeIcon className="w-5 h-5 text-gray-400" />}
                error={errors.email?.message}
                {...register('email', {
                  required: 'Email is required',
                  validate: (value) =>
                    validateEmail(value) || 'Please enter a valid email',
                })}
              />

              {/* Password */}
              <div className="relative">
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  icon={<LockClosedIcon className="w-5 h-5 text-gray-400" />}
                  error={errors.password?.message}
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters',
                    },
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-10 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="w-5 h-5" />
                  ) : (
                    <EyeIcon className="w-5 h-5" />
                  )}
                </button>
              </div>

              {/* Remember & Forgot */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded" />
                  <span className="text-gray-600 dark:text-gray-400">
                    Remember me
                  </span>
                </label>
                <a
                  href="#forgot"
                  className="text-rose-gold-500 hover:text-rose-gold-600 font-medium"
                >
                  Forgot password?
                </a>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isLoading}
                className="w-full"
              >
                Sign In
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-white dark:bg-gray-800 text-gray-500">
                  or
                </span>
              </div>
            </div>

            {/* Demo Account */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-8">
    
            </div>

            {/* Sign Up Link */}
            <p className="text-center text-gray-600 dark:text-gray-400">
              Don't have an account?{' '}
              <Link
                to="/register"
                  className="text-rose-gold-500 hover:text-rose-gold-600 font-medium"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default LoginPage;
