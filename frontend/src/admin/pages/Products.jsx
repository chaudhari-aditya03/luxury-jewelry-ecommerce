import React, { useMemo, useState, useEffect } from 'react';
import {
  Table, Button, Modal, Form, Input, InputNumber,
  Select, Upload, Space, Tag, Popconfirm, message,
  Card, Row, Col, Typography, Switch, Divider, DatePicker,
  Empty
} from 'antd';
import {
  PlusOutlined, EditOutlined, DeleteOutlined,
  UploadOutlined, SearchOutlined, StarFilled,
  PercentageOutlined, ThunderboltOutlined, AppstoreOutlined
} from '@ant-design/icons';
import AdminLayout from '../../layouts/AdminLayout';
import { getImageUrl } from '../../utils/helpers';
import { productService, categoryService, adminService } from '../../services';
import dayjs from 'dayjs';

const { Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

const currencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

const computeDiscountPrice = (price, discountPercentage) => {
  const numericPrice = Number(price || 0);
  const numericDiscount = Number(discountPercentage || 0);

  if (!numericPrice || !numericDiscount) {
    return numericPrice || null;
  }

  return Math.max(0, Math.round(numericPrice - (numericPrice * numericDiscount) / 100));
};

const emptyVariant = {
  variantName: '',
  size: '',
  color: '',
  additionalPrice: 0,
  stockQuantity: 0,
};

const variantSeparator = ' | ';

const buildVariantName = (variant) => {
  const baseName = String(variant?.variantName || '').trim();
  const size = String(variant?.size || '').trim();
  const color = String(variant?.color || '').trim();

  return [baseName, size ? `Size: ${size}` : null, color ? `Color: ${color}` : null]
    .filter(Boolean)
    .join(variantSeparator);
};

const parseVariantFields = (variantName) => {
  const rawName = String(variantName || '').trim();
  if (!rawName.includes(variantSeparator)) {
    return { variantName: rawName, size: '', color: '' };
  }

  const parts = rawName.split(variantSeparator).map((part) => part.trim()).filter(Boolean);
  const baseName = parts[0] || rawName;
  const sizePart = parts.find((part) => /^Size:/i.test(part));
  const colorPart = parts.find((part) => /^Color:/i.test(part));

  return {
    variantName: baseName,
    size: sizePart ? sizePart.replace(/^Size:\s*/i, '') : '',
    color: colorPart ? colorPart.replace(/^Color:\s*/i, '') : '',
  };
};

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

  const summaryCards = useMemo(() => ([
    {
      label: 'Fields the admin submits',
      value: 'Product core, pricing, sale window, merchandising flags, variants, images',
      icon: AppstoreOutlined,
    },
    {
      label: 'Pricing truth',
      value: 'Backend calculates discount_price from original price and discount %',
      icon: PercentageOutlined,
    },
    {
      label: 'Merchandising',
      value: 'Featured, active, stock, sale, and image gallery are all editable here',
      icon: ThunderboltOutlined,
    },
  ]), []);

  useEffect(() => {
    fetchProducts(pagination.current - 1, pagination.pageSize);
    fetchCategories();
  }, []);

  const handleFormValuesChange = (_, allValues) => {
    const calculatedPrice = computeDiscountPrice(allValues.originalPrice || allValues.price, allValues.discountPercentage);
    if (Number(allValues.discountPrice || 0) !== Number(calculatedPrice || 0)) {
      form.setFieldsValue({ discountPrice: calculatedPrice });
    }
  };

  const fetchProducts = async (page, size) => {
    setLoading(true);
    try {
      const response = await productService.getAllProducts(page, size);
      const { content, totalElements } = response.data.data;
      
      const formattedProducts = content.map(product => ({
        key: product.id,
        id: product.id,
        name: product.name,
        sku: product.sku,
        price: product.price,
        originalPrice: product.originalPrice,
        discountPrice: product.discountPrice,
        discountPercentage: product.discountPercentage,
        category: product.categoryName,
        categoryId: product.categoryId,
        stock: product.stockQuantity,
        description: product.description,
        isFeatured: product.isFeatured,
        isActive: product.isActive,
        saleStartDate: product.saleStartDate,
        saleEndDate: product.saleEndDate,
        averageRating: product.averageRating,
        reviewCount: product.reviewCount,
        image: product.images && product.images.length > 0 
          ? product.images.find(img => img.isPrimary)?.imageUrl || product.images[0].imageUrl
          : '',
        images: product.images?.map(img => img.imageUrl) || [],
        variants: product.variants || [],
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
      const saleDates = product.saleStartDate && product.saleEndDate
        ? [dayjs(product.saleStartDate), dayjs(product.saleEndDate)]
        : [];

      form.setFieldsValue({
        name: product.name,
        sku: product.sku,
        price: product.price,
        originalPrice: product.originalPrice,
        discountPercentage: product.discountPercentage,
        discountPrice: product.discountPrice,
        categoryId: product.categoryId,
        stockQuantity: product.stock,
        description: product.description,
        isFeatured: product.isFeatured,
        isActive: product.isActive ?? true,
        saleWindow: saleDates,
        variants: product.variants && product.variants.length > 0
          ? product.variants.map((variant) => ({
              ...emptyVariant,
              ...parseVariantFields(variant.variantName),
              additionalPrice: Number(variant.additionalPrice || 0),
              stockQuantity: Number(variant.stockQuantity || 0),
            }))
          : [emptyVariant],
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
      form.setFieldsValue({
        isFeatured: false,
        isActive: true,
        variants: [emptyVariant],
      });
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

      const saleWindow = values.saleWindow || [];
      const discountPrice = values.discountPrice ?? computeDiscountPrice(values.originalPrice || values.price, values.discountPercentage);
      const variants = (values.variants || [])
        .filter((variant) => variant && (variant.variantName || variant.size || variant.color))
        .map(variant => ({
          variantName: buildVariantName(variant),
          additionalPrice: Number(variant.additionalPrice || 0),
          stockQuantity: Number(variant.stockQuantity || 0),
        }));

      const productData = {
        name: values.name,
        sku: values.sku || undefined,
        description: values.description || '',
        price: values.price,
        originalPrice: values.originalPrice || values.price,
        discountPercentage: values.discountPercentage || null,
        discountPrice: discountPrice || null,
        saleStartDate: saleWindow[0] ? saleWindow[0].toISOString() : null,
        saleEndDate: saleWindow[1] ? saleWindow[1].toISOString() : null,
        stockQuantity: values.stockQuantity,
        categoryId: values.categoryId,
        isFeatured: values.isFeatured || false,
        isActive: values.isActive ?? true,
        imageUrls: imageUrls,
        variants,
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
      render: (text, record) => (
        <div className="space-y-1">
          <div className="font-semibold text-luxury">{text}</div>
          <div className="text-xs uppercase tracking-[0.2em] text-muted">{record.sku || 'SKU pending'}</div>
        </div>
      ),
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
      render: category => <Tag color="gold" className="m-0 rounded-full border-0 px-3 py-1">{category}</Tag>,
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price, record) => (
        <div className="space-y-1">
          <div className="font-semibold text-luxury">{currencyFormatter.format(Number(record.discountPrice || price || 0))}</div>
          {Number(record.originalPrice || price || 0) > Number(record.discountPrice || price || 0) ? (
            <div className="text-xs text-muted line-through">{currencyFormatter.format(Number(record.originalPrice || price || 0))}</div>
          ) : null}
        </div>
      ),
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: 'Status',
      key: 'status',
      render: (_, record) => (
        <Space size={6} wrap>
          <Tag color={record.isActive ? 'green' : 'red'} className="m-0 rounded-full border-0 px-3 py-1">
            {record.isActive ? 'Active' : 'Inactive'}
          </Tag>
          {record.isFeatured ? <Tag color="gold" className="m-0 rounded-full border-0 px-3 py-1"><StarFilled /> Featured</Tag> : null}
          {Number(record.discountPercentage || 0) > 0 ? <Tag color="orange" className="m-0 rounded-full border-0 px-3 py-1"><PercentageOutlined /> Sale</Tag> : null}
        </Space>
      ),
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
      <div className="space-y-6">
        <div className="page-card bg-[radial-gradient(circle_at_top_right,rgba(198,167,105,0.18),transparent_28%),linear-gradient(135deg,#fffdf8_0%,#faf7f1_100%)] p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl space-y-3">
              <p className="text-xs uppercase tracking-[0.35em] text-gold">Catalog studio</p>
              <Title level={2} className="!m-0 !font-display !text-luxury">Products</Title>
              <p className="max-w-2xl text-sm leading-7 text-muted">
                The admin form now mirrors the product schema: core details, pricing, sale window, flags, variants, and gallery images.
              </p>
            </div>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()} size="large" className="!h-12 !rounded-full !border-0 !bg-luxury !px-6 !font-semibold !text-white hover:!bg-gold">
              Add Product
            </Button>
          </div>

          <Row gutter={[16, 16]} className="mt-6">
            {summaryCards.map(({ label, value, icon: Icon }) => (
              <Col xs={24} md={8} key={label}>
                <Card className="page-card h-full border-0 shadow-none">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-background text-gold">
                      <Icon />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-luxury">{label}</p>
                      <p className="mt-1 text-sm leading-6 text-muted">{value}</p>
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>

          <Row gutter={[16, 16]} className="mt-4">
            <Col xs={24} md={12}>
              <Card className="page-card h-full border-0 shadow-none">
                <p className="text-sm font-semibold text-luxury">Live review metrics</p>
                <p className="mt-2 text-sm leading-6 text-muted">
                  Average rating and review count are computed from customer reviews and shown in the storefront.
                </p>
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card className="page-card h-full border-0 shadow-none">
                <p className="text-sm font-semibold text-luxury">Variant schema</p>
                <p className="mt-2 text-sm leading-6 text-muted">
                  Each variant stores a display label, size, color, additional price, and its own stock quantity.
                </p>
              </Card>
            </Col>
          </Row>
        </div>

        <Card className="page-card overflow-hidden border-0 shadow-[0_18px_45px_rgba(17,17,17,0.06)]">
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
            className="admin-table"
          />
        </Card>
      </div>

      <Modal
        title={editingProduct ? 'Edit Product' : 'Add Product'}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={() => setIsModalVisible(false)}
        width={1100}
        confirmLoading={loading}
        className="admin-product-modal"
        centered
      >
        <div className="space-y-6">
          <div className="grid gap-4 lg:grid-cols-3">
            <div className="rounded-3xl border border-[#eadfca] bg-[#fffaf1] p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-gold">Product data</p>
              <p className="mt-2 text-sm leading-6 text-muted">Enter the fields the customer sees on cards and the detail page.</p>
            </div>
            <div className="rounded-3xl border border-[#eadfca] bg-white p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-gold">Pricing</p>
              <p className="mt-2 text-sm leading-6 text-muted">Original price, sale price, and discount percentage stay in sync.</p>
            </div>
            <div className="rounded-3xl border border-[#eadfca] bg-white p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-gold">Merchandising</p>
              <p className="mt-2 text-sm leading-6 text-muted">Flags like featured, active, and scheduled sale control visibility.</p>
            </div>
          </div>

          <Form form={form} layout="vertical" className="space-y-6" onValuesChange={handleFormValuesChange}>
            <Row gutter={16}>
              <Col xs={24} lg={16}>
                <Form.Item name="name" label="Product Name" rules={[{ required: true, message: 'Product name is required' }]}>
                  <Input placeholder="Enter product name" className="input-base" />
                </Form.Item>
              </Col>
              <Col xs={24} lg={8}>
                <Form.Item name="sku" label="SKU">
                  <Input placeholder="JW-XXXXXXX" className="input-base" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col xs={24} lg={8}>
                <Form.Item name="categoryId" label="Category" rules={[{ required: true, message: 'Category is required' }]}>
                  <Select placeholder="Select category" className="input-base">
                    {categories.map(cat => (
                      <Option key={cat.id} value={cat.id}>{cat.name}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} lg={8}>
                <Form.Item name="price" label="Current Price" rules={[{ required: true, message: 'Price is required' }]}>
                  <InputNumber
                    style={{ width: '100%' }}
                    min={0}
                    placeholder="0"
                    formatter={value => `₹ ${String(value || '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`}
                    parser={value => value.replace(/\₹\s?|(,*)/g, '')}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} lg={8}>
                <Form.Item name="originalPrice" label="Original Price">
                  <InputNumber
                    style={{ width: '100%' }}
                    min={0}
                    placeholder="0"
                    formatter={value => `₹ ${String(value || '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`}
                    parser={value => value.replace(/\₹\s?|(,*)/g, '')}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col xs={24} lg={8}>
                <Form.Item name="discountPercentage" label="Discount %">
                  <InputNumber style={{ width: '100%' }} min={0} max={90} placeholder="0" />
                </Form.Item>
              </Col>
              <Col xs={24} lg={8}>
                <Form.Item name="discountPrice" label="Discount Price">
                  <InputNumber
                    style={{ width: '100%' }}
                    min={0}
                    placeholder="Auto-calculated if empty"
                    disabled
                    formatter={value => `₹ ${String(value || '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`}
                    parser={value => value.replace(/\₹\s?|(,*)/g, '')}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} lg={8}>
                <Form.Item name="stockQuantity" label="Stock Quantity" rules={[{ required: true, message: 'Stock quantity is required' }]}>
                  <InputNumber style={{ width: '100%' }} min={0} placeholder="0" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col xs={24} lg={12}>
                <Form.Item name="saleWindow" label="Sale Window">
                  <RangePicker showTime className="w-full" />
                </Form.Item>
              </Col>
              <Col xs={24} lg={6}>
                <Form.Item name="isActive" label="Active" valuePropName="checked" initialValue>
                  <Switch checkedChildren="Visible" unCheckedChildren="Hidden" />
                </Form.Item>
              </Col>
              <Col xs={24} lg={6}>
                <Form.Item name="isFeatured" label="Featured" valuePropName="checked">
                  <Switch checkedChildren="Featured" unCheckedChildren="Regular" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item name="description" label="Description">
              <TextArea rows={5} placeholder="Describe the material, finish, inspiration, and styling details" />
            </Form.Item>

            <Divider />

            <Form.List name="variants">
              {(fields, { add, remove }) => (
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-luxury">Product Variants</p>
                      <p className="text-sm text-muted">Add ring sizes, metal colors, or other purchasable variations.</p>
                    </div>
                    <Button onClick={() => add(emptyVariant)} icon={<PlusOutlined />} className="!rounded-full">
                      Add Variant
                    </Button>
                  </div>

                  {fields.length > 0 ? fields.map(({ key, name, ...restField }) => (
                    <Card key={key} className="border-[#eadfca] bg-background/80 shadow-none">
                      <Row gutter={16} align="middle">
                        <Col xs={24} md={10}>
                          <Form.Item
                            {...restField}
                            name={[name, 'variantName']}
                            label="Variant Name"
                            rules={[{ required: true, message: 'Variant name is required' }]}
                          >
                            <Input placeholder="18K Yellow Gold" />
                          </Form.Item>
                        </Col>
                        <Col xs={12} md={4}>
                          <Form.Item {...restField} name={[name, 'size']} label="Size">
                            <Input placeholder="M / 6 / 18" />
                          </Form.Item>
                        </Col>
                        <Col xs={12} md={4}>
                          <Form.Item {...restField} name={[name, 'color']} label="Color">
                            <Input placeholder="Yellow Gold" />
                          </Form.Item>
                        </Col>
                        <Col xs={12} md={4}>
                          <Form.Item {...restField} name={[name, 'additionalPrice']} label="Additional Price">
                            <InputNumber style={{ width: '100%' }} min={0} />
                          </Form.Item>
                        </Col>
                        <Col xs={12} md={4}>
                          <Form.Item {...restField} name={[name, 'stockQuantity']} label="Stock">
                            <InputNumber style={{ width: '100%' }} min={0} />
                          </Form.Item>
                        </Col>
                        <Col xs={24} md={2}>
                          <Button danger onClick={() => remove(name)} className="mt-2 w-full md:mt-8">
                            Remove
                          </Button>
                        </Col>
                      </Row>
                    </Card>
                  )) : <Empty description="No variants added yet" />}
                </div>
              )}
            </Form.List>

            <Divider />

            <div className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-luxury">Gallery Images</p>
                  <p className="text-sm text-muted">Upload up to four images. The first image becomes the main image by convention.</p>
                </div>
                <div className="rounded-full bg-background px-4 py-2 text-xs uppercase tracking-[0.22em] text-muted">
                  {fileList.length}/4
                </div>
              </div>

              <Upload
                listType="picture-card"
                fileList={fileList}
                onChange={handleUploadChange}
                beforeUpload={() => false}
                className="gallery-upload"
              >
                {fileList.length < 4 && (
                  <div>
                    <UploadOutlined />
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </div>
                )}
              </Upload>
            </div>
          </Form>
        </div>
      </Modal>
    </AdminLayout>
  );
};

export default AdminProducts;
