import type Stripe from "stripe";
import { stripe } from "./config";

export async function createStripeBillingPortalSession({
  customer,
  return_url,
}: Stripe.BillingPortal.SessionCreateParams) {
  const { url } = await stripe.billingPortal.sessions.create({
    customer,
    return_url: `${process.env.WEB_URL}${return_url}`,
  });
  if (!url) {
    throw new Error("Could not create billing portal");
  }
  return url;
}
