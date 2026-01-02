import { isLeft, isRight, unwrapEither } from '@/core/either'
import { makeUser } from '@/test/factories/make-user'
import { faker } from '@faker-js/faker'
import { describe, expect, it } from 'vitest'
import { createUploadFile } from './create-upload-file'

describe('create upload file', () => {
  it('should be able to create a new upload file', async () => {
    const user = await makeUser()

    const file = {
      id: faker.string.uuid(),
      bytes: faker.number.int({ min: 0, max: 1024 * 1024 * 2 }),
      filename: faker.system.fileName(),
      mimetype: faker.system.mimeType(),
      createdAt: new Date(),
    }

    const input = {
      userId: user.id,
      storage: 'openai' as const,
      file,
    }

    const sut = await createUploadFile(input)

    expect(isRight(sut)).toBe(true)
    expect(unwrapEither(sut)).toEqual(
      expect.objectContaining({
        userId: user.id,
        storage: 'openai',
        file: expect.objectContaining({
          id: file.id,
          bytes: file.bytes,
          filename: file.filename,
          mimetype: file.mimetype,
          createdAt: expect.any(Date),
        }),
      })
    )
  })

  it('should not be able to create an upload file for a non-existent user', async () => {
    const file = {
      id: faker.string.uuid(),
      bytes: faker.number.int(),
      filename: faker.system.fileName(),
      mimetype: faker.system.mimeType(),
      createdAt: new Date(),
    }

    const input = {
      userId: 'non-existent-user-id',
      storage: 'openai' as const,
      file,
    }

    const sut = await createUploadFile(input)

    expect(isLeft(sut)).toBe(true)
  })
})
