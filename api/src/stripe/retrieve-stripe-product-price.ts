import { stripe } from "./config";

export async function retrieveStripeProductPrice(productId: string) {
    const stripeProduct = await stripe.products.retrieve(productId);
    const stripePrice = await stripe.prices.retrieve(stripeProduct?.default_price as string);
    return stripePrice
}