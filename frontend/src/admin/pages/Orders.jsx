import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { EyeIcon } from '@heroicons/react/24/outline';
import AdminLayout from '../../layouts/AdminLayout';
import Select from '../../components/common/Select';
import Pagination from '../../components/common/Pagination';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import Toast from '../../components/common/Toast';
import Skeleton from '../../components/common/Skeleton';
import { formatPrice, formatDate } from '../../utils/helpers';
import { adminService } from '../../services';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting,  setSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState(null);

  const { register, handleSubmit, setValue } = useForm();

  useEffect(() => {
    fetchOrders();
  }, [currentPage]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await adminService.getAllOrders(currentPage, 10);
      const data = response.data.data;
      
      setOrders(data.content || []);
      setTotalPages(data.totalPages || 0);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setToast({ type: 'error', message: 'Failed to load orders' });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (data) => {
    try {
      setSubmitting(true);
      await adminService.updateOrderStatus(selectedOrder.id, { status: data.status });
      setToast({ type: 'success', message: 'Order status updated successfully' });
      setShowModal(false);
      fetchOrders();
    } catch (err) {
      setToast({ 
        type: 'error', 
        message: err.response?.data?.message || 'Failed to update order status' 
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setValue('status', order.status);
    setShowModal(true);
  };

  const getStatusColor = (status) => {
    const statusMap = {
      'PENDING': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      'PROCESSING': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'CONFIRMED': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      'SHIPPED': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
      'DELIVERED': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'CANCELLED': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    };
    return statusMap[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading && orders.length === 0) {
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
            type={toast.type}
            message={toast.message}
            onClose={() => setToast(null)}
          />
        )}

        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Orders Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            View and manage customer orders
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 font-semibold">Order ID</th>
                  <th className="text-left py-3 px-4 font-semibold">Customer</th>
                  <th className="text-left py-3 px-4 font-semibold">Date</th>
                  <th className="text-right py-3 px-4 font-semibold">Total</th>
                  <th className="text-center py-3 px-4 font-semibold">Payment</th>
                  <th className="text-center py-3 px-4 font-semibold">Status</th>
                  <th className="text-center py-3 px-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.length > 0 ? (
                  orders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <td className="py-4 px-4 font-medium">#{order.id}</td>
                      <td className="py-4 px-4">{order.userFullName || 'N/A'}</td>
                      <td className="py-4 px-4 text-gray-600 dark:text-gray-400">
                        {formatDate(order.createdAt || order.orderDate)}
                      </td>
                      <td className="py-4 px-4 text-right text-rose-gold-500 font-bold">
                        {formatPrice(order.totalAmount)}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          order.paymentStatus === 'PAID' 
                            ? 'bg-green-100 text-green-800'  
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {order.paymentStatus || 'PENDING'}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <button 
                          onClick={() => handleViewOrder(order)}
                          className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                          title="View & Update Order"
                        >
                          <EyeIcon className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-8 text-gray-500">
                      No orders found
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

      {/* Order Details Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={`Order #${selectedOrder?.id}`}
        size="lg"
      >
        {selectedOrder && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Customer</p>
                <p className="font-medium">{selectedOrder.userFullName || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Order Date</p>
                <p className="font-medium">{formatDate(selectedOrder.createdAt)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Amount</p>
                <p className="font-bold text-rose-gold-500">
                  {formatPrice(selectedOrder.totalAmount)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Payment Status</p>
                <p className="font-medium">{selectedOrder.paymentStatus || 'PENDING'}</p>
              </div>
            </div>

            <form onSubmit={handleSubmit(handleUpdateStatus)} className="space-y-4">
              <Select
                label="Update Order Status"
                {...register('status', { required: true })}
              >
                <option value="PENDING">Pending</option>
                <option value="PROCESSING">Processing</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="SHIPPED">Shipped</option>
                <option value="DELIVERED">Delivered</option>
                <option value="CANCELLED">Cancelled</option>
              </Select>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowModal(false)}
                  className="flex-1"
                >
                  Close
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={submitting}
                  className="flex-1"
                >
                  Update Status
                </Button>
              </div>
            </form>
          </div>
        )}
      </Modal>
    </AdminLayout>
  );
};

export default AdminOrders;
