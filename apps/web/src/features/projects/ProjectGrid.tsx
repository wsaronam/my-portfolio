import type { Project } from "./types";
import { ProjectCard } from "./ProjectCard";

import styles from './ProjectGrid.module.css';




type ProjectGridProps = {
    projects: Project[];
}


export function ProjectGrid({ projects }: ProjectGridProps) {
    return (
        <div className={styles.grid}>
            {projects.map((project) => (
                <ProjectCard key={project.slug} project={project} />
            ))}
        </div>
    )
}