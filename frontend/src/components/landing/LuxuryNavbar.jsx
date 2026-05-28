import React, { Fragment, useEffect, useMemo, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { motion } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Heart, Menu, Search, ShoppingBag, Sparkles, X, User, ArrowRight, ChevronRight } from 'lucide-react';
import { cartService } from '../../services';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'Shop', href: '/shop' },
  { label: 'Our Story', href: '/our-story' },
  { label: 'Contact', href: '/contact' },
];

const mobileQuickLinks = [
  { label: 'Home', href: '/' },
  { label: 'Shop', href: '/shop' },
  { label: 'Wishlist', href: '/wishlist' },
  { label: 'Account', href: '/account' },
  { label: 'Cart', href: '/cart' },
  { label: 'Contact', href: '/contact' },
];

const LuxuryNavbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState({ items: [], totalItems: 0, totalPrice: 0 });
  const [isCartLoading, setIsCartLoading] = useState(false);

  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!isCartOpen || !isAuthenticated) {
      return;
    }

    let isMounted = true;
    const fetchCart = async () => {
      try {
        setIsCartLoading(true);
        const response = await cartService.getCart();
        const data = response.data?.data || { items: [], totalItems: 0, totalPrice: 0 };
        if (isMounted) {
          setCart({
            items: data.items || [],
            totalItems: data.totalItems ?? (data.items || []).length,
            totalPrice: Number(data.totalPrice ?? 0),
          });
        }
      } catch {
        if (isMounted) {
          setCart({ items: [], totalItems: 0, totalPrice: 0 });
        }
      } finally {
        if (isMounted) {
          setIsCartLoading(false);
        }
      }
    };

    fetchCart();
    return () => {
      isMounted = false;
    };
  }, [isCartOpen, isAuthenticated]);

  const totalItems = cart.totalItems || 0;
  const activeSection = useMemo(() => location.pathname, [location.pathname]);

  const handleSearch = (event) => {
    event.preventDefault();
    const query = searchQuery.trim();
    if (!query) {
      return;
    }
    setIsSearchOpen(false);
    setSearchQuery('');
    navigate(`/shop?search=${encodeURIComponent(query)}`);
  };

  const isActiveRoute = (href) => (href === '/' ? activeSection === '/' : activeSection.startsWith(href));

  const linkClass = (href) => {
    const isActive = isActiveRoute(href);
    return `relative inline-flex items-center gap-1.5 text-sm font-medium transition-colors ${isActive ? 'text-luxury' : 'text-text/80 hover:text-luxury'}`;
  };

  const handleCartClick = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setIsCartOpen(true);
  };

  return (
    <>
      <motion.header
        initial={false}
        animate={{
          y: 0,
          boxShadow: isScrolled ? '0 18px 48px rgba(17, 17, 17, 0.08)' : 'none',
        }}
        transition={{ duration: 0.25 }}
        className={`fixed inset-x-0 top-0 z-50 border-b transition-all duration-300 ${isScrolled ? 'border-white/80 bg-white/85 backdrop-blur-2xl' : 'border-transparent bg-white/55 backdrop-blur-xl'}`}
      >
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="group flex items-center gap-3 no-underline">
            <div className="flex h-11 w-11 items-center justify-center rounded-full border border-gold/20 bg-luxury text-sm font-semibold text-white shadow-[0_10px_30px_rgba(17,17,17,0.15)] transition-transform duration-300 group-hover:scale-105">
              <Sparkles className="h-5 w-5 text-gold" />
            </div>
            <div>
              <p className="font-display text-xl font-semibold tracking-[0.14em] text-luxury">JEWELRY</p>
              <p className="text-[11px] uppercase tracking-[0.45em] text-muted">Luxury Maison</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-8 lg:flex">
            {navItems.map((item) => (
              <Link key={item.label} to={item.href} className={linkClass(item.href)}>
                <span>{item.label}</span>
                <motion.span
                  className="absolute -bottom-2 left-0 h-px w-full origin-left bg-gold"
                  initial={false}
                  animate={{ scaleX: isActiveRoute(item.href) ? 1 : 0 }}
                  transition={{ duration: 0.25 }}
                />
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-luxury/10 bg-white/90 text-luxury shadow-sm transition-transform hover:scale-105"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>

            <Link
              to="/wishlist"
              className="hidden h-11 w-11 items-center justify-center rounded-full border border-luxury/10 bg-white/90 text-luxury shadow-sm transition-transform hover:scale-105 sm:inline-flex"
              aria-label="Wishlist"
            >
              <Heart className="h-5 w-5" />
            </Link>

            <button
              type="button"
              onClick={handleCartClick}
              className="relative inline-flex h-11 w-11 items-center justify-center rounded-full border border-luxury/10 bg-white/90 text-luxury shadow-sm transition-transform hover:scale-105"
              aria-label="Cart"
            >
              <ShoppingBag className="h-5 w-5" />
              {totalItems > 0 ? (
                <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-gold px-1 text-[10px] font-bold text-white">
                  {totalItems}
                </span>
              ) : null}
            </button>

            {isAuthenticated ? (
              <Link
                to="/account"
                className="hidden items-center gap-2 rounded-full border border-luxury/10 bg-white/90 px-3 py-2 text-sm font-medium text-luxury shadow-sm transition-transform hover:scale-[1.02] md:inline-flex"
              >
                <User className="h-4 w-4" />
                {user?.firstName || 'Account'}
              </Link>
            ) : (
              <Link
                to="/login"
                className="hidden rounded-full bg-luxury px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-luxury/10 transition-transform hover:-translate-y-0.5 md:inline-flex"
              >
                Sign in
              </Link>
            )}

            <button
              type="button"
              onClick={() => setIsMenuOpen(true)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-luxury/10 bg-white/90 text-luxury shadow-sm transition-transform hover:scale-105 lg:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </motion.header>

      <Transition.Root show={isSearchOpen} as={Fragment}>
        <Dialog as="div" className="relative z-[60]" onClose={setIsSearchOpen}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-luxury/55 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto px-4 py-8 sm:px-6 md:px-8">
            <div className="mx-auto flex min-h-full max-w-2xl items-start justify-center pt-8">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-200"
                enterFrom="opacity-0 translate-y-6 scale-95"
                enterTo="opacity-100 translate-y-0 scale-100"
                leave="ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0 scale-100"
                leaveTo="opacity-0 translate-y-6 scale-95"
              >
                <Dialog.Panel className="w-full overflow-hidden rounded-[2rem] border border-white/70 bg-white p-5 shadow-[0_30px_120px_rgba(17,17,17,0.2)] md:p-8">
                  <div className="mb-6 flex items-start justify-between gap-4">
                    <div>
                      <Dialog.Title className="font-display text-2xl font-semibold text-luxury">
                        Search the collection
                      </Dialog.Title>
                      <p className="mt-1 text-sm text-muted">
                        Find rings, necklaces, earrings, and curated gifts.
                      </p>
                    </div>
                    <button type="button" onClick={() => setIsSearchOpen(false)} className="rounded-full p-2 text-muted transition-colors hover:bg-background hover:text-luxury">
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <form onSubmit={handleSearch} className="space-y-4">
                    <div className="flex items-center gap-3 rounded-full border border-luxury/10 bg-background px-4 py-3">
                      <Search className="h-5 w-5 text-gold" />
                      <input
                        value={searchQuery}
                        onChange={(event) => setSearchQuery(event.target.value)}
                        placeholder="Search diamonds, gold, gifts..."
                        className="w-full bg-transparent text-base outline-none placeholder:text-muted"
                      />
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {['Rings', 'Necklaces', 'Earrings', 'Bracelets'].map((item) => (
                        <button
                          key={item}
                          type="button"
                          onClick={() => {
                            setIsSearchOpen(false);
                            navigate(`/shop?search=${encodeURIComponent(item)}`);
                          }}
                          className="rounded-full border border-luxury/10 bg-white px-4 py-2 text-sm font-medium text-luxury transition-colors hover:border-gold hover:text-gold"
                        >
                          {item}
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <p className="text-sm text-muted">Try searching for a gift, occasion, or collection.</p>
                      <button type="submit" className="inline-flex items-center gap-2 rounded-full bg-luxury px-5 py-3 text-sm font-semibold text-white">
                        Search
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>

      <Transition.Root show={isMenuOpen} as={Fragment}>
        <Dialog as="div" className="relative z-[60] lg:hidden" onClose={setIsMenuOpen}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-luxury/55 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-stretch justify-end">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-200"
                enterFrom="opacity-0 translate-x-full"
                enterTo="opacity-100 translate-x-0"
                leave="ease-in duration-150"
                leaveFrom="opacity-100 translate-x-0"
                leaveTo="opacity-0 translate-x-full"
              >
                <Dialog.Panel className="flex w-full max-w-sm flex-col bg-white px-5 py-6 shadow-[0_30px_120px_rgba(17,17,17,0.25)]">
                  <div className="mb-6 flex items-center justify-between">
                    <div>
                      <p className="font-display text-lg font-semibold text-luxury">Menu</p>
                      <p className="text-xs uppercase tracking-[0.3em] text-muted">Maison navigation</p>
                    </div>
                    <button type="button" onClick={() => setIsMenuOpen(false)} className="rounded-full p-2 text-muted hover:bg-background hover:text-luxury">
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="space-y-2">
                    {navItems.map((item) => (
                      <Link
                        key={item.label}
                        to={item.href}
                        onClick={() => setIsMenuOpen(false)}
                        className={`flex items-center justify-between rounded-2xl border px-4 py-4 text-base font-medium no-underline transition-colors ${isActiveRoute(item.href) ? 'border-gold/50 bg-background text-gold' : 'border-luxury/10 text-luxury hover:border-gold/40 hover:bg-background'}`}
                      >
                        {item.label}
                        <ChevronRight className="h-4 w-4 text-muted" />
                      </Link>
                    ))}
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-3">
                    {mobileQuickLinks.map((item) => (
                      <Link
                        key={item.label}
                        to={item.href}
                        onClick={() => setIsMenuOpen(false)}
                        className={`rounded-2xl px-4 py-4 text-sm font-medium no-underline ${isActiveRoute(item.href) ? 'bg-background text-gold' : 'bg-background text-luxury'}`}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>

                  <div className="mt-8 rounded-[1.75rem] bg-luxury px-5 py-6 text-white">
                    <p className="text-xs uppercase tracking-[0.3em] text-white/60">Luxury concierge</p>
                    <p className="mt-2 font-display text-2xl leading-tight">
                      Curated pieces for moments that matter.
                    </p>
                    <Link to="/shop" onClick={() => setIsMenuOpen(false)} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-gold no-underline">
                      Shop collection
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>

      <Transition.Root show={isCartOpen} as={Fragment}>
        <Dialog as="div" className="relative z-[60]" onClose={setIsCartOpen}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-luxury/55 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-stretch justify-end">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-200"
                enterFrom="opacity-0 translate-x-full"
                enterTo="opacity-100 translate-x-0"
                leave="ease-in duration-150"
                leaveFrom="opacity-100 translate-x-0"
                leaveTo="opacity-0 translate-x-full"
              >
                <Dialog.Panel className="flex w-full max-w-md flex-col bg-white px-5 py-6 shadow-[0_30px_120px_rgba(17,17,17,0.25)]">
                  <div className="flex items-center justify-between">
                    <div>
                      <Dialog.Title className="font-display text-2xl font-semibold text-luxury">
                        Your Cart
                      </Dialog.Title>
                      <p className="text-sm text-muted">
                        {totalItems} item{totalItems === 1 ? '' : 's'} selected
                      </p>
                    </div>
                    <button type="button" onClick={() => setIsCartOpen(false)} className="rounded-full p-2 text-muted hover:bg-background hover:text-luxury">
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  {!isAuthenticated ? (
                    <div className="mt-8 rounded-[1.75rem] border border-dashed border-gold/30 bg-background p-6 text-center">
                      <p className="font-semibold text-luxury">Sign in to view your cart</p>
                      <p className="mt-2 text-sm text-muted">Your saved items and checkout summary will appear here.</p>
                      <Link to="/login" onClick={() => setIsCartOpen(false)} className="mt-5 inline-flex items-center gap-2 rounded-full bg-luxury px-5 py-3 text-sm font-semibold text-white no-underline">
                        Sign in
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  ) : isCartLoading ? (
                    <div className="mt-8 space-y-4">
                      {Array.from({ length: 3 }).map((_, index) => (
                        <div key={index} className="h-24 animate-pulse rounded-[1.5rem] bg-background" />
                      ))}
                    </div>
                  ) : cart.items.length === 0 ? (
                    <div className="mt-8 rounded-[1.75rem] border border-dashed border-luxury/15 bg-background p-6 text-center">
                      <p className="font-semibold text-luxury">Your cart is empty</p>
                      <p className="mt-2 text-sm text-muted">Add a signature piece to begin your edit.</p>
                      <Link to="/shop" onClick={() => setIsCartOpen(false)} className="mt-5 inline-flex items-center gap-2 rounded-full bg-luxury px-5 py-3 text-sm font-semibold text-white no-underline">
                        Explore collection
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  ) : (
                    <div className="mt-6 flex-1 space-y-4 overflow-y-auto pr-1">
                      {cart.items.slice(0, 4).map((item) => (
                        <div key={item.productId || item.id} className="flex gap-4 rounded-[1.5rem] border border-luxury/10 p-4">
                          <div className="h-20 w-20 overflow-hidden rounded-2xl bg-background">
                            <img
                              src={item.imageUrl || item.productImage || 'https://images.unsplash.com/photo-1617038220319-276d3cfab638?q=80&w=1200&auto=format&fit=crop'}
                              alt={item.productName}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate font-medium text-luxury">{item.productName}</p>
                            <p className="mt-1 text-sm text-muted">Qty {item.quantity}</p>
                            <p className="mt-3 text-sm font-semibold text-gold">
                              ₹{Number(item.subtotal ?? 0).toLocaleString('en-IN')}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="mt-6 rounded-[1.75rem] bg-luxury p-5 text-white">
                    <div className="flex items-center justify-between text-sm text-white/70">
                      <span>Estimated total</span>
                      <span>Shipping calculated at checkout</span>
                    </div>
                    <div className="mt-2 flex items-end justify-between gap-4">
                      <p className="font-display text-3xl font-semibold text-white">
                        ₹{Number(cart.totalPrice ?? 0).toLocaleString('en-IN')}
                      </p>
                      <Link to="/cart" onClick={() => setIsCartOpen(false)} className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-3 text-sm font-semibold text-white no-underline">
                        View cart
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
};

export default LuxuryNavbar;