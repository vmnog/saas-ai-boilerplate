import { stripe } from "./config";

export async function retrieveStripeProduct(productId: string) {
    const stripeProduct = await stripe.products.retrieve(productId);
    return stripeProduct
}