import { generateUniqueId } from "@/core/unique-id";
import { timestamp } from "drizzle-orm/pg-core";
import { text } from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";
import { users } from "./users";

export const threads = pgTable("threads", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => generateUniqueId("thread")),
  title: text("title"),
  openaiThreadId: text("openai_thread_id").unique().notNull(),
  userId: text("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  archivedAt: timestamp("archived_at"),
  deletedAt: timestamp("deleted_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
