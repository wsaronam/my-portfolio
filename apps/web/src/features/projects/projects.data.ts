import type { Project } from "./types";




const projects: Project[] = [
    {
        slug: 'ai-map-generator',
        title: 'AI Dungeon Map Generator',
        summary: 'Generates dungeon maps using AI.  React frontend, Flask backend.',
        category: 'software',
        tags: ['react', 'flask', 'python', 'ai'],
        date: '2026-03-18',
        featured: true,
        repoUrl: 'https://github.com/wsaronam/ai-map-generator',
        liveUrl: 'https://ai-map-generator-beta.vercel.app',
    },

    {
        slug: 'web-vulnerability-scanner',
        title: 'Web Vulnerability Scanner',
        summary: 'Scans web applications for security vulnerabilities.  React frontend, Flask backend.',
        category: 'security',
        tags: ['react', 'flask', 'python'],
        date: '2026-06-02',
        featured: true,
        repoUrl: 'https://github.com/wsaronam/web-vulnerability-scanner',
        liveUrl: 'https://web-vulnerability-scanner-kohl.vercel.app',
    }
]



export function getAllProjects(): Project[] {
    return [...projects];
}


export function getFeaturedProjects(): Project[] {
    return getAllProjects().filter((project) => project.featured);
}


export function getProjectBySlug(slug: string): Project | undefined {
    return projects.find((project) => project.slug === slug);
}