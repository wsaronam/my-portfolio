import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";
import { Outlet } from "react-router";




export function RootLayout() {
    return (
        <>
            <SiteHeader />
            <main>
                <Outlet />
            </main>
            <SiteFooter />
        </>
    )
}