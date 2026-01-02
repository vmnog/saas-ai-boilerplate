import { generateUniqueId } from "@/core/unique-id";
import { jsonb, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { threads } from "./threads";

export const messageRole = pgEnum("message_role", ["user", "assistant"]);

export const messages = pgTable("messages", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => generateUniqueId("message")),
  openaiMessageId: text("openai_message_id").notNull().unique(),
  text: text("text").notNull(),
  role: messageRole("role").notNull(),
  openaiThreadId: text("openai_thread_id")
    .references(() => threads.openaiThreadId, {
      onUpdate: "cascade",
    })
    .notNull(),
  usage: jsonb("usage").$type<{
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  }>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
