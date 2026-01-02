import { type Either, makeLeft, makeRight } from "@/core/either";
import { db } from "@/db";
import { schema } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { z } from "zod";
import { ResourceNotFound } from "../errors/resource-not-found";

const updateMessageInput = z.object({
  openaiThreadId: z.string(),
  usage: z
    .object({
      prompt_tokens: z.number(),
      completion_tokens: z.number(),
      total_tokens: z.number(),
    })
    .nullable(),
});

const updateMessageOutput = z.object({
  message: z.object({
    id: z.string(),
    openaiMessageId: z.string(),
    text: z.string(),
    role: z.string(),
    openaiThreadId: z.string(),
    usage: z
      .object({
        prompt_tokens: z.number(),
        completion_tokens: z.number(),
        total_tokens: z.number(),
      })
      .nullable(),
    createdAt: z.date(),
  }),
});

type UpdateMessageInput = z.infer<typeof updateMessageInput>;
type UpdateMessageOutput = z.infer<typeof updateMessageOutput>;

export async function updateMessage(
  input: UpdateMessageInput,
): Promise<Either<ResourceNotFound, UpdateMessageOutput>> {
  const { openaiThreadId: threadId, usage } = updateMessageInput.parse(input);

  const [thread] = await db
    .select()
    .from(schema.threads)
    .where(eq(schema.threads.openaiThreadId, threadId));

  if (!thread) {
    return makeLeft(new ResourceNotFound("Thread not found"));
  }

  const [lastMessage] = await db
    .select()
    .from(schema.messages)
    .where(eq(schema.messages.openaiThreadId, threadId))
    .orderBy(desc(schema.messages.createdAt))
    .limit(1);

  if (!lastMessage) {
    return makeLeft(new ResourceNotFound("Message not found"));
  }

  const summedUsage = {
    prompt_tokens:
      (lastMessage.usage?.prompt_tokens || 0) + (usage?.prompt_tokens || 0),
    completion_tokens:
      (lastMessage.usage?.completion_tokens || 0) +
      (usage?.completion_tokens || 0),
    total_tokens:
      (lastMessage.usage?.total_tokens || 0) + (usage?.total_tokens || 0),
  };

  const [updatedMessage] = await db
    .update(schema.messages)
    .set({ usage: summedUsage })
    .where(eq(schema.messages.id, lastMessage.id))
    .returning();

  if (!updatedMessage) {
    return makeLeft(new ResourceNotFound("Could not update message"));
  }

  return makeRight({ message: updatedMessage });
}
