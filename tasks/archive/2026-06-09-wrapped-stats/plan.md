# Implementation Plan: Wrapped-Style Stats

*Source of truth: `SPEC-gamified-stats.md` (v2, approved 2026-06-09). This plan
operationalizes the spec's 8-task breakdown — it does not re-litigate any spec decision.
Task checklist: `tasks/todo.md`. Prior (shipped) effort's plan archived under
`tasks/archive/2026-05-22-shot-stats/`.*

*Outcome (2026-06-10): all 8 tasks shipped, then revised on user review — see the status
note in `tasks/todo.md` and the spec header for what was removed and added afterward.*

## Overview

Add three feature clusters to the existing Stats tab in `index.html`: a brew-rhythm heatmap
with run facts, brew-pattern facts (day-of-week, brew hour), and superlatives / fun totals /
monthly recap cards. Everything is derived live from `coffee_shots` / `coffee_beans` — no new
localStorage keys, no dependencies, no build step. Tone is Spotify-Wrapped observational
("who you are"), never motivational ("what to do"). Each task lands with its tests; all
existing tests stay green.

## Grounding Facts (verified in code)

| Fact | Location |
|---|---|
| `getShotStatsDate(shot)` = `shotDate \|\| createdAt`, canonical shot-date helper | index.html:2084 |
| `getWeekStart` — Monday-start weeks (`day === 0 ? -6 : 1 - day`) | index.html:2088 |
| Pure-fn + getter pattern to copy: `computeShotCounts(shots, refDate = new Date())` → `get statsShotCounts()` | index.html:2101 / index.html:2936 |
| Stats pane HTML — `stats-grid` with `.stats-card` sections | index.html:1401–1455 |
| Stats CSS block | index.html:312–335 |
| Hand-rolled SVG/CSS chart precedent (trend charts) | index.html:337–363 |
| **tests.html duplicates pure functions** ("Helper functions (extracted from app)", incl. its own `parseStatsDate`/`getWeekStart` copies) — every new `compute*` fn must be copied verbatim into tests.html | tests.html:48–128 |
| e2e pattern: assign fixtures to `app.shots` (dates relative to today via `localDateStr()`), `app.activateTab('stats')`, assert DOM via `data-testid` | test-e2e.html:328–342 |
| Whole stats grid is gated by `statsHasData` (total shots > 0) — per-card empty states only needed for threshold/recap gating | index.html:1395, 2942 |

## Architecture Decisions (from spec — fixed)

- Pure top-level `compute*` functions, wired as `stats*` getters on `app()`. All today-relative
  functions take `refDate = new Date()` as a parameter for testability (the `computeShotCounts` pattern).
- Heatmap = 12 full Mon-start weeks + current week (13 columns), intensity buckets 0/1/2/3+,
  CSS grid cells using cream→amber→espresso token steps. No chart library.
- Day-of-week uses `shotDate`; brew hour uses `createdAt` and only same-day-logged shots.
- Thresholds: day-of-week needs ≥10 shots across ≥3 distinct weeks; brew hour needs ≥10
  same-day-logged shots. Below threshold: quiet "still learning your rhythm" state.
- Recap = most recent *completed* calendar month, computed live, hidden if that month is empty.
- Card order: Heatmap/rhythm → Shots logged → Brew patterns → Superlatives → Fun totals →
  Monthly recap → Most pulled beans → Quality breakdown (existing cards keep their relative
  order; new cards are inserted between them).
- Copy: sentence case, quiet/craft/observational. No emoji, exclamation marks, records-to-beat,
  nudges, or urgency framing.

## Dependency Graph

```
parseStatsDate / getShotStatsDate / getWeekStart / addDays   (already exist)
    │
    ├── T1 computeBrewDayRuns + computeHeatmapWeeks ──► T2 Brew rhythm card (UI)
    ├── T3 computeDayOfWeekPattern + computeBrewHourPattern ──► T4 Brew patterns card (UI)
    ├── T5 computeSuperlatives + computeFunTotals ──► T6 Superlatives + totals cards (UI)
    │        (T5 longest-run reuses T1's run logic)
    └── T7 computeMonthlyRecap + recap card (compute + UI)
                                                 └──► T8 Docs (after all ship)
```

