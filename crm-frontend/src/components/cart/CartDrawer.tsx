'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { X, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/lib/context/CartContext';
import { formatPrice } from '@/lib/utils';
import QuantitySelector from '../ui/QuantitySelector';
import styles from './CartDrawer.module.css';

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
        <div className={styles.overlay}>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className={styles.backdrop}
          />

          {/* Drawer Body */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 240 }}
            className={styles.drawer}
          >
            {/* Header */}
            <div className={styles.header}>
              <div className={styles.headerLeft}>
                <ShoppingBag size={18} />
                <h3 className={styles.headerTitle}>Shopping Cart</h3>
                <span className={styles.headerCount}>{itemCount}</span>
              </div>
              <button onClick={closeCart} className={styles.closeBtn} aria-label="Close cart">
                <X size={18} />
              </button>
            </div>

            {/* Cart Items List */}
            <div className={styles.itemsList}>
              {cart?.items && cart.items.length > 0 ? (
                cart.items.map((item) => {
                  const price =
                    item.variant?.calculated_price?.calculated_amount || item.unit_price || 0;
                  const currency =
                    item.variant?.calculated_price?.currency_code ||
                    cart.region?.currency_code ||
                    'ZAR';
                  return (
                    <div key={item.id} className={styles.cartItem}>
                      {/* Thumbnail */}
                      <div className={styles.itemThumb}>
                        {item.thumbnail ? (
                          <img
                            src={item.thumbnail}
                            alt={item.title}
                            className={styles.itemThumbImg}
                          />
                        ) : (
                          <ShoppingBag size={24} color="var(--color-text-tertiary)" />
                        )}
                      </div>

                      {/* Info & Controls */}
                      <div className={styles.itemInfo}>
                        <span className={styles.itemTitle}>{item.title}</span>
                        {item.variant?.title && (
                          <span className={styles.itemVariant}>
                            Variant: {item.variant.title}
                          </span>
                        )}
                        <div className={styles.itemControls}>
                          <QuantitySelector
                            value={item.quantity}
                            onChange={(val) => updateItem(item.id, val)}
                          />
                          <button
                            onClick={() => removeItem(item.id)}
                            className={styles.removeBtn}
                            aria-label="Remove item"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>

                      {/* Price */}
                      <div className={styles.itemPrice}>
                        {formatPrice(price * item.quantity, currency)}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className={styles.emptyState}>
                  <div className={styles.emptyIcon}>
                    <ShoppingBag size={40} color="var(--color-text-tertiary)" />
                  </div>
                  <div>
                    <h4 className={styles.emptyTitle}>Your cart is empty</h4>
                    <p className={styles.emptyDesc}>
                      Add items to your cart to start shopping.
                    </p>
                  </div>
                  <button onClick={closeCart} className="btn btn-secondary btn-sm">
                    Continue Shopping
                  </button>
                </div>
              )}
            </div>

            {/* Footer Summary */}
            {cart?.items && cart.items.length > 0 && (
              <div className={styles.footer}>
                <div className={styles.subtotalRow}>
                  <span className={styles.subtotalLabel}>Subtotal</span>
                  <span className={styles.subtotalValue}>
                    {formatPrice(cart.subtotal, cart.region?.currency_code || 'ZAR')}
                  </span>
                </div>
                <p className={styles.footerNote}>
                  Shipping and taxes calculated at checkout.
                </p>
                <div className={styles.footerActions}>
                  <Link
                    href="/checkout"
                    onClick={closeCart}
                    className={`btn btn-primary ${styles.checkoutLink}`}
                  >
                    Checkout <ArrowRight size={16} />
                  </Link>
                  <Link
                    href="/cart"
                    onClick={closeCart}
                    className={`btn btn-secondary ${styles.viewCartLink}`}
                  >
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
