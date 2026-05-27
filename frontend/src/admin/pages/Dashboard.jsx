import React, { useEffect, useState } from 'react';
import { Spin } from 'antd';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, Legend
} from 'recharts';
import AdminLayout from '../../layouts/AdminLayout';
import { formatPrice } from '../../utils/helpers';
import { adminService } from '../../services';

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

        setMonthlySales(monthlyData.map((item) => ({
          name: item.month?.slice(0, 3) || '',
          sales: Number(item.totalRevenue ?? 0),
          orders: item.totalOrders ?? 0,
        })));
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      }
      setIsLoading(false);
    };

    fetchDashboardData();
  }, []);

  const stats = [
    {
      title: 'Total Revenue',
      value: formatPrice(summary.totalRevenue),
      icon: '💰',
      change: '+12.5%',
      positive: true,
      gradient: 'linear-gradient(135deg, #D4AF37 0%, #b8860b 100%)',
      textColor: '#7a5c00',
      bg: 'linear-gradient(135deg, #fffbeb, #fef3c7)',
    },
    {
      title: 'Total Orders',
      value: summary.totalOrders.toLocaleString(),
      icon: '📦',
      change: '+8.2%',
      positive: true,
      gradient: 'linear-gradient(135deg, #6366f1, #4f46e5)',
      textColor: '#3730a3',
      bg: 'linear-gradient(135deg, #eef2ff, #e0e7ff)',
    },
    {
      title: 'Total Users',
      value: summary.totalUsers.toLocaleString(),
      icon: '👥',
      change: '+15.3%',
      positive: true,
      gradient: 'linear-gradient(135deg, #10b981, #059669)',
      textColor: '#065f46',
      bg: 'linear-gradient(135deg, #ecfdf5, #d1fae5)',
    },
    {
      title: 'Total Products',
      value: summary.totalProducts.toLocaleString(),
      icon: '💎',
      change: '+3.1%',
      positive: true,
      gradient: 'linear-gradient(135deg, #f43f5e, #e11d48)',
      textColor: '#9f1239',
      bg: 'linear-gradient(135deg, #fff1f2, #ffe4e6)',
    },
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white rounded-xl shadow-xl p-3 border border-gray-100 text-sm">
          <p className="font-semibold text-gray-700 mb-1">{label}</p>
          {payload.map((entry, i) => (
            <p key={i} style={{ color: entry.color }}>
              {entry.name === 'sales' ? formatPrice(entry.value) : `${entry.value} orders`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const quickLinks = [
    { label: 'Manage Products', href: '/admin/products', icon: '💎', desc: 'Add, edit, remove products' },
    { label: 'View All Orders', href: '/admin/orders', icon: '📦', desc: 'Process & track orders' },
    { label: 'User Management', href: '/admin/users', icon: '👥', desc: 'View & manage users' },
    { label: 'Categories', href: '/admin/categories', icon: '🗂️', desc: 'Manage product categories' },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-500 text-sm mt-1">
              Welcome back, Admin 👋 — Here's what's happening today.
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse inline-block" />
            Live data · {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {stats.map((stat, i) => (
            <div key={i} className="rounded-2xl p-5 relative overflow-hidden"
              style={{ background: stat.bg, border: '1px solid rgba(0,0,0,0.04)', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: stat.textColor, opacity: 0.7 }}>
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold" style={{ color: stat.textColor }}>
                    {isLoading ? <Spin size="small" /> : stat.value}
                  </p>
                  <p className="text-xs mt-2 font-medium" style={{ color: stat.positive ? '#16a34a' : '#dc2626' }}>
                    {stat.positive ? '↑' : '↓'} {stat.change} vs last month
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                  style={{ background: 'rgba(255,255,255,0.6)' }}>
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Revenue Chart */}
          <div className="xl:col-span-2 bg-white rounded-2xl p-6 shadow-sm" style={{ border: '1px solid rgba(0,0,0,0.04)' }}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-bold text-gray-900 text-lg">Revenue Overview</h3>
                <p className="text-gray-400 text-sm">Monthly revenue for {new Date().getFullYear()}</p>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium"
                style={{ background: 'rgba(212,175,55,0.1)', color: '#b8860b' }}>
                ₹ Revenue
              </div>
            </div>
            <div style={{ height: 300 }}>
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <Spin size="large" />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlySales} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                    <YAxis tickFormatter={v => `₹${v / 1000}k`} tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="sales" stroke="#D4AF37" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRev)" name="sales" />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Orders Chart */}
          <div className="bg-white rounded-2xl p-6 shadow-sm" style={{ border: '1px solid rgba(0,0,0,0.04)' }}>
            <div className="mb-6">
              <h3 className="font-bold text-gray-900 text-lg">Monthly Orders</h3>
              <p className="text-gray-400 text-sm">Order count by month</p>
            </div>
            <div style={{ height: 300 }}>
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <Spin />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlySales} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="orders" fill="#6366f1" radius={[6, 6, 0, 0]} name="orders" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-bold text-gray-900 text-lg mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickLinks.map(link => (
              <a key={link.href} href={link.href}
                className="group flex items-center gap-4 p-4 bg-white rounded-2xl no-underline transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
                style={{ border: '1px solid rgba(0,0,0,0.05)' }}>
                <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0 transition-transform duration-200 group-hover:scale-110"
                  style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.12), rgba(184,134,11,0.07))' }}>
                  {link.icon}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm group-hover:text-yellow-700 transition-colors">{link.label}</p>
                  <p className="text-gray-400 text-xs">{link.desc}</p>
                </div>
              </a>
            ))}
          </div>
        </div>

      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
