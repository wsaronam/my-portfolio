import { type PostRow, posts } from "../../db/schema.js";
import type { AdminPost, PostInput } from "./adminPosts.schemas.js";
import type { Database } from "../../db/client.js";
import { desc, eq } from "drizzle-orm";




/** the admin list is small; this cap keeps a single response from growing without limit */
const MAX_ADMIN_LIST = 200;


function toAdminPost(row: PostRow): AdminPost {
    return {
        id: row.id,
        slug: row.slug,
        title: row.title,
        summary: row.summary,
        body: row.body,
        tags: row.tags,
        publishedAt: row.publishedAt?.toISOString() ?? null,
        createdAt: row.createdAt.toISOString(),
        updatedAt: row.updatedAt.toISOString(),
    };
}


function toColumns(input: PostInput) {
    return {
        slug: input.slug,
        title: input.title,
        summary: input.summary,
        body: input.body,
        tags: input.tags,
        publishedAt: input.publishedAt ? new Date(input.publishedAt) : null,
    };
}



export function createAdminPostsRepository(db: Database) {
    return {
        async listAll() {
            const rows = await db
                .select({
                    id: posts.id,
                    slug: posts.slug,
                    title: posts.title,
                    tags: posts.tags,
                    publishedAt: posts.publishedAt,
                    createdAt: posts.createdAt,
                    updatedAt: posts.updatedAt,
                })
                .from(posts)
                .orderBy(desc(posts.updatedAt))
                .limit(MAX_ADMIN_LIST)

            return rows.map((row) => ({
                ...row,
                publishedAt: row.publishedAt?.toISOString() ?? null,
                createdAt: row.createdAt.toISOString(),
                updatedAt: row.updatedAt.toISOString(),
            }));
        },

        async findById(id: string): Promise<AdminPost | null> {
            const rows = await db.select().from(posts).where(eq(posts.id, id)).limit(1);
            return rows[0] ? toAdminPost(rows[0]) : null;
        },

        async create(input: PostInput): Promise<AdminPost> {
            const [row] = await db.insert(posts).values(toColumns(input)).returning();
            if (!row) throw new Error('Insert returned no row');
            return toAdminPost(row);
        },

        async update(id: string, input: PostInput): Promise<AdminPost | null> {
            const [row] = await db.update(posts).set(toColumns(input)).where(eq(posts.id, id)).returning();
            return row ? toAdminPost(row) : null;
        },

        async remove(id: string): Promise<boolean> {
            const deleted = await db.delete(posts).where(eq(posts.id, id)).returning({ id: posts.id });
            return deleted.length > 0;
        },
    }
}