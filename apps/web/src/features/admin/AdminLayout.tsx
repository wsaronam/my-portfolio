import { Link, NavLink, Form, Outlet, useLoaderData, useNavigation } from 'react-router';
import type { adminLayoutLoader } from './adminLayout.loader';

import styles from './AdminLayout.module.css';




export function AdminLayout() {
    const user = useLoaderData<typeof adminLayoutLoader>();
    const navigation = useNavigation();


    return (
        <div className={styles.shell}>
            <meta name="robots" content="noindex" />

            <header className={styles.bar}>
                <div className={`container ${styles.inner}`}>
                    <Link to="/admin" className={styles.brand}>
                        Admin <span className={styles.brandAccent}>panel</span>
                    </Link>

                    <nav aria-label="Admin">
                        <ul className={styles.nav}>
                            <li>
                                <NavLink to="/admin/posts" className={styles.link}>
                                    Posts
                                </NavLink>
                            </li>
                            <li>
                                <Link to="/" className={styles.link}>
                                    View site
                                </Link>
                            </li>
                        </ul>
                    </nav>

                    <div className={styles.account}>
                        <span className={styles.email}>{user.email}</span>
                        <Form method="post" action="/admin/logout">
                            <button type="submit" className={styles.logout}>
                                Log out
                            </button>
                        </Form>
                    </div>
                </div>
            </header>

            <main className={`container ${styles.main}`} aria-busy={navigation.state === 'loading'}>
                <Outlet />
            </main>
        </div>
    );
}