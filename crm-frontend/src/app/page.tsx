'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Truck, ShieldCheck, Headphones, RotateCcw, ChevronRight, CheckCircle2, Star, Zap, Package, Award } from 'lucide-react';
import { getProducts, getCollections } from '@/lib/api/products';
import { useRegion } from '@/lib/context/RegionContext';
import ProductCard from '@/components/ui/ProductCard';
import Badge from '@/components/ui/Badge';
import styles from './HomePage.module.css';

const CATEGORY_META: Record<string, { gradient: string; icon: string; label: string }> = {
  laptops:    { gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', icon: '💻', label: 'Laptops' },
  desktops:   { gradient: 'linear-gradient(135deg, #0066cc 0%, #004499 100%)', icon: '🖥️', label: 'Desktops' },
  monitors:   { gradient: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)', icon: '🖱️', label: 'Monitors' },
  components: { gradient: 'linear-gradient(135deg, #f56300 0%, #c43a00 100%)', icon: '⚙️', label: 'Components' },
  accessories:{ gradient: 'linear-gradient(135deg, #fc466b 0%, #3f5efb 100%)', icon: '🎧', label: 'Accessories' },
  networking: { gradient: 'linear-gradient(135deg, #43cea2 0%, #185a9d 100%)', icon: '🌐', label: 'Networking' },
  gaming:     { gradient: 'linear-gradient(135deg, #8e2de2 0%, #4a00e0 100%)', icon: '🎮', label: 'Gaming' },
  storage:    { gradient: 'linear-gradient(135deg, #f7971e 0%, #ffd200 100%)', icon: '💾', label: 'Storage' },
  security:   { gradient: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', icon: '🔒', label: 'Security' },
  'point-of-sale': { gradient: 'linear-gradient(135deg, #00b09b 0%, #96c93d 100%)', icon: '🏪', label: 'Point of Sale' },
};

function getCategoryMeta(handle: string, index: number) {
  const fallbacks = Object.values(CATEGORY_META);
  return CATEGORY_META[handle] || fallbacks[index % fallbacks.length];
}

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

interface Collection {
  id: string;
  title: string;
  handle: string;
}

const BRANDS = ['Lenovo', 'Dell', 'HP', 'ASUS', 'Acer', 'Samsung', 'Intel', 'AMD'];

export default function HomePage() {
  const { regionId } = useRegion();
  const [products, setProducts] = useState<Product[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [prodData, colData] = await Promise.all([
          getProducts({ limit: 8, regionId }),
          getCollections(),
        ]);
        if (prodData?.products) {
          setProducts(prodData.products);
        }
        if (colData?.collections) {
          setCollections(colData.collections);
        }
      } catch (err) {
        console.error('Failed to load homepage data:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [regionId]);

  return (
    <div className={styles.page}>

      {/* 1. Hero Section */}
      <section className={styles.heroSection}>
        <div className="container">
          <div className={styles.heroGrid}>

            {/* Main Hero Banner */}
            <div className={styles.heroBanner}>
              <div className={styles.heroGradientBg} />
              <div className={styles.heroParticle1} />
              <div className={styles.heroParticle2} />
              <div className={styles.heroParticle3} />
              <div className={styles.heroContent}>
                <div className={styles.heroBadgeRow}>
                  <Badge variant="sale" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <Zap size={12} /> End of Month Sale
                  </Badge>
                  <span className={styles.heroBadgeSub}>Up to 40% off</span>
                </div>
                <h1 className={styles.heroTitle}>
                  Tech That <span className={styles.heroTitleAccent}>Performs</span>
                </h1>
                <p className={styles.heroDesc}>
                  Premium laptops, components & accessories from top brands. 
                  Next-day delivery. Official SA reseller.
                </p>
                <div className={styles.heroCtaGroup}>
                  <Link href="/collections/laptop">
                    <button className={styles.heroPrimaryBtn}>
                      Shop Laptops <ArrowRight size={18} />
                    </button>
                  </Link>
                  <Link href="/collections">
                    <button className={styles.heroSecondaryBtn}>
                      Browse All
                    </button>
                  </Link>
                </div>
                <div className={styles.heroStats}>
                  <div className={styles.heroStat}>
                    <span className={styles.heroStatNumber}>10K+</span>
                    <span className={styles.heroStatLabel}>Products</span>
                  </div>
                  <div className={styles.heroStatDivider} />
                  <div className={styles.heroStat}>
                    <span className={styles.heroStatNumber}>50+</span>
                    <span className={styles.heroStatLabel}>Brands</span>
                  </div>
                  <div className={styles.heroStatDivider} />
                  <div className={styles.heroStat}>
                    <span className={styles.heroStatNumber}>4.9★</span>
                    <span className={styles.heroStatLabel}>Rating</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Side Banners */}
            <div className={styles.sideBanners}>
              <Link href="/collections/monitors" className={styles.sideBanner}>
                <div className={styles.sideBannerBg1} />
                <div className={styles.sideBannerContent}>
                  <span className={styles.sideBannerIcon}>🖥️</span>
                  <h3 className={styles.sideBannerTitle}>Monitor Clearance</h3>
                  <p className={styles.sideBannerDesc}>Up to 25% off 4K monitors</p>
                  <span className={styles.sideBannerLink}>
                    Shop Now <ChevronRight size={16} />
                  </span>
                </div>
              </Link>

              <Link href="/collections/components" className={`${styles.sideBanner} ${styles.sideBannerAlt}`}>
                <div className={styles.sideBannerBg2} />
                <div className={styles.sideBannerContent}>
                  <span className={styles.sideBannerIcon}>⚙️</span>
                  <h3 className={styles.sideBannerTitle}>PC Components</h3>
                  <p className={styles.sideBannerDesc}>Build your dream rig</p>
                  <span className={styles.sideBannerLink}>
                    Shop Now <ChevronRight size={16} />
                  </span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. USP Bar */}
      <section className="container">
        <div className={styles.uspBar}>
          {[
            { icon: <Truck size={22} />, title: 'Free Delivery', desc: 'On orders over R2,000' },
            { icon: <RotateCcw size={22} />, title: 'Easy Returns', desc: '14-day return policy' },
            { icon: <ShieldCheck size={22} />, title: 'Secure Payment', desc: '100% secure checkout' },
            { icon: <Headphones size={22} />, title: 'Expert Advice', desc: 'Mon–Fri, 8am–5pm' },
          ].map((item, idx) => (
            <div key={idx} className={styles.uspItem}>
              <div className={styles.uspIconWrap}>{item.icon}</div>
              <div>
                <div className={styles.uspTitle}>{item.title}</div>
                <div className={styles.uspDesc}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Shop by Category */}
      {collections.length > 0 && (
        <section className="container">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Shop by Category</h2>
            <Link href="/collections" className={styles.viewAllLink}>
              View All <ArrowRight size={16} />
            </Link>
          </div>
          <div className={styles.categoriesGrid}>
            {collections.map((col, idx) => {
              const meta = getCategoryMeta(col.handle, idx);
              return (
                <Link key={col.id} href={`/collections/${col.handle}`} className={styles.categoryCard}>
                  <div className={styles.categoryCardInner} style={{ background: meta.gradient }}>
                    <span className={styles.categoryIcon}>{meta.icon}</span>
                  </div>
                  <span className={styles.categoryName}>{col.title}</span>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* 4. Trending Deals */}
      <section className="container">
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Trending Deals</h2>
          <Link href="/collections" className={styles.viewAllLink}>
            View All <ArrowRight size={16} />
          </Link>
        </div>

        {isLoading ? (
          <div className={styles.productsGrid}>
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCard key={i} loading={true} />
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className={styles.productsGrid}>
            {products.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <Package size={48} color="var(--color-text-tertiary)" />
            <p>Products loading... Please check back shortly.</p>
          </div>
        )}
      </section>

      {/* 5. Trusted Brands */}
      <section className={styles.brandsSection}>
        <div className="container">
          <h2 className={styles.brandsSectionTitle}>Trusted Brands We Carry</h2>
          <div className={styles.brandsStrip}>
            {BRANDS.map((brand) => (
              <div key={brand} className={styles.brandPill}>
                <span className={styles.brandName}>{brand}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Promo Banners Row */}
      <section className="container">
        <div className={styles.promoBanners}>
          <Link href="/collections/gaming" className={styles.promoBanner}>
            <div className={styles.promoBannerGlow} style={{ background: 'radial-gradient(ellipse at 0% 50%, rgba(139,92,246,0.4) 0%, transparent 70%)' }} />
            <div className={styles.promoBannerContent}>
              <span className={styles.promoBannerEyebrow}>🎮 Gaming</span>
              <h3 className={styles.promoBannerTitle}>Level Up Your Game</h3>
              <p className={styles.promoBannerDesc}>RTX cards, gaming laptops & chairs</p>
              <span className={styles.promoBannerCta}>Shop Gaming <ArrowRight size={15} /></span>
            </div>
          </Link>
          <Link href="/collections/networking" className={styles.promoBanner}>
            <div className={styles.promoBannerGlow} style={{ background: 'radial-gradient(ellipse at 100% 50%, rgba(0,102,204,0.4) 0%, transparent 70%)' }} />
            <div className={styles.promoBannerContent}>
              <span className={styles.promoBannerEyebrow}>🌐 Networking</span>
              <h3 className={styles.promoBannerTitle}>Stay Connected</h3>
              <p className={styles.promoBannerDesc}>Routers, switches & Wi-Fi solutions</p>
              <span className={styles.promoBannerCta}>Shop Now <ArrowRight size={15} /></span>
            </div>
          </Link>
          <Link href="/collections/security-cctv" className={styles.promoBanner}>
            <div className={styles.promoBannerGlow} style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(245,99,0,0.4) 0%, transparent 70%)' }} />
            <div className={styles.promoBannerContent}>
              <span className={styles.promoBannerEyebrow}>🔒 Security</span>
              <h3 className={styles.promoBannerTitle}>Protect What Matters</h3>
              <p className={styles.promoBannerDesc}>CCTV, alarms & access control</p>
              <span className={styles.promoBannerCta}>Shop Security <ArrowRight size={15} /></span>
            </div>
          </Link>
        </div>
      </section>

      {/* 7. Why Choose Us */}
      <section className={styles.whySection}>
        <div className="container">
          <div className={styles.whyInner}>
            <div className={styles.whyContent}>
              <h2 className={styles.whyTitle}>Why Choose CRM Technology?</h2>
              <ul className={styles.whyList}>
                {[
                  "Largest selection of laptops & parts in SA",
                  "Official reseller: Lenovo, Dell, HP & more",
                  "Dedicated account managers for B2B clients",
                  "Rated Excellent on TrustPilot",
                ].map((item, i) => (
                  <li key={i} className={styles.whyItem}>
                    <CheckCircle2 size={20} color="var(--color-blue)" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className={styles.whyRating}>
                {[1,2,3,4,5].map(i => <Star key={i} size={18} fill="var(--color-orange)" color="var(--color-orange)" />)}
                <span className={styles.whyRatingText}>4.9/5 from 2,400+ reviews</span>
              </div>
            </div>
            <div className={styles.whyCard}>
              <Award size={32} color="var(--color-blue)" style={{ marginBottom: '12px' }} />
              <h3 className={styles.whyCardTitle}>Business Account</h3>
              <p className={styles.whyCardDesc}>
                Register for trade discounts, dedicated support, and net-30 payment terms.
              </p>
              <Link href="/account/register">
                <button className={styles.whyCardBtn}>Register Now <ArrowRight size={16} /></button>
              </Link>
              <p className={styles.whyCardNote}>Free to join · No monthly fees</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
