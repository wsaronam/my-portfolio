import { useLoaderData } from "react-router";
import type { blogLoader } from "./blog.loader";
import { PageHeader } from "../../components/ui/PageHeader";
import { EmptyState } from "../../components/ui/EmptyState";
import { PostListItem } from "./PostListItem";
import { Pagination } from "../../components/ui/Pagination";

import styles from './BlogPage.module.css';




export function BlogPage() {
    const { items, page, totalPages } = useLoaderData<typeof blogLoader>();


    return (
        <>
            <PageHeader
                kicker='Field notes'
                title='Blog'
                lead='Write-ups, research notes, lessons learned, and other stuff.'
            />

            {items.length > 0 ? (
                <ol className={styles.list}>
                    {items.map((post) => (
                        <li key={post.slug}>
                            <PostListItem post={post} />
                        </li>
                    ))}
                </ol>
            ) : (
                <EmptyState>{page > 1 ? 'There are no posts on this page.' : 'No posts yet.  Please check back later!'}</EmptyState>
            )}

            <Pagination page={page} totalPages={totalPages} />
        </>
    )
}
