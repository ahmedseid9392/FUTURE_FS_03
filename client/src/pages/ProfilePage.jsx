import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';
import { authService } from '../services/authService';
import ProfileImageUpload from '../components/common/ProfileImageUpload';
import { 
  FiUser, 
  FiMail, 
  FiPhone, 
  FiMapPin, 
  FiSave, 
  FiLock,
  FiEye,
  FiEyeOff,
  FiEdit2,
  FiCheck
} from 'react-icons/fi';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().optional(),
  address: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zipCode: z.string().optional(),
    country: z.string().optional()
  }).optional()
});

const passwordSchema = z.object({
  currentPassword: z.string().min(6, 'Current password is required'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters'),
  confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, updateUser, isAuthenticated } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState(user?.profileImage || null);
  
  const { register, handleSubmit, formState: { errors }, setValue, reset } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      phone: user?.phone || '',
      address: {
        street: user?.address?.street || '',
        city: user?.address?.city || '',
        state: user?.address?.state || '',
        zipCode: user?.address?.zipCode || '',
        country: user?.address?.country || 'Ethiopia'
      }
    }
  });
  
  const { 
    register: registerPassword, 
    handleSubmit: handlePasswordSubmit, 
    formState: { errors: passwordErrors },
    reset: resetPassword
  } = useForm({
    resolver: zodResolver(passwordSchema)
  });
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);
  
  // Update form when user data changes
  useEffect(() => {
    if (user) {
      reset({
        name: user.name || '',
        phone: user.phone || '',
        address: {
          street: user.address?.street || '',
          city: user.address?.city || '',
          state: user.address?.state || '',
          zipCode: user.address?.zipCode || '',
          country: user.address?.country || 'Ethiopia'
        }
      });
      setProfileImage(user.profileImage || null);
    }
  }, [user, reset]);
  
  const onProfileSubmit = async (data) => {
    setLoading(true);
    try {
      const result = await authService.updateProfile(data);
      if (result.success) {
        updateUser(result.user);
        toast.success('Profile updated successfully!');
        setIsEditing(false);
      } else {
        toast.error(result.message || 'Failed to update profile');
      }
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };
  
  const onPasswordSubmit = async (data) => {
    setPasswordLoading(true);
    try {
      const result = await authService.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword
      });
      if (result.success) {
        toast.success('Password changed successfully!');
        setShowChangePassword(false);
        resetPassword();
      } else {
        toast.error(result.message || 'Failed to change password');
      }
    } catch (error) {
      toast.error('Failed to change password');
    } finally {
      setPasswordLoading(false);
    }
  };
  
 // Update the handleImageUpload function
