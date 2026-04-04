import { loadEnv, defineConfig, Modules } from '@medusajs/framework/utils'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

const cookieSecure = process.env.COOKIE_SECURE === "true"
const cookieSameSite = (process.env.COOKIE_SAME_SITE as "lax" | "strict" | "none" | undefined) ??
  (cookieSecure ? "none" : "lax")

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    databaseDriverOptions: {
      connection: {
        ssl: false, // CRITICAL: Forces local non-SSL for Docker
      },
    },
    redisUrl: process.env.REDIS_URL,
    cookieOptions: {
      secure: cookieSecure,
      sameSite: cookieSameSite,
    },
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    },
  },
  modules: [
    // Dealer Application custom module
    {
      resolve: "./src/modules/dealer-application",
    },
    // Paystack Payment Provider
    // Uncomment when PAYSTACK_SECRET_KEY is configured:
    // {
    //   resolve: "@medusajs/medusa/payment",
    //   options: {
    //     providers: [
    //       {
    //         resolve: "medusa-payment-paystack",
    //         id: "paystack",
    //         options: {
    //           secret_key: process.env.PAYSTACK_SECRET_KEY,
    //         },
    //       },
    //     ],
    //   },
    // },
  ],
})
