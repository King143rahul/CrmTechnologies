'use client';

import React from 'react';
import Link from 'next/link';
import { Phone, MapPin, Truck } from 'lucide-react';
import styles from './TopBar.module.css';

export function TopBar() {
  return (
    <div className={styles.topBar}>
      <div className={`container ${styles.inner}`}>
        {/* Left Side */}
        <div className={styles.left}>
          <div className={styles.businessLink}>
            <span className={styles.businessLabel}>Buying for Business?</span>
            <Link href="/business" className={styles.businessCta}>
              Get sales advice from our team
            </Link>
          </div>
        </div>

        {/* Right Side */}
        <div className={styles.right}>
          <Link href="/track-order" className={styles.rightLink}>
            <Truck size={14} />
            Track Order
          </Link>

          <Link href="/store-finder" className={styles.rightLink}>
            <MapPin size={14} />
            Store Finder
          </Link>

          <a href="tel:0800123456" className={styles.phoneLink}>
            <Phone size={14} />
            0800 123 456
          </a>
        </div>
      </div>
    </div>
  );
}

export default TopBar;
