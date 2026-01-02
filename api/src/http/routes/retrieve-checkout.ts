import { retrieveStripePrice } from "@/stripe/rertieve-stripe-price";
import { retrieveStripeCheckoutSession } from "@/stripe/retrieve-stripe-checkout-session";
import { retrieveStripeProduct } from "@/stripe/retrieve-stripe-product";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { authenticateHook } from "../hooks/auth";

export const retrieveCheckoutRoute: FastifyPluginAsyncZod = async (server) => {
  server.get(
    "/stripe/checkout/:sessionId",
    {
      onRequest: [authenticateHook],
      schema: {
        operationId: "retrieveStripeCheckout",
        tags: ["stripe"],
        description: "Retrieve a Stripe checkout session",
        params: z.object({
          sessionId: z.string(),
        }),
        response: {
          200: z.object({
            id: z.string(),
            description: z.string(),
            name: z.string(),
            benefits: z.string(),
            image_url: z.string(),
          }),
          400: z.object({ message: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const { sessionId } = request.params;

      try {
        const retrievedSession = await retrieveStripeCheckoutSession(sessionId);
        if (!retrievedSession.line_items?.data[0]?.price?.id) {
          return reply.status(400).send({
            message: "Unable to retrieve price from checkout session.",
          });
        }
        const retrievedPrice = await retrieveStripePrice(
          retrievedSession.line_items.data[0].price.id,
        );
        if (
          !retrievedPrice.product ||
          typeof retrievedPrice.product !== "string"
        ) {
          return reply
            .status(400)
            .send({ message: "Unable to retrieve product from price." });
        }

        const retrievedProduct = await retrieveStripeProduct(
          retrievedPrice.product as string,
        );

        return reply.status(200).send({
          id: retrievedProduct.id,
          description: retrievedProduct.description ?? "",
          name: retrievedProduct.name,
          benefits: retrievedProduct.metadata.benefits ?? "",
          image_url: retrievedProduct.images[0] ?? "",
        });
      } catch (err) {
        return reply
          .status(400)
          .send({ message: "Unable to retrieve checkout session." });
      }
    },
  );
};
