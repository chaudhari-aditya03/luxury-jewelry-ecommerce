import React, { useEffect, useState } from 'react';
import { AreaChart, Area, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import AdminLayout from '../../layouts/AdminLayout';
import Alert from '../../components/common/Alert';
import Skeleton from '../../components/common/Skeleton';
import { formatPrice } from '../../utils/helpers';
import { adminService } from '../../services';

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [monthlySales, setMonthlySales] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch dashboard summary and monthly sales
      const [summaryRes, salesRes] = await Promise.all([
        adminService.getDashboardSummary(),
        adminService.getMonthlySales(2026)
      ]);

      setDashboardData(summaryRes.data.data);
      setMonthlySales(salesRes.data.data || []);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err.response?.data?.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // Map month numbers to names
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  const monthlySalesData = monthlySales.map(item => ({
    month: monthNames[item.month - 1] || item.month,
    sales: parseFloat(item.revenue || 0),
    orders: item.orderCount || 0
  }));

  const categoryData = dashboardData?.categoryDistribution?.map((cat, index) => ({
    name: cat.categoryName,
    value: parseFloat(cat.percentage || 0),
    color: ['#b8956a', '#a68757', '#8b7048', '#6b543f', '#9d8259'][index % 5]
  })) || [];

  const stats = dashboardData ? [
    { 
      label: 'Total Users', 
      value: dashboardData.totalUsers?.toLocaleString() || '0', 
      change: dashboardData.userGrowth || '+0%' 
    },
    { 
      label: 'Total Revenue', 
      value: formatPrice(dashboardData.totalRevenue || 0), 
      change: dashboardData.revenueGrowth || '+0%' 
    },
    { 
      label: 'Total Orders', 
      value: dashboardData.totalOrders?.toLocaleString() || '0', 
      change: dashboardData.orderGrowth || '+0%'
    },
    { 
      label: 'Avg. Order Value', 
      value: formatPrice(dashboardData.averageOrderValue || 0), 
      change: dashboardData.aovGrowth || '+0%' 
    },
  ] : [];

  const topProducts = dashboardData?.topProducts || [];

  if (loading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <Skeleton className="h-20 w-full" />
          <div className="grid grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
          <Skeleton className="h-64 w-full" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Welcome back! Here's your business overview.
          </p>
        </div>

        {error && (
          <Alert type="error" message={error} closeable onClose={() => setError(null)} />
        )}

        {error && (
          <Alert type="error" message={error} closeable onClose={() => setError(null)} />
        )}

        {/* Key Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700"
            >
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                {stat.label}
              </p>
              <div className="flex items-end justify-between">
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </p>
                <span className={`text-sm font-medium ${
                  stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sales Chart */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold mb-6">Monthly Sales</h2>
            {monthlySalesData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={monthlySalesData}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#b8956a" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#b8956a" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => formatPrice(value)}
                    labelStyle={{ color: '#000' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="sales"
                    stroke="#b8956a"
                    fillOpacity={1}
                    fill="url(#colorSales)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-500">
                No sales data available
              </div>
            )}
          </div>

          {/* Category Distribution */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold mb-6">Sales by Category</h2>
            {categoryData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value.toFixed(1)}%`} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                  {categoryData.map((cat) => (
                    <div key={cat.name} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: cat.color }}
                        />
                        <span>{cat.name}</span>
                      </div>
                      <span className="font-medium">{cat.value.toFixed(1)}%</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-500">
                No category data available
              </div>
            )}
          </div>
        </div>

        {/* Orders Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold mb-6">Orders Overview</h2>
          {monthlySalesData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlySalesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="orders" fill="#b8956a" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-500">
              No order data available
            </div>
          )}
        </div>

        {/* Top Products */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold mb-6">Top Selling Products</h2>
          {topProducts.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 font-semibold">Product</th>
                    <th className="text-right py-3 px-4 font-semibold">Sold</th>
                    <th className="text-right py-3 px-4 font-semibold">Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {topProducts.map((product) => (
                    <tr
                      key={product.productId || product.id}
                      className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <td className="py-3 px-4 font-medium">{product.productName || product.name}</td>
                      <td className="text-right py-3 px-4">{product.totalSold || product.sold}</td>
                      <td className="text-right py-3 px-4 text-rose-gold-500 font-bold">
                        {formatPrice(product.totalRevenue || product.revenue)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-8 text-center text-gray-500">
              No product data available
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
