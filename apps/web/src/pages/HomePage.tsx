import { ProjectGrid } from "../features/projects/ProjectGrid";
import { getFeaturedProjects } from '../features/projects/projects.data';

import styles from './HomePage.module.css';




export function HomePage() {
    const featured = getFeaturedProjects();


    return (
        <>
            <section className={styles.hero}>
                <h1>Hello, I'm Will!</h1>
                <p className={styles.tagline}>
                    Software Engineer | Cybersecurity & IT | AI-Assisted Workflows
                </p>
            </section>
            
            <section aria-labelledby='featured-heading'>
                <h2 id='featured-heading'>Featured Projects</h2>
                <ProjectGrid projects={featured} />
            </section>
        </>
    )
}