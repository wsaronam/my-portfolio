import type { Project } from "./types";
import { Link } from "react-router";




type ProjectCardProps = {
    project: Project
}


export function ProjectCard({ project }: ProjectCardProps) {
    return (
        <article>
            <h3>
                <Link to={``}>{project.title}</Link>
            </h3>
            <p>{project.summary}</p>
            <ul aria-label='Technologies'>
                {project.tags.map((tag) => (
                    <li key={tag}>{tag}</li>
                ))}
            </ul>
        </article>
    )
}