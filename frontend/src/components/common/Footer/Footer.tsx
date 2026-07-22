// src/components/layout/Footer/Footer.tsx

import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[var(--color-primary)] border-t border-[var(--color-primary-border)]">
      {/* 32px Padding (px-8) */}
      <div className="max-w-7xl mx-auto px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#2D5A27] text-white shadow-lg shadow-[#2D5A27]/20">
                <span className="text-xl">🏠</span>
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight">
                  <span className="text-[#2D5A27]">Smart</span>
                  <span className="text-[var(--color-text-primary)]">GharJagga</span>
                </span>
                <p className="text-[10px] font-medium text-[var(--color-text-tertiary)] tracking-wider uppercase">
                  Real Estate Platform
                </p>
              </div>
            </Link>
            <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed mt-4 max-w-xs">
              Nepal's smart real estate platform — helping you find, compare and settle into homes you'll love.
            </p>

            <div className="flex items-center gap-2 mt-4">
              <span className="px-3 py-1 bg-[#2D5A27]/10 text-[#2D5A27] text-xs font-semibold rounded-full border border-[#2D5A27]/20">
                ✅ Trusted Platform
              </span>
              <span className="px-3 py-1 bg-[#D4AF37]/10 text-[#D4AF37] text-xs font-semibold rounded-full border border-[#D4AF37]/20">
                ⭐ 4.8/5 Rating
              </span>
            </div>
          </div>

          {/* Explore Column */}
          <div>
            <h3 className="text-sm font-semibold text-[var(--color-text-primary)] uppercase tracking-wider mb-4">Explore</h3>
            <ul className="space-y-3">
              <li><Link to="/properties" className="text-[var(--color-text-secondary)] hover:text-[#2D5A27] transition-colors text-sm">Properties</Link></li>
              <li><Link to="/about" className="text-[var(--color-text-secondary)] hover:text-[#2D5A27] transition-colors text-sm">About</Link></li>
              <li><Link to="/contact" className="text-[var(--color-text-secondary)] hover:text-[#2D5A27] transition-colors text-sm">Contact</Link></li>
              <li><Link to="/blog" className="text-[var(--color-text-secondary)] hover:text-[#2D5A27] transition-colors text-sm">Blog</Link></li>
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h3 className="text-sm font-semibold text-[var(--color-text-primary)] uppercase tracking-wider mb-4">Company</h3>
            <ul className="space-y-3">
              <li><Link to="/our-story" className="text-[var(--color-text-secondary)] hover:text-[#2D5A27] transition-colors text-sm">Our Story</Link></li>
              <li><Link to="/careers" className="text-[var(--color-text-secondary)] hover:text-[#2D5A27] transition-colors text-sm">Careers</Link></li>
              <li><Link to="/press" className="text-[var(--color-text-secondary)] hover:text-[#2D5A27] transition-colors text-sm">Press</Link></li>
              <li><Link to="/privacy" className="text-[var(--color-text-secondary)] hover:text-[#2D5A27] transition-colors text-sm">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Follow Column */}
          <div>
            <h3 className="text-sm font-semibold text-[var(--color-text-primary)] uppercase tracking-wider mb-4">Follow</h3>
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-[var(--color-primary-border)] hover:bg-[#2D5A27] transition-all duration-200 flex items-center justify-center text-[var(--color-text-secondary)] hover:text-white">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-[var(--color-primary-border)] hover:bg-[#2D5A27] transition-all duration-200 flex items-center justify-center text-[var(--color-text-secondary)] hover:text-white">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.405a1.44 1.44 0 112.881.001 1.44 1.44 0 01-2.881-.001z" />
                </svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-[var(--color-primary-border)] hover:bg-[#2D5A27] transition-all duration-200 flex items-center justify-center text-[var(--color-text-secondary)] hover:text-white">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-[var(--color-primary-border)] hover:bg-[#2D5A27] transition-all duration-200 flex items-center justify-center text-[var(--color-text-secondary)] hover:text-white">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>

            <div className="mt-6">
              <p className="text-sm text-[var(--color-text-secondary)] mb-2">Subscribe to our newsletter</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-3 py-2 bg-white border border-[var(--color-primary-border)] rounded-lg text-[var(--color-text-primary)] placeholder-[var(--color-text-tertiary)] text-sm focus:outline-none focus:ring-2 focus:ring-[#2D5A27] focus:border-transparent"
                />
                <button className="px-4 py-2 bg-[#2D5A27] text-white text-sm font-semibold rounded-lg hover:bg-[#23461E] transition-all duration-200 shadow-md hover:shadow-lg">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-[var(--color-primary-border)] mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-[var(--color-text-tertiary)]">© {currentYear} SmartGharJagga. All rights reserved.</p>
            <p className="text-sm text-[var(--color-text-tertiary)]">Nepal's Smart Real Estate Platform</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;