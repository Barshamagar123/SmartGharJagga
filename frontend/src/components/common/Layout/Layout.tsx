// src/components/layout/Layout.tsx

import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../../common/Navbar/Navbar';
import Footer from '../../common/Footer/Footer';

const LayoutOf: React.FC = () => {
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

export default LayoutOf;