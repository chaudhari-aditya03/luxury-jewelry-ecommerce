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
    <AntFooter style={{ background: 'linear-gradient(180deg, #111111 0%, #17130d 100%)', color: '#fff', padding: '36px 0 18px' }}>
      <div className="container-custom" style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>
        <Row gutter={[28, 28]}>
          {/* Brand */}
          <Col xs={24} md={8}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{ width: 40, height: 40, background: 'linear-gradient(135deg, #D4AF37 0%, #b8860b 100%)', borderRadius: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold' }}>
                JS
              </div>
              <Title level={3} style={{ color: '#fff', margin: 0, fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.25rem, 2vw, 1.75rem)' }}>
                Jewelry Store
              </Title>
            </div>
            <Text style={{ color: '#bbb', display: 'block', marginBottom: 16, lineHeight: 1.7 }}>
              Premium handcrafted jewelry for the modern elegance. timeless designs that sparkle with every moment.
            </Text>
            <Space size="middle" wrap>
              <InstagramOutlined style={{ fontSize: 22, color: '#fff' }} />
              <FacebookOutlined style={{ fontSize: 22, color: '#fff' }} />
              <TwitterOutlined style={{ fontSize: 22, color: '#fff' }} />
            </Space>
          </Col>

          {/* Shop Links */}
          <Col xs={12} md={5}>
            <Title level={5} style={{ color: '#fff', marginBottom: 16, fontSize: 14, letterSpacing: '0.16em' }}>SHOP</Title>
            <Flex vertical gap="small">
              <Link to="/shop" style={{ color: '#bbb' }}>All Products</Link>
              <Link to="/shop?category=rings" style={{ color: '#bbb' }}>Rings</Link>
              <Link to="/shop?category=necklaces" style={{ color: '#bbb' }}>Necklaces</Link>
              <Link to="/shop?category=earrings" style={{ color: '#bbb' }}>Earrings</Link>
              <Link to="/shop?category=bracelets" style={{ color: '#bbb' }}>Bracelets</Link>
            </Flex>
          </Col>

          {/* Support Links */}
          <Col xs={12} md={5}>
            <Title level={5} style={{ color: '#fff', marginBottom: 16, fontSize: 14, letterSpacing: '0.16em' }}>SUPPORT</Title>
            <Flex vertical gap="small">
              <Link to="/contact" style={{ color: '#bbb' }}>Contact Us</Link>
              <Link to="/shipping" style={{ color: '#bbb' }}>Shipping & Returns</Link>
              <Link to="/faq" style={{ color: '#bbb' }}>FAQ</Link>
              <Link to="/size-guide" style={{ color: '#bbb' }}>Size Guide</Link>
              <Link to="/care" style={{ color: '#bbb' }}>Jewelry Care</Link>
            </Flex>
          </Col>

          {/* Contact */}
          <Col xs={24} md={6}>
            <Title level={5} style={{ color: '#fff', marginBottom: 16, fontSize: 14, letterSpacing: '0.16em' }}>CONTACT</Title>
            <Flex vertical gap="small">
              <Space>
                <PhoneOutlined style={{ color: '#D4AF37' }} />
                <Text style={{ color: '#bbb' }}>+91 98765 43210</Text>
              </Space>
              <Space>
                <MailOutlined style={{ color: '#D4AF37' }} />
                <Text style={{ color: '#bbb' }}>support@jewelrystore.com</Text>
              </Space>
              <Space align="start">
                <EnvironmentOutlined style={{ color: '#D4AF37', marginTop: 4 }} />
                <Text style={{ color: '#bbb' }}>123 Luxury Avenue, Gold Souk,<br />Mumbai, India 400050</Text>
              </Space>
            </Flex>
          </Col>
        </Row>

        <Divider style={{ borderColor: 'rgba(255,255,255,0.12)', margin: '28px 0 18px' }} />

        <div style={{ textAlign: 'center', color: '#7d7d7d', fontSize: 13 }}>
          <Text style={{ color: '#7d7d7d' }}>© {new Date().getFullYear()} Jewelry Store. All Rights Reserved.</Text>
        </div>
      </div>
    </AntFooter>
  );
};

export default Footer;
