/**
 * turns a title into a URL-friendly slug.
 * "Writing a Packet Sniffer in Python!" -> "writing-a-packet-sniffer-in-python"
 */
export function slugify(title: string): string {
    return title
        .normalize('NFKD') // split "é" into "e" + an accent mark…
        .replace(/[\u0300-\u036f]/g, '') // …then drop the accent marks
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-') // anything that isn't a letter or digit becomes a hyphen
        .replace(/^-+|-+$/g, '') // no hyphens at the start or end
        .slice(0, 100)
        .replace(/-+$/, '') // slicing may leave a trailing hyphen
}