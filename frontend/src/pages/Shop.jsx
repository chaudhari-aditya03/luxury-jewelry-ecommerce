import React, { useState, useEffect } from 'react';
import { FunnelIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
import MainLayout from '../layouts/MainLayout';
import ProductCard from '../components/product/ProductCard';
import Pagination from '../components/common/Pagination';
import Alert from '../components/common/Alert';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import { SkeletonProduct } from '../components/common/Skeleton';
import { productService } from '../services';

const ShopPage = () => {
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    priceRange: 'all',
    sortBy: 'newest',
  });
  const [currentPage, setCurrentPage] = useState(0); // Backend uses 0-indexed pages
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [error, setError] = useState('');
  const itemsPerPage = 12;

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await productService.getCategories();
        setCategories(response.data.data || []);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };
    fetchCategories();
  }, []);

  // Fetch products when filters or page changes
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        setError('');
        
        const params = {
          page: currentPage,
          size: itemsPerPage,
          search: filters.search || undefined,
          categoryId: filters.category || undefined,
          minPrice: filters.priceRange === 'budget' ? 0 : filters.priceRange === 'mid' ? 15000 : filters.priceRange === 'premium' ? 35000 : undefined,
          maxPrice: filters.priceRange === 'budget' ? 15000 : filters.priceRange === 'mid' ? 35000 : filters.priceRange === 'premium' ? 1000000 : undefined,
          sortBy: filters.sortBy,
        };

        console.log('Fetching products with params:', params);
        const response = await productService.getAllProducts(params.page, params.size, params);
        console.log('Products API Response:', response.data);
        
        const data = response.data.data;
        
        if (data && data.content) {
          console.log('Products received:', data.content.length);
          setProducts(data.content);
          setTotalPages(data.totalPages || 0);
          setTotalElements(data.totalElements || 0);
        } else {
          console.warn('Unexpected response structure:', data);
          setProducts([]);
          setError('Unexpected response format from server');
        }
      } catch (error) {
        console.error('Failed to fetch products:', error);
        console.error('Error details:', error.response?.data || error.message);
        setProducts([]);
        setError(error.response?.data?.message || 'Failed to load products. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [filters, currentPage]);

  return (
    <MainLayout>
      <div className="section">
        <div className="container-custom">
          {/* Header */}
          <h1 className="text-4xl font-bold mb-2">Shop Our Collection</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            {totalElements} products available
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Filters */}
            <div className="lg:sticky lg:top-24 h-max">
              <div className="card p-6 space-y-6">
                <h2 className="font-bold text-lg flex items-center gap-2">
                  <FunnelIcon className="w-5 h-5" />
                  Filters
                </h2>

                {/* Search */}
                <div>
                  <Input
                    placeholder="Search products..."
                    value={filters.search}
                    onChange={(e) => {
                      setFilters({ ...filters, search: e.target.value });
                      setCurrentPage(0);
                    }}
                  />
                </div>

                {/* Category */}
                <Select
                  label="Category"
                  placeholder="All Categories"
                  options={[
                    ...categories.map(cat => ({ 
                      label: cat.name, 
                      value: cat.id 
                    }))
                  ]}
                  value={filters.category}
                  onChange={(e) => {
                    setFilters({ ...filters, category: e.target.value });
                    setCurrentPage(0);
                  }}
                />

                {/* Price Range */}
                <Select
                  label="Price Range"
                  options={[
                    { label: 'All Prices', value: 'all' },
                    { label: 'Budget (< ₹15k)', value: 'budget' },
                    { label: 'Mid-range (₹15k - ₹35k)', value: 'mid' },
                    { label: 'Premium (> ₹35k)', value: 'premium' },
                  ]}
                  value={filters.priceRange}
                  onChange={(e) => {
                    setFilters({ ...filters, priceRange: e.target.value });
                    setCurrentPage(0);
                  }}
                />

                {/* Sort */}
                <Select
                  label="Sort By"
                  options={[
                    { label: 'Newest', value: 'newest' },
                    { label: 'Price: Low to High', value: 'price-asc' },
                    { label: 'Price: High to Low', value: 'price-desc' },
                    { label: 'Rating', value: 'rating' },
                  ]}
                  value={filters.sortBy}
                  onChange={(e) => {
                    setFilters({ ...filters, sortBy: e.target.value });
                    setCurrentPage(0);
                  }}
                />

                <button
                  onClick={() => {
                    setFilters({
                      search: '',
                      category: '',
                      priceRange: 'all',
                      sortBy: 'newest',
                    });
                    setCurrentPage(0);
                  }}
                  className="w-full py-2 text-rose-gold-500 hover:bg-rose-gold-50 dark:hover:bg-rose-gold-900/10 rounded-lg transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            </div>

            {/* Products Grid */}
            <div className="lg:col-span-3">
              {error && (
                <Alert
                  type="error"
                  message={error}
                  closeable={true}
                  onClose={() => setError('')}
                />
              )}

              {isLoading && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <SkeletonProduct key={i} />
                  ))}
                </div>
              )}

              {!isLoading && products.length > 0 && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onAddToCart={(id) => console.log('Add to cart:', id)}
                        onAddToWishlist={(id) => console.log('Add to wishlist:', id)}
                      />
                    ))}
                  </div>

                  {totalPages > 1 && (
                    <Pagination
                      currentPage={currentPage + 1}
                      totalPages={totalPages}
                      onPageChange={(page) => setCurrentPage(page - 1)}
                    />
                  )}
                </>
              )}

              {!isLoading && products.length === 0 && (
                <Alert
                  type="info"
                  message="No products found matching your filters. Try adjusting your search criteria."
                  closeable={false}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ShopPage;
