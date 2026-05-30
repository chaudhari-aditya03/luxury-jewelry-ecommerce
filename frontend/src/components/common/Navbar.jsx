import React, { useEffect, useState } from 'react';
import { Layout, Menu, Button, Badge, Drawer, Dropdown, Avatar, Input, Space, theme } from 'antd';
import {
  ShoppingCartOutlined,
  UserOutlined,
  MenuOutlined,
  SearchOutlined,
  HeartOutlined,
  LogoutOutlined,
  ShoppingOutlined,
  DashboardOutlined
} from '@ant-design/icons';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { cartService } from '../../services';

const { Header } = Layout;
const { Search } = Input;

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = theme.useToken();
  const selectedMenuKey = location.pathname.startsWith('/admin') ? '/admin' : location.pathname;

  const handleLogout = () => {
    logout();
    setCartCount(0);
    navigate('/');
  };

  useEffect(() => {
    const fetchCartCount = async () => {
      if (!isAuthenticated) {
        setCartCount(0);
        return;
      }

      try {
        const response = await cartService.getCart();
        const cart = response.data?.data;
        setCartCount(Number(cart?.totalItems ?? 0));
      } catch {
        setCartCount(0);
      }
    };

    fetchCartCount();
  }, [isAuthenticated, location.pathname]);

  const menuItems = [
    { key: '/', label: <Link to="/">Home</Link> },
    { key: '/shop', label: <Link to="/shop">Shop</Link> },
    { key: '/categories', label: <Link to="/categories">Categories</Link> },
    { key: '/about', label: <Link to="/about">About</Link> },
    ...(isAuthenticated && isAdmin
      ? [{ key: '/admin', label: <Link to="/admin">Dashboard</Link> }]
      : []),
  ];

  const userMenuItems = [
    ...(isAuthenticated && isAdmin
      ? [{
          key: 'dashboard',
          icon: <DashboardOutlined />,
          label: <Link to="/admin">Dashboard</Link>,
        }]
      : []),
    {
      key: 'account',
      icon: <UserOutlined />,
      label: <Link to="/account">My Account</Link>,
    },
    {
      key: 'orders',
      icon: <ShoppingOutlined />,
      label: <Link to="/account/orders">My Orders</Link>,
    },
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
    <>
      <Header
        style={{
          position: 'fixed',
          zIndex: 1000,
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#fff',
          padding: '0 24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
        }}
      >
        {/* Logo */}
        <div className="logo" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 32, height: 32, background: `linear-gradient(135deg, ${token.colorPrimary} 0%, #b8860b 100%)`, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold' }}>
            JS
          </div>
          <Link to="/" style={{ fontSize: 20, fontWeight: 700, color: '#1f1f1f', fontFamily: "'Playfair Display', serif" }}>
            Jewelry Store
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex flex-1 justify-center">
          <Menu
            mode="horizontal"
            selectedKeys={[selectedMenuKey]}
            items={menuItems}
            style={{ borderBottom: 'none', minWidth: 400, justifyContent: 'center' }}
          />
        </div>

        {/* Actions */}
        <Space size="middle">
          <div className="hidden md:block">
            <Search placeholder="Search..." onSearch={value => navigate(`/shop?search=${value}`)} style={{ width: 200 }} />
          </div>

          <Link to="/wishlist">
            <Button type="text" icon={<HeartOutlined style={{ fontSize: 20 }} />} />
          </Link>

          <Link to={isAuthenticated ? "/cart" : "/login"}>
            <Badge count={cartCount} color={token.colorPrimary}>
              <Button type="text" icon={<ShoppingCartOutlined style={{ fontSize: 20 }} />} />
            </Badge>
          </Link>

          {isAuthenticated ? (
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" arrow>
              <span>
                <Avatar icon={<UserOutlined />} style={{ backgroundColor: token.colorPrimary, cursor: 'pointer' }} />
              </span>
            </Dropdown>
          ) : (
            <Link to="/login">
              <Button type="primary">Login</Button>
            </Link>
          )}

          {/* Mobile Menu Button */}
          <Button
            className="md:hidden"
            type="text"
            icon={<MenuOutlined />}
            onClick={() => setMobileMenuOpen(true)}
          />
        </Space>
      </Header>

      {/* Mobile Drawer */}
      <Drawer
        title="Menu"
        placement="right"
        onClose={() => setMobileMenuOpen(false)}
        open={mobileMenuOpen}
      >
        <Menu mode="vertical" selectedKeys={[selectedMenuKey]} items={menuItems} onClick={() => setMobileMenuOpen(false)} />
        <div style={{ marginTop: 20 }}>
          <Search placeholder="Search products..." onSearch={value => { navigate(`/shop?search=${value}`); setMobileMenuOpen(false); }} />
        </div>
      </Drawer>
    </>
  );
};

export default Navbar;
