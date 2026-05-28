import React, { useState, useEffect } from 'react';
import {
  Table, Button, Modal, Form, Input, InputNumber,
  Select, Upload, Space, Tag, Popconfirm, message,
  Card, Row, Col, Typography
} from 'antd';
import {
  PlusOutlined, EditOutlined, DeleteOutlined,
  UploadOutlined, SearchOutlined
} from '@ant-design/icons';
import AdminLayout from '../../layouts/AdminLayout';
import { formatPrice, getImageUrl } from '../../utils/helpers';
import { productService, categoryService, adminService } from '../../services';

const { Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingProduct, setEditingProduct] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  useEffect(() => {
    fetchProducts(pagination.current - 1, pagination.pageSize);
    fetchCategories();
  }, []);

  const fetchProducts = async (page, size) => {
    setLoading(true);
    try {
      const response = await productService.getAllProducts(page, size);
      const { content, totalElements } = response.data.data;
      
      const formattedProducts = content.map(product => ({
        key: product.id,
        id: product.id,
        name: product.name,
        price: product.price,
        discountPrice: product.discountPrice,
        category: product.categoryName,
        categoryId: product.categoryId,
        stock: product.stockQuantity,
        description: product.description,
        image: product.images && product.images.length > 0 
          ? product.images.find(img => img.isPrimary)?.imageUrl || product.images[0].imageUrl
          : '',
        images: product.images?.map(img => img.imageUrl) || [],
      }));

      setProducts(formattedProducts);
      setPagination(prev => ({
        ...prev,
        total: totalElements,
      }));
    } catch (error) {
      console.error('Error fetching products:', error);
      message.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await categoryService.getAllCategories();
      setCategories(response.data.data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const showModal = (product = null) => {
    setEditingProduct(product);
    if (product) {
      form.setFieldsValue({
        name: product.name,
        price: product.price,
        discountPrice: product.discountPrice,
        categoryId: product.categoryId,
        stock: product.stock,
        description: product.description,
      });
      setFileList(
        product.images?.map((url, index) => ({
          uid: `-${index}`,
          name: `image${index}.png`,
          status: 'done',
          url: url,
        })) || []
      );
    } else {
      form.resetFields();
      setFileList([]);
    }
    setIsModalVisible(true);
  };

  const handleUploadImage = async (file) => {
    setUploading(true);
    try {
      const response = await adminService.uploadProductImage(file);
      const imageUrl = response.data.data.imageUrl;
      message.success('Image uploaded successfully');
      return imageUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      message.error('Failed to upload image');
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      // Upload new images
      const imageUrls = [];
      for (const file of fileList) {
        if (file.originFileObj) {
          const imageUrl = await handleUploadImage(file.originFileObj);
          if (imageUrl) imageUrls.push(imageUrl);
        } else if (file.url) {
          imageUrls.push(file.url);
        }
      }

      const productData = {
        name: values.name,
        description: values.description || '',
        price: values.price,
        discountPrice: values.discountPrice || values.price,
        stockQuantity: values.stock,
        categoryId: values.categoryId,
        imageUrls: imageUrls,
      };

      if (editingProduct) {
        await adminService.updateProduct(editingProduct.id, productData);
        message.success('Product updated successfully');
      } else {
        await adminService.createProduct(productData);
        message.success('Product created successfully');
      }

      setIsModalVisible(false);
      fetchProducts(pagination.current - 1, pagination.pageSize);
    } catch (error) {
      console.error('Error saving product:', error);
      message.error('Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await adminService.deleteProduct(id);
      message.success('Product deleted successfully');
      fetchProducts(pagination.current - 1, pagination.pageSize);
    } catch (error) {
      console.error('Error deleting product:', error);
      message.error('Failed to delete product');
    }
  };

  const handleUploadChange = ({ fileList: newFileList }) => setFileList(newFileList);

  const handleTableChange = (newPagination) => {
    setPagination(newPagination);
    fetchProducts(newPagination.current - 1, newPagination.pageSize);
  };

  const columns = [
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      render: src => <img src={getImageUrl(src)} alt="product" style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 6 }} />
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: text => <span style={{ fontWeight: 500 }}>{text}</span>,
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Search name"
            value={selectedKeys[0]}
            onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => confirm()}
            style={{ width: 188, marginBottom: 8, display: 'block' }}
          />
          <Space>
            <Button type="primary" onClick={() => confirm()} icon={<SearchOutlined />} size="small" style={{ width: 90 }}>
              Search
            </Button>
            <Button onClick={() => clearFilters()} size="small" style={{ width: 90 }}>
              Reset
            </Button>
          </Space>
        </div>
      ),
      filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#C6A769' : undefined }} />,
      onFilter: (value, record) => record.name.toLowerCase().includes(value.toLowerCase()),
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      filters: [
        { text: 'Rings', value: 'Rings' },
        { text: 'Necklaces', value: 'Necklaces' },
        { text: 'Earrings', value: 'Earrings' },
      ],
      onFilter: (value, record) => record.category.indexOf(value) === 0,
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: price => formatPrice(price),
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: 'Stock',
      dataIndex: 'stock',
      key: 'stock',
      render: stock => (
        <Tag color={stock > 10 ? 'success' : stock > 0 ? 'warning' : 'error'}>
          {stock > 0 ? `${stock} in stock` : 'Out of stock'}
        </Tag>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type="text" icon={<EditOutlined />} onClick={() => showModal(record)} />
          <Popconfirm title="Are you sure?" onConfirm={() => handleDelete(record.id)}>
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={2} style={{ margin: 0, fontFamily: "'Playfair Display', serif" }}>Products</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()} size="large">
          Add Product
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={products}
        loading={loading}
        pagination={{
          ...pagination,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} products`,
        }}
        onChange={handleTableChange}
        rowSelection={{ type: 'checkbox' }}
      />

      <Modal
        title={editingProduct ? "Edit Product" : "Add Product"}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={() => setIsModalVisible(false)}
        width={800}
        confirmLoading={loading}
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={16}>
              <Form.Item name="name" label="Product Name" rules={[{ required: true }]}>
                <Input placeholder="Enter product name" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="categoryId" label="Category" rules={[{ required: true }]}>
                <Select placeholder="Select category">
                  {categories.map(cat => (
                    <Option key={cat.id} value={cat.id}>{cat.name}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="price" label="Price" rules={[{ required: true }]}>
                <InputNumber
                  style={{ width: '100%' }}
                  formatter={value => `₹ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/\₹\s?|(,*)/g, '')}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="discountPrice" label="Discount Price">
                <InputNumber
                  style={{ width: '100%' }}
                  formatter={value => `₹ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/\₹\s?|(,*)/g, '')}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="stock" label="Stock Quantity" rules={[{ required: true }]}>
                <InputNumber style={{ width: '100%' }} min={0} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="description" label="Description">
            <TextArea rows={4} />
          </Form.Item>

          <Form.Item label="Product Images">
            <Upload
              listType="picture-card"
              fileList={fileList}
              onChange={handleUploadChange}
              beforeUpload={() => false}
            >
              {fileList.length < 4 && (
                <div>
                  <UploadOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              )}
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </AdminLayout>
  );
};

export default AdminProducts;
