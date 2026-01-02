import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";

import { createOpenAITranscription } from "@/openai/create-openai-transcription";
import { authenticateHook } from "../hooks/auth";

const storageSchema = z.enum(["openai"]);

export const transcribeAudioFileRoute: FastifyPluginAsyncZod = async (server) => {
  server.post(
    "/audio/transcribe",
    {
      onRequest: [authenticateHook],
      schema: {
        tags: ["audio"],
        operationId: "transcribeAudioFileRoute",
        description: "Transcribe an audio file",
        consumes: ["multipart/form-data"],
        response: {
          201: z.object({
            text: z.string(),
          }),
          400: z.object({ message: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const userId = request.user.sub;
      const fileToUpload = await request.file();

      if (!fileToUpload) {
        return reply.status(400).send({ message: "File is required" });
      }

      const supportedAudioMimetypes = [
        "audio/flac",
        "audio/mp3",
        "audio/mp4",
        "audio/mpeg",
        "audio/mpga",
        "audio/m4a",
        "audio/ogg",
        "audio/wav",
        "audio/webm",
      ];
      if (!supportedAudioMimetypes.includes(fileToUpload.mimetype)) {
        return reply.status(400).send({
          message: `
            File mimetype ${fileToUpload.mimetype} is not supported.
            Supported mimetypes: ${supportedAudioMimetypes.join(", ")}
          `,
        });
      }

      const fileToUploadAsBuffer = await fileToUpload.toBuffer();

      const MAX_FILE_SIZE_IN_BYTES = 1024 * 1024 * 25; // 25 MB limit
      if (fileToUploadAsBuffer.length > MAX_FILE_SIZE_IN_BYTES) {
        // TODO: allow user to upload larger files splitting them into chunks of 25MB
        return reply
          .status(400)
          .send({
            message: "File size is too large, we currently support up to 25MB",
          });
      }

      try {
        const result = await createOpenAITranscription({
          file: fileToUploadAsBuffer,
        });

        return reply.status(201).send({ text: result.text });
      } catch (error) {
        console.error("Error transcribing audio file:", error);
        return reply.status(400).send({
          message: 'Failed to transcribe audio file. Please try again.'
        });
      }
    },
  );
};
