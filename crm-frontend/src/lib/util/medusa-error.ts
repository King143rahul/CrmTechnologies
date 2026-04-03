export default function medusaError(error: any): never {
  console.log("Medusa Error intercepted:", error?.message || error)
  return null as never
}
