import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Alert, Button, Card, Col, Form, Input, Popconfirm, Row, Space, Spin, Tag, Typography, message } from 'antd';
import { ArrowLeftOutlined, DeleteOutlined, SaveOutlined, UserOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import AdminLayout from '../../layouts/AdminLayout';
import { adminService } from '../../services';

const { Title, Text } = Typography;

const AdminUserEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      setLoading(true);
      try {
        const response = await adminService.getUserById(id);
        const userData = response.data?.data;
        setUser(userData);
        form.setFieldsValue({
          fullName: userData?.fullName,
          email: userData?.email,
          phone: userData?.phone,
        });
      } catch (error) {
        console.error('Error loading user:', error);
        message.error('Failed to load user details');
        navigate('/admin/users');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [form, id, navigate]);

  const handleFinish = async (values) => {
    setSaving(true);
    try {
      await adminService.updateUser(id, values);
      message.success('User updated successfully');
      navigate('/admin/users');
    } catch (error) {
      console.error('Error updating user:', error);
      message.error(error?.response?.data?.message || 'Failed to update user');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await adminService.deleteUser(id);
      message.success('User deleted successfully');
      navigate('/admin/users');
    } catch (error) {
      console.error('Error deleting user:', error);
      message.error(error?.response?.data?.message || 'Failed to delete user');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Title level={2} style={{ marginBottom: 6, fontFamily: "'Playfair Display', serif" }}>Edit User</Title>
            <Text type="secondary">Update profile details or remove the account.</Text>
          </div>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/admin/users')}>
            Back to Users
          </Button>
        </div>

        {loading ? (
          <div className="flex min-h-[280px] items-center justify-center rounded-2xl border border-gray-100 bg-white">
            <Spin size="large" />
          </div>
        ) : user ? (
          <Row gutter={[24, 24]}>
            <Col xs={24} xl={16}>
              <Card bordered={false} style={{ borderRadius: 24, boxShadow: '0 8px 30px rgba(17,17,17,0.04)' }}>
                <Form form={form} layout="vertical" onFinish={handleFinish} size="large">
                  <Form.Item
                    name="fullName"
                    label="Full Name"
                    rules={[{ required: true, message: 'Full name is required' }]}
                  >
                    <Input prefix={<UserOutlined />} placeholder="Enter full name" />
                  </Form.Item>

                  <Form.Item
                    name="email"
                    label="Email"
                    rules={[{ required: true, message: 'Email is required' }, { type: 'email', message: 'Enter a valid email' }]}
                  >
                    <Input prefix={<MailOutlined />} placeholder="Enter email address" />
                  </Form.Item>

                  <Form.Item
                    name="phone"
                    label="Phone"
                    rules={[{ required: true, message: 'Phone number is required' }]}
                  >
                    <Input prefix={<PhoneOutlined />} placeholder="Enter phone number" />
                  </Form.Item>

                  <Space wrap>
                    <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={saving}>
                      Save Changes
                    </Button>
                    <Popconfirm
                      title="Delete this user?"
                      description="This will soft delete the account and remove it from the active users list."
                      okText="Delete"
                      okButtonProps={{ danger: true }}
                      onConfirm={handleDelete}
                    >
                      <Button danger icon={<DeleteOutlined />} loading={deleting}>
                        Delete User
                      </Button>
                    </Popconfirm>
                  </Space>
                </Form>
              </Card>
            </Col>

            <Col xs={24} xl={8}>
              <Card bordered={false} style={{ borderRadius: 24, boxShadow: '0 8px 30px rgba(17,17,17,0.04)' }}>
                <div className="space-y-4">
                  <div>
                    <Text type="secondary">Current status</Text>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <Tag color={user.emailVerified ? 'success' : 'error'}>{user.emailVerified ? 'Verified' : 'Not verified'}</Tag>
                      <Tag color={user.isActive ? 'blue' : 'default'}>{user.isActive ? 'Active' : 'Inactive'}</Tag>
                      <Tag color={user.role === 'ADMIN' ? 'gold' : 'blue'}>{user.role}</Tag>
                    </div>
                  </div>

                  <Alert
                    type="info"
                    showIcon
                    message="Editing note"
                    description="Only the profile fields are editable here. Verification status is driven by the account record."
                  />

                  <div className="space-y-3 rounded-2xl bg-[#faf7f0] p-4">
                    <div>
                      <Text type="secondary">User ID</Text>
                      <div className="font-medium">{user.id}</div>
                    </div>
                    <div>
                      <Text type="secondary">Joined</Text>
                      <div className="font-medium">
                        {user.createdAt ? new Date(user.createdAt).toLocaleString('en-IN') : '-'}
                      </div>
                    </div>
                    <div>
                      <Text type="secondary">Last login</Text>
                      <div className="font-medium">
                        {user.lastLogin ? new Date(user.lastLogin).toLocaleString('en-IN') : 'Never'}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </Col>
          </Row>
        ) : null}
      </div>
    </AdminLayout>
  );
};

export default AdminUserEdit;