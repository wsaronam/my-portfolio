import { Link } from 'react-router';


import styles from './AdminLayout.module.css';




export function AdminLayout() {
    return (
        <div className={styles.shell}>
            <meta name="robots" content="noindex" />

            <header className={styles.bar}>
                <div className={`container ${styles.inner}`}>
                    <Link to="/admin" className={styles.brand}>
                        Admin <span className={styles.brandAccent}>panel</span>
                    </Link>

                    
                </div>
            </header>
        </div>
    )
}