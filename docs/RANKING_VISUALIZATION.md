# Ranking Visualization Decision

Date: 2026-06-01

## Decision

Ranking rows must show all seven SCITI pillar scores directly. They must not collapse the city into a single composite bar as the default visual evidence.

The visible row pattern is:

- Livability
- Economy
- Safety
- Wellbeing
- Environment
- Hospitality
- Digital

The active lens score can still determine rank order and remain visible as the numeric score at the right side of the row. The pillar bars explain why the city has that shape.

## Why It Matters

SCITI is a public-interest index, not a leaderboard for spectacle. A single composite bar hides the tradeoffs that make one city different from another. Seven visible pillar bars make the assessment more transparent, easier to audit, and more useful for policy, investment, and city learning.

This also preserves the project instruction that ranking visualizations should show individual pillar bars, not one composite bar.

## Implementation

The rankings directory uses `CityPillarBars` in `src/RankingsPage.tsx`.

The component:

- renders seven always-visible bars in the canonical pillar order
- uses the existing `PILLAR_LABELS`, `PILLAR_WEIGHTS`, and `PILLAR_COLORS`
- keeps labels trilingual through the internal `Locale` type: `en`, `th`, `zh`
- exposes a full accessible text summary through `aria-label`
- does not introduce new scores, weights, or claims

The supporting CSS lives in `src/styles.css` under:

```css
/* City Pillar Bars: seven visible dimensions, never a hidden composite */
```

## Guardrail

`src/RankingsPage.test.tsx` verifies that a ranking row renders seven `.rank-pillar-bar` elements and no `.sparkline-composite` element.

If the rankings UI is redesigned again, preserve this rule: the first read of a city row should reveal the seven-pillar shape without hover, click, expansion, or animation.
