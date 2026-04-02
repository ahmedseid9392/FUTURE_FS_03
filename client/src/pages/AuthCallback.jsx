import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

const AuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser, setToken } = useAuthStore();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const userParam = params.get('user');
    const error = params.get('error');

    if (error) {
      toast.error('Google authentication failed. Please try again.');
      navigate('/login');
      return;
    }

    if (token && userParam) {
      try {
        const user = JSON.parse(decodeURIComponent(userParam));
        setToken(token);
        setUser(user);
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        toast.success(`Welcome, ${user.name}!`);
        
        // Redirect based on role
        if (user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        toast.error('Authentication failed');
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
  }, [location, navigate, setUser, setToken]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-boutique-primary mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-dark-textMuted">Completing sign in...</p>
      </div>
    </div>
  );
};

export default AuthCallback;