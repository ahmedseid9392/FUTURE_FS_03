import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { FiX, FiPercent, FiDollarSign } from 'react-icons/fi';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { couponService } from '../../services/couponService';
import toast from 'react-hot-toast';

const couponSchema = z.object({
  code: z.string().min(3, 'Code must be at least 3 characters').max(20, 'Code too long'),
  description: z.string().min(5, 'Description required'),
  discountType: z.enum(['percentage', 'fixed']),
  discountValue: z.number().min(1, 'Discount value must be at least 1'),
  minimumOrderAmount: z.number().min(0).default(0),
  maximumDiscount: z.number().nullable().optional(),
  usageLimit: z.number().nullable().optional(),
  perUserLimit: z.number().min(1).default(1),
  startDate: z.string().min(1, 'Start date required'),
  endDate: z.string().min(1, 'End date required'),
  isActive: z.boolean().default(true)
});

const CouponFormModal = ({ isOpen, onClose, coupon, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm({
    resolver: zodResolver(couponSchema),
    defaultValues: {
      code: coupon?.code || '',
      description: coupon?.description || '',
      discountType: coupon?.discountType || 'percentage',
      discountValue: coupon?.discountValue || 10,
      minimumOrderAmount: coupon?.minimumOrderAmount || 0,
      maximumDiscount: coupon?.maximumDiscount || null,
      usageLimit: coupon?.usageLimit || null,
      perUserLimit: coupon?.perUserLimit || 1,
      startDate: coupon?.startDate ? new Date(coupon.startDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      endDate: coupon?.endDate ? new Date(coupon.endDate).toISOString().split('T')[0] : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      isActive: coupon?.isActive !== undefined ? coupon.isActive : true
    }
  });

  const discountType = watch('discountType');

  useEffect(() => {
    if (coupon) {
      reset({
        code: coupon.code,
        description: coupon.description,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        minimumOrderAmount: coupon.minimumOrderAmount,
        maximumDiscount: coupon.maximumDiscount,
        usageLimit: coupon.usageLimit,
        perUserLimit: coupon.perUserLimit,
        startDate: new Date(coupon.startDate).toISOString().split('T')[0],
        endDate: new Date(coupon.endDate).toISOString().split('T')[0],
        isActive: coupon.isActive
      });
    }
  }, [coupon, reset]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      let result;
      if (coupon) {
        result = await couponService.updateCoupon(coupon._id, data);
      } else {
        result = await couponService.createCoupon(data);
      }
      
      if (result.success) {
        toast.success(coupon ? 'Coupon updated successfully' : 'Coupon created successfully');
        onSuccess();
        onClose();
      } else {
        toast.error(result.message || 'Failed to save coupon');
      }
    } catch (error) {
      toast.error('Failed to save coupon');
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
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white dark:bg-dark-card p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex justify-between items-center mb-4">
                  <Dialog.Title as="h3" className="text-xl font-playfair font-bold text-gray-900 dark:text-white">
                    {coupon ? 'Edit Coupon' : 'Create New Coupon'}
                  </Dialog.Title>
                  <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                    <FiX className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto px-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Coupon Code *</label>
                      <input
                        type="text"
                        {...register('code')}
                        className="input-field uppercase"
                        placeholder="SAVE20"
                      />
                      {errors.code && <p className="text-red-500 text-sm mt-1">{errors.code.message}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Discount Type *</label>
                      <select {...register('discountType')} className="input-field">
                        <option value="percentage">Percentage (%)</option>
                        <option value="fixed">Fixed Amount (ETB)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">
                        {discountType === 'percentage' ? 'Discount Percentage % *' : 'Discount Amount (ETB) *'}
                      </label>
                      <div className="relative">
                        {discountType === 'percentage' ? (
                          <FiPercent className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        ) : (
                          <FiDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        )}
                        <input
                          type="number"
                          step={discountType === 'percentage' ? 1 : 0.01}
                          {...register('discountValue', { valueAsNumber: true })}
                          className="input-field pl-10"
                        />
                      </div>
                      {errors.discountValue && <p className="text-red-500 text-sm mt-1">{errors.discountValue.message}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Minimum Order Amount (ETB)</label>
                      <input
                        type="number"
                        step="0.01"
                        {...register('minimumOrderAmount', { valueAsNumber: true })}
                        className="input-field"
                        placeholder="0"
                      />
                    </div>

                    {discountType === 'percentage' && (
                      <div>
                        <label className="block text-sm font-medium mb-1">Maximum Discount (ETB)</label>
                        <input
                          type="number"
                          step="0.01"
                          {...register('maximumDiscount', { valueAsNumber: true })}
                          className="input-field"
                          placeholder="No limit"
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium mb-1">Usage Limit (Total)</label>
                      <input
                        type="number"
                        {...register('usageLimit', { valueAsNumber: true })}
                        className="input-field"
                        placeholder="Unlimited"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Per User Limit</label>
                      <input
                        type="number"
                        {...register('perUserLimit', { valueAsNumber: true })}
                        className="input-field"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Start Date *</label>
                      <input
                        type="date"
                        {...register('startDate')}
                        className="input-field"
                      />
                      {errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate.message}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">End Date *</label>
                      <input
                        type="date"
                        {...register('endDate')}
                        className="input-field"
                      />
                      {errors.endDate && <p className="text-red-500 text-sm mt-1">{errors.endDate.message}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Description *</label>
                    <textarea
                      {...register('description')}
                      rows="2"
                      className="input-field"
                      placeholder="Describe the coupon offer..."
                    />
                    {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      {...register('isActive')}
                      className="w-4 h-4 text-boutique-primary rounded"
                    />
                    <label className="ml-2 text-sm">Active</label>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-dark-border">
                    <button type="button" onClick={onClose} className="btn-outline">
                      Cancel
                    </button>
                    <button type="submit" disabled={loading} className="btn-primary">
                      {loading ? 'Saving...' : (coupon ? 'Update Coupon' : 'Create Coupon')}
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

export default CouponFormModal;