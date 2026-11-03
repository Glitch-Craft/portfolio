import { CONTACT_FIELD_LIMITS, type BudgetRange } from '@glitch-craft/contracts';
import { index, pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';

/** Project intake briefs submitted through the website contact form. */
export const contactSubmissions = pgTable(
  'contact_submissions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: varchar('name', { length: CONTACT_FIELD_LIMITS.name }).notNull(),
    email: varchar('email', { length: CONTACT_FIELD_LIMITS.email }).notNull(),
    brief: text('brief').notNull(),
    budget: varchar('budget', { length: 32 }).$type<BudgetRange>().notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index('contact_submissions_created_at_idx').on(table.createdAt)],
);

export type ContactSubmissionRecord = typeof contactSubmissions.$inferSelect;
export type NewContactSubmissionRecord = typeof contactSubmissions.$inferInsert;
