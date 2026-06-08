'use client';

import React from 'react';
import Link from 'next/link';
import { Phone, MapPin, Truck } from 'lucide-react';

export function TopBar() {
  return (
    <div
      style={{
        background: 'var(--color-navy)',
        color: '#ffffff',
        fontSize: 'var(--text-xs)',
        padding: 'var(--space-1) 0',
        width: '100%',
        position: 'relative',
        zIndex: 101, // Above navbar
      }}
    >
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {/* Left Side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-6)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <span style={{ fontWeight: 'var(--font-weight-medium)', color: '#a0aec0' }}>Buying for Business?</span>
            <Link href="/business" style={{ color: '#ffffff', textDecoration: 'underline' }}>
              Get sales advice from our team
            </Link>
          </div>
        </div>

        {/* Right Side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-6)' }}>
          <Link href="/track-order" style={{ display: 'flex', alignItems: 'center', gap: '4px', transition: 'color var(--transition-fast)' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--color-orange)'}
            onMouseLeave={e => e.currentTarget.style.color = '#ffffff'}
          >
            <Truck size={14} />
            Track Order
          </Link>
          
          <Link href="/store-finder" style={{ display: 'flex', alignItems: 'center', gap: '4px', transition: 'color var(--transition-fast)' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--color-orange)'}
            onMouseLeave={e => e.currentTarget.style.color = '#ffffff'}
          >
            <MapPin size={14} />
            Store Finder
          </Link>

          <a href="tel:0800123456" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 'var(--font-weight-bold)' }}>
            <Phone size={14} />
            0800 123 456
          </a>
        </div>
      </div>
      
      {/* Mobile styling */}
      <style jsx>{`
        @media (max-width: 768px) {
          .container {
            flex-direction: column;
            gap: 4px;
            padding: 4px 16px;
          }
          .container > div:first-child {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}

export default TopBar;
