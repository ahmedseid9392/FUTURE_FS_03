import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiEye, FiEyeOff, FiLogIn } from 'react-icons/fi';
import GoogleLoginButton from '../components/auth/GoogleLoginButton';

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
        setTimeout(() => {
          if (result.data.user.role === 'admin') {
            navigate('/admin');
          } else {
            navigate('/');
          }
        }, 1000);
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
        
        {/* Google Login Button */}
        <GoogleLoginButton />
        
        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-dark-border"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-dark-card text-gray-500 dark:text-dark-textMuted">
              Or continue with email
            </span>
          </div>
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
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
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
          <p>test user:test@example.com</p>
          <p>pass:password123</p>
          <p>test admin:admin@jamsboutique.com</p>
          <p>pass:Admin@1</p>
        </form>
      </motion.div>
    </div>
  );
};

export default LoginPage;