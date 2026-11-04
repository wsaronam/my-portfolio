import { useActionData, Form, useNavigation, Link } from 'react-router';
import { loginAction } from './login.route';

import styles from './LoginPage.module.css';




export function LoginPage() {
    const actionData = useActionData<typeof loginAction>();
    const navigation = useNavigation();
    const isSubmitting = navigation.state === 'submitting';


    return (
        <main className={styles.screen}>
            <title>Admin login | Willy Saronamihardja</title>
            <meta name="robots" content="noindex" />

            <section className={styles.card} aria-labelledby="login-heading">
                <p className={styles.kicker}>Admin</p>
                <h1 id="login-heading" className={styles.title}>
                    Log in
                </h1>

                {actionData?.error && (
                    <p className={styles.error} role="alert">
                        {actionData.error}
                    </p>
                )}

                <Form method="post" className={styles.form}>
                    <label className={styles.field}>
                        <span className={styles.label}>Email</span>
                        <input
                            className={styles.input}
                            type="email"
                            name="email"
                            autoComplete="username"
                            required
                            maxLength={254}
                        />
                    </label>

                    <label className={styles.field}>
                        <span className={styles.label}>Password</span>
                        <input
                            className={styles.input}
                            type="password"
                            name="password"
                            autoComplete="current-password"
                            required
                            maxLength={256}
                        />
                    </label>

                    <button type="submit" className={styles.submit} disabled={isSubmitting}>
                        {isSubmitting ? 'Logging in…' : 'Log in'}
                    </button>
                </Form>

                <Link to="/" className={styles.back}>
                    <span aria-hidden="true">◀ </span>
                    Back to the site
                </Link>
            </section>
        </main>
    )
}