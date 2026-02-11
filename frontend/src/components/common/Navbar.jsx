import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bars3Icon, XMarkIcon, ShoppingCartIcon, HeartIcon, UserIcon, MoonIcon, SunIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useMobile } from '../../hooks';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const isMobile = useMobile();

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-40 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-soft">
      <div className="container-custom py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-rose-gold-500 to-rose-gold-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">💎</span>
            </div>
            <span className="font-display text-xl font-bold text-charcoal-600 hidden sm:inline">
              Jewelry Store
            </span>
          </Link>

          {/* Desktop Menu */}
          {!isMobile && (
            <div className="flex items-center gap-8">
              <Link to="/shop" className="text-gray-700 dark:text-gray-300 hover:text-rose-gold-500 transition-colors">
                Shop
              </Link>
              <a href="#categories" className="text-gray-700 dark:text-gray-300 hover:text-rose-gold-500 transition-colors">
                Categories
              </a>
              <a href="#about" className="text-gray-700 dark:text-gray-300 hover:text-rose-gold-500 transition-colors">
                About
              </a>
            </div>
          )}

          {/* Right Icons */}
          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <SunIcon className="w-5 h-5 text-yellow-500" />
              ) : (
                <MoonIcon className="w-5 h-5 text-gray-600" />
              )}
            </button>

            {/* Search (Desktop) */}
            {!isMobile && (
              <Link to="/shop" className="hidden md:flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                <span className="text-sm text-gray-600 dark:text-gray-400">Search...</span>
              </Link>
            )}

            {/* Cart */}
            <Link to="/cart" className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
              <ShoppingCartIcon className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 bg-rose-gold-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                0
              </span>
            </Link>

            {/* Wishlist */}
            <Link to="/wishlist" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
              <HeartIcon className="w-5 h-5" />
            </Link>

            {/* Account / Auth */}
            {isAuthenticated ? (
              <div className="relative group">
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors flex items-center gap-2">
                  <UserIcon className="w-5 h-5" />
                  <span className="hidden sm:inline text-sm">Account</span>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-premium opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <Link to="/account" className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700">
                    My Account
                  </Link>
                  <Link to="/account/orders" className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700">
                    My Orders
                  </Link>
                  {user?.role === 'admin' && (
                    <Link to="/admin" className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 border-t border-gray-200 dark:border-gray-700">
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 border-t border-gray-200 dark:border-gray-700"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="px-4 py-2 text-sm bg-rose-gold-500 text-white rounded-lg hover:bg-rose-gold-600 transition-colors">
                Login
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            {isMobile && (
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                {mobileMenuOpen ? (
                  <XMarkIcon className="w-6 h-6" />
                ) : (
                  <Bars3Icon className="w-6 h-6" />
                )}
              </button>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobile && mobileMenuOpen && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex flex-col gap-3">
            <Link to="/shop" className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
              Shop
            </Link>
            <a href="#categories" className="px-4 py-2 hover:bg-rose-gold-50 dark:hover:bg-rose-gold-900/10 rounded-lg">
              Categories
            </a>
            <a href="#about" className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
              About
            </a>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
