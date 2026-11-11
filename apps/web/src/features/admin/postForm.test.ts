import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { z } from 'zod'
import { type PostFormValues, postFormSchema } from './adminPosts.schemas'
import { toPublishedAt } from './PostEditor.route'




const NOW = new Date('2026-06-15T12:00:00.000Z')


/** a valid form submission; each test overrides just the fields it cares about */
function formFields(overrides: Record<string, string> = {}) {
    return {
        title: 'My post',
        slug: 'my-post',
        summary: 'A summary',
        body: '# Hello',
        tags: '',
        publishMode: 'draft',
        ...overrides,
    }
}

function fieldErrors(fields: Record<string, string>) {
    const result = postFormSchema.safeParse(fields);
    return result.success ? {} : z.flattenError(result.error).fieldErrors;
}


describe('postFormSchema', () => {
    beforeEach(() => {
        // freeze the clock so "in the future" means the same thing on every run
        vi.useFakeTimers();
        vi.setSystemTime(NOW);
    })
    afterEach(() => {
        vi.useRealTimers();
    })

    it('accepts a valid draft and trims the text fields', () => {
        const result = postFormSchema.parse(formFields({ title: '  My post  ' }));
        expect(result.title).toBe('My post');
    })

    it('turns the comma-separated tags into a clean list', () => {
        const result = postFormSchema.parse(formFields({ tags: ' python, , networking ,ctf ' }));
        expect(result.tags).toEqual(['python', 'networking', 'ctf']);
    })

    it('requires a title, slug and summary', () => {
        const errors = fieldErrors(formFields({ title: '   ', slug: '', summary: '' }));
        expect(errors).toHaveProperty('title');
        expect(errors).toHaveProperty('slug');
        expect(errors).toHaveProperty('summary');
    })

    it.each(['My Post', 'my--post', '-my-post', 'my_post', 'my/post'])('rejects the slug %j', (slug) => {
        expect(fieldErrors(formFields({ slug }))).toHaveProperty('slug');
    })

    it('rejects more than 10 tags', () => {
        const tags = Array.from({ length: 11 }, (_, i) => `tag${i}`).join(',');
        expect(fieldErrors(formFields({ tags }))).toHaveProperty('tags');
    })

    it('rejects an unknown publish mode', () => {
        expect(fieldErrors(formFields({ publishMode: 'publish-everything' }))).toHaveProperty('publishMode');
    })

    it('requires a future date when scheduling', () => {
        expect(fieldErrors(formFields({ publishMode: 'schedule' }))).toHaveProperty('scheduledFor');
        expect(fieldErrors(formFields({ publishMode: 'schedule', scheduledFor: '2020-01-01T09:00' }))).toHaveProperty(
        'scheduledFor',
        );
        expect(fieldErrors(formFields({ publishMode: 'schedule', scheduledFor: '2026-12-01T09:00' }))).toEqual({});
    })
})


describe('toPublishedAt', () => {
    const base: PostFormValues = postFormSchema.parse(formFields());

    it('returns null for a draft', () => {
        expect(toPublishedAt({ ...base, publishMode: 'draft' }, NOW)).toBeNull();
    })

    it('uses the current time when publishing a new post', () => {
        expect(toPublishedAt({ ...base, publishMode: 'now' }, NOW)).toBe(NOW.toISOString());
    })

    it('keeps the original date when re-saving a post that is already live', () => {
        const original = '2026-03-01T08:00:00.000Z';
        expect(toPublishedAt({ ...base, publishMode: 'now', currentPublishedAt: original }, NOW)).toBe(original);
    })

    it('publishes a scheduled post now if you switch it to "Publish now"', () => {
        const future = '2026-09-01T08:00:00.000Z';
        expect(toPublishedAt({ ...base, publishMode: 'now', currentPublishedAt: future }, NOW)).toBe(NOW.toISOString());
    })
})