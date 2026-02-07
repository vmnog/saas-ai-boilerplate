import { z } from 'zod'

const envSchema = z.object({
  PORT: z.coerce.number().default(8080),
  NODE_ENV: z.enum(['development', 'test', 'production']),
  DATABASE_URL: z.string().url(),
  WEB_URL: z.string().url(),

  MAIL_DEFAULT_FROM_NAME: z.string().min(1),
  MAIL_DEFAULT_FROM_EMAIL: z.string().email(),
  EMAIL_LOGO_URL: z.string().url().optional(),
  EMAIL_LOGO_SQUARE_URL: z.string().url().optional(),
  MAIL_SMTP_HOST: z.string().min(1),
  MAIL_SMTP_PORT: z.coerce.number(),
  MAIL_SMTP_USER: z.string().min(1),
  MAIL_SMTP_PASS: z.string().min(1),

  OPENAI_API_KEY: z.string().min(1),
  OPENAI_ASSISTANT_ID: z.string().min(1),

  USER_JWT_SECRET: z.string().min(1),

  STRIPE_SECRET_KEY: z.string().min(1),
  STRIPE_SECRET_KEY_LIVE: z.string().min(1),
  STRIPE_PUBLISHABLE_KEY: z.string().min(1),
  STRIPE_WEBHOOK_SECRET: z.string().min(1),

  UPSTASH_VECTOR_REST_TOKEN: z.string().min(1),
  UPSTASH_VECTOR_REST_URL: z.string().url().min(1),
})

export const env = envSchema.parse(process.env)
