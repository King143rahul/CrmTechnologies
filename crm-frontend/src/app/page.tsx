'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Truck, ShieldCheck, Headphones, RotateCcw, Star, ChevronRight, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { getProducts, getCollections } from '@/lib/api/products';
import ProductCard from '@/components/ui/ProductCard';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

// Robust mock data for fallback
const MOCK_PRODUCTS = [
  {
    id: 'prod_1',
    title: 'Lenovo ThinkPad T14 Gen 3 - 14" FHD - Core i5-1235U - 16GB RAM - 512GB SSD',
    handle: 'lenovo-thinkpad-t14-gen-3',
    thumbnail: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800',
    collection: { title: 'Laptops' },
    variants: [
      {
        id: 'var_1',
        title: 'Default Title',
        calculated_price: { calculated_amount: 1450000, original_amount: 1750000, currency_code: 'ZAR' }
      }
    ]
  },
  {
    id: 'prod_2',
    title: 'Dell UltraSharp 27 4K USB-C Hub Monitor - U2723QE',
    handle: 'dell-ultrasharp-27-4k',
    thumbnail: 'https://images.unsplash.com/photo-1527443154391-507e9dc6c5cc?w=800',
    collection: { title: 'Displays' },
    variants: [
      {
        id: 'var_2',
        title: 'Default Title',
        calculated_price: { calculated_amount: 850000, currency_code: 'ZAR' }
      }
    ]
  },
  {
    id: 'prod_3',
    title: 'Logitech MX Master 3S Advanced Wireless Mouse',
    handle: 'logitech-mx-master-3s',
    thumbnail: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800',
    collection: { title: 'Accessories' },
    variants: [
      {
        id: 'var_3',
        title: 'Graphite',
        calculated_price: { calculated_amount: 199900, original_amount: 249900, currency_code: 'ZAR' }
      }
    ]
  },
  {
    id: 'prod_4',
    title: 'Samsung 980 PRO 1TB PCIe NVMe Gen4 SSD',
    handle: 'samsung-980-pro-1tb',
    thumbnail: 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=800',
    collection: { title: 'Storage' },
    variants: [
      {
        id: 'var_4',
        title: '1TB',
        calculated_price: { calculated_amount: 189900, currency_code: 'ZAR' }
      }
    ]
  }
];

const MOCK_COLLECTIONS = [
  { id: 'col_1', title: 'Laptops', handle: 'laptops', bg: '#f1f5f9', icon: '💻' },
  { id: 'col_2', title: 'Desktop PCs', handle: 'desktops', bg: '#e0f2fe', icon: '🖥️' },
  { id: 'col_3', title: 'Monitors', handle: 'monitors', bg: '#dbeafe', icon: '📺' },
  { id: 'col_4', title: 'Components', handle: 'components', bg: '#fce7f3', icon: '⚙️' },
  { id: 'col_5', title: 'Accessories', handle: 'accessories', bg: '#fef3c7', icon: '🖱️' },
  { id: 'col_6', title: 'Networking', handle: 'networking', bg: '#dcfce7', icon: '🌐' },
];

