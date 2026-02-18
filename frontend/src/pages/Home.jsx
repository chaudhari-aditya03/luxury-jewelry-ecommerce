import React, { useState, useEffect } from 'react';
import { Typography, Row, Col, Button, Spin, Result, Card } from 'antd';
import { RocketOutlined, SafetyCertificateOutlined, SketchOutlined, CustomerServiceOutlined } from '@ant-design/icons';
import MainLayout from '../layouts/MainLayout';
import HeroCarousel from '../components/home/HeroCarousel';
import ProductCard from '../components/product/ProductCard';
import { productService } from '../services';

const { Title, Paragraph } = Typography;

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mock data for initial display if API fails or is empty
  const mockProducts = [
    { id: 101, name: 'Diamond Solitaire Ring', price: 45000, rating: 4.8, category: 'Rings', image: 'https://images.unsplash.com/photo-1605100804763-ebea2406a95f?q=80&w=1935&auto=format&fit=crop' },
    { id: 102, name: 'Gold Layered Necklace', price: 28000, rating: 4.5, category: 'Necklaces', image: 'https://images.unsplash.com/photo-1599643478518-17488fbbcd75?q=80&w=1974&auto=format&fit=crop' },
    { id: 103, name: 'Pearl Drop Earrings', price: 12500, rating: 4.6, category: 'Earrings', image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1974&auto=format&fit=crop' },
    { id: 104, name: 'Platinum Wedding Band', price: 35000, rating: 4.9, category: 'Rings', image: 'https://images.unsplash.com/photo-1598560975630-161464a35ccc?q=80&w=1974&auto=format&fit=crop' },
  ];

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setIsLoading(true);
        // Uncomment when API is ready
        // const response = await productService.getFeaturedProducts(4);
        // setFeaturedProducts(response.data.data.content || response.data.data || []);

        // Simulating API call
        setTimeout(() => {
          setFeaturedProducts(mockProducts);
          setIsLoading(false);
        }, 1000);

      } catch (err) {
        console.error('Failed to fetch featured products:', err);
        setError('Failed to load featured products');
        setIsLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  const features = [
    { icon: <RocketOutlined style={{ fontSize: 36, color: '#D4AF37' }} />, title: 'Free Shipping', desc: 'On all orders above ₹5000' },
    { icon: <SafetyCertificateOutlined style={{ fontSize: 36, color: '#D4AF37' }} />, title: 'Certified Authenticity', desc: '100% Hallmark Certified' },
    { icon: <SketchOutlined style={{ fontSize: 36, color: '#D4AF37' }} />, title: 'Premium Quality', desc: 'Handcrafted Perfection' },
    { icon: <CustomerServiceOutlined style={{ fontSize: 36, color: '#D4AF37' }} />, title: '24/7 Support', desc: 'Dedicated Customer Care' }
  ];

  return (
    <MainLayout>
      {/* Hero Section */}
      <HeroCarousel />

      {/* Benefits Section */}
      <div style={{ padding: '60px 0', background: '#fff' }}>
        <Row gutter={[32, 32]} justify="center">
          {features.map((feature, index) => (
            <Col xs={24} sm={12} md={6} key={index} style={{ textAlign: 'center' }}>
              <Card bordered={false} hoverable style={{ borderRadius: 12 }}>
                <div style={{ marginBottom: 16 }}>{feature.icon}</div>
                <Title level={4} style={{ marginBottom: 8 }}>{feature.title}</Title>
                <Paragraph type="secondary">{feature.desc}</Paragraph>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* Featured Products */}
      <div style={{ padding: '60px 0' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <Title level={2} style={{ fontFamily: "'Playfair Display', serif" }}>Featured Collection</Title>
          <Paragraph type="secondary" style={{ fontSize: 16 }}>Handpicked luxury just for you</Paragraph>
        </div>

        {isLoading ? (
          <div style={{ textAlign: 'center', padding: 50 }}>
            <Spin size="large" />
          </div>
        ) : error ? (
          <Result status="warning" title={error} />
        ) : (
          <Row gutter={[24, 24]}>
            {featuredProducts.map(product => (
              <Col xs={24} sm={12} md={6} key={product.id}>
                <ProductCard product={product} />
              </Col>
            ))}
          </Row>
        )}

        <div style={{ textAlign: 'center', marginTop: 40 }}>
          <Button type="primary" size="large" style={{ padding: '0 40px' }}>
            View All Collection
          </Button>
        </div>
      </div>
    </MainLayout>
  );
};

export default HomePage;
