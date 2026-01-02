import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";

import { sendAuthenticationLink } from "@/app/functions/send-authentication-link";
import { isRight, unwrapEither } from "@/core/either";

export const sendAuthenticationLinkRoute: FastifyPluginAsyncZod = async (
  server,
) => {
  server.post(
    "/authenticate/email",
    {
      schema: {
        tags: ["auth"],
        operationId: "sendAuthenticationLink",
        description: "Send authentication link",
        body: z.object({
          email: z.string().email(),
        }),
        response: {
          201: z.null().describe("No content"),
          400: z.object({ message: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const { email } = request.body;

      const safeEmail = email.trim().toLowerCase();
      const result = await sendAuthenticationLink({
        email: safeEmail,
      });

      if (isRight(result)) {
        return reply.status(201).send();
      }

      const error = unwrapEither(result);

      switch (error.constructor.name) {
        default:
          return reply.status(400).send({ message: error.message });
      }
    },
  );
};
