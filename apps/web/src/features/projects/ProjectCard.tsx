type ProjectCardProps = {
    title: string
    summary: string
    tags: string[]
}


export function ProjectCard({ title, summary, tags }: ProjectCardProps) {
    return (
        <article>
            <h3>{title}</h3>
            <p>{summary}</p>
            <ul>
                {tags.map((tag) => (
                    <li key={tag}>{tag}</li>
                ))}
            </ul>
        </article>
    )
}