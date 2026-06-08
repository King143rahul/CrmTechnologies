'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function Button({
  children,
  className,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || isLoading}
      className={cn(
        'btn',
        `btn-${variant}`,
        `btn-${size}`,
        className
      )}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="animate-spin" style={{ width: '1.25rem', height: '1.25rem' }} />
      ) : (
        <>
          {leftIcon && <span style={{ display: 'inline-flex' }}>{leftIcon}</span>}
          {children}
          {rightIcon && <span style={{ display: 'inline-flex' }}>{rightIcon}</span>}
        </>
      )}
    </button>
  );
}

export default Button;
