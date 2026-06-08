'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Heart, ShoppingBag, ArrowLeft, Star, Share2 } from 'lucide-react';
import { getProductByHandle, getProducts } from '@/lib/api/products';
import { useCart } from '@/lib/context/CartContext';
import { useWishlist } from '@/lib/context/WishlistContext';
import { useToast } from '@/lib/context/ToastContext';
import { formatPrice } from '@/lib/utils';
import ImageGallery from '@/components/ui/ImageGallery';
import PriceDisplay from '@/components/ui/PriceDisplay';
import Rating from '@/components/ui/Rating';
import Breadcrumb from '@/components/ui/Breadcrumb';
import QuantitySelector from '@/components/ui/QuantitySelector';
import ProductCard from '@/components/ui/ProductCard';
import Skeleton from '@/components/ui/Skeleton';
import Button from '@/components/ui/Button';

// Mock product detail for fallback
const MOCK_DETAIL = {
  id: 'prod_1',
  title: 'Samsung 980 PRO 1TB PCIe NVMe SSD',
  handle: 'samsung-980-pro-1tb',
  description: 'Upgrade your PC\'s storage and experience lightning-fast load times with the Samsung 980 PRO PCIe 4.0 NVMe SSD. Delivering read speeds up to 7000 MB/s, this drive is perfect for high-performance gaming, heavy data crunching, and system responsiveness.',
  thumbnail: 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=800',
  collection: { title: 'Storage' },
  images: [
    { url: 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=800' },
  ],
  variants: [
    { id: 'var_1', title: '1TB', calculated_price: { calculated_amount: 14500, original_amount: 17500, currency_code: 'ZAR' } },
    { id: 'var_2', title: '2TB', calculated_price: { calculated_amount: 28500, original_amount: 32000, currency_code: 'ZAR' } },
  ],
};

const MOCK_RELATED = [
  { id: 'prod_2', title: '15.6" IPS FHD Replacement Laptop Screen', handle: '15-6-ips-fhd-replacement-screen', thumbnail: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800', collection: { title: 'Displays' }, variants: [{ id: 'var_card', title: 'Default', calculated_price: { calculated_amount: 8500, currency_code: 'ZAR' } }] },
  { id: 'prod_3', title: 'Universal 65W Type-C Laptop Charger', handle: 'universal-65w-type-c-charger', thumbnail: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800', collection: { title: 'Power' }, variants: [{ id: 'var_sung', title: 'Default', calculated_price: { calculated_amount: 4500, currency_code: 'ZAR' } }] },
  { id: 'prod_4', title: 'Logitech MX Master 3S Wireless Mouse', handle: 'logitech-mx-master-3s', thumbnail: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800', collection: { title: 'Peripherals' }, variants: [{ id: 'var_back', title: 'Default', calculated_price: { calculated_amount: 19990, currency_code: 'ZAR' } }] },
];

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const handle = params.handle as string;

  const { addItem } = useCart();
  const { toggleItem, isInWishlist } = useWishlist();
  const { addToast } = useToast();

  const [product, setProduct] = useState(MOCK_DETAIL);
  const [related, setRelated] = useState(MOCK_RELATED);
  const [selectedVariant, setSelectedVariant] = useState(MOCK_DETAIL.variants[1]);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    async function loadProduct() {
      setIsLoading(true);
      try {
        const prodData = await getProductByHandle(handle);
        if (prodData?.products?.length) {
          const mainProd = prodData.products[0];
          setProduct(mainProd);
          if (mainProd.variants?.length) {
            setSelectedVariant(mainProd.variants[0]);
          }
        }
        const relData = await getProducts({ limit: 3 });
        if (relData?.products?.length) {
          setRelated(relData.products.filter((p: any) => p.handle !== handle));
        }
      } catch (err) {
        console.warn('API error, rendering fallbacks', err);
      } finally {
        setIsLoading(false);
      }
    }
    if (handle) {
      loadProduct();
    }
  }, [handle]);

  const handleAddToCart = async () => {
    if (!selectedVariant?.id) return;
    setIsAdding(true);
    try {
      await addItem(selectedVariant.id, quantity);
      addToast(`${product.title} added to cart!`, 'success');
    } catch {
      addToast('Failed to add to cart', 'error');
    } finally {
      setIsAdding(false);
    }
  };

  const handleWishlistToggle = () => {
    toggleItem({
      id: product.id,
      title: product.title,
      handle: product.handle,
      thumbnail: product.thumbnail,
      price: selectedVariant?.calculated_price?.calculated_amount || 0,
      currencyCode: selectedVariant?.calculated_price?.currency_code || 'USD',
    });
    if (isInWishlist(product.id)) {
      addToast('Removed from wishlist', 'info');
    } else {
      addToast('Added to wishlist', 'success');
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    addToast('Product link copied to clipboard!', 'success');
  };

  if (isLoading) {
    return (
      <div className="container" style={{ paddingTop: 'var(--space-8)', paddingBottom: 'var(--space-12)' }}>
        <Skeleton width="180px" height="14px" style={{ marginBottom: 'var(--space-8)' }} />
        <div className="detail-layout">
          <Skeleton height="480px" borderRadius="var(--radius-xl)" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
            <Skeleton width="30%" height="14px" />
            <Skeleton width="80%" height="32px" />
            <Skeleton width="40%" height="20px" />
            <Skeleton height="120px" />
            <Skeleton width="60%" height="40px" style={{ marginTop: 'var(--space-6)' }} />
          </div>
        </div>
      </div>
    );
  }

  const priceVal = selectedVariant?.calculated_price?.calculated_amount || 0;
  const originalVal = selectedVariant?.calculated_price?.original_amount;
  const currencyCode = selectedVariant?.calculated_price?.currency_code || 'USD';
  const wishlistActive = isInWishlist(product.id);

  return (
    <div className="container" style={{ paddingTop: 'var(--space-8)', paddingBottom: 'var(--space-12)' }}>
      {/* Back button & Breadcrumbs */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-8)' }}>
        <button onClick={() => router.back()} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', cursor: 'pointer' }}>
          <ArrowLeft size={16} /> Back
        </button>
        <Breadcrumb items={[{ label: 'Shop', href: '/products' }, { label: product.title }]} />
      </div>

      {/* Main product detail section */}
      <div className="detail-layout" style={{ marginBottom: 'var(--space-16)' }}>
        {/* Left Gallery */}
        <ImageGallery images={product.images || [{ url: product.thumbnail }]} />

        {/* Right Info Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          {/* Metadata */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            {product.collection?.title && (
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-accent-violet)', fontWeight: 'var(--font-weight-bold)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {product.collection.title}
              </span>
            )}
            <h1 style={{ fontSize: 'clamp(var(--text-2xl), 4vw, var(--text-4xl))', fontWeight: 'var(--font-weight-bold)', lineHeight: 1.2 }}>
              {product.title}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', marginTop: 'var(--space-2)' }}>
              <Rating value={4.6} count={48} showCount />
              <div style={{ width: '1px', height: '14px', background: 'var(--color-border)' }} />
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-success)' }}>In Stock &amp; Ready to Ship</span>
            </div>
          </div>

          <PriceDisplay amount={priceVal} compareAtAmount={originalVal} currencyCode={currencyCode} size="lg" />

          {/* Short description */}
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', lineHeight: 1.6 }}>
            {product.description?.slice(0, 180)}...
          </p>

          {/* Variant Selectors */}
          {product.variants && product.variants.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-6)' }}>
              <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-secondary)' }}>
                Select Variant
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                {product.variants.map(v => {
                  const isSelected = v.id === selectedVariant?.id;
                  return (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariant(v)}
                      style={{
                        padding: 'var(--space-2) var(--space-4)',
                        fontSize: 'var(--text-sm)',
                        borderRadius: 'var(--radius-md)',
                        border: `1px solid ${isSelected ? 'var(--color-accent-violet)' : 'var(--color-border)'}`,
                        background: isSelected ? 'var(--color-accent-violet-glow)' : 'transparent',
                        color: isSelected ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                        cursor: 'pointer',
                        transition: 'border-color var(--transition-fast), background-color var(--transition-fast)',
                      }}
                    >
                      {v.title}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Add actions */}
          <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center', borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-6)', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>Quantity</span>
              <QuantitySelector value={quantity} onChange={setQuantity} />
            </div>

            <div style={{ display: 'flex', gap: 'var(--space-3)', flexGrow: 1, marginTop: '16px' }}>
              <Button onClick={handleAddToCart} disabled={isAdding} className="btn-primary" style={{ flexGrow: 1, padding: '16px 0' }}>
                <ShoppingBag size={18} /> {isAdding ? 'Adding to Cart...' : 'Add to Cart'}
              </Button>
              <button
                onClick={handleWishlistToggle}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '54px',
                  height: '54px',
                  borderRadius: 'var(--radius-lg)',
                  border: `1px solid ${wishlistActive ? 'var(--color-accent-rose)' : 'var(--color-border)'}`,
                  background: wishlistActive ? 'rgba(244, 63, 94, 0.1)' : 'transparent',
                  color: wishlistActive ? 'var(--color-accent-rose)' : 'var(--color-text-secondary)',
                  cursor: 'pointer',
                  transition: 'border-color var(--transition-fast), color var(--transition-fast), background-color var(--transition-fast)',
                }}
              >
                <Heart size={20} fill={wishlistActive ? 'var(--color-accent-rose)' : 'none'} />
              </button>
              <button
                onClick={handleShare}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '54px',
                  height: '54px',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text-secondary)',
                  cursor: 'pointer',
                  transition: 'border-color var(--transition-fast), color var(--transition-fast)',
                }}
              >
                <Share2 size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs description / specs */}
      <section className="glass" style={{ borderRadius: 'var(--radius-xl)', padding: 'var(--space-6)', marginBottom: 'var(--space-16)' }}>
        <div style={{ display: 'flex', borderBottom: '1px solid var(--color-border)', gap: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
          {['Description', 'Specifications', 'Reviews'].map((tab, idx) => {
            const isTabActive = activeTab === tab.toLowerCase();
            return (
              <button
                key={idx}
                onClick={() => setActiveTab(tab.toLowerCase())}
                style={{
                  paddingBottom: 'var(--space-3)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-semibold)',
                  color: isTabActive ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                  borderBottom: `2px solid ${isTabActive ? 'var(--color-accent-violet)' : 'transparent'}`,
                  cursor: 'pointer',
                  transition: 'color var(--transition-fast)',
                }}
              >
                {tab}
              </button>
            );
          })}
        </div>
        {activeTab === 'description' && (
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', lineHeight: 1.7 }}>
            {product.description}
          </p>
        )}
        {activeTab === 'specifications' && (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', fontSize: 'var(--text-sm)', borderCollapse: 'collapse' }}>
              <tbody>
                <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: 'var(--space-3) 0', fontWeight: 'var(--font-weight-medium)', color: 'var(--color-text-secondary)' }}>Interface</td>
                  <td style={{ padding: 'var(--space-3) 0', color: 'var(--color-text-primary)' }}>PCIe Gen 4.0 x4, NVMe 1.3c</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: 'var(--space-3) 0', fontWeight: 'var(--font-weight-medium)', color: 'var(--color-text-secondary)' }}>Form Factor</td>
                  <td style={{ padding: 'var(--space-3) 0', color: 'var(--color-text-primary)' }}>M.2 (2280)</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: 'var(--space-3) 0', fontWeight: 'var(--font-weight-medium)', color: 'var(--color-text-secondary)' }}>Read/Write Speeds</td>
                  <td style={{ padding: 'var(--space-3) 0', color: 'var(--color-text-primary)' }}>Up to 7,000 / 5,000 MB/s</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
        {activeTab === 'reviews' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
              <Rating value={4.6} count={48} showCount />
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginTop: '4px' }}>96% of buyers recommend this product.</span>
            </div>
            <div style={{ height: '1px', background: 'var(--color-border)', margin: 'var(--space-2) 0' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <div>
                <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-bold)', display: 'block' }}>Sarah M.</span>
                <Rating value={5} />
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginTop: '4px', fontStyle: 'italic' }}>
                  &ldquo;Insane speeds. My laptop boots up in seconds now! Highly recommend CRM Technology for parts.&rdquo;
                </p>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Related Products Carousel */}
      {related.length > 0 && (
        <section>
          <h2 style={{ fontSize: 'var(--text-2xl)', marginBottom: 'var(--space-8)' }}>You May Also Like</h2>
          <div className="related-grid">
            {related.map(prod => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </section>
      )}

      <style jsx global>{`
        .detail-layout {
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: var(--space-12);
        }
        .related-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--space-6);
        }
        @media (max-width: 992px) {
          .detail-layout {
            grid-template-columns: 1fr;
            gap: var(--space-8);
          }
        }
        @media (max-width: 768px) {
          .related-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 480px) {
          .related-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
