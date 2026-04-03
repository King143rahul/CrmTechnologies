/**
 * Seed Script: Dealer Pricing Logic
 * Creates "Distributor" customer group and wholesale price list
 *
 * Run: npx medusa exec src/scripts/seed-dealer-pricing.ts
 */
import { ExecArgs } from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  Modules,
} from "@medusajs/framework/utils"

export default async function seedDealerPricing({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const customerService = container.resolve(Modules.CUSTOMER)
  const pricingService = container.resolve(Modules.PRICING)

  logger.info("🏪 Seeding dealer pricing logic...")

  // 1. Create "Distributor" customer group
  logger.info("Creating 'Distributor' customer group...")
  let distributorGroup
  try {
    const existingGroups = await customerService.listCustomerGroups({
      name: "Distributor",
    })

    if (existingGroups.length > 0) {
      distributorGroup = existingGroups[0]
      logger.info(`  ✅ 'Distributor' group already exists (ID: ${distributorGroup.id})`)
    } else {
      distributorGroup = await customerService.createCustomerGroups({
        name: "Distributor",
        metadata: {
          description:
            "Verified distributors/dealers who receive wholesale pricing",
          discount_tier: "wholesale",
        },
      })
      logger.info(
        `  ✅ Created 'Distributor' group (ID: ${distributorGroup.id})`
      )
    }
  } catch (error) {
    logger.error(`  ❌ Failed to create customer group: ${error}`)
    return
  }

  // 2. Create "Retail" customer group
  logger.info("Creating 'Retail' customer group...")
  try {
    const existingRetail = await customerService.listCustomerGroups({
      name: "Retail",
    })

    if (existingRetail.length > 0) {
      logger.info(`  ✅ 'Retail' group already exists (ID: ${existingRetail[0].id})`)
    } else {
      const retailGroup = await customerService.createCustomerGroups({
        name: "Retail",
        metadata: {
          description: "Standard retail customers — default pricing applies",
        },
      })
      logger.info(`  ✅ Created 'Retail' group (ID: ${retailGroup.id})`)
    }
  } catch (error) {
    logger.error(`  ❌ Failed to create Retail group: ${error}`)
  }

  // 3. Create Wholesale Price List
  logger.info("Creating 'Wholesale' price list...")
  try {
    const allPriceLists = await pricingService.listPriceLists()
    const existingPriceLists = allPriceLists.filter(
      (pl: { title?: string }) => pl.title === "Wholesale Distributor Pricing"
    )

    if (existingPriceLists.length > 0) {
      logger.info(
        `  ✅ Wholesale price list already exists (ID: ${existingPriceLists[0].id})`
      )
    } else {
      const createdPriceLists = await pricingService.createPriceLists([
        {
          title: "Wholesale Distributor Pricing",
          description:
            "Discounted pricing for verified distributors in the Distributor customer group",
          type: "override",
          status: "active",
          rules: {
            customer_group_id: [distributorGroup.id],
          },
        },
      ])
      const wholesalePriceList = createdPriceLists[0]
      logger.info(
        `  ✅ Created wholesale price list (ID: ${wholesalePriceList.id})`
      )
    }
  } catch (error) {
    logger.error(`  ❌ Failed to create price list: ${error}`)
  }

  logger.info("")
  logger.info("✅ Dealer pricing logic seeded successfully!")
  logger.info("")
  logger.info("📋 Next steps:")
  logger.info("  1. Add products via Medusa Admin (http://localhost:9000/app)")
  logger.info(
    "  2. Add wholesale prices to the 'Wholesale Distributor Pricing' price list"
  )
  logger.info(
    "  3. Assign distributor customers to the 'Distributor' customer group"
  )
  logger.info("")
}
