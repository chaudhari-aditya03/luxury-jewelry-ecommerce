import React from 'react';
import { Link } from 'react-router-dom';
import { EnvelopeIcon, MapPinIcon, PhoneIcon } from '@heroicons/react/24/outline';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white mt-16">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-rose-gold-500 to-rose-gold-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">💎</span>
              </div>
              <span className="font-display text-lg font-bold">Jewelry Store</span>
            </div>
            <p className="text-gray-400 text-sm">Premium jewelry for every occasion.</p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-bold mb-4">Shop</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link to="/shop" className="hover:text-charcoal-600 transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <a href="#new" className="hover:text-charcoal-600 transition-colors">
                  New Arrivals
                </a>
              </li>
              <li>
                <a href="#sale" className="hover:text-charcoal-600 transition-colors">
                  Sale
                </a>
              </li>
              <li>
                <a href="#bestsellers" className="hover:text-charcoal-600 transition-colors">
                  Best Sellers
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-bold mb-4">Support</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a href="#contact" className="hover:text-charcoal-600 transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#shipping" className="hover:text-charcoal-600 transition-colors">
                  Shipping Info
                </a>
              </li>
              <li>
                <a href="#returns" className="hover:text-charcoal-600 transition-colors">
                  Returns & Exchanges
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-charcoal-600 transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold mb-4">Contact</h3>
            <div className="space-y-3 text-sm text-gray-400">
              <div className="flex items-start gap-2">
                <PhoneIcon className="w-5 h-5 text-gold-600 flex-shrink-0 mt-0.5" />
                <span>+91-1234-567-891</span>
              </div>
              <div className="flex items-start gap-2">
                <EnvelopeIcon className="w-5 h-5 text-gold-600 flex-shrink-0 mt-0.5" />
                <span>support@jewelrystore.com</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPinIcon className="w-5 h-5 text-gold-600 flex-shrink-0 mt-0.5" />
                <span>123 Jewelry Lane, Delhi, India</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-400">
            <p>&copy; {currentYear} Jewelry E-Commerce. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#privacy" className="hover:text-charcoal-600 transition-colors">
                Privacy Policy
              </a>
              <a href="#terms" className="hover:text-charcoal-600 transition-colors">
                Terms of Service
              </a>
              <a href="#cookies" className="hover:text-charcoal-600 transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
