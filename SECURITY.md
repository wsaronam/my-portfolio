# Security Policy

## Reporting a vulnerability

If you find a security issue in this site, please **do not open a public issue**.
Report it privately through GitHub's
[private vulnerability reporting](https://docs.github.com/en/code-security/security-advisories/guidance-on-reporting-and-writing-information-about-vulnerabilities/privately-reporting-a-security-vulnerability)
("Security" tab → "Report a vulnerability").

I aim to acknowledge reports within 72 hours.

## Security design

### Authentication and sessions

| Measure | Details |
|---|---|
| Password hashing | Argon2id (`@node-rs/argon2`). Unknown emails are checked against a dummy hash so response timing doesn't reveal which accounts exist. |
| Generic errors | One message for any failed login: no hint whether the email or the password was wrong. |
| Sessions | 32-byte random tokens; the database stores only their SHA-256 hash, so a database leak doesn't expose usable sessions. Sessions expire after 7 days; logout deletes them server-side. |
| Cookies | `__Host-session` in production: `HttpOnly`, `Secure`, `SameSite=Strict`, `Path=/`. |
| Rate limiting | 5 login attempts per 15 minutes per client IP. Behind the edge proxy, the IP is read from a header the proxy controls (`CLIENT_IP_HEADER`), never from `X-Forwarded-For`. |
| Access control | Every admin route is protected by a plugin-level `requireAuth` hook; integration tests assert that each one returns 401 without a session. |

### Request handling

| Measure | Details |
|---|---|
| CSRF | Requests that change data must carry an `Origin` header matching the site (`APP_ORIGIN`). |
| Same origin, no CORS | The site reaches the API through a same-origin `/api` rewrite, so no cross-origin access is enabled. |
| Input validation | Every request body, parameter and query is validated with zod; unknown fields are stripped (no mass assignment). |
| SQL injection | All queries go through Drizzle ORM with parameterized queries. |
| Error handling | Visitors get generic 500 messages; details go to server logs only. Logs redact cookie and authorization headers. |
| Open redirects | The post-login redirect only accepts paths under `/admin`. |
| Caching | Auth and admin responses send `Cache-Control: no-store`. |

### Browser protections

| Measure | Details |
|---|---|
| Content Security Policy | Pages: scripts and styles from the site only, no `eval`, no framing (`apps/web/vercel.json`). API: `default-src 'none'`. |
| Other headers | HSTS, `X-Frame-Options: DENY`, `nosniff`, Referrer-Policy, Permissions-Policy, Cross-Origin-Opener-Policy (API: `@fastify/helmet`). |
| XSS | React escapes output; Markdown is rendered without raw HTML and with unsafe link protocols removed. |

### Infrastructure and supply chain

| Measure | Details |
|---|---|
| Secrets | No secrets in the repo; `.env*` files are git-ignored. Production secrets live in the hosting dashboards. CI runs [gitleaks](https://github.com/gitleaks/gitleaks) over the full git history. |
| Database | Production requires TLS with certificate verification (`sslmode=verify-full`); the API refuses to start without it. |
| Config | All environment variables are validated at startup; the server fails fast on invalid config. |
| Dependencies | Lockfile committed, `npm ci` in CI, `npm audit` gate on production dependencies, Dependabot with a 7-day cooldown on new releases. |
| CI | GitHub Actions pinned to commit SHAs, token limited to `contents: read`, credentials not persisted. The API deploys only after CI passes. |
