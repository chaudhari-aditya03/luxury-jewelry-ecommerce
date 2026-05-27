import React from 'react';
import { Rate, Tag, message } from 'antd';
import { Heart, ShoppingBag, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product, onAddToCart, onAddToWishlist }) => {
  const {
    id = 1,
    name = 'Product Name',
    price = 0,
    image = 'https://via.placeholder.com/300',
    rating = 4.5,
    category = 'Jewelry'
  } = product || {};

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

  return (
    <Link to={`/product/${id}`} className="group block h-full no-underline">
      <article className="flex h-full flex-col overflow-hidden rounded-[1.7rem] border border-[#eadfca] bg-white shadow-[0_16px_36px_rgba(17,17,17,0.08)] transition-all duration-300 group-hover:-translate-y-1.5 group-hover:shadow-[0_26px_54px_rgba(17,17,17,0.14)]">
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#f3ede2]">
          <img
            alt={name}
            src={image}
            className="product-image h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          <button
            type="button"
            onClick={handleAddToWishlist}
            aria-label={`Add ${name} to wishlist`}
            className="absolute right-3 top-3 inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#e6d8bf] bg-white/95 text-[#1f1f1f] shadow-md transition-transform hover:scale-105"
          >
            <Heart className="h-4.5 w-4.5" />
          </button>

          <div className="absolute inset-x-3 bottom-3 flex items-center justify-between gap-3">
            <Tag color="gold" className="m-0 rounded-full border-[#e8d6b3] bg-[#fff7e8] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#977132]">
              {category}
            </Tag>
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

        <div className="flex flex-1 flex-col gap-3 px-5 py-5">
          <h3 className="line-clamp-2 min-h-[3.25rem] font-display text-xl font-semibold leading-tight text-[#1f1f1f]">
            {name}
          </h3>

          <div className="flex items-center justify-between gap-3">
            <p className="text-lg font-semibold text-[#c6a769]">₹{price.toLocaleString('en-IN')}</p>
            <Rate disabled allowHalf defaultValue={Number(rating || 0)} style={{ fontSize: 13 }} />
          </div>

          <div className="mt-auto grid grid-cols-2 gap-2">
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
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
              }}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#e6d8bf] bg-white px-3 py-2.5 text-sm font-semibold text-[#1f1f1f] transition-colors hover:border-[#c6a769] hover:text-[#c6a769]"
            >
              <Eye className="h-4 w-4" />
              View
            </button>
          </div>
        </div>
      </article>
    </Link>
  );
};

export default ProductCard;
