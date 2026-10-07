export const PROJECT_CATEGORIES = ['security', 'software'] as const;

export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number];


export const CATEGORY_LABELS: Record<ProjectCategory, string> = {
    security: 'Security',
    software: 'Software'
}


export function isProjectCategory(value: unknown): value is ProjectCategory {
    return typeof value === 'string' && (PROJECT_CATEGORIES as readonly string[]).includes(value)
}