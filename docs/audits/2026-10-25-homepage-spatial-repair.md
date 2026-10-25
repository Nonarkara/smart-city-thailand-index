# Homepage opening spatial repair · 25 October 2026

The owner screenshot exposed a failure missed by token and route checks: a dark photograph occupied most of the opening while evidence and repeated body-size headings were separated by large gaps.

## Repairs and seven-rule review

1. Content fit: homepage hero now has automatic height; legacy 75vh, 58vh and minimum-height rules are overridden locally. At 1440×900 Thai hero falls from522px to379px; at390×900 from600px to542px. Text remains14px and title32px.
2. Composition: photo occupies40% on wide screens, a128px place strip on phones; the introduction and action determine the remaining height.
3. Reading measure: introductory and explanatory prose capped at65ch. Evidence blocks form three unequal desktop columns and one phone column.
4. Type: project-specific system Latin/IBM Plex Thai/Mono preserved per CLAUDE.md; this is the established exception to the generic skill font recommendation. No additional type sizes introduced.
5. Ornament: removed homepage text shadows and the empty32px row after the hero. No new cards, icons, filler assets or decorations.
6. Hierarchy: title leads, rankings action follows, Scope/Certification/Evidence explain limits. Repeated numeric opening headings are replaced with meaningful labels. Guide uses the light reading surface.
7. Chrome and content: compact metadata and edition stamp; digest date no longer labelled as overall data refresh. Replaced unsupported 'index measures outcomes', seven-city operating claim, and 'only rule' assertion with explicit local-verification guidance in all three languages.

## Verification

`node scripts/audit/home-reading.mjs` captures Thai/English/Chinese at390/1024/1440, asserts no horizontal overflow, primary action above844px, no empty inter-band row, and bounded hero height. Restoring75vh/600px fails the height guard. Evidence under `.tmp/home-repair/`.

Independent agent reviewed Thai+English at all three widths and hit-tested the rankings button through navigation. PASS for this bounded opening repair. Natural full-page scrolling revealed all sections; no content or interactive feature removed. Remaining nonblocking issues: long English eyebrow wraps, metadata ribbon scrolls with arrow affordance, repeated feedback invitations farther down the homepage. This is not a whole-system clearance.
