import React, { useState, useEffect } from 'react';
import { ShieldCheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import AdminLayout from '../../layouts/AdminLayout';
import Input from '../../components/common/Input';
import Pagination from '../../components/common/Pagination';
import Toast from '../../components/common/Toast';
import Skeleton from '../../components/common/Skeleton';
import { formatDate } from '../../utils/helpers';
import { adminService } from '../../services';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, [currentPage]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await adminService.getAllUsers(currentPage, 10);
      const data = response.data.data;
      
      setUsers(data.content || []);
      setTotalPages(data.totalPages || 0);
    } catch (err) {
      console.error('Error fetching users:', err);
      setToast({ type: 'error', message: 'Failed to load users' });
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = async (userId, currentStatus) => {
    try {
      await adminService.blockUser(userId);
      setToast({ 
        type: 'success', 
        message: `User ${currentStatus ? 'blocked' : 'unblocked'} successfully` 
      });
      fetchUsers();
    } catch (err) {
      setToast({ 
        type: 'error', 
        message: err.response?.data?.message || 'Failed to update user status' 
      });
    }
  };

  const filteredUsers = users.filter((u) =>
    (u.fullName || '').toLowerCase().includes(search.toLowerCase()) ||
    (u.email || '').toLowerCase().includes(search.toLowerCase())
  );

  if (loading && users.length === 0) {
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Users Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            View and manage registered users
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="mb-6">
            <Input
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 font-semibold">Name</th>
                  <th className="text-left py-3 px-4 font-semibold">Email</th>
                  <th className="text-left py-3 px-4 font-semibold">Role</th>
                  <th className="text-left py-3 px-4 font-semibold">Join Date</th>
                  <th className="text-center py-3 px-4 font-semibold">Status</th>
                  <th className="text-center py-3 px-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <td className="py-4 px-4 font-medium">{user.fullName || 'N/A'}</td>
                      <td className="py-4 px-4 text-gray-600 dark:text-gray-400">
                        {user.email}
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.role === 'ADMIN'
                            ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-gray-600 dark:text-gray-400">
                        {formatDate(user.createdAt)}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            user.isActive
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          }`}
                        >
                          {user.isActive ? 'Active' : 'Blocked'}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        {user.role !== 'ADMIN' && (
                          <button
                            onClick={() => toggleUserStatus(user.id, user.isActive)}
                            className={`p-2 rounded transition-colors ${
                              user.isActive
                                ? 'hover:bg-red-100 dark:hover:bg-red-900 text-red-600'
                                : 'hover:bg-green-100 dark:hover:bg-green-900 text-green-600'
                            }`}
                            title={user.isActive ? 'Block user' : 'Unblock user'}
                          >
                            {user.isActive ? (
                              <XMarkIcon className="w-5 h-5" />
                            ) : (
                              <ShieldCheckIcon className="w-5 h-5" />
                            )}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-8 text-gray-500">
                      No users found
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
    </AdminLayout>
  );
};

export default AdminUsers;
