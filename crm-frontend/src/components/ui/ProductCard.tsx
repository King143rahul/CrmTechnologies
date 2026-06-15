'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Heart, ShoppingCart } from 'lucide-react';
import { useCart } from '@/lib/context/CartContext';
import { useWishlist } from '@/lib/context/WishlistContext';
import { useToast } from '@/lib/context/ToastContext';
import PriceDisplay from './PriceDisplay';
import Badge from './Badge';
import Skeleton from './Skeleton';
import styles from './ProductCard.module.css';

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
  thumbnail: string;
  variants?: Variant[];
  metadata?: Record<string, string>;
  collection?: {
    title: string;
  };
}

interface ProductCardProps {
  product?: Product;
  loading?: boolean;
}

/**
 * Extracts tech specifications from product metadata or parses them from the product title.
 * Returns up to 3 spec strings (CPU, RAM, Storage).
 */
function extractSpecs(product: Product): string[] {
  const specs: string[] = [];
  const meta = product.metadata || {};

  // Try metadata fields first
  if (meta.cpu || meta.processor) specs.push(meta.cpu || meta.processor);
  if (meta.ram || meta.memory) specs.push(meta.ram || meta.memory);
  if (meta.storage || meta.ssd || meta.hdd) specs.push(meta.storage || meta.ssd || meta.hdd);

  if (specs.length >= 2) return specs.slice(0, 3);

  // Fallback: parse from product title
  const title = product.title;

  // CPU patterns
  const cpuMatch = title.match(/(?:Core\s+)?i[3579]-\d{4,5}[A-Z]*/i)
    || title.match(/Ryzen\s+\d+\s+\d{4}[A-Z]*/i)
    || title.match(/M[1-4]\s*(?:Pro|Max|Ultra)?/i)
    || title.match(/Celeron\s*\w*/i)
    || title.match(/Pentium\s*\w*/i);
  if (cpuMatch && !specs.some(s => s.toLowerCase().includes(cpuMatch[0].toLowerCase()))) {
    specs.push(cpuMatch[0].trim());
  }

  // RAM patterns
  const ramMatch = title.match(/(\d+)\s*GB\s*(?:RAM|DDR\d?)/i)
    || title.match(/(\d+)GB/i);
  if (ramMatch && !specs.some(s => s.toLowerCase().includes('gb'))) {
    const val = ramMatch[1];
    specs.push(`${val}GB RAM`);
  }

  // Storage patterns
  const storageMatch = title.match(/(\d+)\s*(?:GB|TB)\s*(?:SSD|NVMe|HDD|PCIe)/i)
    || title.match(/(\d+)TB/i);
  if (storageMatch && !specs.some(s => s.toLowerCase().includes('ssd') || s.toLowerCase().includes('tb'))) {
    specs.push(storageMatch[0].trim());
  }

  return specs.slice(0, 3);
}

export function ProductCard({ product, loading = false }: ProductCardProps) {
  const { addItem } = useCart();
  const { toggleItem, isInWishlist } = useWishlist();
  const { addToast } = useToast();
  const [isAdding, setIsAdding] = useState(false);

  if (loading || !product) {
    return (
      <div className={styles.skeletonCard}>
        <Skeleton height="200px" borderRadius="var(--radius-sm)" />
        <Skeleton width="40%" height="14px" />
        <Skeleton width="90%" height="20px" />
        <Skeleton width="70%" height="14px" />
        <Skeleton width="60%" height="16px" />
        <Skeleton height="36px" borderRadius="var(--radius-sm)" style={{ marginTop: 'auto' }} />
      </div>
    );
  }

  const defaultVariant = product.variants?.[0];
  const priceAmount = defaultVariant?.calculated_price?.calculated_amount || 0;
  const originalAmount = defaultVariant?.calculated_price?.original_amount;
  const currencyCode = defaultVariant?.calculated_price?.currency_code || 'ZAR';
  const isSale = originalAmount && originalAmount > priceAmount;
  const specs = extractSpecs(product);
  const wishlistActive = isInWishlist(product.id);

  const handleAddToWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleItem({
      id: product.id,
      title: product.title,
      handle: product.handle,
      thumbnail: product.thumbnail,
      price: priceAmount,
      currencyCode,
    });
    if (isInWishlist(product.id)) {
      addToast('Removed from wishlist', 'info');
    } else {
      addToast('Added to wishlist', 'success');
    }
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!defaultVariant?.id) return;
    setIsAdding(true);
    try {
      await addItem(defaultVariant.id, 1);
      addToast(`${product.title} added to cart!`, 'success');
    } catch {
      addToast('Failed to add to cart', 'error');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Link href={`/products/${product.handle}`} className={styles.card}>
      {/* Badges / Actions Overlay */}
      <div className={styles.overlay}>
        <div className={styles.badges}>
          {isSale && <Badge variant="sale">Sale</Badge>}
          {priceAmount > 200000 && (
            <Badge variant="stock" className={styles.badgeFreeDelivery}>
              Free Delivery
            </Badge>
          )}
        </div>
        <button
          onClick={handleAddToWishlist}
          className={`${styles.wishlistBtn} ${wishlistActive ? styles.wishlistBtnActive : ''}`}
          aria-label={wishlistActive ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart size={16} fill={wishlistActive ? 'var(--color-error)' : 'none'} />
        </button>
      </div>

      {/* Thumbnail */}
      <div className={styles.imageContainer}>
        {product.thumbnail ? (
          <img
            src={product.thumbnail}
            alt={product.title}
            className={styles.thumbnail}
          />
        ) : (
          <div className={styles.noImage}>No Image</div>
        )}
      </div>

      {/* Product Details */}
      <div className={styles.details}>
        {/* Full title — no truncation for tech products */}
        <h4 className={styles.title}>{product.title}</h4>

        {/* Tech Specs Bullet List */}
        {specs.length > 0 && (
          <ul className={styles.specsList}>
            {specs.map((spec, i) => (
              <li key={i} className={styles.specItem}>
                <span className={styles.specDot} />
                {spec}
              </li>
            ))}
          </ul>
        )}

        {/* Price */}
        <div className={styles.priceArea}>
          <PriceDisplay
            amount={priceAmount}
            compareAtAmount={originalAmount}
            currencyCode={currencyCode}
            size="md"
          />
        </div>
      </div>

      {/* Add to Cart CTA */}
      {defaultVariant && (
        <button
          onClick={handleAddToCart}
          disabled={isAdding}
          className={styles.addToCartBtn}
        >
          <ShoppingCart size={16} />
          {isAdding ? 'Adding...' : 'Add to Basket'}
        </button>
      )}
    </Link>
  );
}

export default ProductCard;
