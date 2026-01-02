import { type Stripe, loadStripe } from "@stripe/stripe-js";

let stripePromise: Promise<Stripe | null>;

export const getStripe = () => {
  if (!stripePromise) {
    console.log({
      NEXT_PUBLIC_VERCEL_ENV: process.env.NEXT_PUBLIC_VERCEL_ENV,
      NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_LIVE:
        process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_LIVE,
      NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:
        process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    });
    const stripeKey =
      process.env.NEXT_PUBLIC_VERCEL_ENV === "production"
        ? process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_LIVE
        : process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    console.log({ stripeKey });

    if (!stripeKey) {
      throw new Error("Stripe key not found");
    }

    stripePromise = loadStripe(stripeKey);
  }

  return stripePromise;
};
