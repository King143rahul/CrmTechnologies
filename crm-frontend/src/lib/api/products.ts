import { medusaRequest } from '../medusa';

/**
 * Append region_id to all product queries to satisfy Medusa v2 pricing context requirement.
 */
function withRegion(params: URLSearchParams, regionId?: string | null) {
  const stored = typeof window !== 'undefined' ? localStorage.getItem('crm_region_id') : null;
  const id = regionId || stored;
  if (id) params.set('region_id', id);
}

export async function getProducts(params?: {
  limit?: number;
  offset?: number;
  collection_id?: string[];
  order?: string;
  q?: string;
  regionId?: string | null;
}) {
  const searchParams = new URLSearchParams();
  if (params?.limit) searchParams.set('limit', String(params.limit));
  if (params?.offset) searchParams.set('offset', String(params.offset));
  if (params?.collection_id) params.collection_id.forEach(id => searchParams.append('collection_id[]', id));
  if (params?.order) searchParams.set('order', params.order);
  if (params?.q) searchParams.set('q', params.q);
  searchParams.set('fields', '*variants.calculated_price');
  withRegion(searchParams, params?.regionId);

  const query = searchParams.toString();
  return medusaRequest(`/store/products${query ? `?${query}` : ''}`);
}

export async function getProductByHandle(handle: string, regionId?: string | null) {
  const params = new URLSearchParams();
  params.set('handle', handle);
  params.set('fields', '*variants.calculated_price');
  withRegion(params, regionId);
  return medusaRequest(`/store/products?${params.toString()}`);
}

export async function getCollections(params?: { limit?: number; offset?: number }) {
  const searchParams = new URLSearchParams();
  if (params?.limit) searchParams.set('limit', String(params.limit));
  if (params?.offset) searchParams.set('offset', String(params.offset));
  const query = searchParams.toString();
  return medusaRequest(`/store/collections${query ? `?${query}` : ''}`);
}

export async function getCollectionByHandle(handle: string) {
  return medusaRequest(`/store/collections?handle=${handle}`);
}

export async function searchProducts(query: string, regionId?: string | null) {
  const params = new URLSearchParams();
  params.set('q', encodeURIComponent(query));
  params.set('fields', '*variants.calculated_price');
  withRegion(params, regionId);
  return medusaRequest(`/store/products?${params.toString()}`);
}
