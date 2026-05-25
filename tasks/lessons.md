# Lessons · SCITI — Smart City Thailand Index (sciti.nonarkara.org)

Corrections log. Updated after every mistake. **Read at the start of every session.**
Per §13: the same mistake never happens twice.

---

## 2026-05-26 · Bootstrap: §13 adopted

- **What went wrong:** n/a — first entry
- **Correct behaviour:** Log every correction here. Read before each session.
- **How to recognise:** Any time you repeat a fix you've already made.

---

## 2026-05-26 · GitHub Actions token expired — always deploy manually

- **What went wrong:** CI fails with code 9109 (invalid CLOUDFLARE_API_TOKEN in GH secrets).
- **Correct behaviour:** `npx vite build && npx wrangler pages deploy dist --project-name=smart-city-thailand-index --branch=main --commit-dirty=true`
- **How to recognise:** CI green but sciti.nonarkara.org not updated = token expired.

---

## 2026-05-26 · Dev server is port 5188, not 3000

- **What went wrong:** n/a — reminder
- **Correct behaviour:** `npx vite --port 5188` (hardcoded in project config). Visiting localhost:3000 returns nothing.
- **How to recognise:** `ERR_CONNECTION_REFUSED` on 3000 = wrong port. Use 5188.

---

## 2026-05-26 · GISTDA ArcGIS — Thai field names, no pagination

- **What went wrong:** Querying with English field names (`pv_en`) and `resultRecordCount` both fail with 400.
- **Correct behaviour:** Use Thai field names: `pv_tn` (province), `ap_tn` (district), `tb_tn` (tambon). Use `where=` clauses to filter, never `resultRecordCount` or `resultOffset`.
- **How to recognise:** GISTDA 400 "Failed to execute query" = English field name. GISTDA 400 "Pagination is not supported" = remove resultRecordCount.

---

## 2026-05-26 · GISTDA Sphere API is JS SDK only — direct REST returns 401

- **What went wrong:** n/a — reminder
- **Correct behaviour:** Sphere API (Thai vector tiles, search, geocode) is browser-only JS SDK. Load via `<script src="https://api.sphere.gistda.or.th/map/?key={KEY}">`. Direct REST calls to `basemap.sphere.gistda.or.th` return 401 regardless of key.
- **How to recognise:** 401 on Sphere REST endpoint = use the JS SDK, not direct REST.

---

<!-- FORMAT for future entries:
## YYYY-MM-DD · [short title of the mistake]
- **What went wrong:** ...
- **Correct behaviour:** ...
- **How to recognise this pattern:** ...
-->
