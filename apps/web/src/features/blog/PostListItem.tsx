import { TagList } from "../../components/ui/TagList";
import { getDateParts } from "../../lib/formatDate"
import type { Post } from "./types"




type PostListItemProps = {
    post: Post
}


export function PostListItem({ post }: PostListItemProps) {
    const {day, month, year} = getDateParts(post.date);

    return (
        <article>
            <time>
                <span>{day}</span>
                <span>{month} {year}</span>
            </time>

            <div>
                {post.draft && <p>Draft</p>}
                <h2>{post.title}</h2>
                <p>{post.summary}</p>
                <TagList tags={post.tags} label='Topics' />
            </div>
        </article>
    )
}