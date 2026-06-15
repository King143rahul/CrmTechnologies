'use client';

import React from 'react';
import { formatPrice, getPercentageOff } from '@/lib/utils';
import Badge from './Badge';
import styles from './PriceDisplay.module.css';

interface PriceDisplayProps {
  amount: number;
  compareAtAmount?: number;
  currencyCode?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: { price: styles.priceSm, compare: styles.compareSm },
  md: { price: styles.priceMd, compare: styles.compareMd },
  lg: { price: styles.priceLg, compare: styles.compareLg },
};

export function PriceDisplay({
  amount,
  compareAtAmount,
  currencyCode = 'ZAR',
  size = 'md',
}: PriceDisplayProps) {
  const isSale = compareAtAmount && compareAtAmount > amount;
  const discount = isSale ? getPercentageOff(compareAtAmount, amount) : 0;
  const classes = sizeClasses[size];

  return (
    <div className={styles.wrapper}>
      <span className={`${classes.price} ${isSale ? styles.priceSale : styles.priceRegular}`}>
        {formatPrice(amount, currencyCode)}
      </span>
      {isSale && (
        <>
          <span className={`${classes.compare} ${styles.compareAt}`}>
            {formatPrice(compareAtAmount, currencyCode)}
          </span>
          <Badge variant="sale">Save {discount}%</Badge>
        </>
      )}
    </div>
  );
}

export default PriceDisplay;
