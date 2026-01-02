import { isLeft, isRight, unwrapEither } from '@/core/either'
import { makeAttachment } from '@/test/factories/make-attachment'
import { makeMessage } from '@/test/factories/make-message'
import { makeThread } from '@/test/factories/make-thread'
import { makeUpload } from '@/test/factories/make-upload'
import { makeUser } from '@/test/factories/make-user'
import { describe, expect, it } from 'vitest'
import { NotAuthorized } from '../errors/not-authorized'
import { ResourceNotFound } from '../errors/resource-not-found'
import { listThreadMessages } from './list-thread-messages'

describe('list thread messages', () => {
    it('should be able to list messages from a thread', async () => {
        const user = await makeUser()
        const thread = await makeThread({ userId: user.id })
        const message_1 = await makeMessage({ openaiThreadId: thread.openaiThreadId })
        const message_2 = await makeMessage({ openaiThreadId: thread.openaiThreadId })

        const result = await listThreadMessages({
            openaiThreadId: thread.openaiThreadId,
            userId: user.id,
        })

        expect(isRight(result)).toBe(true)
        const messages = unwrapEither(result)
        expect(messages).toHaveLength(2)
        expect(messages).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    id: message_1.id,
                    text: message_1.text,
                    role: message_1.role,
                    createdAt: message_1.createdAt,
                    openaiThreadId: thread.openaiThreadId,
                    attachments: [],
                }),
                expect.objectContaining({
                    id: message_2.id,
                    text: message_2.text,
                    role: message_2.role,
                    createdAt: message_2.createdAt,
                    openaiThreadId: thread.openaiThreadId,
                    attachments: [],
                }),
            ])
        )
    })

    it('should return attachments files uploaded to the messages', async () => {
        const user = await makeUser()
        const thread = await makeThread({ userId: user.id })
        const upload = await makeUpload({ userId: user.id })
        const message = await makeMessage({ openaiThreadId: thread.openaiThreadId })
        await makeAttachment({ messageId: message.id, uploadId: upload.id })

        const result = await listThreadMessages({
            openaiThreadId: thread.openaiThreadId,
            userId: user.id,
        })

        const messages = unwrapEither(result)
        expect(isRight(result)).toBe(true)
        expect(messages).toHaveLength(1)
        expect(messages).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    id: message.id,
                    text: message.text,
                    role: message.role,
                    createdAt: expect.any(Date),
                    attachments: expect.arrayContaining([
                        expect.objectContaining({
                            id: upload.id,
                            filename: upload.filename,
                            mimetype: upload.mimetype,
                            createdAt: expect.any(Date),
                        }),
                    ]),
                }),
            ])
        )
    })

    it('should return an empty array for a thread with no messages', async () => {
        const user = await makeUser()
        const thread = await makeThread({ userId: user.id })

        const result = await listThreadMessages({
            openaiThreadId: thread.openaiThreadId,
            userId: user.id,
        })

        expect(isRight(result)).toBe(true)
        const messages = unwrapEither(result)
        expect(messages).toHaveLength(0)
    })

    it('should not be able to list messages from a nonexistent thread', async () => {
        const user = await makeUser()

        const result = await listThreadMessages({
            openaiThreadId: 'non-existent-thread',
            userId: user.id,
        })

        expect(isLeft(result)).toBe(true)
        expect(unwrapEither(result)).toBeInstanceOf(ResourceNotFound)
    })

    it('should not be able to list messages from another users thread', async () => {
        const user = await makeUser()
        const anotherUser = await makeUser()
        const thread = await makeThread({ userId: anotherUser.id })

        const result = await listThreadMessages({
            openaiThreadId: thread.openaiThreadId,
            userId: user.id,
        })

        expect(isLeft(result)).toBe(true)
        expect(unwrapEither(result)).toBeInstanceOf(NotAuthorized)
    })

    it('should not be able to list messages from a deleted thread', async () => {
        const user = await makeUser()
        const thread = await makeThread({ userId: user.id, deletedAt: new Date() })

        const result = await listThreadMessages({
            openaiThreadId: thread.openaiThreadId,
            userId: user.id,
        })

        expect(isLeft(result)).toBe(true)
        expect(unwrapEither(result)).toBeInstanceOf(ResourceNotFound)
    })

    it('should not be able to list messages from a archived thread', async () => {
        const user = await makeUser()
        const thread = await makeThread({ userId: user.id, archivedAt: new Date() })

        const result = await listThreadMessages({
            openaiThreadId: thread.openaiThreadId,
            userId: user.id,
        })

        expect(isLeft(result)).toBe(true)
        expect(unwrapEither(result)).toBeInstanceOf(NotAuthorized)
    })
})
