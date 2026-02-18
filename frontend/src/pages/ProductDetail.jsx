import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Row, Col, Typography, Button, Rate, Tag, Divider,
  InputNumber, Radio, Tabs, Image, Spin, Breadcrumb, message, Alert
} from 'antd';
import {
  ShoppingCartOutlined, HeartOutlined, CheckCircleOutlined,
  SafetyCertificateOutlined, CarOutlined
} from '@ant-design/icons';
import MainLayout from '../layouts/MainLayout';
import { productService, cartService } from '../services';
import { getImageUrl } from '../utils/helpers';

const { Title, Text, Paragraph } = Typography;

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0); // Track selected image

  useEffect(() => {
    let isMounted = true;
    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        const response = await productService.getProductById(id);
        const data = response.data?.data;
        if (!isMounted) {
          return;
        }

        if (!data) {
          setProduct(null);
          setIsLoading(false);
          return;
        }

        const primaryImage = data.images?.find((img) => img.isPrimary)?.imageUrl;
        const imageUrls = (data.images || []).map((img) => img.imageUrl);

        const mappedProduct = {
          id: data.id,
          name: data.name,
          description: data.description,
          price: Number(data.discountPrice ?? data.price ?? 0),
          originalPrice: Number(data.price ?? 0),
          rating: data.averageRating ?? 0,
          mainImage: getImageUrl(primaryImage || imageUrls[0]),
          images: imageUrls.length > 0 ? imageUrls.map(url => getImageUrl(url)) : [getImageUrl(null)],
          variants: (data.variants || []).map((variant) => ({
            id: variant.id,
            name: variant.variantName,
          })),
          stock: data.stockQuantity ?? 0,
          sku: data.sku,
        };

        setProduct(mappedProduct);
        setSelectedVariant(mappedProduct.variants[0]?.id ?? null);
        setSelectedImageIndex(0); // Reset to first image on product load
      } catch (error) {
        console.error('Failed to fetch product:', error);
        if (isMounted) {
          setProduct(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchProduct();
    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) {
      return;
    }
    try {
      await cartService.addToCart(product.id, quantity, selectedVariant);
      message.success(`Added ${quantity} ${product.name} to cart`);
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to add to cart');
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div style={{ textAlign: 'center', padding: '100px 0' }}>
          <Spin size="large" />
        </div>
      </MainLayout>
    );
  }

  if (!product) {
    return (
      <MainLayout>
        <div style={{ padding: 40, textAlign: 'center' }}>
          <Title level={3}>Product Not Found</Title>
          <Link to="/shop"><Button type="primary">Go to Shop</Button></Link>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Breadcrumb items={[{ title: 'Home', href: '/' }, { title: 'Shop', href: '/shop' }, { title: product.name }]} style={{ marginBottom: 20 }} />

      <div style={{ background: '#fff', padding: 24, borderRadius: 12 }}>
        <Row gutter={[40, 40]}>
          {/* Image Gallery */}
          <Col xs={24} md={12}>
            {/* Main Image Display */}
            <div style={{ 
              marginBottom: 20, 
              border: '1px solid #f0f0f0', 
              borderRadius: 12, 
              overflow: 'hidden',
              backgroundColor: '#fafafa',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 400
            }}>
              <Image
                src={product.images[selectedImageIndex] || product.mainImage}
                alt={product.name}
                style={{ 
                  width: '100%', 
                  maxHeight: 500, 
                  objectFit: 'contain' 
                }}
              />
            </div>
            
            {/* Thumbnail Gallery */}
            <Row gutter={[10, 10]}>
              {product.images.map((img, idx) => (
                <Col span={6} key={idx}>
                  <div 
                    onClick={() => setSelectedImageIndex(idx)}
                    style={{ 
                      border: selectedImageIndex === idx ? '3px solid #1890ff' : '1px solid #f0f0f0', 
                      borderRadius: 8, 
                      cursor: 'pointer', 
                      overflow: 'hidden',
                      transition: 'all 0.3s ease',
                      opacity: selectedImageIndex === idx ? 1 : 0.7,
                      transform: selectedImageIndex === idx ? 'scale(1.05)' : 'scale(1)',
                    }}
                    onMouseEnter={(e) => {
                      if (selectedImageIndex !== idx) {
                        e.currentTarget.style.opacity = '1';
                        e.currentTarget.style.transform = 'scale(1.02)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedImageIndex !== idx) {
                        e.currentTarget.style.opacity = '0.7';
                        e.currentTarget.style.transform = 'scale(1)';
                      }
                    }}
                  >
                    <Image 
                      src={img} 
                      preview={false} 
                      style={{ 
                        width: '100%', 
                        height: 80, 
                        objectFit: 'cover' 
                      }} 
                      alt={`${product.name} view ${idx + 1}`}
                    />
                  </div>
                </Col>
              ))}
            </Row>
          </Col>

          {/* Product Info */}
          <Col xs={24} md={12}>
            <Title level={2} style={{ fontFamily: "'Playfair Display', serif" }}>{product.name}</Title>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <Rate disabled defaultValue={product.rating} />
              <Text type="secondary">(120 reviews)</Text>
            </div>

            <div style={{ marginBottom: 20 }}>
              {product.originalPrice > product.price && (
                <Text delete type="secondary" style={{ fontSize: 18, marginRight: 10 }}>₹{product.originalPrice.toLocaleString()}</Text>
              )}
              <Text strong style={{ fontSize: 32, color: '#D4AF37' }}>₹{product.price.toLocaleString()}</Text>
              {product.originalPrice > product.price && (
                <Tag color="red" style={{ marginLeft: 10, fontSize: 14 }}>Sale</Tag>
              )}
            </div>

            <Divider />

            <div style={{ marginBottom: 24 }}>
              <Title level={5}>Description</Title>
              <Paragraph type="secondary">{product.description}</Paragraph>
            </div>

            {product.variants && product.variants.length > 0 && (
              <div style={{ marginBottom: 24 }}>
                <Title level={5}>Metal Color</Title>
                <Radio.Group value={selectedVariant} onChange={e => setSelectedVariant(e.target.value)}>
                  {product.variants.map(v => (
                    <Radio.Button value={v.id} key={v.id}>{v.name}</Radio.Button>
                  ))}
                </Radio.Group>
              </div>
            )}

            <div style={{ marginBottom: 24 }}>
              <Title level={5}>Quantity</Title>
              <InputNumber min={1} max={product.stock} value={quantity} onChange={setQuantity} style={{ width: 120 }} />
              {product.stock > 0 && product.stock < 10 && <Text type="warning" style={{ marginLeft: 10 }}>Only {product.stock} left!</Text>}
              {product.stock === 0 && <Text type="danger" style={{ marginLeft: 10 }}>Out of stock</Text>}
            </div>

            <div style={{ display: 'flex', gap: 16, marginBottom: 32 }}>
              <Button
                type="primary"
                size="large"
                icon={<ShoppingCartOutlined />}
                onClick={handleAddToCart}
                style={{ flex: 1, height: 50 }}
                disabled={product.stock === 0}
              >
                Add to Cart
              </Button>
              <Button size="large" icon={<HeartOutlined />} style={{ width: 50 }} />
            </div>

            <div style={{ background: '#f9f9f9', padding: 20, borderRadius: 8 }}>
              <Row gutter={[16, 16]}>
                <Col span={24}><CheckCircleOutlined style={{ color: '#52c41a', marginRight: 8 }} /> Lifetime Warranty</Col>
                <Col span={24}><SafetyCertificateOutlined style={{ color: '#52c41a', marginRight: 8 }} /> 100% Certified Jewellery</Col>
                <Col span={24}><CarOutlined style={{ color: '#52c41a', marginRight: 8 }} /> Free Shipping & Insurance</Col>
              </Row>
            </div>
          </Col>
        </Row>
      </div>

      {/* Tabs Section */}
      <div style={{ marginTop: 40, background: '#fff', padding: 24, borderRadius: 12 }}>
        <Tabs defaultActiveKey="1" items={[
          { label: 'Product Details', key: '1', children: <Paragraph>Detailed specifications...</Paragraph> },
          { label: 'Reviews (120)', key: '2', children: <Paragraph>Customer reviews...</Paragraph> },
          { label: 'Shipping & Returns', key: '3', children: <Paragraph>Shipping policies...</Paragraph> },
        ]} />
      </div>
    </MainLayout>
  );
};

export default ProductDetailPage;
