import { and, isNotNull, lte, desc, count, eq } from "drizzle-orm";
import { posts } from "../../db/schema.js";
import type { Database } from "../../db/client.js";
import type { PostSummary, PostDetail } from "./posts.schemas.js";




/** post is public once it has a publish date that isn't in the future. */
function isPublished() {
    return and(isNotNull(posts.publishedAt), lte(posts.publishedAt, new Date()))
}

function toIsoString(date: Date | null): string {
    if (!date) {
        throw new Error('Published post is missing publishedAt');
    }
    return date.toISOString();
}

/** the columns visitors may see in a list. Never select everything with select(). */
const summaryColumns = {
    slug: posts.slug,
    title: posts.title,
    summary: posts.summary,
    tags: posts.tags,
    publishedAt: posts.publishedAt
}

export function createPostsRepository(db: Database) {
    return {
        async listPublished(options: { limit: number; offset: number }) {
            const [rows, countRows] = await Promise.all([
                db
                    .select(summaryColumns)
                    .from(posts)
                    .where(isPublished())
                    .orderBy(desc(posts.publishedAt))
                    .limit(options.limit)
                    .offset(options.offset),
                db.select({ total: count() }).from(posts).where(isPublished()),
            ]);

            const items: PostSummary[] = rows.map((row) => ({
                ...row,
                publishedAt: toIsoString(row.publishedAt),
            }));

            return { items, total: countRows[0]?.total ?? 0 };
        },


        async findPublishedBySlug(slug: string): Promise<PostDetail | null> {
            const rows = await db
                .select({ ...summaryColumns, body: posts.body })
                .from(posts)
                .where(and(eq(posts.slug, slug), isPublished()))
                .limit(1)

            const row = rows[0];
            if (!row) {
                return null;
            }

            return { ...row, publishedAt: toIsoString(row.publishedAt) };
        },
    }
}