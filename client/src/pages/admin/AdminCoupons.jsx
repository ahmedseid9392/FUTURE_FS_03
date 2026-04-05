import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  FiPlus, 
  FiEdit2, 
  FiTrash2, 
  FiTag, 
  FiPercent,
  FiDollarSign,
  FiCalendar,
  FiUsers,
  FiTrendingUp
} from 'react-icons/fi';
import { couponService } from '../../services/couponService';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import CouponFormModal from '../../components/admin/CouponFormModal';
import toast from 'react-hot-toast';

const AdminCoupons = () => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [couponToDelete, setCouponToDelete] = useState(null);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-coupons'],
    queryFn: () => couponService.getAllCoupons(),
  });

  const { data: statsData } = useQuery({
    queryKey: ['coupon-stats'],
    queryFn: () => couponService.getCouponStats(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => couponService.deleteCoupon(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-coupons']);
      queryClient.invalidateQueries(['coupon-stats']);
      toast.success('Coupon deleted successfully');
      setIsDeleteModalOpen(false);
      setCouponToDelete(null);
    },
    onError: () => {
      toast.error('Failed to delete coupon');
    },
  });

  const coupons = data?.success ? data.data : [];
  const stats = statsData?.success ? statsData.data : {};

  const handleDelete = (coupon) => {
    setCouponToDelete(coupon);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (couponToDelete) {
      deleteMutation.mutate(couponToDelete._id);
    }
  };

  const handleEdit = (coupon) => {
    setSelectedCoupon(coupon);
    setIsFormModalOpen(true);
  };

  const handleAddNew = () => {
    setSelectedCoupon(null);
    setIsFormModalOpen(true);
  };

  const handleFormSuccess = () => {
    queryClient.invalidateQueries(['admin-coupons']);
    queryClient.invalidateQueries(['coupon-stats']);
    setIsFormModalOpen(false);
    setSelectedCoupon(null);
  };

  const isCouponValid = (coupon) => {
    const now = new Date();
    return coupon.isActive && now >= new Date(coupon.startDate) && now <= new Date(coupon.endDate);
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
            Coupons
          </h1>
          <p className="text-gray-600 dark:text-dark-textMuted">
            Manage discount coupons and promotions
          </p>
        </div>
        <button onClick={handleAddNew} className="btn-primary flex items-center gap-2">
          <FiPlus className="w-4 h-4" />
          Create Coupon
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-dark-card rounded-lg p-4 border border-gray-200 dark:border-dark-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Coupons</p>
              <p className="text-2xl font-bold">{stats.totalCoupons || 0}</p>
            </div>
            <FiTag className="w-8 h-8 text-boutique-primary opacity-50" />
          </div>
        </div>
        <div className="bg-white dark:bg-dark-card rounded-lg p-4 border border-gray-200 dark:border-dark-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active Coupons</p>
              <p className="text-2xl font-bold text-green-600">{stats.activeCoupons || 0}</p>
            </div>
            <FiTrendingUp className="w-8 h-8 text-green-500 opacity-50" />
          </div>
        </div>
        <div className="bg-white dark:bg-dark-card rounded-lg p-4 border border-gray-200 dark:border-dark-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Used</p>
              <p className="text-2xl font-bold text-blue-600">{stats.totalUsed || 0}</p>
            </div>
            <FiUsers className="w-8 h-8 text-blue-500 opacity-50" />
          </div>
        </div>
        <div className="bg-white dark:bg-dark-card rounded-lg p-4 border border-gray-200 dark:border-dark-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Expired</p>
              <p className="text-2xl font-bold text-red-600">{stats.expiredCoupons || 0}</p>
            </div>
            <FiCalendar className="w-8 h-8 text-red-500 opacity-50" />
          </div>
        </div>
      </div>

      {/* Coupons Table */}
      <div className="bg-white dark:bg-dark-card rounded-lg shadow-sm border border-gray-200 dark:border-dark-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-dark-surface border-b border-gray-200 dark:border-dark-border">
              <tr>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Code</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Description</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Discount</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Min Order</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Used/Total</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Valid Until</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((coupon) => (
                <tr key={coupon._id} className="border-b border-gray-100 dark:border-dark-border hover:bg-gray-50 dark:hover:bg-dark-surface">
                  <td className="py-3 px-4">
                    <span className="font-mono font-semibold text-boutique-primary">
                      {coupon.code}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {coupon.description}
                  </td>
                  <td className="py-3 px-4">
                    {coupon.discountType === 'percentage' ? (
                      <span className="flex items-center gap-1">
                        <FiPercent className="w-4 h-4 text-green-600" />
                        {coupon.discountValue}% OFF
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <FiDollarSign className="w-4 h-4 text-green-600" />
                        {coupon.discountValue} OFF
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-sm">
                    {coupon.minimumOrderAmount > 0 ? `$${coupon.minimumOrderAmount}` : 'No minimum'}
                  </td>
                  <td className="py-3 px-4 text-sm">
                    {coupon.usedCount} / {coupon.usageLimit || '∞'}
                  </td>
                  <td className="py-3 px-4 text-sm">
                    {new Date(coupon.endDate).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      isCouponValid(coupon)
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {isCouponValid(coupon) ? 'Active' : 'Expired'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleEdit(coupon)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <FiEdit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(coupon)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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

        {coupons.length === 0 && (
          <div className="text-center py-12">
            <FiTag className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-700 dark:text-dark-text mb-2">
              No coupons created yet
            </h3>
            <p className="text-gray-500 mb-6">Create your first discount coupon to boost sales</p>
            <button onClick={handleAddNew} className="btn-primary">
              Create Coupon
            </button>
          </div>
        )}
      </div>

      {/* Modals */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setCouponToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="Delete Coupon"
        message={`Are you sure you want to delete coupon "${couponToDelete?.code}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />

      <CouponFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setSelectedCoupon(null);
        }}
        coupon={selectedCoupon}
        onSuccess={handleFormSuccess}
      />
    </div>
  );
};

export default AdminCoupons;