T1→T2, T3→T4, T5→T6 are strict pairs. The three clusters are independent of each other
(except T5 reusing T1's run walk), but land in spec order: rhythm → patterns → superlatives →
recap. Each cluster is a vertical slice — compute + unit tests, then UI + e2e — so the Stats
tab is fully working and shippable after every task.

## Conventions Checklist (applies to every task)

- [ ] New compute fns copied verbatim into tests.html (existing duplication pattern), same commit
- [ ] `compute*` / `stats*` / `data-testid="stats-*"` naming
- [ ] Dates only via `getShotStatsDate`, `getWeekStart`, `addDays`, `parseStatsDate`
- [ ] `refDate` parameter on any today-relative function
- [ ] CSS via design tokens + `.stats-card` patterns, no inline styles
- [ ] Copy reviewed against the no-motivational-framing rule
- [ ] All existing tests still pass in both test pages

---

## Phase 1: Brew Rhythm

### Task 1: Brew-day runs + heatmap data (compute)

**Description:** `computeBrewDayRuns(shots, refDate = new Date())` → `{ current, longest }`,
where a brew day is a calendar day with ≥1 shot keyed by `getShotStatsDate`; `current` counts
consecutive brew days ending today *or yesterday*, else 0. `computeHeatmapWeeks(shots, refDate
= new Date())` → 13 Mon-start week columns (12 full + current), each day
`{ date, count, bucket }` with buckets 0/1/2/3 (3 = 3+). Copy both into tests.html with unit tests.

**Acceptance criteria:**
- [ ] Runs: empty data → `{ current: 0, longest: 0 }`; single day; gap breaks run; run ending
      yesterday still "current"; run ending 2+ days ago → current 0; multi-shot day counts once;
      backdated shots (shotDate ≠ createdAt date) land on shotDate.
- [ ] Heatmap: exactly 13 columns; column 1 starts 12 weeks before `getWeekStart(refDate)`;
      bucket boundaries 0/1/2/3+ exact; days after refDate in current week present with count 0.

**Verification:** new unit tests green at `http://localhost:8000/tests.html`; existing tests green.

**Dependencies:** None. **Files:** `index.html`, `tests.html`. **Scope:** S

### Task 2: Brew rhythm card (UI)

**Description:** New first card in the stats grid: heatmap CSS grid (13×7, token-stepped
intensity classes) + run facts as quiet copy beneath ("Current run: 5 brew days · Longest: 12").
Cells expose "{date}: N shots" via `title` + `aria-label`. New `stats*` getters wire up T1 fns.

**Acceptance criteria:**
- [ ] Renders at top of Stats per spec card order; fits mobile width (~375px) without overflow.
- [ ] Cell intensity class matches bucket; tooltip/aria text correct.
- [ ] Run copy observational only — no urgency framing.

**Verification:** e2e seeds shots across known days relative to today, asserts cell counts/buckets
(`data-testid="stats-heatmap"`, per-cell testids) and run-fact text; manual check at mobile width
in browser; all tests green.

**Dependencies:** T1. **Files:** `index.html`, `test-e2e.html`. **Scope:** M

### Checkpoint A (after T1–T2)
- [ ] tests.html + test-e2e.html fully green
- [ ] Heatmap visually correct on mobile width, Monday-aligned, no console errors
- [ ] One commit per task landed; human look at the heatmap before Phase 2

---

## Phase 2: Brew Patterns

### Task 3: Brew patterns (compute)

**Description:** `computeDayOfWeekPattern(shots)` → counts per weekday (Mon–Sun) from
`getShotStatsDate`, busiest day, `eligible` flag (≥10 shots across ≥3 distinct Mon-start
weeks). `computeBrewHourPattern(shots)` → modal hour from `createdAt`, pooled only from shots
whose `createdAt` date equals their stats date (same-day-logged), `eligible` at ≥10 such
shots. Copy into tests.html with unit tests.

**Acceptance criteria:**
- [ ] Threshold gating exact at the boundary (9 vs 10 shots; 2 vs 3 distinct weeks).
- [ ] Backdated shots excluded from the brew-hour pool; legacy shots without `shotDate` count
      as same-day (stats date falls back to `createdAt`) — tested explicitly.
- [ ] Tie rule defined and tested (proposed: earliest wins — see Proposed Decisions).

**Verification:** unit tests green; existing tests green.

**Dependencies:** None (independent of Phase 1). **Files:** `index.html`, `tests.html`. **Scope:** S

### Task 4: Brew patterns card (UI)

**Description:** Card with headline facts ("Sunday is your biggest brew day", "Your brew
hour: 7am") + small Mon–Sun bar distribution (CSS bars per `.stats-quality-track` precedent).
Below threshold: quiet "Still learning your rhythm" state inside the card.

**Acceptance criteria:**
- [ ] Renders after the Shots logged card; facts hidden below thresholds with empty state shown.
- [ ] Bar distribution in Mon→Sun order, token colors.

**Verification:** e2e with an above-threshold seed (asserts headline + bars) and a
below-threshold seed (asserts empty state); all tests green.

**Dependencies:** T3. **Files:** `index.html`, `test-e2e.html`. **Scope:** M

### Checkpoint B (after T3–T4)
- [ ] All tests green; threshold behavior demonstrated in e2e both ways
- [ ] Copy audit of new card against the spec's "Never" list

---

## Phase 3: Superlatives, Totals, Recap

### Task 5: Superlatives + fun totals (compute)

**Description:** `computeSuperlatives(shots)` → biggest brew day ever `{ date, count }`,
longest run (reuse T1 logic), best Mon–Sun week by total shots `{ weekStart, count }`.
`computeFunTotals(shots)` → summed `doseIn` (g→kg), `yieldOut` (g ≈ ml, ml→L),
`extractionTime` (min→h), returning raw values + formatted strings. Copy into tests.html
with unit tests.

**Acceptance criteria:**
- [ ] Hand-calculated fixture values match; missing/zero numeric fields skipped safely.
- [ ] Biggest-day and best-week tie rules defined and tested (proposed: earliest wins).
- [ ] Unit formatting thresholds exact (e.g. 999 g stays g, 1000 g → kg; 59 min vs 60 min → h).

**Verification:** unit tests green.

**Dependencies:** T1 (run logic). **Files:** `index.html`, `tests.html`. **Scope:** S

### Task 6: Superlatives + fun totals cards (UI)

**Description:** Two cards — Superlatives ("March 14 · 5 shots" style facts) and Fun totals
(craft phrasing, no exclamation marks). Empty states when there is nothing to show.

**Acceptance criteria:**
- [ ] Render in spec order (after Brew patterns; recap slot follows).
- [ ] Values match seeds; observational copy only.

**Verification:** e2e assertions on both cards; all tests green.

**Dependencies:** T5. **Files:** `index.html`, `test-e2e.html`. **Scope:** M

### Task 7: Monthly recap (compute + UI)

**Description:** `computeMonthlyRecap(shots, beans, refDate = new Date())` → last *completed*
calendar month: shots pulled, days brewed, top bean, quality split, coffee ground, neutral
deltas vs the month before (delta omitted where the prior month is empty). Returns null →
card hidden when the recap month has no shots. Card lives in the grid like everything else.
Largest task — compute, card, and both test files; if it runs long, land compute + unit tests
first, then UI + e2e.

**Acceptance criteria:**
- [ ] Month boundaries correct, incl. year rollover (refDate in January → December recap).
- [ ] Card hidden when recap month is empty; deltas are neutral observations in copy.
- [ ] Delta math correct; prior-month-empty shows no delta rather than a misleading one.

**Verification:** unit tests for boundaries/deltas/empty months; e2e render assertion with
seeded prior-month shots; all tests green.

**Dependencies:** None hard (T5 patterns helpful). **Files:** `index.html`, `tests.html`,
`test-e2e.html`. **Scope:** M/L

### Checkpoint C (after T5–T7)
- [ ] Full Stats tab matches spec card order; both test pages fully green
- [ ] Manual pass at mobile width: no overflow, no console errors, copy audit across all new cards
- [ ] Every spec Success Criterion is now verifiable against the running app

---

## Phase 4: Documentation

### Task 8: Docs

**Description:** Update CLAUDE.md (new compute fns/getters in Key Functional Modules, Stats
card order, heatmap/threshold patterns, the tests.html copy-the-helpers convention if not yet
noted). Check off the spec task list + success criteria in SPEC-gamified-stats.md.

**Acceptance criteria:**
- [ ] CLAUDE.md reflects shipped behavior only (no aspirational text).

**Verification:** review diff. **Dependencies:** T1–T7. **Files:** `CLAUDE.md`,
`SPEC-gamified-stats.md`. **Scope:** XS

### Checkpoint D (final)
- [ ] Every spec Success Criterion checked against the running app
- [ ] No new localStorage keys (inspect DevTools), no new dependencies, no console errors
- [ ] All commits landed task-by-task; ready for human sign-off

---

## Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| tests.html copies drift from index.html originals | Med | Copy verbatim in the same commit; document the convention in CLAUDE.md (T8) |
| Today-relative logic untestable or flaky | Med | Every such fn takes `refDate`; e2e fixtures computed relative to today via `localDateStr()`/`addDays` (existing pattern) |
| 13×7 heatmap overflows mobile width | Med | Size cells via CSS grid to fit ~375 px; verify in browser at Checkpoint A before building more UI |
| Copy drifts motivational under iteration | Low | Copy audit at Checkpoints B and C against the spec's "Never" list |
| Month/week boundary bugs (year rollover, Sunday) | Med | Boundary cases are explicit acceptance criteria with unit tests (T1, T3, T5, T7) |

## Proposed Decisions (confirm at review — not fixed by the spec)

1. **Tie rules** (spec says "pick and test"): propose *earliest wins* everywhere — earliest
   weekday in Mon–Sun order for busiest day, earliest date for biggest brew day, earliest
   week for best week. Deterministic and simple.
2. **Heatmap cell testids:** `data-testid="stats-heatmap-cell-YYYY-MM-DD"` so e2e can target
   exact days.
3. **Commit cadence:** one commit per task, message style matching the repo (`feat: …` / `test: …`).
