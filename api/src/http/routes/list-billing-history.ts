import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { isRight, unwrapEither } from "@/core/either";
import { authenticateHook } from "../hooks/auth";
import { listBillngHistory } from "@/app/functions/list-billing-history";

export const listBillingHistoryRoute: FastifyPluginAsyncZod = async (
  server,
) => {
  server.get(
    "/stripe/history",
    {
      onRequest: [authenticateHook],
      schema: {
        tags: ["stripe"],
        operationId: "listBillingHistory",
        description: "List all billing history",
        response: {
          200: z.array(
            z.object({
              id: z.string(),
              date: z.string(),
              status: z.string().nullable(),
              price: z.number(),
              downloadUrl: z.string().nullable(),
            }),
          ),
          404: z.object({ message: z.string() }),
          400: z.object({ message: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const userId = request.user.sub;

      const result = await listBillngHistory({ userId });

      if (isRight(result)) {
        const response = unwrapEither(result);
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
            message: "Não foi possível listar seu histórico de compras",
          });
      }
    },
  );
};
