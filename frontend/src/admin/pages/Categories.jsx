import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import AdminLayout from '../../layouts/AdminLayout';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import Toast from '../../components/common/Toast';
import Skeleton from '../../components/common/Skeleton';
import { categoryService, adminService } from '../../services';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [toast, setToast] = useState(null);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      console.log('Fetching categories in admin page...');
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
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;

    try {
      await adminService.deleteCategory(id);
      setToast({ type: 'success', message: 'Category deleted successfully' });
      fetchCategories();
    } catch (err) {
      setToast({ 
        type: 'error', 
        message: err.response?.data?.message || 'Failed to delete category' 
      });
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setValue('name', category.name);
    setValue('description', category.description || '');
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCategory(null);
    reset();
  };

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);

      // Backend CategoryRequest only expects 'name' field
      const categoryData = {
        name: data.name
      };

      console.log('Submitting category data:', categoryData);

      if (editingCategory) {
        console.log('Updating category:', editingCategory.id);
        await adminService.updateCategory(editingCategory.id, categoryData);
        setToast({ type: 'success', message: 'Category updated successfully' });
      } else {
        console.log('Creating new category');
        const response = await adminService.createCategory(categoryData);
        console.log('Create category response:', response.data);
        setToast({ type: 'success', message: 'Category created successfully' });
      }

      handleCloseModal();
      fetchCategories();
    } catch (err) {
      console.error('Error saving category:', err);
      console.error('Error response:', err.response?.data);
      setToast({ 
        type: 'error', 
        message: err.response?.data?.message || 'Failed to save category' 
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <Skeleton className="h-12 w-64" />
          <div className="grid grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        </div>
      </AdminLayout>
    );
  }

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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Categories</h1>
          <Button variant="primary" onClick={() => setShowModal(true)}>
            + Add Category
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.length > 0 ? (
            categories.map((category) => (
              <div 
                key={category.id} 
                className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1">
                      {category.name}
                    </h3>
                    {category.slug && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        /{category.slug}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2 ml-3">
                    <button 
                      onClick={() => handleEdit(category)}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                      title="Edit category"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(category.id)}
                      className="p-2 hover:bg-red-100 dark:hover:bg-red-900 rounded text-red-600"
                      title="Delete category"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                  {category.description || 'No description provided'}
                </p>
                {category.productCount !== undefined && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {category.productCount} product{category.productCount !== 1 ? 's' : ''}
                    </span>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-gray-500">
              No categories found. Create one to get started!
            </div>
          )}
        </div>

        <Modal
          isOpen={showModal}
          onClose={handleCloseModal}
          title={editingCategory ? 'Edit Category'  : 'Add New Category'}
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Category Name"
              placeholder="e.g., Rings, Necklaces"
              error={errors.name?.message}
              {...register('name', { required: 'Category name is required' })}
            />

            <div>
              <label className="block text-sm font-medium mb-2">Description (Optional)</label>
              <textarea
                rows="3"
                placeholder="Category description"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-rose-gold-500 dark:bg-gray-700 dark:text-white"
                {...register('description')}
              />
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
                {editingCategory ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </AdminLayout>
  );
};

export default AdminCategories;
