'use client';

import React from 'react';
import Link from 'next/link';
import { Phone, Mail, MapPin, Truck } from 'lucide-react';
import styles from './TopBar.module.css';

export function TopBar() {
  return (
    <div className={styles.topBar}>
      <div className={styles.container}>
        <div className={styles.left}>
          <a href="tel:+27312025890" className={styles.contactItem}>
            <Phone size={12} />
            <span>031 202 5890</span>
          </a>
          <a href="mailto:sales@crmtechnology.co.za" className={styles.contactItem}>
            <Mail size={12} />
            <span>sales@crmtechnology.co.za</span>
          </a>
          <span className={styles.contactItem}>
            <MapPin size={12} />
            <span>Durban, South Africa</span>
          </span>
        </div>
        <div className={styles.right}>
          <span className={styles.shippingNotice}>
            <Truck size={12} />
            Free delivery on orders over R2,000
          </span>
          <span className={styles.divider} />
          <Link href="/account" className={styles.link}>Track Order</Link>
          <span className={styles.divider} />
          <Link href="/account" className={styles.link}>Business Accounts</Link>
        </div>
      </div>
    </div>
  );
}

export default TopBar;
