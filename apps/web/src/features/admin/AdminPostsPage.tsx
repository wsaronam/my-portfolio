import { useLoaderData, Link, useFetcher } from 'react-router';
import { adminPostsLoader } from './adminPosts.route';
import { EmptyState } from '../../components/ui/EmptyState';
import type { AdminPostListItem } from './adminPosts.schemas';
import { getPostStatus, POST_STATUS_LABELS } from './postStatus';
import { formatLongDate } from '../../lib/formatDate';

import styles from './AdminPostsPage.module.css';




export function AdminPostsPage() {
    const { items } = useLoaderData<typeof adminPostsLoader>();


    return (
        <>
            <title>Posts | Admin</title>
            <header className={styles.header}>
                <h1 className={styles.title}>Posts</h1>
                <p className={styles.count}>
                    {items.length} {items.length === 1 ? 'post' : 'posts'}
                </p>
            </header>

            {items.length === 0 ? (
                <EmptyState>No posts yet.</EmptyState>
            ) : (
                <div className={styles.panel}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th scope="col">Title</th>
                                <th scope="col">Status</th>
                                <th scope="col">Last updated</th>
                                <th scope="col">
                                    <span className="visually-hidden">Actions</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((post) => (
                                <PostRow key={post.id} post={post} />
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </>
    )
}




function PostRow({ post }: { post: AdminPostListItem }) {
    const status = getPostStatus(post.publishedAt);

    return (
        <tr>
            <td>
                <span className={styles.postTitle}>{post.title}</span>
                <span className={styles.slug}>/{post.slug}</span>
            </td>
            <td>
                <span className={styles.status} data-status={status}>
                    {POST_STATUS_LABELS[status]}
                </span>
            </td>
            <td>
                <time dateTime={post.updatedAt}>{formatLongDate(post.updatedAt)}</time>
            </td>
            <td>
                <div className={styles.actions}>
                    {status === 'published' && (
                        <Link to={`/blog/${post.slug}`} className={styles.action}>
                            View
                        </Link>
                    )}
                    <DeletePostButton id={post.id} title={post.title} />
                </div>
            </td>
        </tr>
    )
}


function DeletePostButton({ id, title }: { id: string; title: string }) {
    const fetcher = useFetcher();
    const isDeleting = fetcher.state !== 'idle';

    return (
        <fetcher.Form
            method="post"
            onSubmit={(event) => {
                if (!window.confirm(`Delete "${title}"? This can't be undone.`)) {
                    event.preventDefault();
                }
            }}
        >
            <input type="hidden" name="intent" value="delete" />
            <input type="hidden" name="id" value={id} />
            <button type="submit" className={styles.delete} disabled={isDeleting}>
                {isDeleting ? 'Deleting…' : 'Delete'}
            </button>
        </fetcher.Form>
    )
}