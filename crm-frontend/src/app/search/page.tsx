'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, SlidersHorizontal } from 'lucide-react';
import { searchProducts } from '@/lib/api/products';
import ProductCard from '@/components/ui/ProductCard';
import Breadcrumb from '@/components/ui/Breadcrumb';
import Skeleton from '@/components/ui/Skeleton';

// Mock search results fallback
const MOCK_RESULTS = [
  { id: 'prod_1', title: 'Aura Premium Cotton Tee', handle: 'aura-premium-cotton-tee', thumbnail: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800', collection: { title: 'Essentials' }, variants: [{ id: 'var_1', title: 'Black / M', calculated_price: { calculated_amount: 4500, original_amount: 6000, currency_code: 'USD' } }] },
  { id: 'prod_5', title: 'Solar Windbreaker Jacket', handle: 'solar-windbreaker-jacket', thumbnail: 'https://images.unsplash.com/photo-1548883354-7622d03aca27?w=800', collection: { title: 'Essentials' }, variants: [{ id: 'var_5', title: 'Off-White', calculated_price: { calculated_amount: 11500, currency_code: 'USD' } }] },
];

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';

  const [products, setProducts] = useState(MOCK_RESULTS);
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
        }
      } catch (err) {
        console.warn('API search failed, utilizing fallbacks', err);
        // Fallback filtering logic
        const filtered = MOCK_RESULTS.filter(
          p => p.title.toLowerCase().includes(query.toLowerCase()) || p.collection.title.toLowerCase().includes(query.toLowerCase())
        );
        setProducts(filtered);
      } finally {
        setIsLoading(false);
      }
    }
    performSearch();
  }, [query]);

  return (
    <div className="container" style={{ paddingTop: 'var(--space-8)', paddingBottom: 'var(--space-12)' }}>
      {/* Breadcrumb */}
      <Breadcrumb items={[{ label: 'Search' }]} style={{ marginBottom: 'var(--space-6)' }} />

      <div style={{ marginBottom: 'var(--space-10)' }}>
        <h1 style={{ fontSize: 'var(--text-3xl)', display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <Search size={28} /> Search Results
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', marginTop: 'var(--space-2)' }}>
          Showing results for &ldquo;<strong style={{ color: 'var(--color-text-primary)' }}>{query}</strong>&rdquo;
        </p>
      </div>

      {isLoading ? (
        <div className="search-grid">
          {Array.from({ length: 3 }).map((_, i) => (
            <ProductCard key={i} loading={true} />
          ))}
        </div>
      ) : products.length > 0 ? (
        <div className="search-grid">
          {products.map(prod => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      ) : (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 'var(--space-16) 0',
            color: 'var(--color-text-secondary)',
            gap: 'var(--space-4)',
          }}
        >
          <SlidersHorizontal size={40} color="var(--color-text-tertiary)" />
          <div style={{ textAlign: 'center' }}>
            <h4 style={{ color: 'var(--color-text-primary)', fontWeight: 'var(--font-weight-bold)' }}>No products found</h4>
            <p style={{ fontSize: 'var(--text-sm)', marginTop: '4px' }}>We couldn&rsquo;t find anything matching your search term.</p>
          </div>
        </div>
      )}

      <style jsx global>{`
        .search-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--space-6);
        }
        @media (max-width: 992px) {
          .search-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 576px) {
          .search-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="container" style={{ padding: 'var(--space-12) 0', textAlign: 'center' }}>Loading search...</div>}>
      <SearchContent />
    </Suspense>
  );
}
