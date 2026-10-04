import { ExternalLink } from "../../components/ui/ExternalLink";
import { NotFoundPage } from "../../pages/NotFoundPage";
import { getProjectBySlug } from "./projects.data";
import { TagList } from "../../components/ui/TagList";

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

            <TagList tags={project.tags} label='Technologies' />

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