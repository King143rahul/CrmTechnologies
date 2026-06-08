'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getCollections } from '@/lib/api/products';
import Breadcrumb from '@/components/ui/Breadcrumb';
import Skeleton from '@/components/ui/Skeleton';

const MOCK_COLLECTIONS = [
  { id: 'col_1', title: 'Summer Collection', handle: 'summer-collection', description: 'Lightweight drapes and warm weather accessories.', bg: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)' },
  { id: 'col_2', title: 'Essentials', handle: 'essentials', description: 'Ethically crafted daily tees, sweats, and long sleeves.', bg: 'linear-gradient(135deg, #10B981 0%, #059669 100%)' },
  { id: 'col_3', title: 'Accessories', handle: 'accessories', description: 'Minimalist wallets, matte sunglasses, and tech gear.', bg: 'linear-gradient(135deg, #EC4899 0%, #D946EF 100%)' },
  { id: 'col_4', title: 'Nomad Gear', handle: 'nomad-gear', description: 'Durable travel backpacks and windbreaker jackets.', bg: 'linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)' },
];

export default function CollectionsPage() {
  const [collections, setCollections] = useState(MOCK_COLLECTIONS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const colData = await getCollections();
        if (colData?.collections?.length) {
          const merged = colData.collections.map((c: any, idx: number) => ({
            ...c,
            bg: MOCK_COLLECTIONS[idx % MOCK_COLLECTIONS.length].bg,
            description: MOCK_COLLECTIONS[idx % MOCK_COLLECTIONS.length].description,
          }));
          setCollections(merged);
        }
      } catch (err) {
        console.warn('API error, using mock collections', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="container" style={{ paddingTop: 'var(--space-8)', paddingBottom: 'var(--space-12)' }}>
      {/* Breadcrumbs */}
      <Breadcrumb items={[{ label: 'Collections' }]} style={{ marginBottom: 'var(--space-6)' }} />

      <div style={{ marginBottom: 'var(--space-10)' }}>
        <h1 style={{ fontSize: 'var(--text-3xl)' }}>Shop Collections</h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', marginTop: 'var(--space-2)' }}>
          Curated layers and accessories grouped by style and utility.
        </p>
      </div>

      {isLoading ? (
        <div className="collections-grid">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} height="260px" borderRadius="var(--radius-xl)" />
          ))}
        </div>
      ) : (
        <div className="collections-grid">
          {collections.map(col => (
            <Link
              key={col.id}
              href={`/collections/${col.handle}`}
              className="glass-card collection-card"
              style={{
                background: col.bg || 'var(--gradient-card)',
                padding: 'var(--space-8)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                minHeight: '260px',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Overlay card */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.12) 0%, transparent 60%)',
                  pointerEvents: 'none',
                }}
              />
              <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-weight-bold)', color: '#ffffff' }}>
                  {col.title}
                </h3>
                {col.description && (
                  <p style={{ fontSize: 'var(--text-sm)', color: 'rgba(255, 255, 255, 0.8)', maxWidth: '240px', lineHeight: 1.4 }}>
                    {col.description}
                  </p>
                )}
                <span
                  style={{
                    fontSize: 'var(--text-xs)',
                    color: '#ffffff',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontWeight: 'var(--font-weight-semibold)',
                    marginTop: 'var(--space-3)',
                  }}
                >
                  Explore Collection <ArrowRight size={12} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}

      <style jsx global>{`
        .collections-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: var(--space-6);
        }
        @media (max-width: 768px) {
          .collections-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
