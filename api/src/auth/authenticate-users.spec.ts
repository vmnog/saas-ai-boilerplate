import { decodeJwt } from 'jose'
import { describe, expect, test } from 'vitest'
import { authenticateUsers } from './authenticate-users'

describe('authenticate users', () => {
  test('generate jwt for user', async () => {
    const sut = await authenticateUsers({
      userId: 'test-id',
    })

    expect(sut.token).toEqual(expect.any(String))
    expect(decodeJwt(sut.token).sub).toEqual('test-id')
  })
})
