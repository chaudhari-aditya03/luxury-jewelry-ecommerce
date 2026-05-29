import React, { useEffect, useMemo, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Row,
  Col,
  Typography,
  Button,
  Rate,
  Tag,
  Divider,
  InputNumber,
  Radio,
  Tabs,
  Spin,
  Breadcrumb,
  message,
  Alert,
  Empty,
} from 'antd';
import {
  ShoppingCartOutlined, HeartOutlined, CheckCircleOutlined,
  SafetyCertificateOutlined, CarOutlined
} from '@ant-design/icons';
import MainLayout from '../layouts/MainLayout';
import { productService, cartService, userService } from '../services';
import { getImageUrl } from '../utils/helpers';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/product/ProductCard';

const { Title, Text, Paragraph } = Typography;

const currencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

const normalizeCategory = (value) => String(value || '').trim().toLowerCase();

const mapProduct = (data) => {
  const images = (data.images || [])
    .map((image) => image.imageUrl)
    .filter(Boolean);
  const primaryImage = data.images?.find((image) => image.isPrimary)?.imageUrl || images[0];

  return {
    id: data.id,
    name: data.name,
    description: data.description,
    price: Number(data.discountPrice ?? data.price ?? 0),
    originalPrice: Number(data.price ?? 0),
    discountPrice: Number(data.discountPrice ?? 0),
    discountPercentage: Number(data.discountPercentage ?? 0),
    rating: Number(data.averageRating ?? 0),
    reviewCount: Number(data.reviewCount ?? data.totalReviews ?? 120),
    category: data.categoryName || data.category?.name || 'Jewelry',
    categoryKey: normalizeCategory(data.categoryName || data.category?.name || 'Jewelry'),
    mainImage: getImageUrl(primaryImage),
    images: images.length > 0 ? images.map((url) => getImageUrl(url)) : [getImageUrl(null)],
    variants: (data.variants || []).map((variant) => ({
      id: variant.id,
      name: variant.variantName,
    })),
    stock: Number(data.stockQuantity ?? 0),
    sku: data.sku,
  };
};

const productDetails = [
  {
    label: 'Lifetime Warranty',
    value: 'Included with every maison piece',
  },
  {
    label: 'Custom Sizing',
    value: 'Available on request',
  },
  {
    label: 'Material',
    value: 'Certified gold & stones',
  },
  {
    label: 'Secure Shipping',
    value: 'Complimentary insured delivery',
  },
];

const formatMoney = (value) => currencyFormatter.format(Number(value || 0));

const TrustBadge = ({ icon: Icon, title, description }) => (
  <div className="flex items-start gap-4 rounded-[1.4rem] border border-luxury/10 bg-white px-4 py-4 shadow-[0_12px_30px_rgba(17,17,17,0.04)]">
    <div className="mt-0.5 flex h-11 w-11 items-center justify-center rounded-full bg-background text-gold">
      <Icon className="h-5 w-5" />
    </div>
    <div>
      <p className="font-semibold text-luxury">{title}</p>
      <p className="mt-1 text-sm leading-6 text-muted">{description}</p>
    </div>
  </div>
);

const GalleryThumb = ({ image, index, isActive, onSelect, productName }) => (
  <button
    type="button"
    onClick={() => onSelect(index)}
    aria-label={`View ${productName} image ${index + 1}`}
    className={`group relative overflow-hidden rounded-2xl border bg-white transition-all duration-300 ${isActive ? 'border-gold shadow-[0_14px_28px_rgba(198,167,105,0.18)] ring-1 ring-gold/20' : 'border-[#eadfca] hover:border-gold/45'}`}
  >
    <div className="aspect-[3/4] overflow-hidden bg-[#f3ede2]">
      <img
        src={image}
        alt={`${productName} thumbnail ${index + 1}`}
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
    </div>
  </button>
);

