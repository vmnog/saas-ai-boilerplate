import { toFile } from "openai";
import type { FileObject, FilePurpose } from "openai/resources/files";
import { z } from "zod";
import { openai } from "./client";

const createOpenAIFileInput = z.object({
  purpose: z.custom<FilePurpose>(),
  file: z.instanceof(Buffer),
  filename: z.string().optional(),
  mimetype: z.string().optional(),
});

const createOpenAIFileOutput = z.object({
  file: z.custom<FileObject>(),
});

type CreateOpenAIFileInput = z.infer<typeof createOpenAIFileInput>;
type CreateOpenAIFileOutput = z.infer<typeof createOpenAIFileOutput>;

export async function createOpenAIFile(
  input: CreateOpenAIFileInput,
): Promise<CreateOpenAIFileOutput> {
  const file = await openai.files.create({
    file: await toFile(input.file, input.filename, {
      type: input.mimetype,
    }),
    purpose: input.purpose,
  });

  return {
    file,
  };
}
