# Handoff — Design Critique of the app (`index.html`)

## Status — implemented July 12, 2026

The critique backlog has been implemented in full. This handoff is now historical context,
not an open runbook.

- Deepened muted, link, freshness, and quality colors while preserving the warm palette;
  measured text contrast is at least 5.07:1 on cream and 5.75:1 on white.
- Shot defaults now render as real primary-text values, while retaining the existing
  last-shot fallback behavior.
- The shot sheet keeps the established portafilter-first ordering and keeps Save visible in
  a sticky bottom action. The critique's recommendation to demote portafilter metadata was
  explicitly declined after comparing against the live production app.
- Home now says “Current run.” The critique's proposed calendar-palette replacement was
  reverted after visual review; the established bean-ribbon colors remain intentional.
- Shot deletion now offers a five-second Undo action; the bean-delete confirmation gives
  Cancel greater visual weight.
- `DESIGN.md` now documents the real compact typography/radius ramps and accessible tokens.
- Verification: `npm test` 10/10 passing; `tests.html` and `test-e2e.html` report zero
  failures; Impeccable detector reports 0 findings; `git diff --check` passes.

> **Starting a new session?** This is orientation only. The findings themselves live in the
> critique snapshot — read that first, don't re-derive it.

## What the next session is doing

This began as a full `/impeccable critique` of the whole app (`index.html`). The critique is
**done and persisted**, and its backlog has now been implemented.

## Artifacts — read these first, do not re-derive them

1. **`.impeccable/critique/2026-07-12T16-08-25Z__index-html.md`** — the critique snapshot:
   heuristic scores (28/40), anti-pattern verdict, the 5 priority issues with concrete fixes
   and suggested commands, persona red flags, and detector output. **This is the backlog.**
   `/impeccable polish` reads this file directly.
2. **`PRODUCT.md`** — brand/voice/accessibility baseline. The critique judges against it
   (esp. the WCAG-AA commitment and the anti-motivational "no streaks" stance).
3. **`DESIGN.md`** — the token system. The P1 contrast fix and the token-drift cleanup both
   operate on these tokens.
4. **This file** — decisions + open questions captured nowhere else.

## How the critique was run (so it can be re-run identically)

- Command: `/impeccable critique` (no target → resolved to `index.html`, whole app).
- **Method: dual-agent** — Assessment A (design review) and Assessment B (deterministic
  detector + live browser overlay) ran as two isolated sub-agents, then were synthesized.
- Slug is `index-html`; re-running critique appends to the trend for that slug. This run is
  the **baseline (28/40)** — no prior trend.

## Findings at a glance (detail in the snapshot)

- **Score: 28/40** — "Good, solid foundation, clear fixes." Not AI slop.
- **2× P1:** (1) WCAG-AA contrast failures across `--text-muted`, all link text
  (`--amber-dark`), and most freshness/quality badges — only blue "Great" passes; (2)
  shot-stepper defaults render as grey placeholders yet are what gets saved (ambiguous).
- **2× P2:** Save button below the fold + optional Portafilter field placed first;
  "Current streak" (Home) vs "Current run" (Stats) wording conflict + calendar bean-ribbon
  hues colliding with the freshness palette.
- **1× P3:** shot swipe-delete is instant/irreversible with no undo; destructive button
  dominates the confirm dialog.
- **Detector:** 104 findings, but only 1 real warning (`layout-transition` L278, low impact);
  93 are font-size ramp-drift advisories. The overlay's `cream-palette` flag is a **false
  positive** (the `#F5F0E8` bg is the intentional brand background, not the AI-cream trap).

## Decisions locked in

- The app is genuinely well-designed; **fixes must deepen the warm palette, not replace it**
  (contrast fix = darker hues, same identity). Aligns with PRODUCT.md principle "polish
  surfaces, never remove substance."
- Contrast (P1) is the headline because PRODUCT.md explicitly commits to WCAG-AA and the
  current palette violates it.

## Resolved questions

1. **Which P1 first** — both were completed together.
2. **"Current streak" (Home) vs "run" (Stats)** — unified to “Current run.”
3. **Scope** — the full backlog, including P3 and token-drift cleanup, was approved.

## Clearest next action

No implementation work remains from this critique. A future session can run a fresh
`/impeccable critique index.html` to establish the post-fix score and trend from the 28/40
baseline. The separate combobox keyboard/screen-reader audit remains a possible future
accessibility pass; it was a persona observation, not one of the five approved backlog items.

## Watch-outs

- Any change to a **pure helper function** in `index.html` must be copied into `tests.html`
  in the same change (it carries verbatim copies — see AGENTS.md "Testing").
- Contrast fix touches `DESIGN.md` tokens *and* the `:root` CSS vars in `index.html` — keep
  them in sync, or the doc and the code diverge.
- Assessment A seeded sample beans/shots into localStorage on `localhost` during the run;
  that data is browser-profile-only and does not affect the repo.
