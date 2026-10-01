import { ProjectCard } from '../features/projects/ProjectCard';
import { getFeaturedProjects } from '../features/projects/projects.data';




export function HomePage() {
    const featured = getFeaturedProjects();


    return (
        <>
            <h1>Hello, I'm Will!</h1>
            <p>Software Engineer | Cybersecurity & IT | AI-Assisted Workflows</p>

            <h2>Features Projects</h2>
            {featured.map((project) => (
                <ProjectCard key={project.slug} project={project} />
            ))}
        </>
    )
}