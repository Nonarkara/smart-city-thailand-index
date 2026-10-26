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

LOG_DIR="$ROOT/.tmp"
mkdir -p "$LOG_DIR"

# ── PREFLIGHT GATES — never ship red ─────────────────────────────────────────
bold "Preflight — tests"
if [[ -n "${CDPT_REMOTE_TEST_RUN:-}" ]]; then
  [[ -z "$(git status --porcelain)" ]] || die "remote validation requires a clean checkout"
  gh run view "$CDPT_REMOTE_TEST_RUN" --json workflowName,headSha,status,conclusion,url >"$LOG_DIR/cdpt-validation-run.json" || die "cannot read remote validation"
  node --input-type=module - "$(git rev-parse HEAD)" "$LOG_DIR/cdpt-validation-run.json" <<'JS' || die "remote validation does not cover this release"
import fs from 'node:fs';
import { checkValidationRun } from './scripts/lib/release-contract.mjs';
checkValidationRun(JSON.parse(fs.readFileSync(process.argv[3], 'utf8')), process.argv[2]);
JS
  ok "full tests, lint and build passed remotely for $(git rev-parse --short HEAD) (run $CDPT_REMOTE_TEST_RUN)"
else
  npx vitest run --maxWorkers=1 --reporter=verbose >"$LOG_DIR/cdpt-test.log" 2>&1 || { tail -20 "$LOG_DIR/cdpt-test.log"; die "tests failed"; }
  ok "$(grep -oE 'Tests +[0-9]+ passed[^)]*\)' "$LOG_DIR/cdpt-test.log" | tail -1)"
fi

if [[ -n "${CDPT_REMOTE_TEST_RUN:-}" ]]; then
  bold "Build — use the artifact produced by the validated workflow"
  ARTIFACT_DIR="$(mktemp -d "$LOG_DIR/cdpt-ci.XXXXXX")"
  gh run download "$CDPT_REMOTE_TEST_RUN" --name github-pages --dir "$ARTIFACT_DIR" || die "cannot download validated build"
  [[ -s "$ARTIFACT_DIR/artifact.tar" ]] || die "validated workflow has no Pages archive"
  mkdir "$ARTIFACT_DIR/site"
  tar -xf "$ARTIFACT_DIR/artifact.tar" -C "$ARTIFACT_DIR/site" || die "cannot extract validated build"
  [[ -s "$ARTIFACT_DIR/site/index.html" ]] || die "validated build has no index.html"
  shasum -a 256 "$ARTIFACT_DIR/artifact.tar" >"$LOG_DIR/cdpt-artifact.sha256"
  [[ ! -e dist ]] || mv dist "$ARTIFACT_DIR/previous-dist"
  mv "$ARTIFACT_DIR/site" dist
  ok "reusing the exact build that passed full tests, lint, build and dependency audit"
else
  bold "Preflight — lint"
  npm run lint >"$LOG_DIR/cdpt-lint.log" 2>&1 || { tail -20 "$LOG_DIR/cdpt-lint.log"; die "lint failed"; }
  ok "eslint clean"
  bold "Preflight — build (base=/, the production artifact)"
  VITE_BASE_PATH=/ npm run build >"$LOG_DIR/cdpt-build.log" 2>&1 || { tail -30 "$LOG_DIR/cdpt-build.log"; die "build failed"; }
fi
LOCAL_HASH="$(grep -oE '/static/index-[A-Za-z0-9_-]+\.js' dist/index.html | head -1)"
[[ -n "$LOCAL_HASH" ]] || die "could not read built index chunk hash from dist/index.html"
# The vendor chunk is modulepreloaded from index.html; a partial deploy that
# serves a new index against a stale vendor would pass the main-hash check
# while shipping two React versions. Assert both.
LOCAL_VENDOR="$(grep -oE '/static/vendor-[A-Za-z0-9_-]+\.js' dist/index.html | head -1)"
[[ -n "$LOCAL_VENDOR" ]] || die "could not read built vendor chunk hash from dist/index.html"
ok "built — main chunk $LOCAL_HASH · vendor $LOCAL_VENDOR"
[[ -s dist/sitemap.xml && -s dist/data/cities.json ]] || die "missing sitemap or city index"
for f in \
  dist/api-static/cities.json \
  dist/api-static/cities/phuket.json \
  dist/api-static/exports/cities-summary.csv \
  dist/api-static/exports/city-facts.csv \
  dist/api-static/exports/cities/phuket.csv \
  dist/api-static/not-found.json \
  functions/api/cities.ts \
  functions/api/\[\[catchall\]\].ts
