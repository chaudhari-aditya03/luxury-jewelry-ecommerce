import React, { useMemo, useState, useEffect } from 'react';
import { Table, Tag, Typography, Card, Input, Select, Space, message, Button, Modal } from 'antd';
import { SearchOutlined, DeleteOutlined } from '@ant-design/icons';
import { useLocation } from 'react-router-dom';
import AdminLayout from '../../layouts/AdminLayout';
import { formatPrice, formatDate } from '../../utils/helpers';
import { adminService } from '../../services';

const { Title } = Typography;
const { Option } = Select;

const AdminPayments = () => {
  const location = useLocation();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const routeStatus = useMemo(() => new URLSearchParams(location.search).get('status'), [location.search]);
  const effectiveStatusFilter = routeStatus || statusFilter;

  const pageTitle = useMemo(() => {
    const titles = {
      PENDING: 'Pending Payments',
      SUCCESS: 'Successful Payments',
      FAILED: 'Failed Payments',
      REFUNDED: 'Refunded Payments',
    };
    return titles[routeStatus] || 'Payment History';
  }, [routeStatus]);

  useEffect(() => {
    fetchPayments(pagination.current - 1, pagination.pageSize);
  }, []);

  const fetchPayments = async (page, size) => {
    setLoading(true);
    try {
      const response = await adminService.getAllPayments(page, size);
      const { content, totalElements } = response.data.data;
      
      const formattedPayments = content.map((payment) => ({
        key: payment.id,
        id: payment.id,
        orderId: payment.orderId,
        orderNumber: payment.orderNumber,
        userId: payment.userId,
        customerName: payment.customerName,
        customerEmail: payment.customerEmail,
        paymentMethod: payment.paymentMethod,
        transactionId: payment.transactionId,
        paymentReference: payment.paymentReference,
        paymentGateway: payment.paymentGateway,
        amount: payment.amount,
        status: payment.status,
        orderPaymentStatus: payment.orderPaymentStatus,
        date: payment.createdAt,
      }));

      setPayments(formattedPayments);
      setPagination(prev => ({
        ...prev,
        total: totalElements,
      }));
    } catch (error) {
      console.error('Error fetching payments:', error);
      message.error('Failed to fetch payments');
    } finally {
      setLoading(false);
    }
  };

  const handleTableChange = (newPagination) => {
    setPagination(newPagination);
    fetchPayments(newPagination.current - 1, newPagination.pageSize);
  };

  const getStatusColor = (status) => {
    const colors = {
      SUCCESS: 'success',
      PENDING: 'warning',
      FAILED: 'error',
    };
    return colors[status] || 'default';
  };

  const getPaymentStatusColor = (status) => {
    const colors = {
      PAID: 'success',
      PENDING: 'warning',
      FAILED: 'error',
      REFUNDED: 'processing',
    };
    return colors[status] || 'default';
  };

  const handleUpdatePaymentStatus = async (orderId, status) => {
    try {
      await adminService.updatePaymentStatus(orderId, status);
      message.success(`Payment marked as ${status}`);
      fetchPayments(pagination.current - 1, pagination.pageSize);
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to update payment status');
    }
  };

  const handleDeletePaymentHistory = (payment) => {
    Modal.confirm({
      title: 'Delete payment history?',
      content: `This will remove payment record ${payment.orderNumber} from the admin payment history.`,
      okText: 'Delete History',
      okButtonProps: { danger: true },
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          await adminService.deletePaymentHistory(payment.id);
          message.success('Payment history deleted successfully');
          fetchPayments(pagination.current - 1, pagination.pageSize);
        } catch (error) {
          message.error(error.response?.data?.message || 'Failed to delete payment history');
          throw error;
        }
      },
    });
  };

  const columns = [
    {
      title: 'Order Number',
      dataIndex: 'orderNumber',
      key: 'orderNumber',
      render: (text) => <span style={{ fontWeight: 500 }}>#{text}</span>,
    },
    {
      title: 'Transaction ID',
      dataIndex: 'transactionId',
      key: 'transactionId',
      render: (text) => <span style={{ fontSize: 12, color: '#666' }}>{text || '-'}</span>,
    },
    {
      title: 'Method',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
      render: (method) => <Tag color={method === 'UPI' ? 'purple' : 'gold'}>{method}</Tag>,
    },
    {
      title: 'Customer',
      key: 'customer',
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 600 }}>{record.customerName || `User #${record.userId}`}</div>
          <div style={{ fontSize: 12, color: '#666' }}>{record.customerEmail || '-'}</div>
        </div>
      ),
    },
    {
      title: 'Gateway',
      dataIndex: 'paymentGateway',
      key: 'paymentGateway',
      render: (gateway) => (
        <Tag color="blue">{gateway}</Tag>
      ),
    },
    {
      title: 'UPI Ref',
      dataIndex: 'paymentReference',
      key: 'paymentReference',
      render: (reference) => <span style={{ fontSize: 12 }}>{reference || '-'}</span>,
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount) => <span style={{ fontWeight: 500, color: '#C6A769' }}>{formatPrice(amount)}</span>,
      sorter: (a, b) => a.amount - b.amount,
    },
    {
      title: 'Payment Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={getStatusColor(status)}>{status}</Tag>
      ),
      filters: [
        { text: 'Success', value: 'SUCCESS' },
        { text: 'Pending', value: 'PENDING' },
        { text: 'Failed', value: 'FAILED' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Order Payment Status',
      dataIndex: 'orderPaymentStatus',
      key: 'orderPaymentStatus',
      render: (status) => (
        <Tag color={getPaymentStatusColor(status)}>{status}</Tag>
      ),
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (date) => formatDate(date),
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
      defaultSortOrder: 'descend',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Select
            size="small"
            value={record.orderPaymentStatus}
            style={{ width: 130 }}
            onChange={(value) => handleUpdatePaymentStatus(record.orderId, value)}
          >
            <Option value="PENDING">Pending</Option>
            <Option value="PAID">Paid</Option>
            <Option value="FAILED">Failed</Option>
            <Option value="REFUNDED">Refunded</Option>
          </Select>
          <Button danger type="link" icon={<DeleteOutlined />} onClick={() => handleDeletePaymentHistory(record)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = 
      payment.orderNumber?.toLowerCase().includes(searchText.toLowerCase()) ||
      payment.transactionId?.toLowerCase().includes(searchText.toLowerCase()) ||
      payment.customerName?.toLowerCase().includes(searchText.toLowerCase()) ||
      payment.customerEmail?.toLowerCase().includes(searchText.toLowerCase());
    
    const matchesStatus = effectiveStatusFilter === 'all' || payment.status === effectiveStatusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const totalAmount = filteredPayments.reduce((sum, payment) => sum + payment.amount, 0);
  const successfulPayments = filteredPayments.filter(p => p.status === 'SUCCESS').length;

  return (
    <AdminLayout>
      <Title level={2} style={{ marginBottom: 24, fontFamily: "'Playfair Display', serif" }}>{pageTitle}</Title>

      <div style={{ marginBottom: 24 }}>
        <Space size="large">
          <Card size="small" style={{ width: 200 }}>
            <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>Total Amount</div>
            <div style={{ fontSize: 20, fontWeight: 600, color: '#C6A769' }}>
              {formatPrice(totalAmount)}
            </div>
          </Card>
          <Card size="small" style={{ width: 200 }}>
            <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>Successful Payments</div>
            <div style={{ fontSize: 20, fontWeight: 600, color: '#52c41a' }}>
              {successfulPayments}
            </div>
          </Card>
          <Card size="small" style={{ width: 200 }}>
            <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>Total Transactions</div>
            <div style={{ fontSize: 20, fontWeight: 600, color: '#1890ff' }}>
              {filteredPayments.length}
            </div>
          </Card>
        </Space>
      </div>

      <div style={{ marginBottom: 16, display: 'flex', gap: 16 }}>
        <Input
          placeholder="Search by order number or transaction ID..."
          prefix={<SearchOutlined />}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 400 }}
        />
        <Select
          value={statusFilter}
          onChange={setStatusFilter}
          style={{ width: 150 }}
          disabled={Boolean(routeStatus)}
        >
          <Option value="all">All Status</Option>
          <Option value="SUCCESS">Success</Option>
          <Option value="PENDING">Pending</Option>
          <Option value="FAILED">Failed</Option>
          <Option value="REFUNDED">Refunded</Option>
        </Select>
      </div>

      <Table
        columns={columns}
        dataSource={filteredPayments}
        loading={loading}
        pagination={{
          ...pagination,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} payments`,
        }}
        onChange={handleTableChange}
      />
    </AdminLayout>
  );
};

export default AdminPayments;
