import { Link, NavLink } from "react-router"

import styles from './SiteHeader.module.css';




export function SiteHeader() {
    return (
        <header className={styles.header}>
            <div className={`container ${styles.inner}`}>
                <Link to='/' className={styles.brand}>
                    <span className={styles.brandAccent}>Willy Saronamihardja</span>
                </Link>
                <nav aria-label='Main'>
                    <ul className={styles.nav}>
                        <li><NavLink to="/" end className={styles.link}>
                            Home
                        </NavLink></li>
                        <li><NavLink to="/projects" className={styles.link}>
                            Projects
                        </NavLink></li>
                        <li><NavLink to="/blog" className={styles.link}>
                            Blog
                        </NavLink></li>
                    </ul>
                </nav>
            </div>
        </header>
    )
}