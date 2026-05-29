import React from 'react';
import { Rate, Tag, message } from 'antd';
import { Heart, ShoppingBag, Eye, Trash2, Sparkles, Flame } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const formatCurrency = (value) => `₹${Number(value || 0).toLocaleString('en-IN')}`;

const ProductCard = ({
  product,
  onAddToCart,
  onAddToWishlist,
  onRemoveFromWishlist,
  onViewDetails,
  showWishlistButton = true,
  viewLabel = 'View',
  removeLabel = 'Remove from Wishlist',
  isRemovingFromWishlist = false,
}) => {
  const navigate = useNavigate();
  const {
    id = 1,
    name = 'Product Name',
    price = 0,
    originalPrice = 0,
    discountPercentage = 0,
    image = 'https://via.placeholder.com/300',
    rating = 4.5,
    reviewCount = 0,
    category = 'Jewelry',
    stockQuantity = 0,
    isFeatured = false,
    saleStartDate = null,
    saleEndDate = null,
  } = product || {};

  const resolvedOriginalPrice = Number(originalPrice || 0);
  const resolvedPrice = Number(price || 0);
  const resolvedDiscountPercentage = Number(
    discountPercentage || (
      resolvedOriginalPrice > resolvedPrice && resolvedOriginalPrice > 0
        ? Math.round(((resolvedOriginalPrice - resolvedPrice) / resolvedOriginalPrice) * 100)
        : 0
    ),
  );
  const isOnSale = resolvedDiscountPercentage > 0;
  const isLowStock = Number(stockQuantity || 0) > 0 && Number(stockQuantity || 0) <= 5;

  const saleWindowLabel = saleStartDate && saleEndDate
    ? `${new Date(saleStartDate).toLocaleDateString('en-IN')} - ${new Date(saleEndDate).toLocaleDateString('en-IN')}`
    : null;

  const handleAddToCart = (e) => {
    e.preventDefault(); // Prevent Link navigation
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart(id);
    } else {
      message.success('Added to cart');
    }
  };

  const handleAddToWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (onAddToWishlist) {
      onAddToWishlist(id);
    } else {
      message.success('Added to wishlist');
    }
  };

  const handleViewDetails = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (onViewDetails) {
      onViewDetails(id);
      return;
    }

    navigate(`/product/${id}`);
  };

  const handleRemoveFromWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (onRemoveFromWishlist) {
      onRemoveFromWishlist(id);
    }
  };

  return (
    <Link to={`/product/${id}`} className="group block h-full no-underline">
      <article className="flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-[#eadfca] bg-white shadow-[0_16px_36px_rgba(17,17,17,0.08)] transition-all duration-300 group-hover:-translate-y-1.5 group-hover:shadow-[0_26px_54px_rgba(17,17,17,0.14)]">
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#f3ede2]">
          <div className="absolute left-3 top-3 z-10 flex flex-wrap gap-2">
            {isOnSale ? (
              <span className="inline-flex items-center rounded-full bg-[#1f1f1f]/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-white shadow-lg backdrop-blur-sm">
                {resolvedDiscountPercentage}% Off
              </span>
            ) : null}
            {isFeatured ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-[#fff4e0] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#977132] shadow-sm">
                <Sparkles className="h-3.5 w-3.5" /> Featured
              </span>
            ) : null}
          </div>

          <img
            alt={name}
            src={image}
            loading="lazy"
            className="product-image h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {showWishlistButton ? (
            <button
              type="button"
              onClick={handleAddToWishlist}
              aria-label={`Add ${name} to wishlist`}
              className="absolute right-3 top-3 inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#e6d8bf] bg-white/95 text-[#1f1f1f] shadow-md transition-transform hover:scale-105"
            >
              <Heart className="h-4.5 w-4.5" />
            </button>
          ) : null}

          <div className="absolute inset-x-3 bottom-3 flex items-end justify-between gap-3">
            <div className="flex flex-col gap-2">
              <Tag color="gold" className="m-0 w-fit rounded-full border-[#e8d6b3] bg-[#fff7e8] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#977132]">
                {category}
              </Tag>
              {isLowStock ? (
                <span className="inline-flex w-fit items-center gap-1 rounded-full bg-[#fff5e5] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#a56b1c] shadow-sm">
                  <Flame className="h-3.5 w-3.5" /> Low stock
                </span>
              ) : null}
            </div>
            <button
              type="button"
              onClick={handleAddToCart}
              aria-label={`Quick add ${name} to cart`}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#1f1f1f] text-white shadow-lg transition-colors hover:bg-[#c6a769]"
            >
              <ShoppingBag className="h-4.5 w-4.5" />
            </button>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-3 px-5 py-5 sm:px-5 md:px-6">
          <h3 className="line-clamp-2 min-h-[3.25rem] font-display text-[clamp(1rem,1.2vw,1.2rem)] font-semibold leading-tight text-[#1f1f1f]">
            {name}
          </h3>

          <div className="flex items-center justify-between gap-3">
            <div className="flex flex-wrap items-end gap-2">
              {resolvedOriginalPrice > resolvedPrice ? (
                <p className="text-sm font-medium text-[#8b8b8b] line-through">{formatCurrency(resolvedOriginalPrice)}</p>
              ) : null}
              <p className="text-lg font-semibold text-[#c6a769]">{formatCurrency(resolvedPrice)}</p>
            </div>
            <div className="text-right">
              <Rate disabled allowHalf value={Number(rating || 0)} style={{ fontSize: 13 }} />
              <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-[#8f8f8f]">
                {Number(reviewCount || 0).toLocaleString('en-IN')} reviews
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-[#8f8f8f]">
            <span>{stockQuantity > 0 ? `${stockQuantity} in stock` : 'Sold out'}</span>
            {saleWindowLabel ? <span className="rounded-full bg-[#f8f2e5] px-2 py-1 text-[#977132]">{saleWindowLabel}</span> : null}
          </div>

          <div className="mt-auto space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleAddToCart}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#111111] px-3 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#c6a769]"
              >
                <ShoppingBag className="h-4 w-4" />
                Add to Cart
              </button>
              <button
                type="button"
                onClick={handleViewDetails}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#e6d8bf] bg-white px-3 py-2.5 text-sm font-semibold text-[#1f1f1f] transition-colors hover:border-[#c6a769] hover:text-[#c6a769]"
              >
                <Eye className="h-4 w-4" />
                {viewLabel}
              </button>
            </div>

            {onRemoveFromWishlist ? (
              <button
                type="button"
                onClick={handleRemoveFromWishlist}
                disabled={isRemovingFromWishlist}
                aria-label={`${removeLabel} for ${name}`}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#efc7c7] bg-[#fff8f8] px-3 py-2.5 text-sm font-semibold text-[#b84b4b] transition-colors hover:border-[#e39d9d] hover:bg-[#fff1f1] disabled:cursor-wait disabled:opacity-60"
              >
                <Trash2 className="h-4 w-4" />
                {isRemovingFromWishlist ? 'Removing...' : removeLabel}
              </button>
            ) : null}
          </div>
        </div>
      </article>
    </Link>
  );
};

export default ProductCard;
