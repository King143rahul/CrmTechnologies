import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

/**
 * POST /store/shipping-rates
 * Get real-time shipping rates from The Courier Guy / Bob Go
 * Currently stubbed with mock rates — replace with real API when key is configured
 */
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const { destination_postal_code, weight_kg, dimensions } = req.body as {
    destination_postal_code: string
    weight_kg: number
    dimensions?: { length: number; width: number; height: number }
  }

  const provider = process.env.SHIPPING_PROVIDER || "thecourierguy"
  const apiKey = process.env.SHIPPING_API_KEY

  // If no real API key, return mock rates
  if (!apiKey || apiKey === "YOUR_SHIPPING_API_KEY") {
    const mockRates = generateMockRates(
      destination_postal_code,
      weight_kg || 1
    )
    return res.json({
      provider,
      rates: mockRates,
      mock: true,
      message:
        "Using mock shipping rates. Configure SHIPPING_API_KEY for real rates.",
    })
  }

  // TODO: Replace with real API call to The Courier Guy or Bob Go
  // Example for The Courier Guy:
  // const response = await fetch('https://api.thecourierguy.co.za/rates', {
  //   method: 'POST',
  //   headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ destination: destination_postal_code, weight: weight_kg, dimensions })
  // })

  const mockRates = generateMockRates(destination_postal_code, weight_kg || 1)
  res.json({ provider, rates: mockRates })
}

function generateMockRates(postalCode: string, weightKg: number) {
  const baseRate = 65 // Base rate in ZAR
  const perKgRate = 15 // Per kg surcharge

  // Simulate distance-based pricing
  const postalNum = parseInt(postalCode) || 2000
  const distanceFactor =
    postalNum < 2000 ? 1.0 : postalNum < 5000 ? 1.3 : postalNum < 7000 ? 1.5 : 1.8

  const standardRate = Math.round(
    (baseRate + weightKg * perKgRate) * distanceFactor
  )
  const expressRate = Math.round(standardRate * 1.6)
  const economyRate = Math.round(standardRate * 0.7)

  return [
    {
      id: "economy",
      name: "Economy (5–7 business days)",
      amount: economyRate,
      currency: "ZAR",
      estimated_days: "5-7",
    },
    {
      id: "standard",
      name: "Standard (2–3 business days)",
      amount: standardRate,
      currency: "ZAR",
      estimated_days: "2-3",
    },
    {
      id: "express",
      name: "Express (Next day)",
      amount: expressRate,
      currency: "ZAR",
      estimated_days: "1",
    },
  ]
}
