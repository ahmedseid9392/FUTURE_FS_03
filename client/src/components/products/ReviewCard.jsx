import { useState } from 'react';
import { FiThumbsUp, FiThumbsDown, FiFlag, FiUser } from 'react-icons/fi';
import RatingStars from '../common/RatingStars';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';

const ReviewCard = ({ review, onHelpful, onReport }) => {
  const { user } = useAuthStore();
  const [helpfulClicked, setHelpfulClicked] = useState(false);
  
  const handleHelpful = () => {
    if (!user) {
      toast.error('Please login to mark reviews as helpful');
      return;
    }
    setHelpfulClicked(true);
    onHelpful?.(review._id);
  };
  
  const handleReport = () => {
    if (!user) {
      toast.error('Please login to report reviews');
      return;
    }
    if (window.confirm('Are you sure you want to report this review?')) {
      onReport?.(review._id);
      toast.success('Review reported. We will review it shortly.');
    }
  };
  
  // Get reviewer name - handle both populated and unpopulated user
  const reviewerName = review.user?.name || 
                       (typeof review.user === 'object' ? review.user?.name : null) || 
                       'Verified Customer';
  
  // Get reviewer initial
  const reviewerInitial = reviewerName.charAt(0).toUpperCase();
  
  return (
    <div className="border-b border-gray-200 dark:border-dark-border py-4 last:border-0">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-boutique-primary to-boutique-accent rounded-full flex items-center justify-center text-white font-bold shadow-md">
            {reviewerInitial}
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-white">
              {reviewerName}
            </p>
            <RatingStars rating={review.rating} size="sm" showCount={false} />
          </div>
        </div>
        <p className="text-xs text-gray-500">
          {review.date ? new Date(review.date).toLocaleDateString() : 'Recent'}
        </p>
      </div>
      
      <p className="text-gray-600 dark:text-dark-textMuted mt-3">
        {review.review}
      </p>
      
      <div className="flex items-center gap-4 mt-3">
        <button
          onClick={handleHelpful}
          disabled={helpfulClicked}
          className="flex items-center gap-1 text-xs text-gray-500 hover:text-green-600 transition-colors disabled:opacity-50"
        >
          <FiThumbsUp className="w-3 h-3" />
          Helpful
        </button>
        <button
          onClick={handleReport}
          className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-600 transition-colors"
        >
          <FiFlag className="w-3 h-3" />
          Report
        </button>
      </div>
    </div>
  );
};

export default ReviewCard;