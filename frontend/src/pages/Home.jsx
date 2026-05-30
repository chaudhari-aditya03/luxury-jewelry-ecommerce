import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  ChevronRight,
  Instagram,
  Leaf,
  Mail,
  Quote,
  Sparkles,
  Star,
  Truck,
  ShieldCheck,
  Heart,
  ShoppingBag,
} from 'lucide-react';
import { message } from 'antd';

import LuxuryNavbar from '../components/landing/LuxuryNavbar';
import LuxuryFooter from '../components/landing/LuxuryFooter';
import LuxuryProductCard from '../components/landing/LuxuryProductCard';
import SectionHeading from '../components/landing/SectionHeading';
import { cartService, productService, userService } from '../services';
import { getImageUrl } from '../utils/helpers';
import { useAuth } from '../context/AuthContext';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const luxuryHeroSlides = [
  {
    image: 'https://images.unsplash.com/photo-1617038220319-276d3cfab638?q=80&w=2070&auto=format&fit=crop',
    title: 'A modern maison for timeless adornment.',
    subtitle: 'Fine jewelry crafted with sculptural lines, luminous metals, and an editor’s eye for detail.',
    primaryCta: { label: 'Explore collection', href: '/shop' },
    secondaryCta: { label: 'View new arrivals', href: '#new-arrivals' },
  },
  {
    image: 'https://images.unsplash.com/photo-1617038220319-7c1b7d1d4f21?q=80&w=2070&auto=format&fit=crop',
    title: 'Luxury made intimate, personal, and effortless.',
    subtitle: 'Elevate everyday dressing with fine pieces that feel curated, not crowded.',
    primaryCta: { label: 'Shop best sellers', href: '#best-sellers' },
    secondaryCta: { label: 'Read our story', href: '#story' },
  },
];

const featuredCategories = [
  {
    title: 'Rings',
    description: 'Statement pieces, heirloom silhouettes, and signature bands.',
    href: '/shop?category=rings',
    // add ring image
    image: 'https://images.unsplash.com/photo-1550368566-f9cc32d7392d?q=80&w=1200&auto=format&fit=crop',
  },
  {
    title: 'Necklaces',
    description: 'Elegant layers, pendants, and refined chain work.',
    href: '/shop?category=necklaces',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1200&auto=format&fit=crop',
  },
  {
    title: 'Earrings',
    description: 'From minimal studs to luminous evening accents.',
    href: '/shop?category=earrings',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1200&auto=format&fit=crop',
  },
  {
    title: 'Bracelets',
    description: 'Polished wristwear for stackable styling.',
    href: '/shop?category=bracelets',
    image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=1200&auto=format&fit=crop',
  },
];

const testimonials = [
  {
    quote: 'The brand feels like a luxury editorial shoot translated into a shopping experience. Every detail is deliberate.',
    name: 'Aanya S.',
    role: 'Returning customer',
  },
  {
    quote: 'The product presentation is exceptional. It’s clean, premium, and makes the jewelry feel truly special.',
    name: 'Meera K.',
    role: 'Gift buyer',
  },
  {
    quote: 'Fast, polished, and easy to use on mobile. The bottom navigation and quick actions are exactly what I needed.',
    name: 'Rohan P.',
    role: 'Mobile shopper',
  },
];

const instagramShots = [
  'https://images.unsplash.com/photo-1543294001-f7cd5d7fb516?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1617038220319-6f8e0a6f7d84?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1617038220319-7dca5c9e4d2c?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1617038220319-2f0a8af1b3b6?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1617038220319-96ddc6d50d7a?q=80&w=1200&auto=format&fit=crop',
];

const trustBadges = [
  { icon: Truck, title: 'Complimentary delivery', description: 'On qualifying orders across India' },
  { icon: ShieldCheck, title: 'Secure checkout', description: 'Protected payments with premium support' },
  { icon: BadgeCheck, title: 'Certified quality', description: 'Crafted with hallmarked metals and stones' },
  { icon: Leaf, title: 'Mindful packaging', description: 'Luxury presentation with lower waste' },
];

const stats = [
  { value: '50K+', label: 'Happy customers' },
  { value: '4.9/5', label: 'Average rating' },
  { value: '100%', label: 'Certified materials' },
  { value: '24h', label: 'Concierge response' },
];

const featuredStoryPoints = [
  'Curated best sellers and newly launched hero pieces.',
  'Elegant product storytelling optimized for mobile discovery.',
  'Smooth add-to-cart and wishlist interactions throughout.',
];

