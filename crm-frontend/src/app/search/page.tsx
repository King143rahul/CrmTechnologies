'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, SlidersHorizontal } from 'lucide-react';
import { searchProducts } from '@/lib/api/products';
import ProductCard from '@/components/ui/ProductCard';
import Breadcrumb from '@/components/ui/Breadcrumb';
import styles from './SearchPage.module.css';

interface Product {
  id: string;
  title: string;
  handle: string;
  thumbnail: string;
  variants?: Array<{
    id: string;
    title: string;
    calculated_price?: {
      calculated_amount: number;
      currency_code: string;
      original_amount?: number;
    };
  }>;
  metadata?: Record<string, string>;
  collection?: { title: string };
}

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function performSearch() {
      if (!query.trim()) {
        setProducts([]);
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        const data = await searchProducts(query);
        if (data?.products) {
          setProducts(data.products);
        } else {
          setProducts([]);
        }
      } catch (err) {
        console.error('Search failed:', err);
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    }
    performSearch();
  }, [query]);

  return (
    <div className={`container ${styles.page}`}>
      <Breadcrumb items={[{ label: 'Search' }]} style={{ marginBottom: 'var(--space-6)' }} />

      <div className={styles.header}>
        <h1 className={styles.title}>
          <Search size={28} /> Search Results
        </h1>
        <p className={styles.subtitle}>
          {query ? (
            <>
              Showing results for &ldquo;<span className={styles.queryHighlight}>{query}</span>&rdquo;
            </>
          ) : (
            'Enter a search term to find products.'
          )}
        </p>
      </div>

      {isLoading ? (
        <div className={styles.grid}>
          {Array.from({ length: 3 }).map((_, i) => (
            <ProductCard key={i} loading={true} />
          ))}
        </div>
      ) : products.length > 0 ? (
        <div className={styles.grid}>
          {products.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      ) : (
        <div className={styles.empty}>
          <SlidersHorizontal size={40} color="var(--color-text-tertiary)" />
          <div>
            <h4 className={styles.emptyTitle}>No products found</h4>
            <p className={styles.emptyDesc}>
              We couldn&rsquo;t find anything matching your search term.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="container" style={{ padding: 'var(--space-12) 0', textAlign: 'center' }}>
          Loading search...
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
