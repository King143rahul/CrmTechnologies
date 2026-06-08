import { medusaRequest } from '../medusa';

export async function getProducts(params?: { limit?: number; offset?: number; collection_id?: string[]; order?: string }) {
  const searchParams = new URLSearchParams();
  if (params?.limit) searchParams.set('limit', String(params.limit));
  if (params?.offset) searchParams.set('offset', String(params.offset));
  if (params?.collection_id) params.collection_id.forEach(id => searchParams.append('collection_id[]', id));
  if (params?.order) searchParams.set('order', params.order);
  searchParams.set('fields', '*variants.calculated_price'); // get calculated price in Medusa v2
  
  const query = searchParams.toString();
  return medusaRequest(`/store/products${query ? `?${query}` : ''}`);
}

export async function getProductByHandle(handle: string) {
  return medusaRequest(`/store/products?handle=${handle}&fields=*variants.calculated_price`);
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

export async function searchProducts(query: string) {
  return medusaRequest(`/store/products?q=${encodeURIComponent(query)}&fields=*variants.calculated_price`);
}
