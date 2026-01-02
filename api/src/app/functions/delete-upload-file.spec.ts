import { isLeft, isRight, unwrapEither } from '@/core/either'
import { makeAttachment } from '@/test/factories/make-attachment'
import { makeMessage } from '@/test/factories/make-message'
import { makeThread } from '@/test/factories/make-thread'
import { makeUpload } from '@/test/factories/make-upload'
import { makeUser } from '@/test/factories/make-user'
import { describe, expect, it } from 'vitest'
import { ResourceNotFound } from '../errors/resource-not-found'
import { deleteUploadFile } from './delete-upload-file'

describe('delete upload file', () => {
  it('should be able to delete an existing upload file', async () => {
    const user = await makeUser()
    const upload = await makeUpload({ userId: user.id })

    const sut = await deleteUploadFile({ userId: user.id, uploadId: upload.id })

    expect(isRight(sut)).toBe(true)
    expect(unwrapEither(sut)).toBe(null)
  })

  it('should not be able to delete a non-existent upload file', async () => {
    const user = await makeUser()

    const deleteInput = {
      userId: user.id,
      uploadId: 'non-existent-upload-id',
    }

    const sut = await deleteUploadFile(deleteInput)

    expect(isLeft(sut)).toBe(true)
    expect(unwrapEither(sut)).toBeInstanceOf(ResourceNotFound)
  })

  it('should not be able to delete an upload file for a non-existent user', async () => {
    const deleteInput = {
      userId: 'non-existent-user-id',
      uploadId: 'non-existent-upload-id',
    }

    const sut = await deleteUploadFile(deleteInput)

    expect(isLeft(sut)).toBe(true)
    expect(unwrapEither(sut)).toBeInstanceOf(ResourceNotFound)
  })

  it('should not be able to delete an upload file that is being used by an attachment', async () => {
    const user = await makeUser()
    const upload = await makeUpload({ userId: user.id })
    const thread = await makeThread({ userId: user.id })
    const message = await makeMessage({ openaiThreadId: thread.openaiThreadId, role: 'user' })
    await makeAttachment({ uploadId: upload.id, messageId: message.id })

    const sut = await deleteUploadFile({ userId: user.id, uploadId: upload.id })

    expect(isLeft(sut)).toBe(true)
    expect(unwrapEither(sut)).toBeInstanceOf(ResourceNotFound)
  })
})
