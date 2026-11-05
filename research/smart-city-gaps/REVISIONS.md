# Revisions · the smart-city gaps synthesis paper

## Why this file exists

Two manuscripts were built from the same brief and the same frozen data in the
same afternoon, by two agents working in parallel without either knowing about
the other. Only one of them can be the paper. This file records which one
shipped, why, and what was taken from the other — so the decision is inherited
rather than re-litigated, and so nothing that was earned is lost.

## What shipped

**`Four Gaps and One Chain: Where Thailand's Smart-City and Digital-Government
Promotion Stops Short of Action`** (10 pages, A4, two columns), built from
`paper.src.html` by `build.mjs`.

It shipped because it is the more honest of the two on the points that decide
whether a preprint survives review:

- It states the research question **in the questioner's own form** — four named
  hypotheses, H1 coordination, H2 procurement, H3 responsiveness, H4 the
  end-to-end monitoring-to-push chain — and then returns **a verdict for each**,
  including the two that do not flatter the authors. H3 is *consistent*; H1 and
  H4 are *weakly consistent*; **H2 cannot be tested, because procurement itself
  is not observed.**
- It reports the **fresh counts as well as the stale ones** (24 of 25 feeds
  inside their declared limit; 95.3% of PCD pulls under two hours old; 97.2% of
  flood-feed runs successful), so the reader can see the picture is partial
  rather than general.
- It scopes its own evidence honestly and repeatedly: a one-province absence
  cannot show a national one, a coherence test is not an accuracy test, a
  hand-off to a Telegram test chat is not arrival on a device, and no system it
  built issues a sanctioned public alert.
- It states the limits of its own inference: descriptive, cross-sectional, no
  outcome series, and written by an author who works for the agency whose
  programme is studied.

The alternative manuscript was more emphatic and more quotable. It made claims
the evidence does not carry — most importantly, it presented one province's
catalogue search and two national feeds as a national picture of the four gaps,
which is exactly the inference the shipped paper refuses to make. A preprint
that overstates is not a preprint that reads better; it is one that gets
returned.

## What was taken from the alternative

Not discarded — folded in:

1. **Appendix A1** — the per-city coding table (all 21 endorsed records, the
   chain stage of every headline project in the order the record lists them,
   the hazard-domain alert count, and whether the record names a partner). The
   shipped paper described the pattern in prose; the appendix makes it
   auditable city by city. Rows are generated from `out/flagship-coding.csv` at
   build time, never typed by hand.
2. **Appendix A2** — the twenty province indicators with publisher, vintage and
   provincial coverage, which is the evidence behind the paper's own staleness
   claim and its own limitation about unequal-vintage comparison.
3. **The two-column appendix section** (`.appx` in `paper.src.html`), so the two
   appendix tables sit side by side instead of on two half-empty pages.
4. **`set_pdf_metadata.py`** — Chrome copies the document title into a PDF and
   drops `<meta name="author">`, so the preprint landed in a reader's library
   with no authors on it. The step fills Title, Author, Subject and Keywords
   from the same strings the paper prints, so the file and the paper cannot
   disagree.
5. **The A4 metric** — 15 mm margins, a 7 mm gutter and a 86.5 mm column, which
   is what `figures.py` already sizes its figures to (3.41 in one column,
   7.09 in full width). The two must agree or the figures land wrong.

## The alternative's framing, kept here

The shipped paper is the cautious one. These sentences from the alternative are
kept in this file because they are the strongest available statement of the
thesis, and because a future revision may want them back in the Discussion
rather than in the abstract:

> Three of the four failures are the same failure wearing different clothes. A
> city cannot decide because it has no threshold it is willing to publish; a
> threshold cannot be published without agreement; agreement is not procurable,
> so it is never bought. The programme has sensors because sensors are
> procurable. It does not have decisions because decisions are not what
> procurement is for.

> A city that can warn its people is not smart because it has sensors. It is
> smart because somebody published the number, and somebody else was bound to
> act on it.

> The measurement was never the problem. We simply had not asked for it.

## Where everything is

| Thing | Path |
|---|---|
| Paper source | `paper.src.html` |
| Build (SVG inlining, appendix rows, PDF) | `build.mjs` |
| PDF metadata step | `set_pdf_metadata.py` |
| Figures (regenerated from `out/results.json`) | `figures.py`, `figures/*.svg` |
| The analysis every number comes from | `analysis.py` → `out/results.json` |
| Frozen inputs | `data/scity-snapshot-2026-11-05.json`, `data/province-baseline-2026-11-05.json`, `data/companion-evidence.json` |
| Public viewer and download | `public/research/smart-city-gaps/` |
