import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { isRight, unwrapEither } from "@/core/either";
import { authenticateHook } from "../hooks/auth";
import { registerFeedback } from "@/app/functions/register-feedback";

export const registerFeedbackRoute: FastifyPluginAsyncZod = async (server) => {
  server.post(
    "/feedback",
    {
      onRequest: [authenticateHook],
      schema: {
        operationId: "registerFeedback",
        tags: ["feedback"],
        description: "Register a new feedback",
        body: z.object({
          content: z.string(),
          rating: z.string(),
        }),
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
      const { content, rating } = request.body;

      const result = await registerFeedback({ content, rating, userId });

      if (isRight(result)) {
        return reply.status(201).send();
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
