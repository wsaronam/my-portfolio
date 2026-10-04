import { getAllProjects } from "./projects.data"
import { ProjectGrid } from "./ProjectGrid";




export function ProjectsPage() {
    const projects = getAllProjects();


    return (
        <>
            <h1>Projects</h1>
            <p>Things I've built and/or broken</p>
            <ProjectGrid projects={projects} />
        </>
    )
}