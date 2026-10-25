import { loadConfig } from "../src/config.js";
import { createDatabase } from "../src/db/client.js";
import { type NewPostRow, posts } from "../src/db/schema.js";




const config = loadConfig();

if (config.NODE_ENV === 'production') {
    throw new Error('Refusing to seed a production database.');
}

const examplePosts: NewPostRow[] = [
    {
        slug: 'example-markdown-showcase',
        title: 'Example: Markdown Showcase',
        summary: 'Shows how post bodies are formatted, and that HTML in a post can never run as code.',
        body: [
            '## Headings, text and lists',
            '',
            'Posts are written in **Markdown**. We get *emphasis*, `inline code`, and lists:',
            '',
            '- Reconnaissance',
            '- Exploitation',
            '- Writing it up',
            '',
            '## Code blocks',
            '',
            '```python',
            'if invoice.owner_id != current_user.id:',
            '    abort(403)',
            '```',
            '',
            '> Always check that the logged-in user owns the resource.',
            '',
            '| Step | Tool |',
            '| --- | --- |',
            '| Scan | nmap |',
            '| Intercept | Burp Suite |',
            '',
            '## Links',
            '',
            'An [internal link to the projects page](/projects) and an [external link](https://owasp.org).',
            '',
            '## Attack attempts (these must NOT run)',
            '',
            '<script>alert("xss via script tag")</script>',
            '',
            '<img src="x" onerror="alert(\'xss via image\')">',
            '',
            '[Click me](javascript:document.location="https://evil.example")',
        ].join('\n'),
        tags: ['markdown', 'security'],
        publishedAt: new Date('2026-10-01T00:00:00Z')
    },
    {
        slug: 'example-packet-sniffer',
        title: 'Example: How I Built a Packet Sniffer',
        summary: 'Placeholder post. Replace it with a real write-up about it.',
        body: '## Why I built it\n\nPlaceholder text. Explain the problem I wanted to solve.\n\n## How it works\n\nPlaceholder text.',
        tags: ['networking', 'python'],
        publishedAt: new Date('2026-09-22T00:00:00Z'),
    },
    {
        slug: 'example-first-ctf',
        title: 'Example: My First CTF Write-up',
        summary: 'Placeholder post. A walkthrough of a challenge I solved and what I learned.',
        body: '## The challenge\n\nPlaceholder text.\n\n## The solution\n\nPlaceholder text.',
        tags: ['ctf', 'web security'],
        publishedAt: new Date('2026-08-15T00:00:00Z'),
    },
    {
        slug: 'example-unfinished-draft',
        title: 'Example: An Unfinished Draft',
        summary: 'This post has no publish date, so the public API must never return it.',
        body: 'Secret draft content that visitors should never see.',
        tags: ['draft'],
        publishedAt: null,
    }
]


const { db, pool } = createDatabase(config.DATABASE_URL);

try {
    const inserted = await db
        .insert(posts)
        .values(examplePosts)
        .onConflictDoNothing({ target: posts.slug })
        .returning( { slug: posts.slug })
    
    console.log(`Seeded ${inserted.length} new post(s).`, inserted.map((post) => post.slug));
}
finally {
    await pool.end();
}