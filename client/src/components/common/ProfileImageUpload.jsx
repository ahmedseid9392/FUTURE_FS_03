import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FiCamera, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../../services/api';

// Simple SVG placeholder (no external URL)
const DefaultAvatar = ({ size = 128 }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 128 128" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className="w-full h-full"
  >
    <rect width="128" height="128" fill="#D4AF37" />
    <circle cx="64" cy="48" r="24" fill="white" />
    <path d="M96 96C96 88 96 80 64 80C32 80 32 88 32 96H96Z" fill="white" />
  </svg>
);

const ProfileImageUpload = ({ currentImage, onUploadComplete }) => {
  const [uploading, setUploading] = useState(false);
  const [image, setImage] = useState(currentImage);
  const [imageError, setImageError] = useState(false);

  const onDrop = async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;
    
    const file = acceptedFiles[0];
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Only image files are allowed');
      return;
    }
    
    setUploading(true);
    
    const formData = new FormData();
    formData.append('image', file);
    
    try {
      console.log('📤 Uploading profile image...');
      // Use the new profile upload endpoint (no admin restriction)
      const response = await api.post('/upload/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      console.log('📥 Upload response:', response.data);
      
      if (response.data.success) {
        const uploadedImage = response.data.data;
        console.log('✅ Uploaded image data:', uploadedImage);
        
        // Update local state
        setImage(uploadedImage);
        setImageError(false);
        
        // Call the callback with the uploaded image data
        onUploadComplete?.(uploadedImage);
        toast.success('Profile image uploaded successfully!');
      } else {
        toast.error(response.data.message || 'Upload failed');
      }
    } catch (error) {
      console.error('❌ Upload error:', error);
      console.error('Error response:', error.response?.data);
      toast.error(error.response?.data?.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxFiles: 1,
    disabled: uploading
  });

  // Get image URL safely
  const hasImage = image?.url && image.url !== '';
  const imageUrl = hasImage ? image.url : null;

  return (
    <div className="relative inline-block">
      <div
        {...getRootProps()}
        className={`relative w-32 h-32 rounded-full overflow-hidden cursor-pointer group ${
          uploading ? 'opacity-50 cursor-not-allowed' : ''
        } ${isDragActive ? 'ring-2 ring-boutique-primary' : ''}`}
      >
        <input {...getInputProps()} disabled={uploading} />
        
        {/* Show image if exists and no error */}
        {imageUrl && !imageError ? (
          <img
            src={imageUrl}
            alt="Profile"
            className="w-full h-full object-cover"
            onError={() => {
              console.log('❌ Image failed to load:', imageUrl);
              setImageError(true);
            }}
            onLoad={() => {
              console.log('✅ Image loaded successfully:', imageUrl);
            }}
          />
        ) : (
          <DefaultAvatar size={128} />
        )}
        
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <FiCamera className="w-8 h-8 text-white" />
        </div>
        
        {/* Uploading spinner */}
        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        )}
      </div>
      
      {/* Remove button */}
      {hasImage && !uploading && (
        <button
          onClick={async (e) => {
            e.stopPropagation();
            if (window.confirm('Remove profile image?')) {
              try {
                const response = await api.put('/auth/profile', {
                  profileImage: { url: '', publicId: '' }
                });
                if (response.data.success) {
                  setImage(null);
                  setImageError(false);
                  onUploadComplete?.(null);
                  toast.success('Profile image removed');
                }
              } catch (error) {
                toast.error('Failed to remove image');
              }
            }
          }}
          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
        >
          <FiX className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default ProfileImageUpload;