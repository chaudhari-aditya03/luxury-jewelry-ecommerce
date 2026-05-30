import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Space, Popconfirm, message, Typography, Card } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import AdminLayout from '../../layouts/AdminLayout';
import { categoryService, adminService } from '../../services';

const { Title } = Typography;
const { TextArea } = Input;

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingCategory, setEditingCategory] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await categoryService.getAllCategories();
      const data = response.data?.data || response.data || [];
      setCategories(data.map(cat => ({ ...cat, key: cat.id })));
    } catch (error) {
      message.error('Failed to fetch categories');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const showModal = (category = null) => {
    setEditingCategory(category);
    if (category) {
      form.setFieldsValue(category);
    } else {
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      if (editingCategory) {
        await adminService.updateCategory(editingCategory.id, values);
        message.success('Category updated successfully');
      } else {
        await adminService.createCategory(values);
        message.success('Category created successfully');
      }
      
      setIsModalVisible(false);
      fetchCategories();
    } catch (error) {
      message.error(error.response?.data?.message || 'Operation failed');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await adminService.deleteCategory(id);
      message.success('Category deleted successfully');
      fetchCategories();
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to delete category');
      console.error(error);
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: text => <span style={{ fontWeight: 500 }}>{text}</span>,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Products',
      dataIndex: 'productCount',
      key: 'productCount',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type="text" icon={<EditOutlined />} onClick={() => showModal(record)} />
          <Popconfirm title="Delete this category?" onConfirm={() => handleDelete(record.id)}>
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="page-card bg-[radial-gradient(circle_at_top_right,rgba(198,167,105,0.18),transparent_28%),linear-gradient(135deg,#fffdf8_0%,#faf7f1_100%)] p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl space-y-3">
              <p className="text-xs uppercase tracking-[0.35em] text-gold">Catalog taxonomy</p>
              <Title level={2} className="!m-0 !font-display !text-luxury">Categories</Title>
              <p className="max-w-2xl text-sm leading-7 text-muted">
                Organize the storefront by collection groups so the shop filters and homepage sections stay coherent.
              </p>
            </div>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()} className="!h-12 !rounded-full !border-0 !bg-luxury !px-6 !font-semibold !text-white hover:!bg-gold">
              Add Category
            </Button>
          </div>
        </div>

        <Card className="page-card border-0 shadow-[0_18px_45px_rgba(17,17,17,0.06)]">
          <Table
            columns={columns}
            dataSource={categories}
            loading={loading}
            pagination={{ pageSize: 10 }}
            className="admin-table"
          />
        </Card>
      </div>

      <Modal
        title={editingCategory ? "Edit Category" : "Add Category"}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={() => setIsModalVisible(false)}
        confirmLoading={loading}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Category Name" rules={[{ required: true }]}>
            <Input placeholder="Enter category name" />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <TextArea rows={4} placeholder="Enter description" />
          </Form.Item>
        </Form>
      </Modal>
    </AdminLayout>
  );
};

export default AdminCategories;
