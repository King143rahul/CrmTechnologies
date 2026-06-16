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
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-md)',
        background: 'var(--bg-white)',
        ...style,
      }}
    >
      <button
        type="button"
        onClick={() => value > min && onChange(value - 1)}
        disabled={value <= min}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '28px',
          height: '28px',
          borderRadius: 'var(--radius-sm)',
          cursor: value <= min ? 'not-allowed' : 'pointer',
          color: value <= min ? 'var(--text-muted)' : 'var(--text-secondary)',
          transition: 'color var(--transition-fast)',
        }}
      >
        <Minus size={14} />
      </button>
      <span
        style={{
          width: '32px',
          textAlign: 'center',
          fontSize: 'var(--text-sm)',
          fontWeight: 600,
          color: 'var(--text-primary)',
          userSelect: 'none',
        }}
      >
        {value}
      </span>
      <button
        type="button"
        onClick={() => value < max && onChange(value + 1)}
        disabled={value >= max}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '28px',
          height: '28px',
          borderRadius: 'var(--radius-sm)',
          cursor: value >= max ? 'not-allowed' : 'pointer',
          color: value >= max ? 'var(--text-muted)' : 'var(--text-secondary)',
          transition: 'color var(--transition-fast)',
        }}
      >
        <Plus size={14} />
      </button>
    </div>
  );
}

export default QuantitySelector;
