import React, { useEffect, useState } from 'react';
import { Alert, Button, Col, Empty, Row, Spin, message } from 'antd';
import { Link } from 'react-router-dom';
import { Heart, Sparkles, ShoppingBag, Trash2 } from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import ProductCard from '../components/product/ProductCard';
import { cartService, userService } from '../services';
import { getImageUrl } from '../utils/helpers';
import { useAuth } from '../context/AuthContext';
import './Wishlist.css';

const mapWishlistItem = (item) => ({
  id: item.productId || item.id,
  productId: item.productId || item.id,
  name: item.productName || item.name || 'Saved Piece',
  price: Number(item.productPrice ?? item.salePrice ?? item.price ?? 0),
  originalPrice: Number(item.originalPrice ?? item.productOriginalPrice ?? item.mrp ?? item.productPrice ?? item.price ?? 0),
  image: getImageUrl(item.productImage || item.imageUrl || item.image),
  rating: Number(item.averageRating ?? item.rating ?? 0),
  category: item.categoryName || item.category || 'Jewelry',
  inStock: item.inStock !== false,
});

const WishlistPage = () => {
  const { isAuthenticated } = useAuth();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [removingProductId, setRemovingProductId] = useState(null);

  const fetchWishlist = async () => {
    if (!isAuthenticated) {
      setWishlistItems([]);
      setError('');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await userService.getWishlist();
      const data = response.data?.data || [];
      setWishlistItems(data.map(mapWishlistItem));
    } catch (fetchError) {
      const messageText = fetchError.response?.data?.message || 'Failed to load wishlist';
      setError(messageText);
      setWishlistItems([]);
      message.error(messageText);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [isAuthenticated]);

  const handleRemove = async (productId) => {
    const previousItems = wishlistItems;
    setRemovingProductId(productId);
    setWishlistItems((prev) => prev.filter((item) => item.productId !== productId));

    try {
      await userService.removeFromWishlist(productId);
      message.success('Removed from wishlist');
    } catch (removeError) {
      setWishlistItems(previousItems);
      message.error(removeError.response?.data?.message || 'Failed to remove wishlist item');
    } finally {
      setRemovingProductId(null);
    }
  };

  const handleAddToCart = async (productId) => {
    try {
      await cartService.addToCart(productId, 1, null);
      message.success('Added to cart');
    } catch (cartError) {
      message.error(cartError.response?.data?.message || 'Failed to add to cart');
    }
  };

  if (!isAuthenticated) {
    return (
      <MainLayout>
        <section className="wishlist-page section">
          <div className="wishlist-shell">
            <div className="wishlist-auth-card text-center">
              <div className="wishlist-empty-illustration mx-auto">
                <Sparkles className="h-8 w-8" />
              </div>
              <p className="wishlist-kicker">Luxury Maison</p>
              <h1 className="wishlist-title mt-3">My Wishlist</h1>
              <p className="wishlist-subtitle mx-auto max-w-2xl">
                Sign in to save jewelry pieces, revisit them anytime, and move them to cart when you are ready.
              </p>
              <div className="wishlist-auth-actions justify-center">
                <Link to="/login">
                  <Button type="primary" size="large" className="wishlist-primary-btn" aria-label="Sign in to your account">
                    Sign In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="large" className="wishlist-secondary-btn" aria-label="Create a new account">
                    Create Account
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </MainLayout>
    );
  }

  if (isLoading) {
    return (
      <MainLayout>
        <section className="wishlist-page section">
          <div className="wishlist-shell">
            <div className="wishlist-hero">
              <div className="wishlist-hero-grid">
                <div>
                  <p className="wishlist-kicker">Curated Favorites</p>
                  <h1 className="wishlist-title">My Wishlist</h1>
                  <p className="wishlist-subtitle">Your saved pieces, curated for later.</p>
                </div>
                <div className="wishlist-metrics">
                  <div className="wishlist-metric">
                    <p className="wishlist-metric-label">Saved</p>
                    <p className="wishlist-metric-value">Loading</p>
                  </div>
                  <div className="wishlist-metric">
                    <p className="wishlist-metric-label">Ready</p>
                    <p className="wishlist-metric-value">Items</p>
                  </div>
                  <div className="wishlist-metric">
                    <p className="wishlist-metric-label">Style</p>
                    <p className="wishlist-metric-value">Maison</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="wishlist-loading-card text-center">
              <Spin size="large" />
              <p className="mt-4 font-display text-2xl font-semibold text-[#1f1f1f]">Loading your curated wishlist</p>
              <p className="mt-2 text-sm text-[#6b7280]">Gathering your saved pieces and arranging them into the maison edit.</p>
            </div>

            <div className="wishlist-skeleton-grid">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="wishlist-skeleton-card">
                  <div className="wishlist-skeleton-image" />
                  <div className="wishlist-skeleton-body">
                    <div className="wishlist-skeleton-line medium" />
                    <div className="wishlist-skeleton-line" />
                    <div className="wishlist-skeleton-line short" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </MainLayout>
    );
  }

  const savedCount = wishlistItems.length;
  const inStockCount = wishlistItems.filter((item) => item.inStock).length;

  return (
    <MainLayout>
      <section className="wishlist-page section">
        <div className="wishlist-shell">
          <header className="wishlist-hero">
            <div className="wishlist-hero-grid">
              <div>
                <p className="wishlist-kicker">Curated Favorites</p>
                <h1 className="wishlist-title">My Wishlist</h1>
                <p className="wishlist-subtitle">Your saved pieces, curated for later.</p>
              </div>

              <div className="wishlist-metrics">
                <div className="wishlist-metric">
                  <p className="wishlist-metric-label">Saved pieces</p>
                  <p className="wishlist-metric-value">{savedCount.toLocaleString('en-IN')}</p>
                </div>
                <div className="wishlist-metric">
                  <p className="wishlist-metric-label">Ready to cart</p>
                  <p className="wishlist-metric-value">{inStockCount.toLocaleString('en-IN')}</p>
                </div>
                <div className="wishlist-metric hidden sm:block">
                  <p className="wishlist-metric-label">Maison mood</p>
                  <p className="wishlist-metric-value">Editorial</p>
                </div>
              </div>
            </div>
          </header>

          {error ? (
            <div className="wishlist-error-card">
              <Alert
                type="error"
                showIcon
                message="Wishlist unavailable"
                description={error}
              />
              <div className="wishlist-error-actions">
                <Button type="primary" className="wishlist-primary-btn" onClick={fetchWishlist} aria-label="Retry loading wishlist">
                  Retry
                </Button>
                <Link to="/shop">
                  <Button className="wishlist-secondary-btn" aria-label="Continue shopping">
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </div>
          ) : null}

          {!error && wishlistItems.length === 0 ? (
            <div className="wishlist-empty-card text-center">
              <div className="wishlist-empty-illustration mx-auto">
                <Heart className="h-8 w-8" />
              </div>
              <Empty description={null} image={Empty.PRESENTED_IMAGE_SIMPLE} />
              <h2 className="mt-4 font-display text-3xl font-semibold text-[#1f1f1f]">Your wishlist is empty</h2>
              <p className="wishlist-subtitle mx-auto max-w-2xl">
                Save your favourite jewelry pieces and revisit them anytime.
              </p>
              <div className="wishlist-empty-actions justify-center">
                <Link to="/shop">
                  <Button type="primary" size="large" className="wishlist-primary-btn" aria-label="Continue shopping">
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </div>
          ) : null}

          {!error && wishlistItems.length > 0 ? (
            <>
              <div className="wishlist-section-note flex items-start gap-3">
                <ShoppingBag className="mt-0.5 h-5 w-5 text-[#c6a769]" />
                <div>
                  <p className="text-sm font-semibold text-[#1f1f1f]">Saved pieces ready for later</p>
                  <p className="mt-1 text-sm leading-7 text-[#6b7280]">
                    The same premium card treatment as the Shop page, with immediate remove actions and responsive 3:4 imagery.
                  </p>
                </div>
              </div>

              <Row gutter={[24, 24]}>
                {wishlistItems.map((item) => (
                  <Col xs={24} sm={12} lg={8} xl={6} key={item.productId}>
                    <ProductCard
                      product={item}
                      onAddToCart={handleAddToCart}
                      onRemoveFromWishlist={handleRemove}
                      showWishlistButton={false}
                      viewLabel="View Details"
                      removeLabel="Remove from Wishlist"
                      isRemovingFromWishlist={removingProductId === item.productId}
                    />
                  </Col>
                ))}
              </Row>
            </>
          ) : null}
        </div>
      </section>
    </MainLayout>
  );
};

export default WishlistPage;
