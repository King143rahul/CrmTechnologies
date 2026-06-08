'use client';

import React, { useState } from 'react';

interface Image {
  url: string;
  alt?: string;
}

interface ImageGalleryProps {
  images?: Image[];
  style?: React.CSSProperties;
}

export function ImageGallery({ images = [], style }: ImageGalleryProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const activeImage = images[activeIdx] || { url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800' };

  if (images.length === 0) {
    return (
      <div
        style={{
          width: '100%',
          height: '400px',
          borderRadius: 'var(--radius-xl)',
          background: 'var(--color-bg-secondary)',
          border: '1px solid var(--color-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--color-text-tertiary)',
          ...style,
        }}
      >
        No Images Available
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', width: '100%', ...style }}>
      {/* Main Preview Container */}
      <div
        className="glass"
        style={{
          width: '100%',
          height: '480px',
          borderRadius: 'var(--radius-xl)',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        <img
          src={activeImage.url}
          alt={activeImage.alt || 'Product Image'}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform var(--transition-slow)',
          }}
          onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.04)')}
          onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
        />
      </div>

      {/* Thumbnails Row */}
      {images.length > 1 && (
        <div style={{ display: 'flex', gap: 'var(--space-3)', overflowX: 'auto', paddingBottom: 'var(--space-2)' }}>
          {images.map((img, idx) => {
            const isActive = idx === activeIdx;
            return (
              <button
                key={idx}
                onClick={() => setActiveIdx(idx)}
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  border: `2px solid ${isActive ? 'var(--color-accent-violet)' : 'var(--color-border)'}`,
                  background: 'var(--color-bg-secondary)',
                  opacity: isActive ? 1 : 0.6,
                  transition: 'border-color var(--transition-fast), opacity var(--transition-fast)',
                  flexShrink: 0,
                  padding: 0,
                }}
                onMouseEnter={e => {
                  if (!isActive) e.currentTarget.style.opacity = '0.9';
                }}
                onMouseLeave={e => {
                  if (!isActive) e.currentTarget.style.opacity = '0.6';
                }}
              >
                <img src={img.url} alt={img.alt || 'Thumbnail'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ImageGallery;
