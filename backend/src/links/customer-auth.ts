import { defineLink } from "@medusajs/framework/utils"
import AuthModule from "@medusajs/medusa/auth"
import CustomerModule from "@medusajs/medusa/customer"

// Define link between Customer and Auth Identity
// This is required for the registration workflow to link the two entities
export default defineLink(
    { linkable: "customer", serviceName: "customer", primaryKey: "id" },
    { linkable: "auth_identity", serviceName: "auth", primaryKey: "id" }
)
