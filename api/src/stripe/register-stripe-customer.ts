import { stripe } from "./config";

export const registerStripeCustomer = async (userId: string, email: string) => {
  const customerData = { metadata: { userId }, email: email };

  const newCustomer = await stripe.customers.create({
    ...customerData,
    preferred_locales: ["pt-BR"],
  });
  if (!newCustomer) throw new Error("Stripe customer creation failed.");

  return newCustomer.id;
};
