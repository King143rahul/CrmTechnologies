'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { ShoppingCart, Heart, User, Search, Menu, ChevronDown, X } from 'lucide-react';
import { useCart } from '@/lib/context/CartContext';
import { useWishlist } from '@/lib/context/WishlistContext';
import { useCustomer } from '@/lib/context/CustomerContext';
import { useRegion } from '@/lib/context/RegionContext';
import { searchProducts } from '@/lib/api/products';
import { formatPrice } from '@/lib/utils';
import { debounce } from '@/lib/utils';
import MobileMenu from './MobileMenu';
import { categoryData } from '@/lib/categoriesData';
import styles from './Navbar.module.css';

interface SearchResult {
  id: string;
  title: string;
  handle: string;
  thumbnail: string | null;
  variants?: Array<{
    calculated_price?: {
      calculated_amount: number;
      currency_code: string;
    };
  }>;
}

export function Navbar() {
  const { toggleCart, itemCount } = useCart();
  const { itemCount: wishlistCount } = useWishlist();
  const { isAuthenticated } = useCustomer();
  const { regionId } = useRegion();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const megaMenuRef = useRef<HTMLDivElement>(null);
  const megaMenuTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close search on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearchDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mega menu on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMegaMenuOpen(false);
        setShowSearchDropdown(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce(async (query: string) => {
      if (query.length < 2) {
        setSearchResults([]);
        setShowSearchDropdown(false);
        return;
      }
      setIsSearching(true);
      try {
        const data = await searchProducts(query, regionId);
        if (data?.products) {
          setSearchResults(data.products.slice(0, 8));
          setShowSearchDropdown(true);
        }
      } catch {
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 350),
    [regionId]
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    debouncedSearch(value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSearchDropdown(false);
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  const handleMegaMouseEnter = () => {
    if (megaMenuTimerRef.current) clearTimeout(megaMenuTimerRef.current);
    setIsMegaMenuOpen(true);
  };

  const handleMegaMouseLeave = () => {
    megaMenuTimerRef.current = setTimeout(() => setIsMegaMenuOpen(false), 150);
  };

  return (
    <>
      <header className={`${styles.header} ${isScrolled ? styles.headerScrolled : ''}`}>
        {/* Row 1: Logo, Search, Actions */}
        <div className={styles.mainRow}>
          <div className={`container ${styles.mainRowInner}`}>
            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className={styles.mobileToggle}
              aria-label="Open menu"
            >
              <Menu size={24} />
            </button>

            {/* Logo */}
            <Link href="/" className={styles.logo}>
              <div className={styles.logoIcon}>CR</div>
              <div className={styles.logoText}>
                <span className={styles.logoName}>CRM</span>
                <span className={styles.logoTag}>Technology</span>
              </div>
            </Link>

            {/* Search Bar */}
            <div className={styles.searchContainer} ref={searchRef}>
              <form onSubmit={handleSearchSubmit} className={styles.searchWrapper}>
                <Search size={18} className={styles.searchIcon} />
                <input
                  type="text"
                  placeholder="Search laptops, components, accessories..."
                  className={styles.searchInput}
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={() => {
                    if (searchResults.length > 0) setShowSearchDropdown(true);
                  }}
                />
                {searchQuery && (
                  <button
                    type="button"
                    className={styles.searchClear}
                    onClick={() => {
                      setSearchQuery('');
                      setSearchResults([]);
                      setShowSearchDropdown(false);
                    }}
                    aria-label="Clear search"
                  >
                    <X size={16} />
                  </button>
                )}
                <button type="submit" className={styles.searchBtn} aria-label="Search">
                  Search
                </button>
              </form>

              {/* Search Dropdown */}
              {showSearchDropdown && (
                <div className={styles.searchDropdown}>
                  {isSearching ? (
                    <div className={styles.searchLoading}>
                      <div className={styles.searchSpinner} />
                      Searching...
                    </div>
                  ) : searchResults.length > 0 ? (
                    <>
                      <div className={styles.searchDropdownHeader}>
                        {searchResults.length} results for &ldquo;{searchQuery}&rdquo;
                      </div>
                      {searchResults.map((product) => {
                        const price = product.variants?.[0]?.calculated_price;
                        return (
                          <Link
                            key={product.id}
                            href={`/products/${product.handle}`}
                            className={styles.searchResultItem}
                            onClick={() => setShowSearchDropdown(false)}
                          >
                            <div className={styles.searchResultThumbWrap}>
                              {product.thumbnail ? (
                                <img
                                  src={product.thumbnail}
                                  alt={product.title}
                                  className={styles.searchResultThumb}
                                />
                              ) : (
                                <div className={styles.searchResultThumbEmpty} />
                              )}
                            </div>
                            <div className={styles.searchResultInfo}>
                              <div className={styles.searchResultTitle}>{product.title}</div>
                              {price && (
                                <div className={styles.searchResultPrice}>
                                  {formatPrice(price.calculated_amount, price.currency_code)}
                                </div>
                              )}
                            </div>
                          </Link>
                        );
                      })}
                      <div className={styles.searchDropdownFooter}>
                        <button
                          onClick={() => {
                            setShowSearchDropdown(false);
                            window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
                          }}
                          className={styles.searchViewAll}
                        >
                          View all results for &ldquo;{searchQuery}&rdquo;
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className={styles.searchNoResults}>
                      No products found for &ldquo;{searchQuery}&rdquo;
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className={styles.actions}>
              {/* Account */}
              <Link
                href={isAuthenticated ? '/account' : '/account/login'}
                className={styles.actionBtn}
              >
                <User size={22} strokeWidth={1.5} />
                <span className={styles.actionLabel}>{isAuthenticated ? 'My Account' : 'Sign In'}</span>
              </Link>

              {/* Wishlist */}
              <Link href="/account?tab=wishlist" className={styles.actionBtn}>
                <div className={styles.actionIconWrap}>
                  <Heart size={22} strokeWidth={1.5} />
                  {wishlistCount > 0 && (
                    <span className={styles.badgeCount}>{wishlistCount > 99 ? '99+' : wishlistCount}</span>
                  )}
                </div>
                <span className={styles.actionLabel}>Wishlist</span>
              </Link>

              {/* Cart Trigger */}
              <button
                onClick={toggleCart}
                className={`${styles.actionBtn} ${styles.cartBtn}`}
                aria-label="Open cart"
              >
                <div className={styles.cartIconWrap}>
                  <ShoppingCart size={24} strokeWidth={1.5} />
                  {itemCount > 0 && (
                    <span className={`${styles.badgeCount} ${styles.cartBadge}`}>
                      {itemCount > 99 ? '99+' : itemCount}
                    </span>
                  )}
                </div>
                <div className={styles.cartText}>
                  <span className={styles.cartTextLabel}>My Basket</span>
                  <span className={styles.cartTextValue}>
                    {itemCount > 0 ? `${itemCount} item${itemCount > 1 ? 's' : ''}` : 'Empty'}
                  </span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Row 2: Navigation Categories */}
        <div className={styles.categoryNav}>
          <div className="container">
            <nav className={styles.categoryNavInner}>
              {/* All Departments Mega Menu */}
              <div
                className={styles.deptWrapper}
                onMouseEnter={handleMegaMouseEnter}
                onMouseLeave={handleMegaMouseLeave}
                ref={megaMenuRef}
              >
                <button
                  className={styles.deptBtn}
                  onClick={() => setIsMegaMenuOpen(prev => !prev)}
                  aria-expanded={isMegaMenuOpen}
                  aria-haspopup="true"
                >
                  <Menu size={16} />
                  All Departments
                  <ChevronDown size={15} className={`${styles.chevron} ${isMegaMenuOpen ? styles.chevronOpen : ''}`} />
                </button>

                {isMegaMenuOpen && (
                  <div className={styles.megaMenu} onMouseEnter={handleMegaMouseEnter} onMouseLeave={handleMegaMouseLeave}>
                    <div className={styles.megaMenuGrid}>
                      {categoryData.map((category) => (
                        <div key={category.name} className={styles.megaMenuColumn}>
                          <Link
                            href={category.href}
                            className={styles.megaMenuHeading}
                            onClick={() => setIsMegaMenuOpen(false)}
                          >
                            {category.name}
                          </Link>
                          <ul className={styles.subCatList}>
                            {category.subcategories.map((sub) => (
                              <li key={sub.name} className={styles.subCatItem}>
                                <Link
                                  href={sub.href}
                                  className={styles.subCatLink}
                                  onClick={() => setIsMegaMenuOpen(false)}
                                >
                                  {sub.name}
                                </Link>
                                {sub.items && (
                                  <ul className={styles.nestedItemsList}>
                                    {sub.items.map((item) => {
                                      const itemHref = `${sub.href}?q=${encodeURIComponent(item)}`;
                                      return (
                                        <li key={item} className={styles.nestedItem}>
                                          <Link
                                            href={itemHref}
                                            className={styles.nestedLink}
                                            onClick={() => setIsMegaMenuOpen(false)}
                                          >
                                            {item}
                                          </Link>
                                        </li>
                                      );
                                    })}
                                  </ul>
                                )}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Category Quick Links */}
              <div className={styles.navLinksScroll}>
                {categoryData.map((cat, idx) => (
                  <Link
                    key={idx}
                    href={cat.href}
                    className={styles.categoryLink}
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </nav>
          </div>
        </div>
      </header>

      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    </>
  );
}

export default Navbar;
