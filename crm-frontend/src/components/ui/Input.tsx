'use client';

import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', label, error, leftIcon, rightIcon, style, ...props }, ref) => {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', width: '100%', ...style }}>
        {label && (
          <label
            style={{
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-weight-medium)',
              color: 'var(--color-text-secondary)',
            }}
          >
            {label}
          </label>
        )}
        <div style={{ position: 'relative', width: '100%' }}>
          {leftIcon && (
            <div
              style={{
                position: 'absolute',
                left: 'var(--space-4)',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--color-text-tertiary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: 'none',
              }}
            >
              {leftIcon}
            </div>
          )}
          <input
            type={type}
            ref={ref}
            className={cn('glass-input', className)}
            style={{
              paddingLeft: leftIcon ? 'calc(var(--space-10) + 4px)' : 'var(--space-4)',
              paddingRight: rightIcon ? 'calc(var(--space-10) + 4px)' : 'var(--space-4)',
            }}
            {...props}
          />
          {rightIcon && (
            <div
              style={{
                position: 'absolute',
                right: 'var(--space-4)',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--color-text-tertiary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <span
            style={{
              fontSize: 'var(--text-xs)',
              color: 'var(--color-error)',
              marginTop: '2px',
            }}
          >
            {error}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
