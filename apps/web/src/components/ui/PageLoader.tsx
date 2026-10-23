import styles from './PageLoader.module.css';




/** shown on the very first page load while a page's data is being fetched */
export function PageLoader() {
    return (
        <output className={styles.loader}>
            <span className={styles.text}>Loading…</span>
        </output>
    )
}