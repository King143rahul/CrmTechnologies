'use client';

import React from 'react';
import Link from 'next/navigation';
import NextLink from 'next/link';
import { ShoppingBag, Trash2, ArrowRight, ArrowLeft } from 'lucide-react';
import { useCart } from '@/lib/context/CartContext';
import { formatPrice } from '@/lib/utils';
import QuantitySelector from '@/components/ui/QuantitySelector';
import Button from '@/components/ui/Button';
import Breadcrumb from '@/components/ui/Breadcrumb';
import styles from './CartPage.module.css';

export default function CartPage() {
  const { cart, updateItem, removeItem, itemCount } = useCart();

  const cartSubtotal = cart?.subtotal || 0;
  const currencyCode = cart?.region?.currency_code || 'ZAR';
  const shippingCost = cartSubtotal >= 15000 ? 0 : 1500; // Free above R150
  const taxCost = Math.round(cartSubtotal * 0.15); // standard 15% VAT for ZAR
  const cartTotal = cartSubtotal + shippingCost + taxCost;

  return (
    <div className={styles.container}>
      {/* Breadcrumb */}
      <div className={styles.breadcrumb}>
        <Breadcrumb items={[{ label: 'Cart' }]} />
      </div>

      <h1 className={styles.title}>Shopping Cart</h1>

      {cart?.items && cart.items.length > 0 ? (
        <div className={styles.cartPageLayout}>
          {/* Items Listing List (Left) */}
          <div className={styles.itemsList}>
            {cart.items.map(item => {
              const itemPrice = item.variant?.calculated_price?.calculated_amount || item.unit_price || 0;
              return (
                <div key={item.id} className={styles.cartItem}>
                  {/* Thumbnail */}
                  <div className={styles.itemThumbWrapper}>
                    {item.thumbnail ? (
                      <img src={item.thumbnail} alt={item.title} className={styles.itemThumb} />
                    ) : (
                      <ShoppingBag size={28} color="var(--color-text-tertiary)" />
                    )}
                  </div>

                  {/* Info Column */}
                  <div className={styles.itemInfo}>
                    <h3 className={styles.itemTitle}>{item.title}</h3>
                    {item.variant?.title && (
                      <span className={styles.itemMeta}>
                        Variant: {item.variant.title}
                      </span>
                    )}
                    <span className={styles.itemPrice}>
                      Unit Price: {formatPrice(itemPrice, currencyCode)}
                    </span>
                  </div>

                  {/* Controls Column */}
                  <div className={styles.itemControls}>
                    <QuantitySelector value={item.quantity} onChange={val => updateItem(item.id, val)} />

                    <div className={styles.itemSubtotal}>
                      {formatPrice(itemPrice * item.quantity, currencyCode)}
                    </div>

                    <button
                      onClick={() => removeItem(item.id)}
                      className={styles.removeBtn}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              );
            })}

            <NextLink href="/products" className={styles.continueShopping}>
              <ArrowLeft size={16} /> Continue Shopping
            </NextLink>
          </div>

          {/* Sidebar Order Summary (Right) */}
          <aside className={styles.summarySidebar}>
            <div className={styles.summaryCard}>
              <h3 className={styles.summaryTitle}>
                Order Summary
              </h3>

              <div className={styles.summaryDetails}>
                <div className={styles.summaryRow}>
                  <span className={styles.summaryRowLabelSecondary}>Subtotal ({itemCount} items)</span>
                  <span>{formatPrice(cartSubtotal, currencyCode)}</span>
                </div>
                <div className={styles.summaryRow}>
                  <span className={styles.summaryRowLabelSecondary}>Shipping</span>
                  <span>{shippingCost === 0 ? 'Free' : formatPrice(shippingCost, currencyCode)}</span>
                </div>
                <div className={styles.summaryRow}>
                  <span className={styles.summaryRowLabelSecondary}>Estimated Tax (VAT)</span>
                  <span>{formatPrice(taxCost, currencyCode)}</span>
                </div>
                {shippingCost > 0 && (
                  <p className={styles.shippingPromo}>
                    Add {formatPrice(15000 - cartSubtotal, currencyCode)} more to get Free Shipping!
                  </p>
                )}
              </div>

              <div className={styles.divider} />

              <div className={styles.totalRow}>
                <span>Order Total</span>
                <span className="text-gradient">{formatPrice(cartTotal, currencyCode)}</span>
              </div>

              <NextLink href="/checkout" className={styles.checkoutLink}>
                <Button className={`btn-primary ${styles.checkoutBtn}`}>
                  Proceed to Checkout <ArrowRight size={18} />
                </Button>
              </NextLink>
            </div>
          </aside>
        </div>
      ) : (
        <div className={styles.emptyState}>
          <div className={styles.emptyIconWrapper}>
            <ShoppingBag size={48} color="var(--color-text-tertiary)" />
          </div>
          <div>
            <h2 className={styles.emptyTitle}>Your shopping cart is empty</h2>
            <p className={styles.emptySub}>
              Explore our collections and add items to your cart.
            </p>
          </div>
          <NextLink href="/products">
            <Button className="btn-primary">Explore Products</Button>
          </NextLink>
        </div>
      )}
    </div>
  );
}

