'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { getCollectionByHandle, getProducts } from '@/lib/api/products';
import ProductCard from '@/components/ui/ProductCard';
import Breadcrumb from '@/components/ui/Breadcrumb';
import Skeleton from '@/components/ui/Skeleton';

// Mock collection data for fallback
const MOCK_PRODUCTS = [
  { id: 'prod_1', title: 'Aura Premium Cotton Tee', handle: 'aura-premium-cotton-tee', thumbnail: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800', collection: { id: 'col_ess', title: 'Essentials' }, variants: [{ id: 'var_1', title: 'Black / M', calculated_price: { calculated_amount: 4500, original_amount: 6000, currency_code: 'USD' } }] },
  { id: 'prod_5', title: 'Solar Windbreaker Jacket', handle: 'solar-windbreaker-jacket', thumbnail: 'https://images.unsplash.com/photo-1548883354-7622d03aca27?w=800', collection: { id: 'col_ess', title: 'Essentials' }, variants: [{ id: 'var_5', title: 'Off-White', calculated_price: { calculated_amount: 11500, currency_code: 'USD' } }] },
  { id: 'prod_6', title: 'Apollo Linen Longsleeve', handle: 'apollo-linen-longsleeve', thumbnail: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800', collection: { id: 'col_ess', title: 'Essentials' }, variants: [{ id: 'var_6', title: 'Beige', calculated_price: { calculated_amount: 6500, original_amount: 8000, currency_code: 'USD' } }] },
];

export default function CollectionDetailPage() {
  const params = useParams();
  const handle = params.handle as string;

  const [products, setProducts] = useState(MOCK_PRODUCTS);
  const [collectionTitle, setCollectionTitle] = useState('Essentials Collection');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const colRes = await getCollectionByHandle(handle);
        let collectionId = '';
        if (colRes?.collections?.length) {
          const colObj = colRes.collections[0];
          setCollectionTitle(colObj.title);
          collectionId = colObj.id;
        }
        
        // Fetch products in this collection
        const prodRes = await getProducts(collectionId ? { collection_id: [collectionId] } : undefined);
        if (prodRes?.products?.length) {
          setProducts(prodRes.products);
        }
      } catch (err) {
        console.warn('API error, using fallback collection products', err);
        // Format mock title based on handle
        const formatted = handle.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        setCollectionTitle(formatted);
      } finally {
        setIsLoading(false);
      }
    }
    if (handle) {
      loadData();
    }
  }, [handle]);

  return (
    <div className="container" style={{ paddingTop: 'var(--space-8)', paddingBottom: 'var(--space-12)' }}>
      {/* Breadcrumbs */}
      <Breadcrumb items={[{ label: 'Collections', href: '/collections' }, { label: collectionTitle }]} style={{ marginBottom: 'var(--space-6)' }} />

      <div style={{ marginBottom: 'var(--space-10)' }}>
        <h1 style={{ fontSize: 'var(--text-3xl)' }}>{collectionTitle}</h1>
        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginTop: '4px', display: 'block' }}>
          Showing {products.length} products
        </span>
      </div>

      {isLoading ? (
        <div className="collection-grid">
          {Array.from({ length: 3 }).map((_, i) => (
            <ProductCard key={i} loading={true} />
          ))}
        </div>
      ) : (
        <div className="collection-grid">
          {products.map(prod => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      )}

      <style jsx global>{`
        .collection-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--space-6);
        }
        @media (max-width: 992px) {
          .collection-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 576px) {
          .collection-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
