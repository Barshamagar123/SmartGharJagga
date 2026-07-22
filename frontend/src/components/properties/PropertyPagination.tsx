// src/components/properties/PropertyPagination.tsx

import React from 'react';

interface PropertyPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const PropertyPagination: React.FC<PropertyPaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex justify-center items-center gap-2 mt-10">
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-5 py-2.5 border border-[var(--color-primary-border)] rounded-full text-sm text-[var(--color-text-secondary)] hover:bg-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Previous
      </button>

      {pages.map((page) => (
        <button
          key={page}
          type="button"
          onClick={() => onPageChange(page)}
          aria-current={currentPage === page ? 'page' : undefined}
          className={`w-10 h-10 flex items-center justify-center rounded-full text-sm transition-all duration-200 ${
            currentPage === page
              ? 'bg-[#2D5A27] text-white hover:bg-[#23461E]'
              : 'border border-[var(--color-primary-border)] text-[var(--color-text-secondary)] hover:bg-white'
          }`}
        >
          {page}
        </button>
      ))}

      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-5 py-2.5 border border-[var(--color-primary-border)] rounded-full text-sm text-[var(--color-text-secondary)] hover:bg-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  );
};

export default PropertyPagination;