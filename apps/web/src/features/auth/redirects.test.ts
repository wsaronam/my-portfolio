import { describe, expect, it } from 'vitest'
import { safeRedirectTarget } from './redirects'




describe('safeRedirectTarget', () => {
    it.each(['/admin', '/admin/posts', '/admin/posts/new?draft=1'])('allows our own admin page %s', (path) => {
        expect(safeRedirectTarget(path)).toBe(path);
    })

    // every one of these must fall back to /admin. if one ever doesn't,
    // the login page has become an open redirect.
    it.each([
        'https://evil.example',
        '//evil.example',
        '/\\evil.example',
        '/admin.evil.example',
        '/administrator',
        '/blog',
        'javascript:alert(1)',
        '',
    ])('rejects %j', (target) => {
        expect(safeRedirectTarget(target)).toBe('/admin');
    })

    it('falls back to /admin when there is no redirectTo at all', () => {
        expect(safeRedirectTarget(null)).toBe('/admin');
    })
})