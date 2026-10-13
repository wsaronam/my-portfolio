import { Link, useLocation } from 'react-router';

import styles from './NotFoundPage.module.css';




const MAX_PATH_LENGTH = 60;


export function NotFoundPage() {
    const { pathname } = useLocation();
    const shownPath = 
        pathname.length > MAX_PATH_LENGTH ? `${pathname.slice(0, MAX_PATH_LENGTH)}...` : pathname;

    return (
        <section className={styles.screen} aria-labelledby='not-found-heading'>
            <title>Page not found | Willy Saronamihardja</title>
            <meta name='robots' content='noindex' />

            <p className={styles.code} aria-hidden='true'>
                404
            </p>
            <h1 id='not-found-heading' className={styles.heading}>
                <span className={styles.headingText}>Game Over</span>
                <span className='visually-hidden'>: page not found</span>
            </h1>
            <p className={styles.message}>
                There's nothing at <code className={styles.path}>{shownPath}</code>. The page may have
                moved, or the link may be broken.
            </p>

            <nav aria-labelledby='continue-heading'>
                <h2 id='continue-heading' className={styles.prompt}>
                    Continue?
                </h2>
                <ul className={styles.menu}>
                    <li>
                        <Link to='/' className={styles.option}>
                            Return Home
                        </Link>
                    </li>
                    <li>
                        <Link to='/projects' className={styles.option}>
                            View Projects
                        </Link>
                    </li>
                    <li>
                        <Link to='/blog' className={styles.option}>
                            Read the Blog
                        </Link>
                    </li>
                </ul>
            </nav>
        </section>
    )
}