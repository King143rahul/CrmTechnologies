'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingCart, Heart, User, Search, Menu, ChevronDown } from 'lucide-react';
import { useCart } from '@/lib/context/CartContext';
import { useWishlist } from '@/lib/context/WishlistContext';
import { useCustomer } from '@/lib/context/CustomerContext';
import MobileMenu from './MobileMenu';

export function Navbar() {
  const { toggleCart, itemCount } = useCart();
  const { itemCount: wishlistCount } = useWishlist();
  const { isAuthenticated } = useCustomer();
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    <>
      <header
        style={{
          position: 'fixed',
          top: isScrolled ? 0 : '30px', // Below TopBar
          left: 0,
          right: 0,
          zIndex: 100,
          background: '#ffffff',
          boxShadow: isScrolled ? 'var(--shadow-md)' : 'none',
          borderBottom: '1px solid var(--color-border)',
          transition: 'top var(--transition-fast), box-shadow var(--transition-fast)',
        }}
      >
        {/* Row 1: Logo, Search, Actions */}
        <div style={{ borderBottom: '1px solid var(--color-border)' }}>
          <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--space-3) var(--space-4)', gap: 'var(--space-6)' }}>
            
            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              style={{ display: 'none', cursor: 'pointer', color: 'var(--color-navy)' }}
              className="mobile-toggle-btn"
            >
              <Menu size={24} />
            </button>

            {/* Logo */}
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--color-navy)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 'var(--font-weight-extrabold)',
                  fontSize: '16px',
                }}
              >
                CR
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
                <span style={{ fontFamily: 'var(--font-heading)', fontSize: '20px', fontWeight: 'var(--font-weight-extrabold)', color: 'var(--color-navy)', letterSpacing: '-0.02em' }}>
                  CRM
                </span>
                <span style={{ fontSize: '12px', fontWeight: 'var(--font-weight-medium)', color: 'var(--color-blue)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                  Technology
                </span>
              </div>
            </Link>

            {/* Search Bar */}
            <div className="search-container" style={{ flexGrow: 1, maxWidth: '600px', display: 'flex' }}>
              <div style={{ display: 'flex', width: '100%', borderRadius: 'var(--radius-full)', border: '2px solid var(--color-blue)', overflow: 'hidden' }}>
                <input 
                  type="text" 
                  placeholder="Search for products, brands or categories..." 
                  style={{ flexGrow: 1, padding: '10px 16px', outline: 'none', fontSize: 'var(--text-sm)' }}
                />
                <button style={{ background: 'var(--color-blue)', color: '#ffffff', padding: '0 24px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Search size={20} />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-6)' }}>
              
              {/* Account */}
              <Link href={isAuthenticated ? '/account' : '/account/login'} className="action-btn">
                <User size={24} strokeWidth={1.5} />
                <span className="action-label">My Account</span>
              </Link>
              
              {/* Wishlist */}
              <Link href="/account?tab=wishlist" className="action-btn" style={{ position: 'relative' }}>
                <Heart size={24} strokeWidth={1.5} />
                <span className="action-label">Wishlist</span>
                {wishlistCount > 0 && (
                  <span className="badge-count">{wishlistCount}</span>
                )}
              </Link>

              {/* Cart Trigger */}
              <button onClick={toggleCart} className="action-btn cart-btn" style={{ position: 'relative' }}>
                <div style={{ position: 'relative' }}>
                  <ShoppingCart size={28} strokeWidth={1.5} color="var(--color-navy)" />
                  {itemCount > 0 && (
                    <span className="badge-count cart-badge">{itemCount}</span>
                  )}
                </div>
                <div className="cart-text">
                  <span style={{ fontSize: '10px', color: 'var(--color-text-tertiary)' }}>My Basket</span>
                  <span style={{ fontSize: '13px', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-navy)' }}>
                    View
                  </span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Row 2: Navigation Categories */}
        <div className="category-nav-container" style={{ background: 'var(--color-surface)', borderBottom: '2px solid var(--color-blue)' }}>
          <div className="container">
            <nav style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
              {/* "All Departments" Dropdown Trigger */}
              <div 
                style={{ 
                  background: 'var(--color-blue)', 
                  color: '#ffffff', 
                  padding: 'var(--space-3) var(--space-4)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 'var(--space-2)',
                  fontWeight: 'var(--font-weight-bold)',
                  cursor: 'pointer',
                  fontSize: 'var(--text-sm)',
                  textTransform: 'uppercase'
                }}
              >
                <Menu size={18} />
                All Departments
                <ChevronDown size={16} />
              </div>

              {/* Top Level Links */}
              {categories.map((cat, idx) => (
                <Link
                  key={idx}
                  href={cat.href}
                  style={{
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-weight-bold)',
                    color: cat.highlight ? 'var(--color-error)' : 'var(--color-navy)',
                    padding: 'var(--space-3) var(--space-4)',
                    transition: 'color var(--transition-fast)',
                    textTransform: 'uppercase'
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--color-blue)'}
                  onMouseLeave={e => e.currentTarget.style.color = cat.highlight ? 'var(--color-error)' : 'var(--color-navy)'}
                >
                  {cat.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* CSS style block to handle media queries for navigation */}
      <style jsx global>{`
        .action-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          color: var(--color-navy);
          cursor: pointer;
          transition: color var(--transition-fast);
        }
        .action-btn:hover {
          color: var(--color-blue);
        }
        .action-label {
          font-size: 11px;
          font-weight: var(--font-weight-medium);
        }
        .badge-count {
          position: absolute;
          top: -6px;
          right: 4px;
          background: var(--color-orange);
          color: #ffffff;
          font-size: 10px;
          font-weight: var(--font-weight-bold);
          min-width: 18px;
          height: 18px;
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 4px;
          border: 2px solid #ffffff;
        }
        .cart-btn {
          flex-direction: row;
          align-items: center;
          gap: 12px;
          background: var(--color-bg-secondary);
          padding: 8px 16px;
          border-radius: var(--radius-full);
        }
        .cart-badge {
          top: -8px;
          right: -8px;
        }
        .cart-text {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          line-height: 1.1;
        }

        @media (max-width: 1024px) {
          .category-nav-container {
            display: none !important;
          }
          .search-container {
            order: 3;
            width: 100%;
            max-width: 100%;
            margin-top: 12px;
          }
          .container {
            flex-wrap: wrap;
          }
        }
        @media (max-width: 768px) {
          .mobile-toggle-btn {
            display: flex !important;
          }
          .action-label, .cart-text {
            display: none !important;
          }
          .cart-btn {
            padding: 4px;
            background: transparent;
          }
        }
      `}</style>

      {/* Overlays */}
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    </>
  );
}

export default Navbar;
