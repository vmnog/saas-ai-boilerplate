import { stripe } from "./config";

export async function retrieveStripeBillingHistory(customerId: string) {
  const invoices = await stripe.invoices.list({
    customer: customerId,
  });
  return invoices;
}

