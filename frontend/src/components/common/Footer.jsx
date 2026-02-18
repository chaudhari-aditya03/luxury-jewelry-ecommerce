import React from 'react';
import { Layout, Row, Col, Typography, Space, Divider, Flex } from 'antd';
import {
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
  InstagramOutlined,
  FacebookOutlined,
  TwitterOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { Footer: AntFooter } = Layout;
const { Title, Text } = Typography;

const Footer = () => {
  return (
    <AntFooter style={{ background: '#000', color: '#fff', padding: '60px 0 24px' }}>
      <div className="container-custom" style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        <Row gutter={[40, 40]}>
          {/* Brand */}
          <Col xs={24} md={8}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <div style={{ width: 40, height: 40, background: 'linear-gradient(135deg, #D4AF37 0%, #b8860b 100%)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold' }}>
                JS
              </div>
              <Title level={3} style={{ color: '#fff', margin: 0, fontFamily: "'Playfair Display', serif" }}>
                Jewelry Store
              </Title>
            </div>
            <Text style={{ color: '#aaa', display: 'block', marginBottom: 20 }}>
              Premium handcrafted jewelry for the modern elegance. timeless designs that sparkle with every moment.
            </Text>
            <Space size="large">
              <InstagramOutlined style={{ fontSize: 24, color: '#fff' }} />
              <FacebookOutlined style={{ fontSize: 24, color: '#fff' }} />
              <TwitterOutlined style={{ fontSize: 24, color: '#fff' }} />
            </Space>
          </Col>

          {/* Shop Links */}
          <Col xs={12} md={5}>
            <Title level={5} style={{ color: '#fff', marginBottom: 20 }}>SHOP</Title>
            <Flex vertical gap="middle">
              <Link to="/shop" style={{ color: '#aaa' }}>All Products</Link>
              <Link to="/shop?category=rings" style={{ color: '#aaa' }}>Rings</Link>
              <Link to="/shop?category=necklaces" style={{ color: '#aaa' }}>Necklaces</Link>
              <Link to="/shop?category=earrings" style={{ color: '#aaa' }}>Earrings</Link>
              <Link to="/shop?category=bracelets" style={{ color: '#aaa' }}>Bracelets</Link>
            </Flex>
          </Col>

          {/* Support Links */}
          <Col xs={12} md={5}>
            <Title level={5} style={{ color: '#fff', marginBottom: 20 }}>SUPPORT</Title>
            <Flex vertical gap="middle">
              <Link to="/contact" style={{ color: '#aaa' }}>Contact Us</Link>
              <Link to="/shipping" style={{ color: '#aaa' }}>Shipping & Returns</Link>
              <Link to="/faq" style={{ color: '#aaa' }}>FAQ</Link>
              <Link to="/size-guide" style={{ color: '#aaa' }}>Size Guide</Link>
              <Link to="/care" style={{ color: '#aaa' }}>Jewelry Care</Link>
            </Flex>
          </Col>

          {/* Contact */}
          <Col xs={24} md={6}>
            <Title level={5} style={{ color: '#fff', marginBottom: 20 }}>CONTACT</Title>
            <Flex vertical gap="middle">
              <Space>
                <PhoneOutlined style={{ color: '#D4AF37' }} />
                <Text style={{ color: '#aaa' }}>+91 98765 43210</Text>
              </Space>
              <Space>
                <MailOutlined style={{ color: '#D4AF37' }} />
                <Text style={{ color: '#aaa' }}>support@jewelrystore.com</Text>
              </Space>
              <Space align="start">
                <EnvironmentOutlined style={{ color: '#D4AF37', marginTop: 4 }} />
                <Text style={{ color: '#aaa' }}>123 Luxury Avenue, Gold Souk,<br />Mumbai, India 400050</Text>
              </Space>
            </Flex>
          </Col>
        </Row>

        <Divider style={{ borderColor: '#333', margin: '40px 0' }} />

        <div style={{ textAlign: 'center', color: '#666' }}>
          <Text style={{ color: '#666' }}>© {new Date().getFullYear()} Jewelry Store. All Rights Reserved.</Text>
        </div>
      </div>
    </AntFooter>
  );
};

export default Footer;
