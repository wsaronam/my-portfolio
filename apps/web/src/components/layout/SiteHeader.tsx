import { Link, NavLink } from "react-router"




export function SiteHeader() {
    return (
        <header>
            <Link to='/'>Willy Saronamihardja</Link>
            <nav aria-label='Main'>
                <ul>
                    <li><NavLink to="/" end>Home</NavLink></li>
                    <li><NavLink to="/projects">Projects</NavLink></li>
                    <li><NavLink to="/blog">Blog</NavLink></li>
                </ul>
            </nav>
        </header>
    )
}