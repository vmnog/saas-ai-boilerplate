import { createOrRetrieveCustomer } from "@/app/functions/create-or-retrieve-customer";
import { getUserProfile } from "@/app/functions/get-user-profile";
import { isLeft, unwrapEither } from "@/core/either";
import { createStripeBillingPortalSession } from "@/stripe/create-stripe-billing-portal-session";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import type Stripe from "stripe";
import { z } from "zod";
import { authenticateHook } from "../hooks/auth";

export const createCustomerPortalRoute: FastifyPluginAsyncZod = async (
  server,
) => {
  server.post(
    "/stripe/portal",
    {
      onRequest: [authenticateHook],
      schema: {
        operationId: "createStripeCustomerPortal",
        tags: ["stripe"],
        description: "Create a Stripe customer portal",
        body: z.object({
          returnUrl: z.string(),
        }),
        response: {
          201: z.object({
            url: z.string(),
          }),
          400: z.object({ message: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const { returnUrl } = request.body;
      const userId = request.user.sub;

      const userResult = await getUserProfile({ userId });

      if (isLeft(userResult)) {
        const error = unwrapEither(userResult);
        return reply.status(400).send({ message: error.message });
      }

      const { email } = unwrapEither(userResult);

      const customerResult = await createOrRetrieveCustomer({
        userId,
        email,
      });

      if (isLeft(customerResult)) {
        const error = unwrapEither(customerResult);
        return reply.status(400).send({ message: error.message });
      }

      const { stripeCustomerId } = unwrapEither(customerResult);

      const params: Stripe.BillingPortal.SessionCreateParams = {
        customer: stripeCustomerId,
        return_url: returnUrl,
      };

      let billingPortalUrl: Stripe.BillingPortal.Session["url"];
      try {
        billingPortalUrl = await createStripeBillingPortalSession(params);
      } catch (err) {
        console.error(err);
        throw new Error("Unable to create billing portal session.");
      }

      return reply.status(201).send({ url: billingPortalUrl });
    },
  );
};
