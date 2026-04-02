import { useState, useEffect } from 'react';
import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { FiX, FiUpload } from 'react-icons/fi';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { productService } from '../../services/productService';
import ImageUpload from '../common/ImageUpload';

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

const ProductFormModal = ({ isOpen, onClose, product, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState(product?.images || []);
  
  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name || '',
      description: product?.description || '',
      price: product?.price || 0,
      compareAtPrice: product?.compareAtPrice || 0,
      category: product?.category || '',
      stock: product?.stock || 0,
      sizes: product?.sizes || [],
      colors: product?.colors || [],
      isFeatured: product?.isFeatured || false,
      tags: product?.tags?.join(', ') || ''
    }
  });
  
  useEffect(() => {
    if (product) {
      reset({
        name: product.name,
        description: product.description,
        price: product.price,
        compareAtPrice: product.compareAtPrice || 0,
        category: product.category,
        stock: product.stock,
        sizes: product.sizes || [],
        colors: product.colors || [],
        isFeatured: product.isFeatured || false,
        tags: product.tags?.join(', ') || ''
      });
      setImages(product.images || []);
    } else {
      reset({
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
      });
      setImages([]);
    }
  }, [product, reset]);
  
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const colors = ['Red', 'Blue', 'Green', 'Black', 'White', 'Gold', 'Silver', 'Pink', 'Purple', 'Yellow'];
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
      let result;
      if (product) {
        // Update existing product
        result = await productService.update(product._id, productData);
      } else {
        // Create new product
        result = await productService.create(productData);
      }
      
      if (result.success) {
        toast.success(product ? 'Product updated successfully!' : 'Product created successfully!');
        onSuccess();
        onClose();
      } else {
        toast.error(result.message || 'Failed to save product');
      }
    } catch (error) {
      console.error('Save product error:', error);
      toast.error('Failed to save product');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white dark:bg-dark-card p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex justify-between items-center mb-4">
                  <Dialog.Title as="h3" className="text-xl font-playfair font-bold text-gray-900 dark:text-white">
                    {product ? 'Edit Product' : 'Add New Product'}
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                  >
                    <FiX className="h-6 w-6" />
                  </button>
                </div>
                
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-h-[70vh] overflow-y-auto px-2">
                  {/* Product Images */}
                  <div className="border border-gray-200 dark:border-dark-border rounded-lg p-4">
                    <h4 className="text-md font-semibold mb-3">Product Images</h4>
                    <ImageUpload
                      onUploadComplete={(newImages) => setImages([...images, ...newImages])}
                      multiple={true}
                      maxFiles={5}
                    />
                    {images.length > 0 && (
                      <div className="mt-4 grid grid-cols-4 gap-3">
                        {images.map((img, idx) => (
                          <div key={idx} className="relative">
                            <img src={img.url} alt={`Product ${idx}`} className="w-full h-24 object-cover rounded" />
                            <button
                              type="button"
                              onClick={() => setImages(images.filter((_, i) => i !== idx))}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                            >
                              <FiX className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Product Name *</label>
                      <input type="text" {...register('name')} className="input-field" />
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
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Description *</label>
                    <textarea {...register('description')} rows="4" className="input-field" />
                    {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
                  </div>
                  
                  {/* Pricing */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Price (USD) *</label>
                      <input type="number" step="0.01" {...register('price', { valueAsNumber: true })} className="input-field" />
                      {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Compare at Price</label>
                      <input type="number" step="0.01" {...register('compareAtPrice', { valueAsNumber: true })} className="input-field" />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Stock Quantity *</label>
                      <input type="number" {...register('stock', { valueAsNumber: true })} className="input-field" />
                      {errors.stock && <p className="text-red-500 text-sm mt-1">{errors.stock.message}</p>}
                    </div>
                  </div>
                  
                  {/* Sizes */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Sizes</label>
                    <div className="flex flex-wrap gap-2">
                      {sizes.map(size => (
                        <button
                          key={size}
                          type="button"
                          onClick={() => handleSizeToggle(size)}
                          className={`px-3 py-1 rounded-md text-sm transition-all ${
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
                  <div>
                    <label className="block text-sm font-medium mb-2">Colors</label>
                    <div className="flex flex-wrap gap-2">
                      {colors.map(color => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => handleColorToggle(color)}
                          className={`px-3 py-1 rounded-md text-sm transition-all ${
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
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input type="checkbox" {...register('isFeatured')} className="w-4 h-4 text-boutique-primary rounded" />
                      <span className="ml-2 text-sm">Feature this product on homepage</span>
                    </label>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Tags (comma separated)</label>
                      <input type="text" {...register('tags')} className="input-field" placeholder="summer, dress, new arrival" />
                    </div>
                  </div>
                  
                  {/* Submit Buttons */}
                  <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-dark-border">
                    <button type="button" onClick={onClose} className="btn-outline">
                      Cancel
                    </button>
                    <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
                      {loading ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <FiUpload className="w-4 h-4" />
                      )}
                      {product ? 'Update Product' : 'Create Product'}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ProductFormModal;