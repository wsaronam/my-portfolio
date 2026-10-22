import { Link } from 'react-router';

import styles from './Pagination.module.css';




type PaginationProps = {
    page: number
    totalPages: number
}


export function Pagination({ page, totalPages }: PaginationProps) {
    if (totalPages <= 1) {
        return null;
    }

    return (
        <nav className={styles.pagination} aria-label="Pages">
            {page > 1 ? (
                <Link to={`?page=${page - 1}`} className={styles.link} rel="prev">
                    <span aria-hidden="true">◀ </span>Newer
                </Link>
            ) : (
                <span />
            )}
            <p className={styles.status}>
                Page {page} of {totalPages}
            </p>
            {page < totalPages ? (
                <Link to={`?page=${page + 1}`} className={styles.link} rel="next">
                    Older<span aria-hidden="true"> ▶</span>
                </Link>
            ) : (
                <span />
            )}
        </nav>
    )
}