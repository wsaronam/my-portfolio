import { getAllProjects } from "./projects.data"
import { ProjectCard } from "./ProjectCard"




export function ProjectsPage() {
    const projects = getAllProjects();


    return (
        <>
            <h1>Projects</h1>
            <p>Things I've built and/or broken</p>
            {projects.map((project) => (
                <ProjectCard key={project.slug} project={project} />
            ))}
        </>
    )
}