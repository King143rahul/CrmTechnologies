'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingBag, Trash2, ArrowRight, ArrowLeft } from 'lucide-react';
import { useCart } from '@/lib/context/CartContext';
import { formatPrice } from '@/lib/utils';
import QuantitySelector from '@/components/ui/QuantitySelector';
import Button from '@/components/ui/Button';
import Breadcrumb from '@/components/ui/Breadcrumb';

export default function CartPage() {
  const { cart, updateItem, removeItem, itemCount } = useCart();

  const cartSubtotal = cart?.subtotal || 0;
  const currencyCode = cart?.region?.currency_code || 'USD';
  const shippingCost = cartSubtotal >= 15000 ? 0 : 1500; // Free above $150
  const taxCost = Math.round(cartSubtotal * 0.08); // 8% Tax
  const cartTotal = cartSubtotal + shippingCost + taxCost;

  return (
    <div className="container" style={{ paddingTop: 'var(--space-8)', paddingBottom: 'var(--space-12)' }}>
      {/* Breadcrumb */}
      <Breadcrumb items={[{ label: 'Cart' }]} style={{ marginBottom: 'var(--space-8)' }} />

      <h1 style={{ fontSize: 'var(--text-3xl)', marginBottom: 'var(--space-8)' }}>Shopping Cart</h1>

      {cart?.items && cart.items.length > 0 ? (
        <div className="cart-page-layout">
          {/* Items Listing List (Left) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', flexGrow: 1 }}>
            {cart.items.map(item => {
              const itemPrice = item.variant?.calculated_price?.calculated_amount || item.unit_price || 0;
              return (
                <div
                  key={item.id}
                  className="glass-card"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-5)',
                    padding: 'var(--space-5)',
                    flexWrap: 'wrap',
                  }}
                >
                  {/* Thumbnail */}
                  <div
                    style={{
                      width: '90px',
                      height: '90px',
                      background: 'var(--color-bg-secondary)',
                      borderRadius: 'var(--radius-lg)',
                      overflow: 'hidden',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {item.thumbnail ? (
                      <img src={item.thumbnail} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <ShoppingBag size={28} color="var(--color-text-tertiary)" />
                    )}
                  </div>

                  {/* Info Column */}
                  <div style={{ flexGrow: 1, minWidth: '160px', display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
                    <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-semibold)' }}>{item.title}</h3>
                    {item.variant?.title && (
                      <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
                        Variant: {item.variant.title}
                      </span>
                    )}
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>
                      Unit Price: {formatPrice(itemPrice, currencyCode)}
                    </span>
                  </div>

                  {/* Controls Column */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-6)', flexWrap: 'wrap' }}>
                    <QuantitySelector value={item.quantity} onChange={val => updateItem(item.id, val)} />

                    <div style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-bold)', minWidth: '80px', textAlign: 'right' }}>
                      {formatPrice(itemPrice * item.quantity, currencyCode)}
                    </div>

                    <button
                      onClick={() => removeItem(item.id)}
                      style={{
                        cursor: 'pointer',
                        color: 'var(--color-text-secondary)',
                        transition: 'color var(--transition-fast)',
                        padding: '4px',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-accent-rose)')}
                      onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-text-secondary)')}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              );
            })}

            <Link href="/products" style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)', color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>
              <ArrowLeft size={16} /> Continue Shopping
            </Link>
          </div>

          {/* Sidebar Order Summary (Right) */}
          <aside className="summary-sidebar">
            <div className="glass-card" style={{ padding: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-weight-bold)', borderBottom: '1px solid var(--color-border)', paddingBottom: 'var(--space-4)' }}>
                Order Summary
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-sm)' }}>
                  <span style={{ color: 'var(--color-text-secondary)' }}>Subtotal ({itemCount} items)</span>
                  <span>{formatPrice(cartSubtotal, currencyCode)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-sm)' }}>
                  <span style={{ color: 'var(--color-text-secondary)' }}>Shipping</span>
                  <span>{shippingCost === 0 ? 'Free' : formatPrice(shippingCost, currencyCode)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-sm)' }}>
                  <span style={{ color: 'var(--color-text-secondary)' }}>Estimated Tax</span>
                  <span>{formatPrice(taxCost, currencyCode)}</span>
                </div>
                {shippingCost > 0 && (
                  <p style={{ fontSize: '11px', color: 'var(--color-text-tertiary)', fontStyle: 'italic', marginTop: '2px' }}>
                    Add {formatPrice(15000 - cartSubtotal, currencyCode)} more to get Free Shipping!
                  </p>
                )}
              </div>

              <div style={{ height: '1px', background: 'var(--color-border)', margin: 'var(--space-2) 0' }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'var(--font-weight-bold)', fontSize: 'var(--text-lg)' }}>
                <span>Order Total</span>
                <span className="text-gradient">{formatPrice(cartTotal, currencyCode)}</span>
              </div>

              <Link href="/checkout" style={{ width: '100%', marginTop: 'var(--space-4)' }}>
                <Button className="btn-primary" style={{ width: '100%', padding: '14px 0' }}>
                  Proceed to Checkout <ArrowRight size={18} />
                </Button>
              </Link>
            </div>
          </aside>
        </div>
      ) : (
        <div className="glass" style={{ borderRadius: 'var(--radius-xl)', padding: 'var(--space-16) 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-6)', textAlign: 'center' }}>
          <div style={{ padding: 'var(--space-6)', borderRadius: 'var(--radius-full)', background: 'var(--color-surface-glass)' }}>
            <ShoppingBag size={48} color="var(--color-text-tertiary)" />
          </div>
          <div>
            <h2 style={{ fontSize: 'var(--text-xl)' }}>Your shopping cart is empty</h2>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', marginTop: 'var(--space-2)' }}>
              Explore our collections and add items to your cart.
            </p>
          </div>
          <Link href="/products">
            <Button className="btn-primary">Explore Products</Button>
          </Link>
        </div>
      )}

      <style jsx global>{`
        .cart-page-layout {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: var(--space-8);
          align-items: start;
        }
        .summary-sidebar {
          position: sticky;
          top: 96px;
        }
        @media (max-width: 992px) {
          .cart-page-layout {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
