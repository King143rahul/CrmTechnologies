'use client';

import React from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const categories = [
    { name: 'Laptops', href: '/products?category=laptops' },
    { name: 'PCs & Monitors', href: '/products?category=desktops' },
    { name: 'Gaming', href: '/products?category=gaming' },
    { name: 'Storage & Memory', href: '/products?category=storage' },
    { name: 'Components', href: '/products?category=components' },
    { name: 'Accessories', href: '/products?category=accessories' },
    { name: 'Clearance', href: '/collections/clearance', highlight: true },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 200,
            display: 'flex',
          }}
        >
          {/* Backdrop blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.4)',
              backdropFilter: 'blur(2px)',
            }}
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 220 }}
            style={{
              position: 'relative',
              width: '80%',
              maxWidth: '320px',
              height: '100%',
              background: '#ffffff',
              boxShadow: 'var(--shadow-xl)',
              display: 'flex',
              flexDirection: 'column',
              padding: 'var(--space-4)',
              zIndex: 10,
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 'var(--space-4)', borderBottom: '1px solid var(--color-border)' }}>
              <span style={{ fontSize: '18px', fontWeight: 'var(--font-weight-extrabold)', color: 'var(--color-navy)' }}>
                Departments
              </span>
              <button
                onClick={onClose}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '32px',
                  height: '32px',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  color: 'var(--color-text-secondary)',
                  background: 'var(--color-bg-secondary)'
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Links Stack */}
            <nav style={{ display: 'flex', flexDirection: 'column', overflowY: 'auto', paddingTop: 'var(--space-4)' }}>
              {categories.map((cat, idx) => (
                <Link
                  key={idx}
                  href={cat.href}
                  onClick={onClose}
                  style={{
                    fontSize: 'var(--text-base)',
                    fontWeight: 'var(--font-weight-semibold)',
                    color: cat.highlight ? 'var(--color-error)' : 'var(--color-text-primary)',
                    padding: 'var(--space-3) var(--space-2)',
                    borderBottom: '1px solid var(--color-border)',
                  }}
                >
                  {cat.name}
                </Link>
              ))}
            </nav>

            <div style={{ marginTop: 'auto', borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-4)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                <Link href="/account" onClick={onClose} style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)' }}>
                  My Account
                </Link>
                <Link href="/track-order" onClick={onClose} style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)' }}>
                  Track Order
                </Link>
                <Link href="/store-finder" onClick={onClose} style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)' }}>
                  Store Finder
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default MobileMenu;