const SectionCard = ({ title, children, eyebrow }) => (
  <div className="rounded-[2rem] border border-white/70 bg-white p-6 shadow-[0_18px_45px_rgba(17,17,17,0.06)] md:p-8">
    {eyebrow ? (
      <p className="text-xs uppercase tracking-[0.3em] text-gold">{eyebrow}</p>
    ) : null}
    <h3 className="mt-2 font-display text-2xl font-semibold text-luxury">{title}</h3>
    <div className="mt-5">{children}</div>
  </div>
);

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [relatedLoading, setRelatedLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [error, setError] = useState(null);

  const selectedImage = useMemo(() => {
    if (!product) {
      return getImageUrl(null);
    }
    return product.images[selectedImageIndex] || product.mainImage || getImageUrl(null);
  }, [product, selectedImageIndex]);

  useEffect(() => {
    let isMounted = true;
    const fetchProductAndRelated = async () => {
      setIsLoading(true);
      setError(null);
      setRelatedProducts([]);

      try {
        const response = await productService.getProductById(id);
        const data = response.data?.data;
        if (!isMounted) {
          return;
        }

        if (!data) {
          setProduct(null);
          return;
        }

        const mappedProduct = mapProduct(data);

        setProduct(mappedProduct);
        setSelectedVariant(mappedProduct.variants[0]?.id ?? null);
        setSelectedImageIndex(0);

        setRelatedLoading(true);
        try {
          const allProductsResponse = await productService.getAllProducts(0, 48);
          const content = allProductsResponse.data?.data?.content || allProductsResponse.data?.data || [];
          const related = content
            .map(mapProduct)
            .filter((item) => item.categoryKey === mappedProduct.categoryKey && item.id !== mappedProduct.id)
            .slice(0, 4);

          if (isMounted) {
            setRelatedProducts(related);
          }
        } catch (relatedError) {
          console.error('Failed to fetch related products:', relatedError);
          if (isMounted) {
            setRelatedProducts([]);
          }
        } finally {
          if (isMounted) {
            setRelatedLoading(false);
          }
        }
      } catch (error) {
        console.error('Failed to fetch product:', error);
        if (isMounted) {
          setError(error.response?.data?.message || 'We could not load this product right now.');
          setProduct(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchProductAndRelated();
    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) {
      return;
    }
    try {
      await cartService.addToCart(product.id, quantity, selectedVariant);
      message.success(`Added ${quantity} ${product.name} to cart`);
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to add to cart');
    }
  };

  const handleAddToWishlist = async () => {
    if (!product) {
      return;
    }

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      await userService.addToWishlist(product.id);
      message.success('Added to wishlist');
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to add to wishlist');
    }
  };

  const renderRatingText = () => {
    const reviews = product?.reviewCount ?? 0;
    if (!reviews) {
      return 'No reviews yet';
    }

    return `${reviews.toLocaleString('en-IN')} reviews`;
  };

  const savedAmount = Math.max(0, Number(product.originalPrice || 0) - Number(product.price || 0));
  const saleWindow = product.saleStartDate && product.saleEndDate
    ? `${new Date(product.saleStartDate).toLocaleDateString('en-IN')} to ${new Date(product.saleEndDate).toLocaleDateString('en-IN')}`
    : 'No scheduled sale';

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex min-h-[60vh] items-center justify-center rounded-[2rem] border border-white/70 bg-white shadow-[0_18px_45px_rgba(17,17,17,0.06)]">
          <div className="flex flex-col items-center gap-4 py-16 text-center">
            <Spin size="large" />
            <div>
              <p className="font-display text-2xl font-semibold text-luxury">Loading the maison edit</p>
              <p className="mt-2 text-sm text-muted">Preparing the product details, gallery, and related pieces.</p>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!product) {
    return (
      <MainLayout>
        <div className="mx-auto flex max-w-2xl items-center justify-center py-10">
          <div className="w-full rounded-[2rem] border border-white/70 bg-white p-8 text-center shadow-[0_20px_55px_rgba(17,17,17,0.08)] md:p-10">
            <p className="text-xs uppercase tracking-[0.35em] text-gold">Product unavailable</p>
            <Title level={3} className="!mb-3 !mt-4 !font-display !text-luxury">Product Not Found</Title>
            <p className="mx-auto max-w-lg text-sm leading-7 text-muted">
              {error || 'The product you are looking for may have been removed or is no longer available.'}
            </p>
            <div className="mt-8 flex justify-center">
              <Link to="/shop">
                <Button type="primary" size="large" className="!h-12 !rounded-full !border-0 !bg-luxury !px-8 !font-semibold !text-white hover:!bg-gold">
                  Go to Shop
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <section className="space-y-8">
        <Breadcrumb
          items={[
            { title: <Link to="/">Home</Link> },
            { title: <Link to="/shop">Shop</Link> },
            { title: product.name },
          ]}
          className="text-sm text-muted"
        />

        <div className="overflow-hidden rounded-[2.5rem] border border-white/70 bg-white shadow-[0_24px_65px_rgba(17,17,17,0.08)]">
          <div className="grid gap-0 lg:grid-cols-[1.04fr_0.96fr]">
            <div className="bg-[radial-gradient(circle_at_top_left,rgba(198,167,105,0.12),transparent_35%),linear-gradient(180deg,#fcfaf6_0%,#f8f5f0_100%)] p-4 sm:p-6 lg:p-8">
              <div className="space-y-4 lg:sticky lg:top-28">
                <div className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-white shadow-[0_18px_45px_rgba(17,17,17,0.08)]">
                  <div className="absolute left-4 top-4 z-10 flex flex-wrap gap-2">
                    <Tag color="gold" className="m-0 rounded-full border-0 bg-luxury px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-white">
                      {product.category}
                    </Tag>
                    {product.originalPrice > product.price ? (
                      <Tag color="red" className="m-0 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em]">
                        Sale
                      </Tag>
                    ) : null}
                  </div>

                  <div className="aspect-[3/4] overflow-hidden bg-[#f3ede2]">
                    <img
                      src={selectedImage}
                      alt={product.name}
                      className="h-full w-full object-cover transition-transform duration-700 hover:scale-[1.03]"
                    />
                  </div>
                </div>

                {product.images.length > 1 ? (
                  <>
                    <div className="hidden gap-3 xl:grid xl:grid-cols-4">
                      {product.images.map((image, index) => (
                        <GalleryThumb
                          key={`${image}-${index}`}
                          image={image}
                          index={index}
                          isActive={selectedImageIndex === index}
                          onSelect={setSelectedImageIndex}
                          productName={product.name}
                        />
                      ))}
                    </div>

                    <div className="grid grid-cols-4 gap-3 xl:hidden sm:grid-cols-5">
                      {product.images.map((image, index) => (
                        <GalleryThumb
                          key={`${image}-${index}`}
                          image={image}
                          index={index}
                          isActive={selectedImageIndex === index}
                          onSelect={setSelectedImageIndex}
                          productName={product.name}
                        />
                      ))}
                    </div>
                  </>
                ) : null}
              </div>
            </div>

            <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
              <div className="max-w-2xl">
                <div className="flex flex-wrap items-center gap-3">
                  <p className="text-xs uppercase tracking-[0.35em] text-gold">Luxury Maison</p>
                  <span className="h-1 w-1 rounded-full bg-gold/60" />
                  <p className="text-sm text-muted">Hand-finished jewelry edit</p>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <Tag color="gold" className="m-0 rounded-full border-0 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-white">
                    {product.category}
                  </Tag>
                  {product.isFeatured ? (
                    <Tag color="gold" className="m-0 rounded-full border-0 bg-[#fff4e0] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#977132]">
                      Featured
                    </Tag>
                  ) : null}
                  {product.stock > 0 ? (
                    <Tag color="green" className="m-0 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em]">
                      In stock
                    </Tag>
                  ) : (
                    <Tag color="red" className="m-0 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em]">
                      Out of stock
                    </Tag>
                  )}
                </div>

                <Title level={1} className="!mt-4 !font-display !text-4xl !font-semibold !leading-tight !text-luxury md:!text-5xl">
                  {product.name}
                </Title>

                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <Rate disabled allowHalf value={Number(product.rating || 0)} className="text-gold" />
                  <Text className="text-sm text-muted">{renderRatingText()}</Text>
                </div>

                <div className="mt-6 flex flex-wrap items-end gap-3">
                  {product.originalPrice > product.price ? (
                    <Text delete className="text-lg text-muted">
                      {currencyFormatter.format(product.originalPrice)}
                    </Text>
                  ) : null}
                  <Text className="font-display text-4xl font-semibold text-gold md:text-5xl">
                    {currencyFormatter.format(product.price)}
                  </Text>
                  {product.originalPrice > product.price ? (
                    <Tag color="gold" className="m-0 rounded-full border-0 bg-[#fff4e0] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#977132]">
                      Save {currencyFormatter.format(savedAmount)}
                    </Tag>
                  ) : null}
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-[1.4rem] border border-luxury/10 bg-background px-4 py-4">
                    <p className="text-xs uppercase tracking-[0.25em] text-gold">SKU</p>
                    <p className="mt-2 text-sm font-medium text-text/80">{product.sku || 'Pending'}</p>
                  </div>
                  <div className="rounded-[1.4rem] border border-luxury/10 bg-background px-4 py-4">
                    <p className="text-xs uppercase tracking-[0.25em] text-gold">Sale window</p>
                    <p className="mt-2 text-sm font-medium text-text/80">{saleWindow}</p>
                  </div>
                  <div className="rounded-[1.4rem] border border-luxury/10 bg-background px-4 py-4">
                    <p className="text-xs uppercase tracking-[0.25em] text-gold">Stock</p>
                    <p className="mt-2 text-sm font-medium text-text/80">{product.stock} pieces</p>
                  </div>
                </div>

                <Divider className="!my-8 !border-[#e8dcc4]" />

                <div className="space-y-5">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-gold">Description</p>
                    <Paragraph className="!mb-0 !mt-3 !text-[15px] !leading-8 !text-text/80">
                      {product.description || 'A refined maison piece designed to feel timeless, elegant, and effortlessly wearable.'}
                    </Paragraph>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-[1.4rem] border border-luxury/10 bg-background px-4 py-4">
                      <p className="text-xs uppercase tracking-[0.25em] text-gold">Price breakdown</p>
                      <div className="mt-3 space-y-2 text-sm text-text/80">
                        <div className="flex items-center justify-between gap-3">
                          <span>Original price</span>
                          <span>{formatMoney(product.originalPrice)}</span>
                        </div>
                        <div className="flex items-center justify-between gap-3">
                          <span>Current price</span>
                          <span>{formatMoney(product.price)}</span>
                        </div>
                        <div className="flex items-center justify-between gap-3 font-semibold text-gold">
                          <span>You save</span>
                          <span>{formatMoney(savedAmount)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-[1.4rem] border border-luxury/10 bg-background px-4 py-4">
                      <p className="text-xs uppercase tracking-[0.25em] text-gold">Product facts</p>
                      <div className="mt-3 space-y-2 text-sm text-text/80">
                        <div className="flex items-center justify-between gap-3">
                          <span>Rating</span>
                          <span>{Number(product.rating || 0).toFixed(1)} / 5</span>
                        </div>
                        <div className="flex items-center justify-between gap-3">
                          <span>Reviews</span>
                          <span>{Number(product.reviewCount || 0).toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex items-center justify-between gap-3">
                          <span>Status</span>
                          <span>{product.isActive === false ? 'Hidden' : 'Visible'}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {product.variants && product.variants.length > 0 ? (
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-gold">Metal color</p>
                      <Radio.Group
                        value={selectedVariant}
                        onChange={(event) => setSelectedVariant(event.target.value)}
                        className="mt-3 flex flex-wrap gap-3"
                      >
                        {product.variants.map((variant) => (
                          <Radio.Button
                            value={variant.id}
                            key={variant.id}
                            className="!mr-0 !h-11 !rounded-full !border !border-[#e8dcc4] !bg-white !px-5 !leading-[44px] !text-sm !font-medium !text-luxury hover:!border-gold hover:!text-gold"
                          >
                            {variant.name}
                          </Radio.Button>
                        ))}
                      </Radio.Group>
                    </div>
                  ) : null}

                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-gold">Quantity</p>
                    <div className="mt-3 flex flex-wrap items-center gap-4">
                      <InputNumber
                        min={1}
                        max={Math.max(product.stock, 1)}
                        value={quantity}
                        onChange={(value) => setQuantity(value ?? 1)}
                        disabled={product.stock === 0}
                        className="!h-12 !w-32 !rounded-full !border-[#e8dcc4] !bg-white !px-4 !py-2"
                        controls={false}
                      />
                      {product.stock > 0 && product.stock < 10 ? (
                        <Text className="text-sm text-[#9f6d22]">Only {product.stock} left in vault</Text>
                      ) : null}
                      {product.stock === 0 ? (
                        <Text className="text-sm text-red-500">Out of stock</Text>
                      ) : null}
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button
                      type="primary"
                      size="large"
                      icon={<ShoppingCartOutlined />}
                      onClick={handleAddToCart}
                      disabled={product.stock === 0}
                      className="!h-14 !w-full !rounded-full !border-0 !bg-luxury !px-7 !font-semibold !text-white shadow-[0_16px_32px_rgba(17,17,17,0.12)] transition-transform hover:!-translate-y-0.5 hover:!bg-gold sm:!flex-1"
                    >
                      Add to Cart
                    </Button>
                    <Button
                      size="large"
                      icon={<HeartOutlined />}
                      onClick={handleAddToWishlist}
                      aria-label="Add to wishlist"
                      className="!h-14 !w-full !rounded-full !border-[#e8dcc4] !bg-white !px-7 !font-semibold !text-luxury hover:!border-gold hover:!text-gold sm:!w-auto"
                    >
                      Wishlist
                    </Button>
                  </div>
                </div>

                <div className="mt-8 grid gap-3 sm:grid-cols-3">
                  <TrustBadge
                    icon={CheckCircleOutlined}
                    title="Verified Listing"
                    description="Product metadata, pricing, and availability are managed in the admin schema."
                  />
                  <TrustBadge
                    icon={SafetyCertificateOutlined}
                    title="Sales Window"
                    description="Price changes and sale dates are displayed directly from the backend."
                  />
                  <TrustBadge
                    icon={CarOutlined}
                    title="Review Insights"
                    description="Rating, review count, and featured status are surfaced for shoppers."
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_0.95fr]">
          <SectionCard title="Product Details" eyebrow="Editorial notes">
            {productDetails.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {productDetails.map((item) => (
                  <div key={item.label} className="rounded-[1.4rem] border border-luxury/10 bg-background px-4 py-4">
                    <p className="text-xs uppercase tracking-[0.25em] text-gold">{item.label}</p>
                    <p className="mt-2 text-sm leading-6 text-text/80">{item.value}</p>
                  </div>
                ))}
              </div>
            ) : (
              <Empty description="Product details will be added shortly." />
            )}

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.4rem] border border-luxury/10 bg-background px-4 py-4">
                <p className="text-xs uppercase tracking-[0.25em] text-gold">Availability</p>
                <p className="mt-2 text-sm leading-6 text-text/80">
                  {product.stock > 0 ? `Ready to ship with ${product.stock} pieces in stock.` : 'Currently out of stock.'}
                </p>
              </div>
              <div className="rounded-[1.4rem] border border-luxury/10 bg-background px-4 py-4">
                <p className="text-xs uppercase tracking-[0.25em] text-gold">Created</p>
                <p className="mt-2 text-sm leading-6 text-text/80">
                  {product.createdAt ? new Date(product.createdAt).toLocaleString('en-IN') : 'Not available'}
                </p>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Reviews" eyebrow="Social proof">
            <div className="rounded-[1.4rem] border border-luxury/10 bg-background p-5">
              <div className="flex flex-wrap items-center gap-3">
                <Rate disabled allowHalf value={Number(product.rating || 0)} className="text-gold" />
                <Text className="text-sm text-muted">{renderRatingText()}</Text>
              </div>
              <p className="mt-4 text-sm leading-7 text-text/80">
                Customer feedback will appear here once reviews are submitted. Until then, the piece has been prepared to feel polished and gift-ready.
              </p>
            </div>
            <div className="mt-5">
              <Alert
                type="info"
                showIcon
                message="Verified purchase reviews"
                description="This section is intentionally clean when the product has no live comments, so the page still feels elegant on first visit."
              />
            </div>
          </SectionCard>
        </div>

        <SectionCard title="Shipping & Returns" eyebrow="Concierge care">
          <div className="grid gap-4 lg:grid-cols-3">
            <div className="rounded-[1.4rem] border border-luxury/10 bg-background p-5">
              <p className="text-sm font-semibold text-luxury">Secure delivery</p>
              <p className="mt-2 text-sm leading-7 text-text/80">Complimentary insured shipping with premium handling and tracking updates.</p>
            </div>
            <div className="rounded-[1.4rem] border border-luxury/10 bg-background p-5">
              <p className="text-sm font-semibold text-luxury">Returns</p>
              <p className="mt-2 text-sm leading-7 text-text/80">Returns and exchanges follow the current store policy for eligible items.</p>
            </div>
            <div className="rounded-[1.4rem] border border-luxury/10 bg-background p-5">
              <p className="text-sm font-semibold text-luxury">Need help?</p>
              <p className="mt-2 text-sm leading-7 text-text/80">Our concierge team can assist with gifting, sizing, and special requests.</p>
            </div>
          </div>
        </SectionCard>

        <div className="rounded-[2rem] border border-white/70 bg-white p-6 shadow-[0_18px_45px_rgba(17,17,17,0.06)] md:p-8">
          <Tabs
            defaultActiveKey="1"
            items={[
              {
                label: 'Product Details',
                key: '1',
                children: (
                  <div className="grid gap-4 lg:grid-cols-2">
                    <div className="rounded-[1.4rem] border border-luxury/10 bg-background p-5">
                      <p className="text-xs uppercase tracking-[0.3em] text-gold">Overview</p>
                      <p className="mt-3 text-sm leading-7 text-text/80">
                        {product.description || 'Detailed product information will be available here.'}
                      </p>
                    </div>
                    <div className="rounded-[1.4rem] border border-luxury/10 bg-background p-5">
                      <p className="text-xs uppercase tracking-[0.3em] text-gold">Reference</p>
                      <div className="mt-3 space-y-2 text-sm text-text/80">
                        <p><span className="font-semibold text-luxury">SKU:</span> {product.sku || 'Not specified'}</p>
                        <p><span className="font-semibold text-luxury">Category:</span> {product.category}</p>
                        <p><span className="font-semibold text-luxury">Availability:</span> {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}</p>
                      </div>
                    </div>
                  </div>
                ),
              },
              {
                label: `Reviews (${product.reviewCount ?? 0})`,
                key: '2',
                children: (
                  <div className="rounded-[1.4rem] border border-luxury/10 bg-background p-6 text-center">
                    <Rate disabled allowHalf value={Number(product.rating || 0)} className="text-gold" />
                    <p className="mt-4 font-display text-2xl font-semibold text-luxury">Curated for a polished first impression</p>
                    <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-muted">
                      Customer reviews will display here once available. The layout stays refined even when the section is empty, so the page remains visually balanced.
                    </p>
                  </div>
                ),
              },
              {
                label: 'Shipping & Returns',
                key: '3',
                children: (
                  <div className="grid gap-4 lg:grid-cols-3">
                    <div className="rounded-[1.4rem] border border-luxury/10 bg-background p-5">
                      <p className="font-semibold text-luxury">Delivery</p>
                      <p className="mt-2 text-sm leading-7 text-text/80">Premium insured delivery with careful handling for every order.</p>
                    </div>
                    <div className="rounded-[1.4rem] border border-luxury/10 bg-background p-5">
                      <p className="font-semibold text-luxury">Returns</p>
                      <p className="mt-2 text-sm leading-7 text-text/80">Returns are available according to the store policy and item eligibility.</p>
                    </div>
                    <div className="rounded-[1.4rem] border border-luxury/10 bg-background p-5">
                      <p className="font-semibold text-luxury">Concierge support</p>
                      <p className="mt-2 text-sm leading-7 text-text/80">Contact us for sizing, gifting, and special order guidance.</p>
                    </div>
                  </div>
                ),
              },
            ]}
          />
        </div>

        <section className="space-y-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-gold">Curated selection</p>
              <h2 className="mt-2 font-display text-3xl font-semibold text-luxury">Related Products</h2>
            </div>
            <p className="max-w-2xl text-sm leading-7 text-muted">
              Pieces from the same category, selected to keep the editing consistent with your current choice.
            </p>
          </div>

          {relatedLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="overflow-hidden rounded-[1.7rem] border border-white/70 bg-white shadow-[0_16px_36px_rgba(17,17,17,0.08)]">
                  <div className="aspect-[3/4] animate-pulse bg-[#efe6d6]" />
                  <div className="space-y-3 px-5 py-5">
                    <div className="h-3 w-24 animate-pulse rounded-full bg-background" />
                    <div className="h-5 w-4/5 animate-pulse rounded-full bg-background" />
                    <div className="h-4 w-28 animate-pulse rounded-full bg-background" />
                  </div>
                </div>
              ))}
            </div>
          ) : relatedProducts.length > 0 ? (
            <Row gutter={[24, 24]}>
              {relatedProducts.map((relatedProduct) => (
                <Col xs={24} sm={12} lg={8} xl={6} key={relatedProduct.id}>
                  <ProductCard
                    product={{
                      ...relatedProduct,
                      image: relatedProduct.mainImage,
                    }}
                    onAddToCart={handleAddToCart}
                    onAddToWishlist={handleAddToWishlist}
                  />
                </Col>
              ))}
            </Row>
          ) : (
            <div className="rounded-[2rem] border border-white/70 bg-white p-8 text-center shadow-[0_18px_45px_rgba(17,17,17,0.06)]">
              <Empty description="No related products found in this category yet." />
            </div>
          )}
        </section>
      </section>
    </MainLayout>
  );
};

export default ProductDetailPage;
