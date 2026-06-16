'use client';

import React from 'react';
import Link from 'next/link';
import { Phone, Mail, MapPin, Clock, Globe, MessageCircle, Share2, ExternalLink, CreditCard, Truck, ShieldCheck, Headphones } from 'lucide-react';
import styles from './Footer.module.css';

const SHOP_LINKS = [
  { label: 'Laptops', href: '/collections/laptop' },
  { label: 'PCs & Desktops', href: '/collections/pcs' },
  { label: 'Components', href: '/collections/components' },
  { label: 'Accessories', href: '/collections/accessories' },
  { label: 'Networking', href: '/collections/networking' },
  { label: 'Security & CCTV', href: '/collections/security-cctv' },
];

const INFO_LINKS = [
  { label: 'About Us', href: '/about' },
  { label: 'Contact Us', href: '/about' },
  { label: 'Shipping Policy', href: '/about' },
  { label: 'Return Policy', href: '/about' },
  { label: 'Privacy Policy', href: '/about' },
  { label: 'Terms & Conditions', href: '/about' },
];

const ACCOUNT_LINKS = [
  { label: 'My Account', href: '/account' },
  { label: 'Order Tracking', href: '/account' },
  { label: 'Wishlist', href: '/account' },
  { label: 'Shopping Cart', href: '/cart' },
  { label: 'Business Accounts', href: '/account' },
];

export function Footer() {
  return (
    <footer className={styles.footer}>
      {/* Trust Badges Strip */}
      <div className={styles.trustStrip}>
        <div className={styles.trustContainer}>
          <div className={styles.trustItem}>
            <Truck size={28} strokeWidth={1.5} />
            <div>
              <strong>Free Delivery</strong>
              <span>On orders over R2,000</span>
            </div>
          </div>
          <div className={styles.trustItem}>
            <ShieldCheck size={28} strokeWidth={1.5} />
            <div>
              <strong>Secure Payments</strong>
              <span>SSL Encrypted checkout</span>
            </div>
          </div>
          <div className={styles.trustItem}>
            <CreditCard size={28} strokeWidth={1.5} />
            <div>
              <strong>Flexible Payment</strong>
              <span>EFT, Card & PayFast</span>
            </div>
          </div>
          <div className={styles.trustItem}>
            <Headphones size={28} strokeWidth={1.5} />
            <div>
              <strong>Expert Support</strong>
              <span>Mon-Fri 8AM - 5PM</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Grid */}
      <div className={styles.main}>
        <div className={styles.mainContainer}>
          {/* Company Info */}
          <div className={styles.col}>
            <div className={styles.footerLogo}>
              <div className={styles.logoIcon}>CRM</div>
              <div>
                <h3 className={styles.logoName}>CRM Technology</h3>
                <p className={styles.logoTag}>IT Hardware & Solutions</p>
              </div>
            </div>
            <p className={styles.about}>
              South Africa&apos;s trusted source for premium IT hardware, laptop parts, replacement screens, SSDs, and networking equipment. Based in Durban with nationwide delivery.
            </p>
            <div className={styles.contactList}>
              <a href="tel:+27312025890" className={styles.contactItem}>
                <Phone size={14} /> 031 202 5890
              </a>
              <a href="mailto:sales@crmtechnology.co.za" className={styles.contactItem}>
                <Mail size={14} /> sales@crmtechnology.co.za
              </a>
              <span className={styles.contactItem}>
                <MapPin size={14} /> Durban, KwaZulu-Natal, SA
              </span>
              <span className={styles.contactItem}>
                <Clock size={14} /> Mon - Fri: 8:00 AM - 5:00 PM
              </span>
            </div>
          </div>

          {/* Shop Links */}
          <div className={styles.col}>
            <h4 className={styles.colTitle}>Shop</h4>
            <ul className={styles.linkList}>
              {SHOP_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={styles.link}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Information */}
          <div className={styles.col}>
            <h4 className={styles.colTitle}>Information</h4>
            <ul className={styles.linkList}>
              {INFO_LINKS.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className={styles.link}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* My Account */}
          <div className={styles.col}>
            <h4 className={styles.colTitle}>My Account</h4>
            <ul className={styles.linkList}>
              {ACCOUNT_LINKS.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className={styles.link}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className={styles.bottom}>
        <div className={styles.bottomContainer}>
          <p className={styles.copyright}>
            © {new Date().getFullYear()} CRM Technology. All rights reserved.
          </p>
          <div className={styles.social}>
            <a href="#" aria-label="Facebook" className={styles.socialLink}><Globe size={16} /></a>
            <a href="#" aria-label="Instagram" className={styles.socialLink}><MessageCircle size={16} /></a>
            <a href="#" aria-label="LinkedIn" className={styles.socialLink}><Share2 size={16} /></a>
            <a href="#" aria-label="Twitter" className={styles.socialLink}><ExternalLink size={16} /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
