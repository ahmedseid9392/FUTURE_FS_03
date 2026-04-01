import { FiUser } from 'react-icons/fi';

const UserAvatar = ({ user, size = 'md', className = '' }) => {
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
  
  // If user has profile image, show image
  if (user?.profileImage?.url) {
    return (
      <img
        src={user.profileImage.url}
        alt={user.name || 'User'}
        className={`${sizeClasses[size]} rounded-full object-cover ${className}`}
      />
    );
  }
  
  // Show initials if no image
  return (
    <div className={`${sizeClasses[size]} rounded-full bg-boutique-primary text-white flex items-center justify-center font-semibold ${className}`}>
      {getInitials()}
    </div>
  );
};

export default UserAvatar;