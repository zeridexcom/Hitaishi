import { pgTable, uuid, varchar, jsonb, timestamp } from "drizzle-orm/pg-core";
import { users } from "./identity";

const ts = () => ({
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const feedbackTemplates = pgTable("feedback_templates", {
  id: uuid("id").primaryKey().defaultRandom(),
  mentorId: uuid("mentor_id")
    .references(() => users.id)
    .notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  questions: jsonb("questions").notNull(),
  ...ts(),
});
