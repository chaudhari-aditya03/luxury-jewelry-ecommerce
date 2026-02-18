import React, { useState } from 'react';
import { Layout, Menu, Button, Dropdown, Avatar, Space, message, Breadcrumb } from 'antd';
import {
  DashboardOutlined, ShoppingOutlined, UserOutlined,
  OrderedListOutlined, BarChartOutlined, LogoutOutlined,
  MenuUnfoldOutlined, MenuFoldOutlined, BellOutlined, DollarOutlined,
  TagsOutlined, GiftOutlined
} from '@ant-design/icons';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const { Header, Sider, Content } = Layout;

const AdminLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
    message.success('Logged out successfully');
  };

  const menuItems = [
    { key: '/admin', icon: <DashboardOutlined />, label: <Link to="/admin">Dashboard</Link> },
    { key: '/admin/products', icon: <ShoppingOutlined />, label: <Link to="/admin/products">Products</Link> },
    { key: '/admin/categories', icon: <TagsOutlined />, label: <Link to="/admin/categories">Categories</Link> },
    { key: '/admin/orders', icon: <OrderedListOutlined />, label: <Link to="/admin/orders">Orders</Link> },
    { key: '/admin/users', icon: <UserOutlined />, label: <Link to="/admin/users">Users</Link> },
    { key: '/admin/coupons', icon: <GiftOutlined />, label: <Link to="/admin/coupons">Coupons</Link> },
    { key: '/admin/analytics', icon: <BarChartOutlined />, label: <Link to="/admin/analytics">Analytics</Link> },
    { key: '/admin/payments', icon: <DollarOutlined />, label: <Link to="/admin/payments">Payments</Link> },
  ];

  const userMenuItems = [
    { key: 'profile', label: 'Profile' },
    { key: 'settings', label: 'Settings' },
    { type: 'divider' },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      danger: true,
      onClick: handleLogout,
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider trigger={null} collapsible collapsed={collapsed} theme="light" style={{ boxShadow: '2px 0 8px rgba(0,0,0,0.05)' }}>
        <div className="logo" style={{ height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 'bold', color: '#D4AF37' }}>
          {collapsed ? 'JS' : 'Jewelry Store'}
        </div>
        <Menu
          theme="light"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          style={{ borderRight: 0 }}
        />
      </Sider>
      <Layout className="site-layout">
        <Header style={{ padding: '0 24px', background: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
              className: 'trigger',
              onClick: () => setCollapsed(!collapsed),
              style: { fontSize: 18, marginRight: 24, cursor: 'pointer' }
            })}
            <Breadcrumb items={[{ title: 'Admin' }, { title: location.pathname.split('/').pop() }]} />
          </div>

          <Space size="large">
            <Button type="text" icon={<BellOutlined style={{ fontSize: 18 }} />} />
            <Dropdown menu={{ items: userMenuItems }}>
              <span>
                <Space style={{ cursor: 'pointer' }}>
                  <Avatar style={{ backgroundColor: '#fde3cf', color: '#f56a00' }}>A</Avatar>
                  <span>{user?.firstName || 'Admin'}</span>
                </Space>
              </span>
            </Dropdown>
          </Space>
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: '#fff',
            borderRadius: 8
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
