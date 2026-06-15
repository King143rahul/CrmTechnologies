'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { getCollectionByHandle, getProducts } from '@/lib/api/products';
import ProductCard from '@/components/ui/ProductCard';
import Breadcrumb from '@/components/ui/Breadcrumb';
import FilterSidebar, { FilterState } from '@/components/ui/FilterSidebar';
import styles from './CollectionPage.module.css';

interface Product {
  id: string;
  title: string;
  handle: string;
  thumbnail: string;
  metadata?: Record<string, string>;
  variants?: Array<{
    id: string;
    title: string;
    calculated_price?: {
      calculated_amount: number;
      currency_code: string;
      original_amount?: number;
    };
  }>;
  collection?: { title: string };
}

const DEFAULT_FILTERS: FilterState = {
  brands: [],
  priceMin: '',
  priceMax: '',
  ram: [],
  processor: [],
};

export default function CollectionDetailPage() {
  const params = useParams();
  const handle = params.handle as string;

  const [products, setProducts] = useState<Product[]>([]);
  const [collectionTitle, setCollectionTitle] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState('default');
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const colRes = await getCollectionByHandle(handle);
        let collectionId = '';
        if (colRes?.collections?.length) {
          const colObj = colRes.collections[0];
          setCollectionTitle(colObj.title);
          collectionId = colObj.id;
        } else {
          // Format title from handle if collection not found
          const formatted = handle
            .split('-')
            .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(' ');
          setCollectionTitle(formatted);
        }

        const prodRes = await getProducts(
          collectionId ? { collection_id: [collectionId], limit: 50 } : { limit: 50 }
        );
        if (prodRes?.products) {
          setProducts(prodRes.products);
        }
      } catch (err) {
        console.error('Failed to load collection data:', err);
        const formatted = handle
          .split('-')
          .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(' ');
        setCollectionTitle(formatted);
      } finally {
        setIsLoading(false);
      }
    }
    if (handle) {
      loadData();
    }
  }, [handle]);

  // Client-side filtering
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Brand filter: match against title (since Medusa doesn't have a built-in brand field)
    if (filters.brands.length > 0) {
      result = result.filter((p) =>
        filters.brands.some((brand) =>
          p.title.toLowerCase().includes(brand.toLowerCase())
        )
      );
    }

    // Price range filter
    if (filters.priceMin) {
      const min = parseFloat(filters.priceMin) * 100; // Convert to cents
      result = result.filter((p) => {
        const price = p.variants?.[0]?.calculated_price?.calculated_amount || 0;
        return price >= min;
      });
    }
    if (filters.priceMax) {
      const max = parseFloat(filters.priceMax) * 100;
      result = result.filter((p) => {
        const price = p.variants?.[0]?.calculated_price?.calculated_amount || 0;
        return price <= max;
      });
    }

    // RAM filter: match against title or metadata
    if (filters.ram.length > 0) {
      result = result.filter((p) => {
        const titleLower = p.title.toLowerCase();
        const metaRam = (p.metadata?.ram || '').toLowerCase();
        return filters.ram.some((r) => {
          const ramLower = r.toLowerCase();
          return titleLower.includes(ramLower) || metaRam.includes(ramLower);
        });
      });
    }

    // Processor filter: match against title or metadata
    if (filters.processor.length > 0) {
      result = result.filter((p) => {
        const titleLower = p.title.toLowerCase();
        const metaCpu = (p.metadata?.cpu || p.metadata?.processor || '').toLowerCase();
        return filters.processor.some((proc) => {
          const procLower = proc.toLowerCase();
          return titleLower.includes(procLower) || metaCpu.includes(procLower);
        });
      });
    }

    // Sorting
    if (sortOrder === 'price-asc') {
      result.sort((a, b) => {
        const pa = a.variants?.[0]?.calculated_price?.calculated_amount || 0;
        const pb = b.variants?.[0]?.calculated_price?.calculated_amount || 0;
        return pa - pb;
      });
    } else if (sortOrder === 'price-desc') {
      result.sort((a, b) => {
        const pa = a.variants?.[0]?.calculated_price?.calculated_amount || 0;
        const pb = b.variants?.[0]?.calculated_price?.calculated_amount || 0;
        return pb - pa;
      });
    } else if (sortOrder === 'name-asc') {
      result.sort((a, b) => a.title.localeCompare(b.title));
    }

    return result;
  }, [products, filters, sortOrder]);

  return (
    <div className={`container ${styles.page}`}>
      <Breadcrumb
        items={[
          { label: 'Collections', href: '/collections' },
          { label: collectionTitle || handle },
        ]}
        style={{ marginBottom: 'var(--space-6)' }}
      />

      <div className={styles.header}>
        <h1 className={styles.title}>{collectionTitle || 'Collection'}</h1>
        <div className={styles.meta}>
          <span className={styles.count}>
            {isLoading ? 'Loading...' : `Showing ${filteredProducts.length} product${filteredProducts.length !== 1 ? 's' : ''}`}
          </span>
          <div className={styles.sortWrapper}>
            <span className={styles.sortLabel}>Sort by:</span>
            <select
              className={styles.sortSelect}
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="default">Relevance</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Name: A to Z</option>
            </select>
          </div>
        </div>
      </div>

      <div className={styles.layout}>
        {/* Left Sidebar - Filters */}
        <FilterSidebar
          filters={filters}
          onFilterChange={setFilters}
          onClear={() => setFilters(DEFAULT_FILTERS)}
        />

        {/* Right Content - Product Grid */}
        {isLoading ? (
          <div className={styles.grid}>
            {Array.from({ length: 6 }).map((_, i) => (
              <ProductCard key={i} loading={true} />
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className={styles.grid}>
            {filteredProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        ) : (
          <div className={styles.empty}>
            <h3 className={styles.emptyTitle}>No products found</h3>
            <p className={styles.emptyDesc}>
              Try adjusting your filters or browse our other categories.
            </p>
            <button
              className="btn btn-primary"
              onClick={() => setFilters(DEFAULT_FILTERS)}
              style={{ marginTop: 'var(--space-4)' }}
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
