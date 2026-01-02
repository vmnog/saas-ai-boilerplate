import { isLeft, isRight, unwrapEither } from '@/core/either'
import { makeMessage } from '@/test/factories/make-message'
import { makeThread } from '@/test/factories/make-thread'
import { makeUpload } from '@/test/factories/make-upload'
import { makeUser } from '@/test/factories/make-user'
import { faker } from '@faker-js/faker'
import { describe, expect, it } from 'vitest'
import { ResourceNotFound } from '../errors/resource-not-found'
import { createAttachments } from './create-attachments'

describe('create attachments', () => {
  it('should be able to create new attachments from multiple uploads', async () => {
    const user = await makeUser()
    const thread = await makeThread({ userId: user.id })
    const message = await makeMessage({ openaiThreadId: thread.openaiThreadId })
    const upload1 = await makeUpload()
    const upload2 = await makeUpload()

    const input = {
      messageId: message.id,
      uploads: [
        { id: upload1.id, fileId: upload1.fileId },
        { id: upload2.id, fileId: upload2.fileId },
      ],
    }

    const sut = await createAttachments(input)

    expect(isRight(sut)).toBe(true)
    expect(unwrapEither(sut)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          messageId: message.id,
          uploadId: upload1.id,
        }),
        expect.objectContaining({
          messageId: message.id,
          uploadId: upload2.id,
        }),
      ])
    )
  })

  it('should not be able to create attachments for a non-existent message', async () => {
    const upload1 = await makeUpload()
    const upload2 = await makeUpload()

    const input = {
      messageId: 'non-existent-message-id',
      uploads: [
        { id: upload1.id, fileId: upload1.fileId },
        { id: upload2.id, fileId: upload2.fileId },
      ],
    }

    const sut = await createAttachments(input)

    expect(isLeft(sut)).toBe(true)
    expect(unwrapEither(sut)).toEqual(new ResourceNotFound('Message not found'))
  })

  it('should not be able to create attachments if one or more uploads are not found', async () => {
    const user = await makeUser()
    const thread = await makeThread({ userId: user.id })
    const message = await makeMessage({ openaiThreadId: thread.openaiThreadId })

    const upload1 = await makeUpload()

    const input = {
      messageId: message.id,
      uploads: [
        { id: upload1.id, fileId: upload1.fileId },
        { id: faker.string.uuid(), fileId: faker.string.uuid() },
      ],
    }

    const sut = await createAttachments(input)

    expect(isLeft(sut)).toBe(true)
    expect(unwrapEither(sut)).toEqual(new ResourceNotFound(`Upload with id ${input.uploads[1].id} not found`))
  })
})
