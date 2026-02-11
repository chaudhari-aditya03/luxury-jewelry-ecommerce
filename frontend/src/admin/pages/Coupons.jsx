import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { TagIcon } from '@heroicons/react/24/outline';
import AdminLayout from '../../layouts/AdminLayout';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Modal from '../../components/common/Modal';
import Toast from '../../components/common/Toast';
import { formatPrice, formatDate } from '../../utils/helpers';
import { adminService } from '../../services';

const AdminCoupons = () => {
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);
      
      const couponData = {
        code: data.code.toUpperCase(),
        discountType: data.discountType,
        discountValue: parseFloat(data.discountValue),
        minOrderAmount: parseFloat(data.minOrderAmount || 0),
        maxUsage: parseInt(data.maxUsage || 0),
        validFrom: data.validFrom ? new Date(data.validFrom).toISOString() : new Date().toISOString(),
        validUntil: data.validUntil ? new Date(data.validUntil).toISOString() : null,
        isActive: true
      };

      await adminService.createCoupon(couponData);
      setToast({ type: 'success', message: 'Coupon created successfully' });
      setShowModal(false);
      reset();
    } catch (err) {
      console.error('Error creating coupon:', err);
      setToast({ 
        type: 'error', 
        message: err.response?.data?.message || 'Failed to create coupon' 
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {toast && (
          <Toast
            type={toast.type}
            message={toast.message}
            onClose={() => setToast(null)}
          />
        )}

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Coupons</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Create and manage discount coupons
            </p>
          </div>
          <Button variant="primary" onClick={() => setShowModal(true)}>
            + Add Coupon
          </Button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-8 border border-gray-200 dark:border-gray-700 text-center">
          <TagIcon className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Create Your First Coupon
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Start creating promotional coupons to boost your sales!
</p>
          <Button variant="primary" onClick={() => setShowModal(true)}>
            Create Coupon
          </Button>
        </div>

        <Modal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            reset();
          }}
          title="Create New Coupon"
          size="lg"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Coupon Code"
              placeholder="e.g., SAVE10"
              error={errors.code?.message}
              {...register('code', { 
                required: 'Coupon code is required',
                pattern: {
                  value: /^[A-Z0-9]+$/,
                  message: 'Only uppercase letters and numbers allowed'
                }
              })}
            />

            <Select
              label="Discount Type"
              error={errors.discountType?.message}
              {...register('discountType', { required: 'Discount type is required' })}
            >
              <option value="">Select type</option>
              <option value="PERCENTAGE">Percentage (%)</option>
              <option value="FIXED">Fixed Amount (₹)</option>
            </Select>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Discount Value"
                type="number"
                step="0.01"
                placeholder="e.g., 10 or 500"
                error={errors.discountValue?.message}
                {...register('discountValue', { 
                  required: 'Discount value is required',
                  min: { value: 0, message: 'Must be positive' }
                })}
              />
              <Input
                label="Minimum Order Amount"
                type="number"
                step="0.01"
                placeholder="e.g., 1000"
                error={errors.minOrderAmount?.message}
                {...register('minOrderAmount', {
                  min: { value: 0, message: 'Must be positive' }
                })}
              />
            </div>

            <Input
              label="Max Usage (0 = unlimited)"
              type="number"
              placeholder="e.g., 100"
              error={errors.maxUsage?.message}
              {...register('maxUsage', {
                min: { value: 0, message: 'Must be non-negative' }
              })}
            />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Valid From</label>
                <input
                  type="datetime-local"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-rose-gold-500 dark:bg-gray-700 dark:text-white"
                  {...register('validFrom')}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Valid Until</label>
                <input
                  type="datetime-local"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-rose-gold-500 dark:bg-gray-700 dark:text-white"
                  {...register('validUntil')}
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setShowModal(false);
                  reset();
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                isLoading={submitting}
                className="flex-1"
              >
                Create Coupon
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </AdminLayout>
  );
};

export default AdminCoupons;