do
  [[ -s "$f" ]] || die "missing $f"
done
grep -q '"id":"phuket"' dist/api-static/cities/phuket.json || die "phuket API dossier is not JSON for phuket"
ok "API mirror present (cities, dossiers, CSV)"

bold "Preflight — rendered record density (compiled build)"
node scripts/audit/record-density.mjs --serve >"$LOG_DIR/cdpt-density.log" 2>&1 || { tail -20 "$LOG_DIR/cdpt-density.log"; die "spatial regression: record density or preserved information failed"; }
ok "15 locale/width states preserve all records and readable type; oversized-card mutation rejected"

bold "Preflight — the type law (§11.7: one display statement per page)"
node scripts/audit/type-and-rhythm.mjs --serve >"$LOG_DIR/cdpt-type.log" 2>&1 || { tail -30 "$LOG_DIR/cdpt-type.log"; die "type regression: a page carries more than one display-size statement, or a route was not measured"; }
ok "every route measured; every display-size statement is the page title"

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
# Release the checked-out revision, never another chat's shared local main.
git push origin HEAD:main 2>&1 | tail -1
ok "pushed $(git rev-parse --short HEAD)"

# ── D — deploy (Cloudflare Pages: the step that actually updates prod) ────────
bold "Deploy — wrangler pages deploy → $CF_PROJECT"
if ! npx wrangler pages deploy dist --project-name="$CF_PROJECT" --branch=main --commit-dirty=true >"$LOG_DIR/cdpt-deploy.log" 2>&1; then
  tail -20 "$LOG_DIR/cdpt-deploy.log"
  die "Cloudflare deploy failed; diagnostics saved in .tmp/cdpt-deploy.log"
fi
grep -E "Success|Deployment complete|peek" "$LOG_DIR/cdpt-deploy.log" | sed 's/^/  /' || die "Cloudflare did not confirm deployment"

# ── T — test on the web ──────────────────────────────────────────────────────
bold "Test — waiting for $LOCAL_HASH + $LOCAL_VENDOR to go live on $DOMAIN"
live=0
for i in $(seq 1 40); do
  html="$(curl -fsS "$DOMAIN/" 2>/dev/null || true)"
  if grep -q "$LOCAL_HASH" <<<"$html" && grep -q "$LOCAL_VENDOR" <<<"$html"; then live=1; break; fi
  sleep 3
done
[[ "$live" = 1 ]] || die "live site did not serve the freshly-built index + vendor chunks within ~120s"
ok "production is serving the new build ($LOCAL_HASH · $LOCAL_VENDOR)"

bold "Test — key routes"
for path in "/" "/rankings" "/methodology" "/city/phuket/" "/sitemap.xml" "/data/cities.json" "/downloads/SCITI-2026-cities-dataset.csv"; do
  code="$(curl -s -o /dev/null -w '%{http_code}' "$DOMAIN$path")"
  [[ "$code" == "200" ]] || die "$path returned HTTP $code"
  ok "$path → 200"
done

# /api/* must not be the SPA shell. A 200 text/html here means _redirects
# swallowed the route and CSV/JSON clients received index.html.
bold "Test — city API responds as data, not the SPA shell"
api_index_type="$(curl -s -o /dev/null -w '%{content_type}' "$DOMAIN/api/cities")"
api_city_type="$(curl -s -o /dev/null -w '%{content_type}' "$DOMAIN/api/cities/phuket")"
api_csv_type="$(curl -s -o /dev/null -w '%{content_type}' "$DOMAIN/api/cities/phuket/export.csv")"
api_summary_type="$(curl -s -o /dev/null -w '%{content_type}' "$DOMAIN/api/exports/cities-summary.csv")"
api_missing_code="$(curl -s -o /dev/null -w '%{http_code}' "$DOMAIN/api/not-a-real-route")"
api_missing_type="$(curl -s -o /dev/null -w '%{content_type}' "$DOMAIN/api/not-a-real-route")"
case "$api_index_type" in *json*) ;; *) die "/api/cities content-type is ${api_index_type:-<none>}, expected JSON" ;; esac
case "$api_city_type" in *json*) ;; *) die "/api/cities/phuket content-type is ${api_city_type:-<none>}, expected JSON" ;; esac
case "$api_csv_type" in *csv*) ;; *) die "/api/cities/phuket/export.csv content-type is ${api_csv_type:-<none>}, expected CSV" ;; esac
case "$api_summary_type" in *csv*) ;; *) die "/api/exports/cities-summary.csv content-type is ${api_summary_type:-<none>}, expected CSV" ;; esac
[[ "$api_missing_code" == "404" ]] || die "/api/not-a-real-route returned HTTP $api_missing_code, expected 404"
case "$api_missing_type" in *html*) die "/api/not-a-real-route is HTML — the SPA fallback swallowed the API" ;; esac

