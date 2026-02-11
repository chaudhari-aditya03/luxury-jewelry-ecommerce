import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { UserIcon, EnvelopeIcon, LockClosedIcon, PhoneIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import MainLayout from '../layouts/MainLayout';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Alert from '../components/common/Alert';
import { useAuth } from '../context/AuthContext';
import { validateEmail, validatePassword, validatePhone } from '../utils/helpers';

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [generalError, setGeneralError] = useState(null);
  const navigate = useNavigate();
  const { register: registerUser, isLoading } = useAuth();
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
    },
  });

  const password = watch('password');

  const onSubmit = async (data) => {
    try {
      setGeneralError(null);
      await registerUser({
        fullName: `${data.firstName} ${data.lastName}`,
        email: data.email,
        phone: data.phone,
        password: data.password,
      });
      navigate('/account');
    } catch (error) {
      setGeneralError(error.response?.data?.message || 'Registration failed. Please try again.');
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
                Create Account
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Join us to start shopping
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
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Name Row */}
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="First Name"
                  placeholder=""
                  error={errors.firstName?.message}
                  {...register('firstName', {
                    required: 'First name is required',
                    minLength: {
                      value: 2,
                      message: 'Must be at least 2 characters',
                    },
                  })}
                />
                <Input
                  label="Last Name"
                  placeholder=""
                  error={errors.lastName?.message}
                  {...register('lastName', {
                    required: 'Last name is required',
                    minLength: {
                      value: 2,
                      message: 'Must be at least 2 characters',
                    },
                  })}
                />
              </div>

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

              {/* Phone */}
              <Input
                label="Phone Number"
                placeholder="+91"
                icon={<PhoneIcon className="w-5 h-5 text-gray-400" />}
                error={errors.phone?.message}
                {...register('phone', {
                  required: 'Phone is required',
                  validate: (value) =>
                    validatePhone(value) || 'Please enter a valid 10-digit phone',
                })}
              />

              {/* Password */}
              <div className="relative">
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  icon={<LockClosedIcon className="w-5 h-5 text-gray-400" />}
                  helperText="At least 8 characters, 1 uppercase, 1 lowercase, 1 number"
                  error={errors.password?.message}
                  {...register('password', {
                    required: 'Password is required',
                    validate: (value) =>
                      validatePassword(value) || 'Password does not meet requirements',
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

              {/* Confirm Password */}
              <Input
                label="Confirm Password"
                type="password"
                placeholder="••••••••"
                error={errors.confirmPassword?.message}
                {...register('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: (value) =>
                    value === password || 'Passwords do not match',
                })}
              />

              {/* Terms */}
              <label className="flex items-start gap-3 text-sm">
                <input type="checkbox" className="mt-1" />
                <span className="text-gray-600 dark:text-gray-400">
                  I agree to the{' '}
                  <a href="#terms" className="text-rose-gold-500 hover:underline">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="#privacy" className="text-rose-gold-500 hover:underline">
                    Privacy Policy
                  </a>
                </span>
              </label>

              {/* Submit */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isLoading}
                className="w-full"
              >
                Create Account
              </Button>
            </form>

            {/* Sign In Link */}
            <p className="text-center text-gray-600 dark:text-gray-400 mt-6">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-rose-gold-500 hover:text-rose-gold-600 font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default RegisterPage;
