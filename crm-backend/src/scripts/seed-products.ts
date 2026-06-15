import { ExecArgs } from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  Modules,
} from "@medusajs/framework/utils"
import { createProductsWorkflow } from "@medusajs/medusa/core-flows"

export default async function seedProducts({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const storeModuleService = container.resolve(Modules.STORE)
  const regionModuleService = container.resolve(Modules.REGION)
  const productModuleService = container.resolve(Modules.PRODUCT)
  const salesChannelModuleService = container.resolve(Modules.SALES_CHANNEL)

  logger.info("Starting seed-products script...")

  // 1. Ensure ZAR is supported in the store
  logger.info("Ensuring ZAR currency support...")
  const [store] = await storeModuleService.listStores()
  const currentCurrencies = store.supported_currencies || []
  const hasZar = currentCurrencies.some(c => c.currency_code === "zar")
  if (!hasZar) {
    await storeModuleService.updateStores({
      id: store.id,
      supported_currencies: [
        ...currentCurrencies.map(c => ({ currency_code: c.currency_code, is_default: c.is_default })),
        { currency_code: "zar", is_default: false }
      ]
    })
    logger.info("  ✅ Added ZAR to store supported currencies.")
  }

  // 2. Ensure SA region is set to ZAR
  logger.info("Checking SA region currency...")
  const regions = await regionModuleService.listRegions()
  const saRegion = regions.find(r => r.name.toLowerCase() === "sa" || r.name.toLowerCase() === "south africa")
  if (saRegion) {
    if (saRegion.currency_code !== "zar") {
      await regionModuleService.updateRegions({
        id: saRegion.id,
        currency_code: "zar"
      })
      logger.info(`  ✅ Updated region '${saRegion.name}' currency to ZAR.`)
    }
  } else {
    // Create SA region if it doesn't exist
    const newRegion = await regionModuleService.createRegions({
      name: "SA",
      currency_code: "zar",
      countries: ["za"]
    })
    logger.info(`  ✅ Created SA region with ID: ${newRegion.id}`)
  }

  // 3. Find or Create collections
  logger.info("Ensuring product collections exist...")
  const collectionData = [
    { title: "Laptops", handle: "laptops" },
    { title: "Desktops", handle: "desktops" },
    { title: "Monitors", handle: "monitors" },
    { title: "Components", handle: "components" },
    { title: "Accessories", handle: "accessories" },
    { title: "Storage", handle: "storage" },
  ]

  const collectionsMap = new Map<string, string>() // handle -> id
  for (const col of collectionData) {
    const existing = await productModuleService.listProductCollections({ handle: col.handle })
    if (existing.length > 0) {
      collectionsMap.set(col.handle, existing[0].id)
      logger.info(`  Collection '${col.title}' already exists.`)
    } else {
      const created = await productModuleService.createProductCollections(col)
      collectionsMap.set(col.handle, created.id)
      logger.info(`  ✅ Created collection '${col.title}'.`)
    }
  }

  // 4. Retrieve Default Sales Channel
  const [defaultSalesChannel] = await salesChannelModuleService.listSalesChannels({
    name: "Default Sales Channel"
  })
  const salesChannelId = defaultSalesChannel ? defaultSalesChannel.id : null
  logger.info(`Using Sales Channel ID: ${salesChannelId}`)

  // 5. Define products list
  const productsToCreate = [
    // Laptops
    {
      title: "Lenovo ThinkPad X1 Carbon Gen 11",
      handle: "lenovo-thinkpad-x1-carbon-gen-11",
      description: "Intel Core i7-1365U, 16GB LPDDR5 RAM, 512GB NVMe SSD, 14-inch WUXGA IPS Display, Windows 11 Pro.",
      thumbnail: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&auto=format&fit=crop&q=80",
      status: "published",
      collection_id: collectionsMap.get("laptops"),
      sales_channels: salesChannelId ? [{ id: salesChannelId }] : undefined,
      options: [{ title: "Storage", values: ["512GB SSD", "1TB SSD"] }],
      variants: [
        {
          title: "512GB SSD",
          sku: "LNV-X1C11-512G",
          options: { Storage: "512GB SSD" },
          prices: [{ amount: 2899900, currency_code: "zar" }] // R28,999.00
        },
        {
          title: "1TB SSD",
          sku: "LNV-X1C11-1TB",
          options: { Storage: "1TB SSD" },
          prices: [{ amount: 3349900, currency_code: "zar" }] // R33,499.00
        }
      ]
    },
    {
      title: "Dell XPS 15 9530",
      handle: "dell-xps-15-9530",
      description: "Intel Core i9-13900H, 32GB DDR5 RAM, 1TB NVMe SSD, NVIDIA GeForce RTX 4060 8GB, 15.6-inch OLED Touch Display, Windows 11 Pro.",
      thumbnail: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=600&auto=format&fit=crop&q=80",
      status: "published",
      collection_id: collectionsMap.get("laptops"),
      sales_channels: salesChannelId ? [{ id: salesChannelId }] : undefined,
      options: [{ title: "Color", values: ["Platinum Silver"] }],
      variants: [
        {
          title: "Platinum Silver",
          sku: "DLL-XPS15-SLV",
          options: { Color: "Platinum Silver" },
          prices: [{ amount: 4299900, currency_code: "zar" }] // R42,999.00
        }
      ]
    },
    {
      title: "Apple MacBook Pro 16-inch M3 Max",
      handle: "apple-macbook-pro-16-m3-max",
      description: "Apple M3 Max Chip (14-Core CPU, 30-Core GPU), 36GB Unified Memory, 1TB SSD, 16.2-inch Liquid Retina XDR Display, macOS Sonoma.",
      thumbnail: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80",
      status: "published",
      collection_id: collectionsMap.get("laptops"),
      sales_channels: salesChannelId ? [{ id: salesChannelId }] : undefined,
      options: [{ title: "Color", values: ["Space Black", "Silver"] }],
      variants: [
        {
          title: "Space Black",
          sku: "APL-MBP16-BLK",
          options: { Color: "Space Black" },
          prices: [{ amount: 6999900, currency_code: "zar" }] // R69,999.00
        },
        {
          title: "Silver",
          sku: "APL-MBP16-SLV",
          options: { Color: "Silver" },
          prices: [{ amount: 6999900, currency_code: "zar" }] // R69,999.00
        }
      ]
    },

    // Monitors
    {
      title: "Dell UltraSharp 27 4K USB-C Hub Monitor",
      handle: "dell-ultrasharp-27-u2723qe",
      description: "27-inch 4K UHD (3840 x 2160) IPS Black technology monitor, USB-C Hub with 90W Power Delivery, RJ45, DisplayPort, HDMI.",
      thumbnail: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop&q=80",
      status: "published",
      collection_id: collectionsMap.get("monitors"),
      sales_channels: salesChannelId ? [{ id: salesChannelId }] : undefined,
      options: [{ title: "Default Option", values: ["Standard Edition"] }],
      variants: [
        {
          title: "Standard Edition",
          sku: "DLL-U2723QE",
          options: { "Default Option": "Standard Edition" },
          prices: [{ amount: 1149900, currency_code: "zar" }] // R11,499.00
        }
      ]
    },
    {
      title: "ASUS ROG Swift 32 OLED Gaming Monitor",
      handle: "asus-rog-swift-pg32ucdm",
      description: "32-inch 4K (3840 x 2160) QD-OLED gaming monitor, 240Hz refresh rate, 0.03ms response time, G-SYNC Compatible, custom heatsink.",
      thumbnail: "https://images.unsplash.com/photo-1547082299-de196ea013d6?w=600&auto=format&fit=crop&q=80",
      status: "published",
      collection_id: collectionsMap.get("monitors"),
      sales_channels: salesChannelId ? [{ id: salesChannelId }] : undefined,
      options: [{ title: "Default Option", values: ["Standard Edition"] }],
      variants: [
        {
          title: "Standard Edition",
          sku: "ASU-PG32UCDM",
          options: { "Default Option": "Standard Edition" },
          prices: [{ amount: 2699900, currency_code: "zar" }] // R26,999.00
        }
      ]
    },

    // PC Components
    {
      title: "NVIDIA GeForce RTX 4080 Super 16GB GPU",
      handle: "nvidia-geforce-rtx-4080-super",
      description: "16GB GDDR6X, DLSS 3.0, Ray Tracing Gen 3, HDMI 2.1a, DisplayPort 1.4a. High-performance gaming graphics card.",
      thumbnail: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=600&auto=format&fit=crop&q=80",
      status: "published",
      collection_id: collectionsMap.get("components"),
      sales_channels: salesChannelId ? [{ id: salesChannelId }] : undefined,
      options: [{ title: "Brand", values: ["ASUS ROG Strix Edition", "MSI Gaming X Slim"] }],
      variants: [
        {
          title: "ASUS ROG Strix Edition",
          sku: "GPU-4080S-ROG",
          options: { Brand: "ASUS ROG Strix Edition" },
          prices: [{ amount: 2499900, currency_code: "zar" }] // R24,999.00
        },
        {
          title: "MSI Gaming X Slim",
          sku: "GPU-4080S-MSI",
          options: { Brand: "MSI Gaming X Slim" },
          prices: [{ amount: 2199900, currency_code: "zar" }] // R21,999.00
        }
      ]
    },
    {
      title: "Intel Core i9-14900K Processor",
      handle: "intel-core-i9-14900k",
      description: "14th Gen Desktop Processor, 24 Cores (8 P-cores + 16 E-cores), LGA1700 Socket, Max Turbo Boost up to 6.0 GHz.",
      thumbnail: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80",
      status: "published",
      collection_id: collectionsMap.get("components"),
      sales_channels: salesChannelId ? [{ id: salesChannelId }] : undefined,
      options: [{ title: "Default Option", values: ["Retail Box"] }],
      variants: [
        {
          title: "Retail Box",
          sku: "CPU-I9-14900K",
          options: { "Default Option": "Retail Box" },
          prices: [{ amount: 1199900, currency_code: "zar" }] // R11,999.00
        }
      ]
    },

    // Accessories
    {
      title: "Logitech MX Master 3S Wireless Mouse",
      handle: "logitech-mx-master-3s",
      description: "Ergonomic wireless productivity mouse with 8K DPI tracking, quiet clicks, MagSpeed electromagnetic scrolling, USB-C, Bluetooth.",
      thumbnail: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&auto=format&fit=crop&q=80",
      status: "published",
      collection_id: collectionsMap.get("accessories"),
      sales_channels: salesChannelId ? [{ id: salesChannelId }] : undefined,
      options: [{ title: "Color", values: ["Graphite", "Pale Grey"] }],
      variants: [
        {
          title: "Graphite",
          sku: "LOG-MX3S-GRPH",
          options: { Color: "Graphite" },
          prices: [{ amount: 219900, currency_code: "zar" }] // R2,199.00
        },
        {
          title: "Pale Grey",
          sku: "LOG-MX3S-GRY",
          options: { Color: "Pale Grey" },
          prices: [{ amount: 219900, currency_code: "zar" }] // R2,199.00
        }
      ]
    },

    // Storage
    {
      title: "Samsung 990 PRO 2TB NVMe PCIe 4.0 SSD",
      handle: "samsung-990-pro-2tb",
      description: "Read speeds up to 7450 MB/s, Write speeds up to 6900 MB/s, V-NAND technology, PCIe Gen 4 x4, M.2 2280 form factor.",
      thumbnail: "https://images.unsplash.com/photo-1562975079-09dfb32f293d?w=600&auto=format&fit=crop&q=80",
      status: "published",
      collection_id: collectionsMap.get("storage"),
      sales_channels: salesChannelId ? [{ id: salesChannelId }] : undefined,
      options: [{ title: "Heatsink", values: ["Without Heatsink", "With Heatsink"] }],
      variants: [
        {
          title: "Without Heatsink",
          sku: "SAM-990P-2TB",
          options: { Heatsink: "Without Heatsink" },
          prices: [{ amount: 349900, currency_code: "zar" }] // R3,499.00
        },
        {
          title: "With Heatsink",
          sku: "SAM-990P-2TB-HS",
          options: { Heatsink: "With Heatsink" },
          prices: [{ amount: 399900, currency_code: "zar" }] // R3,999.00
        }
      ]
    }
  ]

  // 6. Create Products using the Workflow
  logger.info("Executing createProductsWorkflow for realistic products...")
  try {
    const { result } = await createProductsWorkflow(container).run({
      input: {
        products: productsToCreate as any[]
      }
    })
    logger.info(`✅ Successfully seeded ${result?.length || 0} products!`)
  } catch (error: any) {
    logger.error(`❌ Failed to run createProductsWorkflow: ${error.message || JSON.stringify(error, null, 2)}`)
    if (error.stack) {
      logger.error(error.stack)
    }
  }

  logger.info("seed-products script finished successfully!")
}
