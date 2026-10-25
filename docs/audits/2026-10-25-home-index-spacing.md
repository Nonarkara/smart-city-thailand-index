# Homepage index spacing — focused review, v1

Design Read: scan dimension, city and value as one record, then open the dossier.
Reference: Vignelli's Unigrid indexes. The title leads, names carry the record,
and source notes support it. Existing city names, values, source qualifications,
click targets, maps and other homepage sections are preserved.

## Findings and repair

- Stacked margins and section padding produced 72px and 104px gaps between
  lists and the next heading. One owner now sets each gap to 24px.
- Regional tiles were about 98–103px tall. Content-sized records are about
  58px, with a 44px minimum target and no decorative enclosing tile.
- Four desktop pillar columns truncated long names. Two comparison columns
  now let names wrap; the phone index remains one column.
- A negative tablet header gutter and a pseudo-element outside the menu
  button created 3px horizontal overflow. The menu now has a real 44px target,
  a contained pseudo-element, and positive 12–20px header gutters.
- The hero inset uses its containing shell, not the external viewport.

## Verification and independent review disposition

`scripts/audit/home-index-layout.mjs` measures TH/EN/CN at 390,719,720,1024,1440
and1980px, including the breakpoint neighbours. It captures actual screenshots,
checks zero sideways overflow, full city labels, usable target heights,
bounded section gaps and the preserved7/6/5 list counts. A rendered mutation
restores oversized section spacing and must be detected. Keyboard activation
must open a city route. Screenshots are local evidence, not source-text scans.

Independent reviewer `spatial_review` passed the focused change at390/1024/1440:
phone centre hit-test opened Phuket; keyboard Enter opened Chiang Mai; no
runtime errors. All findings are closed within this scope:

1. Content sizing: compact rows, approximately58px.
2. Composition: aligned label/name/value records instead of pale boxes.
3. Reading measure: long names wrap; source prose remains bounded.
4. Fonts: unchanged under CLAUDE.md's explicit project font rule. Not a new
   certification against the general skill's system-font ban.
5. Ornaments: enclosing card backgrounds/borders removed from these indexes.
6. Hierarchy: city names lead records; dimensions/regions support them.
7. Other slop: no new badges, copy, fake data, rounded corners or shadows.

This is not an approval of the whole homepage or a fresh source-data audit.
The reviewer specifically excluded the existing national road-safety
superlative and other sessions' active decision/data changes. Those are not
silently certified by a CSS repair. Source notes are retained, not independently
revalidated. The release must be built from this commit alone while unrelated
work remains in the main checkout.
