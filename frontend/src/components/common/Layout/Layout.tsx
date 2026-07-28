// src/components/layout/Layout.tsx

import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';


const Layout: React.FC = () => {
  const location = useLocation();
  
  // ✅ Pages where Navbar & Footer should be hidden
  const hideNavbarFooter = ['/login', '/register'].includes(location.pathname);
  
  // ✅ Pages where we want full width (no container padding)
  const isFullWidthPage = ['/map-search', '/properties'].includes(location.pathname);

  return (
    <div className="min-h-screen bg-[var(--color-primary)] flex flex-col">
      {/* ✅ Navbar - Hidden on login/register */}
      {!hideNavbarFooter && <Navbar />}
      
      {/* ✅ Main Content */}
      <main className={`flex-1 ${!hideNavbarFooter ? 'pt-16 md:pt-20' : ''} ${isFullWidthPage ? 'w-full' : ''}`}>
        <Outlet />
      </main>
      
      {/* ✅ Footer - Hidden on login/register */}
      {!hideNavbarFooter && <Footer />}
    </div>
  );
};

export default Layout;