import { useRevalidator, useRouteError, isRouteErrorResponse , Link } from 'react-router';
import { ApiError } from '../lib/api';
import { NotFoundPage } from './NotFoundPage';

import styles from './RouteErrorPage.module.css';




/** shown when a page's loader fails, e.g. the API is down or returns 404. */
export function RouteErrorPage() {
    const error = useRouteError();
    const revalidator = useRevalidator();

    const isNotFound = 
    (isRouteErrorResponse(error) && error.status === 404) ||
    (error instanceof ApiError && error.status === 404)

    if (isNotFound) {
        return <NotFoundPage />
    }

    console.error(error);

    return (
        <section className={styles.error} role="alert">
            <title>Something went wrong | Willy Saronamihardja</title>
            <h1>Connection lost</h1>
            <p>We couldn't load this page. The server may be busy or temporarily down.</p>

            <div className={styles.actions}>
                <button
                    type="button"
                    className={styles.retry}
                    onClick={() => void revalidator.revalidate()}
                    disabled={revalidator.state === 'loading'}
                >
                    {revalidator.state === 'loading' ? 'Retrying…' : 'Try again'}
                </button>
                <Link to="/">Return home</Link>
            </div>
        </section>
    )
}