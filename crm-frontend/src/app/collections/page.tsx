'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getCollections } from '@/lib/api/products';
import Breadcrumb from '@/components/ui/Breadcrumb';
import Skeleton from '@/components/ui/Skeleton';
import styles from './CollectionsPage.module.css';

const CATEGORY_ICONS: Record<string, string> = {
  laptops: '💻',
  desktops: '🖥️',
  monitors: '📺',
  components: '⚙️',
  accessories: '🖱️',
  networking: '🌐',
  gaming: '🎮',
  storage: '💾',
  clearance: '🏷️',
};

interface Collection {
  id: string;
  title: string;
  handle: string;
}

export default function CollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const colData = await getCollections();
        if (colData?.collections?.length) {
          setCollections(colData.collections);
        }
      } catch (err) {
        console.error('Failed to load collections:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className={`container ${styles.page}`}>
      <Breadcrumb items={[{ label: 'Collections' }]} style={{ marginBottom: 'var(--space-6)' }} />

      <div className={styles.header}>
        <h1 className={styles.title}>Shop Collections</h1>
        <p className={styles.subtitle}>
          Browse our curated categories of IT hardware, laptop parts, and tech accessories.
        </p>
      </div>

      {isLoading ? (
        <div className={styles.grid}>
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} height="260px" borderRadius="var(--radius-lg)" />
          ))}
        </div>
      ) : collections.length > 0 ? (
        <div className={styles.grid}>
          {collections.map((col) => {
            const icon = CATEGORY_ICONS[col.handle] || '📦';
            return (
              <Link
                key={col.id}
                href={`/collections/${col.handle}`}
                className={styles.card}
              >
                <span className={styles.cardIcon}>{icon}</span>
                <h3 className={styles.cardTitle}>{col.title}</h3>
                <p className={styles.cardDesc}>
                  Browse our {col.title.toLowerCase()} range from top brands.
                </p>
                <span className={styles.cardCta}>
                  Explore Collection <ArrowRight size={12} />
                </span>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className={styles.header}>
          <p className={styles.subtitle}>No collections found. Check back soon!</p>
        </div>
      )}
    </div>
  );
}
