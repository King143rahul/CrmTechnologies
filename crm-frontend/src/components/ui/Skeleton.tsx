'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  borderRadius?: string;
  style?: React.CSSProperties;
}

export function Skeleton({ className, width, height, borderRadius, style }: SkeletonProps) {
  return (
    <div
      className={cn('skeleton', className)}
      style={{
        width: width !== undefined ? width : '100%',
        height: height !== undefined ? height : '1rem',
        borderRadius: borderRadius !== undefined ? borderRadius : 'var(--radius-md)',
        ...style,
      }}
    />
  );
}

export default Skeleton;
