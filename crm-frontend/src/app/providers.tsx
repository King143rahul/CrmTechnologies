'use client';

import React from 'react';
import { CartProvider } from '@/lib/context/CartContext';
import { CustomerProvider } from '@/lib/context/CustomerContext';
import { WishlistProvider } from '@/lib/context/WishlistContext';
import { ToastProvider } from '@/lib/context/ToastContext';
import { RegionProvider } from '@/lib/context/RegionContext';
import Navbar from '@/components/layout/Navbar';
import TopBar from '@/components/layout/TopBar';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/cart/CartDrawer';
import Toast from '@/components/ui/Toast';
import styles from './providers.module.css';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <RegionProvider>
        <CustomerProvider>
          <CartProvider>
            <WishlistProvider>
              <TopBar />
              <Navbar />
              <main className={styles.main}>
                {children}
              </main>
              <Footer />
              <CartDrawer />
              <Toast />
            </WishlistProvider>
          </CartProvider>
        </CustomerProvider>
      </RegionProvider>
    </ToastProvider>
  );
}
