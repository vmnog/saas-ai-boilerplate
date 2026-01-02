import { stripe } from "./config";

export async function retrieveStripeCheckoutSession(sessionId: string) {
    const stripeCheckoutSession = await stripe.checkout.sessions.retrieve(sessionId, {
        expand: ['line_items']
    });

    return stripeCheckoutSession
}
