#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# CDPT — Commit · Push · Deploy · Test-on-web   (SCITI → sciti.nonarkara.org)
# ─────────────────────────────────────────────────────────────────────────────
# The full ship sequence, gated so a broken build can never reach the live
# award site. Idempotent: with no changes it just re-deploys + re-verifies.
#
#   bash scripts/cdpt.sh "commit message"   # commit tracked changes, then ship
#   bash scripts/cdpt.sh                     # nothing to commit → push/deploy/test
#   npm run cdpt -- "commit message"         # same, via npm
#
# Safety: only tracked-file modifications are staged (git add -u). NEW files are
# never auto-committed — stage them yourself first (git add <path>) so a stray
# secret or scratch file can't land in this PUBLIC repo. Deploy target is
# production; invoking this IS the authorization to push + deploy.
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

DOMAIN="https://sciti.nonarkara.org"
CF_PROJECT="smart-city-thailand-index"
MSG="${1:-}"

bold(){ printf "\n\033[1m▸ %s\033[0m\n" "$*"; }
ok(){   printf "  \033[32m✓\033[0m %s\n" "$*"; }
die(){  printf "\n\033[31m✗ CDPT aborted: %s\033[0m\n" "$*" >&2; exit 1; }

# ── PREFLIGHT GATES — never ship red ─────────────────────────────────────────
bold "Preflight — tests"
npx vitest run >/tmp/cdpt-test.log 2>&1 || { tail -20 /tmp/cdpt-test.log; die "tests failed"; }
ok "$(grep -oE 'Tests +[0-9]+ passed[^)]*\)' /tmp/cdpt-test.log | tail -1)"

bold "Preflight — lint"
npm run lint >/tmp/cdpt-lint.log 2>&1 || { tail -20 /tmp/cdpt-lint.log; die "lint failed"; }
ok "eslint clean"

bold "Preflight — build (base=/, the production artifact)"
VITE_BASE_PATH=/ npm run build >/tmp/cdpt-build.log 2>&1 || { tail -30 /tmp/cdpt-build.log; die "build failed"; }
LOCAL_HASH="$(grep -oE '/static/index-[A-Za-z0-9_-]+\.js' dist/index.html | head -1)"
[[ -n "$LOCAL_HASH" ]] || die "could not read built index chunk hash from dist/index.html"
ok "built — main chunk $LOCAL_HASH"
grep -q "Generated 118 city OG pages" /tmp/cdpt-build.log && ok "OG pages + sitemap + cities.json generated"

# ── C — commit ───────────────────────────────────────────────────────────────
if [[ -n "$MSG" ]]; then
  git add -u
  if ! git diff --cached --quiet; then
    bold "Commit"
    git commit -m "$MSG" | tail -1
  else
    bold "Commit — nothing staged (tip: 'git add <new-file>' before CDPT for new files)"
  fi
elif [[ -n "$(git status --porcelain --untracked-files=no)" ]]; then
  die "tracked changes present but no commit message. Run: bash scripts/cdpt.sh \"message\""
fi

# ── P — push (updates the GitHub Pages mirror) ───────────────────────────────
bold "Push — origin main"
git push origin main 2>&1 | tail -1
ok "pushed $(git rev-parse --short HEAD)"

# ── D — deploy (Cloudflare Pages: the step that actually updates prod) ────────
bold "Deploy — wrangler pages deploy → $CF_PROJECT"
npx wrangler pages deploy dist --project-name="$CF_PROJECT" --branch=main --commit-dirty=true 2>&1 | grep -E "Success|Deployment complete|peek" | sed 's/^/  /'

# ── T — test on the web ──────────────────────────────────────────────────────
bold "Test — waiting for $LOCAL_HASH to go live on $DOMAIN"
live=0
for i in $(seq 1 20); do
  if curl -fsS "$DOMAIN/" 2>/dev/null | grep -q "$LOCAL_HASH"; then live=1; break; fi
  sleep 3
done
[[ "$live" = 1 ]] || die "live site did not serve the freshly-built chunk within ~60s"
ok "production is serving the new build ($LOCAL_HASH)"

bold "Test — key routes"
for path in "/" "/rankings" "/methodology" "/city/phuket/" "/sitemap.xml" "/data/cities.json" "/downloads/SCITI-2026-cities-dataset.csv"; do
  code="$(curl -s -o /dev/null -w '%{http_code}' "$DOMAIN$path")"
  [[ "$code" == "200" ]] || die "$path returned HTTP $code"
  ok "$path → 200"
done

# ── Every JS chunk must serve AS JAVASCRIPT ──────────────────────────────────
# The 200-check above cannot catch a missing asset. _redirects rewrites ANY
# unmatched path to /index.html with status 200, so a lazy chunk that failed to
# propagate still answers 200 — while the browser refuses it for MIME mismatch,
# the dynamic import throws, and React never mounts. That is a fully blank site
# passing a green gate. It has happened. Assert the content-type instead.
bold "Test — every JS chunk serves as JavaScript (not the SPA fallback)"
chunk_fail=0
for f in dist/static/*.js; do
  name="$(basename "$f")"
  ctype="$(curl -s -o /dev/null -w '%{content_type}' "$DOMAIN/static/$name")"
  case "$ctype" in
    *javascript*) ;;
    *) printf "  \033[31m✗\033[0m %s → %s\n" "$name" "${ctype:-<none>}"; chunk_fail=$((chunk_fail+1)) ;;
  esac
done
[[ "$chunk_fail" = 0 ]] || die "$chunk_fail chunk(s) are not being served as JavaScript — the site will render blank. Re-run the deploy, then re-check."
ok "all $(ls dist/static/*.js | wc -l | tr -d ' ') JS chunks serve with a JavaScript content-type"

printf "\n\033[1;32m✓ CDPT complete — %s is live and verified.\033[0m\n" "$DOMAIN"
