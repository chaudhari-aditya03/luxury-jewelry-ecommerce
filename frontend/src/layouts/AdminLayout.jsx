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

  const getBreadcrumbTitle = () => {
    const segment = location.pathname.split('/').filter(Boolean).pop();
    if (!segment || segment === 'admin') return 'dashboard';
    return segment;
  };

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
    },
  ];

  const handleUserMenuClick = ({ key }) => {
    if (key === 'logout') {
      handleLogout();
      return;
    }

    if (key === 'profile') {
      navigate('/admin/profile');
      return;
    }

    if (key === 'settings') {
      navigate('/admin/settings');
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        theme="dark"
        style={{
          boxShadow: '4px 0 24px rgba(17, 17, 17, 0.08)',
          background: '#111111',
        }}
      >
        <div
          className="logo"
          style={{
            height: 80,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: collapsed ? 18 : 15,
            fontWeight: '600',
            color: '#C6A769',
            letterSpacing: collapsed ? '0' : '0.2em',
            borderBottom: '1px solid rgba(198, 167, 105, 0.15)',
            transition: 'all 0.3s ease',
          }}
        >
          {collapsed ? '💎' : '💎 MAISON'}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          style={{
            borderRight: 0,
            background: '#111111',
            paddingTop: 16,
          }}
        />
      </Sider>
      <Layout className="site-layout" style={{ background: '#f8f5f0' }}>
        <Header
          style={{
            padding: '0 32px',
            background: '#ffffff',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
            height: 80,
            borderBottom: '1px solid rgba(198,167,105,0.08)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
              className: 'trigger',
              onClick: () => setCollapsed(!collapsed),
              style: { fontSize: 18, marginRight: 24, cursor: 'pointer', color: '#1f1f1f' }
            })}
            <Breadcrumb
              items={[{ title: 'Maison' }, { title: <span style={{ color: '#C6A769', textTransform: 'capitalize', fontWeight: '500' }}>{getBreadcrumbTitle()}</span> }]}
            />
          </div>

          <Space size="large">
            <Button
              type="text"
              icon={<BellOutlined style={{ fontSize: 18, color: '#1f1f1f' }} />}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: '#f8f5f0'
              }}
            />
            <Dropdown menu={{ items: userMenuItems, onClick: handleUserMenuClick }}>
              <span>
                <Space style={{ cursor: 'pointer', padding: '4px 12px', borderRadius: 9999, background: '#f8f5f0' }}>
                  <Avatar style={{ backgroundColor: '#C6A769', color: '#ffffff', fontWeight: 'bold' }}>
                    {(user?.fullName || user?.firstName || 'A').charAt(0).toUpperCase()}
                  </Avatar>
                  <span style={{ fontWeight: '600', fontSize: 13, color: '#1f1f1f' }}>
                    {user?.fullName || user?.firstName || 'Admin'}
                  </span>
                </Space>
              </span>
            </Dropdown>
          </Space>
        </Header>
        <Content
          style={{
            margin: '24px',
            padding: '32px',
            minHeight: 280,
            background: '#ffffff',
            borderRadius: 24,
            boxShadow: '0 8px 30px rgba(17,17,17,0.02)',
            border: '1px solid rgba(198,167,105,0.08)'
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
