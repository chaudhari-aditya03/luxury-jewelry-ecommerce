import React, { useState, useEffect } from 'react';
import {
  Table, Button, Tag, Space, Modal, Typography,
  Descriptions, message, Select, Dropdown
} from 'antd';
import { EyeOutlined, DownOutlined } from '@ant-design/icons';
import AdminLayout from '../../layouts/AdminLayout';
import { formatPrice, formatDate } from '../../utils/helpers';
import { adminService } from '../../services';

const { Title, Text } = Typography;
const { Option } = Select;

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });

  useEffect(() => {
    fetchOrders(1, pagination.pageSize);
  }, []);

  const renderAddress = (addr) => {
    if (!addr) return '-';

    let obj = addr;
    if (typeof addr === 'string') {
      try {
        obj = JSON.parse(addr);
      } catch (e) {
        // not JSON, return raw string
        return <div style={{ whiteSpace: 'pre-wrap' }}>{addr}</div>;
      }
    }

    if (typeof obj === 'object' && obj !== null) {
      const parts = [];
      if (obj.fullName) parts.push(<div key="name" style={{ fontWeight: 600 }}>{obj.fullName}</div>);
      const line1 = obj.addressLine1 || '';
      const line2 = obj.addressLine2 ? `, ${obj.addressLine2}` : '';
      if (line1 || line2) parts.push(<div key="addr">{`${line1}${line2}`}</div>);
      const cityState = [obj.city, obj.state].filter(Boolean).join(', ');
      const postal = obj.postalCode ? ` ${obj.postalCode}` : '';
      if (cityState || postal) parts.push(<div key="city">{`${cityState}${postal}`.trim()}</div>);
      if (obj.country) parts.push(<div key="country">{obj.country}</div>);
      if (obj.phone) parts.push(<div key="phone">{obj.phone}</div>);

      return <div style={{ lineHeight: 1.4 }}>{parts}</div>;
    }

    return <div>{String(obj)}</div>;
  };

  const fetchOrders = async (page, pageSize) => {
    setLoading(true);
    try {
      const response = await adminService.getAllOrders(page - 1, pageSize);
      const pageData = response.data?.data;
      const content = pageData?.content || [];

      setOrders(content.map((order) => ({
        key: order.id,
        id: order.id,
        orderNumber: order.orderNumber,
        userId: order.userId,
        date: order.createdAt,
        total: Number(order.finalAmount ?? order.totalAmount ?? 0),
        status: order.orderStatus,
        paymentStatus: order.paymentStatus,
        items: order.orderItems || [],
        address: order.addressSnapshot,
      })));

      setPagination({
        current: page,
        pageSize,
        total: pageData?.totalElements ?? 0,
      });
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to load orders');
      setOrders([]);
    }
    setLoading(false);
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await adminService.updateOrderStatus(orderId, { orderStatus: newStatus });
      message.success(`Order status updated to ${newStatus}`);
      fetchOrders(pagination.current, pagination.pageSize);
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to update order status');
    }
  };

  const showOrderDetails = (order) => {
    setSelectedOrder(order);
    setIsModalVisible(true);
  };

  const statusMenuItems = (record) => ([
    { key: 'PLACED', label: 'Placed' },
    { key: 'PROCESSING', label: 'Processing' },
    { key: 'SHIPPED', label: 'Shipped' },
    { key: 'DELIVERED', label: 'Delivered' },
    { key: 'CANCELLED', label: 'Cancelled', danger: true },
    { key: 'RETURNED', label: 'Returned' },
  ]);

  const columns = [
    {
      title: 'Order ID',
      dataIndex: 'orderNumber',
      key: 'orderNumber',
      render: text => <Text strong>{text}</Text>,
    },
    {
      title: 'User ID',
      dataIndex: 'userId',
      key: 'userId',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: date => formatDate(date),
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      render: total => formatPrice(total),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status, record) => (
        <Dropdown
          menu={{ items: statusMenuItems(record), onClick: ({ key }) => handleStatusChange(record.id, key) }}
          trigger={['click']}
        >
          <span>
            <Tag
              color={
                status === 'DELIVERED' ? 'success' :
                  status === 'PROCESSING' || status === 'SHIPPED' || status === 'PLACED' ? 'processing' :
                    status === 'CANCELLED' || status === 'RETURNED' ? 'error' : 'default'
              }
              style={{ cursor: 'pointer' }}
            >
              {status} <DownOutlined style={{ fontSize: 10, marginLeft: 4 }} />
            </Tag>
          </span>
        </Dropdown>
      ),
      filters: [
        { text: 'Processing', value: 'PROCESSING' },
        { text: 'Delivered', value: 'DELIVERED' },
        { text: 'Cancelled', value: 'CANCELLED' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Payment',
      dataIndex: 'paymentStatus',
      key: 'paymentStatus',
      render: (status) => {
        let color = 'default';
        if (status === 'PAID') color = 'success';
        if (status === 'PENDING') color = 'warning';
        if (status === 'FAILED' || status === 'REFUNDED') color = 'error';
        return <Tag color={color}>{status || 'PENDING'}</Tag>;
      }
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button type="link" icon={<EyeOutlined />} onClick={() => showOrderDetails(record)}>
          View
        </Button>
      ),
    },
  ];

  return (
    <AdminLayout>
      <Title level={2} style={{ marginBottom: 24, fontFamily: "'Playfair Display', serif" }}>Orders</Title>

      <Table
        columns={columns}
        dataSource={orders}
        loading={loading}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          onChange: (page, pageSize) => fetchOrders(page, pageSize),
        }}
      />

      <Modal
        title="Order Details"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsModalVisible(false)}>Close</Button>,
          <Button key="print" type="primary" onClick={() => window.print()}>Print Invoice</Button>
        ]}
        width={700}
      >
        {selectedOrder && (
          <div className="space-y-6">
            <Descriptions title="Order Info" bordered column={2}>
              <Descriptions.Item label="Order ID">{selectedOrder.orderNumber}</Descriptions.Item>
              <Descriptions.Item label="Date">{formatDate(selectedOrder.date)}</Descriptions.Item>
              <Descriptions.Item label="User ID">{selectedOrder.userId}</Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color="blue">{selectedOrder.status}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Total Amount" span={2}>
                <Text strong style={{ fontSize: 16 }}>{formatPrice(selectedOrder.total)}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Shipping Address" span={2}>
                {renderAddress(selectedOrder.address)}
              </Descriptions.Item>
            </Descriptions>

            <div>
              <Title level={5}>Items</Title>
              <Table
                dataSource={selectedOrder.items}
                columns={[
                  { title: 'Item', dataIndex: 'productName', key: 'productName' },
                  { title: 'Quantity', dataIndex: 'quantity', key: 'quantity' },
                  { title: 'Price', dataIndex: 'price', key: 'price', render: p => formatPrice(p) },
                  { title: 'Total', key: 'total', render: (_, r) => formatPrice(r.subtotal ?? (r.price * r.quantity)) }
                ]}
                pagination={false}
                size="small"
                rowKey="id"
              />
            </div>
          </div>
        )}
      </Modal>
    </AdminLayout>
  );
};

export default AdminOrders;