const handleImageUpload = async (image) => {
  try {
    console.log('📸 Image uploaded:', image);
    
    if (!image) {
      // Image was removed
      const result = await authService.updateProfile({ 
        profileImage: { url: '', publicId: '' }
      });
      if (result.success) {
        updateUser(result.user);
        setProfileImage(null);
        toast.success('Profile image removed');
      }
      return;
    }
    
    // Update profile with new image
    const result = await authService.updateProfile({ 
      profileImage: image 
    });
    
    if (result.success) {
      console.log('✅ Profile updated with image:', result.user.profileImage);
      updateUser(result.user);
      setProfileImage(result.user.profileImage);
      toast.success('Profile image updated!');
    } else {
      toast.error(result.message || 'Failed to update profile image');
    }
  } catch (error) {
    console.error('Profile image update error:', error);
    toast.error('Failed to update profile image');
  }
};
  
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-boutique-primary"></div>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-playfair font-bold text-gray-900 dark:text-white mb-2">
            My Profile
          </h1>
          <p className="text-gray-600 dark:text-dark-textMuted">
            Manage your account information
          </p>
        </div>
        
        {/* Profile Image */}
        <div className="flex justify-center mb-8">
          <ProfileImageUpload
            currentImage={profileImage}
            onUploadComplete={handleImageUpload}
          />
        </div>
        
        {/* Profile Information Card */}
        <div className="bg-white dark:bg-dark-card rounded-lg shadow-sm border border-gray-200 dark:border-dark-border overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-dark-border flex justify-between items-center">
            <div className="flex items-center gap-2">
              <FiUser className="w-5 h-5 text-boutique-primary" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Personal Information
              </h2>
            </div>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="text-boutique-primary hover:underline flex items-center gap-1"
              >
                <FiEdit2 className="w-4 h-4" />
                Edit
              </button>
            ) : (
              <button
                onClick={() => {
                  setIsEditing(false);
                  reset();
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                Cancel
              </button>
            )}
          </div>
          
          <div className="p-6">
            {!isEditing ? (
              // View Mode
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-dark-textMuted mb-1">
                      Full Name
                    </label>
                    <p className="text-gray-900 dark:text-white">{user.name}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-dark-textMuted mb-1">
                      Email Address
                    </label>
                    <p className="text-gray-900 dark:text-white">{user.email}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-dark-textMuted mb-1">
                      Phone Number
                    </label>
                    <p className="text-gray-900 dark:text-white">{user.phone || 'Not provided'}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-dark-textMuted mb-1">
                      Member Since
                    </label>
                    <p className="text-gray-900 dark:text-white">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                {/* Address */}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-500 dark:text-dark-textMuted mb-1">
                    Shipping Address
                  </label>
                  {user.address?.street ? (
                    <p className="text-gray-900 dark:text-white">
                      {user.address.street}<br />
                      {user.address.city}, {user.address.state} {user.address.zipCode}<br />
                      {user.address.country}
                    </p>
                  ) : (
                    <p className="text-gray-500 italic">No address added yet</p>
                  )}
                </div>
              </div>
            ) : (
              // Edit Mode
              <form onSubmit={handleSubmit(onProfileSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      {...register('name')}
                      className="input-field"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={user.email}
                      disabled
                      className="input-field bg-gray-100 dark:bg-dark-surface cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      {...register('phone')}
                      className="input-field"
                      placeholder="+251 911 234 567"
                    />
                  </div>
                </div>
                
                {/* Address Fields */}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-2">
                    Address
                  </label>
                  <div className="space-y-3">
                    <input
                      type="text"
                      {...register('address.street')}
                      className="input-field"
                      placeholder="Street Address"
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <input
                        type="text"
                        {...register('address.city')}
                        className="input-field"
                        placeholder="City"
                      />
                      <input
                        type="text"
                        {...register('address.state')}
                        className="input-field"
                        placeholder="State/Province"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <input
                        type="text"
                        {...register('address.zipCode')}
                        className="input-field"
                        placeholder="ZIP / Postal Code"
                      />
                      <input
                        type="text"
                        {...register('address.country')}
                        className="input-field"
                        placeholder="Country"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary flex items-center gap-2"
                  >
                    {loading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <FiSave className="w-4 h-4" />
                    )}
                    Save Changes
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
        
        {/* Change Password Card */}
        <div className="bg-white dark:bg-dark-card rounded-lg shadow-sm border border-gray-200 dark:border-dark-border overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-dark-border flex justify-between items-center">
            <div className="flex items-center gap-2">
              <FiLock className="w-5 h-5 text-boutique-primary" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Security
              </h2>
            </div>
            {!showChangePassword ? (
              <button
                onClick={() => setShowChangePassword(true)}
                className="text-boutique-primary hover:underline flex items-center gap-1"
              >
                <FiEdit2 className="w-4 h-4" />
                Change Password
              </button>
            ) : (
              <button
                onClick={() => {
                  setShowChangePassword(false);
                  resetPassword();
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                Cancel
              </button>
            )}
          </div>
          
          <div className="p-6">
            {!showChangePassword ? (
              <div className="text-center py-4">
                <FiLock className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                <p className="text-gray-600 dark:text-dark-textMuted">
                  Keep your account secure by changing your password regularly.
                </p>
              </div>
            ) : (
              <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-1">
                    Current Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      {...registerPassword('currentPassword')}
                      className="input-field pr-10"
                      placeholder="Enter current password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    >
                      {showCurrentPassword ? (
                        <FiEyeOff className="w-4 h-4 text-gray-400" />
                      ) : (
                        <FiEye className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                  {passwordErrors.currentPassword && (
                    <p className="text-red-500 text-sm mt-1">{passwordErrors.currentPassword.message}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-1">
                    New Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      {...registerPassword('newPassword')}
                      className="input-field pr-10"
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    >
                      {showNewPassword ? (
                        <FiEyeOff className="w-4 h-4 text-gray-400" />
                      ) : (
                        <FiEye className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                  {passwordErrors.newPassword && (
                    <p className="text-red-500 text-sm mt-1">{passwordErrors.newPassword.message}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Password must be at least 6 characters
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-1">
                    Confirm New Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      {...registerPassword('confirmPassword')}
                      className="input-field pr-10"
                      placeholder="Confirm new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    >
                      {showConfirmPassword ? (
                        <FiEyeOff className="w-4 h-4 text-gray-400" />
                      ) : (
                        <FiEye className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                  {passwordErrors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">{passwordErrors.confirmPassword.message}</p>
                  )}
                </div>
                
                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={passwordLoading}
                    className="btn-primary flex items-center gap-2"
                  >
                    {passwordLoading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <FiCheck className="w-4 h-4" />
                    )}
                    Update Password
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfilePage;