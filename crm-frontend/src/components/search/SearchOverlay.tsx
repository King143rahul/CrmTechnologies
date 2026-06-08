'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, X, Loader2, History, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { searchProducts } from '@/lib/api/products';
import { formatPrice } from '@/lib/utils';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ProductResult {
  id: string;
  title: string;
  handle: string;
  thumbnail: string;
  variants?: Array<{
    calculated_price?: {
      calculated_amount: number;
      currency_code: string;
    };
  }>;
}

export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ProductResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('recent_searches');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setQuery('');
      setResults([]);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Debounced search logic
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    const delay = setTimeout(async () => {
      try {
        const data = await searchProducts(query);
        setResults(data.products || []);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }, 350);

    return () => clearTimeout(delay);
  }, [query]);

  const saveSearchTerm = (term: string) => {
    const trimmed = term.trim();
    if (!trimmed) return;
    const next = [trimmed, ...recentSearches.filter(t => t !== trimmed)].slice(0, 5);
    setRecentSearches(next);
    localStorage.setItem('recent_searches', JSON.stringify(next));
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    saveSearchTerm(query);
    onClose();
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  const handleRecentClick = (term: string) => {
    setQuery(term);
    saveSearchTerm(term);
    onClose();
    router.push(`/search?q=${encodeURIComponent(term)}`);
  };

  const clearRecent = () => {
    setRecentSearches([]);
    localStorage.removeItem('recent_searches');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 300,
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          {/* Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.5)',
              backdropFilter: 'blur(4px)',
            }}
          />

          {/* Search Content wrapper */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{
              position: 'relative',
              width: '90%',
              maxWidth: '720px',
              marginTop: '10vh',
              display: 'flex',
              flexDirection: 'column',
              zIndex: 10,
              gap: 'var(--space-4)',
            }}
          >
            {/* Search Input Box */}
            <form onSubmit={handleSearchSubmit} style={{ position: 'relative', width: '100%' }}>
              <div
                style={{
                  position: 'absolute',
                  left: 'var(--space-4)',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--color-blue)',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {isLoading ? <Loader2 className="animate-spin" size={22} /> : <Search size={22} />}
              </div>
              <input
                ref={inputRef}
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search for products, brands or categories..."
                style={{
                  width: '100%',
                  background: '#ffffff',
                  border: '2px solid var(--color-blue)',
                  borderRadius: 'var(--radius-full)',
                  color: 'var(--color-text-primary)',
                  padding: '16px 48px 16px 48px',
                  fontSize: 'var(--text-lg)',
                  outline: 'none',
                  boxShadow: 'var(--shadow-lg)',
                }}
              />
              <button
                type="button"
                onClick={onClose}
                style={{
                  position: 'absolute',
                  right: 'var(--space-4)',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  cursor: 'pointer',
                  color: 'var(--color-text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <X size={22} />
              </button>
            </form>

            {/* Results / Suggestions Card */}
            <div
              style={{
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--space-6)',
                maxHeight: '60vh',
                overflowY: 'auto',
                boxShadow: 'var(--shadow-xl)',
                background: '#ffffff',
                border: '1px solid var(--color-border)'
              }}
            >
              {query.trim().length === 0 ? (
                // Show Recent Searches
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
                    <h4 style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', textTransform: 'uppercase', fontWeight: 'var(--font-weight-bold)' }}>
                      Recent Searches
                    </h4>
                    {recentSearches.length > 0 && (
                      <button onClick={clearRecent} style={{ fontSize: 'var(--text-xs)', color: 'var(--color-error)', cursor: 'pointer' }}>
                        Clear All
                      </button>
                    )}
                  </div>
                  {recentSearches.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                      {recentSearches.map((term, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleRecentClick(term)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--space-3)',
                            padding: 'var(--space-2) var(--space-3)',
                            borderRadius: 'var(--radius-md)',
                            background: 'transparent',
                            color: 'var(--color-text-secondary)',
                            textAlign: 'left',
                            cursor: 'pointer',
                            transition: 'background-color var(--transition-fast), color var(--transition-fast)',
                          }}
                          onMouseEnter={e => {
                            e.currentTarget.style.backgroundColor = 'var(--color-bg-secondary)';
                            e.currentTarget.style.color = 'var(--color-blue)';
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.color = 'var(--color-text-secondary)';
                          }}
                        >
                          <History size={16} />
                          <span style={{ fontSize: 'var(--text-sm)' }}>{term}</span>
                          <ArrowRight size={14} style={{ marginLeft: 'auto', opacity: 0.6 }} />
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-tertiary)', textAlign: 'center', padding: 'var(--space-4) 0' }}>
                      No recent searches.
                    </div>
                  )}
                </div>
              ) : (
                // Show Real-time results
                <div>
                  <h4 style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', textTransform: 'uppercase', fontWeight: 'var(--font-weight-bold)', marginBottom: 'var(--space-4)' }}>
                    Search Results ({results.length})
                  </h4>

                  {results.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                      {results.map(prod => {
                        const price = prod.variants?.[0]?.calculated_price?.calculated_amount || 0;
                        const currency = prod.variants?.[0]?.calculated_price?.currency_code || 'USD';
                        return (
                          <Link
                            key={prod.id}
                            href={`/products/${prod.handle}`}
                            onClick={() => {
                              saveSearchTerm(query);
                              onClose();
                            }}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 'var(--space-4)',
                              padding: 'var(--space-3)',
                              borderRadius: 'var(--radius-md)',
                              background: '#ffffff',
                              border: '1px solid var(--color-border)',
                              transition: 'border-color var(--transition-fast), box-shadow var(--transition-fast)',
                            }}
                            onMouseEnter={e => {
                              e.currentTarget.style.borderColor = 'var(--color-blue)';
                              e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                            }}
                            onMouseLeave={e => {
                              e.currentTarget.style.borderColor = 'var(--color-border)';
                              e.currentTarget.style.boxShadow = 'none';
                            }}
                          >
                            <img
                              src={prod.thumbnail}
                              alt={prod.title}
                              style={{
                                width: '48px',
                                height: '48px',
                                borderRadius: 'var(--radius-sm)',
                                objectFit: 'cover',
                                background: 'var(--color-bg-secondary)'
                              }}
                            />
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                              <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-navy)' }}>
                                {prod.title}
                              </span>
                              <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-blue)', fontWeight: 'var(--font-weight-bold)' }}>
                                {formatPrice(price, currency)}
                              </span>
                            </div>
                            <ArrowRight size={16} style={{ marginLeft: 'auto', color: 'var(--color-text-tertiary)' }} />
                          </Link>
                        );
                      })}
                    </div>
                  ) : (
                    !isLoading && (
                      <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-tertiary)', textAlign: 'center', padding: 'var(--space-8) 0' }}>
                        No products found matching &ldquo;{query}&rdquo;.
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default SearchOverlay;
