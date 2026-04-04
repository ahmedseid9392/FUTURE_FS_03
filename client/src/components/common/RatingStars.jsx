import CustomStar from './CustomStar';

const RatingStars = ({ rating, totalReviews, size = 'md', showCount = true }) => {
  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };
  
  const textSize = textSizes[size] || textSizes.md;
  
  // Calculate full stars and partial star
  const fullStars = Math.floor(rating);
  const partialStar = rating - fullStars;
  
  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, i) => {
          if (i < fullStars) {
            return <CustomStar key={i} filled={true} size={size} />;
          } else if (i === fullStars && partialStar > 0) {
            return <CustomStar key={i} partial={partialStar} size={size} />;
          } else {
            return <CustomStar key={i} filled={false} size={size} />;
          }
        })}
      </div>
      {showCount && totalReviews > 0 && (
        <span className={`${textSize} text-gray-500 ml-1`}>
          ({totalReviews} {totalReviews === 1 ? 'review' : 'reviews'})
        </span>
      )}
    </div>
  );
};

export default RatingStars;