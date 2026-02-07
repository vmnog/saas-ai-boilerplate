import { addMessageToThread } from '@/app/functions/add-message-to-thread'
import { checkUserLimit } from '@/app/functions/check-user-limit'
import { generateThreadTitle } from '@/app/functions/generate-thread-title'
import { updateMessage } from '@/app/functions/update-message'
import { updateUserLimit } from '@/app/functions/update-user-limit'
import { isLeft, unwrapEither } from '@/core/either'
import { db } from '@/db'
import { schema } from '@/db/schema'
import { env } from '@/env'
import { langchainOpenAIClient } from '@/langchain/openai/client'
import { createLangchainOpenAIMessage } from '@/langchain/openai/create-langchain-openai-message'
import { openai } from '@/openai/client'
import { createOpenAIMessage } from '@/openai/create-openai-message'
import { sanitizeEncodedText } from '@/utils/sanitize-encoded-text'
import { eq } from 'drizzle-orm'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import type { TextContentBlock } from 'openai/resources/beta/threads/messages.mjs'
import { z } from 'zod'
import { authenticateHook } from '../hooks/auth'
import { textStream } from '../http-stream'

export const addMessageToThreadRoute: FastifyPluginAsyncZod = async server => {
  server.post(
    '/threads/:openaiThreadId/messages',
    {
      onRequest: [authenticateHook],
      schema: {
        tags: ['threads'],
        operationId: 'addMessageToThread',
        description: 'Add a message to an existing thread',
        params: z.object({
          openaiThreadId: z.string(),
        }),
        body: z.object({
          content: z.string(),
          attachments: z
            .array(
              z.object({
                id: z.string(),
                fileId: z.string(),
              })
            )
            .optional(),
        }),
        response: {
          201: z.any(),
          403: z.object({ message: z.string() }),
          404: z.object({ message: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const { openaiThreadId } = request.params
      const { content, attachments } = request.body
      const userId = request.user.sub

      const thread = await db
        .select()
        .from(schema.threads)
        .where(eq(schema.threads.openaiThreadId, openaiThreadId))

      if (thread.length === 0) {
        return reply.status(404).send({ message: 'Esta conversa não existe' })
      }

      if (thread[0].archivedAt) {
        return reply.status(403).send({
          message:
            'Não é possível enviar mensagens para uma conversa arquivada',
        })
      }

      if (thread[0].userId !== userId) {
        return reply.status(403).send({
          message:
            'Você não tem permissão para enviar mensagens para esta conversa',
        })
      }

      const userLimit = await checkUserLimit({
        userId,
        type: 'send-message',
      })

      if (isLeft(userLimit)) {
        const error = unwrapEither(userLimit)
        return reply.status(403).send({ message: error.message })
      }

      if (!unwrapEither(userLimit).allowed) {
        return reply.status(429).send({
          message: 'Você atingiu o limite de mensagens enviadas para hoje',
        })
      }

      await generateThreadTitle(
        {
          openaiThreadId,
          messageContent: sanitizeEncodedText(content),
        },
        openai
      )

      const {
        systemMessage: langchainSystemMessage,
        humanMessage: langchainHumanMessage,
      } = await createLangchainOpenAIMessage({
        content: sanitizeEncodedText(content),
      })

      const langchainContent = await langchainOpenAIClient.invoke([
        langchainSystemMessage,
        langchainHumanMessage,
      ])

      const systemInstruction = `A seguir um contexto extra para ajudar a responder a solicitação: ${langchainContent.content}\n\n`
      const langchainUsageCost = {
        prompt_tokens: langchainContent?.usage_metadata?.input_tokens || 0,
        completion_tokens: langchainContent?.usage_metadata?.output_tokens || 0,
        total_tokens: langchainContent?.usage_metadata?.total_tokens || 0,
      }

      const { message, systemMessage } = await createOpenAIMessage({
        systemMessageContent: systemInstruction,
        openaiThreadId,
        content: sanitizeEncodedText(content),
        attachments: attachments?.map(attachment => ({
          file_id: attachment.fileId,
          tools: [{ type: 'file_search' }],
        })),
      })

      console.log(
        'DEBUG createOpenAIMessage message',
        (message.content[0] as TextContentBlock).text
      )
      console.log(
        'DEBUG createOpenAIMessage systemMessage',
        (systemMessage.content[0] as TextContentBlock).text
      )

      const sanitizedMessage = sanitizeEncodedText(
        (message.content[0] as TextContentBlock).text.value
      )

      const addedMessage = await addMessageToThread({
        openaiThreadId,
        openaiMessageId: message.id,
        role: message.role,
        text: sanitizedMessage,
        attachments,
        userId,
        usage: {
          prompt_tokens: 0,
          completion_tokens: 0,
          total_tokens: 0,
        },
      })

      console.log('Message added to thread: ', addedMessage)

      console.log('Creating run stream...')
      const toolChoice =
        attachments?.length && attachments?.length > 0
          ? { tool_choice: { type: 'file_search' as const } }
          : {}
      const runStream = openai.beta.threads.runs.stream(openaiThreadId, {
        assistant_id: env.OPENAI_ASSISTANT_ID,
        ...toolChoice,
      })
      console.log('Run stream created: ', runStream)

      console.log('Streaming run...')
      return textStream(async stream => {
        try {
          for await (const chunk of runStream) {
            stream.writeJson(chunk)

            if (chunk.event === 'thread.run.failed') {
              console.error('Run failed:', chunk.data.last_error)
            }

            if (chunk.event === 'thread.message.completed') {
              console.log('Stream completed: ', chunk.data)
              const sanitizedAssistantMessage = sanitizeEncodedText(
                (chunk.data.content as TextContentBlock[])[0].text.value
              )
              const assistantMessage = await addMessageToThread({
                openaiThreadId: chunk.data.thread_id,
                openaiMessageId: chunk.data.id,
                role: 'assistant',
                text: sanitizedAssistantMessage,
                userId,
                usage: langchainUsageCost,
              })
              console.log(
                'Assistant message added to thread: ',
                assistantMessage
              )

              console.log('Updating user limit...')
              try {
                const updatedLimit = await updateUserLimit({
                  userId,
                  type: 'send-message',
                  amount: 1,
                })

                if (isLeft(updatedLimit)) {
                  console.log(
                    'Update user limit error:',
                    unwrapEither(updatedLimit)
                  )
                } else {
                  console.log('User limit updated:', unwrapEither(updatedLimit))
                }
              } catch (err) {
                console.log('Error updating user limit:', err)
              }
            }

            if (chunk.event === 'thread.run.completed') {
              console.log('DEBUG usage', chunk.data.usage)
              if (!chunk.data.usage) return
              const updatedMessage = await updateMessage({
                usage: chunk.data.usage,
                openaiThreadId: chunk.data.thread_id,
              })

              if (isLeft(updatedMessage)) {
                console.log(
                  'Failed to update message usage',
                  unwrapEither(updatedMessage)
                )
              } else {
                console.log('DEBUG message updated with usage', updatedMessage)
              }
            }
          }
        } catch (error) {
          console.error('Stream error:', error)
          stream.writeJson({
            event: 'stream.error',
            data: {
              message:
                error instanceof Error
                  ? error.message
                  : 'Erro ao processar resposta da IA',
            },
          })
        }
      })
    }
  )
}
