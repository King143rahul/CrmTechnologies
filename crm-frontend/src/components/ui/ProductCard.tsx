'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Heart, ShoppingCart, Eye, BarChart3 } from 'lucide-react';
import { useCart } from '@/lib/context/CartContext';
import { useWishlist } from '@/lib/context/WishlistContext';
import { useToast } from '@/lib/context/ToastContext';
import { formatPrice, getPercentageOff } from '@/lib/utils';
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
      <div className={styles.card}>
        <div className={styles.imageContainer}>
          <Skeleton height="200px" borderRadius="0" />
        </div>
        <div className={styles.details}>
          <Skeleton width="90%" height="16px" />
          <Skeleton width="70%" height="14px" />
          <Skeleton width="50%" height="20px" />
        </div>
      </div>
    );
  }

  const defaultVariant = product.variants?.[0];
  const priceAmount = defaultVariant?.calculated_price?.calculated_amount || 0;
  const originalAmount = defaultVariant?.calculated_price?.original_amount;
  const currencyCode = defaultVariant?.calculated_price?.currency_code || 'ZAR';
  const isSale = originalAmount && originalAmount > priceAmount;
  const discount = isSale ? getPercentageOff(originalAmount, priceAmount) : 0;
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
      {/* Discount Badge */}
      {isSale && (
        <div className={styles.discountBadge}>
          -{discount}%
        </div>
      )}

      {/* Wishlist Heart */}
      <button
        onClick={handleAddToWishlist}
        className={`${styles.wishlistBtn} ${wishlistActive ? styles.wishlistActive : ''}`}
        aria-label={wishlistActive ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        <Heart size={16} fill={wishlistActive ? '#E8382F' : 'none'} />
      </button>

      {/* Product Image */}
      <div className={styles.imageContainer}>
        {product.thumbnail ? (
          <img
            src={product.thumbnail}
            alt={product.title}
            className={styles.thumbnail}
            loading="lazy"
          />
        ) : (
          <div className={styles.noImage}>
            <ShoppingCart size={32} color="var(--text-muted)" />
          </div>
        )}

        {/* Hover Action Bar */}
        <div className={styles.hoverActions}>
          <button
            onClick={handleAddToCart}
            className={styles.hoverBtn}
            disabled={isAdding}
            title="Quick Shop"
          >
            <ShoppingCart size={15} />
            <span>Quick Shop</span>
          </button>
          <Link
            href={`/products/${product.handle}`}
            className={styles.hoverBtnIcon}
            title="Quick View"
            onClick={(e) => e.stopPropagation()}
          >
            <Eye size={15} />
          </Link>
          <button className={styles.hoverBtnIcon} title="Compare">
            <BarChart3 size={15} />
          </button>
        </div>
      </div>

      {/* Product Details */}
      <div className={styles.details}>
        {/* Category Tag */}
        {product.collection?.title && (
          <span className={styles.categoryTag}>{product.collection.title}</span>
        )}

        {/* Title */}
        <h4 className={styles.title}>{product.title}</h4>

        {/* Tech Specs */}
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

        {/* Price Area */}
        <div className={styles.priceArea}>
          {isSale && (
            <span className={styles.originalPrice}>
              {formatPrice(originalAmount, currencyCode)}
            </span>
          )}
          <span className={`${styles.currentPrice} ${isSale ? styles.salePrice : ''}`}>
            {formatPrice(priceAmount, currencyCode)}
          </span>
        </div>

        {/* Free Delivery Badge */}
        {priceAmount > 200000 && (
          <span className={styles.freeDelivery}>🚚 Free Delivery</span>
        )}
      </div>
    </Link>
  );
}

export default ProductCard;
