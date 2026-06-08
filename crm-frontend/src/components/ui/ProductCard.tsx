'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Heart, ShoppingCart } from 'lucide-react';
import { useCart } from '@/lib/context/CartContext';
import { useWishlist } from '@/lib/context/WishlistContext';
import { useToast } from '@/lib/context/ToastContext';
import PriceDisplay from './PriceDisplay';
import Rating from './Rating';
import Badge from './Badge';
import Skeleton from './Skeleton';

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
  collection?: {
    title: string;
  };
}

interface ProductCardProps {
  product?: Product;
  loading?: boolean;
}

export function ProductCard({ product, loading = false }: ProductCardProps) {
  const { addItem } = useCart();
  const { toggleItem, isInWishlist } = useWishlist();
  const { addToast } = useToast();
  const [isAdding, setIsAdding] = useState(false);

  // Generate demo rating for realistic looks
  const demoRating = React.useMemo(() => 4 + ((product?.title?.length || 0) % 10) / 10, [product?.title]);
  const demoReviews = React.useMemo(() => Math.floor(10 + ((product?.id?.length || 0) * 5)), [product?.id]);

  if (loading || !product) {
    return (
      <div
        className="glass-card"
        style={{
          padding: 'var(--space-4)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-4)',
        }}
      >
        <Skeleton height="200px" borderRadius="var(--radius-sm)" />
        <Skeleton width="40%" height="14px" />
        <Skeleton width="90%" height="20px" />
        <Skeleton width="60%" height="16px" />
        <Skeleton height="36px" borderRadius="var(--radius-sm)" style={{ marginTop: 'auto' }} />
      </div>
    );
  }

  const defaultVariant = product.variants?.[0];
  const priceAmount = defaultVariant?.calculated_price?.calculated_amount || 0;
  const originalAmount = defaultVariant?.calculated_price?.original_amount;
  const currencyCode = defaultVariant?.calculated_price?.currency_code || 'USD';
  const isSale = originalAmount && originalAmount > priceAmount;

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

  const wishlistActive = isInWishlist(product.id);

  return (
    <Link
      href={`/products/${product.handle}`}
      style={{
        background: '#ffffff',
        border: '1px solid var(--color-border)',
        padding: 'var(--space-4)',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        position: 'relative',
        transition: 'box-shadow var(--transition-fast), border-color var(--transition-fast)',
      }}
      className="product-card-hover"
    >
      {/* Badges / Actions Overlay */}
      <div
        style={{
          position: 'absolute',
          top: 'var(--space-3)',
          left: 'var(--space-3)',
          right: 'var(--space-3)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 5,
        }}
      >
        <div style={{ display: 'flex', gap: '4px', flexDirection: 'column' }}>
          {isSale && <Badge variant="sale">Sale</Badge>}
          {priceAmount > 10000 && <Badge variant="stock" style={{ background: 'var(--color-navy)', color: 'white' }}>Free Delivery</Badge>}
        </div>
        <button
          onClick={handleAddToWishlist}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '32px',
            height: '32px',
            borderRadius: 'var(--radius-full)',
            background: wishlistActive ? 'var(--color-error-bg)' : '#ffffff',
            border: `1px solid ${wishlistActive ? 'var(--color-error)' : 'var(--color-border)'}`,
            color: wishlistActive ? 'var(--color-error)' : 'var(--color-text-tertiary)',
            cursor: 'pointer',
            transition: 'all var(--transition-fast)',
            boxShadow: 'var(--shadow-sm)'
          }}
          onMouseEnter={e => {
            if (!wishlistActive) e.currentTarget.style.borderColor = 'var(--color-text-secondary)';
          }}
          onMouseLeave={e => {
            if (!wishlistActive) e.currentTarget.style.borderColor = 'var(--color-border)';
          }}
        >
          <Heart size={16} fill={wishlistActive ? 'var(--color-error)' : 'none'} />
        </button>
      </div>

      {/* Image Gallery / Thumbnail Container */}
      <div
        style={{
          width: '100%',
          height: '200px',
          overflow: 'hidden',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 'var(--space-4)'
        }}
      >
        {product.thumbnail ? (
          <img
            src={product.thumbnail}
            alt={product.title}
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain',
              transition: 'transform var(--transition-base)',
            }}
            className="product-image"
          />
        ) : (
          <div
            style={{
              width: '100%',
              height: '100%',
              background: 'var(--color-bg-secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-text-tertiary)',
              fontSize: 'var(--text-sm)',
            }}
          >
            No Image
          </div>
        )}
      </div>

      {/* Details */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', flexGrow: 1 }}>
        <h4
          style={{
            fontSize: 'var(--text-sm)',
            fontWeight: 'var(--font-weight-medium)',
            lineHeight: 1.4,
            color: 'var(--color-navy)',
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {product.title}
        </h4>

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <Rating value={demoRating} count={demoReviews} showCount />
        </div>

        <div style={{ marginTop: 'auto', paddingTop: 'var(--space-2)' }}>
          <PriceDisplay amount={priceAmount} compareAtAmount={originalAmount} currencyCode={currencyCode} size="md" />
        </div>
      </div>

      {/* Quick Add CTA */}
      {defaultVariant && (
        <button
          onClick={handleAddToCart}
          disabled={isAdding}
          className="btn btn-primary"
          style={{
            marginTop: 'var(--space-4)',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 'var(--space-2)',
            padding: 'var(--space-2)',
            borderRadius: 'var(--radius-sm)',
            fontWeight: 'var(--font-weight-bold)',
            textTransform: 'uppercase',
            fontSize: 'var(--text-xs)',
          }}
        >
          <ShoppingCart size={16} />
          {isAdding ? 'Adding...' : 'Add to Basket'}
        </button>
      )}
      <style jsx>{`
        .product-card-hover:hover {
          box-shadow: var(--shadow-lg);
          border-color: var(--color-blue);
        }
        .product-card-hover:hover .product-image {
          transform: scale(1.05);
        }
      `}</style>
    </Link>
  );
}

export default ProductCard;
