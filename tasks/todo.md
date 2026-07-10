# Jury-impression audit (2026-07-10, Opus) — 4-lens pass: language / design / narrative / delight

4 parallel agents + my own live-browser verification. All findings below independently
re-confirmed against the actual source/live site before acting.

## EXECUTE NOW — real bugs & rule violations, low risk, high judge-visibility
- [x] newsData.ts:77 — Thai text leaked inside a Chinese string ("ดร.นนท์" → "Non Arkara 博士")
- [x] WhyPage.tsx:64 — Thai typo "ภายปี" → "ภายในปี" (not a word)
- [x] InvestPage.tsx:137 — "วิทยานิพนธ์" (academic dissertation) is a false-friend mistranslation of "investment thesis"
- [x] KnowledgePage.tsx:391-392,496 — Hospitality pillar rendered as "การท่องเที่ยว"/"人文旅游" (tourism) instead of canonical "อัธยาศัย"/"人文" used everywhere else — a judge cross-referencing FAQ vs rankings sees two different names for the same 10% weight
- [x] KnowledgePage.tsx:336-338 — EN has a closing sentence TH/ZH both drop
- [x] CreativeEconomyPage.tsx:107-109 — EN quote clause dropped from TH/ZH (a sourced claim, both languages silently truncate it)
- [x] CreativeEconomyPage.tsx:109 — "连接的组织" (ambiguous/awkward) → "纽带" (natural Chinese metaphor for "connective tissue")
- [x] "world-class" (explicitly banned AI-tell cliché) — 6 hits: PartnerVibeMap.tsx, cityContext.ts(×2), cityResearch.ts, depaOfficialData.ts(×2), cityAnalytics.ts — replace with the concrete claim already in the same sentence
- [x] styles.css:5690/5692 — .investor-card-score (#FFF200) and .investor-card-vibe (#FFC600) are two different yellows competing on the SAME card — consolidate to one
- [x] Inline font-size literals bypassing the 3-token law in JSX (CSS-only audit missed these): CityDetailPage.tsx:435,436,453,454,471,472,1282; MethodologyPage.tsx:717,724,733; RankingsPage.tsx:352
- [x] AuditPage.tsx domains[] array (pr/real gap %) — no claimRegistry backing on the one page whose thesis is "we source everything" — add an "illustrative model" caption (cheap, honest, matches the page's existing honesty pattern)
- [x] CityCanvasPage — genuinely empty "Pain Points"/"Business Model" boxes read as broken on a public route (confirmed via screenshot) — caption as "workshop template, fill in during a site visit" (NOT linked from nav/sitemap, so low-traffic, but cheap fix)
- [x] Weekly digest stale — weekOf 2026-06-29, today is 2026-07-10 (11 days) — research + refresh with a verified real story, matching the established Monday-ritual pattern

## ASK Dr Non — genuine judgment calls, not mine to decide unilaterally (STILL OPEN)
- [ ] Hero headline: "Moneyball for Thailand's Creative Economy" doesn't match the certification-vs-outcome thesis that's the actual "aha" (nor About's investment framing, nor Why's benchmarking framing) — 3 pages, 3 different pitches. Rewriting the site's single most important sentence is an aesthetic/messaging call.
- [ ] Institutional "เรา" (~24 instances, SCITI's own voice: "we rank," "our platform") — house rule says ผม-only but was written for personal voice; unclear if it's meant to extend to institutional/product copy.
- [ ] NST 131,908-friends proof point is buried 3 clicks deep behind a weaker stat (112,000 app users) on its own showcase page — recommend a homepage teaser card, but this touches the flagship page's composition.

## SKIP / DEFER (real but lower leverage vs risk, or already adequately handled)
- Bar-fill animations use `width` not `transform:scaleX` (GPU rule) — real, but moderate blast radius across many components for a mostly-invisible-to-judges perf nuance
- Letter-spacing tighter than -0.04em floor — mostly on large display numerals where tight tracking is typographically defensible per the auditing agent's own read
- Showcase Playbook Extensions using undocumented --radius-md/lg / --shadow-sm/md tokens — currently zeroed/harmless, just add a doc note so a future session doesn't "fix" them into visible radius/shadow
- AuditPage MISSION LOG — already honestly labeled "APRIL 2026 SNAPSHOT" in its own header, not deceptive
- /cities.json vs /data/cities.json redirect risk (agent worry) — VERIFIED both serve real JSON with 200, no actual risk

## Verify & ship
- [x] tsc -b, vitest run, eslint, build clean
- [x] visual re-check: homepage + investor section + city detail + methodology + rankings at 375px and desktop
- [ ] CDPT ship
