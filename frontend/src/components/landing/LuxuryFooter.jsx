import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Sparkles } from 'lucide-react';

const LuxuryFooter = () => {
  return (
    <footer className="border-t border-luxury/10 bg-white pb-10 pt-16">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.2fr_0.8fr_0.8fr_1fr] lg:px-8">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-luxury text-white">
              <Sparkles className="h-5 w-5 text-gold" />
            </div>
            <div>
              <p className="font-display text-xl font-semibold tracking-[0.14em] text-luxury">JEWELRY</p>
              <p className="text-[11px] uppercase tracking-[0.35em] text-muted">Luxury Maison</p>
            </div>
          </div>
          <p className="mt-5 max-w-md text-sm leading-7 text-muted">
            Premium jewelry shopping reimagined with editorial storytelling, modern navigation, and mobile-first polish.
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-luxury">Shop</h3>
          <ul className="mt-4 space-y-3 text-sm text-muted">
            <li><Link to="/shop" className="transition-colors hover:text-gold">All products</Link></li>
            <li><Link to="/shop?category=rings" className="transition-colors hover:text-gold">Rings</Link></li>
            <li><Link to="/shop?category=necklaces" className="transition-colors hover:text-gold">Necklaces</Link></li>
            <li><Link to="/shop?category=earrings" className="transition-colors hover:text-gold">Earrings</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-luxury">Explore</h3>
          <ul className="mt-4 space-y-3 text-sm text-muted">
            <li><Link to="/" className="transition-colors hover:text-gold">Home</Link></li>
            <li><Link to="/shop" className="transition-colors hover:text-gold">Best sellers</Link></li>
            <li><Link to="/wishlist" className="transition-colors hover:text-gold">Wishlist</Link></li>
            <li><Link to="/account" className="transition-colors hover:text-gold">My account</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-luxury">Contact</h3>
          <p className="mt-4 text-sm leading-7 text-muted">
            Concierge support for gifting, custom requests, and order guidance.
          </p>
          <a href="mailto:hello@jewelrystore.com" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-luxury transition-colors hover:text-gold">
            hello@jewelrystore.com
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
      </div>

      <div className="mx-auto mt-12 flex max-w-7xl flex-col gap-4 border-t border-luxury/10 px-4 pt-6 text-sm text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <p>© {new Date().getFullYear()} Jewelry Maison. All rights reserved.</p>
        <div className="flex flex-wrap gap-4">
          <span>Premium UX</span>
          <span>Responsive design</span>
          <span>Accessible components</span>
        </div>
      </div>
    </footer>
  );
};

export default LuxuryFooter;