import React from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Button from '../components/common/Button';
import { formatPrice } from '../utils/helpers';

const WishlistPage = () => {
  // Dummy wishlist items
  const wishlistItems = [
    {
      id: 1,
      name: 'Diamond Ring',
      price: 45000,
      image: 'https://via.placeholder.com/200x200?text=Diamond+Ring',
      inStock: true,
    },
    {
      id: 2,
      name: 'Gold Necklace',
      price: 25000,
      image: 'https://via.placeholder.com/200x200?text=Gold+Necklace',
      inStock: true,
    },
    {
      id: 3,
      name: 'Pearl Earrings',
      price: 15000,
      image: 'https://via.placeholder.com/200x200?text=Pearl+Earrings',
      inStock: false,
    },
  ];

  if (wishlistItems.length === 0) {
    return (
      <MainLayout>
        <div className="section">
          <div className="container-custom text-center">
            <h1 className="text-4xl font-bold mb-4">Your Wishlist is Empty</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Add your favorite items to your wishlist
            </p>
            <Link to="/shop">
              <Button size="lg">Continue Shopping</Button>
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="section">
        <div className="container-custom">
          <h1 className="text-4xl font-bold mb-8">My Wishlist</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistItems.map((item) => (
              <div key={item.id} className="card overflow-hidden">
                <div className="relative aspect-square">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                  {!item.inStock && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="text-white font-bold">Out of Stock</span>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-lg mb-2">{item.name}</h3>
                  <p className="text-rose-gold-500 font-bold mb-4">
                    {formatPrice(item.price)}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="primary"
                      size="sm"
                      className="flex-1"
                      disabled={!item.inStock}
                    >
                      Add to Cart
                    </Button>
                    <Button variant="secondary" size="sm">
                      Remove
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default WishlistPage;
