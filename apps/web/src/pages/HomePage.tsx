import { ProjectGrid } from "../features/projects/ProjectGrid";
import { getFeaturedProjects } from '../features/projects/projects.data';
import { SectionTitle } from "../components/ui/SectionTitle";

import { Link } from "react-router";

import styles from './HomePage.module.css';




export function HomePage() {
    const featured = getFeaturedProjects();


    return (
        <>
            <section className={styles.hero} aria-labelledby='hero-heading'>
                <p className={styles.badge}>Player 1</p>
                <h1 id='hero-heading'>Hello, I'm Will!</h1>
                <p className={styles.tagline}>
                    Software Engineer | Controls Engineer | Cybersecurity & IT | AI-Assisted Workflows
                </p>

                <Link to='/projects' className={styles.start}>
                    Press Start
                    <span className='visually-hidden'>and view my projects</span>
                </Link>
            </section>
            
            <section aria-labelledby='featured-heading'>
                <SectionTitle id='featured-heading'>Featured Projects</SectionTitle>
                <ProjectGrid projects={featured} />
            </section>
        </>
    )
}