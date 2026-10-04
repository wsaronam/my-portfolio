import styles from './SiteFooter.module.css';




export function SiteFooter() {
    const year = new Date().getFullYear();

    return (
        <footer className={styles.footer}>
            <div className={`container ${styles.inner}`}>
                <p>© {year} Willy Saronamihardja - Thank you for visiting!</p>
            </div>
        </footer>
    )
}