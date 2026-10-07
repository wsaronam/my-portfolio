import type { ProjectCategory } from "./categories"




export type Project = {
    slug: string
    title: string
    summary: string
    category: ProjectCategory
    tags: string[]
    date: string // "YYYY-MM-DD", date of project start
    featured: boolean
    repoUrl: string
    liveUrl?: string
}