export function SiteFooter() {
    const year = new Date().getFullYear();

    return (
        <footer>
            <p>© {year} Willy Saronamihardja</p>
        </footer>
    )
}