import { useLoaderData, Link } from 'react-router';
import type { postLoader } from './post.loader';
import { formatLongDate } from '../../lib/formatDate';
import { TagList } from '../../components/ui/TagList';
import { Markdown } from '../../components/ui/Markdown';

import styles from './BlogPostPage.module.css';




export function BlogPostPage() {
    const post = useLoaderData<typeof postLoader>();

    return (
        <article className={styles.page}>
            <title>{`${post.title} | Willy Saronamihardja`}</title>
            <meta name="description" content={post.summary} />

            <Link to="/blog" className={styles.back}>
                <span aria-hidden="true">◀ </span>
                All posts
            </Link>

             <header className={styles.header}>
                <p className={styles.date}>
                    <time dateTime={post.publishedAt}>{formatLongDate(post.publishedAt)}</time>
                </p>
                <h1 className={styles.title}>{post.title}</h1>
                <p className={styles.summary}>{post.summary}</p>
                <div className={styles.tags}>
                    <TagList tags={post.tags} label="Topics" />
                </div>
            </header>

            <div className={styles.body}>
                <Markdown>{post.body}</Markdown>
            </div>
        </article>
    )
}