import { createOrRetrieveCustomer } from "@/app/functions/create-or-retrieve-customer";
import { getUserProfile } from "@/app/functions/get-user-profile";
import { isLeft, unwrapEither } from "@/core/either";
import { createStripeCheckoutSession } from "@/stripe/create-stripe-checkout-session";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import type Stripe from "stripe";
import { z } from "zod";
import { authenticateHook } from "../hooks/auth";
import { calculateTrialEndUnixTimestamp } from "../utils/helpers";

export const createCheckoutRoute: FastifyPluginAsyncZod = async (server) => {
  server.post(
    "/stripe/checkout",
    {
      onRequest: [authenticateHook],
      schema: {
        operationId: "createStripeCheckout",
        tags: ["stripe"],
        description: "Create a Stripe checkout session",
        body: z.object({
          price: z.object({
            id: z.string(),
            type: z.enum(["one_time", "recurring"]),
            trial_period_days: z.number().optional(),
          }),
          redirectUrl: z.string(),
          cancelUrl: z.string(),
        }),
        response: {
          201: z.object({
            sessionId: z.string(),
          }),
          400: z.object({ message: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const { price, redirectUrl, cancelUrl } = request.body;
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

      let params: Stripe.Checkout.SessionCreateParams = {
        allow_promotion_codes: true,
        billing_address_collection: "required",
        customer: stripeCustomerId,
        customer_update: {
          address: "auto",
        },
        line_items: [
          {
            price: price.id,
            quantity: 1,
          },
        ],
        cancel_url: `${process.env.WEB_URL}/${cancelUrl.replace(/^\/+/, "")}`,
        success_url: `${process.env.WEB_URL}/${redirectUrl.replace(/^\/+/, "")}?session_id={CHECKOUT_SESSION_ID}`,
        metadata: {
          userId,
        },
      };

      if (price.type === "recurring") {
        params = {
          ...params,
          mode: "subscription",
          subscription_data: {
            trial_end: calculateTrialEndUnixTimestamp(price.trial_period_days),
          },
        };
      } else if (price.type === "one_time") {
        params = {
          ...params,
          mode: "payment",
        };
      }

      let session: Stripe.Checkout.Session;
      try {
        session = await createStripeCheckoutSession(params);
      } catch (err) {
        console.error("Unable to create checkout session.", err);
        throw new Error("Unable to create checkout session.");
      }

      return reply.status(201).send({ sessionId: session.id });
    },
  );
};
