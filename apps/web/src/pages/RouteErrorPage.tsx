import { useRouteError } from 'react-router';

import styles from './RouteErrorPage.module.css';




/** shown when a page's loader fails, e.g. the API is down or returns 404. */
export function RouteErrorPage() {
    const error = useRouteError;

    console.error(error);

    return (
        <section>
            <h1>page loader fail</h1>
        </section>
    )
}