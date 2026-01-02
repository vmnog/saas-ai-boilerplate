import { isLeft, isRight, unwrapEither } from '@/core/either'
import { makeThread } from '@/test/factories/make-thread'
import { makeUser } from '@/test/factories/make-user'
import { describe, expect, it } from 'vitest'
import { ResourceNotFound } from '../errors/resource-not-found'
import {
  type DeleteAllArchivedThreadsOutput,
  deleteAllArchivedThreads,
} from './delete-all-archived-threads'

describe('delete all archived threads', () => {
  it('should be able to delete all archived threads', async () => {
    const user = await makeUser()
    await makeThread({ userId: user.id, archivedAt: new Date() })
    await makeThread({ userId: user.id, archivedAt: new Date() })
    await makeThread({ userId: user.id, archivedAt: new Date() })

    const sut = await deleteAllArchivedThreads({
      userId: user.id,
    })

    expect(isRight(sut)).toBe(true)
    const result = unwrapEither(sut) as DeleteAllArchivedThreadsOutput
    expect(result.deletedThreadsAmount).toBe(3)
  })

  it('should not delete non-archived threads', async () => {
    const user = await makeUser()
    await makeThread({ userId: user.id, archivedAt: new Date() })
    await makeThread({ userId: user.id }) // Not archived
    await makeThread({ userId: user.id }) // Not archived

    const sut = await deleteAllArchivedThreads({
      userId: user.id,
    })

    expect(isRight(sut)).toBe(true)
    const result = unwrapEither(sut) as DeleteAllArchivedThreadsOutput
    expect(result.deletedThreadsAmount).toBe(1)
  })

  it('should not be able to delete threads from non-existing user', async () => {
    const sut = await deleteAllArchivedThreads({
      userId: 'non-existing-user-id',
    })

    expect(isLeft(sut)).toBe(true)
    expect(unwrapEither(sut)).toBeInstanceOf(ResourceNotFound)
  })
})
