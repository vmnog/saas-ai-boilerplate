import { type Either, makeLeft, makeRight } from '@/core/either'
import { db } from '@/db'
import { schema } from '@/db/schema'
import dayjs from 'dayjs'
import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { ExpiredAuthenticationCode } from '../errors/expired-authentication-code'
import { ResourceNotFound } from '../errors/resource-not-found'
import { authenticateUsers } from '@/auth/authenticate-users'

const authenticateFromCodeInput = z.object({
  code: z.string(),
})

const authenticateFromCodeOutput = z.object({
  token: z.string(),
})

type AuthenticateFromCodeInput = z.infer<typeof authenticateFromCodeInput>
type AuthenticateFromCodeOutput = z.infer<typeof authenticateFromCodeOutput>

export async function authenticateFromCode(
  input: AuthenticateFromCodeInput
): Promise<
  Either<
    ResourceNotFound | ExpiredAuthenticationCode,
    AuthenticateFromCodeOutput
  >
> {
  const { code } = authenticateFromCodeInput.parse(input)

  const authCodes = await db
    .select()
    .from(schema.authCodes)
    .where(eq(schema.authCodes.code, code))

  if (authCodes.length === 0) {
    return makeLeft(
      new ResourceNotFound('Código de autenticação não encontrado.')
    )
  }

  const authCode = authCodes[0]

  const daysSinceAuthCodeWasCreated = dayjs(new Date()).diff(
    authCode.createdAt,
    'days',
    true
  )

  if (daysSinceAuthCodeWasCreated > 1) {
    return makeLeft(new ExpiredAuthenticationCode())
  }

  const { token } = await authenticateUsers({
    userId: authCode.userId,
  })

  return makeRight({ token })
}
