export type Post = {
    slug: string
    title: string
    summary: string
    date: string
    tags: string[] // "YYYY-MM-DD", date of project start
    draft: boolean
}