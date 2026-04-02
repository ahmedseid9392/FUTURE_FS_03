import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiAlertCircle, FiX, FiArrowRight } from 'react-icons/fi';
import { useAuthStore } from '../../store/authStore';

const ProfileCompletionAlert = () => {
  const { user } = useAuthStore();
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(true);
  const [missingFields, setMissingFields] = useState([]);

  useEffect(() => {
    // Check for missing profile fields
    const missing = [];
    
    if (!user?.phone || user.phone.trim() === '') {
      missing.push('Phone Number');
    }
    
    if (!user?.address?.street || user.address.street.trim() === '') {
      missing.push('Street Address');
    }
    if (!user?.address?.city || user.address.city.trim() === '') {
      missing.push('City');
    }
    if (!user?.address?.state || user.address.state.trim() === '') {
      missing.push('State');
    }
    if (!user?.address?.zipCode || user.address.zipCode.trim() === '') {
      missing.push('ZIP Code');
    }
    
    setMissingFields(missing);
    
    // Auto-hide after 10 seconds
    const timer = setTimeout(() => setIsVisible(false), 10000);
    return () => clearTimeout(timer);
  }, [user]);

  // Don't show on profile page or if no missing fields
  if (location.pathname === '/profile' || missingFields.length === 0 || !isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 rounded-lg shadow-lg p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <FiAlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-yellow-800 dark:text-yellow-400">
                Complete Your Profile
              </h4>
              <p className="text-xs text-yellow-700 dark:text-yellow-500 mt-1">
                Please add the following information to enable checkout:
              </p>
              <ul className="text-xs text-yellow-700 dark:text-yellow-500 mt-2 space-y-1">
                {missingFields.slice(0, 3).map((field, index) => (
                  <li key={index}>• {field}</li>
                ))}
                {missingFields.length > 3 && (
                  <li>• +{missingFields.length - 3} more</li>
                )}
              </ul>
              <Link
                to="/profile"
                className="inline-flex items-center gap-1 mt-3 text-xs font-medium text-yellow-800 dark:text-yellow-400 hover:underline"
              >
                Complete Now
                <FiArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="text-yellow-600 hover:text-yellow-800"
          >
            <FiX className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileCompletionAlert;