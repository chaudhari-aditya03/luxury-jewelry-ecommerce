import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Typography, Statistic, Spin, message } from 'antd';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { ArrowUpOutlined } from '@ant-design/icons';
import AdminLayout from '../../layouts/AdminLayout';
import { formatPrice } from '../../utils/helpers';
import { adminService } from '../../services';

const { Title } = Typography;

const AdminAnalytics = () => {
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState(null);
  const [monthlySales, setMonthlySales] = useState([]);

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    try {
      const [summaryRes, salesRes] = await Promise.all([
        adminService.getDashboardSummary(),
        adminService.getMonthlySales(2026),
      ]);

      setSummary(summaryRes.data.data);
      
      const salesData = salesRes.data.data.map(item => ({
        month: item.month,
        revenue: item.totalRevenue,
        orders: item.totalOrders,
      }));
      setMonthlySales(salesData);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      message.error('Failed to fetch analytics data');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !summary) {
    return (
      <AdminLayout>
        <div style={{ textAlign: 'center', padding: '100px 0' }}>
          <Spin size="large" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Title level={2} style={{ marginBottom: 24 }}>Analytics</Title>

      {summary && (
        <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Total Revenue"
                value={summary.totalRevenue}
                prefix="₹"
                valueStyle={{ color: '#D4AF37' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Total Orders"
                value={summary.totalOrders}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Total Users"
                value={summary.totalUsers}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Total Products"
                value={summary.totalProducts}
                valueStyle={{ color: '#722ed1' }}
              />
            </Card>
          </Col>
        </Row>
      )}

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={12}>
          <Card title="Monthly Revenue Trend" variant="borderless" style={{ borderRadius: 8 }}>
            <div style={{ height: 350 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlySales}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(val, name) => [name === 'revenue' ? formatPrice(val) : val, name === 'revenue' ? 'Revenue' : 'Orders']} />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#D4AF37"
                    fill="#D4AF37"
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="Monthly Orders" variant="borderless" style={{ borderRadius: 8 }}>
            <div style={{ height: 350 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlySales}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="orders" fill="#1890ff" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
      </Row>
    </AdminLayout>
  );
};

export default AdminAnalytics;
