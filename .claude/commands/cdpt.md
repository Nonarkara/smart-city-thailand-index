---
description: CDPT — Commit, Push, Deploy to Cloudflare, and Test the live site (SCITI)
---

Ship SCITI end-to-end by running the hardcoded sequence:

```
bash scripts/cdpt.sh "$ARGUMENTS"
```

`$ARGUMENTS` is the commit message. If it is empty, the script assumes the work
is already committed and just pushes, deploys, and verifies.

CDPT = **C**ommit · **P**ush · **D**eploy · **T**est-on-web. The script:

1. **Preflight gates** — `vitest run`, `eslint`, and a `VITE_BASE_PATH=/` build.
   If any fail, it aborts and ships nothing.
2. **Commit** — stages tracked modifications (`git add -u`) and commits with the
   message. New/untracked files are NOT auto-staged (safety: no stray secrets in
   this public repo) — stage those yourself with `git add <path>` before CDPT.
3. **Push** — `git push origin main` (updates the GitHub Pages mirror).
4. **Deploy** — `wrangler pages deploy dist` to the `smart-city-thailand-index`
   Cloudflare Pages project. This is the manual step that actually updates
   `sciti.nonarkara.org`; pushing to `main` alone does not.
5. **Test** — polls the live domain until it serves the freshly-built chunk hash
   (proves the deploy propagated), then asserts HTTP 200 on `/`, `/rankings`,
   `/methodology`, `/city/phuket/`, `/sitemap.xml`, `/data/cities.json`, and the
   dataset CSV.

Run the script, then report the outcome concisely (the commit, the deploy URL,
and the test results). If the script aborts on a gate, surface the failing gate
and the error — do NOT retry blindly or bypass the gate.
