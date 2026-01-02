import { type Either, makeLeft, makeRight } from "@/core/either";
import { db } from "@/db";
import { schema } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import type OpenAI from "openai";
import { z } from "zod";
import { ResourceNotFound } from "../errors/resource-not-found";
import { sanitizeEncodedText } from "@/utils/sanitize-encoded-text";

const generateThreadTitleInput = z.object({
  openaiThreadId: z.string(),
  messageContent: z.string(),
});
const generateThreadTitleOutput = z.object({
  title: z.string().nullable(),
});

type GenerateThreadTitleInput = z.infer<typeof generateThreadTitleInput>;
type GenerateThreadTitleOutput = z.infer<typeof generateThreadTitleOutput>;

export async function generateThreadTitle(
  input: GenerateThreadTitleInput,
  openaiClient: OpenAI,
): Promise<Either<ResourceNotFound, GenerateThreadTitleOutput>> {
  const { openaiThreadId, messageContent } =
    generateThreadTitleInput.parse(input);

  // Check if thread already has a title
  const [thread] = await db
    .select({ title: schema.threads.title })
    .from(schema.threads)
    .where(eq(schema.threads.openaiThreadId, openaiThreadId));

  if (thread.title !== null) {
    return makeRight({ title: thread.title });
  }

  let completion: OpenAI.ChatCompletion | null;

  // Generate title using OpenAI
  try {
    completion = await openaiClient.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        {
          role: "system",
          content: `
                Gere um título curto e conciso para uma conversa que começa com esta mensagem.
                O título deve ter no máximo 30 caracteres e preferencialmente ser composto de até 3 palavras.
                O título não deve conter aspas ou outros caracteres especiais.
                Responda APENAS com o título, sem explicações adicionais.
                `,
        },
        {
          role: "user",
          content: messageContent,
        },
      ],
      temperature: 0.1,
      top_p: 0.1,
      max_tokens: 2000,
    });
  } catch (err) {
    console.error("Could not chat completions create for Thread Title", err);
    completion = null;
  }

  const title = completion?.choices[0].message.content?.trim() || null;

  if (!title) {
    return makeLeft(
      new ResourceNotFound(
        "Completion result was not found after generating thread title",
      ),
    );
  }

  const sanitizedTitle = sanitizeEncodedText(title);

  // Only update if title is null
  try {
    await db
      .update(schema.threads)
      .set({ title: sanitizedTitle })
      .where(
        sql`${eq(schema.threads.openaiThreadId, openaiThreadId)} AND title IS NULL`,
      );
  } catch (err) {
    console.log("Error updating thread title", err);
  }

  return makeRight({ title: sanitizedTitle });
}
