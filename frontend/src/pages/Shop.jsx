import React, { useState, useEffect } from 'react';
import {
  Layout, Row, Col, Card, Typography, Input, Select, Slider,
  Checkbox, Radio, Button, Pagination, Empty, Spin, Breadcrumb,
  Collapse, theme, Drawer, Space
} from 'antd';
import { FilterOutlined, SearchOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import ProductCard from '../components/product/ProductCard';
import { productService, cartService } from '../services';
import { useAuth } from '../context/AuthContext';
import { getImageUrl } from '../utils/helpers';

const { Title, Text } = Typography;
const { Sider, Content } = Layout;
const { Panel } = Collapse;
const { Search } = Input;
const { Option } = Select;

const ShopPage = () => {
  const { token } = theme.useToken();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [filters, setFilters] = useState({
    search: '',
    category: [],
    priceRange: [0, 1000000],
    rating: 0,
    sortBy: 'newest',
  });
  const [mobileFilterVisible, setMobileFilterVisible] = useState(false);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const pageSize = 12;
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [filters, currentPage]);

  const fetchCategories = async () => {
    try {
      const response = await productService.getCategories();
      const items = response.data?.data || [];
      setCategories(items.map((item) => ({
        label: item.name,
        value: item.id,
      })));
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      setCategories([]);
    }
  };

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const categoryId = filters.category.length > 0 ? filters.category[0] : undefined;
      const minPrice = filters.priceRange?.[0];
      const maxPrice = filters.priceRange?.[1];

      const response = await productService.getAllProducts(currentPage - 1, pageSize, {
        search: filters.search || undefined,
        categoryId,
        minPrice,
        maxPrice,
        sortBy: filters.sortBy,
      });

      const pageData = response.data?.data;
      const content = pageData?.content || [];

      setProducts(content.map((product) => ({
        id: product.id,
        name: product.name,
        price: Number(product.discountPrice ?? product.price ?? 0),
        rating: product.averageRating ?? 0,
        category: product.categoryName || 'Jewelry',
        image: getImageUrl(product.images?.find((img) => img.isPrimary)?.imageUrl || product.images?.[0]?.imageUrl),
      })));
      setTotalItems(pageData?.totalElements ?? 0);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
    setIsLoading(false);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleAddToCart = async (productId) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      await cartService.addToCart(productId, 1, null);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  };

  const FilterContent = () => (
    <div style={{ padding: '0 10px' }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={5}>Categories</Title>
        <Checkbox.Group
          options={categories}
          value={filters.category}
          onChange={v => handleFilterChange('category', v)}
          style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
        />
      </div>

      <div style={{ marginBottom: 24 }}>
        <Title level={5}>Price Range</Title>
        <Slider
          range
          min={0}
          max={100000}
          step={1000}
          defaultValue={[0, 100000]}
          onAfterChange={v => handleFilterChange('priceRange', v)}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Text type="secondary">₹0</Text>
          <Text type="secondary">₹1,00,000+</Text>
        </div>
      </div>

      <div style={{ marginBottom: 24 }}>
        <Title level={5}>Rating</Title>
        <Radio.Group
          onChange={e => handleFilterChange('rating', e.target.value)}
          value={filters.rating}
          style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
        >
          <Radio value={4}>4 Stars & Up</Radio>
          <Radio value={3}>3 Stars & Up</Radio>
          <Radio value={2}>2 Stars & Up</Radio>
          <Radio value={0}>Any Rating</Radio>
        </Radio.Group>
      </div>

      <Button
        block
        onClick={() => setFilters({ search: '', category: [], priceRange: [0, 1000000], rating: 0, sortBy: 'newest' })}
      >
        Clear Filters
      </Button>
    </div>
  );

  return (
    <MainLayout>
      <div style={{ paddingBottom: 20 }}>
        <Breadcrumb items={[{ title: 'Home', href: '/' }, { title: 'Shop' }]} style={{ marginBottom: 20 }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <Title level={2} style={{ margin: 0, fontFamily: "'Playfair Display', serif" }}>Shop Collection</Title>
          <Button
            icon={<FilterOutlined />}
            className="md:hidden"
            onClick={() => setMobileFilterVisible(true)}
          >
            Filters
          </Button>
        </div>

        <Layout style={{ background: '#fff' }}>
          {/* Desktop Sidebar */}
          <Sider width={280} theme="light" style={{ background: '#fff', paddingRight: 24 }} className="hidden md:block">
            <FilterContent />
          </Sider>

          <Content style={{ background: '#fff' }}>
            {/* Toolbar */}
            <Card styles={{ body: { padding: '12px 24px' } }} style={{ marginBottom: 24, borderRadius: 8 }}>
              <Row justify="space-between" align="middle" gutter={[16, 16]}>
                <Col xs={24} sm={12}>
                  <Text>{totalItems} Products Found</Text>
                </Col>
                <Col xs={24} sm={12} style={{ textAlign: 'right' }}>
                  <Space>
                    <Text>Sort By:</Text>
                    <Select
                      defaultValue="newest"
                      style={{ width: 150 }}
                      onChange={v => handleFilterChange('sortBy', v)}
                    >
                      <Option value="newest">Newest Arrivals</Option>
                      <Option value="price-asc">Price: Low to High</Option>
                      <Option value="price-desc">Price: High to Low</Option>
                      <Option value="rating">Top Rated</Option>
                    </Select>
                  </Space>
                </Col>
              </Row>
            </Card>

            {/* Products */}
            {isLoading ? (
              <div style={{ textAlign: 'center', padding: 50 }}>
                <Spin size="large" />
              </div>
            ) : products.length > 0 ? (
              <>
                <Row gutter={[24, 24]}>
                  {products.map(product => (
                    <Col xs={24} sm={12} lg={8} key={product.id}>
                      <ProductCard product={product} onAddToCart={handleAddToCart} />
                    </Col>
                  ))}
                </Row>
                <div style={{ marginTop: 40, textAlign: 'center' }}>
                  <Pagination
                    current={currentPage}
                    total={totalItems}
                    pageSize={pageSize}
                    onChange={p => setCurrentPage(p)}
                    showSizeChanger={false}
                  />
                </div>
              </>
            ) : (
              <Empty description="No products found" />
            )}
          </Content>
        </Layout>
      </div>

      <Drawer
        title="Filters"
        placement="left"
        onClose={() => setMobileFilterVisible(false)}
        open={mobileFilterVisible}
      >
        <FilterContent />
      </Drawer>
    </MainLayout>
  );
};

export default ShopPage;
