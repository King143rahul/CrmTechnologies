'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Phone, Mail, Shield, Award, CreditCard, MapPin } from 'lucide-react';
import { useToast } from '@/lib/context/ToastContext';
import styles from './Footer.module.css';

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
    <footer className={styles.footer}>
      {/* Gradient top accent */}
      <div className={styles.footerTopAccent} />

      <div className={`container ${styles.inner}`}>
        {/* Footer Top Grid */}
        <div className={styles.grid}>
          {/* Brand Info */}
          <div className={styles.brandCol}>
            <div className={styles.brandHeader}>
              <div className={styles.brandIcon}>CR</div>
              <span className={styles.brandName}>CRM Technology</span>
            </div>
            <p className={styles.brandDesc}>
              South Africa&apos;s trusted partner for premium laptops, IT hardware, components & tech solutions. Official reseller since 2015.
            </p>
            {/* Social Links */}
            <div className={styles.socialLinks}>
              <a href="#" className={styles.socialBtn} aria-label="Facebook">📘</a>
              <a href="#" className={styles.socialBtn} aria-label="Twitter/X">𝕏</a>
              <a href="#" className={styles.socialBtn} aria-label="Instagram">📸</a>
              <a href="#" className={styles.socialBtn} aria-label="LinkedIn">💼</a>
            </div>
            <div className={styles.trustBadges}>
              <div className={styles.trustBadge}>
                <Shield size={13} color="var(--color-blue)" /> SSL Secure
              </div>
              <div className={styles.trustBadge}>
                <Award size={13} color="var(--color-blue)" /> Warranty
              </div>
              <div className={styles.trustBadge}>
                <CreditCard size={13} color="var(--color-blue)" /> Safe Pay
              </div>
            </div>
          </div>

          {/* Shop By Category */}
          <div className={styles.linkCol}>
            <h4 className={styles.linkColTitle}>Shop</h4>
            <div className={styles.linkList}>
              {[
                { label: 'Laptops', href: '/collections/laptop' },
                { label: 'PCs & Desktops', href: '/collections/pcs' },
                { label: 'Components', href: '/collections/components' },
                { label: 'Networking', href: '/collections/networking' },
                { label: 'Security & CCTV', href: '/collections/security-cctv' },
                { label: 'Smart Devices', href: '/collections/smart-devices' },
              ].map((l, i) => (
                <Link key={i} href={l.href} className={styles.link}>
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Customer Service */}
          <div className={styles.linkCol}>
            <h4 className={styles.linkColTitle}>Help</h4>
            <div className={styles.linkList}>
              {[
                { label: 'Track My Order', href: '/track-order' },
                { label: 'Returns & Refunds', href: '#' },
                { label: 'Delivery Info', href: '#' },
                { label: 'FAQs', href: '#' },
                { label: 'Contact Us', href: '#' },
                { label: 'Business Accounts', href: '/account/register' },
              ].map((l, i) => (
                <Link key={i} href={l.href} className={styles.link}>
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact & Newsletter */}
          <div className={styles.contactCol}>
            <h4 className={styles.linkColTitle}>Contact</h4>
            <div className={styles.linkList}>
              <div className={styles.contactItem}>
                <Phone size={14} color="var(--color-blue)" />
                <span>0861 123 456</span>
              </div>
              <div className={styles.contactItem}>
                <Mail size={14} color="var(--color-blue)" />
                <span>sales@crmtechnology.co.za</span>
              </div>
              <div className={styles.contactItem}>
                <MapPin size={14} color="var(--color-blue)" />
                <span>Johannesburg, South Africa</span>
              </div>
            </div>

            <p className={styles.newsletterText}>
              Get exclusive deals & tech news in your inbox.
            </p>
            <form onSubmit={handleSubscribe} className={styles.newsletterForm}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className={styles.newsletterInput}
                required
              />
              <button type="submit" className={`btn btn-primary ${styles.newsletterBtn}`}>
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className={styles.divider} />

        {/* Payment Icons */}
        <div className={styles.paymentSection}>
          <span className={styles.paymentLabel}>We Accept</span>
          <div className={styles.paymentIcons}>
            {['VISA', 'Mastercard', 'EFT', 'PayFlex', 'SnapScan', 'Zapper'].map(p => (
              <span key={p} className={styles.paymentIcon}>{p}</span>
            ))}
          </div>
        </div>

        {/* Footer Bottom */}
        <div className={styles.bottom}>
          <span>&copy; {new Date().getFullYear()} CRM Technology (Pty) Ltd. All rights reserved. E&OE.</span>
          <div className={styles.bottomLinks}>
            <a href="#" className={styles.link}>Privacy Policy</a>
            <a href="#" className={styles.link}>Terms & Conditions</a>
            <a href="#" className={styles.link}>Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
