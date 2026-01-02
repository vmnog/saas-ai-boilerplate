import { stripe } from "./config";

export async function listStripeCustomersByEmail(email: string) {
    return await stripe.customers.list({ email })
}
