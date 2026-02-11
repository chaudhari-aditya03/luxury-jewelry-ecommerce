import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { StarIcon, CheckIcon, TruckIcon } from '@heroicons/react/24/solid';
import { HeartIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';
import { MinusIcon, PlusIcon } from '@heroicons/react/24/outline';
import MainLayout from '../layouts/MainLayout';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';
import { formatPrice, calculateDiscount } from '../utils/helpers';
import { productService } from '../services';

const ProductDetailPage = () => {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        setError('');
        const response = await productService.getProductById(id);
        const data = response.data.data;
        setProduct(data);

        const defaultVariant = data.variants?.[0];
        setSelectedVariant(defaultVariant ? String(defaultVariant.id) : null);

        const primaryImage = data.images?.find((img) => img.isPrimary);
        setSelectedImage(primaryImage?.imageUrl || data.images?.[0]?.imageUrl || null);

        setQuantity(1);
      } catch (err) {
        console.error('Failed to fetch product:', err);
        setError('Unable to load product details. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Helper to parse BigDecimal/string to number
  const parsePrice = (value) => {
    if (value === null || value === undefined) return null;
    return typeof value === 'number' ? value : parseFloat(value);
  };

  const variants = product?.variants || [];
  const basePrice = parsePrice(product?.discountPrice) ?? parsePrice(product?.price) ?? 0;
  const originalPrice = product?.discountPrice ? parsePrice(product?.price) : null;
  const currentVariant = variants.find((v) => String(v.id) === String(selectedVariant));
  const variantPrice = currentVariant
    ? basePrice + parsePrice(currentVariant.additionalPrice ?? 0)
    : basePrice;
  const stockQty = currentVariant?.stockQuantity ?? product?.stockQuantity ?? 0;
  const discount = calculateDiscount(originalPrice, variantPrice);
  const images = product?.images?.length
    ? product.images.map((img) => img.imageUrl)
    : ['/placeholder.jpg'];
  const activeImage = selectedImage || images[0];

  return (
    <MainLayout>
      <div className="section">
        <div className="container-custom">
          {/* Breadcrumb */}
          <div className="flex gap-2 text-sm text-gray-600 dark:text-gray-400 mb-8">
            <Link to="/shop" className="hover:text-rose-gold-500">
              Shop
            </Link>
            <span>/</span>
            <span className="text-gray-900 dark:text-white">{product?.name || 'Product'}</span>
          </div>

          {isLoading && (
            <Alert type="info" message="Loading product details..." closeable={false} />
          )}

          {!isLoading && error && (
            <Alert type="error" message={error} closeable={false} />
          )}

          {!isLoading && !error && product && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">

              {/* Images */}
              <div className="space-y-4">
                <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                  <img
                    src={activeImage}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {images.map((img, idx) => (
                    <button
                      key={img + idx}
                      onClick={() => setSelectedImage(img)}
                      className={`aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden border-2 transition-colors ${
                        activeImage === img
                          ? 'border-rose-gold-500'
                          : 'border-transparent hover:border-rose-gold-500'
                      }`}
                    >
                      <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Details */}
              <div className="space-y-8">
                {/* Title & Rating */}
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                    {product.name}
                  </h1>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon
                          key={i}
                          className={`w-5 h-5 ${
                            i < Math.round(product.averageRating || 0)
                              ? 'text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-gray-600 dark:text-gray-400">
                      {product.averageRating || 0} ({product.reviewCount || 0} reviews)
                    </span>
                  </div>
                </div>

                {/* Price */}
                <div className="space-y-2">
                  <div className="flex items-center gap-4">
                    <span className="text-4xl font-bold text-rose-gold-500">
                      {formatPrice(variantPrice)}
                    </span>
                    {originalPrice && (
                      <span className="text-lg text-gray-500 line-through">
                        {formatPrice(originalPrice)}
                      </span>
                    )}
                    {discount > 0 && (
                      <span className="px-3 py-1 bg-rose-gold-50 dark:bg-rose-gold-900/20 text-rose-gold-600 rounded-full text-sm font-bold">
                        Save {discount}%
                      </span>
                    )}
                  </div>
                </div>

                {/* Stock Status */}
                {stockQty > 0 ? (
                  <Alert type="success" message={`Only ${stockQty} left in stock!`} closeable={false} />
                ) : (
                  <Alert type="error" message="Out of stock" closeable={false} />
                )}

                {/* Variants */}
                {variants.length > 0 && (
                  <div>
                    <label className="block font-bold mb-3">Choose Variant</label>
                    <div className="grid grid-cols-3 gap-3">
                      {variants.map((variant) => {
                        const variantDisplayPrice = basePrice + parsePrice(variant.additionalPrice ?? 0);
                        return (
                          <button
                            key={variant.id}
                            onClick={() => setSelectedVariant(String(variant.id))}
                            className={`py-3 px-4 rounded-lg font-medium transition-all ${
                              String(selectedVariant) === String(variant.id)
                                ? 'bg-rose-gold-500 text-white ring-2 ring-rose-gold-300'
                                : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                            }`}
                          >
                            <div>{variant.variantName}</div>
                            <div className="text-xs opacity-75 mt-1">
                              {formatPrice(variantDisplayPrice)}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Quantity */}
                <div>
                  <label className="block font-bold mb-3">Quantity</label>
                  <div className="flex items-center gap-4 w-fit bg-gray-100 dark:bg-gray-800 rounded-lg p-2">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                    >
                      <MinusIcon className="w-5 h-5" />
                    </button>
                    <span className="text-lg font-bold w-8 text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(stockQty || 1, quantity + 1))}
                      className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                    >
                      <PlusIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4">
                  <Button
                    variant="primary"
                    size="lg"
                    className="flex-1 flex items-center justify-center gap-2"
                    disabled={stockQty === 0}
                  >
                    <ShoppingCartIcon className="w-5 h-5" />
                    Add to Cart
                  </Button>
                  <Button variant="secondary" size="lg" className="w-16 flex items-center justify-center">
                    <HeartIcon className="w-6 h-6" />
                  </Button>
                </div>

                {/* Features */}
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 space-y-4">
                  <div className="flex items-start gap-3">
                    <TruckIcon className="w-6 h-6 text-rose-gold-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">Free Shipping</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Free shipping on orders above ₹5,000
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckIcon className="w-6 h-6 text-rose-gold-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">Quality Assurance</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Certified materials and craftsmanship
                      </p>
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-6 space-y-4">
                  <div>
                    <h3 className="font-bold mb-2">Description</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {product.description || 'No description available.'}
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">SKU:</span>
                      <span className="font-medium">{product.sku || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Category:</span>
                      <span className="font-medium">{product.categoryName || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Stock:</span>
                      <span className="font-medium">{stockQty}</span>
                    </div>
                  </div>
                </div>
            </div>
          </div>
            )}

          {!isLoading && !error && product && product.reviewCount > 0 && (
            <div className="mt-16 border-t border-gray-200 dark:border-gray-700 pt-12">
              <h2 className="text-3xl font-bold mb-4">Customer Reviews</h2>
              <p className="text-gray-600 dark:text-gray-400">
                {product.reviewCount} reviews available.
              </p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default ProductDetailPage;
