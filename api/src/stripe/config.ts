import Stripe from 'stripe';

const stripeSecretKey = process.env.NODE_ENV === 'production' ? process.env.STRIPE_SECRET_KEY_LIVE : process.env.STRIPE_SECRET_KEY

if (!stripeSecretKey) {
    throw new Error('Stripe secret key is not set');
}

export const stripe = new Stripe(
    stripeSecretKey,
);
