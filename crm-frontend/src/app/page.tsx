'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Laptop, Monitor, HardDrive, Printer, Wifi, Shield, Cpu, Gamepad2, ArrowRight } from 'lucide-react';
import { getProducts, getCollections } from '@/lib/api/products';
import { useRegion } from '@/lib/context/RegionContext';
import ProductCard from '@/components/ui/ProductCard';
import styles from './HomePage.module.css';

/* ─── Category icons mapped ─── */
const CATEGORIES = [
  { name: 'Laptops', icon: Laptop, href: '/collections/laptop', color: '#3B82F6' },
  { name: 'Gaming', icon: Gamepad2, href: '/collections/gaming-laptops', color: '#8B5CF6' },
  { name: 'Monitors', icon: Monitor, href: '/collections/monitors-tv-display', color: '#EC4899' },
  { name: 'SSD / Storage', icon: HardDrive, href: '/collections/storage', color: '#F59E0B' },
  { name: 'Components', icon: Cpu, href: '/collections/components', color: '#10B981' },
  { name: 'Printers', icon: Printer, href: '/collections/printers', color: '#6366F1' },
  { name: 'Networking', icon: Wifi, href: '/collections/networking', color: '#14B8A6' },
  { name: 'CCTV', icon: Shield, href: '/collections/security-cctv', color: '#EF4444' },
];

/* ─── Hero slides ─── */
const HERO_SLIDES = [
  {
    title: 'Premium IT Hardware',
    subtitle: 'South Africa\'s Trusted Tech Partner',
    description: 'Laptops, SSDs, Monitors & more at competitive prices. Free delivery on orders over R2,000.',
    cta: 'Shop Now',
    ctaHref: '/collections/laptop',
    bgGradient: 'linear-gradient(135deg, #1B3A5C 0%, #2C5A8A 100%)',
    accentColor: '#60A5FA',
  },
  {
    title: 'Gaming Laptops',
    subtitle: 'ASUS • Acer • Lenovo',
    description: 'High-performance gaming laptops with RTX graphics. Starting from R12,999.',
    cta: 'Explore Gaming',
    ctaHref: '/collections/gaming-laptops',
    bgGradient: 'linear-gradient(135deg, #581C87 0%, #7C3AED 100%)',
    accentColor: '#C084FC',
  },
  {
    title: 'SSD Upgrades',
    subtitle: 'Boost Your Speed',
    description: 'NVMe & SATA SSDs from Samsung, WD, Crucial. Transform your laptop performance.',
    cta: 'Shop SSDs',
    ctaHref: '/collections/storage',
    bgGradient: 'linear-gradient(135deg, #0F766E 0%, #14B8A6 100%)',
    accentColor: '#5EEAD4',
  },
];

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
  created_at?: string;
}

type TabKey = 'featured' | 'sale' | 'top';

