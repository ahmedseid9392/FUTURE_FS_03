import { useState } from 'react';
import { FiStar } from 'react-icons/fi';

const RatingInput = ({ value, onChange, size = 'md', disabled = false }) => {
  const [hover, setHover] = useState(0);
  
  const sizes = {
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };
  
  const starSize = sizes[size] || sizes.md;
  
  const handleRatingClick = (ratingValue) => {
    console.log('🔘 Star clicked:', ratingValue);
    console.log('Disabled:', disabled);
    console.log('OnChange exists:', !!onChange);
    
    if (!disabled && onChange) {
      onChange(ratingValue);
    }
  };
  
  const handleMouseEnter = (star) => {
    if (!disabled) {
      console.log('🐭 Mouse enter:', star);
      setHover(star);
    }
  };
  
  const handleMouseLeave = () => {
    if (!disabled) {
      console.log('🐭 Mouse leave');
      setHover(0);
    }
  };
  
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => handleRatingClick(star)}
          onMouseEnter={() => handleMouseEnter(star)}
          onMouseLeave={handleMouseLeave}
          disabled={disabled}
          className="focus:outline-none transition-transform hover:scale-110"
          aria-label={`Rate ${star} stars`}
        >
          <FiStar
            className={`${starSize} transition-colors ${
              (hover || value) >= star
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            } ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
          />
        </button>
      ))}
    </div>
  );
};

export default RatingInput;