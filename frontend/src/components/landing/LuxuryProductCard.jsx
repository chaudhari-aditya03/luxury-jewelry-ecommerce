import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Star, BadgePercent, Sparkles } from 'lucide-react';

const currencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

const LuxuryProductCard = ({ product, onAddToCart, onAddToWishlist, onViewProduct }) => {
  const [isHovered, setIsHovered] = useState(false);

  const {
    id,
    name,
    price,
    originalPrice,
    rating = 4.9,
    reviewCount = 120,
    image,
    hoverImage,
    category = 'Jewelry',
    badge = 'New',
  } = product;

  const discount = useMemo(() => {
    if (!originalPrice || originalPrice <= price) {
      return 0;
    }
    return Math.round(((originalPrice - price) / originalPrice) * 100);
  }, [originalPrice, price]);

  const handleCardClick = (event) => {
    if (onViewProduct) {
      event.preventDefault();
      onViewProduct(id);
    }
  };

  const handleWishlistClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    onAddToWishlist?.(id);
  };

  const handleCartClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    onAddToCart?.(id);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      whileHover={{ y: -6 }}
      className="group h-full"
    >
      <Link
        to={`/product/${id}`}
        onClick={handleCardClick}
        className="block h-full rounded-[2rem] overflow-hidden border border-white/70 bg-white shadow-[0_18px_45px_rgba(17,17,17,0.08)] hover:shadow-[0_24px_60px_rgba(17,17,17,0.12)] transition-shadow duration-300 no-underline"
      >
        <div
          className="relative aspect-[4/5] overflow-hidden bg-[#f3ede2]"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <img
            src={image}
            alt={name}
            loading="lazy"
            className={`absolute inset-0 h-full w-full object-cover transition-all duration-700 ${isHovered && hoverImage ? 'scale-110 opacity-0' : 'scale-100 opacity-100'}`}
          />
          {hoverImage ? (
            <img
              src={hoverImage}
              alt={name}
              loading="lazy"
              className={`absolute inset-0 h-full w-full object-cover transition-all duration-700 ${isHovered ? 'scale-110 opacity-100' : 'scale-105 opacity-0'}`}
            />
          ) : null}

          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />

          <div className="absolute left-4 top-4 flex flex-col gap-2">
            {discount > 0 ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-luxury px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-white shadow-lg">
                <BadgePercent className="h-3.5 w-3.5" />
                {discount}% off
              </span>
            ) : null}
            <span className="inline-flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-luxury backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-gold" />
              {badge}
            </span>
          </div>

          <button
            type="button"
            onClick={handleWishlistClick}
            className="absolute right-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-luxury shadow-lg backdrop-blur-md transition-transform duration-300 hover:scale-105"
            aria-label={`Add ${name} to wishlist`}
          >
            <Heart className="h-5 w-5" />
          </button>

          <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-3 text-white">
            <div>
              <p className="text-[11px] uppercase tracking-[0.3em] text-white/70">{category}</p>
              <h3 className="mt-1 font-display text-xl font-semibold leading-tight drop-shadow-sm">
                {name}
              </h3>
            </div>

            <motion.button
              type="button"
              onClick={handleCartClick}
              whileTap={{ scale: 0.96 }}
              className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white text-luxury shadow-xl transition-colors hover:bg-gold hover:text-white"
              aria-label={`Quick add ${name} to cart`}
            >
              <ShoppingBag className="h-5 w-5" />
            </motion.button>
          </div>
        </div>

        <div className="space-y-4 px-5 py-5 md:px-6 md:py-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] uppercase tracking-[0.25em] text-muted">Best seller</p>
              <div className="mt-2 flex items-baseline gap-3">
                <span className="text-lg font-semibold text-luxury md:text-xl">
                  {currencyFormatter.format(price)}
                </span>
                {originalPrice && originalPrice > price ? (
                  <span className="text-sm text-muted line-through">
                    {currencyFormatter.format(originalPrice)}
                  </span>
                ) : null}
              </div>
            </div>

            <div className="flex items-center gap-1 rounded-full bg-background px-3 py-1 text-xs font-medium text-text">
              <Star className="h-3.5 w-3.5 fill-gold text-gold" />
              {rating.toFixed(1)}
            </div>
          </div>

          <div className="flex items-center justify-between text-sm text-muted">
            <span>{reviewCount.toLocaleString('en-IN')} reviews</span>
            <motion.button
              type="button"
              whileHover={{ x: 4 }}
              className="inline-flex items-center gap-2 font-semibold text-luxury transition-colors hover:text-gold"
              onClick={handleCartClick}
            >
              Quick Add
              <ShoppingBag className="h-4 w-4" />
            </motion.button>
          </div>
        </div>
      </Link>
    </motion.article>
  );
};

export default LuxuryProductCard;