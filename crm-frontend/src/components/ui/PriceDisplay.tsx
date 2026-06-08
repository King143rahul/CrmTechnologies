'use client';

import React from 'react';
import { formatPrice, getPercentageOff } from '@/lib/utils';
import Badge from './Badge';

interface PriceDisplayProps {
  amount: number; // in cents
  compareAtAmount?: number; // in cents
  currencyCode?: string;
  size?: 'sm' | 'md' | 'lg';
  style?: React.CSSProperties;
}

export function PriceDisplay({
  amount,
  compareAtAmount,
  currencyCode = 'USD',
  size = 'md',
  style,
}: PriceDisplayProps) {
  const isSale = compareAtAmount && compareAtAmount > amount;
  const discount = isSale ? getPercentageOff(compareAtAmount, amount) : 0;

  const fontSizes = {
    sm: { current: 'var(--text-base)', original: 'var(--text-xs)' },
    md: { current: 'var(--text-lg)', original: 'var(--text-sm)' },
    lg: { current: 'var(--text-2xl)', original: 'var(--text-base)' },
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexWrap: 'wrap', ...style }}>
      <span
        style={{
          fontSize: fontSizes[size].current,
          fontWeight: 'var(--font-weight-extrabold)',
          color: isSale ? 'var(--color-error)' : 'var(--color-blue)',
        }}
      >
        {formatPrice(amount, currencyCode)}
      </span>
      {isSale && (
        <>
          <span
            style={{
              fontSize: fontSizes[size].original,
              textDecoration: 'line-through',
              color: 'var(--color-text-tertiary)',
            }}
          >
            {formatPrice(compareAtAmount, currencyCode)}
          </span>
          <Badge variant="sale">Save {discount}%</Badge>
        </>
      )}
    </div>
  );
}

export default PriceDisplay;
