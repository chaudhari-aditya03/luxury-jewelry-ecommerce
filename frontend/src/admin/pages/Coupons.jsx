import React, { useEffect, useMemo, useState } from 'react';
import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Row,
  Select,
  Space,
  Switch,
  Table,
  Tag,
  message,
  Typography,
} from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import AdminLayout from '../../layouts/AdminLayout';
import { adminService, couponService } from '../../services';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

const discountTypeOptions = [
  { label: 'Percentage', value: 'PERCENT' },
  { label: 'Fixed Amount', value: 'FIXED' },
];

const couponTypeOptions = [
  { label: 'Welcome', value: 'WELCOME' },
  { label: 'First Order', value: 'FIRST_ORDER' },
  { label: 'Festival', value: 'FESTIVAL' },
  { label: 'Public', value: 'PUBLIC' },
  { label: 'VIP', value: 'VIP' },
];

const analyticsCardStyle = {
  borderRadius: 18,
  boxShadow: '0 4px 18px rgba(0,0,0,0.05)',
};

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [searchValue, setSearchValue] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [form] = Form.useForm();

  useEffect(() => {
    fetchCoupons();
    fetchAnalytics();
  }, []);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const response = await adminService.getAllCoupons();
      const data = response.data?.data || response.data || [];
      setCoupons(data.map((coupon) => ({ ...coupon, key: coupon.id })));
    } catch (error) {
      message.error('Failed to fetch coupons');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      setAnalyticsLoading(true);
      const response = await couponService.getCouponAnalytics();
      setAnalytics(response.data?.data || response.data || null);
    } catch (error) {
      console.error(error);
    } finally {
      setAnalyticsLoading(false);
    }
  };

  const resetForm = () => {
    form.resetFields();
    setEditingCoupon(null);
  };

  const openCreateModal = () => {
    resetForm();
    setIsModalVisible(true);
  };

  const openEditModal = async (coupon) => {
    setEditingCoupon(coupon);
    form.setFieldsValue({
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      maxDiscountAmount: coupon.maxDiscountAmount,
      minOrderAmount: coupon.minOrderAmount,
      startDate: coupon.startDate ? dayjs(coupon.startDate) : null,
      expiryDate: coupon.expiryDate ? dayjs(coupon.expiryDate) : null,
      isActive: coupon.isActive,
      couponType: coupon.couponType,
      oneTimePerUser: coupon.oneTimePerUser,
      description: coupon.description,
    });
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const couponData = {
        code: values.code.toUpperCase(),
        discountType: values.discountType,
        discountValue: Number(values.discountValue),
        maxDiscountAmount: values.maxDiscountAmount ? Number(values.maxDiscountAmount) : null,
        minOrderAmount: values.minOrderAmount ? Number(values.minOrderAmount) : null,
        startDate: values.startDate ? values.startDate.format('YYYY-MM-DD') : null,
        expiryDate: values.expiryDate.format('YYYY-MM-DD'),
        isActive: values.isActive ?? true,
        couponType: values.couponType,
        oneTimePerUser: values.oneTimePerUser ?? false,
        description: values.description,
      };

      if (editingCoupon?.id) {
        await adminService.updateCoupon(editingCoupon.id, couponData);
        message.success('Coupon updated successfully');
      } else {
        await adminService.createCoupon(couponData);
        message.success('Coupon created successfully');
      }

      setIsModalVisible(false);
      resetForm();
      fetchCoupons();
      fetchAnalytics();
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to create coupon');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusToggle = async (record, nextActive) => {
    try {
      await adminService.toggleCouponStatus(record.id, nextActive);
      message.success(`Coupon ${nextActive ? 'activated' : 'deactivated'}`);
      fetchCoupons();
      fetchAnalytics();
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to update coupon status');
    }
  };

  const handleDelete = async (id) => {
    try {
      await adminService.deleteCoupon(id);
      message.success('Coupon deleted');
      fetchCoupons();
      fetchAnalytics();
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to delete coupon');
      console.error(error);
    }
  };

  const filteredCoupons = useMemo(() => {
    return coupons.filter((coupon) => {
      const matchesSearch = [coupon.code, coupon.description, coupon.couponType]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(searchValue.toLowerCase()));

      const status = coupon.deletedAt ? 'Deleted' : coupon.isActive ? 'Active' : 'Inactive';
      const matchesStatus = statusFilter === 'All' ? true : status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [coupons, searchValue, statusFilter]);

  const analyticsCards = [
    { label: 'Total Coupons', value: analytics?.totalCoupons ?? coupons.length },
    { label: 'Active Coupons', value: analytics?.activeCoupons ?? coupons.filter((coupon) => coupon.isActive).length },
    { label: 'Usage Count', value: analytics?.usageCount ?? 0 },
    { label: 'Discount Given', value: analytics?.totalDiscountGiven ?? 0 },
  ];

  const columns = [
    {
      title: 'Code',
      dataIndex: 'code',
      key: 'code',
      render: (text, record) => (
        <Space direction="vertical" size={0}>
          <Tag color="gold" style={{ marginRight: 0 }}>{text}</Tag>
          <Text type="secondary" style={{ fontSize: 12 }}>{record.couponType}</Text>
        </Space>
      ),
    },
    {
      title: 'Discount',
      key: 'discount',
      render: (_, record) => (
        <span>
          {record.discountType === 'PERCENT'
            ? `${record.discountValue}%`
            : `₹${record.discountValue}`}
        </span>
      ),
    },
    {
      title: 'Limits',
      key: 'limits',
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Text>{record.minOrderAmount ? `Min ₹${record.minOrderAmount}` : 'No minimum'}</Text>
          <Text type="secondary">{record.maxDiscountAmount ? `Max ₹${record.maxDiscountAmount}` : 'No max cap'}</Text>
        </Space>
      ),
    },
    {
      title: 'Validity',
      key: 'validity',
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Text>{record.startDate ? dayjs(record.startDate).format('DD MMM YYYY') : 'Immediate'}</Text>
          <Text type="secondary">{record.expiryDate ? dayjs(record.expiryDate).format('DD MMM YYYY') : 'No expiry'}</Text>
        </Space>
      ),
    },
    {
      title: 'Status',
      key: 'isActive',
      render: (_, record) => {
        const status = record.deletedAt ? 'Deleted' : record.isActive ? 'Active' : 'Inactive';
        const color = status === 'Active' ? 'success' : status === 'Deleted' ? 'default' : 'warning';
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: 'Actions',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => openEditModal(record)}>
            Edit
          </Button>
          <Switch
            checked={Boolean(record.isActive)}
            onChange={(checked) => handleStatusToggle(record, checked)}
          />
          <Popconfirm title="Delete coupon?" onConfirm={() => handleDelete(record.id)}>
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div style={{ marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <Title level={2} style={{ margin: 0, fontFamily: "'Playfair Display', serif" }}>Coupons</Title>
          <Text type="secondary">Create, activate, and analyze Luxury Maison promotions.</Text>
        </div>
        <Space>
          <Button icon={<ReloadOutlined />} onClick={() => { fetchCoupons(); fetchAnalytics(); }} loading={loading || analyticsLoading}>
            Refresh
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreateModal}>
            Create Coupon
          </Button>
        </Space>
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
        {analyticsCards.map((card) => (
          <Col xs={24} sm={12} xl={6} key={card.label}>
            <Card bordered={false} style={analyticsCardStyle} loading={analyticsLoading}>
              <Text type="secondary">{card.label}</Text>
              <Title level={3} style={{ margin: '8px 0 0' }}>{card.value}</Title>
            </Card>
          </Col>
        ))}
      </Row>

      <Card bordered={false} style={{ borderRadius: 18, marginBottom: 20 }}>
        <Space wrap style={{ width: '100%', justifyContent: 'space-between' }}>
          <Input.Search
            allowClear
            placeholder="Search code, description, or type"
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
            style={{ maxWidth: 360 }}
          />
          <Space wrap>
            {['All', 'Active', 'Inactive', 'Deleted'].map((status) => (
              <Button key={status} type={statusFilter === status ? 'primary' : 'default'} onClick={() => setStatusFilter(status)}>
                {status}
              </Button>
            ))}
          </Space>
        </Space>
      </Card>

      <Table
        columns={columns}
        dataSource={filteredCoupons}
        loading={loading}
        pagination={{ pageSize: 10 }}
        rowKey="id"
      />

      <Modal
        title={editingCoupon ? 'Edit Coupon' : 'Create Coupon'}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={() => { setIsModalVisible(false); resetForm(); }}
        confirmLoading={loading}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item name="code" label="Coupon Code" rules={[{ required: true }]}>
            <Input placeholder="e.g. SAVE10" style={{ textTransform: 'uppercase' }} />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="discountType" label="Discount Type" rules={[{ required: true }]}>
                <Select options={discountTypeOptions} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="discountValue" label="Discount Value" rules={[{ required: true }]}>
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="minOrderAmount" label="Minimum Order Amount">
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="maxDiscountAmount" label="Maximum Discount Amount">
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="couponType" label="Coupon Type" rules={[{ required: true }]} initialValue="PUBLIC">
                <Select options={couponTypeOptions} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="oneTimePerUser" label="One-time per user" valuePropName="checked" initialValue={false}>
                <Switch />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="startDate" label="Start Date">
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="expiryDate" label="Expiry Date" rules={[{ required: true }]}>
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="isActive" label="Active" valuePropName="checked" initialValue>
            <Switch />
          </Form.Item>

          <Form.Item name="description" label="Description">
            <Input.TextArea rows={3} placeholder="Describe the promotion and its positioning" />
          </Form.Item>
        </Form>
      </Modal>
    </AdminLayout>
  );
};

export default AdminCoupons;
