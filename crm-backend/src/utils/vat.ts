/**
 * South African VAT Helper
 * Default rate: 15% (2024 rate)
 * Toggleable to 16% via VAT_RATE env variable
 */

export function getVatRate(): number {
  const rate = parseFloat(process.env.VAT_RATE || "15")
  return rate / 100
}

export function calculateVat(amount: number): number {
  return Math.round(amount * getVatRate() * 100) / 100
}

export function addVat(amount: number): number {
  return Math.round(amount * (1 + getVatRate()) * 100) / 100
}

export function removeVat(amountInclVat: number): number {
  return Math.round((amountInclVat / (1 + getVatRate())) * 100) / 100
}

export function formatZAR(amount: number): string {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
  }).format(amount)
}
