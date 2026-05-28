import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Select, DatePicker, Space, Tag, Popconfirm, message, Typography } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import AdminLayout from '../../layouts/AdminLayout';
import { adminService } from '../../services';
import dayjs from 'dayjs';

const { Title } = Typography;
const { Option } = Select;

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const response = await adminService.getAllCoupons();
      const data = response.data?.data || response.data || [];
      setCoupons(data.map(coupon => ({ ...coupon, key: coupon.id })));
    } catch (error) {
      message.error('Failed to fetch coupons');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const couponData = {
        code: values.code.toUpperCase(),
        discountType: values.type === 'Percentage' ? 'PERCENT' : 'FIXED',
        discountValue: values.value,
        minOrderAmount: values.minOrder || 0,
        expiryDate: values.expiry.format('YYYY-MM-DD'),
        isActive: true
      };

      await adminService.createCoupon(couponData);
      message.success('Coupon created successfully');
      setIsModalVisible(false);
      form.resetFields();
      fetchCoupons();
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to create coupon');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await adminService.deleteCoupon(id);
      message.success('Coupon deleted');
      fetchCoupons();
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to delete coupon');
      console.error(error);
    }
  };

  const columns = [
    {
      title: 'Code',
      dataIndex: 'code',
      key: 'code',
      render: text => <Tag color="gold">{text}</Tag>,
    },
    {
      title: 'Discount',
      key: 'discount',
      render: (_, record) => (
        <span>{record.discountType === 'PERCENT' ? `${record.discountValue}%` : `₹${record.discountValue}`}</span>
      ),
    },
    {
      title: 'Min Order',
      dataIndex: 'minOrderAmount',
      key: 'minOrderAmount',
      render: val => val ? `₹${val}` : 'N/A',
    },
    {
      title: 'Expiry',
      dataIndex: 'expiryDate',
      key: 'expiryDate',
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      render: isActive => <Tag color={isActive ? 'success' : 'default'}>{isActive ? 'Active' : 'Inactive'}</Tag>,
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Popconfirm title="Delete coupon?" onConfirm={() => handleDelete(record.id)}>
          <Button type="text" danger icon={<DeleteOutlined />} />
        </Popconfirm>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={2} style={{ margin: 0, fontFamily: "'Playfair Display', serif" }}>Coupons</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)}>
          Create Coupon
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={coupons}
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title="Create Coupon"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={() => setIsModalVisible(false)}
        confirmLoading={loading}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="code" label="Coupon Code" rules={[{ required: true }]}>
            <Input placeholder="e.g. SAVE10" style={{ textTransform: 'uppercase' }} />
          </Form.Item>

          <Space style={{ display: 'flex', marginBottom: 8 }} align="baseline">
            <Form.Item name="type" label="Type" rules={[{ required: true }]} initialValue="Percentage">
              <Select style={{ width: 120 }}>
                <Option value="Percentage">Percentage</Option>
                <Option value="Fixed">Fixed Amount</Option>
              </Select>
            </Form.Item>
            <Form.Item name="value" label="Value" rules={[{ required: true }]}>
              <InputNumber min={0} />
            </Form.Item>
          </Space>

          <Form.Item name="minOrder" label="Min Order Amount">
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item name="expiry" label="Expiry Date" rules={[{ required: true }]}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </AdminLayout>
  );
};

export default AdminCoupons;