const mapProduct = (product) => ({
  id: product.id,
  name: product.name,
  price: Number(product.discountPrice ?? product.price ?? 0),
  originalPrice: product.discountPrice && product.price && product.price > product.discountPrice ? Number(product.price) : Number(product.originalPrice ?? product.price ?? 0),
  rating: Number(product.averageRating ?? 4.9),
  reviewCount: Number(product.reviewCount ?? product.totalReviews ?? 120),
  category: product.categoryName || 'Jewelry',
  image: getImageUrl(product.images?.find((img) => img.isPrimary)?.imageUrl || product.images?.[0]?.imageUrl),
  hoverImage: getImageUrl(product.images?.[1]?.imageUrl || product.images?.[0]?.imageUrl),
  badge: product.isFeatured ? 'Featured' : product.isNew ? 'New arrival' : 'Limited',
});

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.08 } },
};

const SkeletonCard = () => (
  <div className="overflow-hidden rounded-[2rem] border border-white/70 bg-white shadow-[0_18px_45px_rgba(17,17,17,0.08)]">
    <div className="aspect-[4/5] animate-pulse bg-[#eee4d2]" />
    <div className="space-y-4 px-5 py-5 md:px-6 md:py-6">
      <div className="h-3 w-28 animate-pulse rounded-full bg-background" />
      <div className="h-6 w-4/5 animate-pulse rounded-full bg-background" />
      <div className="flex items-center justify-between">
        <div className="h-5 w-24 animate-pulse rounded-full bg-background" />
        <div className="h-8 w-20 animate-pulse rounded-full bg-background" />
      </div>
    </div>
  </div>
);

