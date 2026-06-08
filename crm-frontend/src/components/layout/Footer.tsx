'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Send, MapPin, Phone, Mail, Shield, Award, CreditCard } from 'lucide-react';
import { useToast } from '@/lib/context/ToastContext';

export function Footer() {
  const { addToast } = useToast();
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    addToast('Thank you for subscribing!', 'success');
    setEmail('');
  };

  return (
    <footer
      style={{
        background: '#ffffff',
        borderTop: '1px solid var(--color-border)',
        paddingTop: 'var(--space-12)',
        paddingBottom: 'var(--space-6)',
        marginTop: 'auto',
      }}
    >
      <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-12)' }}>
        {/* Footer Top Grid */}
        <div className="footer-grid">
          {/* Brand Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--color-blue)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  fontWeight: 'var(--font-weight-extrabold)',
                  fontSize: '14px',
                }}
              >
                CR
              </div>
              <span style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-weight-extrabold)', color: 'var(--color-navy)' }}>
                CRM Technology
              </span>
            </div>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.6, maxWidth: '300px' }}>
              South Africa&apos;s trusted partner for premium laptop parts, IT hardware, and tech solutions. Official reseller.
            </p>

            {/* Trust Badges */}
            <div style={{ display: 'flex', gap: 'var(--space-4)', marginTop: 'var(--space-2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--color-navy)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-bold)' }}>
                <Shield size={16} color="var(--color-blue)" /> Secure
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--color-navy)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-bold)' }}>
                <Award size={16} color="var(--color-blue)" /> Warranty
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--color-navy)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-bold)' }}>
                <CreditCard size={16} color="var(--color-blue)" /> Payment
              </div>
            </div>
          </div>

          {/* Links Column 1: Products */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-navy)', textTransform: 'uppercase' }}>
              Shop By Category
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              {['Laptops', 'Desktops', 'Monitors', 'Components', 'Networking'].map((l, i) => (
                <Link key={i} href="/products" className="footer-link">
                  {l}
                </Link>
              ))}
            </div>
          </div>

          {/* Links Column 2: Account & Help */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-navy)', textTransform: 'uppercase' }}>
              Customer Service
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              {['Track Order', 'Returns & Refunds', 'Delivery Information', 'Contact Us', 'FAQs'].map((l, i) => {
                return (
                  <Link key={i} href="#" className="footer-link">
                    {l}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Contact Info & Newsletter */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-navy)', textTransform: 'uppercase' }}>
              Contact Us
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
                <Phone size={16} color="var(--color-blue)" />
                <span>0861 123 456</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
                <Mail size={16} color="var(--color-blue)" />
                <span>sales@crmtechnology.co.za</span>
              </div>
            </div>

            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginTop: 'var(--space-2)' }}>
              Subscribe to our newsletter for exclusive offers.
            </p>
            <form onSubmit={handleSubscribe} style={{ display: 'flex', gap: 'var(--space-2)' }}>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Email address"
                style={{
                  flex: 1,
                  padding: 'var(--space-2) var(--space-3)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--color-border)',
                  fontSize: 'var(--text-sm)',
                  outline: 'none'
                }}
                required
              />
              <button
                type="submit"
                className="btn btn-primary"
                style={{ padding: 'var(--space-2) var(--space-4)', borderRadius: 'var(--radius-sm)' }}
              >
                Sign Up
              </button>
            </form>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: '1px', background: 'var(--color-border)' }} />

        {/* Footer Bottom Info */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 'var(--space-4)',
            fontSize: 'var(--text-xs)',
            color: 'var(--color-text-tertiary)',
          }}
        >
          <span>&copy; {new Date().getFullYear()} CRM Technology. All rights reserved. E&OE.</span>
          <div style={{ display: 'flex', gap: 'var(--space-6)' }}>
            <a href="#" className="footer-link">Privacy Policy</a>
            <a href="#" className="footer-link">Terms & Conditions</a>
            <a href="#" className="footer-link">Sitemap</a>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .footer-grid {
          display: grid;
          grid-template-columns: 1.5fr 1fr 1fr 1.5fr;
          gap: var(--space-10);
        }
        .footer-link {
          font-size: var(--text-sm);
          color: var(--color-text-secondary);
          transition: color var(--transition-fast);
        }
        .footer-link:hover {
          color: var(--color-blue);
          text-decoration: underline;
        }
        @media (max-width: 992px) {
          .footer-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 576px) {
          .footer-grid {
            grid-template-columns: 1fr;
            gap: var(--space-8);
          }
        }
      `}</style>
    </footer>
  );
}

export default Footer;
