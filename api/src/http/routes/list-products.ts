import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";

import type { ListProductsOutput } from "@/app/functions/list-products";
import { listProducts } from "@/app/functions/list-products";
import { isRight, unwrapEither } from "@/core/either";
import { authenticateHook } from "../hooks/auth";

export const listProductsRoute: FastifyPluginAsyncZod = async (server) => {
  server.get(
    "/products",
    {
      onRequest: [authenticateHook],
      schema: {
        tags: ["products"],
        operationId: "listProducts",
        description: "List all products",
        response: {
          200: z.array(
            z.object({
              id: z.string(),
              name: z.string(),
              description: z.string().nullable(),
              image: z.string().nullable(),
              active: z.boolean(),
              metadata: z
                .object({
                  sendMessageLimit: z.number(),
                  benefits: z.string(),
                  shouldHighlight: z.boolean(),
                  off: z.number(),
                })
                .nullable(),
              price: z
                .object({
                  id: z.string(),
                  stripePriceId: z.string(),
                  type: z.string(),
                  trialPeriodDays: z.number().nullable(),
                  unitAmount: z.number().nullable(),
                  interval: z.string().nullable(),
                  intervalCount: z.number().nullable(),
                })
                .optional(),
            }),
          ),
          404: z.object({ message: z.string() }),
          400: z.object({ message: z.string() }),
        },
      },
    },
    async (_request, reply) => {
      const result = await listProducts();

      if (isRight(result)) {
        const response = unwrapEither(result) as ListProductsOutput;
        return reply.status(200).send(response);
      }

      const error = unwrapEither(result);

      switch (error.constructor.name) {
        case "ResourceNotFound":
          return reply.status(404).send({
            message: error.message,
          });
        default:
          return reply.status(400).send({
            message: "Não foi possível listar os produtos",
          });
      }
    },
  );
};
