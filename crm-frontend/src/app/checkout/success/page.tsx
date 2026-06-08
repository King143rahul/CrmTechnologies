'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, ShoppingBag, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id') || 'ORD-128491';

  return (
    <div
      className="container"
      style={{
        paddingTop: 'var(--space-12)',
        paddingBottom: 'var(--space-20)',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="glass-card"
        style={{
          maxWidth: '520px',
          width: '100%',
          padding: 'var(--space-10) var(--space-8)',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 'var(--space-6)',
        }}
      >
        {/* Animated Check */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.15, stiffness: 260, damping: 15 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '80px',
            height: '80px',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(16, 185, 129, 0.1)',
            color: 'var(--color-success)',
          }}
        >
          <CheckCircle2 size={48} />
        </motion.div>

        <div>
          <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 'var(--font-weight-bold)' }}>Order Confirmed!</h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', marginTop: 'var(--space-2)', lineHeight: 1.5 }}>
            Thank you for shopping with LUXE. Your order has been successfully placed and is now being processed.
          </p>
        </div>

        {/* Order Details box */}
        <div
          className="glass"
          style={{
            width: '100%',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-4) var(--space-6)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-2)',
            border: '1px solid var(--color-border)',
            fontSize: 'var(--text-sm)',
            textAlign: 'left',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--color-text-secondary)' }}>Order Number</span>
            <span style={{ fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-primary)' }}>{orderId}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--color-text-secondary)' }}>Shipping Method</span>
            <span style={{ color: 'var(--color-text-primary)' }}>Standard Global (Tracked)</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--color-text-secondary)' }}>Delivery Estimate</span>
            <span style={{ color: 'var(--color-text-primary)' }}>4 &ndash; 7 Business Days</span>
          </div>
        </div>

        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', lineHeight: 1.4 }}>
          We have sent a confirmation email containing tracking information to your contact email address.
        </p>

        {/* CTA Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', width: '100%', marginTop: 'var(--space-2)' }}>
          <Link href="/">
            <Button className="btn-primary" style={{ width: '100%', padding: '12px 0' }}>
              Continue Shopping <ShoppingBag size={16} />
            </Button>
          </Link>
          <Link href="/account">
            <Button variant="secondary" style={{ width: '100%', padding: '12px 0' }}>
              View My Orders <ArrowRight size={16} />
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div className="container" style={{ paddingTop: 'var(--space-12)', textAlign: 'center' }}>Loading order confirmation...</div>}>
      <CheckoutSuccessContent />
    </Suspense>
  );
}
