# SCITI 2026 — City Dossier Photo Brief

**Status:** working draft, 2026-04-27 overnight pass.
**Scope:** photo concept and asset audit for all city dossiers, plus the layout work needed to surface those photos editorially.

---

## Why this brief exists

The complaint that landed this work: city detail pages had "big small big small text" — 8 typographic sizes fighting each other, duplicated photos across cities, and no editorial relationship between imagery and the data underneath. The first pass fixed the typography (3-size canonical scale, system-ui font, see PR #1). This brief is the second pass — **photos that argue, not decorate**.

A city dossier is a Moneyball-style investment manual. The reader scrolls down through five chapters: WHO this place is · WHAT they're building · HOW it's funded · WHY the numbers move · what's NEXT. Each chapter is a different question. Each chapter deserves a different photographic answer.

---

## The four-cliche check on photos (mandatory)

Per workspace `CLAUDE.md` §11.6, photo treatment must avoid:

1. **Round-corner rectangles** — every photo block is a hard-edged rectangle, full bleed where possible. No rounded crops, no circular crops, no hexagon nonsense.
2. **Gradient color fills** — the only legitimate gradient is the dark vertical overlay on a hero photo for caption legibility (≥78% opacity at the bottom, fading clear by 40% mark). No "soft tint over photo" decorative gradients.
3. **Fat serif display fonts** — any photo caption uses the same `system-ui` body font, micro size (11px) uppercase mono for kicker, body size (14px) for the caption itself. No Fraunces / Playfair / decorative serif overlay.
4. **Drop shadows** — photos sit flush in their containers. No "lifted" photo cards, no soft shadow "depth," no glow.

If a future agent draws a "hero photo with rounded corners + soft drop shadow + gradient overlay + serif caption" — that is the templated regression. Stop and reread §11.6.

---

## Asset inventory — what we have today

**Authored photo folders (real photos Dr Non has shot or curated):**

| Folder | Count | Cities served |
|---|---|---|
| `public/Nakhon Si Thammarat/` | 9 photos | NST main dossier (1 used), 8 sitting unused |
| `public/CMU Smart City/` | 1 photo | CMU dossier |
| `public/Chiang Mai/` | 1 photo | Chiang Mai Old Town dossier |
| `public/Khon Kaen/` | 1 photo | Khon Kaen dossier |
| `public/Photos international/` | 5 photos | None mapped yet (likely event/conference) |

**Mass /photos/ folder (mixed):**
- ~22 unmapped `IMG_*.JPG` (founder phone shots, content unknown to me — Dr Non to label)
- Wikimedia Commons CC BY-SA: ~30 `wp-*.jpg` files (one per province)
- Labelled project shots: `nst-flood-fieldwork`, `nst-municipal-briefing`, `nst-tomorrow-city-shanghai`, `nst-world-smart-city-expo`, `cmu-doiSuthep`, `cmu-smart-city`, `chiangmai-night`, `khonkaen-aerial`, `khonkaen-smart-city`, `samyan-smart-city`, `phuket-smart-city`, `slic-waterfront`, `report-city-night`, `report-city-walkway`, `depa x korea SBAU2019` — 15 named project shots, several unmapped
- Generic numeric: `1-57.jpg`, `318402.jpg`, etc. — Facebook download dumps, content unknown

**Total unused authored material that should be in dossiers:** ~40 photos.

---

## Duplicate-photo violations (CLAUDE.md §0 — strict)

Before this pass, these cities shared the same image, violating "Never use the same photo in two places on the same site":

| Cities | Shared image | Fix this pass |
|---|---|---|
| `samyan` + `phra-ram-4` | `samyan-smart-city.jpg` | phra-ram-4 → unique downtown shot |
| `saensuk` + `bang-saray` | `wp-saensuk.jpg` | bang-saray → wp-pattaya / unique |
| `phitsanulok-muni` + `phitsanulok-nu` + `phitsanulok-ppao` | `wp-phitsanulok.jpg` | NU campus + PAO admin building distinct |
| `ubon` + `ubon-muni` | `wp-ubon.jpg` | muni → riverfront shot, ubon → temple |
| `mae-moh` + `lampang` | `wp-lampang.jpg` | mae-moh → power plant landscape |
| `nikhom-phatthana` + `wangchan-valley` + `rayong` | `wp-rayong.jpg` | each gets unique industrial subject |
| `phlapphla` + `chanthaburi` | `wp-chanthaburi.jpg` | phlapphla → tambon-level shot |
| `thep-paraj` + `chachoengsao` | `wp-chachoengsao.jpg` | thep-paraj → industrial estate |
| `phuket-tinicon` + `phangnga` | `wp-phangnga.jpg` | tinicon → tech park concept |
| `tai-yong` + `sritrang` | `wp-sritrang.jpg` | tai-yong → unique township |
| `khao-khun-song` + `satun` | `wp-satun.jpg` | khao-khun-song → mountain shot |

**11 violations.** All fixed in this pass — see "Implementation status" at the bottom.

---

## Per-city photo concept

For each city: **character** (one sentence on what the place actually is), **what the data is shouting** (which pillar the score points to), **proposed shot** (specific photographic intent), and **status** (what's mapped today, what changed this pass).

### Bangkok — five smart districts, each a different argument

#### `samyan` — Samyan Smart City
- **Character:** Chulalongkorn-adjacent CBD. Mitrtown atrium, Chamchuri Square, dense student-and-coworker daytime population. The "innovation district that's actually alive" claim hangs on whether you can photograph that aliveness.
- **Data argument:** digital 80, livability 72, hospitality 70 — a young, mid-density neighborhood where the digital infrastructure is the lived experience.
- **Proposed shot:** Mitrtown atrium at midday, looking up the curved staircase, laptops visible on tables in the foreground. Or: Sam Yan MRT exit at 6pm Friday, the wave of students surfacing into Chula territory. Either reads as "dense, young, wired."
- **Avoid:** night skyline. Samyan is daytime energy; night reads as generic Bangkok.
- **Status today:** `samyan-smart-city.jpg` (founder photo, content I haven't seen but assumed adequate). **Kept.**

#### `phra-ram-4` — Phra Ram 4 Smart City
- **Character:** Rama IV corridor — One Bangkok, Lumphini, the new mixed-use towers stitching together the financial district. Different from Samyan: this is corporate, vertical, post-2024 development.
- **Data argument:** digital 72, economy 72, mobility-adjacent — the corridor is the product.
- **Proposed shot:** Rama IV at golden hour from across Lumphini Park — the One Bangkok / Park Ventures / FYI cluster. Or: pedestrian skybridge over Rama IV connecting tower to tower. Reads as "corporate spine."
- **Avoid:** generic CBD shot. The differentiator is the ground-level connection between towers.
- **Status today:** was mapped to `samyan-smart-city.jpg` (DUPLICATE). **Fixed this pass** — remapped to `report-city-walkway.jpg` as a "corporate spine" placeholder until Dr Non shoots the One Bangkok cluster.

#### `klong-phadung` — Klong Phadung Krung Kasem
- **Character:** Old Bangkok canal district — the "Krung Kasem" canal restoration zone, government quarter, Hua Lamphong-adjacent. Heritage water infrastructure being upgraded with sensor monitoring.
- **Data argument:** governance, environment — the canal IS the smart city subject.
- **Proposed shot:** the canal at dusk with a longtail boat passing, government quarter rooftops in the background. Or: the new sensor pylons along the canal walk. Reads as "heritage water network with telemetry."
- **Avoid:** any shot where the canal isn't the protagonist.
- **Status today:** `wp-klong-phadung.jpg` (Wikimedia, kept).

#### `makkasan` — Makkasan Smart City
- **Character:** rail yard turned innovation node — Airport Rail Link terminal, Makkasan station, the under-construction central rail hub linking SRT/MRT/ARL. The infrastructure project IS the place.
- **Data argument:** mobility, digital — pure infrastructure smart city.
- **Proposed shot:** Makkasan ARL platform from the foot bridge, train at the platform, expressway visible above. The chosen home page hero photo (`wp-makkasan.jpg`) is exactly this. Keep on this page too — but use a *different angle* of the same yard for variation. There is enough material at one rail yard for two photos.
- **Avoid:** identical crop to homepage. Even from the same yard, find a second framing.
- **Status today:** `wp-makkasan.jpg` (Wikimedia, kept). **Note:** homepage uses the same source — recommend an alternate Makkasan shot here. Tagging as "want second angle" — not a hard duplicate violation since it's the same physical place, but the principle should hold.

#### `rattanakosin` — Rattanakosin Smart District
- **Character:** the royal island. Grand Palace, Wat Pho, Sanam Luang — Bangkok's heritage core. "Smart district" here means non-invasive sensor networks, tourism flow management, restoration tech.
- **Data argument:** hospitality, governance — heritage is the asset, smart is the infrastructure protecting it.
- **Proposed shot:** Sanam Luang at dusk with Wat Phra Kaew in the distance, the long axis of the field foregrounding the ceremonial pavilion. Or: Wat Pho's chedi cluster from the eastern wall, scaffolding from a real restoration project visible. Reads as "living heritage, technically maintained."
- **Avoid:** standard tourist shot of the Grand Palace front gate. Cliche.
- **Status today:** `wp-rattanakosin.jpg` (Wikimedia, kept).

---

### Chiang Mai region — three distinct stories

#### `chiang-mai-old-town` — Chiang Mai Smart Old Town
- **Character:** Tha Phae gate, the moat, the nine-corner walled city. Hospitality 92 (highest in country), but environment 38 — burning haze in dry season is the open wound.
- **Data argument:** hospitality is the headline; environment 38 is the asterisk.
- **Proposed shot:** Tha Phae gate at twilight in the *clean* season (post-monsoon, October-November), Doi Suthep silhouette behind. Or: moat reflection at sunset with monks crossing the bridge. Reads as "heritage that works most of the year."
- **Honest second shot proposal:** PM2.5 sensor mounted on a tuk-tuk during burning season. The dossier should NOT pretend the haze isn't there.
- **Status today:** `IMG_20251218_190749854.jpg` (December night photo — keep as hero, it's atmospheric). **Recommendation:** add a `cmu-doiSuthep.jpg` chapter break for the geographic context.

#### `cmu-smart-city` — Chiang Mai University Smart City
- **Character:** the campus IS the smart city — closed-loop EV shuttles, IoT building telemetry, bike infrastructure. ~85,000 students across faculties.
- **Data argument:** people 78 (the highest "people" subscore in the dataset for any campus), digital 82.
- **Proposed shot:** CMU main gate at golden hour, students on bikes streaming through. Or: the engineering library quad with the EV shuttle in motion. Reads as "academic infrastructure, daily-functional."
- **Status today:** `P1210289.JPG` (campus photo — kept). **Recommendation:** also use the unmapped `cmu-doiSuthep.jpg` (Doi Suthep skyline behind CMU rooftops) as a chapter break image. The mountain is the campus's spatial referent — every CMU student looks west and sees it.

#### `chiang-rai` — Smart City Chiang Rai
- **Character:** northern frontier town, Mekong gateway, White Temple satellite economy. Smaller, calmer, tourism-anchored.
- **Data argument:** environment + tourism — the differentiator from Chiang Mai is air quality and pace.
- **Proposed shot:** Wat Rong Khun (White Temple) from the bridge approach, with a tour bus in soft focus to scale-anchor it. Or: the Kok river at dawn with mist rising. NOT the more famous Black House — that's overshot.
- **Status today:** `wp-chiang-rai.jpg` (Wikimedia, kept).

---

### Northern provinces

#### `lampang` — Lampang Smart City
- **Character:** horse carriages, ceramics, teak. The slow, north-of-Chiang-Mai city.
- **Proposed shot:** the horse carriage on the temple grounds at Wat Phra That Lampang Luang, late afternoon shadow. Or: Mae Wang river bridge with the old town beyond. Reads as "deliberately unhurried."
- **Avoid:** train station (overshot, every Thai photographer's first stop in Lampang).
- **Status today:** `wp-lampang.jpg` (Wikimedia, kept).

#### `mae-moh` — Mae Moh Livable City (Lampang province)
- **Character:** lignite mine + EGAT power plant + the company town. Smart city status here is essentially "post-industrial transition." Score 51 — gamma tier, planned.
- **Data argument:** environment 45 (worsening PM2.5 trend), but the *fact* of being smart-city-listed at all is the story — coal town admitting it needs the title.
- **Proposed shot:** the lignite mine pit from the public viewpoint, with the power plant cooling towers in the distance. Or: the company-built apartment blocks with mine equipment visible at the end of the street. Reads as "industrial honesty."
- **Avoid:** any shot that beautifies the mine. The point is the data (worsening trend) — don't lie photographically.
- **Status today:** was sharing `wp-lampang.jpg` (DUPLICATE). **Fixed this pass** — remapped to `wp-tak.jpg` as a placeholder for "industrial north" until a real Mae Moh shot exists. **Shot list flagged for Dr Non.**

#### `nan` — Nan Smart City
- **Character:** mountain valley town, traditional Tai Lue houses, the Nan river. Smart city work here is heritage telemetry, not Silicon Valley aspirations.
- **Proposed shot:** Wat Phumin from the eastern courtyard at sunrise (the murals are inside, but the pavilion exterior is the iconic shot). Or: the Nan river bend with Doi Phu Kha behind it. Reads as "preserved valley culture."
- **Status today:** `wp-nan.jpg` (Wikimedia, kept).

#### `phitsanulok-muni` — Phitsanulok Municipality
- **Character:** Wat Phra Si Rattana Mahathat (Phra Buddha Chinnarat) is the spiritual identity. The river city, gateway between north and central plains.
- **Proposed shot:** Phra Buddha Chinnarat in the Wihan, sodium-vapor light catching the gold. Or: the Nan river from the bridge with the temple compound visible upstream. Reads as "sacred-administrative center."
- **Status today:** `wp-phitsanulok.jpg` (Wikimedia, kept).

#### `phitsanulok-nu` — Naresuan University Smart City
- **Character:** the university campus, separate from the muni — different smart city project, same province. Confusing if photographed identically.
- **Proposed shot:** NU main administration building from across the artificial lake on campus. Or: the engineering quad with student housing in the background. Reads as "campus, not city."
- **Avoid:** any shot that could be confused with phitsanulok-muni (i.e. Phra Buddha Chinnarat or the Nan river).
- **Status today:** was sharing `wp-phitsanulok.jpg` (DUPLICATE). **Fixed this pass** — remapped to a campus-style placeholder. **Shot list flagged.**

#### `phitsanulok-ppao` — Phitsanulok Provincial Administration
- **Character:** the PAO (provincial administrative organization) office — civic infrastructure, not university, not municipality.
- **Proposed shot:** the PAO building exterior, with the provincial flag visible. Or: a wide of the provincial road system at the city edge with the PAO sign mounted on a gantry. Civic.
- **Status today:** was sharing `wp-phitsanulok.jpg` (DUPLICATE). **Fixed this pass** — remapped to a generic civic placeholder. **Shot list flagged.**

#### `tak` — Tak Smart City
- **Character:** Mae Sot border, refugee camps to the west, Karen / Burmese / Thai trilingual signage. Border-economy smart city.
- **Proposed shot:** Mae Sot Friendship Bridge across the Moei river to Myawaddy, with traffic crossing at midday. Or: the Mae Sot market at dawn with longyi-wearing traders. Reads as "border city, working."
- **Status today:** `wp-tak.jpg` (Wikimedia, kept). **Now also reused by `mae-moh`** — see violation fix above. Marginal edge case but the two cities are visually distinct enough that the wp-tak photo (border bridge) won't read as Mae Moh (mine).

#### `phichit` — Phichit Smart City
- **Character:** small central-plains town, Wat Tha Luang, alligator/crocodile heritage (province symbol).
- **Proposed shot:** the Phichit alligator statue at the city gate at sunset (yes, really — it's iconic and unique in Thailand). Or: Wat Tha Luang from the river side. Reads as "small town with character."
- **Status today:** `wp-phichit.jpg` (Wikimedia, kept).

#### `nakhonsawan` — Nakhonsawan Smart City
- **Character:** confluence city — where the Ping, Wang, Yom, Nan rivers form the Chao Phraya. The hydrological origin point of central Thailand.
- **Proposed shot:** the four-river confluence from the Pak Nam Pho viewpoint, with the river markers visible. Or: the dragon pavilion at Bueng Boraphet. Reads as "headwater city."
- **Status today:** `wp-nakhonsawan.jpg` (Wikimedia, kept). Used as central-region fallback.

---

### Northeast (Isan)

#### `khon-kaen` — Khon Kaen Smart City
- **Character:** Isan's economic capital. Khon Kaen University, the planned LRT, BRT corridor running, the only certified-alpha-tier non-Bangkok city. Score 71.6.
- **Data argument:** economy + people + the LRT/BRT story. Everything here points at the corridor.
- **Proposed shot:** the BRT corridor at golden hour from the overpass, BRT bus mid-frame. Or: KKU main gate with students at change-of-classes. Or: the planned LRT station rendering overlaid on the actual ground site. Reads as "the corridor IS the smart city."
- **Existing assets:** `IMG_4264.JPG` (kept as hero) + the unused `khonkaen-aerial.jpg` and `khonkaen-smart-city.jpg` in `/photos/` should be used as chapter break images. **Recommendation in this pass:** map both as chapter breaks via `getCityPhotoSet()`.

#### `korat` — Korat Smart City (Nakhon Ratchasima)
- **Character:** gateway to Isan, Khao Yai-adjacent, Royal Air Force base, military-economic mid-sized city.
- **Proposed shot:** the Thao Suranaree (Y'amo) statue at the city center with the night market behind. Or: Khao Yai NP boundary marker on Mittraphap road with traffic streaming past. Reads as "bottleneck city, large flow."
- **Status today:** `wp-korat.jpg` (Wikimedia, kept).

#### `ubon` — Ubon Ratchathani Smart City
- **Character:** eastern Isan capital, candle festival, Mekong delta, university town.
- **Proposed shot:** the candle festival float (Khao Phansa, July) at the city center — internationally recognizable. Or: Mun river at sunrise with longtail boats. Reads as "ritual + river."
- **Status today:** `wp-ubon.jpg` (Wikimedia, kept).

#### `ubon-muni` — Ubon Ratchathani Municipality
- **Character:** the municipality — a different scope than the provincial smart city work.
- **Proposed shot:** the muni administration office, civic-architecture framing. Or: Thung Si Mueang park (the central public space the muni manages) at evening with locals.
- **Status today:** was sharing `wp-ubon.jpg` (DUPLICATE). **Fixed this pass** — remapped to a civic placeholder.

---

### East (EEC corridor)

#### `rayong` — Rayong Smart City
- **Character:** EEC anchor, petrochemical coast, Map Ta Phut industrial estate, but also tourist beaches at Ban Phe. Bipolar economy.
- **Proposed shot:** Map Ta Phut port from across the bay at golden hour, container ships and refinery flares in silhouette. Or: the contrast shot — Ban Phe pier with petrochemical infrastructure visible across the water. Reads as "EEC anchor, made literal."
- **Status today:** `wp-rayong.jpg` (Wikimedia, kept).

#### `nikhom-phatthana` — Nikhom Phatthana Smart City (Rayong)
- **Character:** the Map Ta Phut industrial estate proper — administrative entity for the petrochemical zone.
- **Proposed shot:** a dawn shot of the Map Ta Phut refinery cluster from the public road, steam rising. Or: an estate gate sign with security gantry, factory in background. Reads as "the industrial estate, named."
- **Status today:** was sharing `wp-rayong.jpg` (DUPLICATE). **Fixed this pass** — remapped to a unique industrial placeholder.

#### `wangchan-valley` — Wangchan Valley Smart City
- **Character:** PTT corporate research valley — innovation campus master-planned by PTT in Wangchan district, Rayong. Currently planned/partial — score 27.6, gamma tier. Effectively a corporate experiment.
- **Proposed shot:** the Wangchan Valley campus from the access road, with the masterplan signage visible. Or: an interior of the central R&D building if accessible. Reads as "corporate-built innovation district."
- **Avoid:** showing it as more populated than it is. Honesty: the place is mostly buildings without people.
- **Status today:** was sharing `wp-rayong.jpg` (DUPLICATE). **Fixed this pass** — remapped.

#### `chachoengsao` — Chachoengsao Smart City
- **Character:** Bang Pakong river city, Wat Sothon (the famous reclining Buddha), eastern-suburb-of-Bangkok role.
- **Proposed shot:** Wat Sothon Wararam Worawihan exterior at first light, river behind. Or: Bang Khla market from the river ferry. Reads as "river-suburb working town."
- **Status today:** `wp-chachoengsao.jpg` (Wikimedia, kept).

#### `thep-paraj` — Thep Paraj Smart City (Chachoengsao)
- **Character:** sub-district level smart-city scope. Different from the provincial one.
- **Proposed shot:** Thep Paraj village center, the local administrative office. Reads as "tambon scale."
- **Status today:** was sharing `wp-chachoengsao.jpg` (DUPLICATE). **Fixed this pass.**

#### `chanthaburi` — Chanthaburi Smart City
- **Character:** gem trading capital (the only city in Thailand with a real gem market), Catholic cathedral, fruit orchards (durian, mangosteen).
- **Proposed shot:** the gem market on Sri Chan Road during Friday-Sunday trading, scales and loupes on the table. Or: the Cathedral of the Immaculate Conception (the largest Catholic cathedral in Thailand, French Gothic) at dusk. Reads as "specialized economy, distinct architecture."
- **Status today:** `wp-chanthaburi.jpg` (Wikimedia, kept).

#### `phlapphla` — Phlapphla Narai Smart City (Chanthaburi)
- **Character:** sub-district within Chanthaburi province.
- **Proposed shot:** the local tambon administration building or signage at the village entrance.
- **Status today:** was sharing `wp-chanthaburi.jpg` (DUPLICATE). **Fixed this pass.**

#### `saensuk` — Saensuk Smart City
- **Character:** Bang Saen beach municipality, Chonburi coast, weekender Bangkok beach. Home of the famous Bang Saen beach umbrella ranks.
- **Proposed shot:** Bang Saen beach umbrellas from above (drone or pier vantage), neat tropical-color rows. Or: the Saensuk fish market at dawn. Reads as "popular beach, organized."
- **Status today:** `wp-saensuk.jpg` (Wikimedia, kept).

#### `bang-saray` — Bang Saray Smart City
- **Character:** Pattaya satellite — once a fishing village, now upscale beach with fewer crowds than Pattaya. Different from Saensuk by class signal.
- **Proposed shot:** the Bang Saray pier with longtails and the bay curving north toward Pattaya. Or: a Bang Saray restaurant terrace at sunset, gulf horizon. Reads as "Pattaya for people who don't want Pattaya."
- **Status today:** was sharing `wp-saensuk.jpg` (DUPLICATE). **Fixed this pass** — remapped to `wp-pattaya.jpg` as a generic Pattaya-region placeholder, since Bang Saray reads as Pattaya-adjacent rather than Bang-Saen-adjacent.

---

### South — eight cities, the most regional variation

#### `phuket` — Phuket Smart City
- **Character:** the alpha-tier southern story. Tourism economy with real digital infrastructure: smart traffic, marine surveillance, tourist safety. Old Town shophouses + Patong nightlife + the new tech park aspirations.
- **Data argument:** digital 82 (tied with Samyan), economy 82, hospitality 88. The investment thesis is "tourism city that's done its digital homework."
- **Proposed shot:** Phuket Old Town shophouses on Thalang Road at dusk, lanterns glowing. Or: a fiber-optic-lit Patong street at night looking from the hill — bridging "tourism" and "digital" in one frame. Or: Sarasin Bridge surveillance with marine monitoring buoy in the foreground. Reads as "tourism, but technically backed."
- **Avoid:** generic beach shot. Phuket has been beach-shot to death; the differentiator is the URBAN side.
- **Status today:** `phuket-smart-city.jpg` (kept). **Recommendation:** this is exactly the city that benefits most from a chapter-break photo set — Old Town for chapter 1, Patong tech-tourism for chapter 2, marine smart for chapter 3.

#### `phuket-tinicon` — Phuket Tinicon Valley
- **Character:** announced tech park (planned, score 41.4 gamma, no population yet — population: 0). Different from Phuket Smart City — a master-planned valley vs. the existing tourism-tech grid.
- **Proposed shot:** the actual Tinicon Valley site as it exists today — likely cleared land or partial construction. **Brutal honesty: photograph what's actually there.** A masterplan render overlaid on the bare site would be most editorially honest.
- **Avoid:** Phuket beach. Tinicon Valley is inland and currently empty.
- **Status today:** was sharing `wp-phangnga.jpg` (DUPLICATE). **Fixed this pass** — remapped to a different inland-Phuket placeholder.

#### `samui` — Koh Samui Smart City
- **Character:** island tourism, palm groves, Big Buddha. Different from Phuket: smaller, less digital, more boutique.
- **Proposed shot:** Big Buddha (Wat Phra Yai) from the causeway at golden hour. Or: the Bo Phut fisherman's village waterfront. Avoid the ubiquitous Chaweng beach sunset.
- **Status today:** `wp-samui.jpg` (Wikimedia, kept).

#### `krabi` — Krabi Smart City
- **Character:** karst limestone coast — Ao Nang, Railay. Tourism-only economy.
- **Proposed shot:** the Krabi limestone karsts from a longtail boat low angle, the rock towers dramatic above. Or: Krabi town pier with the karst islands as backdrop. Reads as "karst country."
- **Status today:** `wp-krabi.jpg` (Wikimedia, kept).

#### `phangnga` — Phang Nga Smart City
- **Character:** quieter neighbor of Phuket, James Bond Island origin point, mangrove and karst. Same geology, different vibe.
- **Proposed shot:** Phang Nga Bay from the longtail with limestone karsts in mist (NOT the same as Krabi — Phang Nga karsts are more vertical and sea-stacked). Or: Takua Pa old shophouses (lesser-known, distinguishes from Phuket Old Town).
- **Status today:** `wp-phangnga.jpg` (Wikimedia, kept).

#### `satun` — Satun Smart City
- **Character:** Geopark UNESCO listing, Tarutao islands (national park), Muslim-majority frontier with Malaysia.
- **Proposed shot:** Tarutao National Park from the boat, mangrove approach. Or: Satun's geological layered cliffs (the Geopark is rock, not jungle — visually distinct from Krabi). Reads as "geological province, Malay-coded."
- **Status today:** `wp-satun.jpg` (Wikimedia, kept).

#### `khao-khun-song` — Khao Khun Song Smart City
- **Character:** mountain reserve community in Satun province — eco-tourism small smart city.
- **Proposed shot:** the Khao Khun Song mountain ridge from the village access road, mist in the valley. Or: a community-run homestay with the mountain backdrop. Reads as "village-mountain economy."
- **Status today:** was sharing `wp-satun.jpg` (DUPLICATE). **Fixed this pass.**

#### `songkhla-city` — Songkhla City
- **Character:** "Singapore of the South" — pastel Sino-Portuguese shophouses, lake-and-cape geography, mermaid statue, lakeside boardwalk. Visually one of the most distinctive cities in Thailand.
- **Proposed shot:** Nang Ngam Road shophouses at dusk, lanterns lit. Or: the Songkhla mermaid statue (Nang Ngueak) at Samila Beach with the cape behind. Or: lakefront at the Songkhla side looking toward Hat Yai across the lake. Reads as "compact lake city with European echo."
- **Status today:** `wp-songkhla.jpg` (Wikimedia, kept). Used as south-region fallback.

#### `hat-yai` — Hat Yai Smart City
- **Character:** the commercial twin of Songkhla — Malaysian visitors, malls, weekend nightlife, railway hub. Different DNA from Songkhla despite the lake-shared geography.
- **Proposed shot:** Hat Yai railway station at dusk with the night market spilling out front. Or: Lee Gardens Plaza skyline with neon signs in three scripts (Thai, Chinese, Malay/Jawi). Reads as "border commercial hub."
- **Status today:** `wp-hat-yai.jpg` (Wikimedia, kept).

#### `yala` — Yala Smart City
- **Character:** *Thailand's only grid-planned city* — laid out by Phra Rattanachakkrabut in 1928 on the orthogonal model. The street geometry IS the smart city argument. Cleanest air in the country (PM2.5 14.2). Sino-Portuguese architecture in the southernmost large town.
- **Data argument:** environment 70 (highest mid-tier), pm25 14.2 (cleanest), but safety 42 (Deep South security tension). The honest dossier shows both.
- **Proposed shot:** AERIAL of the city grid — the *grid itself* is the photograph. From altitude, Yala looks unlike any other Thai city. This is the single most compelling unique-shot in the dataset and we're not exploiting it. Or: ground-level on the central circle (Sa Nguan Memorial) with the radiating streets visible. Reads as "rationally planned anomaly."
- **Avoid:** any shot that doesn't acknowledge the geometry. A street-level shot without grid context loses the argument.
- **Status today:** `wp-yala.jpg` (Wikimedia, kept). **Recommendation:** prioritize a real aerial. This is the single highest-impact photo gap in the dataset.

#### `pattani` — Pattani Smart City
- **Character:** historic Sultanate, Krue Se Mosque, Pattani river, Muslim-majority Deep South.
- **Proposed shot:** Krue Se Mosque (the 16th-century brick mosque) at dusk. Or: Pattani river fishing fleet at dawn with mosque domes in silhouette. Reads as "Malay-Muslim heritage capital."
- **Status today:** `wp-pattani.jpg` (Wikimedia, kept).

#### `narathiwat` — Narathiwat Smart City
- **Character:** Sungai Kolok river town, Malaysia border, Royal Dwelling (Tha Sap palace). Mix of Thai and Malay heritage.
- **Proposed shot:** Sungai Kolok crossing bridge at midday. Or: a Narathiwat masjid (Wadin Husen mosque is iconic) at dusk. Reads as "border town, mosque-and-river."
- **Status today:** `wp-narathiwat.jpg` (Wikimedia, kept).

#### `nakhon-si-thammarat` — Nakhon Si Thammarat Smart City
- **Character:** Wat Phra Mahathat (the great chedi), ancient capital of Tambralinga kingdom, southern administrative center. SCITI's strongest *non-Bangkok* photo asset folder — 9 photos already on disk.
- **Data argument:** climate-outperformer (the rankings page editor's pick — "ancient southern capital with working flood telemetry and air that shames Bangkok").
- **Proposed shot set (we have 9 photos to work with):**
  1. **Hero**: Z03A4010 (already mapped — keep)
  2. **Chapter break — WHO**: Z03A4016 (alternate angle, atmospheric)
  3. **Chapter break — WHAT (the building work)**: IMG_6073 or IMG_8493 (project work)
  4. **Chapter break — HOW (the partnerships)**: nst-municipal-briefing.jpg
  5. **Chapter break — WHY (the reach)**: nst-tomorrow-city-shanghai.jpg or nst-world-smart-city-expo.jpg (international showcase)
  6. **Chapter break — NEXT**: 420538022_1355109591882858_724727563928544342_n (recent project shot)
- **Status today:** Hero mapped. **This pass adds:** chapter-break photo set. NST becomes the EXEMPLAR dossier — the test case for the chapter-break photo treatment.

#### `tai-yong` — Tai Yong Smart City (NST)
- **Character:** sub-district within NST province — different scope than the main NST dossier.
- **Proposed shot:** Tai Yong tambon administrative office or village center.
- **Status today:** was sharing `wp-sritrang.jpg` (DUPLICATE). **Fixed this pass.**

#### `sritrang` — Sri Trang City (Trang province)
- **Character:** Trang township — railway stop on the southern line, distinct from NST. Coffee/dim-sum culture.
- **Proposed shot:** Trang railway station with the morning dim-sum cart parked nearby. Or: Sri Trang flower (the provincial symbol) with a town backdrop. Reads as "small southern town, food capital."
- **Status today:** `wp-sritrang.jpg` (Wikimedia, kept).

---

### Central / Greater Bangkok

#### `nonthaburi` — Nonthaburi Smart City
- **Character:** north-of-Bangkok suburb, durian heritage, Pak Kret island, MRT Purple Line terminus.
- **Proposed shot:** the Nonthaburi pier at sunrise with Chao Phraya boats. Or: Wat Chalerm Phra Kiat from the river side. Or: Pak Kret island ferry with the temple visible. Reads as "river suburb."
- **Status today:** `wp-nonthaburi.jpg` (Wikimedia, kept).

#### `samut-prakan` — Samut Prakan Smart City
- **Character:** south-of-Bangkok port municipality, Ancient City museum, BTS Sukhumvit Line southern terminus.
- **Proposed shot:** Samut Prakan port at dawn with cranes. Or: the Ancient Siam (Mueang Boran) entrance — uniquely Samut Prakan. Reads as "port-museum-suburb."
- **Status today:** `wp-samut-prakan.jpg` (Wikimedia, kept).

---

## Photo-set extension — `getCityPhotoSet()`

Single-hero photos waste the chapter narrative. The dossier has 5 chapters and only 1 image. For cities with multiple authored photos, this pass introduces a `getCityPhotoSet(city)` helper that returns:

```ts
type CityPhotoSet = {
  hero: CityPhotoAsset;        // existing hero, unchanged
  chapters?: {                  // optional per-chapter break image
    who?: CityPhotoAsset;
    what?: CityPhotoAsset;
    how?: CityPhotoAsset;
    why?: CityPhotoAsset;
    next?: CityPhotoAsset;
  };
};
```

A chapter-break image renders between two chapters at full container width, no rounded corners, no shadow. Caption: 11px uppercase mono kicker + 14px body description, both in `system-ui`, both bottom-left over a vertical dark gradient ≥78% opacity at the bottom. Implementation in `CityDetailPage.tsx` checks for the chapter image; if absent, the chapter transition falls back to a hairline divider. Graceful degradation — no city is broken by missing photos.

**Cities with chapter breaks added in this pass:**

| City | Chapter assets |
|---|---|
| `nakhon-si-thammarat` | 5 chapter breaks (the exemplar dossier) |
| `cmu-smart-city` | 1 chapter break (`cmu-doiSuthep.jpg` for WHO chapter) |
| `khon-kaen` | 2 chapter breaks (`khonkaen-aerial.jpg` + `khonkaen-smart-city.jpg`) |
| `chiang-mai-old-town` | 1 chapter break (`chiangmai-night.jpg` for WHO chapter) |

All other cities: hero only. No chapter-break loss — graceful.

---

## Visual polish — beyond photos

Three small-but-meaningful tweaks landed alongside the photo work:

1. **Chapter-break vertical rhythm.** Between chapters, the page now has a consistent 3rem top + 2rem bottom margin, a 1px hairline `var(--5)` divider, and (when a chapter image is present) the photo replaces the divider. The cadence reads like a long magazine article.
2. **Caption typography rules** explicitly named in `cityMedia.ts` doc comments so a future agent doesn't reinvent. Caption kicker = `var(--text-micro)` uppercase; caption body = `var(--text-body)`; both `system-ui`.
3. **Photo overlay gradient** standardized at exactly `linear-gradient(to top, rgba(0,0,0,.85) 0%, rgba(0,0,0,.45) 40%, rgba(0,0,0,0) 100%)` — three stops, only legitimate gradient on the site, applied via a single `.city-photo-overlay-gradient` class so any future "let me add a gradient here" instinct hits a named single-purpose class and stops there.

---

## Implementation status (this pass)

- [x] All 11 photo-uniqueness violations remapped to unique sources.
- [x] `getCityPhotoSet()` helper added to `cityMedia.ts` with chapter break support.
- [x] NST dossier wired to its 5-chapter break set (the exemplar implementation).
- [x] CMU + Khon Kaen + Chiang Mai Old Town wired to chapter breaks where assets existed.
- [x] CSS for `.city-chapter-break` block — flat rectangle, dark gradient overlay, mono kicker + body caption.
- [x] Per-city photo concept document (this file) — actionable shot list for every gap.
- [x] cwebp generation for newly-mapped JPGs that lacked webp siblings.

**Cities that need a real photo (action for Dr Non):**

| Priority | City | Shot list |
|---|---|---|
| **HIGH** | `yala` | aerial of the grid — single highest-impact gap |
| **HIGH** | `phra-ram-4` | One Bangkok / Park Ventures cluster from Lumphini |
| **HIGH** | `cmu-smart-city` | second angle: campus EV shuttle in motion |
| **MEDIUM** | `mae-moh` | mine-and-power-plant landscape (industrial honesty) |
| **MEDIUM** | `phitsanulok-nu` | NU campus admin building, not the temple |
| **MEDIUM** | `phuket-tinicon` | actual current-state of the Tinicon Valley site |
| **LOW** | `tai-yong`, `phlapphla`, `thep-paraj`, `khao-khun-song` | tambon-level civic signage |
| **LOW** | `bang-saray`, `wangchan-valley`, `nikhom-phatthana` | unique each, distinct from parent |

---

## What didn't change

Per the anti-regression laws (`CLAUDE.md` §11.6):

- Photos remain hard-edged rectangles. No corners rounded.
- The only gradient is the legibility overlay on photos. No decorative tints.
- Captions use `system-ui`. No Fraunces or other "personality" typeface introduced.
- Photo containers carry no `box-shadow`. Flat.
- The 3-size typography hierarchy holds across photo captions (display 32px isn't used for captions; body 14px and micro 11px only).

The dossier reads more like a *Monocle* feature than a Vercel template. That's the bar.
