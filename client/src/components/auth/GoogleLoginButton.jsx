import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';

const GoogleLoginButton = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser, setToken } = useAuthStore();

  const handleGoogleLogin = () => {
    setLoading(true);
    // Open Google OAuth popup
    window.location.href = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/auth/google`;
  };

  return (
    <button
      type="button"
      onClick={handleGoogleLogin}
      disabled={loading}
      className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-card text-gray-700 dark:text-dark-text hover:bg-gray-50 dark:hover:bg-dark-surface transition-colors disabled:opacity-50"
    >
      {loading ? (
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-boutique-primary"></div>
      ) : (
        <FcGoogle className="w-5 h-5" />
      )}
      <span>Continue with Google</span>
    </button>
  );
};

export default GoogleLoginButton;