import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";
import { Outlet } from "react-router";

import styles from './RootLayout.module.css';




export function RootLayout() {
    return (
        <div className={styles.shell}>
            <SiteHeader />
            <main className={`container ${styles.main}`}>
                <Outlet />
            </main>
            <SiteFooter />
        </div>
    )
}