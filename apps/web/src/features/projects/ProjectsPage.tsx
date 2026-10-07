import { getAllProjects } from "./projects.data"
import { ProjectGrid } from "./ProjectGrid";

import styles from './ProjectsPage.module.css';
import { CategoryFilter } from "./CategoryFilter";




export function ProjectsPage() {
    const projects = getAllProjects();


    return (
        <>
            <header className={styles.header}>
                <p className={styles.kicker}>Quest Log</p>
                <h1>Projects</h1>
                <p className={styles.lead}>Things I've built and/or broken</p>
            </header>

            
            <ProjectGrid projects={projects} />
        </>
    )
}