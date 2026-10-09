import { ExternalLink } from "../../components/ui/ExternalLink";
import { NotFoundPage } from "../../pages/NotFoundPage";
import { getAdjacentProjects, getProjectBySlug } from "./projects.data";
import { TagList } from "../../components/ui/TagList";

import { useParams, Link } from "react-router";

import styles from './ProjectDetailPage.module.css';
import { CATEGORY_LABELS } from "./categories";
import { formatMonthYear } from "../../lib/formatDate";




export function ProjectDetailPage() {
    const { slug } = useParams();
    const project = slug ? getProjectBySlug(slug) : undefined;

    if (!project) {
        return <NotFoundPage />
    }

    const { previous, next } = getAdjacentProjects(project.slug);


    return (
        <article className={styles.page}>
            <title>{`${project.title} | Willy Saronamihardja`}</title>

            <Link to='/projects' className={styles.back}>
                <span aria-hidden='true'>◀ </span>
                All Projects
            </Link>

            <header className={styles.hero}>
                <p className={styles.badge}>{CATEGORY_LABELS[project.category]}</p>
                <h1 className={styles.title}>{project.title}</h1>
                <p className={styles.summary}>{project.summary}</p>
            </header>

            <section className={styles.status} aria-labelledby='status-heading'>
                <h2 id='status-heading' className={styles.statusHeading}>
                    Status
                </h2>
                <dl className={styles.stats}>
                    <div className={styles.stat}>
                        <dt>Class</dt>
                        <dd>{CATEGORY_LABELS[project.category]}</dd>
                    </div>
                    <div className={styles.stat}>
                        <dt>Started</dt>
                        <dd>
                            <time dateTime={project.date}>{formatMonthYear(project.date)}</time>
                        </dd>
                    </div>
                    <div className={styles.stat}>
                        <dt>Deployment</dt>
                        <dd>{project.liveUrl ? 'Live' : 'Source only'}</dd>
                    </div>
                </dl>
                <h3 className={styles.subheading}>Tech stack</h3>
                <TagList tags={project.tags} label='Technologies' />
            </section>
            
            <div className={styles.actions}>
                {project.liveUrl && (
                    <ExternalLink href={project.liveUrl} className={`${styles.button} ${styles.primary}`}>
                        Live demo
                    </ExternalLink>
                )}
                <ExternalLink href={project.repoUrl} className={styles.button}>
                    Source code
                </ExternalLink>
            </div>

            {(previous || next) && (
                <nav className={styles.pager} aria-label='More projects'>
                    {previous && (
                        <Link to={`/projects/${previous.slug}`} className={styles.pagerLink}>
                            <span className={styles.pagerLabel}>
                                <span aria-hidden='true'>◀ </span>
                                Previous
                            </span>
                            <span className={styles.pagerTitle}>{previous.title}</span>
                        </Link>
                    )}
                    {next && (
                        <Link to={`/projects/${next.slug}`} className={`${styles.pagerLink} ${styles.pagerNext}`}>
                            <span className={styles.pagerLabel}>
                                <span aria-hidden='true'>▶ </span>
                                Next
                            </span>
                            <span className={styles.pagerTitle}>{next.title}</span>
                        </Link>
                    )}
                </nav>
            )}
        </article>
    )
}