import { isLeft, isRight, unwrapEither } from '@/core/either'
import { db } from '@/db'
import { schema } from '@/db/schema'
import { makeThread } from '@/test/factories/make-thread'
import { makeUser } from '@/test/factories/make-user'
import { eq } from 'drizzle-orm'
import { describe, expect, it } from 'vitest'
import { NotAuthorized } from '../errors/not-authorized'
import { ResourceNotFound } from '../errors/resource-not-found'
import { updateThread } from './update-thread'

describe('update thread', () => {
  it('should be able to update a thread title', async () => {
    const user = await makeUser()
    const thread = await makeThread({ userId: user.id })

    const sut = await updateThread({
      openaiThreadId: thread.openaiThreadId,
      userId: user.id,
      title: 'New thread title',
    })

    expect(isRight(sut)).toBe(true)

    const [updatedThread] = await db
      .select()
      .from(schema.threads)
      .where(eq(schema.threads.id, thread.id))

    expect(updatedThread.title).toEqual('New thread title')
  })

  it('should be able to archive a thread', async () => {
    const user = await makeUser()
    const thread = await makeThread({ userId: user.id })

    const sut = await updateThread({
      openaiThreadId: thread.openaiThreadId,
      userId: user.id,
      archive: true,
    })

    expect(isRight(sut)).toBe(true)

    const [updatedThread] = await db
      .select()
      .from(schema.threads)
      .where(eq(schema.threads.id, thread.id))

    expect(updatedThread.archivedAt).toBeInstanceOf(Date)
  })

  it('should not be able to update a non-existing thread', async () => {
    const user = await makeUser()

    const sut = await updateThread({
      openaiThreadId: 'non-existing-thread-id',
      userId: user.id,
      title: 'New thread title',
    })

    expect(isLeft(sut)).toBe(true)
    expect(unwrapEither(sut)).toBeInstanceOf(ResourceNotFound)
  })

  it('should not be able to update a thread from another user', async () => {
    const owner = await makeUser()
    const thread = await makeThread({ userId: owner.id })

    const anotherUser = await makeUser()

    const sut = await updateThread({
      openaiThreadId: thread.openaiThreadId,
      userId: anotherUser.id,
      title: 'New thread title',
    })

    expect(isLeft(sut)).toBe(true)
    expect(unwrapEither(sut)).toBeInstanceOf(NotAuthorized)
  })
})
