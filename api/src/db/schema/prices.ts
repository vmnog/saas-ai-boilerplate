import { generateUniqueId } from "@/core/unique-id";
import { boolean, integer, text } from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";

export const prices = pgTable("prices", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => generateUniqueId("price")),
  stripePriceId: text("stripe_price_id").unique().notNull(),
  stripeProductId: text("stripe_product_id").notNull(),
  active: boolean("active").notNull(),
  currency: text("currency").notNull(),
  type: text("type").notNull(),
  unitAmount: integer("unit_amount"),
  interval: text("interval"),
  intervalCount: integer("interval_count"),
  trialPeriodDays: integer("trial_period_days"),
});
