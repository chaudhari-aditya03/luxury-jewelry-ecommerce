import React from 'react';
import { Card, Button, Rate, Tag, Typography, message } from 'antd';
import { ShoppingCartOutlined, HeartOutlined, EyeOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { Meta } = Card;
const { Text, Title } = Typography;

const ProductCard = ({ product, onAddToCart, onAddToWishlist }) => {
  // Default values if product prop is missing or incomplete
  const {
    id = 1,
    name = 'Product Name',
    price = 0,
    image = 'https://via.placeholder.com/300',
    rating = 4.5,
    category = 'Jewelry'
  } = product || {};

  const handleAddToCart = (e) => {
    e.preventDefault(); // Prevent Link navigation
    if (onAddToCart) {
      onAddToCart(id);
    } else {
      message.success('Added to cart');
    }
  };

  return (
    <Link to={`/product/${id}`}>
      <Card
        hoverable
        cover={
          <div style={{ position: 'relative', overflow: 'hidden', height: 300 }}>
            <img
              alt={name}
              src={image}
              style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }}
              className="product-image"
            />
            <div
              style={{
                position: 'absolute',
                top: 10,
                right: 10,
                zIndex: 1
              }}
            >
              <Button
                shape="circle"
                icon={<HeartOutlined />}
                onClick={(e) => { e.preventDefault(); onAddToWishlist && onAddToWishlist(id); }}
                style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
              />
            </div>
          </div>
        }
        style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid #f0f0f0' }}
        styles={{ body: { padding: 20 } }}
        variant="outlined"
        actions={[
          <Button type="text" icon={<ShoppingCartOutlined />} onClick={handleAddToCart} block key="cart">
            Add to Cart
          </Button>,
          <Button type="text" icon={<EyeOutlined />} block key="view">
            View Details
          </Button>
        ]}
      >
        <div style={{ marginBottom: 10 }}>
          <Tag color="gold">{category}</Tag>
        </div>
        <Title level={5} style={{ marginBottom: 8, height: 48, overflow: 'hidden' }}>{name}</Title>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text strong style={{ fontSize: 18, color: '#D4AF37' }}>
            ₹{price.toLocaleString('en-IN')}
          </Text>
          <Rate disabled defaultValue={rating} style={{ fontSize: 14 }} />
        </div>
      </Card>
    </Link>
  );
};

export default ProductCard;
