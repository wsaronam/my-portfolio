import type { Project } from "./types";
import { CATEGORY_LABELS } from "./categories";
import { TagList } from "../../components/ui/TagList";
import { Link } from "react-router";

import styles from './ProjectCard.module.css';




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