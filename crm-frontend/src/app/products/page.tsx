'use client';

import React, { useState, useEffect } from 'react';
import { SlidersHorizontal, ChevronDown, Check, Loader2 } from 'lucide-react';
import { getProducts, getCollections } from '@/lib/api/products';
import { formatPrice } from '@/lib/utils';
import ProductCard from '@/components/ui/ProductCard';
import Breadcrumb from '@/components/ui/Breadcrumb';
import Skeleton from '@/components/ui/Skeleton';

// Mock products for fallback
const MOCK_PRODUCTS = [
  { id: 'prod_1', title: 'Aura Premium Cotton Tee', handle: 'aura-premium-cotton-tee', thumbnail: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800', collection: { id: 'col_ess', title: 'Essentials' }, variants: [{ id: 'var_1', title: 'Black / M', calculated_price: { calculated_amount: 4500, original_amount: 6000, currency_code: 'USD' } }] },
  { id: 'prod_2', title: 'Minimalist Leather Cardholder', handle: 'minimalist-leather-cardholder', thumbnail: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800', collection: { id: 'col_acc', title: 'Accessories' }, variants: [{ id: 'var_2', title: 'Brown', calculated_price: { calculated_amount: 3500, currency_code: 'USD' } }] },
  { id: 'prod_3', title: 'Nebula Matte Sunglasses', handle: 'nebula-matte-sunglasses', thumbnail: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800', collection: { id: 'col_acc', title: 'Accessories' }, variants: [{ id: 'var_3', title: 'Dark Gray', calculated_price: { calculated_amount: 8500, original_amount: 11000, currency_code: 'USD' } }] },
  { id: 'prod_4', title: 'Nomad Tech Backpack 24L', handle: 'nomad-tech-backpack', thumbnail: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800', collection: { id: 'col_nom', title: 'Nomad' }, variants: [{ id: 'var_4', title: 'Matte Black', calculated_price: { calculated_amount: 14500, currency_code: 'USD' } }] },
  { id: 'prod_5', title: 'Solar Windbreaker Jacket', handle: 'solar-windbreaker-jacket', thumbnail: 'https://images.unsplash.com/photo-1548883354-7622d03aca27?w=800', collection: { id: 'col_ess', title: 'Essentials' }, variants: [{ id: 'var_5', title: 'Off-White', calculated_price: { calculated_amount: 11500, currency_code: 'USD' } }] },
  { id: 'prod_6', title: 'Apollo Linen Longsleeve', handle: 'apollo-linen-longsleeve', thumbnail: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800', collection: { id: 'col_ess', title: 'Essentials' }, variants: [{ id: 'var_6', title: 'Beige', calculated_price: { calculated_amount: 6500, original_amount: 8000, currency_code: 'USD' } }] },
];

const MOCK_CATEGORIES = [
  { id: 'col_ess', title: 'Essentials' },
  { id: 'col_acc', title: 'Accessories' },
  { id: 'col_nom', title: 'Nomad' },
];

export default function ProductsPage() {
  const [products, setProducts] = useState(MOCK_PRODUCTS);
  const [categories, setCategories] = useState(MOCK_CATEGORIES);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('featured');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const prodData = await getProducts();
        if (prodData?.products?.length) {
          setProducts(prodData.products);
        }
        const colData = await getCollections();
        if (colData?.collections?.length) {
          setCategories(colData.collections);
        }
      } catch (err) {
        console.warn('API error, using fallbacks', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const handleCategoryToggle = (id: string) => {
    setSelectedCategories(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  // Client-side filtering & sorting logic based on current states
  const filteredProducts = React.useMemo(() => {
    let result = [...products];

    // Filter by category
    if (selectedCategories.length > 0) {
      result = result.filter(p => p.collection?.id && selectedCategories.includes(p.collection.id));
    }

    // Filter by price
    const minVal = parseFloat(priceRange.min) * 100;
    const maxVal = parseFloat(priceRange.max) * 100;
    if (!isNaN(minVal)) {
      result = result.filter(p => (p.variants?.[0]?.calculated_price?.calculated_amount || 0) >= minVal);
    }
    if (!isNaN(maxVal)) {
      result = result.filter(p => (p.variants?.[0]?.calculated_price?.calculated_amount || 0) <= maxVal);
    }

    // Sort products
    if (sortBy === 'price_asc') {
      result.sort((a, b) => (a.variants?.[0]?.calculated_price?.calculated_amount || 0) - (b.variants?.[0]?.calculated_price?.calculated_amount || 0));
    } else if (sortBy === 'price_desc') {
      result.sort((a, b) => (b.variants?.[0]?.calculated_price?.calculated_amount || 0) - (a.variants?.[0]?.calculated_price?.calculated_amount || 0));
    }

    return result;
  }, [products, selectedCategories, priceRange, sortBy]);

  return (
    <div className="container" style={{ paddingTop: 'var(--space-8)', paddingBottom: 'var(--space-12)' }}>
      {/* Breadcrumb */}
      <Breadcrumb items={[{ label: 'Shop' }]} style={{ marginBottom: 'var(--space-6)' }} />

      {/* Header section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-8)', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
        <div>
          <h1 style={{ fontSize: 'var(--text-3xl)' }}>Shop Products</h1>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginTop: '4px', display: 'block' }}>
            Showing {filteredProducts.length} of {products.length} products
          </span>
        </div>

        {/* Sort Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
          {/* Mobile Filter Trigger */}
          <button
            onClick={() => setIsMobileFilterOpen(prev => !prev)}
            className="btn btn-secondary btn-sm mobile-filter-btn"
          >
            <SlidersHorizontal size={14} /> Filters
          </button>

          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginRight: 'var(--space-2)' }}>Sort By:</span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="glass-input"
              style={{
                width: '180px',
                padding: 'var(--space-2) var(--space-4)',
                fontSize: 'var(--text-sm)',
                borderRadius: 'var(--radius-md)',
              }}
            >
              <option value="featured" style={{ background: 'var(--color-bg-secondary)' }}>Featured</option>
              <option value="price_asc" style={{ background: 'var(--color-bg-secondary)' }}>Price: Low to High</option>
              <option value="price_desc" style={{ background: 'var(--color-bg-secondary)' }}>Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Layout Row */}
      <div className="shop-layout">
        {/* Sidebar Filter Panel */}
        <aside className={`filter-sidebar ${isMobileFilterOpen ? 'mobile-open' : ''}`}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
            {/* Header for mobile view */}
            <div className="mobile-filter-header" style={{ display: 'none', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 'var(--font-weight-bold)' }}>Filters</span>
              <button onClick={() => setIsMobileFilterOpen(false)} style={{ color: 'var(--color-text-secondary)' }}>Done</button>
            </div>

            {/* Categories group */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <h3 style={{ fontSize: 'var(--text-sm)', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-secondary)' }}>
                Categories
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                {categories.map(cat => {
                  const isChecked = selectedCategories.includes(cat.id);
                  return (
                    <button
                      key={cat.id}
                      onClick={() => handleCategoryToggle(cat.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--space-3)',
                        padding: 'var(--space-2) 0',
                        textAlign: 'left',
                        cursor: 'pointer',
                        color: isChecked ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                        transition: 'color var(--transition-fast)',
                      }}
                    >
                      <div
                        style={{
                          width: '18px',
                          height: '18px',
                          borderRadius: 'var(--radius-sm)',
                          border: `1px solid ${isChecked ? 'var(--color-accent-violet)' : 'var(--color-border)'}`,
                          background: isChecked ? 'var(--color-accent-violet)' : 'transparent',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {isChecked && <Check size={12} color="#ffffff" />}
                      </div>
                      <span style={{ fontSize: 'var(--text-sm)' }}>{cat.title}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Price Filter group */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <h3 style={{ fontSize: 'var(--text-sm)', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-secondary)' }}>
                Price Range
              </h3>
              <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
                <input
                  type="number"
                  placeholder="Min ($)"
                  value={priceRange.min}
                  onChange={e => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                  className="glass-input"
                  style={{ padding: 'var(--space-2)', fontSize: 'var(--text-sm)' }}
                />
                <span style={{ color: 'var(--color-text-tertiary)' }}>&ndash;</span>
                <input
                  type="number"
                  placeholder="Max ($)"
                  value={priceRange.max}
                  onChange={e => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                  className="glass-input"
                  style={{ padding: 'var(--space-2)', fontSize: 'var(--text-sm)' }}
                />
              </div>
            </div>
          </div>
        </aside>

        {/* Product Grid Area */}
        <main style={{ flexGrow: 1 }}>
          {isLoading ? (
            <div className="product-listing-grid">
              {Array.from({ length: 6 }).map((_, i) => (
                <ProductCard key={i} loading={true} />
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="product-listing-grid">
              {filteredProducts.map(prod => (
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
                <p style={{ fontSize: 'var(--text-sm)', marginTop: '4px' }}>Try resetting your filters or adjusting your price limits.</p>
              </div>
              <button
                onClick={() => {
                  setSelectedCategories([]);
                  setPriceRange({ min: '', max: '' });
                }}
                className="btn btn-secondary btn-sm"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </main>
      </div>

      <style jsx global>{`
        .shop-layout {
          display: flex;
          gap: var(--space-8);
        }
        .filter-sidebar {
          width: 260px;
          flex-shrink: 0;
        }
        .product-listing-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--space-6);
        }
        .mobile-filter-btn {
          display: none !important;
        }
        @media (max-width: 992px) {
          .product-listing-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 768px) {
          .shop-layout {
            flex-direction: column;
          }
          .mobile-filter-btn {
            display: inline-flex !important;
          }
          .filter-sidebar {
            display: none;
            width: 100%;
            padding: var(--space-6);
            background: var(--color-bg-secondary);
            border: 1px solid var(--color-border);
            border-radius: var(--radius-xl);
          }
          .filter-sidebar.mobile-open {
            display: block;
          }
          .mobile-filter-header {
            display: flex !important;
          }
        }
        @media (max-width: 480px) {
          .product-listing-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
