import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { HeartIcon, ShoppingCartIcon, StarIcon } from '@heroicons/react/24/solid';
import { formatPrice, calculateDiscount } from '../../utils/helpers';

const ProductCard = ({ product, onAddToCart, onAddToWishlist }) => {
  const [isWishlisted, setIsWishlisted] = useState(product.isWishlisted || false);
  
  // Handle BigDecimal/string conversion to number
  const parsePrice = (value) => {
    if (value === null || value === undefined) return null;
    return typeof value === 'number' ? value : parseFloat(value);
  };
  
  const displayPrice = parsePrice(product.discountPrice) ?? parsePrice(product.price) ?? 0;
  const originalPrice = product.discountPrice ? parsePrice(product.price) : parsePrice(product.originalPrice);
  const stockQty = product.stockQuantity ?? product.stock ?? 0;
  const categoryLabel = product.categoryName ?? product.category ?? 'Uncategorized';
  const rating = product.averageRating ?? product.rating;
  const reviewCount = product.reviewCount ?? product.reviews ?? 0;
  const imageUrl =
    product.images?.find((img) => img.isPrimary)?.imageUrl ||
    product.images?.[0]?.imageUrl ||
    product.image ||
    '/placeholder.jpg';
  const discount = calculateDiscount(originalPrice, displayPrice);

  // Debug logging (remove in production)
  React.useEffect(() => {
    console.log('ProductCard received:', {
      id: product.id,
      name: product.name,
      price: product.price,
      discountPrice: product.discountPrice,
      displayPrice,
      images: product.images,
      imageUrl
    });
  }, [product]);

  const handleWishlist = (e) => {
    e.preventDefault();
    setIsWishlisted(!isWishlisted);
    onAddToWishlist?.(product.id);
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    onAddToCart?.(product.id);
  };

  return (
    <Link to={`/product/${product.id}`}>
      <div className="card overflow-hidden hover:shadow-premium transition-all duration-300 group">
        {/* Image Container */}
        <div className="relative overflow-hidden bg-gray-100 dark:bg-gray-700 aspect-square">
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />

          {/* Discount Badge */}
          {discount > 0 && (
            <div className="absolute top-3 right-3 bg-rose-gold-500 text-white px-3 py-1 rounded-full text-sm font-bold">
              -{discount}%
            </div>
          )}

          {/* Stock Badge */}
          {stockQty === 0 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white font-bold text-lg">Out of Stock</span>
            </div>
          )}

          {/* Wishlist Button */}
          <button
            onClick={handleWishlist}
            className="absolute top-3 left-3 p-2 bg-white dark:bg-gray-800 rounded-full shadow-soft hover:shadow-gentle transition-all text-rose-gold-500"
          >
            <HeartIcon
              className={`w-5 h-5 transition-colors ${
                isWishlisted ? 'fill-red-600 text-red-600' : 'text-gray-400'
              }`}
            />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Category */}
          <p className="text-xs text-rose-gold-500 font-semibold uppercase mb-1">{categoryLabel}</p>

          {/* Name */}
          <h3 className="font-display text-lg font-bold text-charcoal-600 dark:text-white mb-2 line-clamp-2">
            {product.name}
          </h3>

          {/* Rating */}
          {rating && (
            <div className="flex items-center gap-1 mb-3">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <StarIcon
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.round(rating)
                        ? 'text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-500">({reviewCount})</span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center gap-2 mb-4">
            <span className="font-display text-xl font-bold text-rose-gold-500">
              {formatPrice(displayPrice ?? 0)}
            </span>
            {originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(originalPrice)}
              </span>
            )}
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={stockQty === 0}
            className="w-full py-2 px-4 bg-rose-gold-500 text-white rounded-lg hover:bg-rose-gold-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 font-medium"
          >
            <ShoppingCartIcon className="w-4 h-4" />
            Add to Cart
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
