import type { ComponentPropsWithoutRef } from "react";
import { Link } from "react-router";
import { ExternalLink } from "./ExternalLink";
import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from "remark-gfm";

import styles from './Markdown.module.css';




/** links inside the site use the router; everything else opens safely in a new tab */
function MarkdownLink({ href = '', children }: ComponentPropsWithoutRef<'a'>) {
    // react-markdown empties unsafe addresses like javascript:. show plain text instead of a dead link
    if (!href) {
        return <>{children}</>
    }
    if (href.startsWith('/') && !href.startsWith('//')) {
        return <Link to={href}>{children}</Link>
    }
    if (href.startsWith('#')) {
        return <a href={href}>{children}</a>
    }
    return <ExternalLink href={href}>{children}</ExternalLink>
}

const components: Components = {
    a: MarkdownLink
}

type MarkdownProps = {
    children: string
}


/**
 * Renders Markdown as React elements, never as raw HTML.
 * Any HTML typed into a post is shown as text, and unsafe link
 * protocols like javascript: are removed, so posts can't inject scripts
 */
export function Markdown({ children }: MarkdownProps) {
    return (
        <div className={styles.prose}>
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
                {children}
            </ReactMarkdown>
        </div>
    )
}