import { describe, expect, it } from 'vitest'
import { slugify } from './slugify'




describe('slugify', () => {
    it('lowercases words and joins them with hyphens', () => {
        expect(slugify('Writing a Packet Sniffer in Python')).toBe('writing-a-packet-sniffer-in-python');
    })

    it('removes punctuation and accents', () => {
        expect(slugify('Hello, Wörld! My First Post')).toBe('hello-world-my-first-post');
        expect(slugify('Café Résumé')).toBe('cafe-resume');
    })

    it('collapses repeated separators and trims hyphens from the ends', () => {
        expect(slugify('  --CTF   write-up:  part 2!!  ')).toBe('ctf-write-up-part-2');
    })

    it('returns an empty string when nothing usable is left', () => {
        expect(slugify('!!! ???')).toBe('');
        expect(slugify('')).toBe('');
    })

    it('never produces more than 100 characters or a trailing hyphen', () => {
        const slug = slugify('word '.repeat(50));
        expect(slug.length).toBeLessThanOrEqual(100);
        expect(slug).not.toMatch(/-$/);
    })
})