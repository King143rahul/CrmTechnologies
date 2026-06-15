'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Heart, ShoppingBag, ArrowLeft, Share2 } from 'lucide-react';
import { getProductByHandle, getProducts } from '@/lib/api/products';
import { useCart } from '@/lib/context/CartContext';
import { useWishlist } from '@/lib/context/WishlistContext';
import { useToast } from '@/lib/context/ToastContext';
import ImageGallery from '@/components/ui/ImageGallery';
import PriceDisplay from '@/components/ui/PriceDisplay';
import Breadcrumb from '@/components/ui/Breadcrumb';
import QuantitySelector from '@/components/ui/QuantitySelector';
import ProductCard from '@/components/ui/ProductCard';
import Skeleton from '@/components/ui/Skeleton';
import Button from '@/components/ui/Button';
import styles from './ProductDetail.module.css';

interface Variant {
  id: string;
  title: string;
  calculated_price?: {
    calculated_amount: number;
    currency_code: string;
    original_amount?: number;
  };
}

interface Product {
  id: string;
  title: string;
  handle: string;
  description?: string;
  thumbnail: string;
  collection?: { title: string };
  images?: Array<{ url: string }>;
  variants?: Variant[];
  metadata?: Record<string, string>;
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const handle = params.handle as string;

  const { addItem } = useCart();
  const { toggleItem, isInWishlist } = useWishlist();
  const { addToast } = useToast();

  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
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
        const relData = await getProducts({ limit: 4 });
        if (relData?.products?.length) {
          setRelated(relData.products.filter((p: Product) => p.handle !== handle).slice(0, 3));
        }
      } catch (err) {
        console.error('Failed to load product:', err);
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
      addToast(`${product?.title} added to cart!`, 'success');
    } catch {
      addToast('Failed to add to cart', 'error');
    } finally {
      setIsAdding(false);
    }
  };

  const handleWishlistToggle = () => {
    if (!product) return;
    toggleItem({
      id: product.id,
      title: product.title,
      handle: product.handle,
      thumbnail: product.thumbnail,
      price: selectedVariant?.calculated_price?.calculated_amount || 0,
      currencyCode: selectedVariant?.calculated_price?.currency_code || 'ZAR',
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
      <div className={`container ${styles.page}`}>
        <Skeleton width="180px" height="14px" style={{ marginBottom: 'var(--space-8)' }} />
        <div className={styles.detailLayout}>
          <Skeleton height="480px" borderRadius="var(--radius-lg)" />
          <div className={styles.infoCol}>
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

  if (!product) {
    return (
      <div className={`container ${styles.page}`}>
        <h1>Product not found</h1>
        <p className={styles.description}>The product you are looking for does not exist or has been removed.</p>
        <button onClick={() => router.push('/products')} className="btn btn-primary" style={{ marginTop: 'var(--space-4)' }}>
          Browse Products
        </button>
      </div>
    );
  }

  const priceVal = selectedVariant?.calculated_price?.calculated_amount || 0;
  const originalVal = selectedVariant?.calculated_price?.original_amount;
  const currencyCode = selectedVariant?.calculated_price?.currency_code || 'ZAR';
  const wishlistActive = isInWishlist(product.id);

  return (
    <div className={`container ${styles.page}`}>
      {/* Back + Breadcrumb */}
      <div className={styles.backRow}>
        <button onClick={() => router.back()} className={styles.backBtn}>
          <ArrowLeft size={16} /> Back
        </button>
        <Breadcrumb items={[{ label: 'Shop', href: '/products' }, { label: product.title }]} />
      </div>

      {/* Main Detail Layout */}
      <div className={styles.detailLayout}>
        <ImageGallery images={product.images || [{ url: product.thumbnail }]} />

        <div className={styles.infoCol}>
          {/* Meta */}
          <div className={styles.metaGroup}>
            {product.collection?.title && (
              <span className={styles.collectionLabel}>{product.collection.title}</span>
            )}
            <h1 className={styles.productTitle}>{product.title}</h1>
            <div className={styles.statusRow}>
              <span className={styles.stockStatus}>In Stock &amp; Ready to Ship</span>
            </div>
          </div>

          <PriceDisplay amount={priceVal} compareAtAmount={originalVal} currencyCode={currencyCode} size="lg" />

          {product.description && (
            <p className={styles.description}>
              {product.description.length > 180
                ? product.description.slice(0, 180) + '...'
                : product.description}
            </p>
          )}

          {/* Variant Selectors */}
          {product.variants && product.variants.length > 1 && (
            <div className={styles.variantSection}>
              <h3 className={styles.variantLabel}>Select Variant</h3>
              <div className={styles.variantOptions}>
                {product.variants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariant(v)}
                    className={`${styles.variantBtn} ${v.id === selectedVariant?.id ? styles.variantBtnActive : ''}`}
                  >
                    {v.title}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className={styles.actionsRow}>
            <div className={styles.qtyGroup}>
              <span className={styles.qtyLabel}>Quantity</span>
              <QuantitySelector value={quantity} onChange={setQuantity} />
            </div>

            <div className={styles.actionBtns}>
              <Button
                onClick={handleAddToCart}
                disabled={isAdding}
                className={`btn-primary ${styles.addToCartBtn}`}
              >
                <ShoppingBag size={18} /> {isAdding ? 'Adding...' : 'Add to Cart'}
              </Button>
              <button
                onClick={handleWishlistToggle}
                className={`${styles.iconBtn} ${wishlistActive ? styles.iconBtnActive : ''}`}
                aria-label={wishlistActive ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                <Heart size={20} fill={wishlistActive ? 'var(--color-error)' : 'none'} />
              </button>
              <button onClick={handleShare} className={styles.iconBtn} aria-label="Share">
                <Share2 size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <section className={styles.tabsSection}>
        <div className={styles.tabsNav}>
          {['Description', 'Specifications'].map((tab) => {
            const isActive = activeTab === tab.toLowerCase();
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab.toLowerCase())}
                className={`${styles.tabBtn} ${isActive ? styles.tabBtnActive : ''}`}
              >
                {tab}
              </button>
            );
          })}
        </div>
        {activeTab === 'description' && (
          <div className={styles.tabContent}>
            {product.description || 'No description available.'}
          </div>
        )}
        {activeTab === 'specifications' && (
          <div style={{ overflowX: 'auto' }}>
            <table className={styles.specTable}>
              <tbody>
                {product.metadata && Object.keys(product.metadata).length > 0 ? (
                  Object.entries(product.metadata).map(([key, value]) => (
                    <tr key={key}>
                      <td className={styles.specLabel}>{key.charAt(0).toUpperCase() + key.slice(1)}</td>
                      <td className={styles.specValue}>{value}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className={styles.specLabel}>Specifications</td>
                    <td className={styles.specValue}>No specifications available for this product.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Related Products */}
      {related.length > 0 && (
        <section>
          <h2 className={styles.relatedTitle}>You May Also Like</h2>
          <div className={styles.relatedGrid}>
            {related.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
