import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Empty, Spin, message } from 'antd';
import MainLayout from '../layouts/MainLayout';
import Button from '../components/common/Button';
import { formatPrice, getImageUrl } from '../utils/helpers';
import { cartService, userService } from '../services';
import { useAuth } from '../context/AuthContext';
import './Wishlist.css';

const WishlistPage = () => {
  const { isAuthenticated } = useAuth();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchWishlist = async () => {
    if (!isAuthenticated) {
      setWishlistItems([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await userService.getWishlist();
      const data = response.data?.data || [];
      const mapped = data.map((item) => ({
        id: item.id,
        productId: item.productId,
        name: item.productName,
        price: Number(item.productPrice ?? 0),
        image: getImageUrl(item.productImage),
        inStock: Boolean(item.inStock),
      }));
      setWishlistItems(mapped);
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to load wishlist');
      setWishlistItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [isAuthenticated]);

  const handleRemove = async (productId) => {
    try {
      await userService.removeFromWishlist(productId);
      message.success('Removed from wishlist');
      setWishlistItems((prev) => prev.filter((item) => item.productId !== productId));
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to remove wishlist item');
    }
  };

  const handleAddToCart = async (item) => {
    try {
      await cartService.addToCart(item.productId, 1, null);
      message.success('Added to cart');
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to add to cart');
    }
  };

  if (!isAuthenticated) {
    return (
      <MainLayout>
        <section className="wishlist-page section">
          <div className="wishlist-shell container-custom">
            <div className="wishlist-empty-panel text-center">
              <h1 className="wishlist-empty-title">Login to View Wishlist</h1>
              <p className="wishlist-empty-subtitle">
              Please sign in to access your saved products.
              </p>
              <Link to="/login">
                <Button size="lg" className="wishlist-primary-btn">Go to Login</Button>
              </Link>
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
          <div className="wishlist-shell container-custom">
            <div className="wishlist-loading-wrap text-center">
            <Spin size="large" />
            </div>
          </div>
        </section>
      </MainLayout>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <MainLayout>
        <section className="wishlist-page section">
          <div className="wishlist-shell container-custom">
            <div className="wishlist-empty-panel text-center">
              <Empty description="Your Wishlist is Empty" />
              <Link to="/shop">
                <Button size="lg" className="wishlist-primary-btn">Continue Shopping</Button>
              </Link>
            </div>
          </div>
        </section>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <section className="wishlist-page section">
        <div className="wishlist-shell container-custom">
          <header className="wishlist-hero">
            <p className="wishlist-eyebrow">Curated Favorites</p>
            <h1 className="wishlist-title">My Wishlist</h1>
            <p className="wishlist-subtitle">Your saved jewellery pieces, ready whenever you are.</p>
          </header>

          <div className="wishlist-grid">
            {wishlistItems.map((item) => (
              <article key={item.id} className="wishlist-card">
                <div className="wishlist-media-wrap">
                  <span className="wishlist-tag">{item.category || 'Saved Piece'}</span>
                  <img
                    src={item.image}
                    alt={item.name}
                    className="wishlist-image"
                  />
                  {!item.inStock && (
                    <div className="wishlist-stock-overlay">
                      <span className="wishlist-stock-text">Out of Stock</span>
                    </div>
                  )}
                </div>
                <div className="wishlist-content">
                  <h3 className="wishlist-product-name">{item.name}</h3>
                  <p className="wishlist-price">
                    {formatPrice(item.price)}
                  </p>
                  <div className="wishlist-actions">
                    <Button
                      variant="primary"
                      size="sm"
                      className="wishlist-add-btn"
                      disabled={!item.inStock}
                      onClick={() => handleAddToCart(item)}
                    >
                      Add to Cart
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="wishlist-remove-btn"
                      onClick={() => handleRemove(item.productId)}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default WishlistPage;
