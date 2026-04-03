import { Module } from "@medusajs/framework/utils"
import DealerApplicationModuleService from "./service"

export const DEALER_APPLICATION_MODULE = "dealerApplicationModuleService"

export default Module(DEALER_APPLICATION_MODULE, {
  service: DealerApplicationModuleService,
})
