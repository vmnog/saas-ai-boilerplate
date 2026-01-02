import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";

import { getUserSubscription } from "@/app/functions/get-user-subscription";
import { isRight, unwrapEither } from "@/core/either";
import { authenticateHook } from "../hooks/auth";

export const getUserSubscriptionRoute: FastifyPluginAsyncZod = async (
  server,
) => {
  server.get(
    "/users/me/subscription",
    {
      onRequest: [authenticateHook],
      schema: {
        tags: ["users"],
        operationId: "getUserSubscriptionRoute",
        description: "Get user subscription",
        response: {
          200: z.object({
            id: z.string(),
            startsAt: z.date().nullable(),
            endsAt: z.date().nullable(),
            status: z.string().nullable(),
            cancelAtPeriodEnd: z.boolean().nullable(),
            cancelAt: z.date().nullable(),
            canceledAt: z.date().nullable(),
            currentPeriodStart: z.date().nullable(),
            currentPeriodEnd: z.date().nullable(),
            product: z.object({
              id: z.string(),
              name: z.string(),
              monthlyPrice: z.number().nullable(),
              metadata: z
                .object({
                  sendMessageLimit: z.number(),
                  benefits: z.string(),
                })
                .nullable(),
            }),
          }),
          400: z.object({ message: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const userId = request.user.sub;

      const result = await getUserSubscription({ userId });

      if (isRight(result)) {
        return unwrapEither(result);
      }

      const error = unwrapEither(result);

      switch (error.constructor.name) {
        default:
          return reply.status(400).send({ message: error.message });
      }
    },
  );
};
