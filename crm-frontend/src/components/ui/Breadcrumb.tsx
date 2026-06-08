'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  style?: React.CSSProperties;
}

export function Breadcrumb({ items, style }: BreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-2)',
        fontSize: 'var(--text-sm)',
        color: 'var(--color-text-secondary)',
        ...style,
      }}
    >
      <Link
        href="/"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-1)',
          transition: 'color var(--transition-fast)',
        }}
        onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-text-primary)')}
        onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-text-secondary)')}
      >
        <Home size={14} />
      </Link>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight size={12} color="var(--color-text-tertiary)" style={{ flexShrink: 0 }} />
          {item.href ? (
            <Link
              href={item.href}
              style={{
                transition: 'color var(--transition-fast)',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-text-primary)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-text-secondary)')}
            >
              {item.label}
            </Link>
          ) : (
            <span
              style={{
                color: 'var(--color-text-primary)',
                fontWeight: 'var(--font-weight-medium)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}

export default Breadcrumb;
