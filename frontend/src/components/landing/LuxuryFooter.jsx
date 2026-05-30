import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, BadgeCheck, Sparkles, ShieldCheck, Truck } from 'lucide-react';

const LuxuryFooter = () => {
  return (
    <footer className="border-t border-luxury/10 bg-gradient-to-b from-white to-[#fcfaf6] pb-5 pt-8 sm:pb-8 sm:pt-12 lg:pb-10 lg:pt-14">
      <div className="mx-auto grid max-w-7xl gap-5 px-4 sm:px-6 lg:grid-cols-[1.3fr_0.7fr_0.7fr_0.9fr] lg:gap-8 lg:px-8">
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-luxury text-white">
              <Sparkles className="h-5 w-5 text-gold" />
            </div>
            <div>
              <p className="font-display text-xl font-semibold tracking-[0.14em] text-luxury">JEWELRY</p>
              <p className="text-[11px] uppercase tracking-[0.35em] text-muted">Luxury Maison</p>
            </div>
          </div>
          <p className="hidden max-w-md text-sm leading-7 text-muted sm:block">
            Premium jewelry shopping reimagined with editorial storytelling, modern navigation, and mobile-first polish.
          </p>

          <div className="hidden gap-3 sm:grid sm:grid-cols-3 lg:grid lg:grid-cols-1 xl:grid-cols-3">
            {[
              { icon: Truck, label: 'Free delivery' },
              { icon: ShieldCheck, label: 'Secure checkout' },
              { icon: BadgeCheck, label: 'Certified quality' },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <div key={item.label} className="flex items-center gap-3 rounded-[1.25rem] border border-[#eadfca] bg-[#fcfaf6] px-4 py-3">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-gold shadow-sm">
                    <Icon className="h-4.5 w-4.5" />
                  </span>
                  <span className="text-sm font-medium text-luxury">{item.label}</span>
                </div>
              );
            })}
          </div>

          <div className="grid gap-2 sm:hidden">
            {[
              'Free delivery',
              'Secure checkout',
              'Certified quality',
            ].map((label) => (
              <div key={label} className="flex items-center justify-between rounded-2xl border border-[#eadfca] bg-white px-4 py-3 text-sm font-medium text-luxury shadow-[0_10px_24px_rgba(17,17,17,0.04)]">
                <span>{label}</span>
                <BadgeCheck className="h-4 w-4 text-gold" />
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <details className="group rounded-[1.25rem] border border-[#eadfca] bg-white/80 px-4 py-3 shadow-[0_10px_24px_rgba(17,17,17,0.04)] lg:border-0 lg:bg-transparent lg:px-0 lg:py-0 lg:shadow-none" open>
            <summary className="flex cursor-pointer list-none items-center justify-between font-semibold text-luxury [&::-webkit-details-marker]:hidden lg:cursor-default lg:pointer-events-none">
              <span>Shop</span>
              <span className="transition-transform duration-200 group-open:rotate-180 lg:hidden">⌄</span>
            </summary>
            <ul className="mt-3 grid gap-3 text-sm text-muted lg:mt-4">
              <li><Link to="/shop" className="transition-colors hover:text-gold">All products</Link></li>
              <li><Link to="/shop?category=rings" className="transition-colors hover:text-gold">Rings</Link></li>
              <li><Link to="/shop?category=necklaces" className="transition-colors hover:text-gold">Necklaces</Link></li>
              <li><Link to="/shop?category=earrings" className="transition-colors hover:text-gold">Earrings</Link></li>
            </ul>
          </details>
        </div>

        <div className="space-y-3">
          <details className="group rounded-[1.25rem] border border-[#eadfca] bg-white/80 px-4 py-3 shadow-[0_10px_24px_rgba(17,17,17,0.04)] lg:border-0 lg:bg-transparent lg:px-0 lg:py-0 lg:shadow-none" open>
            <summary className="flex cursor-pointer list-none items-center justify-between font-semibold text-luxury [&::-webkit-details-marker]:hidden lg:cursor-default lg:pointer-events-none">
              <span>Explore</span>
              <span className="transition-transform duration-200 group-open:rotate-180 lg:hidden">⌄</span>
            </summary>
            <ul className="mt-3 grid gap-3 text-sm text-muted lg:mt-4">
              <li><Link to="/" className="transition-colors hover:text-gold">Home</Link></li>
              <li><Link to="/shop" className="transition-colors hover:text-gold">Best sellers</Link></li>
              <li><Link to="/wishlist" className="transition-colors hover:text-gold">Wishlist</Link></li>
              <li><Link to="/our-story" className="transition-colors hover:text-gold">Our story</Link></li>
              <li><Link to="/contact" className="transition-colors hover:text-gold">Contact</Link></li>
            </ul>
          </details>
        </div>

        <div className="space-y-3">
          <details className="group rounded-[1.25rem] border border-[#eadfca] bg-white/80 px-4 py-3 shadow-[0_10px_24px_rgba(17,17,17,0.04)] lg:border-0 lg:bg-transparent lg:px-0 lg:py-0 lg:shadow-none" open>
            <summary className="flex cursor-pointer list-none items-center justify-between font-semibold text-luxury [&::-webkit-details-marker]:hidden lg:cursor-default lg:pointer-events-none">
              <span>Contact</span>
              <span className="transition-transform duration-200 group-open:rotate-180 lg:hidden">⌄</span>
            </summary>
            <p className="mt-3 text-sm leading-6 text-muted lg:mt-4 lg:leading-7">
              Concierge support for gifting, custom requests, and order guidance.
            </p>
            <a href="mailto:hello@jewelrystore.com" className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-luxury transition-colors hover:text-gold">
              hello@jewelrystore.com
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </details>
        </div>
      </div>

      <div className="mx-auto mt-6 flex max-w-7xl flex-col gap-2 border-t border-luxury/10 px-4 pt-4 text-xs text-muted sm:mt-8 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:text-sm lg:px-8">
        <p>© {new Date().getFullYear()} Jewelry Maison. All rights reserved.</p>
        <div className="flex flex-wrap gap-x-4 gap-y-2">
          <span>Premium UX</span>
          <span>Responsive design</span>
          <span>Accessible components</span>
        </div>
      </div>
    </footer>
  );
};

export default LuxuryFooter;