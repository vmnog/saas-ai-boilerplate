import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { deleteUploadFile } from '@/app/functions/delete-upload-file'
import { getUploadById } from '@/app/functions/get-upload-by-id'
import { isLeft, isRight, unwrapEither } from '@/core/either'
import { deleteOpenAIFile } from '@/openai/delete-openai-file'
import { authenticateHook } from '../hooks/auth'

export const deleteUploadFileRoute: FastifyPluginAsyncZod = async server => {
  server.delete(
    '/files/:uploadId',
    {
      onRequest: [authenticateHook],
      schema: {
        tags: ['files'],
        operationId: 'deleteUploadFile',
        description: 'Delete an uploaded file',
        params: z.object({
          uploadId: z.string(),
        }),
        response: {
          204: z.null().describe('No content'),
          400: z.object({ message: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const userId = request.user.sub
      const { uploadId } = request.params

      const uploadByIdResult = await getUploadById({ userId, uploadId })

      if (isLeft(uploadByIdResult)) {
        const error = unwrapEither(uploadByIdResult)
        return reply.status(404).send({ message: error.message })
      }

      const upload = unwrapEither(uploadByIdResult)

      const result = await deleteUploadFile({ userId, uploadId })

      if (isRight(result)) {
        try {
          await deleteOpenAIFile({ fileId: upload.fileId })
        } catch (error) {
          return reply.status(500).send({ message: 'Failed to delete file from OpenAI' })
        }
        return reply.status(204).send()
      }

      const error = unwrapEither(result)

      switch (error.constructor.name) {
        default:
          return reply.status(400).send({ message: error.message })
      }
    }
  )
}
