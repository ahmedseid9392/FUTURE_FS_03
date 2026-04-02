import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { authService } from '../services/authService';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiPhone, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { useAuthStore } from '../store/authStore';
import GoogleLoginButton from '../components/auth/GoogleLoginButton';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  phone: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const RegisterPage = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { register: registerUser } = useAuthStore();
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  
  const { register, handleSubmit, formState: { errors }, setError } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: ''
    }
  });
  
  const onSubmit = async (data) => {
  setLoading(true);
  try {
    // Remove confirmPassword as it's not needed by backend
    const { confirmPassword, ...userData } = data;
    
    // Ensure phone is sent as string, not undefined
    const registrationData = {
      name: userData.name,
      email: userData.email.toLowerCase(),
      password: userData.password,
      phone: userData.phone || '',
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'Ethiopia'
      }
    };
    
    console.log('📤 Sending to backend:', registrationData);
    
    const result = await registerUser(registrationData);
    
    if (result.success) {
      toast.success('Registration successful! Welcome to Jams Boutique!');
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } else {
      // Handle validation errors from backend
      if (result.errors && Array.isArray(result.errors)) {
        result.errors.forEach(err => {
          if (err.path && err.path[0]) {
            setError(err.path[0], {
              type: 'manual',
              message: err.msg
            });
          }
        });
        toast.error('Please fix the validation errors');
      } else if (result.message.includes('email already exists')) {
        setError('email', {
          type: 'manual',
          message: 'This email is already registered. Please login instead.'
        });
        toast.error('Email already exists. Please login.');
      } else {
        toast.error(result.message || 'Registration failed. Please try again.');
      }
    }
  } catch (error) {
    console.error('Registration error:', error);
    toast.error('Network error. Please check your connection.');
  } finally {
    setLoading(false);
  }
};
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-dark-bg dark:to-dark-surface py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-8 bg-white dark:bg-dark-card rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-dark-border"
      >
        {/* Header */}
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
            className="mx-auto h-12 w-12 bg-boutique-primary rounded-full flex items-center justify-center mb-4"
          >
            <FiUser className="h-6 w-6 text-white" />
          </motion.div>
          <h2 className="text-3xl font-playfair font-bold text-gray-900 dark:text-white">
            Create Account
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-dark-textMuted">
            Join Jams Boutique and discover unique fashion pieces
          </p>
        </div>
        {/* Google Sign Up Button */}
     <GoogleLoginButton />
     
{/* Divider */}
<div className="relative">
  <div className="absolute inset-0 flex items-center">
    <div className="w-full border-t border-gray-300 dark:border-dark-border"></div>
  </div>
  <div className="relative flex justify-center text-sm">
    <span className="px-2 bg-white dark:bg-dark-card text-gray-500 dark:text-dark-textMuted">
      Or sign up with email
    </span>
  </div>
</div>
        
        {/* Form */}
        <form className="mt-8 space-y-5" onSubmit={handleSubmit(onSubmit)}>
          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-1">
              Full Name *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiUser className="h-5 w-5 text-gray-400 dark:text-dark-textMuted" />
              </div>
              <input
                id="name"
                type="text"
                {...register('name')}
                className="input-field pl-10"
                placeholder="John Doe"
                disabled={loading}
                autoComplete="name"
              />
            </div>
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>
          
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-1">
              Email Address *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiMail className="h-5 w-5 text-gray-400 dark:text-dark-textMuted" />
              </div>
              <input
                id="email"
                type="email"
                {...register('email')}
                className="input-field pl-10"
                placeholder="you@example.com"
                disabled={loading}
                autoComplete="email"
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>
          
          {/* Phone Field (Optional) */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-1">
              Phone Number (Optional)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiPhone className="h-5 w-5 text-gray-400 dark:text-dark-textMuted" />
              </div>
              <input
                id="phone"
                type="tel"
                {...register('phone')}
                className="input-field pl-10"
                placeholder="+251 911 234 567"
                disabled={loading}
                autoComplete="tel"
              />
            </div>
          </div>
          
          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-1">
              Password *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiLock className="h-5 w-5 text-gray-400 dark:text-dark-textMuted" />
              </div>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                {...register('password')}
                className="input-field pl-10 pr-10"
                placeholder="••••••"
                disabled={loading}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? (
                  <FiEyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:text-dark-textMuted" />
                ) : (
                  <FiEye className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:text-dark-textMuted" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
            <p className="text-xs text-gray-500 dark:text-dark-textMuted mt-1">
              Must be at least 6 characters with letters and numbers
            </p>
          </div>
          
          {/* Confirm Password Field */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-1">
              Confirm Password *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiLock className="h-5 w-5 text-gray-400 dark:text-dark-textMuted" />
              </div>
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                {...register('confirmPassword')}
                className="input-field pl-10 pr-10"
                placeholder="••••••"
                disabled={loading}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showConfirmPassword ? (
                  <FiEyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:text-dark-textMuted" />
                ) : (
                  <FiEye className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:text-dark-textMuted" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
            )}
          </div>
          
          {/* Terms and Conditions */}
          <div className="flex items-center">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              required
              className="h-4 w-4 text-boutique-primary focus:ring-boutique-primary border-gray-300 rounded"
              disabled={loading}
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-gray-700 dark:text-dark-text">
              I agree to the{' '}
              <a href="#" className="text-boutique-primary hover:underline">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="text-boutique-primary hover:underline">
                Privacy Policy
              </a>
            </label>
          </div>
          
          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3 text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating account...
              </div>
            ) : (
              'Create Account'
            )}
          </motion.button>
          
          {/* Sign In Link */}
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-dark-textMuted">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-boutique-primary hover:underline">
                Sign in here
              </Link>
            </p>
          </div>
        </form>
        
        {/* Features Section */}
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-dark-border">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-boutique-primary text-sm font-semibold">✓ Free Shipping</div>
              <div className="text-xs text-gray-500 dark:text-dark-textMuted">On orders over $50</div>
            </div>
            <div className="text-center">
              <div className="text-boutique-primary text-sm font-semibold">✓ Secure Checkout</div>
              <div className="text-xs text-gray-500 dark:text-dark-textMuted">100% secure payment</div>
            </div>
            <div className="text-center">
              <div className="text-boutique-primary text-sm font-semibold">✓ Easy Returns</div>
              <div className="text-xs text-gray-500 dark:text-dark-textMuted">30-day return policy</div>
            </div>
            <div className="text-center">
              <div className="text-boutique-primary text-sm font-semibold">✓ Support 24/7</div>
              <div className="text-xs text-gray-500 dark:text-dark-textMuted">Customer support</div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;