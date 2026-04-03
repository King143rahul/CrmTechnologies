/**
 * Bulk Product Importer: Shopify CSV → Medusa
 *
 * Maps Shopify product export CSV columns to Medusa product schema.
 * Run: npx medusa exec src/scripts/import-shopify-csv.ts -- --file=products.csv
 *
 * Shopify CSV columns mapped:
 *   Handle → handle
 *   Title → title
 *   Body (HTML) → description
 *   Vendor → metadata.vendor
 *   Type → type (collection)
 *   Tags → tags
 *   Variant SKU → variant.sku
 *   Variant Price → variant price
 *   Variant Weight → variant.weight
 *   Image Src → thumbnail
 *   Option1 Name/Value → option + variant option value
 */
import { ExecArgs } from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  Modules,
} from "@medusajs/framework/utils"
import * as fs from "fs"
import * as path from "path"

interface ShopifyRow {
  Handle: string
  Title: string
  "Body (HTML)": string
  Vendor: string
  Type: string
  Tags: string
  "Variant SKU": string
  "Variant Price": string
  "Variant Grams": string
  "Image Src": string
  "Option1 Name": string
  "Option1 Value": string
  "Option2 Name": string
  "Option2 Value": string
  "Option3 Name": string
  "Option3 Value": string
  Status: string
}

function parseCSV(content: string): ShopifyRow[] {
  const lines = content.split("\n")
  if (lines.length < 2) return []

  const headers = lines[0].split(",").map((h) => h.trim().replace(/"/g, ""))
  const rows: ShopifyRow[] = []

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue

    // Simple CSV parsing (handles basic cases)
    const values: string[] = []
    let current = ""
    let inQuotes = false

    for (const char of line) {
      if (char === '"') {
        inQuotes = !inQuotes
      } else if (char === "," && !inQuotes) {
        values.push(current.trim())
        current = ""
      } else {
        current += char
      }
    }
    values.push(current.trim())

    const row: any = {}
    headers.forEach((header, idx) => {
      row[header] = values[idx] || ""
    })
    rows.push(row)
  }

  return rows
}

export default async function importShopifyCSV({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const productService = container.resolve(Modules.PRODUCT)

  // Get file path from command line args
  const fileArg = process.argv.find((arg) => arg.startsWith("--file="))
  const filePath = fileArg
    ? fileArg.split("=")[1]
    : path.join(process.cwd(), "products.csv")

  logger.info(`📦 Importing products from: ${filePath}`)

  if (!fs.existsSync(filePath)) {
    logger.error(`❌ File not found: ${filePath}`)
    logger.info("Usage: npx medusa exec src/scripts/import-shopify-csv.ts -- --file=path/to/products.csv")
    return
  }

  const content = fs.readFileSync(filePath, "utf-8")
  const rows = parseCSV(content)

  logger.info(`📋 Found ${rows.length} rows in CSV`)

  // Group rows by Handle (parent product)
  const productMap = new Map<string, ShopifyRow[]>()
  for (const row of rows) {
    const handle = row.Handle
    if (!handle) continue
    if (!productMap.has(handle)) {
      productMap.set(handle, [])
    }
    productMap.get(handle)!.push(row)
  }

  logger.info(`📦 Found ${productMap.size} unique products`)

  let created = 0
  let failed = 0

  for (const [handle, productRows] of productMap) {
    const firstRow = productRows[0]

    try {
      // Collect options from all variants
      const optionNames = new Set<string>()
      if (firstRow["Option1 Name"]) optionNames.add(firstRow["Option1 Name"])
      if (firstRow["Option2 Name"]) optionNames.add(firstRow["Option2 Name"])
      if (firstRow["Option3 Name"]) optionNames.add(firstRow["Option3 Name"])

      const options = Array.from(optionNames).map((name) => ({
        title: name,
        values: [
          ...new Set(
            productRows
              .map((r) => {
                if (r["Option1 Name"] === name) return r["Option1 Value"]
                if (r["Option2 Name"] === name) return r["Option2 Value"]
                if (r["Option3 Name"] === name) return r["Option3 Value"]
                return ""
              })
              .filter(Boolean)
          ),
        ],
      }))

      // Build variants
      const variants = productRows
        .filter((r) => r["Variant SKU"])
        .map((r) => {
          const optionValues: Record<string, string> = {}
          if (r["Option1 Name"])
            optionValues[r["Option1 Name"]] = r["Option1 Value"]
          if (r["Option2 Name"])
            optionValues[r["Option2 Name"]] = r["Option2 Value"]
          if (r["Option3 Name"])
            optionValues[r["Option3 Name"]] = r["Option3 Value"]

          return {
            title: Object.values(optionValues).join(" / ") || firstRow.Title,
            sku: r["Variant SKU"],
            options: optionValues,
            prices: [
              {
                amount: Math.round(parseFloat(r["Variant Price"] || "0") * 100),
                currency_code: "zar",
              },
            ],
            metadata: {
              weight_grams: r["Variant Grams"] || null,
            },
          }
        })

      // Create the product
      await productService.createProducts({
        title: firstRow.Title,
        handle,
        description: firstRow["Body (HTML)"] || "",
        status: firstRow.Status === "active" ? "published" : "draft",
        thumbnail: firstRow["Image Src"] || null,
        metadata: {
          vendor: firstRow.Vendor || null,
          imported_from: "shopify",
          tags: firstRow.Tags || null,
        },
        options: options.map((o) => ({ title: o.title })),
        variants: variants.map((v) => ({
          title: v.title,
          sku: v.sku,
          options: v.options,
          metadata: v.metadata,
        })),
      } as any)

      created++
      logger.info(`  ✅ ${firstRow.Title} (${variants.length} variants)`)
    } catch (error) {
      failed++
      logger.error(`  ❌ Failed to import "${firstRow.Title}": ${error}`)
    }
  }

  logger.info("")
  logger.info(`📊 Import complete: ${created} created, ${failed} failed`)
}