export default function HomePage() {
  const [products, setProducts] = useState(MOCK_PRODUCTS);
  const [collections, setCollections] = useState(MOCK_COLLECTIONS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const prodData = await getProducts({ limit: 4 });
        if (prodData?.products?.length) {
          setProducts(prodData.products);
        }
        const colData = await getCollections();
        if (colData?.collections?.length) {
          // Fallback mapping for existing DB collections
          const mapped = colData.collections.map((c: any, i: number) => ({
            ...c,
            bg: MOCK_COLLECTIONS[i % MOCK_COLLECTIONS.length].bg,
            icon: MOCK_COLLECTIONS[i % MOCK_COLLECTIONS.length].icon,
          }));
          setCollections(mapped);
        }
      } catch (err) {
        console.warn('API connection failed, rendering fallbacks', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-12)', background: 'var(--color-bg-secondary)', paddingBottom: 'var(--space-12)' }}>
      {/* 1. Retail Banner / Hero */}
      <section style={{ background: '#ffffff', padding: 'var(--space-6) 0', borderBottom: '1px solid var(--color-border)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 'var(--space-6)' }} className="hero-grid">
            {/* Main Carousel area */}
            <div
              style={{
                background: 'linear-gradient(90deg, var(--color-navy) 0%, #1a3c63 100%)',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--space-12)',
                display: 'flex',
                alignItems: 'center',
                position: 'relative',
                overflow: 'hidden',
                minHeight: '400px',
              }}
            >
              {/* Fake abstract shape for decoration */}
              <div
                style={{
                  position: 'absolute',
                  right: '-10%',
                  top: '-20%',
                  width: '500px',
                  height: '500px',
                  background: 'radial-gradient(circle, rgba(0,109,251,0.4) 0%, transparent 60%)',
                  borderRadius: '50%',
                  pointerEvents: 'none',
                }}
              />
              <div style={{ position: 'relative', zIndex: 2, maxWidth: '500px', color: '#ffffff' }}>
                <Badge variant="sale" style={{ marginBottom: 'var(--space-4)', display: 'inline-block' }}>End of Month Sale</Badge>
                <h1 style={{ fontSize: 'clamp(var(--text-3xl), 4vw, var(--text-5xl))', fontWeight: 'var(--font-weight-extrabold)', lineHeight: 1.1, marginBottom: 'var(--space-4)' }}>
                  Massive Savings on Top Brand Laptops
                </h1>
                <p style={{ fontSize: 'var(--text-lg)', opacity: 0.9, marginBottom: 'var(--space-8)' }}>
                  Save up to 40% on Lenovo, Dell, HP, and more. Next day delivery available.
                </p>
                <Link href="/collections/laptops">
                  <Button size="lg" className="btn-primary" style={{ background: 'var(--color-orange)', borderColor: 'var(--color-orange)' }}>
                    Shop Deals <ArrowRight size={18} />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Side banners */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <Link href="/collections/monitors"
                style={{
                  flex: 1,
                  background: '#f1f5f9',
                  borderRadius: 'var(--radius-lg)',
                  padding: 'var(--space-6)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  textDecoration: 'none',
                  color: 'inherit',
                  border: '1px solid var(--color-border)',
                  transition: 'border-color var(--transition-fast)'
                }}
                className="hover-border-blue"
              >
                <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-navy)', marginBottom: 'var(--space-2)' }}>Monitor Clearance</h3>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-4)' }}>Up to 25% off selected 4K monitors.</p>
                <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-blue)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  Shop Monitors <ChevronRight size={16} />
                </span>
              </Link>

              <Link href="/collections/components"
                style={{
                  flex: 1,
                  background: '#f8fafc',
                  borderRadius: 'var(--radius-lg)',
                  padding: 'var(--space-6)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  textDecoration: 'none',
                  color: 'inherit',
                  border: '1px solid var(--color-border)',
                  transition: 'border-color var(--transition-fast)'
                }}
                className="hover-border-blue"
              >
                <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-navy)', marginBottom: 'var(--space-2)' }}>PC Components</h3>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-4)' }}>Upgrade your rig with latest parts.</p>
                <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-blue)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  Shop Components <ChevronRight size={16} />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Trust / USPs */}
      <section className="container">
        <div style={{ background: '#ffffff', borderRadius: 'var(--radius-lg)', padding: 'var(--space-6)', display: 'flex', flexWrap: 'wrap', gap: 'var(--space-6)', justifyContent: 'space-between', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
          {[
            { icon: <Truck size={24} />, title: 'Free Delivery', desc: 'On orders over R2000' },
            { icon: <RotateCcw size={24} />, title: 'Easy Returns', desc: '14-day return policy' },
            { icon: <ShieldCheck size={24} />, title: 'Secure Payment', desc: '100% secure checkout' },
            { icon: <Headphones size={24} />, title: 'Expert Advice', desc: 'Available Mon-Fri' },
          ].map((item, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
              <div style={{ color: 'var(--color-blue)' }}>{item.icon}</div>
              <div>
                <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-navy)' }}>{item.title}</div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Browse Categories */}
      <section className="container">
        <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-weight-extrabold)', color: 'var(--color-navy)', marginBottom: 'var(--space-6)' }}>Shop by Category</h2>
        <div className="categories-grid">
          {collections.map((col, idx) => (
            <Link
              key={col.id || idx}
              href={`/collections/${col.handle}`}
              style={{
                background: '#ffffff',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--space-6)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                gap: 'var(--space-4)',
                textDecoration: 'none',
                transition: 'border-color var(--transition-fast), box-shadow var(--transition-fast)'
              }}
              className="hover-shadow-blue"
            >
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: col.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
                {col.icon}
              </div>
              <span style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-navy)' }}>
                {col.title}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. Trending Offers */}
      <section className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
          <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-weight-extrabold)', color: 'var(--color-navy)' }}>
            Trending Deals
          </h2>
          <Link href="/products" style={{ color: 'var(--color-blue)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-bold)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            View All <ArrowRight size={16} />
          </Link>
        </div>

        <div className="products-grid">
          {products.map(prod => (
            <ProductCard key={prod.id} product={prod} loading={isLoading} />
          ))}
        </div>
      </section>

      {/* 5. Informational Banner */}
      <section className="container">
        <div style={{ background: 'var(--color-navy)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-10)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-8)' }}>
          <div style={{ color: '#ffffff', maxWidth: '600px' }}>
            <h2 style={{ fontSize: 'var(--text-3xl)', fontWeight: 'var(--font-weight-extrabold)', marginBottom: 'var(--space-4)' }}>Why Choose CRM Technology?</h2>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', listStyle: 'none', padding: 0 }}>
              {[
                'Largest selection of laptops and parts in SA',
                'Official reseller for Lenovo, Dell, HP & more',
                'Dedicated account managers for B2B customers',
                'Rated Excellent on TrustPilot'
              ].map((item, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-base)', opacity: 0.9 }}>
                  <CheckCircle2 size={20} color="var(--color-blue)" /> {item}
                </li>
              ))}
            </ul>
          </div>
          <div style={{ background: '#ffffff', borderRadius: 'var(--radius-lg)', padding: 'var(--space-6)', width: '100%', maxWidth: '350px', textAlign: 'center' }}>
            <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-navy)', marginBottom: 'var(--space-2)' }}>Business Account</h3>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-6)' }}>Register for trade discounts, dedicated support, and net-30 terms.</p>
            <Button className="btn-primary" style={{ width: '100%' }}>Register Now</Button>
          </div>
        </div>
      </section>

      <style jsx global>{`
        .hero-grid {
          /* defined inline, overriding for mobile */
        }
        .categories-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: var(--space-4);
        }
        .products-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: var(--space-4);
        }
        .hover-border-blue:hover {
          border-color: var(--color-blue) !important;
        }
        .hover-shadow-blue:hover {
          border-color: var(--color-blue) !important;
          box-shadow: var(--shadow-md) !important;
        }
        
        @media (max-width: 1024px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
          }
          .categories-grid {
            grid-template-columns: repeat(3, 1fr);
          }
          .products-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        @media (max-width: 768px) {
          .categories-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .products-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 480px) {
          .products-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
