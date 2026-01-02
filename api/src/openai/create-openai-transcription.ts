import { toFile } from "openai";
import { z } from "zod";
import { openai } from "./client";

const createOpenAITranscriptionInput = z.object({
  file: z.instanceof(Buffer),
});

const createOpenAITranscriptionOutput = z.object({
  text: z.string(),
});

type CreateOpenAITranscriptionInput = z.infer<typeof createOpenAITranscriptionInput>;
type CreateOpenAITranscriptionOutput = z.infer<typeof createOpenAITranscriptionOutput>;

export async function createOpenAITranscription(
  input: CreateOpenAITranscriptionInput,
): Promise<CreateOpenAITranscriptionOutput> {
  const transcription = await openai.audio.transcriptions.create({
    file: await toFile(input.file, "audio.mp3", {
      type: "audio/mpeg",
    }),
    model: "whisper-1",
    language: "pt",
    prompt: "Transcreva o áudio em português do Brasil com precisão, mantendo a pontuação adequada e formatação correta.",
    response_format: "text",
  });

  return {
    text: transcription,
  };
}
