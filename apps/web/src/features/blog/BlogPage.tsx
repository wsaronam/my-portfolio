import { getAllPosts } from "./posts.data"
import { PageHeader } from "../../components/ui/PageHeader";
import { EmptyState } from "../../components/ui/EmptyState";
import { PostListItem } from "./PostListItem";

import styles from './BlogPage.module.css';




export function BlogPage() {
    const posts = getAllPosts()


    return (
        <>
            <PageHeader
                kicker='Field notes'
                title='Blog'
                lead='Write-ups, research notes, lessons learned, and other stuff.'
            />

            {posts.length > 0 ? (
                <ol className={styles.list}>
                    {posts.map((post) => (
                        <li key={post.slug}>
                            <PostListItem post={post} />
                        </li>
                    ))}
                </ol>
            ) : (
                <EmptyState>No posts yet.  Please check back later!</EmptyState>
            )}
        </>
    )
}
