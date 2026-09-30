import type { Project } from "./types";




const projects: Project[] = [

]



export function getAllProjects(): Project[] {
    return [...projects];
}


export function getFeaturedProjects(): Project[] {
    return [...projects];
}


export function getProjectBySlug(slug: string): Project | undefined {
    return undefined;
}