import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FiUpload, FiX, FiImage } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../../services/api';

const ImageUpload = ({ onUploadComplete, multiple = false, maxFiles = 5 }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);

  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;
    
    setUploading(true);
    
    const formData = new FormData();
    acceptedFiles.forEach(file => {
      formData.append(multiple ? 'images' : 'image', file);
    });
    
    try {
      // Use the admin-only product upload endpoints
      const endpoint = multiple ? '/upload/products/multiple' : '/upload/products';
      const response = await api.post(endpoint, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      if (response.data.success) {
        const newImages = multiple ? response.data.data : [response.data.data];
        setUploadedImages(prev => [...prev, ...newImages]);
        onUploadComplete?.(newImages);
        toast.success(`${newImages.length} image(s) uploaded successfully`);
      } else {
        toast.error(response.data.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.response?.data?.message || 'Upload failed. Admin access required.');
    } finally {
      setUploading(false);
    }
  }, [multiple, onUploadComplete]);

  const removeImage = (index) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxFiles: multiple ? maxFiles : 1,
    multiple
  });

  return (
    <div className="space-y-4">
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-boutique-primary bg-boutique-light' : 'border-gray-300 hover:border-boutique-primary'}
          ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input {...getInputProps()} disabled={uploading} />
        <FiUpload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
        {uploading ? (
          <p className="text-gray-500">Uploading...</p>
        ) : isDragActive ? (
          <p className="text-boutique-primary">Drop the files here...</p>
        ) : (
          <div>
            <p className="text-gray-600">Drag & drop images here, or click to select</p>
            <p className="text-sm text-gray-400 mt-1">
              Supports: JPG, PNG, GIF, WEBP (Max 5MB each)
            </p>
          </div>
        )}
      </div>

      {/* Uploaded Images Preview */}
      {uploadedImages.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {uploadedImages.map((img, index) => (
            <div key={index} className="relative group">
              <img
                src={img.url}
                alt={`Upload ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg"
              />
              <button
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <FiX className="w-4 h-4" />
              </button>
              {img.isMain && (
                <span className="absolute bottom-2 left-2 bg-boutique-primary text-white text-xs px-2 py-1 rounded">
                  Main
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;