# Independent adversarial review: "Four Gaps and One Chain" (SCITI, v1.0, 5 Nov 2026)

Reviewer scope: PDF text (`pdftotext -layout`), `paper.src.html`, `analysis.py` (re-run in a scratch copy; `out/results.json` reproduces byte-for-byte), `out/*.csv`, `data/*`, `data/refs-verification-report.md`, and the four companion preprints in `/tmp/papers/`. Nothing in the project was edited except this file. Companion line numbers below refer to the `/tmp/papers/*.txt` extractions.

Overall: the arithmetic is clean. Every figure in the Abstract, 4.1-4.3, Tables 1-4 and Figures 2-5 that is derived from `results.json` reproduces (Wilson intervals, Cliff's delta, bootstrap CIs, Holm, medians, 25/77, 22/43). The problems are not arithmetic. They are (a) a mislabelled "no station" claim that contradicts the paper's own companion, (b) a forest plot with mixed polarity under one axis label, (c) several companion counts that are used for something the companion explicitly says they do not establish, (d) scope laundering (one-province audits and one-line project titles presented as national / programme-level evidence), and (e) a handful of causal or generality slips in the Discussion, Conclusion and Abstract.

---

## 1. Errors (must fix)

**E1. "Twelve provinces have no PCD PM2.5 station at all, and three of them host a certified city (Krabi, Pattani, Phang Nga)" is wrong, and so is Discussion "three certified provinces have no PM2.5 station".**
- Location: 4.3 (p.3); Discussion (p.5); Limitations "missing in 12 provinces" is fine; Fig. 4 caption "65 provinces with a PCD station".
- Evidence: `province-baseline` note for `pcd-pm25-annual`: the 65-province series is built from the PCD *annual report table* (90 stations in 65 provinces, data date 31 Mar 2025). The companion on haze (nobody-owns-the-haze.txt:150-152) says PCD's live network is "175 stations in 74 of 77 provinces ... Three provinces (Phetchaburi, Phang Nga and Ranong) have none". So only 3 provinces lack a station, and of the three the only certified one is Phang Nga. Krabi and Pattani are absent from the 2024 annual table, not stationless. The paper itself uses "three provinces have none" in 4.4 and Table 3 for the *other* count, so "12" and "3" both appear as "provinces with no station" with no reconciliation.
- Fix: "Twelve provinces are absent from the PCD 2024 annual table (which covers 90 of the network's stations); the live network (175 stations) leaves only Phetchaburi, Phang Nga and Ranong uncovered. One certified province (Phang Nga) has no station." Fix Fig. 4 caption ("65 provinces in the PCD 2024 annual table") and the Discussion sentence.

**E2. Figure 5 mixes polarity under the single axis label "Share showing the gap".**
- Location: Fig. 5 (p.4), `figures.py::fig_forest`.
- Evidence: the plot uses k/n as given. For 12 rows k = records *with the gap* (high = gap). For three rows k = records *without the gap*: "H1 Datasets carrying a location 6/311", "H2 Datasets about procurement 0/311", "H4 Shelters with a coordinate 0/177". These plot at about 0-2% under a label that says the gap share, when the gap share is 98-100%. A reader scanning the plot reads H1/H2/H4 gaps as the smallest. (Rendered page 4 confirms the three dots at the left edge.)
- Fix: plot 1 - k/n for those three (CI mirrored), or relabel and separate them. Also rename "Gauges with impossible bank level" (2.4%, a data-quality rate) so the axis is not read as prevalence of equal importance.

**E3. Figure 5 includes "H3 Records dated the 24th of a month, 130/139" as a gap prevalence. The companion says in so many words that this does not establish a gap.**
- Evidence: nst-last-mile.txt:32-33 "a pattern that does not establish measurement freshness"; Fig. 2 caption of that paper (line ~244) "Metadata dates do not establish observation freshness". The paper plots it as the most extreme H3 bar (94%) with no caveat.
- Fix: drop it from Fig. 5 or plot it in a separate "artefact" row with that caveat. Fig. 5 would then have 14 counts (fix "Fifteen" in 4.4 and the Limitations).

**E4. "10 of 13 forecast haze warnings never reached the Thai 24-hour standard" is presented as a responsiveness *gap* and then described as the warnings "mostly missed the standard". These are over-calls (false alarms), not misses, and it is the authors' own system, not the "open hazard estate".**
- Evidence: nobody-owns-the-haze.txt:281-287: "Of 21 forecast warnings in 7 provinces, 13 distinct province-days could be checked ... Only 3 of 13 reached 37.5 at any station ... 10 of 13 over-called, though not wildly: 6 reached 25 in the province mean." n = 13 province-days (of 21 warnings), not 13 warnings.
- Location: 4.4 text and Fig. 5 (H3), 4.5 "the haze system's forecast warnings mostly missed the standard", Table 3, abstract-level "freshness".
- Fix: remove from the "estate gap prevalence" panel (it measures the authors' own forecast skill, not the freshness or responsiveness of public data); in 4.5 say "ten of thirteen checkable warning days over-called". Say "province-days".

**E5. Table 3, GS row: "271 commits in 26 days" is a misreading.**
- Evidence: gauge-to-shelter.txt:134-135 and 461-464: 271 commits on 36 active days within a seven-week calendar span (15 Sep to 3 Nov); day 26 is when official warnings, geocoded shelters and the CAP export landed. Also the same paragraph says CNX began as a port of the authors' earlier Lopburi system, so the build times "measure an adaptation, not a first build" (gauge-to-shelter.txt:164-166, 465-467). 4.5 ("assembled gauges, fires, forecast and shelters in seven calendar weeks") omits that caveat.
- Fix: "271 commits over seven weeks; main links live by day 26; adapted from an earlier system".

**E6. Table 3 / 4.5 "13,766 alerts; median 6.7 min after gauge reading" and "raised its alerts a median 6.7 minutes after a gauge reading".**
- Evidence: rain-to-phone.txt:301-305: the 6.7 min median is over 162 water-level and precursor alerts that could be matched to a gauge timestamp, not over 13,766 alerts. It also "excludes delivery to a phone" and includes the publisher's own delay.
- Fix: "median 6.7 min over 162 matched alerts, excluding delivery".

**E7. "The flood system's 48-hour watchlist caught 84% of bank overflows ... at 12.5% precision" omits the companion's own limit on what that number is.**
- Evidence: rain-to-phone.txt:349-352 (302 of 358 station-days that reached level 5, 199 gauges, 40 days 25 Sep to 4 Nov, not 3 Jul to 4 Nov as in Table 3's window) and 3.4 (~line 196-200): "the skill measure scores the system against the same gauge network it reads. It tests coherence, not accuracy". 36 of those gauges carry impossible bank levels, which defines "level 5" for them.
- Fix: "caught 302 of 358 station-days that later reached level 5 on the gauge network it reads (a coherence test, 40 days)". Table 3 window for this cell should be 25 Sep to 4 Nov.

**E8. "GISTDA flood-frequency score" is a mislabel.**
- Location: 3.2 (p.3 top).
- Evidence: `src/provincialFloodData.ts` header: a hand-assigned 0-100 score "informed by" GISTDA repeat-flood polygons, 2011 record and DDPM lists, designed as a 25% factor in the SCITI Livability pillar; values are multiples of ~5 with editorial notes. It is a SCITI editorial rating, not a GISTDA product. Also, higher = *less* flood-prone, which the paper never states.
- Fix: "SCITI's own flood-frequency rating (a 0-100 editorial score informed by GISTDA polygons)". The conclusion (no independent comparison group) stands and is in fact stronger.

**E9. "177 official shelters" (Abstract, 4.4).**
- Evidence: gauge-to-shelter.txt:299-300: 177 *rows*, three repeat an earlier row, 174 distinct. Fix: "177 rows (174 distinct shelters)". Also 73/146 is at *stated capacity* (hypothetical full occupancy), not actual crowding (gauge-to-shelter.txt:309-318). Label in 4.4 and Fig. 5 ("Shelters beyond 20 people per toilet") should say "at stated capacity".

**E10. Fig. 5 caption "Windows 18 September to 4 November 2026" is inaccurate.**
- Evidence: haze audit ground record 17 Jul to 3 Nov, forecast pairs 7 Aug to 3 Nov, alert log 28 Sep to 3 Nov (nobody-owns-the-haze.txt:148-155); flood alert table 3 Jul to 4 Nov; Chiang Mai portal bake 19 Sep (GS says 19 Sep and 2 Oct); NST crawl 18 Sep. Fix: give per-source windows or "Windows 17 July to 4 November 2026".

---

## 2. Overclaims

**O1. Title and the Conclusion's first move are causal/locational.** Title: "Why ... Stalls Before Action"; Research question: "Is the failure ... explained by". Conclusion: "The failure is not in the sensors ... it sits where one agency's record has to become another's decision". Paper concedes (1, 6) there is no outcome series and cannot measure that promotion "failed". Also internally inconsistent: companions report 49.6% of river gauges silent, 36 gauges with impossible bank levels, 59% of river records without an observation in two hours (that is a sensor/data-layer failure, and is H3's own evidence). Fix: title e.g. "... Where the Chain Is Open"; drop "The failure is not in the sensors", or "mainly" with the numbers.

**O2. Discussion declaratives before the hedge.** "coordination fails because nothing live exists to coordinate around"; "Procurement of the first kind produces data of the first kind". H2 is unobserved (Table 4: "Not testable"). The "not a result" hedge arrives three sentences later. Rewrite in the conditional.

**O3. "Four cheap acts follow, each already tried on a small scale."** Not supported for (2) a purchasing requirement (nothing in the four systems tested a procurement rule; GS says it "made no purchase"), nor for (4) "one tested path from sensor to shelter" (no tested path exists: GS issues no public alert and the duty officer is "to be assigned"; NST has "no sanctioned push"; haze Telegram goes to "one or two test chats"; RP had 29 subscribers). "Cheap" is not costed (GS: "not ... the cost of a first build"). Also the Abstract's "the acceptance criterion the label now lacks" asserts something about depa's certification criteria that the paper never examined.

**O4. "Four working chains" / "four operating systems" (Abstract, 3.1, Table 3, 4.5).** Companions say: feasibility only (GS, NST), CNX "issues no evacuation order and no public alert", the NST system has no sanctioned push, the haze 7-second figure is the server hand-off to "one or two chats" and "not arrival on a device". Use "prototype systems" and add "to test chats" where the 7 s is quoted.

**O5. "Designation does not follow exposure" is generalised beyond what was tested.** Only annual PM2.5 was compared (flood was not). Yet Table 4 H1 basis says "designation does not follow exposure", and the Conclusion says "designation has not followed exposure". Also (a) 11 of the 25 designated provinces are in the South (44% vs 18% of all provinces by the registry's region field), where annual PM2.5 is low and the main hazard is flood, so a regional composition effect is built into the PM2.5 contrast; (b) the SCITI flood rating in the data, if used, would not support "opposite of need": 25 designated vs 5 other, median 60 vs 65 (lower = more flood-prone), Mann-Whitney p = 0.84 (my run), so no evidence either way; (c) "as places with a data mandate, publish more open data" (4.3) assumes a mandate nowhere documented. Restrict all statements to "haze (annual PM2.5)" and drop "opposite of need" or add that the CI includes 0 and p_unadj = 0.037 is not corrected.

**O6. "The provinces with the highest PM2.5 are mostly not designated: of the ten highest ... seven lack a certified city" is uninformative.** Base rate of non-designated among the 65 PM2.5 provinces is 66% (43/65); 7/10 = 70%. The worst province (Nan, 38) is designated, and three of the top nine are. Including the tie at 29 (Sukhothai, non-designated) it is 8/11. Either delete or state the base rate.

**O7. H1 "Consistent" rests on items that do not bear on coordination.** Basis lists (a) 1.9% of datasets with a location (a general provincial portal search of Chiang Mai, not "hazard-relevant records", the falsifier in Table 1; GS itself says concentration of publishers is "by construction", line ~173-175 and that "we did not test whether records ... can in fact be joined"); (b) "gauges and air-quality sources of different agencies disagree" (haze companion: 88% of the 23% disagreements are between the two cleanest bands and "GISTDA's offset largely explains" them, line 270-274; RP: part of the 2 km gauge discrepancy "is real", a convective cell, rest timing, line ~296-299), neither caveat is carried over; (c) "designation does not follow exposure" and (d) "45% of PM2.5 stations in Bangkok", which are about targeting and siting, not agency joining. NST's seven agency codes arrive "already in one aggregated response" (nst-last-mile.txt:200-209), which cuts against H1 and is cited in Table 3 as "bypassed". Suggest "Weakly consistent / indirect" for H1.

**O8. H4 "Consistent" and H3 "no response rules in endorsed records" rest on one-line titles.** Mean project text = 10.1 words. "No named path reaches a person" cannot be observed in a title, so the falsifier in Table 1 (endorsed records name an operating sensor-to-shelter path) could not have been met with this data type; the test cannot fail. Add this to Limitations. Same for "no decision hub ... described as receiving environmental or safety data" (4.2): literally true of titles; Phuket's IOC is "citywide data integration hub", so the inference is silence.

**O9. National generality.** Abstract: "In the open-data audits, 41% of resources could not be parsed, 6 of 311 datasets carry a location, none of 177 official shelters has a coordinate, and no procurement dataset was found among 311 datasets and 682 catalogue resources" reads as national. All of these are one province (Chiang Mai; "the result of one search"; GS line 296-299: "a search for one province cannot show a national absence"). Only 4.4's first line says "Chiang Mai". 4.4's heading "Gap prevalence in the open hazard estate" is also wrong: the 311 datasets are everything a province-keyed search returned, not hazard datasets (GS: "provincial bodies dominate by construction"). Table 4 H3 "Median dataset 1.1 years" is Chiang Mai; NST's catalogue median is 236 days (0.65 y). Add "(Chiang Mai)" in the Abstract, Table 4, and rename the 4.4 heading.

**O10. The 15 counts are selected without a stated rule, and counter-evidence in the same companions is omitted.** E.g. 24 of 25 CNX feeds with a declared limit inside it (GS:481-483); PCD pulls no older than two hours 95.3% of the time (haze:158-159); 79-86% of rain gauges and 86% DWR stations reported in the last three hours (RP:291-296); 97.2% of feed runs succeeded (RP:175-176). Table 4 says "several feeds are fresh" but the directly relevant H3 falsifier ("most hazard data are fresh against a declared limit") is met by the 24/25 count, which is classed as a system success and not plotted. State the inclusion rule (e.g. "all gap-shaped counts in the four papers") or add the fresh counts.

**O11. 4.1 "The label tracks delivery imperfectly (30 operational, 4 partial, 3 planned)".** The reality class is assigned by the authors' own team (stated in 3.1) so it is not an independent measure of delivery. Reword "on the SCITI team's own class".

**O12. "has run for a decade under the ... Acts"** (1). The acts are 2017 and 2019; the Procurement Act is not a smart-city promotion instrument. Say "since 2017".

---

## 3. Coding disagreements (flagship coding, 76 projects)

Important scope facts first:
- Each "project text" is a one-line title (mean about 10 words). "None" means "no link stated in a title".
- The records hold 28 to 60 projects where `projectCount` exists (Phuket 42, Khon Kaen 28, CMU 28, Makkasan 60); the 76 are 3-6 "key" projects per city (every 2022 record has exactly 3). The paper calls this a census, with Wilson intervals "over a census". It is a census of the headline projects, whose selection into "key" is unobserved. 4.2 should say "of the 76 headline projects", not "endorsed flagship projects" implying all.
- The CODE dict lives in `analysis.py` (a script drafted with Claude assistance); the paper says the second author coded. State who or what assigned the codes, and that the second author is conflicted.

My re-codes (domain E = env/safety/hazard per the paper's own stated rule "environmental monitoring, a natural hazard or public safety"):

| Project | Paper | I would code | Reason |
|---|---|---|---|
| Yala "Green Corridor ... landscape restoration" | E=1, none | E=0 | Landscape restoration is not monitoring, hazard or safety under the stated rule. |
| Samui "Island water and waste management: smart utilities" | E=1, none | E=0 | Utilities; and inconsistent with Khon Kaen waste (E=0). Either both 1 or both 0. |
| Khon Kaen "IoT-sensor waste management" | E=0, sense | keep E=0, but then Samui must be 0 | Consistency. |
| Phuket AI CCTV with face and plate recognition | E=1, sense | E=1 but flag as security surveillance | Crime/security CCTV is not a link in a hazard warning chain. Same for Yala "Smart safety and CCTV" and Saensuk "crime and incident surveillance". The text lists CCTV among "sensing" examples without separating it. |
| Khon Kaen Smart Ambulance (digital dispatch) | E=1, push | E=1, stage decide (or E=0 health) | Ambulance dispatch is EMS operations, not a warning pushed to a person at risk. It is the second of the "2 push". |
| Phang Nga "Takua Pa old town and Khao Lak disaster-resilience programme" | E=1, ambiguous | keep, but note title is mostly heritage | Fine as "programme only". |
| Phang Nga "maritime monitoring: water quality and vessel traffic management" | E=1, sense | sense (or decide: "traffic management") | Borderline. |
| Wangchan Valley "5G and IoT testbed campus" | E=0, sense | none | A testbed campus is infrastructure, not a stated sensing function (affects only the non-hazard row). |

Effect on headline counts (hazard-domain projects; sense / push / programme-only / none; Wilson 75% sense is 53-89%):

| Variant | n | sense | push | prog. | none |
|---|---|---|---|---|---|
| As published | 20 | 15 | 2 | 1 | 2 |
| Drop 3 security-CCTV/surveillance projects | 17 | 12 (71%) | 2 | 1 | 2 |
| Rule-faithful domain (Yala corridor, Samui utilities out) | 18 | 15 (83%) | 2 | 1 | 0 |
| Both of the above | 15 | 12 (80%) | 2 | 1 | 0 |
| Both, plus ambulance to non-push | 14-15 | 12 | 1 | 1 | 0 |

Cities with a sensing-or-higher hazard project (Fig. 2, 16 of 21): 14 of 21 if the three security items are dropped (Phuket and Yala lose their only hazard-domain sensing item). Direction is robust: sense is the majority, push is 1-2, decide in the hazard domain is 0 in every variant. The exact headline integers (20/15/2/1/2, 16 of 21, "2 of 21 records") are not robust to defensible recodes and should be given with this sensitivity table, ideally with a second independent coder (Cohen's kappa on a random half).

---

## 4. Statistics findings

`analysis.py` is correctly implemented for what it states; I found no leakage. Verified:
- Designation = at least one city with `status == "certified"`; 25 distinct provinces; all 77 province names map (empty `unmatched_province_keys`; Chon Buri / Chonburi, Lop Buri / Lopburi, Chainat / Chai Nat, Prachin Buri, Ayutthaya alias all resolve; the 22 vs 43 and 25 vs 52 splits agree with a direct re-count).
- `cliff()` sign: positive when designated higher; text and Fig. 4 caption agree. Mann-Whitney two-sided, tie-corrected asymptotic; p = 0.0365 (PM2.5), 0.405, 0.00022, 0.133. Holm over four: sorted ascending with running max, gives 0.1095, 0.405, 0.00089, 0.266, matches Table 2 (the "<0.01" for per-100,000 is true; actually 0.0009).
- Bootstrap: stratified percentile, 5,000 resamples, seeded; reproduces exactly. Per-100,000 arithmetic (datasets / population in thousands x 100) is right.
- The "no flood comparison" decision is justified, but for a different reason than stated. Scored provinces are exactly the provinces with a SCITI city record with metrics (49 cities: 37 certified + 12 promotion), so selection into the score follows certification; and the score is SCITI's own (E8). A 25 vs 5 test is computable (p = 0.84, my run) and would be uninformative, which is the better argument.

Issues a hostile reviewer would raise:
- S1. Not four independent tests: "open datasets, count" and "per 100,000" are the same variable normalised, so the Holm family overstates the number of independent looks in one direction and the headline "Holm p < 0.01" for per-resident publication is driven by the denominator, not publication (acknowledged in text, "a population effect"; it is an identity once the count medians are equal and populations differ). The population contrast (p = 0.003, delta +0.43) is a fifth, unadjusted, post hoc test and is quoted without "unadjusted".
- S2. "Provinces are independent units" is false for the exposure variable: haze is spatially clustered in the Upper North; Bangkok-metro provinces and southern provinces cluster in designation. Add a regional stratification or permutation within region; at minimum state it as a limitation. The region confound is large: 11/25 designated provinces are Southern (44%) vs 14/77 (18%).
- S3. The PM2.5 contrast is borderline: delta = -0.32, CI includes 0 (upper +0.0095), unadjusted p = 0.037, Holm 0.11; removing Bangkok moves p_unadj to 0.046. State plainly that it is "no evidence of a difference; direction negative", and drop "opposite of need".
- S4. The PM2.5 value is a mean of station annual means, with unequal station counts (Bangkok has many, other provinces one; haze companion: 60 provinces have exactly one station). Station-mean provincial values are not comparable across provinces. Mention.
- S5. "Population" is the NSO ICT-survey base (2022; the file's own note says it is "the LAST vintage in which the province table's value column holds population"), not the registered or census population; "residents" overstates it. Total 65.6 million. Fine for ranking, say so.
- S6. Wilson intervals "over a census" for Fig. 5: for GS/NST the portal "estate" is one search, which GS itself calls a census of one search; intervals describe coding uncertainty only. The tiny n = 13 on the haze forecast row has CI 50-92% (as plotted) and should not appear alongside n = 10,412.
- S7. Fig. 4 median labels "median 22" vs text "21.7"; the amber marker is the median with rounding to integers. Cosmetic.

---

## 5. Citation findings

Reference list and in-text citations match one-to-one (no missing, no extra, no wrong letters; 2026a-d = Gauge to Shelter, Haze, Rain to Phone, Last mile, consistent with the text). Crossref report: 27 of 28 DOIs OK (the one mismatch, Hevner, is not in this paper). Specific points:

- C1. Attribution beyond the cited work's scope:
  - Mattern (2015) for "a number becomes governance only when someone is obliged to act on it" (2). Mattern's essay is a critical history of the urban dashboard; that proposition is the authors', not hers.
  - Heeks (2006) is about health information systems in developing countries; cited, with Goldfinch (2007), for "Public IT projects fail often" and again (Discussion) as support for "procurement of the first kind produces data of the first kind". Titles/scope support only "IT projects fail". Edler & Georghiou (2007) and Mergel (2019) are cited for a specific rule ("require a documented machine interface, a licence and a freshness limit"); they support demand-side procurement and service teams in general, not that rule.
  - Nam & Pardo (2011) / Meijer & Rodríguez Bolívar (2016) for "outcomes depend on institutions, people and governance more than on technology": Nam & Pardo propose three dimensions (technology, people, institutions); "more than" is the paper's strengthening.
  - Basher (2006) / WMO (2018) for "fails at its weakest link, usually the last": "usually the last" is not in the cited titles' scope.
- C2. Not machine-verified: Jumnong & Lowatcharin 2022 (no DOI; the English bracketed title and "Phuket" description are the authors' translation), Holm 1979, Bardach 1998, Pressman & Wildavsky 1973, Pahlka 2023 (books or no DOI). The paper says the check was automated and that independent review is recommended; keep.
- C3. URLs: Procurement Act is hosted on corporate.airportthai.co.th (HTTP 403 to curl, unconfirmed; an unusual host for a statute); the Digitality Act mirror is on opendevelopmentcambodia.net rather than Krisdika or the Royal Gazette; Mattern (Places Journal) 403, unconfirmed. Prefer official sources and add "accessed" dates.
- C4. UN DESA 2024: I confirmed on the UN profile that Thailand is 52nd of 193 on the 2024 EGDI, 55th in 2022, and e-participation rank 42nd (2022: 18th). OK. Note the UN page labels the e-participation change "+24" while the rank fell by 24 places (sign error on the UN page); the paper is right.
- C5. depa 2024 (1 Jul 2024) is cited for "at least 105 smart cities for 2024-2027" together with depa 2026; only the 2024 page contains the target. The same 2024 page states 36 certified cities in 25 provinces (so 37 by Aug 2025 is consistent). The funnel mixes dates (proposals as of Jan 2026, declared as of Aug 2025), which 3.1 does state, but the Fig. 2 caption says "depa registry (January 2026)" for all.
- C6. The 2.8 / 21.3 style intervals cite Wilson (1927) correctly. Cliff 1993, Mann-Whitney 1947, Efron 1979, Holm 1979: correct.
- C7. Thai names and affiliations (title block): "นน อัครประเสริฐกุล" and "ปุ่น เที่ยงบูรณธรรม" match the Thai name forms in the NST companion; the HTML source has no stray space (the "ปุ่ น" in the PDF extraction is a text-extraction artefact). Chiang Mai University faculty name and depa Thai name are correct. The RCAD Thai name (สำนักงานเร่งรัดการวิจัยและนวัตกรรมเพื่อเพิ่มความสามารถการแข่งขันและการพัฒนาพื้นที่ (องค์การมหาชน)) is copied from the NST paper, reads ungrammatical ("ความสามารถการแข่งขัน", natural phrasing is "ความสามารถในการแข่งขัน" or "ขีดความสามารถในการแข่งขัน"), and I could not find an official source in a web search to confirm it. Verify against the Royal Decree. Romanisation: this paper and GS/NST use "Poon", the haze preprint uses "Pun"; the Thai ปุ่น is "Pun". Pick one for the series.
- C8. In-text order for the three Acts (DDES, Digital Government, Procurement) vs citation order (2017a = DDES, 2017b = Procurement, 2019 = Digital Government) do not line up; harmless but a careful reader will pair them wrongly.

---

## 6. Minor

- Abstract is a single dense paragraph of ~20 statistics; split headline results from the stance sentence. "(iv) the counts reported by four open early-warning systems we built and audited" — "audited" by the builders; say "self-audited".
- 4.1 "37 are declared (certified) (16.3%...)": fine, but the funnel 37/227 treats the 190 under review as failures; many were submitted recently (proposals vs time). State this.
- 4.2 "Fifteen ... stop at sensing ... CCTV": add "including 3 security-surveillance projects" (see section 3).
- 4.4 "114 of 173 rain and 30 of 51 river records ... had no observation in the previous two hours": companion: "dated coverage measurements, not permanent outage verdicts" (nst-last-mile.txt:257-259); Fig. 5 label "older than 2 h" includes missing observations.
- 2,230/10,412 gauge "records flagged stale": companion says these "include non-Thai and global series; they are not a census of unique Thai physical gauges" (nst-last-mile.txt:251-253); carry that clause. Table 4 "21-66% of records stale by stated limits" mixes a health-check flag, a 2-hour snapshot test and (omitted) 94% metadata date clustering; "by stated limits" is not accurate for the 2-hour windows (those are the authors', not the agencies' declared limits).
- "Two agencies' rain gauges ... correlated at only r = 0.67" (4.4): based on 40 closest pairs over 21 days in 738 hours with at least 1 mm/h; "only" is a judgement; say n.
- Table 3 haze cell "alert to Telegram median 7 s": add "to test chats; hand-off, not delivery".
- Table 3 NST window "Oct-Nov 2026": catalogue crawl is 18 Sep, build record 22 Jun to 4 Nov.
- Section 3.1 "20 open province indicators for 77 provinces": only 13 of the 20 have all 77; PM2.5 has 65, others 76. "for up to 77 provinces".
- Declarations: funding and CRediT "to be confirmed" in a v1.0 posting; "Data and code" repo path and sciti.nonarkara.org/research not verified by me. The competing-interests statement is good; consider also listing that `reality` classes and the "certified/promotion/registered" status label were assigned/maintained by the second author's team.
- The coding comment says "hand-coded ... by the second author"; the Declarations say AI assisted "analysis code"; the CODE dict is analysis code. Clarify provenance.
- Typographic: "in‐ter-agency", "re‐sources", etc. are line-break artefacts of the ‐ (U+2010) hyphenation in PDF extraction; fine visually, but search/copy will break words. Consider `hyphens: manual` for the abstract.
- Fig. 4: the Bangkok outlier (1,390 datasets) and Phichit (1,142) are visible; consider a log axis or mention that medians are used for that reason.

---

## 7. Ranked top 10

1. E1: "Twelve provinces have no PCD station ... Krabi, Pattani, Phang Nga" is wrong; the haze companion says only Phetchaburi, Phang Nga, Ranong lack stations. Only Phang Nga is certified. Contradicts the paper's own "three provinces have none".
2. E2: Fig. 5 mixes polarity under "Share showing the gap"; three rows (6/311, 0/311, 0/177) plot the complement near 0%.
3. O5/O6: "designation does not follow exposure" is generalised from one weak, non-significant PM2.5 contrast (flood not tested), with an unmentioned Southern-province composition confound and a top-10 argument that equals the base rate.
4. E3 + E4: Fig. 5 plots two counts the companions say do not show a gap (24th-of-month 130/139) or are the authors' own over-called forecasts (10/13 "missed"); "missed" is wrong (over-calls).
5. O9: Abstract and 4.4 present one-province (Chiang Mai) search results (311 datasets, 41% unparseable, 0 procurement, 177 shelter rows) as national, and call it the "hazard estate"; GS says one-province absence is not national.
6. Coding scope: the 76 "flagship projects" are one-line titles of 3-6 headline projects from portfolios of 28-60; H4/H3 falsifiers cannot fail on that data (O8); coding sensitive (3 security CCTV items, Khon Kaen ambulance as "push", Yala/Samui domain inconsistency): 20/15/2/1/2 becomes 15/12/2/1/0 under a rule-faithful recode.
7. O1/O2/O3: causal and mechanism language (title, "the failure is not in the sensors ... it sits where", "coordination fails because", "four cheap acts ... each already tried") and an "acceptance criterion the label now lacks" claim about certification criteria never examined.
8. E5, E6, E7: Table 3/4.5 misstate companions: "271 commits in 26 days" (is seven weeks; day 26 is the milestone and it was an adaptation), 6.7 min is for 162 matched alerts, 84% recall is a self-referential coherence test over 40 days.
9. E8: the "GISTDA flood-frequency score" is SCITI's own hand-assigned rating; the "cannot compare" conclusion is right, for the selection reason (a 25-vs-5 test gives p = 0.84).
10. O7/O10: H1 "Consistent" is carried by items that are not about coordination (and caveats dropped: 88% of air-band disagreement is cleanest-band offset); the 15 counts have no stated inclusion rule and the matching fresh counts (24/25 feeds inside limit, 95.3% PCD pulls fresh) are omitted.
