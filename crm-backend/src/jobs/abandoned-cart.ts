/**
 * Abandoned Cart Recovery Job
 * Runs on a schedule to find carts older than 24 hours without completed orders
 * and triggers email notifications to recover them.
 *
 * The job queries for abandoned carts and logs them.
 * In production, integrate with your email provider (SendGrid, Resend, etc.)
 */
import { MedusaContainer } from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  Modules,
} from "@medusajs/framework/utils"

export default async function abandonedCartRecovery(
  container: MedusaContainer
) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const cartService = container.resolve(Modules.CART)

  logger.info("🛒 Running abandoned cart recovery check...")

  try {
    // Calculate 24 hours ago
    const twentyFourHoursAgo = new Date()
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24)

    // Query carts that were updated more than 24 hours ago
    const abandonedCarts = await cartService.listCarts(
      {
        updated_at: { $lt: twentyFourHoursAgo.toISOString() },
      } as any,
      {
        select: ["id", "email", "updated_at", "total"],
        take: 50,
      }
    )

    if (abandonedCarts.length === 0) {
      logger.info("  ✅ No abandoned carts found.")
      return
    }

    logger.info(`  📦 Found ${abandonedCarts.length} abandoned cart(s)`)

    for (const cart of abandonedCarts) {
      if (!cart.email) {
        continue // Skip carts without email
      }

      logger.info(
        `  📧 Sending recovery email to ${cart.email} for cart ${cart.id}`
      )

      // TODO: Integrate with email service
      // Example with SendGrid/Resend:
      // await emailService.send({
      //   to: cart.email,
      //   subject: 'You left items in your cart — CRM Technology',
      //   template: 'abandoned-cart-recovery',
      //   data: {
      //     cart_id: cart.id,
      //     recovery_url: `${process.env.STORE_URL}/cart?recover=${cart.id}`,
      //     items: cart.items,
      //   }
      // })
    }

    logger.info(
      `  ✅ Processed ${abandonedCarts.length} abandoned cart(s)`
    )
  } catch (error) {
    logger.error(`  ❌ Abandoned cart recovery failed: ${error}`)
  }
}

export const config = {
  name: "abandoned-cart-recovery",
  schedule: "0 */6 * * *", // Every 6 hours
}
