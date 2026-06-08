import { medusaRequest } from '../medusa';

export async function createCart() {
  return medusaRequest('/store/carts', {
    method: 'POST',
    body: JSON.stringify({}),
  });
}

export async function getCart(cartId: string) {
  return medusaRequest(`/store/carts/${cartId}`);
}

export async function addToCart(cartId: string, variantId: string, quantity: number = 1) {
  return medusaRequest(`/store/carts/${cartId}/line-items`, {
    method: 'POST',
    body: JSON.stringify({ variant_id: variantId, quantity }),
  });
}

export async function updateLineItem(cartId: string, lineItemId: string, quantity: number) {
  return medusaRequest(`/store/carts/${cartId}/line-items/${lineItemId}`, {
    method: 'POST',
    body: JSON.stringify({ quantity }),
  });
}

export async function removeLineItem(cartId: string, lineItemId: string) {
  return medusaRequest(`/store/carts/${cartId}/line-items/${lineItemId}`, {
    method: 'DELETE',
  });
}

export async function updateCart(cartId: string, data: Record<string, unknown>) {
  return medusaRequest(`/store/carts/${cartId}`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function addShippingMethod(cartId: string, optionId: string) {
  return medusaRequest(`/store/carts/${cartId}/shipping-methods`, {
    method: 'POST',
    body: JSON.stringify({ option_id: optionId }),
  });
}

export async function createPaymentSessions(cartId: string) {
  return medusaRequest(`/store/carts/${cartId}/payment-sessions`, {
    method: 'POST',
  });
}

export async function completeCart(cartId: string) {
  return medusaRequest(`/store/carts/${cartId}/complete`, {
    method: 'POST',
  });
}

export async function getShippingOptions(cartId: string) {
  return medusaRequest(`/store/shipping-options?cart_id=${cartId}`);
}