# A well-formed city id that does not exist must 404, not echo the shell back.
# The ASSETS binding applies the same SPA rewrite as the edge, so a missing
# artifact comes back 200 + text/html. If the API only asserted content-type
# and status, this route would pass while handing clients index.html.
bold "Test — unknown city ids 404 with JSON, never the shell"
api_bogus_code="$(curl -s -o /dev/null -w '%{http_code}' "$DOMAIN/api/cities/not-a-real-city")"
api_bogus_type="$(curl -s -o /dev/null -w '%{content_type}' "$DOMAIN/api/cities/not-a-real-city")"
api_bogus_body="$(curl -s "$DOMAIN/api/cities/not-a-real-city")"
[[ "$api_bogus_code" == "404" ]] || die "/api/cities/not-a-real-city returned HTTP $api_bogus_code, expected 404"
case "$api_bogus_body" in
  *"<html"*|*"<!DOCTYPE"*) die "/api/cities/not-a-real-city returned the SPA shell, expected a JSON error" ;;
esac
case "$api_bogus_body" in
  *'"success":false'*) ;;
  *) die "/api/cities/not-a-real-city did not return a JSON error envelope" ;;
esac
api_bogus_csv_code="$(curl -s -o /dev/null -w '%{http_code}' "$DOMAIN/api/cities/not-a-real-city/export.csv")"
[[ "$api_bogus_csv_code" == "404" ]] || die "/api/cities/not-a-real-city/export.csv returned HTTP $api_bogus_csv_code, expected 404"
ok "unknown city ids and their CSV exports 404 with JSON, not the SPA shell"

# ── Every JS chunk must serve AS JAVASCRIPT ──────────────────────────────────
# The 200-check above cannot catch a missing asset. _redirects rewrites ANY
# unmatched path to /index.html with status 200, so a lazy chunk that failed to
# propagate still answers 200 — while the browser refuses it for MIME mismatch,
# the dynamic import throws, and React never mounts. That is a fully blank site
# passing a green gate. It has happened. Assert the content-type instead.
bold "Test — every JS chunk serves as JavaScript (not the SPA fallback)"
# The edge does not switch over atomically: the poll above can pass on the
# index chunk while one lazy chunk is still missing, and _redirects then
# answers that path with the shell. That is a propagation gap, not a broken
# deploy — but it must not pass either, and it must not abort a healthy
# deploy on its first breath. Sweep up to 4 times; a chunk that is still
# wrong on the last sweep is a real failure.
chunk_fail=0
for attempt in 1 2 3 4; do
  chunk_fail=0
  chunk_bad=()
  for f in dist/static/*.js; do
    name="$(basename "$f")"
    if ! ctype="$(curl --http1.1 --retry 2 --connect-timeout 10 --max-time 30 -fsS -o /dev/null -w '%{content_type}' "$DOMAIN/static/$name")"; then
      ctype=""
    fi
    case "$ctype" in
      *javascript*) ;;
      *) chunk_bad+=("$name → ${ctype:-<none>}"); chunk_fail=$((chunk_fail+1)) ;;
    esac
  done
  if [[ "$chunk_fail" = 0 ]]; then break; fi
  if [[ "$attempt" != 4 ]]; then
    printf "  \033[33m…\033[0m %d chunk(s) not yet propagated (sweep %d/4) — retrying\n" "$chunk_fail" "$attempt"
    sleep 10
  fi
done
for bad in "${chunk_bad[@]:-}"; do
  [[ -n "$bad" ]] && printf "  \033[31m✗\033[0m %s\n" "$bad"
done
[[ "$chunk_fail" = 0 ]] || die "$chunk_fail chunk(s) are not being served as JavaScript — the site will render blank. Re-run the deploy, then re-check."
ok "all $(ls dist/static/*.js | wc -l | tr -d ' ') JS chunks serve with a JavaScript content-type"

bold "Test — full city and research publication contract"
AUDIT_ORIGIN="$DOMAIN" node scripts/verify-release.mjs >"$LOG_DIR/cdpt-contract.log" 2>&1 || { tail -20 "$LOG_DIR/cdpt-contract.log"; die "published city data does not match this build"; }
ok "$(tail -1 "$LOG_DIR/cdpt-contract.log")"

printf "\n\033[1;32m✓ CDPT complete — %s is live and verified.\033[0m\n" "$DOMAIN"
