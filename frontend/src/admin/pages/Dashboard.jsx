import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Statistic, Typography, Spin } from 'antd';
import { UserOutlined, ShoppingCartOutlined, DollarOutlined, ShoppingOutlined } from '@ant-design/icons';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import AdminLayout from '../../layouts/AdminLayout';
import { formatPrice } from '../../utils/helpers';
import { adminService } from '../../services';

const { Title } = Typography;

const AdminDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [summary, setSummary] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalProducts: 0,
  });
  const [monthlySales, setMonthlySales] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        const [summaryResponse, monthlyResponse] = await Promise.all([
          adminService.getDashboardSummary(),
          adminService.getMonthlySales(new Date().getFullYear()),
        ]);

        const summaryData = summaryResponse.data?.data;
        const monthlyData = monthlyResponse.data?.data || [];

        setSummary({
          totalRevenue: Number(summaryData?.totalRevenue ?? 0),
          totalOrders: summaryData?.totalOrders ?? 0,
          totalUsers: summaryData?.totalUsers ?? 0,
          totalProducts: summaryData?.totalProducts ?? 0,
        });

        const mappedMonthly = monthlyData.map((item) => ({
          name: item.month?.slice(0, 3) || '',
          sales: Number(item.totalRevenue ?? 0),
          orders: item.totalOrders ?? 0,
        }));

        setMonthlySales(mappedMonthly);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      }
      setIsLoading(false);
    };

    fetchDashboardData();
  }, []);

  const stats = [
    { title: 'Total Revenue', value: summary.totalRevenue, prefix: '₹', icon: <DollarOutlined />, color: '#cf1322', bg: '#fff1f0' },
    { title: 'Total Orders', value: summary.totalOrders, icon: <ShoppingCartOutlined />, color: '#3f6600', bg: '#f6ffed' },
    { title: 'Total Users', value: summary.totalUsers, icon: <UserOutlined />, color: '#096dd9', bg: '#e6f7ff' },
    { title: 'Total Products', value: summary.totalProducts, icon: <ShoppingOutlined />, color: '#d48806', bg: '#fffbe6' },
  ];

  return (
    <AdminLayout>
      <Title level={2} style={{ marginBottom: 24 }}>Dashboard</Title>

      <Row gutter={[24, 24]}>
        {stats.map((stat, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card variant="borderless" style={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Statistic
                  title={stat.title}
                  value={stat.value}
                  prefix={stat.prefix}
                  valueStyle={{ fontWeight: 'bold' }}
                />
                <div style={{
                  width: 48, height: 48, borderRadius: '50%',
                  background: stat.bg, color: stat.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 24
                }}>
                  {stat.icon}
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={16}>
          <Card title="Revenue Overview" variant="borderless" style={{ borderRadius: 8 }}>
            <div style={{ height: 350 }}>
              {isLoading ? (
                <div style={{ textAlign: 'center', paddingTop: 120 }}>
                  <Spin />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlySales} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={val => `₹${val / 1000}k`} />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <Tooltip formatter={val => formatPrice(val)} />
                  <Area type="monotone" dataKey="sales" stroke="#D4AF37" fillOpacity={1} fill="url(#colorSales)" />
                </AreaChart>
              </ResponsiveContainer>
              )}
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Weekly Orders" variant="borderless" style={{ borderRadius: 8 }}>
            <div style={{ height: 350 }}>
              {isLoading ? (
                <div style={{ textAlign: 'center', paddingTop: 120 }}>
                  <Spin />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlySales}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="orders" fill="#1890ff" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </Card>
        </Col>
      </Row>
    </AdminLayout>
  );
};

export default AdminDashboard;
