import { z } from 'zod';




// Our Content Security Policy forbids eval(). By default zod tries it once per
// schema (to speed up validation), falls back when it's blocked, and the browser
// reports a CSP violation each time. `jitless` tells zod not to try.
//
// This runs when the module is imported, so main.tsx imports it FIRST: zod makes
// its check while schemas are being created, which happens during other imports.
z.config({ jitless: true });