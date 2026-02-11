import React from 'react';
import { ChevronDoubleLeftIcon, ChevronLeftIcon, ChevronRightIcon, ChevronDoubleRightIcon } from '@heroicons/react/24/outline';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);

    if (endPage - startPage < maxVisible - 1) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) pages.push('...');
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) pages.push('...');
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        className="btn-secondary btn-sm disabled:opacity-50"
      >
        <ChevronDoubleLeftIcon className="w-4 h-4" />
      </button>

      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="btn-secondary btn-sm disabled:opacity-50"
      >
        <ChevronLeftIcon className="w-4 h-4" />
      </button>

      <div className="flex gap-1">
        {getPageNumbers().map((page, idx) => (
          <button
            key={idx}
            onClick={() => typeof page === 'number' && onPageChange(page)}
            disabled={page === '...'}
            className={`
              px-3 py-2 rounded-lg font-medium transition-all
              ${
                currentPage === page
                  ? 'bg-rose-gold-500 text-white shadow-soft'
                  : 'text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
              }
              ${page === '...' ? 'cursor-default' : ''}
            `}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="btn-secondary btn-sm disabled:opacity-50"
      >
        <ChevronRightIcon className="w-4 h-4" />
      </button>

      <button
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        className="btn-secondary btn-sm disabled:opacity-50"
      >
        <ChevronDoubleRightIcon className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Pagination;
