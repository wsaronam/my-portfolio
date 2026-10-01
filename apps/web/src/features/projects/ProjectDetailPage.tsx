import { ExternalLink } from "../../components/ui/ExternalLink";
import { NotFoundPage } from "../../pages/NotFoundPage";
import { getProjectBySlug } from "./projects.data";

import { useParams, Link } from "react-router";




export function ProjectDetailPage() {
    const { slug } = useParams();
    const project = slug ? getProjectBySlug(slug) : undefined;

    if (!project) {
        return <NotFoundPage />
    }


    return (
        <article>
            <p>
                <Link to='/projects'>All Projects</Link>
            </p>
            <h1>{project.title}</h1>
            <p>{project.summary}</p>

            <ul>
                {project.tags.map((tag) => (
                    <li key={tag}>{tag}</li>
                ))}
            </ul>

            <ul>
                <li>
                    <ExternalLink href={project.repoUrl}>Source code on GitHub</ExternalLink>
                </li>
                {project.liveUrl && (
                    <li>
                        <ExternalLink href={project.liveUrl}>Live Demo</ExternalLink>
                    </li>
                )}
            </ul>
        </article>
    )
}