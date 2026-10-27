import { randomBytes, createHash } from "node:crypto";
import type { Database } from "../../db/client.js";
import { sessions, users } from "../../db/schema.js";
import { and, eq, gt, lt } from 'drizzle-orm';




export const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000 // 7 days


/** 32 random bytes from the operating system's secure random generator. unguessable */
function generateToken(): string {
    return randomBytes(32).toString('base64url');
}

/** we store only a hash, so a leaked database doesn't contain usable session tokens */
function hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
}


export async function createSession(db: Database, userId: string) {
    const token = generateToken();
    const expiresAt = new Date(Date.now() + SESSION_TTL_MS);

    await db.insert(sessions).values({ id: hashToken(token), userId, expiresAt });

    return { token, expiresAt };
}

/** returns the logged-in user for a token, or null if the session is missing or expired */
export async function findUserBySessionToken(db: Database, token: string) {
    const rows = await db
        .select({ id: users.id, email: users.email })
        .from(sessions)
        .innerJoin(users, eq(sessions.userId, users.id))
        .where(and(eq(sessions.id, hashToken(token)), gt(sessions.expiresAt, new Date())))
        .limit(1);

    return rows[0] ?? null;
}


export async function deleteSession(db: Database, token: string) {
    await db.delete(sessions).where(eq(sessions.id, hashToken(token)));
}

export async function deleteExpiredSessions(db: Database, userId: string) {
    await db
        .delete(sessions)
        .where(and(eq(sessions.userId, userId), lt(sessions.expiresAt, new Date())));
}

export async function deleteAllSessionsForUser(db: Database, userId: string) {
    await db.delete(sessions).where(eq(sessions.userId, userId));
}