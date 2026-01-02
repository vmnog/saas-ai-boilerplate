import { z } from 'zod'

const envSchema = z.object({
  NEXT_PUBLIC_VERCEL_ENV: z
    .enum(['development', 'production'])
    .default('development'),
  NEXT_PUBLIC_API_URL: z.string().url(),
})

export const env = envSchema.parse({
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
})
