import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Button, Input, Tag, Space, Popconfirm, message, Typography, Avatar } from 'antd';
import { SearchOutlined, UserOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import AdminLayout from '../../layouts/AdminLayout';
import { formatDate } from '../../utils/helpers';
import { adminService } from '../../services';

const { Title } = Typography;

const AdminUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  useEffect(() => {
    fetchUsers(pagination.current - 1, pagination.pageSize);
  }, []);

  const fetchUsers = async (page, size) => {
    setLoading(true);
    try {
      const response = await adminService.getAllUsers(page, size);
      const { content, totalElements } = response.data.data;
      
      const formattedUsers = content.map((user, index) => ({
        key: user.id,
        id: user.id,
        name: user.fullName || user.email,
        email: user.email,
        role: user.role,
        status: user.emailVerified ? 'Verified' : 'Not verified',
        isActive: Boolean(user.isActive),
        emailVerified: Boolean(user.emailVerified),
        date: user.createdAt,
      }));

      setUsers(formattedUsers);
      setPagination(prev => ({
        ...prev,
        total: totalElements,
      }));
    } catch (error) {
      console.error('Error fetching users:', error);
      message.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await adminService.deleteUser(id);
      message.success('User deleted successfully');
      fetchUsers(pagination.current - 1, pagination.pageSize);
    } catch (error) {
      console.error('Error deleting user:', error);
      message.error('Failed to delete user');
    }
  };

  const handleTableChange = (newPagination) => {
    setPagination(newPagination);
    fetchUsers(newPagination.current - 1, newPagination.pageSize);
  };

  const columns = [
    {
      title: 'User',
      key: 'user',
      render: (_, record) => (
        <Space>
          <Avatar icon={<UserOutlined />} style={{ backgroundColor: record.role === 'ADMIN' ? '#C6A769' : '#16a34a' }} />
          <div>
            <div style={{ fontWeight: 500 }}>{record.name}</div>
            <div style={{ fontSize: 12, color: '#888' }}>{record.email}</div>
          </div>
        </Space>
      ),
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: role => (
        <Tag color={role === 'ADMIN' ? 'gold' : 'blue'}>
          {role}
        </Tag>
      ),
      filters: [
        { text: 'Admin', value: 'ADMIN' },
        { text: 'User', value: 'USER' },
      ],
      onFilter: (value, record) => record.role === value,
    },
    {
      title: 'Joined',
      dataIndex: 'date',
      key: 'date',
      render: date => formatDate(date),
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
      defaultSortOrder: 'descend',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: status => (
        <Tag color={status === 'Verified' ? 'success' : 'error'}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        record.role !== 'ADMIN' && (
          <Space size="small" wrap>
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => navigate(`/admin/users/edit/${record.id}`)}
            >
              Edit
            </Button>
            <Popconfirm
              title="Are you sure you want to delete this user?"
              description="This will soft delete the account and remove it from the active user list."
              onConfirm={() => handleDeleteUser(record.id)}
              okText="Delete"
              okButtonProps={{ danger: true }}
            >
              <Button type="text" danger icon={<DeleteOutlined />}>
                Delete
              </Button>
            </Popconfirm>
          </Space>
        )
      ),
    },
  ];

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchText.toLowerCase()) ||
    user.email.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <AdminLayout>
      <Title level={2} style={{ marginBottom: 24, fontFamily: "'Playfair Display', serif" }}>Users</Title>

      <div style={{ marginBottom: 16 }}>
        <Input
          placeholder="Search users..."
          prefix={<SearchOutlined />}
          onChange={e => setSearchText(e.target.value)}
          style={{ width: 300 }}
        />
      </div>

      <Table
        columns={columns}
        dataSource={filteredUsers}
        loading={loading}
        pagination={{
          ...pagination,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} users`,
        }}
        onChange={handleTableChange}
      />
    </AdminLayout>
  );
};

export default AdminUsers;
