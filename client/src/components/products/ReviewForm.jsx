import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FiSend } from 'react-icons/fi';
import RatingInput from '../common/RatingInput';
import toast from 'react-hot-toast';

const reviewSchema = z.object({
  rating: z.number().min(1, 'Please select a rating'),
  review: z.string().min(10, 'Review must be at least 10 characters').max(500, 'Review cannot exceed 500 characters')
});

const ReviewForm = ({ productId, onSubmit, onSuccess, loading = false }) => {
  const [rating, setRating] = useState(0);
  const [ratingError, setRatingError] = useState('');
  
  const { register, handleSubmit, formState: { errors }, reset, setValue, trigger, watch } = useForm({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 0,
      review: ''
    }
  });
  
  // Watch form values for debugging
  const watchRating = watch('rating');
  const watchReview = watch('review');
  
  useEffect(() => {
    console.log('Form rating value:', watchRating);
    console.log('Local rating state:', rating);
  }, [watchRating, rating]);
  
  const handleRatingChange = (value) => {
    console.log('⭐ Rating clicked:', value);
    setRating(value);
    setValue('rating', value, { shouldValidate: true });
    setRatingError('');
    trigger('rating');
  };
  
  const handleFormSubmit = async (data) => {
    console.log('📝 Form submitted with data:', data);
    console.log('Product ID:', productId);
    
    if (!data.rating || data.rating === 0) {
      setRatingError('Please select a rating');
      toast.error('Please select a rating');
      return;
    }
    
    const result = await onSubmit(productId, {
      rating: data.rating,
      review: data.review
    });
    
    console.log('Submit result:', result);
    
    if (result && result.success) {
      reset();
      setRating(0);
      setValue('rating', 0);
      setRatingError('');
      onSuccess?.();
      toast.success('Review submitted successfully!');
    } else {
      toast.error(result?.message || 'Failed to submit review');
    }
  };
  
  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-2">
          Your Rating *
        </label>
        <RatingInput
          value={rating}
          onChange={handleRatingChange}
          size="lg"
          disabled={loading}
        />
        {(ratingError || errors.rating) && (
          <p className="text-red-500 text-sm mt-1">{ratingError || errors.rating?.message}</p>
        )}
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-2">
          Your Review *
        </label>
        <textarea
          {...register('review')}
          rows="4"
          className="input-field"
          placeholder="Share your experience with this product..."
          disabled={loading}
        />
        {errors.review && (
          <p className="text-red-500 text-sm mt-1">{errors.review.message}</p>
        )}
      </div>
      
      <button
        type="submit"
        disabled={loading}
        className="btn-primary flex items-center gap-2"
      >
        {loading ? (
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
        ) : (
          <FiSend className="w-4 h-4" />
        )}
        Submit Review
      </button>
    </form>
  );
};

export default ReviewForm;