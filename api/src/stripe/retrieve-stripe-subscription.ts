import { stripe } from "./config";

export async function retrieveStripeSubscription(subscriptionStripeId: string) {
    const stripeSubscription = await stripe.subscriptions.retrieve(subscriptionStripeId, {
        expand: ['default_payment_method']
    });

    return stripeSubscription
}
