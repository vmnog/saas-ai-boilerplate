import { generateUniqueId } from "@/core/unique-id";
import { boolean, integer, jsonb, text, timestamp } from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";
import { prices } from "./prices";
import { users } from "./users";

export const newSubscriptions = pgTable("new_subscriptions", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => generateUniqueId("newSubscription")),
  userId: text("user_id").references(() => users.id, {
    onDelete: "cascade",
    onUpdate: "cascade",
  }),
  priceId: text("price_id").references(() => prices.id, {
    onDelete: "cascade",
    onUpdate: "cascade",
  }),
  stripeSubscriptionId: text("stripe_subscription_id"),
  metadata: jsonb("metadata"),
  status: text("status"),
  quantity: integer("quantity"),
  cancelAtPeriodEnd: boolean("cancel_at_period_end"),
  cancelAt: timestamp("cancel_at"),
  canceledAt: timestamp("canceled_at"),
  currentPeriodStart: timestamp("current_period_start"),
  currentPeriodEnd: timestamp("current_period_end"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

