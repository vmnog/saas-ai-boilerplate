import Stripe from "stripe"

export async function createStripeCheckoutSession(params: Stripe.Checkout.SessionCreateParams) {
    if (!process.env.STRIPE_SECRET_KEY) {
        throw new Error('STRIPE_SECRET_KEY is not set')
    }
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
    return await stripe.checkout.sessions.create(params)
}