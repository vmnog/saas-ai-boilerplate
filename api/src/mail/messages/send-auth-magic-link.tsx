import { env } from '@/env'
import { mail } from '@/mail'
import { render } from '@react-email/render'
import { z } from 'zod'
import { AuthMagicLinkMail } from '../templates/auth-magic-link'

const sendAuthMagicLinkInput = z.object({
  to: z.object({
    name: z.string().nullish(),
    email: z.string().email(),
  }),
  code: z.string(),
})

const sendAuthMagicLinkOutput = z.void()

type SendAuthMagicLinkInput = z.infer<typeof sendAuthMagicLinkInput>
type SendAuthMagicLinkOutput = z.infer<typeof sendAuthMagicLinkOutput>

export async function sendAuthMagicLink({
  to: { name, email },
  code,
}: SendAuthMagicLinkInput): Promise<SendAuthMagicLinkOutput> {
  const authUrl = new URL('/auth/authenticate', env.WEB_URL)

  authUrl.searchParams.set('code', code)

  if (env.NODE_ENV === 'development') {
    console.log(`✉️ Authenticate using: ${authUrl.toString()}`)
  }

  const html = render(<AuthMagicLinkMail authUrl={authUrl.toString()} />)

  await mail.sendMail({
    from: {
      name: env.MAIL_DEFAULT_FROM_NAME,
      address: env.MAIL_DEFAULT_FROM_EMAIL,
    },
    to: name ? { name, address: email } : email,
    subject: 'Seu link de acesso para ACME',
    html,
  })
}
