import type { Message } from "openai/resources/beta/threads/messages";
import { z } from "zod";
import { openai } from "./client";

const createOpenAIMessageInput = z.object({
  systemMessageContent: z.string(),
  openaiThreadId: z.string(),
  content: z.string(),
  attachments: z
    .array(
      z.object({
        file_id: z.string(),
        tools: z.array(
          z.object({
            type: z.enum(["file_search", "code_interpreter"]),
          }),
        ),
      }),
    )
    .optional(),
});

const createOpenAIMessageOutput = z.object({
  message: z.custom<Message>(),
  systemMessage: z.custom<Message>(),
});

type CreateOpenAIMessageInput = z.infer<typeof createOpenAIMessageInput>;
type CreateOpenAIMessageOutput = z.infer<typeof createOpenAIMessageOutput>;

export async function createOpenAIMessage(
  input: CreateOpenAIMessageInput,
): Promise<CreateOpenAIMessageOutput> {
  try {
    const systemMessage = await openai.beta.threads.messages.create(
      input.openaiThreadId,
      {
        role: "assistant",
        content: input.systemMessageContent,
      },
    );
    const message = await openai.beta.threads.messages.create(
      input.openaiThreadId,
      {
        role: "user",
        content: input.content,
        attachments: input.attachments,
      },
    );

    return {
      systemMessage,
      message,
    };
  } catch (error) {
    console.error("Error creating openai message:", error);
    throw error;
  }
}
