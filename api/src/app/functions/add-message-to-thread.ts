import {
  type Either,
  isLeft,
  makeLeft,
  makeRight,
  unwrapEither,
} from "@/core/either";
import { db } from "@/db";
import { schema } from "@/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { NotAuthorized } from "../errors/not-authorized";
import { ResourceNotFound } from "../errors/resource-not-found";
import { createAttachments } from "./create-attachments";

const addMessageToThreadInput = z.object({
  openaiThreadId: z.string(),
  openaiMessageId: z.string(),
  role: z.enum(["user", "assistant"]),
  text: z.string(),
  attachments: z
    .array(
      z.object({
        id: z.string(),
        fileId: z.string(),
      }),
    )
    .optional(),
  userId: z.string(),
  usage: z
    .object({
      prompt_tokens: z.number(),
      completion_tokens: z.number(),
      total_tokens: z.number(),
    })
    .nullable(),
});

const addMessageToThreadOutput = z.object({
  openaiThreadId: z.string().nullable(),
  openaiMessageId: z.string(),
  role: z.enum(["user", "assistant"]),
  text: z.string(),
  id: z.string(),
  createdAt: z.date(),
  attachments: z.array(
    z.object({
      id: z.string(),
      createdAt: z.date(),
      uploadId: z.string().nullable(),
      messageId: z.string().nullable(),
    }),
  ),
  usage: z
    .object({
      prompt_tokens: z.number(),
      completion_tokens: z.number(),
      total_tokens: z.number(),
    })
    .nullable(),
});

type AddMessageToThreadInput = z.infer<typeof addMessageToThreadInput>;
type AddMessageToThreadOutput = z.infer<typeof addMessageToThreadOutput>;

export async function addMessageToThread(
  input: AddMessageToThreadInput,
): Promise<Either<ResourceNotFound | NotAuthorized, AddMessageToThreadOutput>> {
  const {
    openaiThreadId,
    openaiMessageId,
    role,
    text,
    attachments,
    userId,
    usage,
  } = addMessageToThreadInput.parse(input);

  const thread = await db
    .select({
      id: schema.threads.id,
      userId: schema.threads.userId,
      archivedAt: schema.threads.archivedAt,
      deletedAt: schema.threads.deletedAt,
    })
    .from(schema.threads)
    .where(eq(schema.threads.openaiThreadId, openaiThreadId))
    .limit(1);

  if (thread.length === 0) {
    return makeLeft(new ResourceNotFound("Thread não encontrada."));
  }

  if (thread[0].userId !== userId) {
    return makeLeft(
      new NotAuthorized(
        "Você não tem permissão para adicionar uma mensagem a esta thread.",
      ),
    );
  }

  if (thread[0].archivedAt !== null) {
    return makeLeft(
      new NotAuthorized(
        "Você não pode adicionar uma mensagem a uma thread arquivada.",
      ),
    );
  }

  if (thread[0].deletedAt !== null) {
    return makeLeft(new ResourceNotFound("Thread não encontrada."));
  }

  const [createdMessage] = await db
    .insert(schema.messages)
    .values({ openaiThreadId, openaiMessageId, role, text, usage })
    .returning();

  await db
    .update(schema.threads)
    .set({ updatedAt: new Date() })
    .where(eq(schema.threads.openaiThreadId, openaiThreadId));

  const createdAttachments = await createAttachments({
    uploads: attachments || [],
    messageId: createdMessage.id,
  });

  if (isLeft(createdAttachments)) {
    const error = unwrapEither(createdAttachments);
    return makeLeft(error);
  }

  return makeRight({
    openaiThreadId: createdMessage.openaiThreadId,
    openaiMessageId: createdMessage.openaiMessageId,
    role: createdMessage.role,
    text: createdMessage.text,
    id: createdMessage.id,
    createdAt: createdMessage.createdAt,
    attachments: unwrapEither(createdAttachments),
    usage: createdMessage.usage,
  });
}
