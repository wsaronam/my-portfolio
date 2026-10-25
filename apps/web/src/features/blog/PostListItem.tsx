import { TagList } from "../../components/ui/TagList";
import { getDateParts } from "../../lib/formatDate"
import type { PostSummary } from "./posts.schemas";

import styles from './PostListItem.module.css';
import { Link } from "react-router";




type PostListItemProps = {
    post: PostSummary
}


export function PostListItem({ post }: PostListItemProps) {
    const { day, month, year } = getDateParts(post.publishedAt);

    return (
        <article className={styles.item}>
            <time className={styles.date} dateTime={post.publishedAt}>
                <span className={styles.day}>{day}</span>
                <span className={styles.monthYear}>{month} {year}</span>
            </time>

            <div>
                <h2 className={styles.title}>
                    <Link to={`/blog/${post.slug}`} className={styles.link}>
                        {post.title}
                    </Link>
                </h2>
                <p className={styles.summary}>{post.summary}</p>
                <TagList tags={post.tags} label='Topics' />
            </div>
        </article>
    )
}