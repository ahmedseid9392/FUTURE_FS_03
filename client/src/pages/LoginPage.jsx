import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiEye, FiEyeOff, FiLogIn } from 'react-icons/fi';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuthStore();
  
  const { register, handleSubmit, formState: { errors }, setError } = useForm({
    resolver: zodResolver(loginSchema),
  });
  
  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const result = await login(data);
      
      if (result.success) {
        toast.success(`Welcome back, ${result.data.user.name}!`);
        // Redirect based on user role
        if (result.data.user.role === 'admin') {
          setTimeout(() => {
            navigate('/admin');
          }, 1000);
        } else {
          setTimeout(() => {
            navigate('/');
          }, 1000);
        }
      } else {
        if (result.message.includes('Invalid email or password')) {
          setError('password', {
            type: 'manual',
            message: 'Invalid email or password'
          });
          toast.error('Invalid email or password. Please try again.');
        } else if (result.message.includes('deactivated')) {
          toast.error('Your account has been deactivated. Please contact support.');
        } else {
          toast.error(result.message || 'Login failed. Please try again.');
        }
      }
    } catch (error) {
      console.error('Login error:', error);
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
            <FiLogIn className="h-6 w-6 text-white" />
          </motion.div>
          <h2 className="text-3xl font-playfair font-bold text-gray-900 dark:text-white">
            Welcome Back
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-dark-textMuted">
            Sign in to your Jams Boutique account
          </p>
        </div>
        
        {/* Form */}
        <form className="mt-8 space-y-5" onSubmit={handleSubmit(onSubmit)}>
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-1">
              Email Address
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
          
          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-1">
              Password
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
                autoComplete="current-password"
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
          </div>
          
          {/* Forgot Password Link */}
          <div className="flex items-center justify-end">
            <Link to="/forgot-password" className="text-sm text-boutique-primary hover:underline">
              Forgot password?
            </Link>
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
                Signing in...
              </div>
            ) : (
              'Sign In'
            )}
          </motion.button>
          
          {/* Register Link */}
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-dark-textMuted">
              Don't have an account?{' '}
              <Link to="/register" className="font-medium text-boutique-primary hover:underline">
                Create an account
              </Link>
            </p>
          </div>
        </form>
        
        {/* Demo Credentials */}
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-dark-border">
          <p className="text-xs text-center text-gray-500 dark:text-dark-textMuted mb-2">
            Demo Credentials:
          </p>
          <div className="text-xs text-center text-gray-500 dark:text-dark-textMuted space-y-1">
            <p>Email: test@example.com</p>
            <p>Password: password123</p>
            <p className="text-boutique-primary text-[10px] mt-1">* Create an account first using register page</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;