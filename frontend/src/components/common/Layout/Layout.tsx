// src/components/layout/Layout.tsx

import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';

// ✅ Import providers

import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import { useAuth } from '../../context/AuthContext';

const Layout: React.FC = () => {
  const location = useLocation();
  const hideNavbarFooter = ['/login', '/register'].includes(location.pathname);

  return (
    <div className="min-h-screen bg-[var(--color-primary)]">
      {!hideNavbarFooter && <Navbar />}
      <main className={hideNavbarFooter ? '' : 'pt-16 md:pt-20'}>
        <Outlet />
      </main>
      {!hideNavbarFooter && <Footer />}
    </div>
  );
};

export default Layout;