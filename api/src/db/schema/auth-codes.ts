import crypto from 'node:crypto'
import { text, timestamp } from 'drizzle-orm/pg-core'
import { pgTable } from 'drizzle-orm/pg-core'
import { users } from './users'

function generateRandomString(length: number) {
  return crypto
    .randomBytes(Math.ceil((length * 3) / 4))
    .toString('base64')
    .slice(0, length)
    .replace(/\+/g, '0')
    .replace(/\//g, '0')
}

export const authCodes = pgTable('auth_codes', {
  code: text('code')
    .primaryKey()
    .$defaultFn(() => generateRandomString(24)),
  userId: text('user_id')
    .references(() => users.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})
