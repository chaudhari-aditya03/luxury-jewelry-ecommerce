import React, { useState, useEffect } from 'react';
import {
  Layout, Row, Col, Card, Typography, Input, Select, Slider,
  Checkbox, Radio, Button, Pagination, Empty, Spin, Breadcrumb,
  Drawer, Space, message
} from 'antd';
import { FilterOutlined, SearchOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import ProductCard from '../components/product/ProductCard';
import { productService, cartService, userService } from '../services';
import { useAuth } from '../context/AuthContext';
import { getImageUrl } from '../utils/helpers';
import './Shop.css';

const { Title, Text } = Typography;
const { Sider, Content } = Layout;
const { Search } = Input;
const { Option } = Select;

const ShopPage = () => {
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
      message.success('Added to cart');
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to add to cart');
    }
  };

  const handleAddToWishlist = async (productId) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      await userService.addToWishlist(productId);
      message.success('Added to wishlist');
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to add to wishlist');
    }
  };

  const FilterContent = () => (
    <div className="shop-filter-content">
      <div className="shop-filter-section">
        <Title level={5} className="shop-filter-title">Categories</Title>
        <Checkbox.Group
          options={categories}
          value={filters.category}
          onChange={v => handleFilterChange('category', v)}
          className="shop-checkbox-group"
        />
      </div>

      <div className="shop-filter-section">
        <Title level={5} className="shop-filter-title">Price Range</Title>
        <Slider
          range
          min={0}
          max={100000}
          step={1000}
          value={filters.priceRange}
          onAfterChange={v => handleFilterChange('priceRange', v)}
          className="shop-price-slider"
        />
        <div className="shop-filter-range-labels">
          <Text type="secondary">₹0</Text>
          <Text type="secondary">₹1,00,000+</Text>
        </div>
      </div>

      <div className="shop-filter-section">
        <Title level={5} className="shop-filter-title">Rating</Title>
        <Radio.Group
          onChange={e => handleFilterChange('rating', e.target.value)}
          value={filters.rating}
          className="shop-radio-group"
        >
          <Radio value={4}>4 Stars & Up</Radio>
          <Radio value={3}>3 Stars & Up</Radio>
          <Radio value={2}>2 Stars & Up</Radio>
          <Radio value={0}>Any Rating</Radio>
        </Radio.Group>
      </div>

      <Button
        block
        className="shop-clear-btn"
        onClick={() => setFilters({ search: '', category: [], priceRange: [0, 1000000], rating: 0, sortBy: 'newest' })}
      >
        Clear Filters
      </Button>
    </div>
  );

  return (
    <MainLayout>
      <section className="shop-page">
        <div className="shop-shell">
          <Breadcrumb items={[{ title: 'Home', href: '/' }, { title: 'Shop' }]} className="shop-breadcrumb" />

          <div className="shop-hero">
            <div className="shop-hero-content">
              <p className="shop-hero-eyebrow">Curated Collection</p>
              <Title level={2} className="shop-hero-title">Shop Collection</Title>
              <p className="shop-hero-subtitle">
                Discover handcrafted jewellery designed for elegance and timeless beauty.
              </p>
            </div>
            <div className="shop-hero-actions">
              <Search
                allowClear
                enterButton={<SearchOutlined />}
                placeholder="Search rings, necklaces, earrings..."
                className="shop-search"
                onSearch={(value) => handleFilterChange('search', value.trim())}
              />
              <Button
                icon={<FilterOutlined />}
                className="shop-mobile-filter-btn md:hidden"
                onClick={() => setMobileFilterVisible(true)}
              >
                Filters
              </Button>
            </div>
          </div>

          <Layout className="shop-layout">
            <Sider width={300} theme="light" className="shop-sider hidden md:block">
              <div className="shop-sidebar-sticky">
                <div className="shop-filter-card">
                  <FilterContent />
                </div>
              </div>
            </Sider>

            <Content className="shop-content">
              <Card className="shop-toolbar" styles={{ body: { padding: '14px 20px' } }}>
                <Row justify="space-between" align="middle" gutter={[16, 16]}>
                  <Col xs={24} sm={12}>
                    <Text className="shop-product-count">{totalItems} Products Found</Text>
                  </Col>
                  <Col xs={24} sm={12} className="shop-sort-col">
                    <Space>
                      <Text className="shop-sort-label">Sort By:</Text>
                      <Select
                        value={filters.sortBy}
                        className="shop-sort-select"
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

              {isLoading ? (
                <div className="shop-loading-wrap">
                  <Spin size="large" />
                </div>
              ) : products.length > 0 ? (
                <>
                  <Row gutter={[24, 24]} className="shop-products-grid">
                    {products.map(product => (
                      <Col xs={24} sm={12} lg={8} key={product.id} className="shop-product-col">
                        <ProductCard
                          product={product}
                          onAddToCart={handleAddToCart}
                          onAddToWishlist={handleAddToWishlist}
                        />
                      </Col>
                    ))}
                  </Row>
                  <div className="shop-pagination-wrap">
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
                <div className="shop-empty-wrap">
                  <Empty description="No products found" />
                </div>
              )}
            </Content>
          </Layout>
        </div>
      </section>

      <Drawer
        title="Filters"
        placement="left"
        onClose={() => setMobileFilterVisible(false)}
        open={mobileFilterVisible}
        className="shop-mobile-filter-drawer"
      >
        <FilterContent />
      </Drawer>
    </MainLayout>
  );
};

export default ShopPage;
