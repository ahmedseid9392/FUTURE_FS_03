import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FiCamera, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../../services/api';

const ProfileImageUpload = ({ currentImage, onUploadComplete }) => {
  const [uploading, setUploading] = useState(false);
  const [image, setImage] = useState(currentImage);

  const onDrop = async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;
    
    setUploading(true);
    
    const formData = new FormData();
    formData.append('image', acceptedFiles[0]);
    
    try {
      // Send type=profile to specify folder
      const response = await api.post('/upload?type=profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      if (response.data.success) {
        setImage(response.data.data);
        onUploadComplete?.(response.data.data);
        toast.success('Profile image updated successfully');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxFiles: 1
  });

  return (
    <div className="relative inline-block">
      <div
        {...getRootProps()}
        className={`relative w-32 h-32 rounded-full overflow-hidden cursor-pointer group ${
          uploading ? 'opacity-50' : ''
        }`}
      >
        <input {...getInputProps()} disabled={uploading} />
        <img
          src={image?.url || 'https://via.placeholder.com/128'}
          alt="Profile"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <FiCamera className="w-8 h-8 text-white" />
        </div>
        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        )}
      </div>
      {image?.url && !uploading && (
        <button
          onClick={async (e) => {
            e.stopPropagation();
            // Optional: Add delete functionality
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