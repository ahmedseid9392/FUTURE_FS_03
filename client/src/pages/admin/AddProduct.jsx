import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { productService } from '../../services/productService';
import ImageUpload from '../../components/common/ImageUpload';
import { FiSave, FiX } from 'react-icons/fi';

const productSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.number().min(0, 'Price must be positive'),
  compareAtPrice: z.number().min(0).optional(),
  category: z.string().min(1, 'Category is required'),
  stock: z.number().min(0, 'Stock must be positive'),
  sizes: z.array(z.string()).optional(),
  colors: z.array(z.string()).optional(),
  isFeatured: z.boolean().default(false),
  tags: z.string().optional()
});

const AddProduct = () => {
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      compareAtPrice: 0,
      category: '',
      stock: 0,
      sizes: [],
      colors: [],
      isFeatured: false,
      tags: ''
    }
  });
  
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const colors = ['Red', 'Blue', 'Green', 'Black', 'White', 'Gold', 'Silver'];
  const categories = ['dresses', 'jewelry', 'accessories', 'gifts', 'new-arrivals', 'sale'];
  
  const selectedSizes = watch('sizes') || [];
  const selectedColors = watch('colors') || [];
  
  const handleSizeToggle = (size) => {
    const current = selectedSizes;
    if (current.includes(size)) {
      setValue('sizes', current.filter(s => s !== size));
    } else {
      setValue('sizes', [...current, size]);
    }
  };
  
  const handleColorToggle = (color) => {
    const current = selectedColors;
    if (current.includes(color)) {
      setValue('colors', current.filter(c => c !== color));
    } else {
      setValue('colors', [...current, color]);
    }
  };
  
  const onSubmit = async (data) => {
    if (images.length === 0) {
      toast.error('Please upload at least one product image');
      return;
    }
    
    setLoading(true);
    
    const productData = {
      ...data,
      images: images,
      tags: data.tags ? data.tags.split(',').map(tag => tag.trim()) : []
    };
    
    try {
      const result = await productService.create(productData);
      if (result.success) {
        toast.success('Product created successfully!');
        navigate('/admin/products');
      } else {
        toast.error(result.message || 'Failed to create product');
      }
    } catch (error) {
      toast.error('Failed to create product');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-playfair font-bold text-gray-900 dark:text-white">
          Add New Product
        </h1>
        <button
          onClick={() => navigate('/admin/products')}
          className="text-gray-500 hover:text-gray-700"
        >
          <FiX className="w-6 h-6" />
        </button>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Product Images */}
        <div className="bg-white dark:bg-dark-card rounded-lg p-6 border border-gray-200 dark:border-dark-border">
          <h2 className="text-lg font-semibold mb-4">Product Images</h2>
          <ImageUpload
            onUploadComplete={(newImages) => setImages([...images, ...newImages])}
            multiple={true}
            maxFiles={5}
          />
          {errors.images && (
            <p className="text-red-500 text-sm mt-2">{errors.images.message}</p>
          )}
        </div>
        
        {/* Basic Information */}
        <div className="bg-white dark:bg-dark-card rounded-lg p-6 border border-gray-200 dark:border-dark-border">
          <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Product Name *</label>
              <input
                type="text"
                {...register('name')}
                className="input-field"
                placeholder="Elegant Floral Dress"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Category *</label>
              <select {...register('category')} className="input-field">
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat.toUpperCase()}</option>
                ))}
              </select>
              {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>}
            </div>
          </div>
          
          <div className="mt-4">
            <label className="block text-sm font-medium mb-1">Description *</label>
            <textarea
              {...register('description')}
              rows="4"
              className="input-field"
              placeholder="Detailed product description..."
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
          </div>
        </div>
        
        {/* Pricing */}
        <div className="bg-white dark:bg-dark-card rounded-lg p-6 border border-gray-200 dark:border-dark-border">
          <h2 className="text-lg font-semibold mb-4">Pricing & Stock</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Price (USD) *</label>
              <input
                type="number"
                step="0.01"
                {...register('price', { valueAsNumber: true })}
                className="input-field"
                placeholder="49.99"
              />
              {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Compare at Price</label>
              <input
                type="number"
                step="0.01"
                {...register('compareAtPrice', { valueAsNumber: true })}
                className="input-field"
                placeholder="69.99"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Stock Quantity *</label>
              <input
                type="number"
                {...register('stock', { valueAsNumber: true })}
                className="input-field"
                placeholder="100"
              />
              {errors.stock && <p className="text-red-500 text-sm mt-1">{errors.stock.message}</p>}
            </div>
          </div>
        </div>
        
        {/* Sizes */}
        <div className="bg-white dark:bg-dark-card rounded-lg p-6 border border-gray-200 dark:border-dark-border">
          <h2 className="text-lg font-semibold mb-4">Sizes</h2>
          <div className="flex flex-wrap gap-2">
            {sizes.map(size => (
              <button
                key={size}
                type="button"
                onClick={() => handleSizeToggle(size)}
                className={`px-4 py-2 rounded-md transition-all ${
                  selectedSizes.includes(size)
                    ? 'bg-boutique-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
        
        {/* Colors */}
        <div className="bg-white dark:bg-dark-card rounded-lg p-6 border border-gray-200 dark:border-dark-border">
          <h2 className="text-lg font-semibold mb-4">Colors</h2>
          <div className="flex flex-wrap gap-2">
            {colors.map(color => (
              <button
                key={color}
                type="button"
                onClick={() => handleColorToggle(color)}
                className={`px-4 py-2 rounded-md transition-all ${
                  selectedColors.includes(color)
                    ? 'bg-boutique-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {color}
              </button>
            ))}
          </div>
        </div>
        
        {/* Additional Options */}
        <div className="bg-white dark:bg-dark-card rounded-lg p-6 border border-gray-200 dark:border-dark-border">
          <h2 className="text-lg font-semibold mb-4">Additional Options</h2>
          
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                {...register('isFeatured')}
                className="w-4 h-4 text-boutique-primary rounded"
              />
              <label className="ml-2 text-sm">Feature this product on homepage</label>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Tags (comma separated)</label>
              <input
                type="text"
                {...register('tags')}
                className="input-field"
                placeholder="summer, dress, new arrival"
              />
            </div>
          </div>
        </div>
        
        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate('/admin/products')}
            className="btn-outline"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary flex items-center gap-2"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <FiSave className="w-4 h-4" />
            )}
            Create Product
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;