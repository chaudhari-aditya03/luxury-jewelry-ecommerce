import React, { useState, useEffect } from 'react';
import { Table, Button, Input, Tag, Space, Popconfirm, message, Typography, Avatar } from 'antd';
import { SearchOutlined, UserOutlined, StopOutlined, CheckCircleOutlined } from '@ant-design/icons';
import AdminLayout from '../../layouts/AdminLayout';
import { formatDate } from '../../utils/helpers';
import { adminService } from '../../services';

const { Title } = Typography;

const AdminUsers = () => {
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
        status: user.active ? 'Active' : 'Blocked',
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

  const handleBlockUser = async (id, currentStatus) => {
    try {
      await adminService.blockUser(id);
      message.success(`User ${currentStatus === 'Active' ? 'blocked' : 'unblocked'} successfully`);
      fetchUsers(pagination.current - 1, pagination.pageSize);
    } catch (error) {
      console.error('Error updating user status:', error);
      message.error('Failed to update user status');
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
          <Avatar icon={<UserOutlined />} style={{ backgroundColor: record.role === 'ADMIN' ? '#D4AF37' : '#1890ff' }} />
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
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: status => (
        <Tag color={status === 'Active' ? 'success' : 'error'}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        record.role !== 'ADMIN' && (
          <Popconfirm
            title={`Are you sure you want to ${record.status === 'Active' ? 'block' : 'unblock'} this user?`}
            onConfirm={() => handleBlockUser(record.id, record.status)}
          >
            <Button
              type="text"
              danger={record.status === 'Active'}
            // icon={record.status === 'Active' ? <StopOutlined /> : <CheckCircleOutlined />}
            >
              {record.status === 'Active' ? 'Block' : 'Unblock'}
            </Button>
          </Popconfirm>
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
      <Title level={2} style={{ marginBottom: 24 }}>Users</Title>

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
