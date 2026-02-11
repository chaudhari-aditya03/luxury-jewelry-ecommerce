import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { StarIcon, TruckIcon, ShieldCheckIcon, SparklesIcon } from '@heroicons/react/24/solid';
import MainLayout from '../layouts/MainLayout';
import Button from '../components/common/Button';
import ProductCard from '../components/product/ProductCard';
import { productService } from '../services';
import { SkeletonProduct } from '../components/common/Skeleton';

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setIsLoading(true);
        const response = await productService.getFeaturedProducts(4);
        setFeaturedProducts(response.data.data.content || response.data.data || []);
      } catch (err) {
        console.error('Failed to fetch featured products:', err);
        setError('Failed to load featured products');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  return (
    <MainLayout>
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-rose-gold-500 to-rose-gold-600 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-xl"></div>
          <div className="absolute -bottom-8 right-20 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-xl"></div>
        </div>

        <div className="container-custom relative z-10 py-20 md:py-32">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="font-display text-5xl md:text-6xl font-bold leading-tight">
                Timeless Elegance
              </h1>
              <p className="text-lg text-gray-100 max-w-lg">
                Discover our exquisite collection of handcrafted jewelry. Each piece tells a story of luxury, craftsmanship, and timeless beauty.
              </p>
              <div className="flex gap-4">
                <Link to="/shop">
                  <Button size="lg" variant="primary" className="bg-white text-rose-gold-500 hover:bg-gray-100">
                    Shop Now
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  Learn More
                </Button>
              </div>
            </div>
            <div className="hidden md:block">
              <img
                src="https://via.placeholder.com/500x500?text=Premium+Jewelry"
                alt="Premium Jewelry"
                className="w-full rounded-lg shadow-premium"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="section bg-gray-50 dark:bg-gray-800">
        <div className="container-custom">
          <h2 className="text-center text-3xl font-bold mb-12">Why Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="card p-8 text-center">
              <div className="w-16 h-16 bg-gold-100 dark:bg-gold-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <TruckIcon className="w-8 h-8 text-rose-gold-500" />
              </div>
              <h3 className="font-bold text-lg mb-2">Free Shipping</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">On orders above ₹5,000</p>
            </div>

            <div className="card p-8 text-center">
              <div className="w-16 h-16 bg-gold-100 dark:bg-gold-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldCheckIcon className="w-8 h-8 text-rose-gold-500" />
              </div>
              <h3 className="font-bold text-lg mb-2">Authentic</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">100% certified jewelry</p>
            </div>

            <div className="card p-8 text-center">
              <div className="w-16 h-16 bg-gold-100 dark:bg-gold-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <SparklesIcon className="w-8 h-8 text-rose-gold-500" />
              </div>
              <h3 className="font-bold text-lg mb-2">Premium Quality</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Handcrafted by experts</p>
            </div>

            <div className="card p-8 text-center">
              <div className="w-16 h-16 bg-gold-100 dark:bg-gold-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <StarIcon className="w-8 h-8 text-rose-gold-500" />
              </div>
              <h3 className="font-bold text-lg mb-2">Customer Support</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">24/7 dedicated support</p>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Products */}
      <div className="section">
        <div className="container-custom">
          <h2 className="text-center text-3xl font-bold mb-12">Featured Collection</h2>
          
          {error && (
            <div className="text-center text-red-600 mb-8">{error}</div>
          )}
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {isLoading ? (
              <>
                <SkeletonProduct />
                <SkeletonProduct />
                <SkeletonProduct />
                <SkeletonProduct />
              </>
            ) : featuredProducts.length > 0 ? (
              featuredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={(id) => console.log('Add to cart:', id)}
                  onAddToWishlist={(id) => console.log('Add to wishlist:', id)}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-600 dark:text-gray-400">No featured products available</p>
              </div>
            )}
          </div>
          <div className="text-center mt-12">
            <Link to="/shop">
              <Button size="lg">View All Products</Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Newsletter */}
      <div className="section bg-gray-900 text-white">
        <div className="container-custom max-w-2xl">
          <div className="text-center space-y-6">
            <h2 className="text-4xl font-bold">Subscribe to Our Newsletter</h2>
            <p className="text-gray-300 text-lg">
              Get exclusive offers and updates on our latest collections
            </p>
            <form className="flex gap-3" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-3 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-rose-gold-500 focus:outline-none"
              />
              <Button variant="primary" size="md">
                Subscribe
              </Button>
            </form>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default HomePage;
