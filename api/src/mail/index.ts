import { env } from '@/env'
import nodemailer from 'nodemailer'

export const mail = nodemailer.createTransport({
  host: env.MAIL_SMTP_HOST,
  port: env.MAIL_SMTP_PORT,
  auth: {
    user: env.MAIL_SMTP_USER,
    pass: env.MAIL_SMTP_PASS,
  },
})
