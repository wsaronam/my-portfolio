import { TagList } from "../../components/ui/TagList";
import { getDateParts } from "../../lib/formatDate"
import type { Post } from "./types"

import styles from './PostListItem.module.css';




type PostListItemProps = {
    post: Post
}


export function PostListItem({ post }: PostListItemProps) {
    const {day, month, year} = getDateParts(post.date);

    return (
        <article className={styles.item}>
            <time className={styles.date} dateTime={post.date}>
                <span className={styles.day}>{day}</span>
                <span className={styles.monthYear}>{month} {year}</span>
            </time>

            <div>
                {post.draft && <p className={styles.draft}>Draft</p>}
                <h2 className={styles.title}>{post.title}</h2>
                <p className={styles.summary}>{post.summary}</p>
                <TagList tags={post.tags} label='Topics' />
            </div>
        </article>
    )
}