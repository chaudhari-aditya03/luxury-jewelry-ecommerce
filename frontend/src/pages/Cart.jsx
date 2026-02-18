import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Table, Button, InputNumber, Typography, Card, Row, Col,
  Input, Space, Divider, message, Popconfirm, Empty, Tooltip
} from 'antd';
import { DeleteOutlined, ShoppingCartOutlined, ArrowRightOutlined } from '@ant-design/icons';
import MainLayout from '../layouts/MainLayout';
import { formatPrice, getImageUrl } from '../utils/helpers';
import { cartService } from '../services';

const { Title, Text, Paragraph } = Typography;

const CartPage = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [couponCode, setCouponCode] = useState('');
  const [totals, setTotals] = useState({ subtotal: 0, totalItems: 0 });

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    setIsLoading(true);
    try {
      const response = await cartService.getCart();
      const cart = response.data?.data;

      const items = (cart?.items || []).map((item) => ({
        key: item.id,
        id: item.id,
        productId: item.productId,
        name: item.productName,
        price: Number(item.price ?? 0),
        quantity: item.quantity ?? 1,
        image: getImageUrl(item.productImage),
        variantName: item.variantName || null,
      }));

      setCartItems(items);
      setTotals({
        subtotal: Number(cart?.totalPrice ?? 0),
        totalItems: cart?.totalItems ?? items.length,
      });
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to load cart');
      setCartItems([]);
      setTotals({ subtotal: 0, totalItems: 0 });
    }
    setIsLoading(false);
  };

  const handleRemove = async (productId) => {
    try {
      await cartService.removeFromCart(productId);
      message.success('Item removed from cart');
      fetchCart();
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to remove item');
    }
  };

  const handleQuantityChange = async (productId, value) => {
    try {
      await cartService.updateCartItem(productId, value);
      fetchCart();
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to update quantity');
    }
  };

  const columns = [
    {
      title: 'Product',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <Space>
          <img src={record.image} alt={text} style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 8 }} />
          <div>
            <Link to={`/product/${record.productId}`} style={{ fontWeight: 500, color: '#1f1f1f' }}>{text}</Link>
            {record.variantName && (
              <div style={{ fontSize: 12, color: '#888' }}>{record.variantName}</div>
            )}
          </div>
        </Space>
      ),
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price) => formatPrice(price),
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (quantity, record) => (
        <InputNumber
          min={1}
          max={10}
          value={quantity}
          onChange={(value) => handleQuantityChange(record.productId, value)}
        />
      ),
    },
    {
      title: 'Total',
      key: 'total',
      render: (_, record) => <Text strong>{formatPrice(record.price * record.quantity)}</Text>,
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Popconfirm title="Remove this item?" onConfirm={() => handleRemove(record.productId)}>
          <Button type="text" danger icon={<DeleteOutlined />} />
        </Popconfirm>
      ),
    },
  ];

  const subtotal = totals.subtotal;
  const tax = subtotal * 0.18; // 18% GST Example
  const total = subtotal + tax;

  if (!isLoading && cartItems.length === 0) {
    return (
      <MainLayout>
        <div style={{ textAlign: 'center', padding: '100px 20px' }}>
          <ShoppingCartOutlined style={{ fontSize: 64, color: '#ccc', marginBottom: 20 }} />
          <Title level={3}>Your Cart is Empty</Title>
          <Paragraph style={{ color: '#888', marginBottom: 30 }}>Looks like you haven't added any luxury items yet.</Paragraph>
          <Link to="/shop">
            <Button type="primary" size="large">Start Shopping</Button>
          </Link>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div style={{ padding: '40px 0' }}>
        <Title level={2} style={{ fontFamily: "'Playfair Display', serif", marginBottom: 30 }}>Shopping Cart</Title>

        <Row gutter={[32, 32]}>
          <Col xs={24} lg={16}>
            <Table
              columns={columns}
              dataSource={cartItems}
              pagination={false}
              loading={isLoading}
              scroll={{ x: 600 }}
              style={{ background: '#fff', borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
            />
            <div style={{ marginTop: 24 }}>
              <Link to="/shop">
                <Button icon={<ArrowRightOutlined rotate={180} />}>Continue Shopping</Button>
              </Link>
            </div>
          </Col>

          <Col xs={24} lg={8}>
            <Card title="Order Summary" variant="borderless" style={{ borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
              <Space direction="vertical" style={{ width: '100%' }} size="large">
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text>Subtotal</Text>
                  <Text strong>{formatPrice(subtotal)}</Text>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text>Tax (18% GST)</Text>
                  <Text strong>{formatPrice(tax)}</Text>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text>Shipping</Text>
                  <Text type="success">Free</Text>
                </div>

                <Divider style={{ margin: '12px 0' }} />

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Title level={4}>Total</Title>
                  <Title level={4} style={{ color: '#D4AF37' }}>{formatPrice(total)}</Title>
                </div>

                <div style={{ display: 'flex', gap: 8 }}>
                  <Input placeholder="Coupon Code" value={couponCode} onChange={e => setCouponCode(e.target.value)} />
                  <Button onClick={() => message.info('Invalid Coupon')}>Apply</Button>
                </div>

                <Button type="primary" block size="large" onClick={() => navigate('/checkout')}>
                  Proceed to Checkout
                </Button>
              </Space>
            </Card>
          </Col>
        </Row>
      </div>
    </MainLayout>
  );
};

export default CartPage;
