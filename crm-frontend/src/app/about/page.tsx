'use client';

import React from 'react';
import { Award, ShieldAlert, Sparkles, Star } from 'lucide-react';
import Breadcrumb from '@/components/ui/Breadcrumb';

export default function AboutPage() {
  return (
    <div className="container" style={{ paddingTop: 'var(--space-8)', paddingBottom: 'var(--space-12)' }}>
      {/* Breadcrumb */}
      <Breadcrumb items={[{ label: 'About Us' }]} style={{ marginBottom: 'var(--space-8)' }} />

      {/* Brand story */}
      <div className="about-hero" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', marginBottom: 'var(--space-16)' }}>
        <h1 style={{ fontSize: 'clamp(var(--text-3xl), 5vw, var(--text-5xl))', fontWeight: 'var(--font-weight-bold)' }}>
          Design Philosophy <br />
          <span className="text-gradient-accent">In Every Detail.</span>
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-base)', lineHeight: 1.7, maxWidth: '720px', marginTop: 'var(--space-2)' }}>
          LUXE was founded on a simple premise: everyday apparel and gear should be elevated, sustainable, and designed to last. We focus on premium fabrics, ethical production routes, and clean geometries to construct essentials that speak through their craftsmanship.
        </p>
      </div>

      {/* Brand Stats counters */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-6)', marginBottom: 'var(--space-16)' }} className="stats-grid">
        {[
          { number: '10K+', label: 'Happy Customers' },
          { number: '100%', label: 'Organic Cotton' },
          { number: '24/7', label: 'Dedicated Support Desk' },
        ].map((stat, idx) => (
          <div
            key={idx}
            className="glass"
            style={{
              padding: 'var(--space-6)',
              borderRadius: 'var(--radius-xl)',
              textAlign: 'center',
              border: '1px solid var(--color-border)',
            }}
          >
            <h2 className="text-gradient" style={{ fontSize: 'var(--text-4xl)', fontWeight: 'var(--font-weight-bold)' }}>{stat.number}</h2>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', textTransform: 'uppercase', display: 'block', marginTop: 'var(--space-2)' }}>
              {stat.label}
            </span>
          </div>
        ))}
      </section>

      {/* Brand values cards */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
        <h2 style={{ fontSize: 'var(--text-2xl)', textAlign: 'center' }}>Our Core Pillars</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-6)' }} className="values-grid">
          {[
            { icon: <Award size={24} />, title: 'Premium Craftsmanship', text: 'We source the finest long-staple organic cotton and premium hardware to construct layers that stand the test of wear.' },
            { icon: <Sparkles size={24} />, title: 'Aesthetic Purity', text: 'Minimalist forms combined with deep dark glass elements construct storefront architectures that are visually satisfying.' },
            { icon: <Star size={24} />, title: 'Customer Experience First', text: 'From secure stripe payments and one-click shipping method options, to real-time order history, we craft seamless customer routes.' },
          ].map((val, idx) => (
            <div
              key={idx}
              className="glass-card"
              style={{
                padding: 'var(--space-6)',
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-4)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '44px',
                  height: '44px',
                  borderRadius: 'var(--radius-full)',
                  background: 'rgba(139, 92, 246, 0.1)',
                  color: 'var(--color-accent-violet)',
                }}
              >
                {val.icon}
              </div>
              <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-bold)' }}>{val.title}</h3>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>{val.text}</p>
            </div>
          ))}
        </div>
      </section>

      <style jsx global>{`
        @media (max-width: 768px) {
          .stats-grid {
            grid-template-columns: 1fr !important;
          }
          .values-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
