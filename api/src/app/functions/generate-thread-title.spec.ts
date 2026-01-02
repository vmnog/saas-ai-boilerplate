import { isRight, unwrapEither } from '@/core/either'
import { makeThread } from '@/test/factories/make-thread'
import { makeUser } from '@/test/factories/make-user'
import { faker } from '@faker-js/faker'
import type OpenAI from 'openai'
import { describe, expect, it, vi } from 'vitest'
import { generateThreadTitle } from './generate-thread-title'

describe('generate thread title', () => {
    it('should return existing title if thread already has one', async () => {
        const existingTitle = faker.lorem.words(3)
        const user = await makeUser()
        const thread = await makeThread({ title: existingTitle, userId: user.id })
        const messageContent = faker.lorem.paragraph()

        const mockOpenAI = vi.mocked({
            chat: {
                completions: {
                    create: vi.fn(),
                },
            },
        }) as unknown as OpenAI

        const sut = await generateThreadTitle(
            {
                openaiThreadId: thread.openaiThreadId,
                messageContent,
            },
            mockOpenAI
        )

        expect(isRight(sut)).toBe(true)
        expect(unwrapEither(sut)).toEqual({
            title: existingTitle,
        })
        expect(mockOpenAI.chat.completions.create).not.toHaveBeenCalled()
    })

    it('should generate and save new title if thread has no title', async () => {
        const user = await makeUser()
        const thread = await makeThread({ title: null, userId: user.id })
        const messageContent = faker.lorem.paragraph()
        const generatedTitle = faker.lorem.words(3)

        const mockOpenAI = {
            chat: {
                completions: {
                    create: vi.fn().mockResolvedValue({
                        choices: [
                            {
                                message: {
                                    content: generatedTitle,
                                },
                            },
                        ],
                    }),
                },
            },
        }

        const sut = await generateThreadTitle(
            {
                openaiThreadId: thread.openaiThreadId,
                messageContent,
            },
            mockOpenAI as unknown as OpenAI
        )

        expect(isRight(sut)).toBe(true)
        expect(unwrapEither(sut)).toEqual({
            title: generatedTitle,
        })
        expect(mockOpenAI.chat.completions.create).toHaveBeenCalledTimes(1)
    })
})
