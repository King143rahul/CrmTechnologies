import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { getVatRate, calculateVat, addVat, removeVat, formatZAR } from "../../../utils/vat"

/**
 * GET /store/vat-info
 * Returns current VAT configuration for the storefront
 */
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const rate = getVatRate()
  const sampleAmount = 1000

  res.json({
    vat_rate_percentage: rate * 100,
    vat_rate_decimal: rate,
    currency: "ZAR",
    example: {
      base_amount: sampleAmount,
      vat_amount: calculateVat(sampleAmount),
      total_incl_vat: addVat(sampleAmount),
      formatted: formatZAR(addVat(sampleAmount)),
    },
  })
}
