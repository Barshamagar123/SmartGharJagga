// src/components/layout/Footer/Footer.tsx

import React from 'react';
import { Link } from 'react-router-dom';

interface FooterProps {
  lang?: 'en' | 'ne';
}

const PayLogo = ({ name }: { name: string }) => (
  <span className="inline-flex items-center px-2 py-1 rounded border text-[11px] font-mono font-semibold"
    style={{ borderColor: '#D3CFC5', color: '#5C6570', background: '#FFFFFF' }}>
    {name}
  </span>
);

const Footer: React.FC<FooterProps> = ({ lang = 'en' }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t mt-16" style={{ background: '#EFEDE6', borderColor: '#D3CFC5' }}>
      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Column */}
          <div>
            <div className="font-bold text-base mb-3" style={{ fontFamily: 'Khand', color: '#14181D' }}>
              Smart<span style={{ color: '#2D5A27' }}>Gharjagga</span>
            </div>
            <p className="text-sm" style={{ color: '#5C6570' }}>
              Nepal's verified property marketplace. Every listing has a lalpurja behind it.
            </p>
            
            <div className="flex items-center gap-2 mt-4">
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold"
                style={{ background: '#E8F0E4', color: '#2D5A27' }}>
                ✅ Verified
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold"
                style={{ background: '#FAF1DC', color: '#B07C1E' }}>
                ⭐ 4.8/5
              </span>
            </div>
          </div>

          {/* Marketplace Column */}
          <div>
            <div className="font-semibold text-sm mb-3" style={{ fontFamily: 'Khand', fontSize: 15, color: '#14181D' }}>
              Marketplace
            </div>
            <div className="space-y-2 text-sm" style={{ color: '#5C6570' }}>
              <div><Link to="/properties" className="hover:text-[#2D5A27] transition-colors">Buy property</Link></div>
              <div><Link to="/properties?type=rent" className="hover:text-[#2D5A27] transition-colors">Rent property</Link></div>
              <div><Link to="/list-property" className="hover:text-[#2D5A27] transition-colors">List a property</Link></div>
              <div><Link to="/match" className="hover:text-[#2D5A27] transition-colors font-medium" style={{ color: '#2D5A27' }}>
                🎯 Find my match
              </Link></div>
            </div>
          </div>

          {/* Trust Column */}
          <div>
            <div className="font-semibold text-sm mb-3" style={{ fontFamily: 'Khand', fontSize: 15, color: '#14181D' }}>
              Trust
            </div>
            <div className="space-y-2 text-sm" style={{ color: '#5C6570' }}>
              <div><Link to="/how-it-works" className="hover:text-[#2D5A27] transition-colors">How verification works</Link></div>
              <div><Link to="/pricing" className="hover:text-[#2D5A27] transition-colors">Pricing</Link></div>
              <div><Link to="/faq" className="hover:text-[#2D5A27] transition-colors">FAQ</Link></div>
              <div><Link to="/contact" className="hover:text-[#2D5A27] transition-colors">Contact us</Link></div>
            </div>
          </div>

          {/* Legal Column */}
          <div>
            <div className="font-semibold text-sm mb-3" style={{ fontFamily: 'Khand', fontSize: 15, color: '#14181D' }}>
              Legal
            </div>
            <div className="space-y-2 text-sm" style={{ color: '#5C6570' }}>
              <div><Link to="/privacy" className="hover:text-[#2D5A27] transition-colors">Privacy policy</Link></div>
              <div><Link to="/terms" className="hover:text-[#2D5A27] transition-colors">Terms of use</Link></div>
              <div><Link to="/disclaimer" className="hover:text-[#2D5A27] transition-colors">Disclaimer</Link></div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          style={{ borderColor: '#D3CFC5' }}>
          
          {/* Payment Methods */}
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs mr-1" style={{ color: '#5C6570' }}>Pay with:</span>
            <PayLogo name="eSewa" />
            <PayLogo name="Khalti" />
            <PayLogo name="IME Pay" />
            <PayLogo name="ConnectIPS" />
            <PayLogo name="Fonepay" />
          </div>

          {/* Language & Copyright */}
          <div className="flex items-center gap-3 flex-wrap">
            <button 
              className="text-xs font-mono px-2 py-1 rounded border transition-colors hover:bg-white"
              style={{ borderColor: '#D3CFC5', color: '#5C6570' }}
            >
              {lang === 'en' ? 'नेपाली' : 'English'}
            </button>
            <span className="text-xs" style={{ color: '#5C6570' }}>
              © {currentYear} SmartGharjagga
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;