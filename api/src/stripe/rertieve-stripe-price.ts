import { stripe } from "./config";

export async function retrieveStripePrice(priceId: string) {
    const stripePrice = await stripe.prices.retrieve(priceId);
    return stripePrice
}