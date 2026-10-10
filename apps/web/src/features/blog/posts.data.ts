import type { Post } from "./types";




const posts: Post[] = [
    {
        slug: 'example-packet-sniffer',
        title: 'Example: How I Built a Packet Sniffer',
        summary: 'Placeholder post.  To be replaced later.',
        date: '2026-10-29',
        tags: ['networking', 'python'],
        draft: true,
    },
    {
        slug: 'example-first-ctf',
        title: 'Example: My First CTF Write-up',
        summary: 'Placeholder post. To be replaced later.',
        date: '2026-10-01',
        tags: ['ctf', 'web security'],
        draft: true,
    },
]


/**
 * published posts, with the newest being first
 * 
 */
export function getAllPosts(): Post[] {
    return posts
        .filter((post) => import.meta.env.DEV || !post.draft)
        .sort((a, b) => b.date.localeCompare(a.date))
}