import cloudinary from '../config/cloudinary.js';

/**
 * Upload single image (Profile or Product)
 * @route POST /api/upload/profile
 * @route POST /api/upload/products
 * @access Private (profile) or Admin (products)
 */
export const uploadImage = async (req, res) => {
  try {
    console.log('📸 Upload request received');
    console.log('File:', req.file ? 'File present' : 'No file');
    console.log('URL path:', req.originalUrl);
    
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided'
      });
    }

    // Determine folder based on route
    let folder = 'jams-boutique/profiles';
    let width = 400;
    let height = 400;
    
    if (req.originalUrl.includes('/products')) {
      folder = 'jams-boutique/products';
      width = 800;
      height = 800;
    }
    
    // Convert buffer to base64
    const b64 = Buffer.from(req.file.buffer).toString('base64');
    const dataURI = `data:${req.file.mimetype};base64,${b64}`;
    
    console.log('📤 Uploading to Cloudinary...');
    console.log('Folder:', folder);
    
    // Upload to Cloudinary with specific folder
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: folder,
      transformation: [
        { width, height, crop: 'limit' },
        { quality: 'auto' }
      ]
    });
    
    console.log('✅ Upload successful:', result.secure_url);

    res.status(200).json({
      success: true,
      data: {
        url: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format
      }
    });
  } catch (error) {
    console.error('❌ Upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Upload failed',
      error: error.message
    });
  }
};

/**
 * Upload multiple product images
 * @route POST /api/upload/products/multiple
 * @access Private/Admin
 */
export const uploadMultipleImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No image files provided'
      });
    }

    const uploadPromises = req.files.map(async (file) => {
      const b64 = Buffer.from(file.buffer).toString('base64');
      const dataURI = `data:${file.mimetype};base64,${b64}`;
      
      const result = await cloudinary.uploader.upload(dataURI, {
        folder: 'jams-boutique/products',
        transformation: [
          { width: 800, height: 800, crop: 'limit' },
          { quality: 'auto' }
        ]
      });
      
      return {
        url: result.secure_url,
        publicId: result.public_id,
        isMain: false
      };
    });

    const images = await Promise.all(uploadPromises);
    
    // Set first image as main
    if (images.length > 0) {
      images[0].isMain = true;
    }

    res.status(200).json({
      success: true,
      data: images
    });
  } catch (error) {
    console.error('Multiple upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Upload failed',
      error: error.message
    });
  }
};

/**
 * Delete image from Cloudinary
 * @route DELETE /api/upload/:publicId
 * @access Private/Admin
 */
export const deleteImage = async (req, res) => {
  try {
    const { publicId } = req.params;
    
    if (!publicId) {
      return res.status(400).json({
        success: false,
        message: 'Public ID is required'
      });
    }

    const result = await cloudinary.uploader.destroy(publicId);
    
    res.status(200).json({
      success: true,
      message: 'Image deleted successfully',
      result
    });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({
      success: false,
      message: 'Delete failed',
      error: error.message
    });
  }
};