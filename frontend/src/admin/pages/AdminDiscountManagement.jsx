import React, { useMemo, useState } from 'react';
import { Button, DatePicker, InputNumber, message, Spin } from 'antd';
import AdminLayout from '../../layouts/AdminLayout';
import { adminService, productService } from '../../services';
import { formatPrice } from '../../utils/helpers';

const AdminDiscountManagement = () => {
  const [productId, setProductId] = useState('');
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [saleDates, setSaleDates] = useState(null);

  const originalPrice = product?.originalPrice ?? product?.price ?? 0;
  const discountedPrice = useMemo(() => {
    const base = Number(originalPrice || 0);
    const discount = Number(discountPercentage || 0);
    if (!base || !discount) return base;
    return base - (base * discount) / 100;
  }, [originalPrice, discountPercentage]);
  const savings = Math.max(Number(originalPrice || 0) - Number(discountedPrice || 0), 0);

  const loadProduct = async () => {
    if (!productId) {
      message.error('Enter a product ID first.');
      return;
    }

    try {
      setLoading(true);
      const response = await productService.getProductById(productId);
      const data = response.data?.data;
      setProduct(data);
      setDiscountPercentage(Number(data?.discountPercentage || 0));
      message.success('Product loaded');
    } catch (error) {
      message.error(error?.response?.data?.message || 'Could not load product');
    } finally {
      setLoading(false);
    }
  };

  const saveDiscount = async () => {
    if (!product) {
      message.error('Load a product first.');
      return;
    }

    try {
      setSaving(true);
      const payload = {
        originalPrice: originalPrice,
        discountPercentage,
        saleStartDate: saleDates?.[0]?.toISOString?.() || null,
        saleEndDate: saleDates?.[1]?.toISOString?.() || null,
      };
      const response = await adminService.updateProductDiscount(product.id, payload);
      setProduct(response.data?.data);
      message.success('Discount updated');
    } catch (error) {
      message.error(error?.response?.data?.message || 'Failed to update discount');
    } finally {
      setSaving(false);
    }
  };

  const removeDiscount = async () => {
    if (!product) return;
    try {
      setSaving(true);
      const response = await adminService.removeProductDiscount(product.id);
      setProduct(response.data?.data);
      setDiscountPercentage(0);
      message.success('Discount removed');
    } catch (error) {
      message.error(error?.response?.data?.message || 'Failed to remove discount');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Discount Management</h1>
          <p className="text-sm text-gray-500 mt-1">Set, schedule, and remove sales from a single admin screen.</p>
        </div>

        <div className="grid gap-4 rounded-2xl bg-white p-6 shadow-sm md:grid-cols-[1fr_auto]" style={{ border: '1px solid rgba(0,0,0,0.04)' }}>
          <InputNumber
            className="w-full"
            placeholder="Product ID"
            value={productId}
            onChange={setProductId}
            min={1}
          />
          <Button type="primary" onClick={loadProduct} loading={loading} className="!h-11 !rounded-full !border-0">
            Load Product
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-16"><Spin size="large" /></div>
        ) : product ? (
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-2xl bg-white p-6 shadow-sm" style={{ border: '1px solid rgba(0,0,0,0.04)' }}>
              <h2 className="text-lg font-semibold text-gray-900">{product.name}</h2>
              <p className="text-sm text-gray-500 mt-1">SKU: {product.sku || 'N/A'}</p>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-400">Original price</p>
                  <p className="mt-2 text-xl font-bold text-gray-900">{formatPrice(originalPrice)}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-400">Discounted price</p>
                  <p className="mt-2 text-xl font-bold text-emerald-700">{formatPrice(discountedPrice)}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-400">Savings</p>
                  <p className="mt-2 text-xl font-bold text-rose-700">{formatPrice(savings)}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-400">Current discount</p>
                  <p className="mt-2 text-xl font-bold text-gray-900">{Number(discountPercentage || 0)}%</p>
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Discount percentage</label>
                  <InputNumber className="w-full" value={discountPercentage} onChange={setDiscountPercentage} min={0} max={90} />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Schedule sale</label>
                  <DatePicker.RangePicker className="w-full" onChange={setSaleDates} />
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Button type="primary" onClick={saveDiscount} loading={saving} className="!h-11 !rounded-full !border-0">Save Discount</Button>
                <Button onClick={removeDiscount} loading={saving} className="!h-11 !rounded-full">Remove Discount</Button>
              </div>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm" style={{ border: '1px solid rgba(0,0,0,0.04)' }}>
              <h3 className="text-lg font-semibold text-gray-900">Preview</h3>
              <div className="mt-4 space-y-3 text-sm text-gray-600">
                <p>Discount percentage is calculated on the backend when saved.</p>
                <p>Sale end date automatically disables the discount after the scheduled window.</p>
                <p>Always trust the server-side price shown after saving.</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl bg-white p-8 text-center text-gray-500 shadow-sm" style={{ border: '1px solid rgba(0,0,0,0.04)' }}>
            Load a product to manage its discount and sale schedule.
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminDiscountManagement;