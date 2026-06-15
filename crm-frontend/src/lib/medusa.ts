const isBrowser = typeof window !== 'undefined';
const MEDUSA_BACKEND_URL = isBrowser
  ? 'http://localhost:9000'
  : (process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000');
const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || '';

export async function medusaRequest(path: string, options: RequestInit = {}) {
  const url = `${MEDUSA_BACKEND_URL}${path}`;
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'x-publishable-api-key': PUBLISHABLE_KEY,
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `Request failed: ${response.status}`);
  }

  // Handle 204 No Content
  if (response.status === 204) return null;
  return response.json();
}
