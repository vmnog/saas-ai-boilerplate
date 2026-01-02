import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";

import { listThreadMessages } from "@/app/functions/list-thread-messages";
import { isRight, unwrapEither } from "@/core/either";
import { listThreadRuns } from "@/openai/list-thread-runs";
import { authenticateHook } from "../hooks/auth";

export const listThreadMessagesRoute: FastifyPluginAsyncZod = async (
  server,
) => {
  server.get(
    "/threads/:openaiThreadId/messages",
    {
      onRequest: [authenticateHook],
      schema: {
        tags: ["threads"],
        operationId: "getThreadMessages",
        description: "Get thread messages",
        params: z.object({
          openaiThreadId: z.string(),
        }),
        response: {
          200: z.array(
            z.object({
              id: z.string(),
              text: z.string(),
              role: z.enum(["user", "assistant"]),
              createdAt: z.date(),
              openaiThreadId: z.string(),
              attachments: z.array(
                z.object({
                  id: z.string(),
                  filename: z.string(),
                  mimetype: z.string(),
                  createdAt: z.date(),
                }),
              ),
            }),
          ),
          400: z.object({ message: z.string() }),
          403: z.object({ message: z.string() }),
          404: z.object({ message: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const userId = request.user.sub;
      const { openaiThreadId } = request.params;

      //  FIX: this should not run in first message of a thread
      // try {
      //
      //   // Search for thread runs
      //   const activeRuns = await listThreadRuns({ threadId: openaiThreadId })
      //
      //   if (activeRuns.runs.length === 0) {
      //     console.log('No runs found for this thread', openaiThreadId)
      //   }
      //
      //   // Print only last run
      //   const lastRun = activeRuns.runs[0]
      //   console.log({
      //     id: lastRun.id,
      //     threadId: lastRun.thread_id,
      //     status: lastRun.status,
      //     createdAt: new Date(lastRun.created_at * 1000).toLocaleString('pt-BR'),
      //     cancelledAt: lastRun.cancelled_at ? new Date(lastRun.cancelled_at * 1000).toLocaleString('pt-BR') : null,
      //     completedAt: lastRun.completed_at ? new Date(lastRun.completed_at * 1000).toLocaleString('pt-BR') : null,
      //     failedAt: lastRun.failed_at ? new Date(lastRun.failed_at * 1000).toLocaleString('pt-BR') : null,
      //     expiresAt: lastRun.expires_at ? new Date(lastRun.expires_at * 1000).toLocaleString('pt-BR') : null,
      //     details: lastRun.incomplete_details,
      //     requiredAction: lastRun.required_action,
      //     lastError: lastRun.last_error,
      //   })
      // } catch (error) {
      //   console.error('Error listing thread messages:', error)
      // }

      console.log("listThreadMessages");

      const result = await listThreadMessages({ openaiThreadId, userId });

      if (isRight(result)) {
        return unwrapEither(result);
      }

      const error = unwrapEither(result);

      switch (error.constructor.name) {
        case "NotAuthorized":
          return reply.status(403).send({
            message: "Este usuário não tem permissão para acessar esta thread",
          });
        case "ResourceNotFound":
          return reply.status(404).send({ message: "Usuário não encontrado" });
        default:
          return reply
            .status(400)
            .send({ message: "Não foi possível obter as mensagens" });
      }
    },
  );
};
