import { generateUniqueId } from '@/core/unique-id'
import { text, timestamp } from 'drizzle-orm/pg-core'
import { pgTable } from 'drizzle-orm/pg-core'
import { messages } from './messages'
import { uploads } from './uploads'

export const attachments = pgTable('attachments', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => generateUniqueId('attachment')),
  messageId: text('message_id')
    .references(() => messages.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    }),
  uploadId: text('upload_id')
    .references(() => uploads.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})
