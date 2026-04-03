import { model } from "@medusajs/framework/utils"

const DealerApplication = model.define("dealer_application", {
  id: model.id().primaryKey(),
  company_name: model.text(),
  contact_name: model.text(),
  email: model.text(),
  phone: model.text(),
  registration_number: model.text().nullable(),
  vat_number: model.text().nullable(),
  document_path: model.text().nullable(),
  status: model.enum(["pending", "approved", "rejected"]).default("pending"),
  notes: model.text().nullable(),
  metadata: model.json().nullable(),
})

export default DealerApplication
