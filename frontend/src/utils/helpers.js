export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(price);
};

export const calculateDiscount = (originalPrice, discountedPrice) => {
  if (!originalPrice || !discountedPrice || originalPrice <= discountedPrice) {
    return 0;
  }
  return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
};

export const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const formatDate = (date) => {
  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
};

export const getInitials = (name) => {
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Converts image filename or path to full URL
 * Handles both legacy paths (/uploads/file.jpg) and new filenames (file.jpg)
 * @param {string} imageUrl - Image filename or path from database
 * @returns {string} - Full absolute URL to image
 */
export const getImageUrl = (imageUrl) => {
  // Return placeholder if no image
  if (!imageUrl) return 'https://via.placeholder.com/300';
  
  // If it's already a full URL (http/https), return as is
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  
  // Get backend base URL
  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
  const BASE_URL = API_BASE.replace('/api', '');
  
  // Handle both cases:
  // 1. Legacy: "/uploads/filename.jpg" -> use as is
  // 2. New: "filename.jpg" -> prepend "/uploads/"
  const imagePath = imageUrl.startsWith('/uploads/') 
    ? imageUrl 
    : `/uploads/${imageUrl}`;
  
  return BASE_URL + imagePath;
};

export const validatePassword = (password) => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);
};

export const validatePhone = (phone) => {
  const phoneRegex = /^[0-9]{10}$/;
  return phoneRegex.test(phone.replace(/\D/g, ''));
};

export const generateOrderId = () => {
  return `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`.toUpperCase();
};

export const getSortedProducts = (products, sortBy) => {
  const sorted = [...products];

  switch (sortBy) {
    case 'price-asc':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return sorted.sort((a, b) => b.price - a.price);
    case 'name-asc':
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case 'name-desc':
      return sorted.sort((a, b) => b.name.localeCompare(a.name));
    case 'newest':
      return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    case 'rating':
      return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    default:
      return sorted;
  }
};

export const getPaginatedItems = (items, page, limit) => {
  const start = (page - 1) * limit;
  return items.slice(start, start + limit);
};

export const getTotalPages = (items, limit) => {
  return Math.ceil(items.length / limit);
};
