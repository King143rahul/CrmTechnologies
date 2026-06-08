'use client';

import React from 'react';
import { Minus, Plus } from 'lucide-react';

interface QuantitySelectorProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  style?: React.CSSProperties;
}

export function QuantitySelector({ value, onChange, min = 1, max = 99, style }: QuantitySelectorProps) {
  const handleDecrement = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  const handleIncrement = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-md)',
        padding: '2px',
        ...style,
      }}
    >
      <button
        type="button"
        onClick={handleDecrement}
        disabled={value <= min}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '28px',
          height: '28px',
          borderRadius: 'var(--radius-sm)',
          cursor: value <= min ? 'not-allowed' : 'pointer',
          color: value <= min ? 'var(--color-text-tertiary)' : 'var(--color-text-primary)',
          transition: 'background-color var(--transition-fast)',
        }}
        onMouseEnter={e => {
          if (value > min) e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.backgroundColor = 'transparent';
        }}
      >
        <Minus size={14} />
      </button>
      <span
        style={{
          width: '32px',
          textAlign: 'center',
          fontSize: 'var(--text-sm)',
          fontWeight: 'var(--font-weight-semibold)',
          userSelect: 'none',
        }}
      >
        {value}
      </span>
      <button
        type="button"
        onClick={handleIncrement}
        disabled={value >= max}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '28px',
          height: '28px',
          borderRadius: 'var(--radius-sm)',
          cursor: value >= max ? 'not-allowed' : 'pointer',
          color: value >= max ? 'var(--color-text-tertiary)' : 'var(--color-text-primary)',
          transition: 'background-color var(--transition-fast)',
        }}
        onMouseEnter={e => {
          if (value < max) e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.backgroundColor = 'transparent';
        }}
      >
        <Plus size={14} />
      </button>
    </div>
  );
}

export default QuantitySelector;
