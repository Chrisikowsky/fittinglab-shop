import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { registerCustomerWorkflow } from "../../../../../workflows/register-customer";
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  first_name: z.string().min(1),
  last_name: z.string().min(1),
})

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
) {
  try {
    const input = schema.parse(req.body);

    const { result } = await registerCustomerWorkflow(req.scope).run({
      input: {
        email: input.email,
        password: input.password,
        first_name: input.first_name,
        last_name: input.last_name,
      },
    });

    res.status(200).json({
      message: "Successfully registered",
      customer: result.customer,
    });
  } catch (error) {
    res.status(400).json({
      message: "Registration failed",
      error: error.message,
    });
  }
}
