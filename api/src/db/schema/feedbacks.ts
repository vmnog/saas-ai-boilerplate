import { generateUniqueId } from "@/core/unique-id";
import { integer, text, timestamp } from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";
import { users } from "./users";

export const feedbacks = pgTable("feedbacks", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => generateUniqueId("feedbacks")),
  userId: text("user_id")
    .references(() => users.id)
    .notNull(),
  content: text("content").notNull(),
  rating: integer("rating").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
