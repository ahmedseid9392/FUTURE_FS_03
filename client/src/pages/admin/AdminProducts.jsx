import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  FiPlus, 
  FiEdit2, 
  FiTrash2, 
  FiSearch,
  FiPackage,
  FiAlertCircle
} from 'react-icons/fi';
import { productService } from '../../services/productService';
import { useCurrencyContext } from '../../context/CurrencyContext';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import ProductFormModal from '../../components/admin/ProductFormModal';
import toast from 'react-hot-toast';

import CurrencyToggle from '../../components/common/CurrencyToggle';

const AdminProducts = () => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);
  
  const queryClient = useQueryClient();
  const { formatPrice } = useCurrencyContext();

  // Fetch products
  const { data, isLoading } = useQuery({
    queryKey: ['admin-products', page, search],
    queryFn: () => productService.getAll({ page, limit: 20, search }),
  });

  // Delete product mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => productService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-products']);
      toast.success('Product deleted successfully');
      setIsDeleteModalOpen(false);
      setProductToDelete(null);
    },
    onError: () => {
      toast.error('Failed to delete product');
    },
  });

  const products = data?.success ? data.data.products : [];
  const pagination = data?.success ? data.data.pagination : null;

  const handleDelete = (product) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (productToDelete) {
      deleteMutation.mutate(productToDelete._id);
    }
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setIsFormModalOpen(true);
  };

  const handleAddNew = () => {
    setSelectedProduct(null);
    setIsFormModalOpen(true);
  };

  const handleFormSuccess = () => {
    queryClient.invalidateQueries(['admin-products']);
    setIsFormModalOpen(false);
    setSelectedProduct(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-boutique-primary"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-playfair font-bold text-gray-900 dark:text-white mb-2">
            Products
          </h1>
          <p className="text-gray-600 dark:text-dark-textMuted">
            Manage your product catalog
          </p>
            <CurrencyToggle />
        </div>
        <button onClick={handleAddNew} className="btn-primary flex items-center gap-2">
          <FiPlus className="w-4 h-4" />
          Add New Product
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-field pl-10"
        />
      </div>

      {/* Products Table */}
      <div className="bg-white dark:bg-dark-card rounded-lg shadow-sm border border-gray-200 dark:border-dark-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-dark-surface border-b border-gray-200 dark:border-dark-border">
              <tr>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Product</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Price</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Stock</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Category</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id} className="border-b border-gray-100 dark:border-dark-border hover:bg-gray-50 dark:hover:bg-dark-surface">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={product.images?.[0]?.url || 'https://via.placeholder.com/40'}
                        alt={product.name}
                        className="w-10 h-10 object-cover rounded"
                      />
                      <div>
                        <p className="font-medium text-gray-800 dark:text-white">{product.name}</p>
                        <p className="text-xs text-gray-500">{product._id?.slice(-8)}</p>
                      </div>
                    </div>
                   </td>
                  <td className="py-3 px-4 font-medium text-boutique-primary">
                    {formatPrice(product.price)}
                   </td>
                  <td className="py-3 px-4">
                    <span className={`text-sm ${product.stock <= 5 ? 'text-red-600' : 'text-gray-600'}`}>
                      {product.stock} units
                    </span>
                    {product.stock <= 5 && product.stock > 0 && (
                      <span className="ml-2 text-xs text-orange-600">(Low Stock)</span>
                    )}
                    {product.stock === 0 && (
                      <span className="ml-2 text-xs text-red-600">(Out of Stock)</span>
                    )}
                   </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {product.category}
                   </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      product.isActive
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {product.isActive ? 'Active' : 'Inactive'}
                    </span>
                   </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit Product"
                      >
                        <FiEdit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(product)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Product"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                   </td>
                 </tr>
              ))}
            </tbody>
           </table>
        </div>

        {products.length === 0 && (
          <div className="text-center py-12">
            <FiPackage className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-700 dark:text-dark-text mb-2">
              No products found
            </h3>
            <p className="text-gray-500 mb-6">Start by adding your first product</p>
            <button onClick={handleAddNew} className="btn-primary">
              Add New Product
            </button>
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.pages > 1 && (
          <div className="flex justify-between items-center p-4 border-t border-gray-200 dark:border-dark-border">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-dark-surface"
            >
              Previous
            </button>
            <span className="text-sm text-gray-600">
              Page {page} of {pagination.pages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
              disabled={page === pagination.pages}
              className="px-4 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-dark-surface"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setProductToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="Delete Product"
        message={`Are you sure you want to delete "${productToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />

      {/* Add/Edit Product Modal */}
      <ProductFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setSelectedProduct(null);
        }}
        product={selectedProduct}
        onSuccess={handleFormSuccess}
      />
    </div>
  );
};

export default AdminProducts;