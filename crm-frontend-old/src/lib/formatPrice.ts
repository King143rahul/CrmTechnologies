export function formatZAR(amount: number, includeVat = true): string {
  const vat = 1.15; // South Africa VAT is 15%
  const value = includeVat ? amount : amount / vat;
  return `R ${value.toLocaleString("en-ZA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
