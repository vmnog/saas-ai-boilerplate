import { generateUniqueId } from '@/core/unique-id'
import { text, timestamp } from 'drizzle-orm/pg-core'
import { pgTable } from 'drizzle-orm/pg-core'
import { users } from './users'

export const customers = pgTable('customers', {
  id: text('id')
    .$defaultFn(() => generateUniqueId('customer')),
  userId: text('user_id')
    .references(() => users.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    })
    .notNull(),
  stripeCustomerId: text('stripe_customer_id').unique().notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})
