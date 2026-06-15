import { ExecArgs } from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  Modules,
} from "@medusajs/framework/utils"

export default async function linkProducts({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const productModuleService = container.resolve(Modules.PRODUCT)
  const salesChannelModuleService = container.resolve(Modules.SALES_CHANNEL)
  const link = container.resolve(ContainerRegistrationKeys.LINK)

  logger.info("Linking products to Default Sales Channel...")

  // 1. Get default sales channel
  const [defaultSalesChannel] = await salesChannelModuleService.listSalesChannels({
    name: "Default Sales Channel"
  })

  if (!defaultSalesChannel) {
    logger.error("❌ Default Sales Channel not found!")
    return
  }

  const salesChannelId = defaultSalesChannel.id
  logger.info(`Using Sales Channel: ${defaultSalesChannel.name} (${salesChannelId})`)

  // 2. Get all products using the Query system
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const { data: products } = await query.graph({
    entity: "product",
    fields: ["id", "title"],
  })
  logger.info(`Found ${products.length} products to link.`)

  // 3. Create links
  let linkedCount = 0
  for (const product of products) {
    try {
      await link.create({
        [Modules.PRODUCT]: {
          product_id: product.id,
        },
        [Modules.SALES_CHANNEL]: {
          sales_channel_id: salesChannelId,
        },
      })
      logger.info(`  ✅ Linked product: ${product.title} (${product.id})`)
      linkedCount++
    } catch (error) {
      logger.error(`  ❌ Failed to link product ${product.title}: ${error}`)
    }
  }

  logger.info(`Done! Linked ${linkedCount} products to Default Sales Channel.`)
}
