import { useState } from 'react';

// Simple SVG placeholder component
const DefaultAvatar = ({ size, initials }) => {
  const sizeClass = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg'
  };
  
  return (
    <div className={`${sizeClass[size]} rounded-full bg-boutique-primary text-white flex items-center justify-center font-semibold`}>
      {initials}
    </div>
  );
};

const UserAvatar = ({ user, size = 'md', className = '' }) => {
  const [imageError, setImageError] = useState(false);
  
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg'
  };
  
  const getInitials = () => {
    if (!user?.name) return 'U';
    return user.name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };
  
  // Check if user has profile image with valid URL
  const hasProfileImage = user?.profileImage?.url && user.profileImage.url !== '';
  
  // If user has profile image and no error, show image
  if (hasProfileImage && !imageError) {
    return (
      <img
        src={user.profileImage.url}
        alt={user.name || 'User'}
        className={`${sizeClasses[size]} rounded-full object-cover ${className}`}
        onError={() => {
          console.log('Avatar image failed to load:', user.profileImage.url);
          setImageError(true);
        }}
      />
    );
  }
  
  // Show initials if no image or image failed to load
  return <DefaultAvatar size={size} initials={getInitials()} />;
};

export default UserAvatar;