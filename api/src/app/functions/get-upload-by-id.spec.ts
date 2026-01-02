import { isLeft, isRight, unwrapEither } from '@/core/either'
import { makeUpload } from '@/test/factories/make-upload'
import { makeUser } from '@/test/factories/make-user'
import { describe, expect, it } from 'vitest'
import { ResourceNotFound } from '../errors/resource-not-found'
import { getUploadById } from './get-upload-by-id'

describe('get upload by id', () => {
  it('should be able to get an existing upload by id', async () => {
    const user = await makeUser()
    const upload = await makeUpload({ userId: user.id })

    const sut = await getUploadById({ userId: user.id, uploadId: upload.id })

    expect(isRight(sut)).toBe(true)
    expect(unwrapEither(sut)).toEqual(upload)
  })

  it('should not be able to get a non-existent upload by id', async () => {
    const user = await makeUser()

    const getInput = {
      userId: user.id,
      uploadId: 'non-existent-upload-id',
    }

    const sut = await getUploadById(getInput)

    expect(isLeft(sut)).toBe(true)
    expect(unwrapEither(sut)).toBeInstanceOf(ResourceNotFound)
  })

  it('should not be able to get an upload by id for a non-existent user', async () => {
    const getInput = {
      userId: 'non-existent-user-id',
      uploadId: 'non-existent-upload-id',
    }

    const sut = await getUploadById(getInput)

    expect(isLeft(sut)).toBe(true)
    expect(unwrapEither(sut)).toBeInstanceOf(ResourceNotFound)
  })
})