export default function HomePage() {
  const { regionId } = useRegion();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [saleProducts, setSaleProducts] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabKey>('featured');
  const [heroIndex, setHeroIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  /* ─── Load products ─── */
  useEffect(() => {
    if (!regionId) return;

    const loadData = async () => {
      setIsLoading(true);
      try {
        const [featuredRes, newRes] = await Promise.all([
          getProducts({ limit: 20, regionId }),
          getProducts({ limit: 12, order: '-created_at', regionId }),
        ]);

        const allProducts: Product[] = featuredRes.products || [];
        setFeaturedProducts(allProducts.slice(0, 8));
        setNewArrivals(newRes.products || []);

        // Filter sale items: those with original_amount > calculated_amount
        const onSale = allProducts.filter((p: Product) => {
          const v = p.variants?.[0]?.calculated_price;
          return v && v.original_amount && v.original_amount > v.calculated_amount;
        });
        setSaleProducts(onSale.slice(0, 8));
      } catch (err) {
        console.error('Failed to load products:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [regionId]);

  /* ─── Auto-rotate hero ─── */
  useEffect(() => {
    const timer = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  /* ─── Tab products logic ─── */
  const getTabProducts = () => {
    switch (activeTab) {
      case 'sale': return saleProducts;
      case 'top': return [...featuredProducts].reverse().slice(0, 8);
      default: return featuredProducts;
    }
  };

  /* ─── Carousel scroll ─── */
  const scrollCarousel = (dir: 'left' | 'right') => {
    if (!carouselRef.current) return;
    const scrollAmount = 300;
    carouselRef.current.scrollBy({
      left: dir === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  const currentSlide = HERO_SLIDES[heroIndex];

  return (
    <div className={styles.page}>
      {/* ═══════════════════════════════════════════════
          SECTION 1: Hero Banner Slider
          ═══════════════════════════════════════════════ */}
      <section className={styles.heroSection}>
        <div
          className={styles.heroBanner}
          style={{ background: currentSlide.bgGradient }}
        >
          <div className={styles.heroContainer}>
            <div className={styles.heroContent}>
              <span className={styles.heroLabel} style={{ color: currentSlide.accentColor }}>
                {currentSlide.subtitle}
              </span>
              <h1 className={styles.heroTitle}>{currentSlide.title}</h1>
              <p className={styles.heroDesc}>{currentSlide.description}</p>
              <Link href={currentSlide.ctaHref} className={styles.heroCta}>
                {currentSlide.cta}
                <ArrowRight size={18} />
              </Link>
            </div>
            <div className={styles.heroVisual}>
              <div
                className={styles.heroGlow}
                style={{ background: currentSlide.accentColor }}
              />
            </div>
          </div>

          {/* Dots */}
          <div className={styles.heroDots}>
            {HERO_SLIDES.map((_, idx) => (
              <button
                key={idx}
                className={`${styles.heroDot} ${heroIndex === idx ? styles.heroDotActive : ''}`}
                onClick={() => setHeroIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          {/* Arrows */}
          <button
            className={`${styles.heroArrow} ${styles.heroArrowLeft}`}
            onClick={() => setHeroIndex((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}
            aria-label="Previous slide"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            className={`${styles.heroArrow} ${styles.heroArrowRight}`}
            onClick={() => setHeroIndex((prev) => (prev + 1) % HERO_SLIDES.length)}
            aria-label="Next slide"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          SECTION 2: Shop By Category
          ═══════════════════════════════════════════════ */}
      <section className={styles.section}>
        <div className={styles.sectionContainer}>
          <h2 className="section-title">Shop By Category</h2>
          <p className="section-subtitle">Browse our wide range of IT hardware and accessories</p>

          <div className={styles.categoryGrid}>
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link key={cat.name} href={cat.href} className={styles.categoryCard}>
                  <div
                    className={styles.categoryIconWrap}
                    style={{ background: `${cat.color}12`, color: cat.color }}
                  >
                    <Icon size={28} strokeWidth={1.5} />
                  </div>
                  <span className={styles.categoryName}>{cat.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          SECTION 3: Discover Our Best Products (Tabbed)
          ═══════════════════════════════════════════════ */}
      <section className={styles.section}>
        <div className={styles.sectionContainer}>
          <h2 className="section-title">Discover Our Best Products</h2>
          <p className="section-subtitle">Curated selection of top IT hardware deals</p>

          {/* Tabs */}
          <div className={styles.tabs}>
            <button
              className={`${styles.tab} ${activeTab === 'featured' ? styles.tabActive : ''}`}
              onClick={() => setActiveTab('featured')}
            >
              Featured
            </button>
            <button
              className={`${styles.tab} ${activeTab === 'sale' ? styles.tabActive : ''}`}
              onClick={() => setActiveTab('sale')}
            >
              Sale
            </button>
            <button
              className={`${styles.tab} ${activeTab === 'top' ? styles.tabActive : ''}`}
              onClick={() => setActiveTab('top')}
            >
              Top Rated
            </button>
          </div>

          {/* Product Grid */}
          <div className={styles.productGrid}>
            {isLoading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <ProductCard key={`skeleton-${i}`} loading />
                ))
              : getTabProducts().length > 0
                ? getTabProducts().map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))
                : (
                    <div className={styles.emptyState}>
                      <p>No products found in this category.</p>
                    </div>
                  )
            }
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          SECTION 4: New Arrivals (Horizontal Carousel)
          ═══════════════════════════════════════════════ */}
      <section className={styles.section} style={{ background: 'var(--bg-white)' }}>
        <div className={styles.sectionContainer}>
          <div className={styles.sectionHeader}>
            <div>
              <h2 className="section-title" style={{ textAlign: 'left' }}>New Arrivals</h2>
              <p className="section-subtitle" style={{ textAlign: 'left', marginBottom: 0 }}>
                The latest tech hardware just landed
              </p>
            </div>
            <div className={styles.carouselControls}>
              <button
                onClick={() => scrollCarousel('left')}
                className={styles.carouselBtn}
                aria-label="Scroll left"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() => scrollCarousel('right')}
                className={styles.carouselBtn}
                aria-label="Scroll right"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          <div className={styles.carousel} ref={carouselRef}>
            {isLoading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <div key={`carousel-skeleton-${i}`} className={styles.carouselItem}>
                    <ProductCard loading />
                  </div>
                ))
              : newArrivals.map((product) => (
                  <div key={product.id} className={styles.carouselItem}>
                    <ProductCard product={product} />
                  </div>
                ))
            }
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          SECTION 5: Newsletter CTA
          ═══════════════════════════════════════════════ */}
      <section className={styles.newsletter}>
        <div className={styles.sectionContainer}>
          <div className={styles.newsletterInner}>
            <div className={styles.newsletterText}>
              <h3>Stay Updated with Latest Deals</h3>
              <p>Subscribe to get notified about new products, special offers, and exclusive discounts.</p>
            </div>
            <form className={styles.newsletterForm} onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Enter your email address"
                className={styles.newsletterInput}
                id="newsletter-email"
              />
              <button type="submit" className={styles.newsletterBtn}>
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
