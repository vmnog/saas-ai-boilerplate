import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { isRight, unwrapEither } from "@/core/either";
import { authenticateHook } from "../hooks/auth";
import { acceptTerms } from "@/app/functions/accept-terms";

export const acceptTermsRoute: FastifyPluginAsyncZod = async (server) => {
  server.post(
    "/terms",
    {
      onRequest: [authenticateHook],
      schema: {
        operationId: "acceptTerms",
        tags: ["terms"],
        description: "Accept terms",
        response: {
          201: z.void(),
          409: z.object({ message: z.string() }),
          404: z.object({ message: z.string() }),
          400: z.object({ message: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const userId = request.user.sub;

      const result = await acceptTerms({ userId });

      if (isRight(result)) {
        return reply.status(201).send();
      }

      const error = unwrapEither(result);

      switch (error.constructor.name) {
        case "ResourceNotFound":
          return reply.status(404).send({ message: error.message });
        case "NotAuthorized":
          return reply.status(404).send({ message: error.message });
        default:
          return reply.status(400).send({ message: error.message });
      }
    },
  );
};
