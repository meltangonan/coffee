# Todo: Wrapped-Style Stats

Spec: `SPEC-gamified-stats.md` · Plan: `tasks/plan.md`
One commit per task. Every task: compute fns copied into tests.html, all existing tests stay green.

**Status: complete, including post-plan revisions (2026-06-10).** After shipping, user review
removed Brew patterns, Superlatives, and Fun totals (d07abfb) and added three replacements:
Sweet spot card (8b62916), Extraction zones card (e833bf1), and a 12-month volume chart in
the recap (c55889b). Final card order: Brew rhythm → Shots logged → Sweet spot → Extraction
zones → Monthly recap → Most pulled beans → Quality breakdown.

## Phase 1 — Brew rhythm
- [x] **T1** `computeBrewDayRuns` + `computeHeatmapWeeks` (compute + unit tests) — commit 130c4f1
- [x] **T2** Brew rhythm card (heatmap grid + run facts, e2e) — commit 754d92d

### Checkpoint A
- [x] Both test pages green (123 unit / 58 e2e) · heatmap verified at 375px · no console errors
- [ ] Human look at the heatmap

## Phase 2 — Brew patterns
- [x] **T3** `computeDayOfWeekPattern` + `computeBrewHourPattern` (compute + unit tests) — commit 3213fcc
- [x] **T4** Brew patterns card (headlines + bars + empty state, e2e) — commit 3213fcc
      (T3+T4 landed in one commit)

### Checkpoint B
- [x] All tests green · threshold shown both ways in e2e · copy audit done

## Phase 3 — Superlatives, totals, recap
- [x] **T5** `computeSuperlatives` + `computeFunTotals` (compute + unit tests) — commit 8354246
- [x] **T6** Superlatives + Fun totals cards (e2e) — commit 901c9f3
- [x] **T7** `computeMonthlyRecap` + recap card — commit 8ded23d

### Checkpoint C
- [x] Card order matches spec · 144 unit / 63 e2e green · mobile pass at 375px · copy audit done

## Phase 4 — Docs
- [x] **T8** CLAUDE.md updated (tabs, constants, Stats module, tests.html copy convention);
      spec task list + success criteria checked off

### Checkpoint D (final)
- [x] All spec Success Criteria verified · no new localStorage keys/deps · no console errors
