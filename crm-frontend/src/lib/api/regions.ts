import { medusaRequest } from '../medusa';

export async function getRegions() {
  return medusaRequest('/store/regions');
}
