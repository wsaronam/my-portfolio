import { sql } from 'drizzle-orm';
import { pgTable, uuid, text, timestamp, check, index } from 'drizzle-orm/pg-core';




export const posts = pgTable(
    'posts',
    {
        id: uuid('id').primaryKey().defaultRandom(),
        slug: text('slug').notNull().unique(),
        title: text('title').notNull(),
        summary: text('summary').notNull(),
        body: text('body').notNull(),
        tags: text('tags').array().notNull().default(sql`'{}'::text[]`),
        publishedAt: timestamp('published_at', { withTimezone: true }),
        createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
        updatedAt: timestamp('updated_at', { withTimezone: true })
            .notNull()
            .defaultNow()
            .$onUpdate(() => new Date()),
    },
    (table) => [
        check('posts_slug_format', sql`${table.slug} ~ '^[a-z0-9]+(-[a-z0-9]+)*$'`),
        index('posts_published_at_idx').on(table.publishedAt),
    ],
)


export type PostRow = typeof posts.$inferSelect;
export type NewPostRow = typeof posts.$inferInsert;