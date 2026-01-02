import { generateUniqueId } from "@/core/unique-id";
import { boolean, jsonb, text, timestamp } from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";

export const products = pgTable("products", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => generateUniqueId("product")),
  stripeProductId: text("stripe_product_id").unique().notNull(),
  active: boolean("active").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  image: text("image"),
  metadata: jsonb("metadata")
    .$type<{
      sendMessageLimit: number;
      benefits: string;
      shouldHighlight: boolean;
      off: number;
    }>()
    .notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
