'use client';

import React from 'react';
import { Star } from 'lucide-react';

interface RatingProps {
  value: number; // 0 to 5
  size?: 'sm' | 'md';
  showCount?: boolean;
  count?: number;
}

export function Rating({ value, size = 'sm', showCount = false, count = 0 }: RatingProps) {
  const stars = Array.from({ length: 5 }, (_, i) => i + 1);
  const sizePx = size === 'sm' ? 14 : 18;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
      <div style={{ display: 'flex', gap: '2px' }}>
        {stars.map(star => {
          const isFilled = star <= Math.round(value);
          return (
            <Star
              key={star}
              size={sizePx}
              fill={isFilled ? 'var(--color-warning)' : 'none'}
              color={isFilled ? 'var(--color-warning)' : 'var(--color-text-tertiary)'}
              style={{ strokeWidth: 1.5 }}
            />
          );
        })}
      </div>
      {showCount && count > 0 && (
        <span
          style={{
            fontSize: 'var(--text-xs)',
            color: 'var(--color-text-secondary)',
            marginLeft: 'var(--space-1)',
          }}
        >
          ({count})
        </span>
      )}
    </div>
  );
}

export default Rating;
