'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { X, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/lib/context/CartContext';
import { formatPrice } from '@/lib/utils';
import QuantitySelector from '../ui/QuantitySelector';

export function CartDrawer() {
  const { isCartOpen, closeCart, cart, updateItem, removeItem, itemCount } = useCart();

  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isCartOpen]);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 200, // var(--z-overlay)
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.6)',
              backdropFilter: 'blur(4px)',
              WebkitBackdropFilter: 'blur(4px)',
            }}
          />

          {/* Drawer Body */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 240 }}
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '420px',
              height: '100%',
              boxShadow: 'var(--shadow-lg)',
              display: 'flex',
              flexDirection: 'column',
              zIndex: 10,
            }}
            className="glass"
          >
            {/* Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 'var(--space-6)',
                borderBottom: '1px solid var(--color-border)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <ShoppingBag size={18} />
                <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-weight-bold)' }}>Shopping Cart</h3>
                <span
                  style={{
                    fontSize: 'var(--text-xs)',
                    color: 'var(--color-text-secondary)',
                    background: 'var(--color-bg-tertiary)',
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-full)',
                  }}
                >
                  {itemCount}
                </span>
              </div>
              <button
                onClick={closeCart}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '32px',
                  height: '32px',
                  borderRadius: 'var(--radius-full)',
                  cursor: 'pointer',
                  color: 'var(--color-text-secondary)',
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Cart Items List */}
            <div style={{ flexGrow: 1, overflowY: 'auto', padding: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
              {cart?.items && cart.items.length > 0 ? (
                cart.items.map(item => {
                  const price = item.variant?.calculated_price?.calculated_amount || item.unit_price || 0;
                  const currency = item.variant?.calculated_price?.currency_code || cart.region?.currency_code || 'USD';
                  return (
                    <div
                      key={item.id}
                      style={{
                        display: 'flex',
                        gap: 'var(--space-4)',
                        paddingBottom: 'var(--space-5)',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                      }}
                    >
                      {/* Thumbnail */}
                      <div
                        style={{
                          width: '74px',
                          height: '74px',
                          borderRadius: 'var(--radius-md)',
                          background: 'var(--color-bg-secondary)',
                          overflow: 'hidden',
                          flexShrink: 0,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {item.thumbnail ? (
                          <img src={item.thumbnail} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <ShoppingBag size={24} color="var(--color-text-tertiary)" />
                        )}
                      </div>

                      {/* Info & Quantity controls */}
                      <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
                        <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-primary)' }}>
                          {item.title}
                        </span>
                        {item.variant?.title && (
                          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
                            Variant: {item.variant.title}
                          </span>
                        )}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'var(--space-2)' }}>
                          <QuantitySelector value={item.quantity} onChange={val => updateItem(item.id, val)} />
                          <button
                            onClick={() => removeItem(item.id)}
                            style={{
                              cursor: 'pointer',
                              color: 'var(--color-text-secondary)',
                              transition: 'color var(--transition-fast)',
                            }}
                            onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-accent-rose)')}
                            onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-text-secondary)')}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>

                      {/* Price */}
                      <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-text-primary)', textAlign: 'right' }}>
                        {formatPrice(price * item.quantity, currency)}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 'var(--space-4)', color: 'var(--color-text-secondary)', textAlign: 'center' }}>
                  <div style={{ padding: 'var(--space-6)', borderRadius: 'var(--radius-full)', background: 'var(--color-surface-glass)' }}>
                    <ShoppingBag size={40} color="var(--color-text-tertiary)" />
                  </div>
                  <div>
                    <h4 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-text-primary)' }}>
                      Your cart is empty
                    </h4>
                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', marginTop: '4px', maxWidth: '200px' }}>
                      Add items to your cart to start shopping.
                    </p>
                  </div>
                  <button onClick={closeCart} className="btn btn-secondary btn-sm" style={{ marginTop: 'var(--space-2)' }}>
                    Continue Shopping
                  </button>
                </div>
              )}
            </div>

            {/* Footer Summary / CTAs */}
            {cart?.items && cart.items.length > 0 && (
              <div
                style={{
                  padding: 'var(--space-6)',
                  borderTop: '1px solid var(--color-border)',
                  background: 'rgba(6, 6, 12, 0.4)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--space-4)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>Subtotal</span>
                  <span style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-weight-bold)' }}>
                    {formatPrice(cart.subtotal, cart.region?.currency_code || 'USD')}
                  </span>
                </div>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', lineHeight: 1.4 }}>
                  Shipping and taxes calculated at checkout.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', marginTop: 'var(--space-2)' }}>
                  <Link href="/checkout" onClick={closeCart} className="btn btn-primary" style={{ width: '100%' }}>
                    Checkout <ArrowRight size={16} />
                  </Link>
                  <Link href="/cart" onClick={closeCart} className="btn btn-secondary" style={{ width: '100%' }}>
                    View Cart
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default CartDrawer;
