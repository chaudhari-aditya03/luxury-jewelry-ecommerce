import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Table, Button, InputNumber, Typography, Card, Row, Col,
  Input, Space, Divider, message, Popconfirm, Empty
} from 'antd';
import { DeleteOutlined, ShoppingCartOutlined, ArrowRightOutlined } from '@ant-design/icons';
import MainLayout from '../layouts/MainLayout';
import { formatPrice, getImageUrl } from '../utils/helpers';
import { cartService, couponService } from '../services';
import { useAuth } from '../context/AuthContext';

const { Title, Text, Paragraph } = Typography;

const CartPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [totals, setTotals] = useState({ subtotal: 0, totalItems: 0 });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchCart();

    const savedCoupon = localStorage.getItem('luxury-maison-applied-coupon');
    if (savedCoupon) {
      try {
        const parsedCoupon = JSON.parse(savedCoupon);
        setCouponCode(parsedCoupon?.code || '');
        setAppliedCoupon(parsedCoupon);
      } catch {
        localStorage.removeItem('luxury-maison-applied-coupon');
      }
    }
  }, [isAuthenticated]);

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

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      message.error('Enter a coupon code');
      return;
    }

    try {
      const response = await couponService.applyCoupon(couponCode.trim(), subtotal);
      const couponData = response.data?.data;
      setAppliedCoupon(couponData);
      localStorage.setItem('luxury-maison-applied-coupon', JSON.stringify(couponData));
      message.success(couponData?.message || 'Coupon applied successfully');
    } catch (error) {
      setAppliedCoupon(null);
      localStorage.removeItem('luxury-maison-applied-coupon');
      message.error(error.response?.data?.message || 'Invalid or expired coupon');
    }
  };

  const handleClearCoupon = () => {
    setCouponCode('');
    setAppliedCoupon(null);
    localStorage.removeItem('luxury-maison-applied-coupon');
    message.success('Coupon removed');
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
  const couponDiscount = Number(appliedCoupon?.discountAmount ?? 0);
  const tax = subtotal * 0.18; // 18% GST Example
  const total = Math.max(0, subtotal - couponDiscount) + tax;

  if (!isLoading && cartItems.length === 0) {
    return (
      <MainLayout>
        <section className="page-section">
          <div className="page-shell">
            <div className="page-card p-8 text-center md:p-12">
              <ShoppingCartOutlined style={{ fontSize: 64, color: '#c6a769', marginBottom: 20 }} />
              <Title level={3} className="!mb-2">Your Cart is Empty</Title>
              <Paragraph className="!mx-auto !mb-8 !max-w-xl !text-muted">
                Looks like you haven't added any luxury items yet.
              </Paragraph>
              <Link to="/shop">
                <Button type="primary" size="large">Start Shopping</Button>
              </Link>
            </div>
          </div>
        </section>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <section className="page-section">
        <div className="page-shell content-stack">
          <header className="page-card p-6 md:p-8">
            <p className="page-eyebrow">Shopping Bag</p>
            <h1 className="page-title mt-3">Your Cart</h1>
            <p className="page-subtitle">Review your selected pieces, adjust quantities, and continue to checkout when ready.</p>
          </header>

          <Row gutter={[32, 32]}>
            <Col xs={24} lg={16}>
              <div className="hidden md:block">
                <Table
                  columns={columns}
                  dataSource={cartItems}
                  pagination={false}
                  loading={isLoading}
                  scroll={{ x: 600 }}
                  style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
                />
              </div>

              <div className="space-y-4 md:hidden">
                {cartItems.map((item) => (
                  <article key={item.id} className="page-card-soft p-4">
                    <div className="flex gap-4">
                      <img src={item.image} alt={item.name} className="h-24 w-20 rounded-2xl object-cover" />
                      <div className="min-w-0 flex-1">
                        <Link to={`/product/${item.productId}`} className="line-clamp-2 font-display text-lg font-semibold text-luxury no-underline">
                          {item.name}
                        </Link>
                        {item.variantName ? <p className="mt-1 text-sm text-muted">{item.variantName}</p> : null}
                        <p className="mt-2 text-sm font-semibold text-gold">{formatPrice(item.price)}</p>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between gap-3">
                      <div className="flex flex-1 items-center gap-3">
                        <InputNumber
                          min={1}
                          max={10}
                          value={item.quantity}
                          onChange={(value) => handleQuantityChange(item.productId, value)}
                          className="!h-11 !w-full !rounded-full"
                        />
                        <Popconfirm title="Remove this item?" onConfirm={() => handleRemove(item.productId)}>
                          <Button type="text" danger icon={<DeleteOutlined />} />
                        </Popconfirm>
                      </div>
                      <Text strong>{formatPrice(item.price * item.quantity)}</Text>
                    </div>
                  </article>
                ))}
              </div>

              <div className="mt-6">
                <Link to="/shop">
                  <Button icon={<ArrowRightOutlined rotate={180} />}>Continue Shopping</Button>
                </Link>
              </div>
            </Col>

            <Col xs={24} lg={8}>
              <Card title="Order Summary" variant="borderless" style={{ borderRadius: 16, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                <Space orientation="vertical" style={{ width: '100%' }} size="large">
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text>Subtotal</Text>
                    <Text strong>{formatPrice(subtotal)}</Text>
                  </div>
                  {appliedCoupon ? (
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Text>Coupon ({appliedCoupon.code})</Text>
                      <Text type="success">-{formatPrice(couponDiscount)}</Text>
                    </div>
                  ) : null}

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
                    <Title level={4} style={{ color: '#C6A769' }}>{formatPrice(total)}</Title>
                  </div>

                  {appliedCoupon ? (
                    <div style={{ borderRadius: 12, background: '#faf6ea', padding: 12 }}>
                      <Text strong>{appliedCoupon.code}</Text>
                      <div style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>
                        {appliedCoupon.message || 'Coupon applied successfully'}
                      </div>
                      <Button type="link" onClick={handleClearCoupon} style={{ padding: 0, height: 'auto' }}>
                        Remove coupon
                      </Button>
                    </div>
                  ) : null}

                  <div className="stacked-actions">
                    <Input placeholder="Coupon Code" value={couponCode} onChange={e => setCouponCode(e.target.value)} />
                    <Button onClick={handleApplyCoupon}>Apply</Button>
                  </div>

                  <Button type="primary" block size="large" onClick={() => navigate('/checkout')}>
                    Proceed to Checkout
                  </Button>
                </Space>
              </Card>
            </Col>
          </Row>
        </div>
      </section>
    </MainLayout>
  );
};

export default CartPage;
