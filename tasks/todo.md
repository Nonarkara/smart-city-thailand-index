# Hostile audit — fix list (2026-06-30)

39 verified findings, deduped into fix groups. Severity in brackets.

## A. Site content — factual & superlative (src/)
- [ ] CreativeEconomyPage.tsx:83-85 — Phetchaburi(Music)→Suphan Buri(Music); "the most"→"among the most"; ZH 普吉岛→普吉, 佛丕→素攀武里 [CRIT]
- [ ] CreativeEconomyPage.tsx:95-97 — drop "first platform of its kind in SE Asia" [HIGH]
- [ ] WhyPage.tsx:53 — drop "Thailand is the first country…" superlative [MED]
- [ ] RankingsMapView.tsx:336 — "49 certified"→"49 ranked" (49 = 37 certified + 12 promotion) [HIGH]
- [ ] cityFacts.ts:386 — ZH 清迈设计周→清莱设计周 (Chiang Rai not Chiang Mai) [HIGH]
- [ ] index.html:80 — JSON-LD contentUrl /cities.json→/data/cities.json [HIGH]
- [ ] NST ZH name 那空是贪玛叻→洛坤 across src/ (36 occ, canonical from cityNamesZh.ts) [MED]

## B. CEA submission docs (cea-submission/)
- [ ] content.json q16 — remove Kimi 9.7/10 sentence (th L134 + en L135) [HIGH]
- [ ] content.json verifiedFacts — remove "Kimi internal review scores" row (L334-336) [HIGH]
- [ ] content.json L182 — fix Thai doubled word "ผู้ชม ผู้เข้าชม" in proposal §4 bodyTh [HIGH]
- [ ] content.json L13 — align UNESCO list prose w/ table (finding 33) [MED]
- [ ] rebuild PDFs (build-form-pack.mjs); copy identical bytes to gdrive-pack [HIGH]
- [ ] archive cea-submission/form-docs/ → _ARCHIVE-DO-NOT-SEND/ (stale disqualifying claims) [HIGH]
- [ ] README.md — match shipped 3-PDF set (finding 32) [MED]

## C. Stale public report PDFs (CONFIRMED stale: "15 Alpha tier")
- [ ] HomePage.tsx:667-670 — remove Exec-Summary/Full-Report/Audit links (stale, contradict live data); keep CSV export + Methodology [CRIT]
- [ ] delete public/downloads/SCITI-2026-{Report,Executive-Summary,Audit}.pdf [CRIT]

## D. Design regressions (styles.css)
- [ ] 5668 — investor-section 2-color gradient fill → flat depa-blue [MED]
- [ ] 5683 — investor-card:hover drop shadow → remove [MED]
- [ ] 10177 — a4 sheet drop shadow → hairline border [LOW]
- [ ] add alias block for undefined tokens (--border/--surface-2/--radius-md/lg/--shadow-sm/md) [MED]
- [ ] 6px micro-labels (.38rem/.42rem) → readable floor; verify in preview [HIGH]
- [ ] 1251 — .chat-suggestion tap target → min 44px; gap 3→8px [HIGH]

## E. SEO/meta/deploy
- [ ] index.html twitter:card → summary (square logo) [LOW]
- [ ] .gitignore += dist_cf [LOW]
- [ ] rename .github/workflows/cloudflare-pages.yml → github-pages.yml [LOW]
- [ ] **DEPLOY FIX**: build base=/ to dist (postbuild → OG pages + sitemap), deploy `dist` not `dist_cf` [CRIT]

## Deferred (need Dr Non decision / token-level approval)
- Finding 16 — applicant identity (depa vs Dr Non) — needs his authorization call
- Finding 31 — --text-display 49px vs §11.7 doc 32px — global token, don't shrink all titles unilaterally
- Finding 17 — Moneyball weights stated vs computed — verify cityAnalytics, soften if mismatch

## Verify & ship
- [ ] tsc -b + vite build clean
- [ ] preview @390px: labels readable, no layout break
- [ ] commit + push (GH Pages) + wrangler deploy dist (proper)
- [ ] live: 99,918 absent, 131,908 present, CSV 200, no "Phetchaburi (Music)", no "15 Alpha"

# Bundle split for award submission (2026-07-02, Fable 5)
- [ ] vite.config.ts: manualChunks function form — all node_modules → vendor (react-dom currently leaks into index)
- [ ] App.tsx: CityDetailPage → lazy + warm-up (immediate on direct /city/ links, idle otherwise)
- [ ] RankingsPage.tsx: ComparisonGrid → lazy + Suspense (renders only in compare mode)
- [ ] CLAUDE.md: update page-loading pattern note
- [ ] Verify: build sizes before/after, tsc, tests, lint, preview smoke (/, /rankings compare, direct /city/phuket, mobile), deploy, live check
