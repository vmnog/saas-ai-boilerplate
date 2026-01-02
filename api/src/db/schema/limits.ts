import { generateUniqueId } from '@/core/unique-id'
import { integer, text, timestamp } from 'drizzle-orm/pg-core'
import { pgTable } from 'drizzle-orm/pg-core'
import { users } from './users'

export const limits = pgTable('limits', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => generateUniqueId('limit')),
  userId: text('user_id')
    .references(() => users.id)
    .notNull(),
  sendMessageLimit: integer('send_message_limit').notNull(),
  sendMessageUsed: integer('send_message_used').default(0).notNull(),
  sendMessageLimitResetAt: timestamp('send_message_limit_reset_at'),
})