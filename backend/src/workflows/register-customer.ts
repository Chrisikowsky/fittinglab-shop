import {
    createStep,
    createWorkflow,
    WorkflowResponse,
    StepResponse
} from "@medusajs/framework/workflows-sdk"
import { Modules, ContainerRegistrationKeys } from "@medusajs/framework/utils"

type RegisterCustomerInput = {
    email: string
    password: string
    first_name: string
    last_name: string
}

export const createAuthIdentityStep = createStep(
    "create-auth-identity",
    async (input: RegisterCustomerInput, { container }) => {
        const authModuleService = container.resolve(Modules.AUTH)

        try {
            const authIdentity = await authModuleService.createAuthIdentities([{
                provider_identities: [{
                    provider: "emailpass",
                    entity_id: input.email,
                    user_metadata: {
                        password: input.password
                    }
                }]
            }])

            return new StepResponse(authIdentity[0], authIdentity[0].id)
        } catch (error) {
            throw error
        }
    },
    async (authIdentityId, { container }) => {
        if (!authIdentityId) return
        const authModuleService = container.resolve(Modules.AUTH)
        await authModuleService.deleteAuthIdentities([authIdentityId])
    }
)

export const createCustomerStep = createStep(
    "create-customer",
    async (input: RegisterCustomerInput, { container }) => {
        const customerModuleService = container.resolve(Modules.CUSTOMER)

        const customer = await customerModuleService.createCustomers({
            email: input.email,
            first_name: input.first_name,
            last_name: input.last_name,
        })

        return new StepResponse(customer, customer.id)
    },
    async (customerId, { container }) => {
        if (!customerId) return
        const customerModuleService = container.resolve(Modules.CUSTOMER)
        await customerModuleService.deleteCustomers([customerId])
    }
)

export const linkCustomerToAuthStep = createStep(
    "link-customer-to-auth",
    async ({ customerId, authIdentityId }: { customerId: string, authIdentityId: string }, { container }) => {
        const remoteLink = container.resolve(ContainerRegistrationKeys.REMOTE_LINK)

        await remoteLink.create({
            [Modules.AUTH]: {
                auth_identity_id: authIdentityId
            },
            [Modules.CUSTOMER]: {
                customer_id: customerId
            }
        })

        return new StepResponse(void 0, { customerId, authIdentityId })
    },
    // No compensation needed for linking usually, or we can dismiss logic
    async (input, { container }) => {
        // implementation to dismiss link if needed
        if (!input) return
        const { customerId, authIdentityId } = input

        const remoteLink = container.resolve(ContainerRegistrationKeys.REMOTE_LINK)
        await remoteLink.dismiss({
            [Modules.AUTH]: {
                auth_identity_id: authIdentityId
            },
            [Modules.CUSTOMER]: {
                customer_id: customerId
            }
        })
    }
)

export const registerCustomerWorkflow = createWorkflow(
    "register-customer",
    (input: RegisterCustomerInput) => {
        const authIdentity = createAuthIdentityStep(input)
        const customer = createCustomerStep(input)

        linkCustomerToAuthStep({
            customerId: customer.id,
            authIdentityId: authIdentity.id
        })

        return new WorkflowResponse({
            customer,
            authIdentity
        })
    }
)
