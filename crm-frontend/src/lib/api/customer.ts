import { medusaRequest } from '../medusa';

export async function registerCustomer(data: { email: string; password: string; first_name: string; last_name: string }) {
  // Registering via Auth API in Medusa v2
  await medusaRequest('/auth/customer/emailpass/register', {
    method: 'POST',
    body: JSON.stringify({ email: data.email, password: data.password }),
  });
  
  // Login to get token
  const authRes = await medusaRequest('/auth/customer/emailpass', {
    method: 'POST',
    body: JSON.stringify({ email: data.email, password: data.password }),
  });
  
  // Create profile
  return medusaRequest('/store/customers', {
    method: 'POST',
    body: JSON.stringify({ first_name: data.first_name, last_name: data.last_name }),
    headers: { Authorization: `Bearer ${authRes.token}` },
  });
}

export async function loginCustomer(email: string, password: string) {
  return medusaRequest('/auth/customer/emailpass', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function getCustomer(token: string) {
  return medusaRequest('/store/customers/me', {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function updateCustomer(token: string, data: Record<string, unknown>) {
  return medusaRequest('/store/customers/me', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function getCustomerOrders(token: string) {
  return medusaRequest('/store/orders', {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function addCustomerAddress(token: string, address: Record<string, unknown>) {
  return medusaRequest('/store/customers/me/addresses', {
    method: 'POST',
    body: JSON.stringify(address),
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function updateCustomerAddress(token: string, addressId: string, address: Record<string, unknown>) {
  return medusaRequest(`/store/customers/me/addresses/${addressId}`, {
    method: 'POST',
    body: JSON.stringify(address),
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function deleteCustomerAddress(token: string, addressId: string) {
  return medusaRequest(`/store/customers/me/addresses/${addressId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
}
