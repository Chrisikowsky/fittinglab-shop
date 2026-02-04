import Medusa from "@medusajs/medusa-js";

// Initialize the Medusa client
// Uses localhost:9000 as default if NEXT_PUBLIC_MEDUSA_BACKEND_URL is not set
export const medusa = new Medusa({
    baseUrl: process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000",
    maxRetries: 3,
});
