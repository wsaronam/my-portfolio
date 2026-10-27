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


export const users = pgTable(
    'users',
    {
        id: uuid('id').primaryKey().defaultRandom(),
        email: text('email').notNull().unique(),
        passwordHash: text('password_hash').notNull(),
        createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow()
    },
    (table) => [check('users_email_lowercase', sql`${table.email} = lower(${table.email})`)],
)


export const sessions = pgTable(
    'sessions',
    {
        // a SHA-256 hash of the session token. the token itself is never stored
        id: text('id').primaryKey(),
        userId: uuid('user_id')
        .notNull()
        .references(() => users.id, { onDelete: 'cascade' }),
        expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
        createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    },
    (table) => [
        index('sessions_user_id_idx').on(table.userId),
        index('sessions_expires_at_idx').on(table.expiresAt),
    ],
)


export type PostRow = typeof posts.$inferSelect;
export type NewPostRow = typeof posts.$inferInsert;