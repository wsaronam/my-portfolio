import { hash, verify } from '@node-rs/argon2';




/**
 * argon2id settings recommended by OWASP: 19 MiB of memory, 2 passes.
 * each guess costs an attacker real memory and time, which makes
 * cracking a stolen database of hashes extremely slow.
 */
const ARGON2_OPTIONS = {
    memoryCost: 19_456,
    timeCost: 2,
    parallelism: 1,
}


export function hashPassword(password: string): Promise<string> {
    return hash(password, ARGON2_OPTIONS);
}


export function verifyPassword(passwordHash: string, password: string): Promise<boolean> {
    return verify(passwordHash, password);
}


let dummyHash: Promise<string> | undefined;


/**
 * checks a password against a throwaway hash. used when the email doesn't exist,
 * so a failed login takes the same time either way and doesn't reveal which emails are real
 */
export async function verifyAgainstDummy(password: string): Promise<false> {
    dummyHash ??= hashPassword('dummy-password-for-timing-only');
    await verifyPassword(await dummyHash, password);
    return false;
}