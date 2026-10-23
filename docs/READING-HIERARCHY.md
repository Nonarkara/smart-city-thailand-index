# Reading hierarchy repair · 23 October 2026

Owner request: the Phuket recognition panel showed a wall of equal-sized prose, evenly spaced groups and no clear reading path. This was also present in shared section typography.

Conservation rule: the same source content, scores, interactions and graphics remain available. This change reorganises presentation; it does not verify historic project claims or assert current service operation.

## Implementation

- Shared reading landmarks in `src/styles.css`: 32px chapter headings, 14px body explanations, 11.5px metadata using the existing three tokens/typefaces. Headings have bounded measure, stronger section rules and close relationships to the following paragraph. Detailed card headings remain secondary.
- City analysis: key card, panel and analogy explanations use body size. Labels become ordinary bold titles instead of tracked micro text. Cards follow their content height.
- `OfficialRecognition.tsx`: source date/batch, recorded total, stated vision, numbered examples, named partners and original PDF. A project total does not imply all examples are listed or currently operating. Thai source vision is used when available. Underlying project records remain unchanged.
- Investment reading sections: remove inline body-sized heading declarations and correct the later override that flattened the explorer's heading.
- Print retains source link and keeps the certification brief together. Chapter scroll margins account for persistent navigation.

## Verification

`src/OfficialRecognition.test.tsx` checks source content, exact list coverage, recorded total versus selected examples, operating caveat, original link and Thai vision.

`scripts/audit/reading-hierarchy.mjs` checks the actual computed cascade and screenshots at 390, 1024 and 1440px across Home, Phuket Overview/Analysis, Methodology, Invest and Rankings; checks chapter/body contrast, analysis prose, horizontal overflow and source containment; captures EN/TH/ZH and a tagged A4 PDF. Set AUDIT_ORIGIN to production to repeat on deployed bytes.

Independent review `hierarchy_review` passed all seven anti-slop rules: content-sized groups, balanced 40/60 reading composition, readable measure, preserved project fonts, meaningful section/index structure, distinct title/count/subheading/body levels, and no added decorative chrome. No blocker. Review noted scrolled screenshots could place the title behind sticky chrome; chapter scroll margins and an explicit final recapture address this. Existing methodology emoji tiles and inherited English source project wording are unchanged.
