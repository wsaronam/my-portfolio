import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";
import { Outlet, useNavigation } from "react-router";

import styles from './RootLayout.module.css';




export function RootLayout() {
    const navigation = useNavigation();
    const isLoading = navigation.state === 'loading';


    return (
        <div className={styles.shell}>
            <SiteHeader />
            <main className={`container ${styles.main}`} aria-busy={isLoading}>
                <Outlet />
            </main>
            <SiteFooter />
        </div>
    )
}