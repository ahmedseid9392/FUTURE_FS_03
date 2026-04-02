import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { FiAlertCircle, FiPhone, FiMapPin, FiUser, FiMail } from 'react-icons/fi';
import toast from 'react-hot-toast';

const CheckoutGuard = ({ children }) => {
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const [missingFields, setMissingFields] = useState([]);
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Please login to proceed with checkout');
      navigate('/login');
      return;
    }

    // Check for required profile fields
    const missing = [];
    
    // Check phone number
    if (!user?.phone || user.phone.trim() === '') {
      missing.push('phone');
    }
    
    // Check address fields
    if (!user?.address?.street || user.address.street.trim() === '') {
      missing.push('street');
    }
    if (!user?.address?.city || user.address.city.trim() === '') {
      missing.push('city');
    }
    if (!user?.address?.state || user.address.state.trim() === '') {
      missing.push('state');
    }
    if (!user?.address?.zipCode || user.address.zipCode.trim() === '') {
      missing.push('zipCode');
    }
    if (!user?.address?.country || user.address.country.trim() === '') {
      missing.push('country');
    }

    setMissingFields(missing);

    if (missing.length > 0) {
      setShowWarning(true);
      toast.error('Please complete your profile information before checkout');
      // Redirect to profile page after 3 seconds
      setTimeout(() => {
        navigate('/profile', { state: { fromCheckout: true, missingFields: missing } });
      }, 3000);
    }
  }, [user, isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  if (missingFields.length > 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-bg px-4">
        <div className="max-w-md w-full bg-white dark:bg-dark-card rounded-2xl shadow-xl p-8 text-center">
          <div className="w-20 h-20 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiAlertCircle className="w-10 h-10 text-yellow-600" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            Profile Incomplete
          </h2>
          
          <p className="text-gray-600 dark:text-dark-textMuted mb-6">
            Please complete your profile information before proceeding to checkout.
          </p>
          
          <div className="bg-gray-50 dark:bg-dark-surface rounded-lg p-4 mb-6 text-left">
            <p className="font-semibold text-gray-700 dark:text-dark-text mb-3">
              Missing information:
            </p>
            <ul className="space-y-2">
              {missingFields.includes('phone') && (
                <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-dark-textMuted">
                  <FiPhone className="w-4 h-4 text-boutique-primary" />
                  Phone Number
                </li>
              )}
              {(missingFields.includes('street') || missingFields.includes('city') || 
                missingFields.includes('state') || missingFields.includes('zipCode') || 
                missingFields.includes('country')) && (
                <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-dark-textMuted">
                  <FiMapPin className="w-4 h-4 text-boutique-primary" />
                  Complete Shipping Address
                </li>
              )}
            </ul>
          </div>
          
          <div className="animate-pulse">
            <p className="text-sm text-gray-500">Redirecting to profile page...</p>
            <div className="w-full bg-gray-200 rounded-full h-1 mt-3">
              <div className="bg-boutique-primary h-1 rounded-full w-full animate-progress"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return children;
};

export default CheckoutGuard;