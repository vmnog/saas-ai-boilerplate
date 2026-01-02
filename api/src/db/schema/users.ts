import { generateUniqueId } from "@/core/unique-id";
import { text } from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => generateUniqueId("user")),
  name: text("name").notNull(),
  email: text("email").unique().notNull(),
  avatarUrl: text("avatar_url"),
});
