'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Search, ShoppingCart, Heart, User, Menu, X, ChevronDown, ChevronRight,
} from 'lucide-react';
import { useCart } from '@/lib/context/CartContext';
import { useWishlist } from '@/lib/context/WishlistContext';
import { categoryData } from '@/lib/categoriesData';
import { searchProducts } from '@/lib/api/products';
import { useRegion } from '@/lib/context/RegionContext';
import { debounce } from '@/lib/utils';
import styles from './Navbar.module.css';

/* Featured nav links for the bottom mega-menu bar */
const QUICK_LINKS = [
  { label: 'Gaming Laptops', href: '/collections/gaming-laptops' },
  { label: 'Laptops', href: '/collections/laptop' },
  { label: 'Monitors', href: '/collections/monitors-tv-display' },
  { label: 'SSD Drives', href: '/collections/storage' },
  { label: 'Printers', href: '/collections/printers' },
  { label: 'CCTV Kits', href: '/collections/security-cctv' },
  { label: 'Networking', href: '/collections/networking' },
  { label: 'Components', href: '/collections/components' },
];

interface SearchResult {
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

export function Navbar() {
  const { itemCount, toggleCart } = useCart();
  const { itemCount: wishlistCount } = useWishlist();
  const { regionId } = useRegion();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const megaMenuRef = useRef<HTMLDivElement>(null);
  const megaMenuTimer = useRef<NodeJS.Timeout | null>(null);

  /* Search with debounce */
  const performSearch = useCallback(
    debounce(async (query: string) => {
      if (query.length < 2) {
        setSearchResults([]);
        setShowSearchResults(false);
        return;
      }
      setIsSearching(true);
      try {
        const data = await searchProducts(query, regionId);
        setSearchResults(data.products?.slice(0, 6) || []);
        setShowSearchResults(true);
      } catch {
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 350),
    [regionId]
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    performSearch(val);
  };

  /* Close search dropdown on outside click */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearchResults(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  /* Mega Menu hover logic */
  const handleCategoryEnter = (index: number) => {
    if (megaMenuTimer.current) clearTimeout(megaMenuTimer.current);
    setActiveCategory(index);
  };

  const handleCategoryLeave = () => {
    megaMenuTimer.current = setTimeout(() => {
      setActiveCategory(null);
    }, 200);
  };

  const handleMegaMenuEnter = () => {
    if (megaMenuTimer.current) clearTimeout(megaMenuTimer.current);
  };

  const handleMegaMenuLeave = () => {
    setActiveCategory(null);
  };

  /* Format price for search results */
  const formatSearchPrice = (product: SearchResult) => {
    const price = product.variants?.[0]?.calculated_price;
    if (!price) return '';
    const amount = price.calculated_amount / 100;
    return `R ${amount.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`;
  };

  return (
    <header className={styles.header}>
      {/* ─── Main Header Row ─── */}
      <div className={styles.mainHeader}>
        <div className={styles.mainContainer}>
          {/* Mobile Menu Toggle */}
          <button
            className={styles.mobileMenuBtn}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          {/* Logo */}
          <Link href="/" className={styles.logo}>
            <div className={styles.logoIcon}>CRM</div>
            <div className={styles.logoText}>
              <span className={styles.logoName}>CRM Technology</span>
              <span className={styles.logoTag}>IT Hardware & Solutions</span>
            </div>
          </Link>

          {/* Search Bar */}
          <div className={styles.searchWrapper} ref={searchRef}>
            <div className={styles.searchBar}>
              <Search size={18} className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Search laptops, SSDs, monitors, printers..."
                className={styles.searchInput}
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => searchResults.length > 0 && setShowSearchResults(true)}
                id="header-search"
              />
              <button className={styles.searchBtn}>Search</button>
            </div>

            {/* Search Results Dropdown */}
            {showSearchResults && (
              <div className={styles.searchDropdown}>
                {isSearching ? (
                  <div className={styles.searchLoading}>Searching...</div>
                ) : searchResults.length > 0 ? (
                  <>
                    {searchResults.map((product) => (
                      <Link
                        key={product.id}
                        href={`/products/${product.handle}`}
                        className={styles.searchResultItem}
                        onClick={() => {
                          setShowSearchResults(false);
                          setSearchQuery('');
                        }}
                      >
                        <div className={styles.searchResultThumb}>
                          {product.thumbnail ? (
                            <img src={product.thumbnail} alt={product.title} />
                          ) : (
                            <div className={styles.searchNoThumb} />
                          )}
                        </div>
                        <div className={styles.searchResultInfo}>
                          <span className={styles.searchResultTitle}>{product.title}</span>
                          <span className={styles.searchResultPrice}>
                            {formatSearchPrice(product)}
                          </span>
                        </div>
                      </Link>
                    ))}
                    <Link
                      href={`/search?q=${encodeURIComponent(searchQuery)}`}
                      className={styles.searchViewAll}
                      onClick={() => setShowSearchResults(false)}
                    >
                      View all results for &ldquo;{searchQuery}&rdquo;
                    </Link>
                  </>
                ) : (
                  <div className={styles.searchLoading}>No products found</div>
                )}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className={styles.actions}>
            <Link href="/account" className={styles.actionBtn} aria-label="Account">
              <User size={20} />
              <span className={styles.actionLabel}>Account</span>
            </Link>
            <Link href="/account" className={styles.actionBtn} aria-label="Wishlist">
              <div className={styles.iconBadgeWrap}>
                <Heart size={20} />
                {wishlistCount > 0 && (
                  <span className={styles.badgeCount}>{wishlistCount}</span>
                )}
              </div>
              <span className={styles.actionLabel}>Wishlist</span>
            </Link>
            <button onClick={toggleCart} className={styles.actionBtn} aria-label="Shopping cart">
              <div className={styles.iconBadgeWrap}>
                <ShoppingCart size={20} />
                {itemCount > 0 && (
                  <span className={styles.badgeCount}>{itemCount}</span>
                )}
              </div>
              <span className={styles.actionLabel}>Cart</span>
            </button>
          </div>
        </div>
      </div>

      {/* ─── Bottom Navigation Bar ─── */}
      <nav className={styles.navBar}>
        <div className={styles.navContainer}>
          {/* All Categories Button */}
          <div
            className={styles.allCategoriesWrap}
            onMouseEnter={() => handleCategoryEnter(-1)}
            onMouseLeave={handleCategoryLeave}
          >
            <button className={styles.allCategoriesBtn}>
              <Menu size={16} />
              <span>All Categories</span>
              <ChevronDown size={14} />
            </button>

            {/* Mega Menu Dropdown */}
            {activeCategory !== null && (
              <div
                className={styles.megaMenu}
                ref={megaMenuRef}
                onMouseEnter={handleMegaMenuEnter}
                onMouseLeave={handleMegaMenuLeave}
              >
                <div className={styles.megaMenuSidebar}>
                  {categoryData.map((cat, idx) => (
                    <button
                      key={cat.name}
                      className={`${styles.megaCatItem} ${activeCategory === idx ? styles.megaCatItemActive : ''}`}
                      onMouseEnter={() => setActiveCategory(idx)}
                    >
                      <span>{cat.name}</span>
                      <ChevronRight size={14} />
                    </button>
                  ))}
                </div>
                {activeCategory >= 0 && categoryData[activeCategory] && (
                  <div className={styles.megaMenuContent}>
                    <h3 className={styles.megaMenuTitle}>
                      {categoryData[activeCategory].name}
                    </h3>
                    <div className={styles.megaMenuGrid}>
                      {categoryData[activeCategory].subcategories.map((sub) => (
                        <div key={sub.name} className={styles.megaSubGroup}>
                          <Link
                            href={sub.href}
                            className={styles.megaSubLink}
                            onClick={() => setActiveCategory(null)}
                          >
                            {sub.name}
                          </Link>
                          {sub.items && (
                            <ul className={styles.megaSubItems}>
                              {sub.items.map((item) => (
                                <li key={item}>
                                  <Link
                                    href={sub.href}
                                    className={styles.megaSubItemLink}
                                    onClick={() => setActiveCategory(null)}
                                  >
                                    {item}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div className={styles.quickLinks}>
            {QUICK_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className={styles.quickLink}>
                {link.label}
              </Link>
            ))}
          </div>

          {/* Hot Deals */}
          <Link href="/collections/sale" className={styles.hotDeals}>
            🔥 Hot Deals
          </Link>
        </div>
      </nav>

      {/* ─── Mobile Menu ─── */}
      {mobileMenuOpen && (
        <div className={styles.mobileOverlay}>
          <div className={styles.mobileMenu}>
            {/* Mobile Search */}
            <div className={styles.mobileSearchWrap}>
              <div className={styles.searchBar}>
                <Search size={16} className={styles.searchIcon} />
                <input
                  type="text"
                  placeholder="Search products..."
                  className={styles.searchInput}
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
              </div>
            </div>

            {/* Mobile Categories */}
            <div className={styles.mobileCats}>
              {categoryData.map((cat) => (
                <div key={cat.name} className={styles.mobileCatGroup}>
                  <Link
                    href={cat.href}
                    className={styles.mobileCatTitle}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {cat.name}
                  </Link>
                  <div className={styles.mobileCatSubs}>
                    {cat.subcategories.slice(0, 5).map((sub) => (
                      <Link
                        key={sub.name}
                        href={sub.href}
                        className={styles.mobileCatSub}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
