import React, { useEffect, useMemo, useState } from 'react';
import { Button, Card, Col, Empty, message, Row, Space, Spin, Tag, Typography } from 'antd';
import { CopyOutlined, GiftOutlined, ReloadOutlined, ShoppingOutlined } from '@ant-design/icons';
import MainLayout from '../layouts/MainLayout';
import { couponService } from '../services';
import { useAuth } from '../context/AuthContext';
import { formatDate } from '../utils/helpers';

const { Title, Text, Paragraph } = Typography;

const statusColors = {
  Available: 'success',
  Used: 'default',
  Locked: 'warning',
  Inactive: 'default',
};

const MyCouponsPage = () => {
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [couponItems, setCouponItems] = useState([]);
  const [filter, setFilter] = useState('All');

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const response = await couponService.getMyCoupons();
      setCouponItems(response.data?.data || []);
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to load coupons');
      setCouponItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    fetchCoupons();
  }, [isAuthenticated]);

  const visibleCoupons = useMemo(() => {
    if (filter === 'All') {
      return couponItems;
    }
    return couponItems.filter((coupon) => coupon.status === filter);
  }, [couponItems, filter]);

  const summary = useMemo(() => ({
    available: couponItems.filter((coupon) => coupon.status === 'Available').length,
    used: couponItems.filter((coupon) => coupon.status === 'Used').length,
    locked: couponItems.filter((coupon) => coupon.status === 'Locked').length,
  }), [couponItems]);

  const handleCopy = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      message.success(`${code} copied`);
    } catch {
      message.error('Unable to copy coupon code');
    }
  };

  return (
    <MainLayout>
      <section className="page-section">
        <div className="page-shell content-stack">
          <header className="page-card p-6 md:p-8">
            <p className="page-eyebrow">Rewards center</p>
            <h1 className="page-title mt-3">My Coupons</h1>
            <p className="page-subtitle">Track your welcome offer, first-order reward, VIP perks, and any active promotional codes.</p>
          </header>

          <Row gutter={[16, 16]}>
            <Col xs={24} md={8}>
              <Card className="h-full" bordered={false} style={{ borderRadius: 18 }}>
                <Space direction="vertical" size={6}>
                  <Text type="secondary">Available</Text>
                  <Title level={3} style={{ margin: 0 }}>{summary.available}</Title>
                </Space>
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card className="h-full" bordered={false} style={{ borderRadius: 18 }}>
                <Space direction="vertical" size={6}>
                  <Text type="secondary">Used</Text>
                  <Title level={3} style={{ margin: 0 }}>{summary.used}</Title>
                </Space>
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card className="h-full" bordered={false} style={{ borderRadius: 18 }}>
                <Space direction="vertical" size={6}>
                  <Text type="secondary">Locked</Text>
                  <Title level={3} style={{ margin: 0 }}>{summary.locked}</Title>
                </Space>
              </Card>
            </Col>
          </Row>

          <Card bordered={false} style={{ borderRadius: 22, boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
            <Space wrap style={{ marginBottom: 20 }}>
              {['All', 'Available', 'Used', 'Locked'].map((item) => (
                <Button key={item} type={filter === item ? 'primary' : 'default'} onClick={() => setFilter(item)}>
                  {item}
                </Button>
              ))}
              <Button icon={<ReloadOutlined />} onClick={fetchCoupons}>
                Refresh
              </Button>
            </Space>

            {loading ? (
              <div style={{ textAlign: 'center', padding: 60 }}>
                <Spin size="large" />
              </div>
            ) : visibleCoupons.length === 0 ? (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="No coupons found"
              >
                <Button type="primary" icon={<ShoppingOutlined />} href="/shop">
                  Browse the collection
                </Button>
              </Empty>
            ) : (
              <Row gutter={[20, 20]}>
                {visibleCoupons.map((coupon) => (
                  <Col key={coupon.couponId} xs={24} md={12} xl={8}>
                    <Card
                      bordered={false}
                      style={{
                        borderRadius: 20,
                        height: '100%',
                        background: coupon.status === 'Available' ? 'linear-gradient(180deg, #fffaf0 0%, #ffffff 100%)' : '#fff',
                        boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
                      }}
                    >
                      <Space direction="vertical" size={14} style={{ width: '100%' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div>
                            <Text type="secondary">{coupon.title}</Text>
                            <Title level={4} style={{ margin: '4px 0 0' }}>{coupon.code}</Title>
                          </div>
                          <Tag color={statusColors[coupon.status] || 'default'}>{coupon.status}</Tag>
                        </div>

                        <Paragraph style={{ margin: 0, minHeight: 44 }} type="secondary">
                          {coupon.description}
                        </Paragraph>

                        <div>
                          <Text strong>
                            {coupon.discountType === 'PERCENT'
                              ? `${coupon.discountValue}% off`
                              : `₹${coupon.discountValue} off`}
                          </Text>
                          <div style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>
                            {coupon.minOrderAmount ? `Min order ₹${coupon.minOrderAmount}` : 'No minimum order'}
                            {coupon.maxDiscountAmount ? ` • Max ₹${coupon.maxDiscountAmount}` : ''}
                          </div>
                        </div>

                        <Space wrap>
                          {coupon.conditions?.map((condition) => (
                            <Tag key={condition} color="gold">{condition}</Tag>
                          ))}
                        </Space>

                        <Space direction="vertical" size={4} style={{ width: '100%' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Text type="secondary">Expiry</Text>
                            <Text>{coupon.expiryDate ? formatDate(coupon.expiryDate) : 'Not set'}</Text>
                          </div>
                          {coupon.usedAt ? (
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Text type="secondary">Used on</Text>
                              <Text>{formatDate(coupon.usedAt)}</Text>
                            </div>
                          ) : null}
                        </Space>

                        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                          <Button icon={<CopyOutlined />} onClick={() => handleCopy(coupon.code)}>
                            Copy code
                          </Button>
                          <Button type="primary" icon={<GiftOutlined />} href="/shop">
                            Shop now
                          </Button>
                        </Space>
                      </Space>
                    </Card>
                  </Col>
                ))}
              </Row>
            )}
          </Card>
        </div>
      </section>
    </MainLayout>
  );
};

export default MyCouponsPage;
