import { z } from "zod";
import { randomBytes } from "node:crypto";
import { loadConfig } from "../src/config.js";
import { createDatabase } from "../src/db/client.js";
import { hashPassword } from "../src/features/auth/password.js";
import { users } from "../src/db/schema.js";
import { deleteAllSessionsForUser } from "../src/features/auth/sessions.js";




const emailArg = process.argv[2];
const parsedEmail = z.email().safeParse(emailArg);

if (!parsedEmail.success) {
    console.error('Usage: npm run admin:create -- you@example.com');
    process.exit(1);
}


const email = parsedEmail.data.toLowerCase();

// a strong random password: 24 characters from 18 random bytes.
const password = randomBytes(18).toString('base64url');

const config = loadConfig();
const { db, pool } = createDatabase(config.DATABASE_URL);


try {
    const passwordHash = await hashPassword(password);

    // Creates the admin, or resets the password if the email already exists.
    const [user] = await db
        .insert(users)
        .values({ email, passwordHash })
        .onConflictDoUpdate({ target: users.email, set: { passwordHash } })
        .returning({ id: users.id });
    
    if (!user) {
        throw new Error('Failed to save the admin user.');
    }

    // a password reset logs the admin out everywhere
    await deleteAllSessionsForUser(db, user.id);

    console.log(`\nAdmin ready: ${email}`);
    console.log(`Password:    ${password}`);
    console.log('\nSave this password in a password manager now. It will not be shown again.\n');
}
finally {
    await pool.end();
}