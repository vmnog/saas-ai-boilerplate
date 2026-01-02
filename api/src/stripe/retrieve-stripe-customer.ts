import { stripe } from "./config";

export async function retrieveStripeCustomer(stripeCustomerId: string) {
    const customer = await stripe.customers.retrieve(stripeCustomerId);
    if ('deleted' in customer) {
        throw new Error('Customer not found or deleted');
    }
    return customer;
}