const HomePage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchLandingData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const [featuredResponse, allResponse] = await Promise.all([
          productService.getFeaturedProducts(8),
          productService.getAllProducts(0, 12),
        ]);

        const featuredData = featuredResponse.data?.data;
        const allData = allResponse.data?.data;

        const featuredItems = (featuredData?.content || featuredData || []).map(mapProduct);
        const newArrivalItems = (allData?.content || allData || []).map(mapProduct).slice(0, 8);

        if (!isMounted) {
          return;
        }

        setFeaturedProducts(featuredItems.length > 0 ? featuredItems : newArrivalItems.slice(0, 4));
        setNewArrivals(newArrivalItems.length > 0 ? newArrivalItems : featuredItems.slice(0, 8));
      } catch (err) {
        console.error('Failed to fetch landing products:', err);
        if (isMounted) {
          setError('We could not load live products right now. The rest of the experience remains available.');
          setFeaturedProducts([]);
          setNewArrivals([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchLandingData();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleAddToCart = async (productId) => {
    if (!isAuthenticated) {
      message.info('Please sign in to add items to your cart.');
      navigate('/login');
      return;
    }

    try {
      await cartService.addToCart(productId, 1, null);
      message.success('Added to cart');
    } catch (err) {
      message.error(err.response?.data?.message || 'Failed to add to cart');
    }
  };

  const handleAddToWishlist = async (productId) => {
    if (!isAuthenticated) {
      message.info('Please sign in to add items to your wishlist.');
      navigate('/login');
      return;
    }

    try {
      await userService.addToWishlist(productId);
      message.success('Added to wishlist');
    } catch (err) {
      message.error(err.response?.data?.message || 'Failed to add to wishlist');
    }
  };

  const handleViewProduct = (productId) => {
    navigate(`/product/${productId}`);
  };

  const onShopNow = (href) => {
    if (href.startsWith('#')) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      return;
    }
    navigate(href);
  };

  return (
    <div className="relative overflow-x-hidden bg-background text-text">
      <LuxuryNavbar />

      <main className="pt-20 md:pt-20">
        <section className="relative isolate overflow-hidden">
          <div className="absolute inset-0">
            <Swiper
              modules={[Autoplay, Pagination]}
              autoplay={{ delay: 6500, disableOnInteraction: false }}
              pagination={{ clickable: true }}
              loop
              className="h-full"
            >
              {luxuryHeroSlides.map((slide, index) => (
                <SwiperSlide key={index}>
                  <div
                    className="relative min-h-[calc(100vh-5rem)] bg-cover bg-center"
                    style={{ backgroundImage: `url(${slide.image})` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-luxury/90 via-luxury/65 to-luxury/20" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(198,167,105,0.22),transparent_25%),radial-gradient(circle_at_bottom_left,rgba(183,110,121,0.18),transparent_24%)]" />

                    <div className="relative mx-auto flex min-h-[calc(100vh-5rem)] max-w-7xl items-center px-4 py-20 sm:px-6 lg:px-8">
                      <div className="max-w-3xl text-white">
                        <motion.div
                          initial="hidden"
                          animate="visible"
                          variants={stagger}
                          className="space-y-6"
                        >
                          <motion.p variants={fadeUp} className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.35em] text-white/85 backdrop-blur-md">
                            <Sparkles className="h-3.5 w-3.5 text-gold" />
                            Luxury Jewelry Maison
                          </motion.p>

                          <motion.h1 variants={fadeUp} className="max-w-2xl font-display text-5xl leading-[1.03] font-semibold tracking-tight md:text-7xl">
                            {slide.title}
                          </motion.h1>

                          <motion.p variants={fadeUp} className="max-w-xl text-base leading-8 text-white/82 md:text-xl">
                            {slide.subtitle}
                          </motion.p>

                          <motion.div variants={fadeUp} className="flex flex-col gap-3 sm:flex-row">
                            <motion.button
                              whileHover={{ y: -2, scale: 1.01 }}
                              whileTap={{ scale: 0.98 }}
                              type="button"
                              onClick={() => onShopNow(slide.primaryCta.href)}
                              className="inline-flex items-center justify-center gap-2 rounded-full bg-gold px-7 py-4 text-sm font-semibold text-white shadow-[0_20px_50px_rgba(198,167,105,0.35)] transition-all"
                            >
                              {slide.primaryCta.label}
                              <ArrowRight className="h-4 w-4" />
                            </motion.button>

                            <motion.button
                              whileHover={{ y: -2, scale: 1.01 }}
                              whileTap={{ scale: 0.98 }}
                              type="button"
                              onClick={() => onShopNow(slide.secondaryCta.href)}
                              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-7 py-4 text-sm font-semibold text-white backdrop-blur-md transition-all hover:bg-white/15"
                            >
                              {slide.secondaryCta.label}
                              <ChevronRight className="h-4 w-4" />
                            </motion.button>
                          </motion.div>

                          <motion.div variants={fadeUp} className="grid grid-cols-2 gap-4 pt-4 sm:grid-cols-4">
                            {stats.map((stat) => (
                              <div key={stat.label} className="rounded-[1.5rem] border border-white/15 bg-white/10 p-4 backdrop-blur-md">
                                <p className="font-display text-2xl font-semibold text-white md:text-3xl">{stat.value}</p>
                                <p className="mt-2 text-xs uppercase tracking-[0.25em] text-white/65">{stat.label}</p>
                              </div>
                            ))}
                          </motion.div>
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </section>

        <section id="collections" className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Featured categories"
            title="Shop the signature edit"
            description="A refined category experience built for discovery, with rich imagery, airy spacing, and elegant hover states."
          />

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={stagger}
            className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4"
          >
            {featuredCategories.map((category) => (
              <motion.div key={category.title} variants={fadeUp} whileHover={{ y: -6 }} className="group overflow-hidden rounded-[2rem] border border-white/70 bg-white shadow-[0_18px_45px_rgba(17,17,17,0.08)]">
                <Link to={category.href} className="block no-underline">
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <img src={category.image} alt={category.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-luxury/85 via-luxury/25 to-transparent" />
                    <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                      <p className="text-[11px] uppercase tracking-[0.3em] text-white/70">Luxury category</p>
                      <h3 className="mt-2 font-display text-3xl font-semibold">{category.title}</h3>
                      <p className="mt-3 max-w-xs text-sm leading-6 text-white/80">{category.description}</p>
                      <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-gold transition-transform group-hover:translate-x-1">
                        Explore category
                        <ArrowUpRight className="h-4 w-4" />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </section>

        <section id="best-sellers" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Best-selling products"
            title="The pieces our customers keep returning for"
            description="This grid is optimized for high-converting product storytelling: quick actions, ratings, discount cues, and responsive hover interactions."
          />

          {isLoading ? (
            <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <SkeletonCard key={index} />
              ))}
            </div>
          ) : error ? (
            <div className="mt-10 rounded-[2rem] border border-gold/20 bg-white p-8 text-center shadow-[0_18px_45px_rgba(17,17,17,0.08)]">
              <p className="font-display text-2xl font-semibold text-luxury">Live products unavailable</p>
              <p className="mx-auto mt-3 max-w-xl text-sm text-muted">{error}</p>
            </div>
          ) : (
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={stagger} className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
              {featuredProducts.length > 0 ? featuredProducts.map((product) => (
                <LuxuryProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                  onAddToWishlist={handleAddToWishlist}
                  onViewProduct={handleViewProduct}
                />
              )) : Array.from({ length: 4 }).map((_, index) => <SkeletonCard key={index} />)}
            </motion.div>
          )}
        </section>

        <section id="new-arrivals" className="bg-white py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="New arrivals"
              title="Swipe through the latest statement pieces"
              description="A mobile-first carousel with large cards, smooth transitions, and premium motion cues."
              align="left"
            />

            <div className="mt-10">
              {isLoading ? (
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
                  {Array.from({ length: 4 }).map((_, index) => <SkeletonCard key={index} />)}
                </div>
              ) : (
                <Swiper
                  modules={[Navigation, Pagination, Autoplay]}
                  navigation
                  pagination={{ clickable: true }}
                  autoplay={{ delay: 4800, disableOnInteraction: false }}
                  spaceBetween={20}
                  breakpoints={{
                    0: { slidesPerView: 1.08 },
                    640: { slidesPerView: 1.6 },
                    1024: { slidesPerView: 2.4 },
                    1280: { slidesPerView: 3.1 },
                  }}
                  className="pb-14"
                >
                  {newArrivals.map((product) => (
                    <SwiperSlide key={product.id}>
                      <LuxuryProductCard
                        product={product}
                        onAddToCart={handleAddToCart}
                        onAddToWishlist={handleAddToWishlist}
                        onViewProduct={handleViewProduct}
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              )}
            </div>
          </div>
        </section>

        <section id="story" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.6 }}
              className="relative overflow-hidden rounded-[2.5rem] border border-white/70 bg-white p-4 shadow-[0_24px_65px_rgba(17,17,17,0.1)]"
            >
              <div className="relative overflow-hidden rounded-[2rem]">
                <img
                  src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1400&auto=format&fit=crop"
                  alt="Luxury jewelry atelier"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-luxury/55 via-transparent to-transparent" />
              </div>
              <div className="absolute left-8 top-8 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-white backdrop-blur-md">
                Since 2026
              </div>
              <div className="absolute bottom-8 left-8 right-8 rounded-[1.75rem] border border-white/15 bg-white/15 p-5 text-white backdrop-blur-md">
                <p className="text-sm uppercase tracking-[0.25em] text-white/70">Maison note</p>
                <p className="mt-2 font-display text-2xl font-semibold leading-snug">
                  Designed to feel editorial, intuitive, and unforgettable.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <SectionHeading
                eyebrow="Brand story"
                title="Luxury should feel personal, not performative"
                description="We built this experience to balance editorial storytelling with the speed and clarity modern shoppers expect."
                align="left"
              />

              <div className="space-y-4">
                {featuredStoryPoints.map((point) => (
                  <div key={point} className="flex items-start gap-4 rounded-[1.5rem] border border-white/70 bg-white p-4 shadow-[0_14px_30px_rgba(17,17,17,0.05)]">
                    <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-full bg-background text-gold">
                      <Sparkles className="h-4 w-4" />
                    </div>
                    <p className="text-base leading-7 text-text">{point}</p>
                  </div>
                ))}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Link to="/shop" className="inline-flex items-center justify-center gap-2 rounded-full bg-luxury px-6 py-4 text-sm font-semibold text-white no-underline shadow-lg transition-transform hover:-translate-y-0.5">
                  Discover the edit
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link to="/register" className="inline-flex items-center justify-center gap-2 rounded-full border border-luxury/10 bg-white px-6 py-4 text-sm font-semibold text-luxury no-underline transition-colors hover:border-gold hover:text-gold">
                  Create account
                  <Heart className="h-4 w-4" />
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="bg-luxury py-20 text-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="Customer stories"
              title="Loved by shoppers who care about the details"
              description="Social proof presented with premium spacing, restrained colors, and rich motion."
            />

            <div className="mt-10 grid gap-6 lg:grid-cols-3">
              {testimonials.map((testimonial, index) => (
                <motion.article
                  key={testimonial.name}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ delay: index * 0.08, duration: 0.45 }}
                  className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-md"
                >
                  <Quote className="h-8 w-8 text-gold" />
                  <p className="mt-4 text-base leading-7 text-white/82">“{testimonial.quote}”</p>
                  <div className="mt-8 flex items-center justify-between gap-4 border-t border-white/10 pt-5">
                    <div>
                      <p className="font-semibold text-white">{testimonial.name}</p>
                      <p className="text-sm text-white/60">{testimonial.role}</p>
                    </div>
                    <div className="flex items-center gap-1 text-gold">
                      {Array.from({ length: 5 }).map((_, starIndex) => (
                        <Star key={starIndex} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section id="journal" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Instagram gallery"
            title="A visual diary of shine, texture, and light"
            description="The gallery adds lifestyle depth without sacrificing speed. Images are intentionally oversized and editorial."
          />

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={stagger} className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {instagramShots.map((image, index) => (
              <motion.div key={index} variants={fadeUp} whileHover={{ y: -6 }} className="group relative overflow-hidden rounded-[1.8rem] bg-white shadow-[0_18px_45px_rgba(17,17,17,0.08)]">
                <img src={image} alt={`Instagram shot ${index + 1}`} className="aspect-[4/5] w-full object-cover transition duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-luxury/70 via-luxury/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <span className="rounded-full bg-white/15 px-3 py-1 text-xs uppercase tracking-[0.25em] backdrop-blur-md">Instagram</span>
                  <Instagram className="h-5 w-5" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        <section className="border-y border-gold/15 bg-white py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
              {trustBadges.map((badge) => {
                const Icon = badge.icon;
                return (
                  <div key={badge.title} className="flex items-start gap-4 rounded-[1.6rem] border border-luxury/10 bg-background p-5">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-gold shadow-sm">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-luxury">{badge.title}</p>
                      <p className="mt-1 text-sm leading-6 text-muted">{badge.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="rounded-[2.5rem] bg-[linear-gradient(135deg,#111111_0%,#1a1a1a_60%,#2a2010_100%)] px-6 py-10 text-white shadow-[0_30px_90px_rgba(17,17,17,0.2)] md:px-10 md:py-14">
            <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-gold">Newsletter</p>
                <h2 className="mt-4 font-display text-4xl font-semibold leading-tight md:text-5xl">
                  Join the inner circle for launches, styling notes, and private offers.
                </h2>
                <p className="mt-4 max-w-2xl text-base leading-7 text-white/70">
                  A refined newsletter section that is simple, elegant, and conversion-focused.
                </p>
              </div>

              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  message.success('Thanks for subscribing.');
                }}
                className="rounded-[2rem] border border-white/10 bg-white/10 p-4 backdrop-blur-xl"
              >
                <label className="sr-only" htmlFor="newsletter-email">Email address</label>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <div className="flex flex-1 items-center gap-3 rounded-full border border-white/10 bg-white/10 px-4 py-3">
                    <Mail className="h-5 w-5 text-gold" />
                    <input
                      id="newsletter-email"
                      type="email"
                      placeholder="Enter your email"
                      className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/45"
                    />
                  </div>
                  <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-full bg-gold px-6 py-4 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5">
                    Subscribe
                    <ArrowUpRight className="h-4 w-4" />
                  </button>
                </div>
                <p className="mt-3 text-xs text-white/45">We respect your inbox and only send thoughtful updates.</p>
              </form>
            </div>
          </div>
        </section>

        <LuxuryFooter />
      </main>

      <div className="fixed inset-x-4 bottom-4 z-40 mx-auto max-w-lg rounded-full border border-white/70 bg-white/85 p-2 shadow-[0_18px_45px_rgba(17,17,17,0.12)] backdrop-blur-xl md:hidden">
        <div className="grid grid-cols-4 gap-1 text-center text-[11px] font-medium text-muted">
          <Link to="/" className="flex flex-col items-center gap-1 rounded-full px-2 py-2 text-luxury no-underline">
            <Sparkles className="h-5 w-5" />
            Home
          </Link>
          <Link to="/shop" className="flex flex-col items-center gap-1 rounded-full px-2 py-2 no-underline hover:text-luxury">
            <ShoppingBag className="h-5 w-5" />
            Shop
          </Link>
          <Link to="/wishlist" className="flex flex-col items-center gap-1 rounded-full px-2 py-2 no-underline hover:text-luxury">
            <Heart className="h-5 w-5" />
            Wishlist
          </Link>
          <button type="button" onClick={() => navigate('/cart')} className="flex flex-col items-center gap-1 rounded-full px-2 py-2 hover:text-luxury">
            <ShoppingBag className="h-5 w-5" />
            Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

