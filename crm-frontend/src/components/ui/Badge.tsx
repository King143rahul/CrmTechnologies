'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  variant?: 'sale' | 'new' | 'stock' | 'out' | 'category';
}

export function Badge({ children, variant = 'category', className, ...props }: BadgeProps) {
  return (
    <span
      className={cn('badge', `badge-${variant}`, className)}
      {...props}
    >
      {children}
    </span>
  );
}

export default Badge;
