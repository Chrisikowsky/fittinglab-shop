import { defineLink } from "@medusajs/framework/utils"
import AuthModule from "@medusajs/medusa/auth"
import CustomerModule from "@medusajs/medusa/customer"

export default defineLink(
    CustomerModule.linkable.customer,
    AuthModule.linkable.authIdentity
)
