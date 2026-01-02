import { generateUniqueId } from "@/core/unique-id";
import { boolean, text, timestamp } from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";
import { users } from "./users";

export const terms = pgTable("terms", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => generateUniqueId("terms")),
  userId: text("user_id")
    .references(() => users.id)
    .notNull(),
  termsOfUse: boolean("terms-of-use"),
  privacyPolicy: boolean("privacy-policy"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
