import React, { useState } from 'react';
import {
  Tabs, Table, Card, Typography, Button, Tag, Avatar,
  Descriptions, List, Form, Input, Row, Col, Space, Divider, Empty
} from 'antd';
import {
  UserOutlined, ShoppingOutlined, EnvironmentOutlined,
  LogoutOutlined, EditOutlined, HeartOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import { useAuth } from '../context/AuthContext';
import { formatPrice, formatDate } from '../utils/helpers';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

const AccountPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);

  // Dummy Data
  const orders = [
    { key: '1', orderId: 'ORD-24X7-001', date: '2024-02-10', total: 75000, status: 'Processing' },
    { key: '2', orderId: 'ORD-24X7-002', date: '2024-01-25', total: 12500, status: 'Delivered' },
    { key: '3', orderId: 'ORD-24X7-003', date: '2024-01-15', total: 45000, status: 'Cancelled' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const columns = [
    { title: 'Order ID', dataIndex: 'orderId', key: 'orderId', render: text => <Text strong>{text}</Text> },
    { title: 'Date', dataIndex: 'date', key: 'date', render: text => formatDate(text) },
    { title: 'Total', dataIndex: 'total', key: 'total', render: text => formatPrice(text) },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: status => {
        let color = 'default';
        if (status === 'Delivered') color = 'success';
        if (status === 'Processing') color = 'processing';
        if (status === 'Cancelled') color = 'error';
        return <Tag color={color}>{status}</Tag>;
      }
    },
    {
      title: 'Action',
      key: 'action',
      render: () => <Button type="link" size="small">View</Button>
    },
  ];

  return (
    <MainLayout>
      <div style={{ padding: '40px 0', maxWidth: 1000, margin: '0 auto' }}>
        <Card variant="borderless" style={{ borderRadius: 12, boxShadow: '0 2px 10px rgba(0,0,0,0.05)', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <Avatar size={80} icon={<UserOutlined />} style={{ backgroundColor: '#D4AF37' }} />
            <div style={{ flex: 1 }}>
              <Title level={3} style={{ margin: 0 }}>{user?.firstName || 'Guest'} {user?.lastName || 'User'}</Title>
              <Text type="secondary">{user?.email || 'guest@example.com'}</Text>
              <div style={{ marginTop: 8 }}>
                <Tag color="gold">Gold Member</Tag>
              </div>
            </div>
            <Button icon={<LogoutOutlined />} onClick={handleLogout} danger>Logout</Button>
          </div>
        </Card>

        <Card variant="borderless" style={{ borderRadius: 12, boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
          <Tabs defaultActiveKey="1" tabPosition="left" size="large">
            <TabPane tab={<span><UserOutlined /> Profile</span>} key="1">
              <div style={{ paddingLeft: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                  <Title level={4}>Personal Information</Title>
                  <Button icon={<EditOutlined />} onClick={() => setEditMode(!editMode)}>Edit</Button>
                </div>

                {editMode ? (
                  <Form layout="vertical" initialValues={user}>
                    <Row gutter={16}>
                      <Col span={12}><Form.Item name="firstName" label="First Name"><Input /></Form.Item></Col>
                      <Col span={12}><Form.Item name="lastName" label="Last Name"><Input /></Form.Item></Col>
                    </Row>
                    <Form.Item name="email" label="Email"><Input disabled /></Form.Item>
                    <Form.Item name="phone" label="Phone"><Input /></Form.Item>
                    <Button type="primary">Save Changes</Button>
                  </Form>
                ) : (
                  <Descriptions column={1} bordered>
                    <Descriptions.Item label="Full Name">{user?.firstName} {user?.lastName}</Descriptions.Item>
                    <Descriptions.Item label="Email">{user?.email}</Descriptions.Item>
                    <Descriptions.Item label="Phone">{user?.phone || 'Not provided'}</Descriptions.Item>
                    <Descriptions.Item label="Member Since">January 2024</Descriptions.Item>
                  </Descriptions>
                )}
              </div>
            </TabPane>

            <TabPane tab={<span><ShoppingOutlined /> My Orders</span>} key="2">
              <div style={{ paddingLeft: 24 }}>
                <Title level={4} style={{ marginBottom: 20 }}>Order History</Title>
                <Table columns={columns} dataSource={orders} pagination={false} />
              </div>
            </TabPane>

            <TabPane tab={<span><EnvironmentOutlined /> Addresses</span>} key="3">
              <div style={{ paddingLeft: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                  <Title level={4}>Saved Addresses</Title>
                  <Button type="primary">Add New</Button>
                </div>
                <List
                  grid={{ gutter: 16, column: 2 }}
                  dataSource={[{ type: 'Home', address: '123 Luxury Ave, Mumbai' }]}
                  renderItem={item => (
                    <List.Item>
                      <Card title={item.type} actions={[<a key="edit">Edit</a>, <a key="delete">Delete</a>]}>
                        {item.address}
                      </Card>
                    </List.Item>
                  )}
                />
              </div>
            </TabPane>

            <TabPane tab={<span><HeartOutlined /> Wishlist</span>} key="4">
              <div style={{ paddingLeft: 24 }}>
                <Title level={4} style={{ marginBottom: 20 }}>My Wishlist</Title>
                <Empty description="Your wishlist is empty" />
              </div>
            </TabPane>
          </Tabs>
        </Card>
      </div>
    </MainLayout>
  );
};

export default AccountPage;
