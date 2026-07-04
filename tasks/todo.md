# SCITI hardening — work-order reconciliation (2026-07-05, Opus)

Reconciled Fable 5's work order against current HEAD. Most items already resolved.

## Already DONE (verified, no action)
- [x] S1 Gemini key — absent from HEAD + .env.local; context.md notes key is DEAD (GCP project deleted); rotation moot (4f70b76)
- [x] S2 .webui_secret_key — untracked, off disk, gitignored (4f70b76)
- [x] S3 .env.local — no live key values
- [x] F1 "Inter variable" comment — gone from styles.css
- [x] F2 fetchJson — already has runtime guard (malformed-payload + success-false throws) in cityApi.ts
- [x] A3 Next.js deps — removed from package.json, not installed, 0 imports
- [x] A4 map minZoom floors — compliant
- [x] A5 fonts — compliant
- [x] A6 contrast — spot-check clean
- [x] A7 bundle — main chunk split already landed (gzip 360→190kB, vendor extracted); raw index still 614kB by design (HomePage/RankingsPage eager) — work order says acceptable, do NOT force-split

## ACTIONABLE — DONE
- [x] A8 npm audit — 17→5 via non-breaking fix; residual 5 all @lhci/cli dev-only, zero runtime exposure. Committed 71abcbd.
- [x] A3 dead Next.js deps removed (was uncommitted on disk) — committed 71abcbd.
- [x] A2 radar-chart @375px — VERIFIED fine (280px, right edge 312 < 375, no overflow on any tab). No fix needed.

## BONUS — biggest finding of the pass (not in work order)
- [x] Deployed-≠-public-repo drift: 25 files LIVE on sciti.nonarkara.org but never committed (2026-07-02 media/i18n/sourcing audit). Verified byte-identical live-vs-worktree, all 7 new news URLs 200, build green → committed + pushed 3963afb. Public repo now matches the live award site.

## NEEDS Dr Non's call (design-scope, do NOT execute unilaterally)
- [ ] A1 typography — 67 DISTINCT raw font-size values (real, not a false alarm). Work order itself mandates: per-page, design judgment, sign-off — some density is legitimate (§14 rule 2). Surface with data; do a single-page proof only if he says go.

## Verify & ship
- [ ] tsc -b + vite build + tests + lint green after A8/A2
- [ ] commit each item separately (work-order rule); push + wrangler deploy if runtime-affecting
