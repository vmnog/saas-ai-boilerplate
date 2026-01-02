import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";

import { registerUser } from "@/app/functions/register-user";
import { isRight, unwrapEither } from "@/core/either";
import { registerStripeCustomer } from "@/stripe/register-stripe-customer";

export const registerUserRoute: FastifyPluginAsyncZod = async (server) => {
  server.post(
    "/users",
    {
      schema: {
        operationId: "registerUser",
        tags: ["users"],
        description: "Register a new user",
        body: z.object({
          name: z.string(),
          email: z.string().email(),
        }),
        response: {
          201: z.object({
            user: z.object({
              id: z.string(),
              name: z.string(),
              email: z.string().email(),
              avatarUrl: z.string().nullable(),
            }),
          }),
          409: z.object({ message: z.string() }),
          404: z.object({ message: z.string() }),
          400: z.object({ message: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const { name, email } = request.body;

      const safeEmail = email.trim().toLowerCase();
      const result = await registerUser({ name, email: safeEmail });

      if (isRight(result)) {
        const { user } = unwrapEither(result);
        await registerStripeCustomer(user.id, user.email);
        return reply.status(201).send(unwrapEither(result));
      }

      const error = unwrapEither(result);

      switch (error.constructor.name) {
        case "UserAlreadyExists":
          return reply.status(409).send({ message: error.message });
        case "ResourceNotFound":
          return reply.status(404).send({ message: error.message });
        default:
          return reply.status(400).send({ message: error.message });
      }
    },
  );
};
