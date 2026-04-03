import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { DEALER_APPLICATION_MODULE } from "../../../modules/dealer-application"
import DealerApplicationModuleService from "../../../modules/dealer-application/service"
import * as fs from "fs"
import * as path from "path"

/**
 * POST /store/dealer-application
 * Submit a dealer/distributor application with optional document upload
 */
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const dealerService: DealerApplicationModuleService = req.scope.resolve(
    DEALER_APPLICATION_MODULE
  )

  const {
    company_name,
    contact_name,
    email,
    phone,
    registration_number,
    vat_number,
    notes,
  } = req.body as Record<string, string>

  // Handle file upload (base64 encoded document)
  let document_path: string | null = null
  const { document_base64, document_filename } = req.body as Record<
    string,
    string
  >

  if (document_base64 && document_filename) {
    const uploadsDir = path.join(process.cwd(), "uploads", "dealer-docs")

    // Ensure the uploads directory exists
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true })
    }

    const safeFilename = `${Date.now()}-${document_filename.replace(
      /[^a-zA-Z0-9._-]/g,
      "_"
    )}`
    const filePath = path.join(uploadsDir, safeFilename)

    // Write base64 document to non-public folder
    const buffer = Buffer.from(document_base64, "base64")
    fs.writeFileSync(filePath, buffer)

    document_path = `uploads/dealer-docs/${safeFilename}`
  }

  try {
    const application = await dealerService.createDealerApplications({
      company_name,
      contact_name,
      email,
      phone,
      registration_number: registration_number || null,
      vat_number: vat_number || null,
      document_path,
      status: "pending",
      notes: notes || null,
    })

    res.status(201).json({
      dealer_application: application,
      message:
        "Your dealer application has been submitted successfully. We will review it shortly.",
    })
  } catch (error) {
    res.status(400).json({
      message: "Failed to submit dealer application",
      error: (error as Error).message,
    })
  }
}

/**
 * GET /store/dealer-application
 * Check application status (requires email query param)
 */
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const dealerService: DealerApplicationModuleService = req.scope.resolve(
    DEALER_APPLICATION_MODULE
  )

  const email = req.query.email as string
  if (!email) {
    return res.status(400).json({ message: "Email query parameter is required" })
  }

  try {
    const applications = await dealerService.listDealerApplications({
      email,
    })

    res.json({ dealer_applications: applications })
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch dealer applications",
      error: (error as Error).message,
    })
  }
}
