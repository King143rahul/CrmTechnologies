'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { getProducts, getCollections } from '@/lib/api/products';
import ProductCard from '@/components/ui/ProductCard';
import Breadcrumb from '@/components/ui/Breadcrumb';
import FilterSidebar, { FilterState } from '@/components/ui/FilterSidebar';
import styles from './ProductsPage.module.css';

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
  collection?: { id: string; title: string };
}

const DEFAULT_FILTERS: FilterState = {
  brands: [],
  priceMin: '',
  priceMax: '',
  ram: [],
  processor: [],
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [sortBy, setSortBy] = useState('featured');
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const prodData = await getProducts({ limit: 50 });
        if (prodData?.products?.length) {
          setProducts(prodData.products);
        }
      } catch (err) {
        console.error('Failed to load products:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Brand filter
    if (filters.brands.length > 0) {
      result = result.filter((p) =>
        filters.brands.some((brand) =>
          p.title.toLowerCase().includes(brand.toLowerCase())
        )
      );
    }

    // Price range
    if (filters.priceMin) {
      const min = parseFloat(filters.priceMin) * 100;
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

    // RAM filter
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

    // Processor filter
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
    if (sortBy === 'price_asc') {
      result.sort((a, b) =>
        (a.variants?.[0]?.calculated_price?.calculated_amount || 0) -
        (b.variants?.[0]?.calculated_price?.calculated_amount || 0)
      );
    } else if (sortBy === 'price_desc') {
      result.sort((a, b) =>
        (b.variants?.[0]?.calculated_price?.calculated_amount || 0) -
        (a.variants?.[0]?.calculated_price?.calculated_amount || 0)
      );
    } else if (sortBy === 'name_asc') {
      result.sort((a, b) => a.title.localeCompare(b.title));
    }

    return result;
  }, [products, filters, sortBy]);

  return (
    <div className={`container ${styles.page}`}>
      <Breadcrumb items={[{ label: 'Shop' }]} style={{ marginBottom: 'var(--space-6)' }} />

      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>All Products</h1>
          <span className={styles.count}>
            {isLoading
              ? 'Loading...'
              : `Showing ${filteredProducts.length} of ${products.length} products`}
          </span>
        </div>

        <div className={styles.controls}>
          <button
            onClick={() => setIsMobileFilterOpen((prev) => !prev)}
            className={`btn btn-secondary btn-sm ${styles.mobileFilterBtn}`}
          >
            <SlidersHorizontal size={14} /> Filters
          </button>

          <div className={styles.sortWrapper}>
            <span className={styles.sortLabel}>Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={styles.sortSelect}
            >
              <option value="featured">Featured</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="name_asc">Name: A to Z</option>
            </select>
          </div>
        </div>
      </div>

      <div className={styles.layout}>
        {/* Sidebar */}
        <aside className={`${styles.sidebar} ${isMobileFilterOpen ? styles.sidebarOpen : ''}`}>
          <FilterSidebar
            filters={filters}
            onFilterChange={setFilters}
            onClear={() => setFilters(DEFAULT_FILTERS)}
          />
        </aside>

        {/* Product Grid */}
        <main className={styles.mainContent}>
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
              <SlidersHorizontal size={40} color="var(--color-text-tertiary)" />
              <div>
                <h4 className={styles.emptyTitle}>No products found</h4>
                <p className={styles.emptyDesc}>
                  Try resetting your filters or adjusting your price limits.
                </p>
              </div>
              <button
                onClick={() => setFilters(DEFAULT_FILTERS)}
                className="btn btn-secondary btn-sm"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
