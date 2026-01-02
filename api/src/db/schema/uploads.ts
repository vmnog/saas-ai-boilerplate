import { generateUniqueId } from '@/core/unique-id'
import { integer, text, timestamp } from 'drizzle-orm/pg-core'
import { pgTable } from 'drizzle-orm/pg-core'

export const uploads = pgTable('uploads', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => generateUniqueId('upload')),
  userId: text('user_id').notNull(),
  storage: text('storage').notNull(),
  fileId: text('file_id').notNull(),
  bytes: integer('bytes').notNull(),
  filename: text('filename').notNull(),
  mimetype: text('mimetype').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})
