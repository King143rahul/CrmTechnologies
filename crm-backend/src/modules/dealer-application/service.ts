import { MedusaService } from "@medusajs/framework/utils"
import DealerApplication from "./models/dealer-application"

class DealerApplicationModuleService extends MedusaService({
  DealerApplication,
}) {}

export default DealerApplicationModuleService
