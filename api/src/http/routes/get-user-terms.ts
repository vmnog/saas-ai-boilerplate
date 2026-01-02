import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { isRight, unwrapEither } from "@/core/either";
import { authenticateHook } from "../hooks/auth";
import { getUserTerms } from "@/app/functions/get-user-terms";

export const getUserTermsRoute: FastifyPluginAsyncZod = async (server) => {
  server.get(
    "/terms",
    {
      onRequest: [authenticateHook],
      schema: {
        operationId: "getUserTerms",
        tags: ["terms"],
        description: "Get user terms",
        response: {
          201: z.object({
            hasAccepted: z.boolean().nullable(),
          }),
          409: z.object({ message: z.string() }),
          404: z.object({ message: z.string() }),
          400: z.object({ message: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const userId = request.user.sub;
      const result = await getUserTerms({ userId });

      if (isRight(result)) {
        return reply.status(201).send(unwrapEither(result));
      }

      const error = unwrapEither(result);

      switch (error.constructor.name) {
        case "ResourceNotFound":
          return reply.status(404).send({ message: error.message });
        default:
          return reply.status(400).send({ message: error.message });
      }
    },
  );
};
