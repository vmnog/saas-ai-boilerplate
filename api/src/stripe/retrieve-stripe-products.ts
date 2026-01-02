import { stripe } from "./config";

export async function retrieveStripeProducts() {
    const stripeProducts = await stripe.products.list({
        active: true,
    });
    return stripeProducts
}
