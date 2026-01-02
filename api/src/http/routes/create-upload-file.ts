import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";

import { createUploadFile } from "@/app/functions/create-upload-file";
import { isRight, unwrapEither } from "@/core/either";
import { createOpenAIFile } from "@/openai/create-openai-file";
import { authenticateHook } from "../hooks/auth";

const storageSchema = z.enum(["openai"]);
const supportedOpenaiMimetypes = [
  "text/x-c", // c
  "text/x-c++", // cpp
  "text/x-csharp", // csharp
  "text/css", // css
  "application/msword", // doc
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // docx
  "text/x-golang", // go
  "text/html", // html
  "text/x-java", // java
  "text/javascript", // js
  "application/json", // json
  "text/markdown", // md
  "application/pdf", // pdf
  "text/x-php", // php
  "application/vnd.openxmlformats-officedocument.presentationml.presentation", // pptx
  "text/x-python", // py
  "text/x-script.python", // py
  "text/x-ruby", // rb
  "text/x-tex", // tex
  "application/typescript", // ts
  "text/plain", // txt
];

export const createUploadFileRoute: FastifyPluginAsyncZod = async (server) => {
  server.post(
    "/files/:storage",
    {
      onRequest: [authenticateHook],
      schema: {
        tags: ["files"],
        operationId: "createUploadFileRoute",
        description: "Create a new upload file",
        params: z.object({
          storage: storageSchema,
        }),
        consumes: ["multipart/form-data"],
        response: {
          201: z.object({
            storage: z.string(),
            id: z.string(),
            createdAt: z.date(),
            userId: z.string(),
            file: z.object({
              id: z.string(),
              bytes: z.number(),
              filename: z.string(),
              mimetype: z.string(),
              createdAt: z.date(),
            }),
          }),
          400: z.object({ message: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const { storage } = request.params;
      const userId = request.user.sub;
      const fileToUpload = await request.file();

      if (!fileToUpload) {
        return reply.status(400).send({ message: "File is required" });
      }

      if (!supportedOpenaiMimetypes.includes(fileToUpload.mimetype)) {
        return reply.status(400).send({
          message: `
            File mimetype ${fileToUpload.mimetype} is not supported.
            Supported mimetypes: ${supportedOpenaiMimetypes.join(", ")}
          `,
        });
      }

      if (storage !== "openai") {
        return reply
          .status(400)
          .send({
            message: "Invalid storage, we currently only support OpenAI",
          });
      }

      const fileToUploadAsBuffer = await fileToUpload.toBuffer();

      const MAX_FILE_SIZE_IN_BYTES = 1024 * 1024 * 2;
      if (fileToUploadAsBuffer.length > MAX_FILE_SIZE_IN_BYTES) {
        return reply
          .status(400)
          .send({
            message: "File size is too large, we currently support up to 2MB",
          });
      }

      const uploadedFile = await createOpenAIFile({
        purpose: "assistants",
        file: fileToUploadAsBuffer,
        filename: fileToUpload.filename,
        mimetype: fileToUpload.mimetype,
      });

      const result = await createUploadFile({
        userId,
        storage,
        file: {
          ...uploadedFile.file,
          mimetype: fileToUpload.mimetype,
        },
      });

      if (isRight(result)) {
        return reply.status(201).send(unwrapEither(result));
      }

      const error = unwrapEither(result);

      switch (error.constructor.name) {
        default:
          return reply.status(400).send({ message: error.message });
      }
    },
  );
};
