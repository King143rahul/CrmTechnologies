'use client';

import React from 'react';
import { CartProvider } from '@/lib/context/CartContext';
import { CustomerProvider } from '@/lib/context/CustomerContext';
import { WishlistProvider } from '@/lib/context/WishlistContext';
import { ToastProvider } from '@/lib/context/ToastContext';
import Navbar from '@/components/layout/Navbar';
import TopBar from '@/components/layout/TopBar';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/cart/CartDrawer';
import Toast from '@/components/ui/Toast';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <CustomerProvider>
        <CartProvider>
          <WishlistProvider>
            <TopBar />
            <Navbar />
            <main style={{ minHeight: '100vh', position: 'relative', zIndex: 1, paddingTop: '150px' }}>
              {children}
            </main>
            <Footer />
            <CartDrawer />
            <Toast />
          </WishlistProvider>
        </CartProvider>
      </CustomerProvider>
    </ToastProvider>
  );
}
