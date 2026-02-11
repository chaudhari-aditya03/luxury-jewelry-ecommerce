import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import AdminLayout from '../../layouts/AdminLayout';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Pagination from '../../components/common/Pagination';
import Modal from '../../components/common/Modal';
import Alert from '../../components/common/Alert';
import Skeleton from '../../components/common/Skeleton';
import Toast from '../../components/common/Toast';
import { formatPrice } from '../../utils/helpers';
import { productService, categoryService, adminService } from '../../services';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);
  
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [search, setSearch] = useState('');
  
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [currentPage, search]);

  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);
      console.log('Fetching categories...');
      const response = await categoryService.getAllCategories();
      console.log('Categories response:', response.data);
      const categoriesData = response.data.data || [];
      console.log('Extracted categories:', categoriesData);
      setCategories(categoriesData);
    } catch (err) {
      console.error('Error fetching categories:', err);
      console.error('Error response:', err.response?.data);
      setToast({ type: 'error', message: 'Failed to load categories' });
    } finally {
      setLoadingCategories(false);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productService.getAllProducts(currentPage, 10, { search });
      const data = response.data.data;
      
      setProducts(data.content || []);
      setTotalPages(data.totalPages || 0);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      await adminService.deleteProduct(id);
      setToast({ type: 'success', message: 'Product deleted successfully' });
      fetchProducts();
    } catch (err) {
      setToast({ type: 'error', message: err.response?.data?.message || 'Failed to delete product' });
    }
  };

  const handleEdit = async (product) => {
    // Wait for categories to load before opening modal
    await fetchCategories();
    setEditingProduct(product);
    setValue('name', product.name);
    setValue('description', product.description);
    setValue('price', product.price);
    setValue('stockQuantity', product.stockQuantity);
    setValue('categoryId', product.categoryId);
    setValue('sku', product.sku || '');
    setShowModal(true);
  };

  const handleAddNew = async () => {
    // Wait for categories to load before opening modal
    await fetchCategories();
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    reset();
  };

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);
      
      const productData = {
        name: data.name,
        description: data.description,
        price: parseFloat(data.price),
        stockQuantity: parseInt(data.stockQuantity),
        categoryId: parseInt(data.categoryId),
        sku: data.sku || `SKU-${Date.now()}`,
        isActive: true
      };

      if (editingProduct) {
        await adminService.updateProduct(editingProduct.id, productData);
        setToast({ type: 'success', message: 'Product updated successfully' });
      } else {
        await adminService.createProduct(productData);
        setToast({ type: 'success', message: 'Product created successfully' });
      }

      handleCloseModal();
      fetchProducts();
    } catch (err) {
      console.error('Error saving product:', err);
      setToast({ 
        type: 'error', 
        message: err.response?.data?.message || 'Failed to save product' 
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading && products.length === 0) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <Skeleton className="h-12 w-64" />
          <Skeleton className="h-96 w-full" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {toast && (
          <Toast
            type={toast.type}handleAddNew
            message={toast.message}
            onClose={() => setToast(null)}
          />
        )}

        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Products</h1>
          <Button variant="primary" onClick={() => setShowModal(true)}>
            + Add Product
          </Button>
        </div>

        {error && (
          <Alert type="error" message={error} closeable onClose={() => setError(null)} />
        )}

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="mb-6">
            <Input
              placeholder="Search products..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(0);
              }}
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 font-semibold">Name</th>
                  <th className="text-left py-3 px-4 font-semibold">Category</th>
                  <th className="text-right py-3 px-4 font-semibold">Price</th>
                  <th className="text-right py-3 px-4 font-semibold">Stock</th>
                  <th className="text-center py-3 px-4 font-semibold">Status</th>
                  <th className="text-center py-3 px-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.length > 0 ? (
                  products.map((product) => (
                    <tr
                      key={product.id}
                      className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <td className="py-4 px-4 font-medium">{product.name}</td>
                      <td className="py-4 px-4 text-gray-600 dark:text-gray-400">
                        {product.categoryName || 'N/A'}
                      </td>
                      <td className="py-4 px-4 text-right text-rose-gold-500 font-bold">
                        {formatPrice(product.price)}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <span className={product.stockQuantity < 5 ? 'text-red-600 font-medium' : ''}>
                          {product.stockQuantity}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          product.isActive 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                        }`}>
                          {product.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => handleEdit(product)}
                            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                            title="Edit product"
                          >
                            <PencilIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="p-2 hover:bg-red-100 dark:hover:bg-red-900 rounded text-red-600"
                            title="Delete product"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-8 text-gray-500">
                      No products found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="mt-6">
              <Pagination
                currentPage={currentPage + 1}
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(page - 1)}
              />
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={editingProduct ? 'Edit Product' : 'Add New Product'}
        size="lg"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Product Name"
            placeholder="Enter product name"
            error={errors.name?.message}
            {...register('name', { required: 'Product name is required' })}
          />

          <div>
            <Select
              label="Category"
              error={errors.categoryId?.message}
              {...register('categoryId', { required: 'Category is required' })}
              disabled={loadingCategories}
            >
              <option value="">
                {loadingCategories ? 'Loading categories...' : 'Select a category'}
              </option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </Select>
            {categories.length === 0 && !loadingCategories && (
              <p className="mt-1 text-sm text-amber-600">
                No categories available. Please create a category first.
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Price (₹)"
              type="number"
              step="0.01"
              placeholder="0.00"
              error={errors.price?.message}
              {...register('price', { 
                required: 'Price is required',
                min: { value: 0, message: 'Price must be positive' }
              })}
            />
            <Input
              label="Stock Quantity"
              type="number"
              placeholder="0"
              error={errors.stockQuantity?.message}
              {...register('stockQuantity', { 
                required: 'Stock quantity is required',
                min: { value: 0, message: 'Stock cannot be negative' }
              })}
            />
          </div>

          <Input
            label="SKU (Optional)"
            placeholder="SKU-001"
            {...register('sku')}
          />

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              rows="4"
              placeholder="Product description"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-rose-gold-500 dark:bg-gray-700 dark:text-white"
              {...register('description', { required: 'Description is required' })}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={handleCloseModal}
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
              {editingProduct ? 'Update Product' : 'Create Product'}
            </Button>
          </div>
        </form>
      </Modal>
    </AdminLayout>
  );
};

export default AdminProducts;
