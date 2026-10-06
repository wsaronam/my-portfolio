import type { Project, ProjectCategory } from "./types";
import { TagList } from "../../components/ui/TagList";
import { Link } from "react-router";

import styles from './ProjectCard.module.css';




const CATEGORY_LABELS: Record<ProjectCategory, string> = {
    security: 'Security',
    software: 'Software'
}


type ProjectCardProps = {
    project: Project
}


export function ProjectCard({ project }: ProjectCardProps) {
    return (
        <article className={styles.card}>
            <p className={styles.category} data-category={project.category}>
                {CATEGORY_LABELS[project.category]}
            </p>
            <h3 className={styles.title}>
                <Link to={`/projects/${project.slug}`} className={styles.link}>
                    {project.title}
                </Link>
            </h3>
            <p className={styles.summary}>{project.summary}</p>
            <TagList tags={project.tags} label='Technologies' />
        </article>
    )
}