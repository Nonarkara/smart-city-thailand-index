# Security hardening — 2 October 2026

Signal ingestion requires a server-side `SIGNAL_INGEST_TOKEN`, sent as an
`Authorization: Bearer …` header by trusted ingestion jobs. Never put this token
in a `VITE_` variable or frontend bundle. Unconfigured ingestion returns 503;
unauthenticated requests return 401 before parsing or contacting a backend.
Public GET requests remain available. Cloudflare Pages currently serves the
static application; the `api/` handler applies only to hosts that run it.

For existing Supabase installations, apply
`database/migrations/20261002_signal_ingestion_rls.sql` through an authorized
database administrator. Source changes do **not** prove the migration was
applied. Verify anonymous and authenticated clients cannot insert, update or
delete signals, while public reads still work. Trusted server ingestion uses
the service role. Browser users cannot submit trusted evidence directly.

The optional Gemini assistant keeps user keys in React memory, deletes legacy
localStorage keys on mount, and sends credentials in `x-goog-api-key`, not URLs.
Questions and city context are sent to Google. This is still a browser-side
BYO-key feature: use a restricted key, and never treat browser memory as a vault.
No authenticated real-key AI request is part of automated verification.

GitHub Pages builds now require the lockfile (`npm ci`) and reject high-severity
production dependency advisories. Development-tool advisories are evaluated
separately; an audit result is not a guarantee that the application is secure.

The dependency update reduced the complete npm audit from 30 to 14 findings;
the production-only audit reports zero. The remaining development findings
are in the Lighthouse CI dependency tree (including archive extraction,
temporary-file handling and proxy dependencies). Do not run these tools against
untrusted archives or proxy configuration. npm's proposed forced fix downgrades
Lighthouse CI to 0.1.0; it was intentionally not applied. This remains follow-up
work, not a clean bill of health. The existing inline-script CSP is also not
changed by this patch.

Sources: [Google's API authentication reference](https://ai.google.dev/api),
and machine-readable npm advisory reports generated locally during verification.
