# Spec: Wrapped-Style Stats — "Spotify Wrapped for your espresso"

*Status: CLOSED 2026-06-10 — all success criteria verified, shipped to main. Kept as a
decision record; the live source of truth for current behavior is CLAUDE.md.*

*History: v2 approved and implemented 2026-06-09. Post-ship review (same day): the Brew
patterns, Superlatives, and Fun totals cards were removed at the user's request — shipped
and kept: brew rhythm heatmap + run facts, and the monthly recap. Added in their place: a
Sweet spot card (interquartile ratio and extraction-time bands across great+perfect-rated
shots, hidden below 10 qualifying shots) — the user's personal best-shot reference rather
than generic espresso standards. Added 2026-06-10, modeled on Strava's Training Zones and
Monthly Recap screens: an Extraction zones card (distribution of all timed shots across the
five extraction-time bands, hidden below 10 shots) and a 12-month volume bar chart at the
top of the monthly recap card. Targets the current local single-HTML app. Complements
SPEC.md (the public-app pivot) — everything here is client-derived and ports cleanly to
Supabase later; shareable recap cards are deferred to the pivot's dial-in-card work.*

## Objective

Make the Stats tab a source of delight and self-knowledge — Spotify Wrapped for your espresso
habit. The goal is **informational and fun, not motivational**: surprising, well-crafted facts
about how the user already brews. No progress tracking, no records to beat, no nudges to
change behavior. The user should occasionally open Stats just to enjoy looking at themselves
in the data.

Three feature clusters, in priority order:

1. **Brew rhythm** — calendar heatmap of brew days, with streak runs shown as facts.
2. **Brew patterns** — day-of-week and time-of-day facts ("Sunday is your biggest brew day").
3. **Superlatives, fun totals, and monthly recap** — identity facts and Wrapped-style summaries.

Explicitly out of scope (decided during brainstorm):
- Dial-In Speed or any skill-progression / improvement-over-time metric
- Motivational mechanics: "New record" toasts, streak-keeping nudges, goals
- Badges / trophy shelf
- Social features, feeds, leaderboards
- Shareable image export of recaps (deferred to the public-app pivot — see SPEC.md "dial-in cards")

### User stories

- As a data-curious brewer, I see my brewing rhythm at a glance — which days I brew, how dense my habit is.
- As someone who loves Wrapped, I learn surprising facts about my own patterns: my biggest brew day of the week, my usual brew hour.
- I get a "whoa" moment from cumulative totals (kilos ground, liters pulled, hours watching extractions).
- At the start of a new month, I can look back at last month's brewing in one Wrapped-style card.
- Nothing in the tab tells me what to do — it only tells me who I am.

## Assumptions (validate before implementation)

1. **No new localStorage keys.** Every stat is derived live from `coffee_shots` /
   `coffee_beans`. Nothing is stored, diffed, or tracked across sessions.
2. **A brew day** = a calendar day with ≥1 shot, keyed by `getShotStatsDate(shot)`.
   "Current run" counts consecutive brew days ending today or yesterday; "longest run" is the
   max over all history. Both are presented as observations, not challenges.
3. **Day-of-week patterns** use `shotDate` (always trustworthy). **Time-of-day patterns** use
   `createdAt`, and only for shots logged the same day they were pulled (i.e.
   `createdAt` date equals `shotDate`) — backdated shots have meaningless clock times.
4. **Minimum-data thresholds:** pattern facts only render once they're credible — e.g.
   day-of-week facts need ≥10 shots across ≥3 distinct weeks; brew-hour facts need ≥10
   same-day-logged shots. Below threshold, the card shows a quiet "still learning your
   rhythm" empty state. Wrapped facts on five shots feel silly.
5. **Heatmap lives in the Stats tab** (compact, intensity-based). The Calendar tab is unchanged.
6. **Weeks start Monday**, matching existing `getWeekStart`.
7. **Recap = most recent completed calendar month**, computed live. No history browser in v1.

## Tech Stack

- Single-file app: `index.html` (Alpine.js 3.x via CDN, vanilla JS, inline CSS)
- No build step, no new dependencies. Charts/heatmap are hand-rolled SVG/CSS like the
  existing Trends charts.
- Persistence: localStorage (`coffee_beans`, `coffee_shots`) — read-only for these features.

## Commands

```
Serve app:   python3 -m http.server          # then open http://localhost:8000
Unit tests:  open http://localhost:8000/tests.html
E2E tests:   open http://localhost:8000/test-e2e.html
```

No build, lint, or package commands exist for the local app.

## Project Structure

```
index.html              — All feature code lands here (CSS ~line 31+, HTML Stats pane
                          ~line 1390+, JS helpers ~line 2080+, app() object ~line 2360+)
tests.html              — Unit tests for the new pure compute functions
test-e2e.html           — Integration tests for Stats tab rendering with seeded data
SPEC-gamified-stats.md  — This spec
SPEC.md                 — Public-app pivot spec (separate effort; do not modify)
brainstorms/            — Background design docs (do not modify)
```

## Feature Details

### 1. Brew rhythm (heatmap + runs)

- **Heatmap**: GitHub-style grid of the last 12 full weeks + current week. Columns = weeks
  (Mon-start), rows = days. Intensity buckets: 0 / 1 / 2 / 3+ shots, using cream→amber→espresso
  steps from existing design tokens. Tap/hover shows "{date}: N shots" via `title`/aria-label.
- **Run facts**, displayed beneath the heatmap as quiet copy, not a hero number:
  "Current run: 5 brew days · Longest: 12". No urgency framing, no "don't break it" cues.

### 2. Brew patterns

- **Day-of-week**: shot counts per weekday from `shotDate`; the headline fact is the busiest
  day ("Sunday is your biggest brew day"), with a small bar distribution (Mon–Sun) beneath.
- **Brew hour**: from same-day-logged shots only (assumption 3); headline is the modal hour
  ("Your brew hour: 7am") — bucket by hour, pick the peak.
- Both gated by the minimum-data thresholds (assumption 4).

### 3. Superlatives, fun totals, monthly recap

- **Superlatives card** — identity facts, framed as observations rather than records:
  - Biggest brew day ever ("March 14 · 5 shots")
  - Longest run of brew days
  - Best week — most total shots in a Mon–Sun week ("week of May 5 · 18 shots")
- **Fun totals card**: total coffee ground (sum `doseIn`, shown in g/kg), total espresso
  pulled (sum `yieldOut`, g ≈ ml, shown in ml/L), total time watching extractions
  (sum `extractionTime`, shown in min/h). Craft phrasing, no exclamation marks.
- **Monthly recap card**: last completed month — shots pulled, days brewed, top bean,
  quality split, coffee ground, vs.-previous-month deltas where meaningful (deltas are
  neutral observations, not progress judgments). Hidden if that month has no shots.
  Lives in the Stats tab as a card like everything else — no overlay or one-time moment.

### Stats tab card order (proposed)

Heatmap/rhythm → Shots logged (existing) → Brew patterns → Superlatives → Fun totals →
Monthly recap → Most pulled beans (existing) → Quality breakdown (existing).

## Code Style

Match the existing codebase exactly. New computables are **pure top-level functions**
(testable in `tests.html`), wired into `app()` as getters — the established pattern:

```javascript
function computeBrewDayRuns(shots, refDate = new Date()) {
  const days = new Set();
  for (const shot of Array.isArray(shots) ? shots : []) {
    const d = getShotStatsDate(shot);
    if (d) days.add(toISODate(d));
  }
  // ... walk days for current run (ending today/yesterday) and longest run
  return { current, longest };
}

// in app():
get statsBrewDayRuns() { return computeBrewDayRuns(this.shots); },
```

Conventions:
- `compute*` prefix for pure stat functions, `stats*` prefix for app() getters,
  `data-testid="stats-*"` on testable nodes.
- Dates via existing helpers (`getShotStatsDate`, `getWeekStart`, `addDays`) — never
  re-derive week/day logic inline.
- CSS uses existing design tokens and `.stats-card` patterns; no inline styles.
- Copy tone: quiet, craft, observational, sentence case. Facts, not commands or cheers.
  No emoji, no exclamation marks, no confetti.

## Testing Strategy

- **Unit (`tests.html`)** — every `compute*` function:
  - Brew-day runs: empty data, single day, gap breaks a run, today/yesterday boundary,
    backdated shots, multi-shot days counted once.
  - Heatmap buckets: 0/1/2/3+ boundaries, Monday alignment, 13-week window edges.
  - Patterns: threshold gating (just below / at threshold), busiest-day ties, backdated
    shots excluded from brew-hour, modal-hour bucketing.
  - Superlatives: biggest day ties (earliest wins or latest — pick and test), best-week
    boundaries on Mon-start weeks.
  - Totals: missing/zero fields skipped safely; unit formatting thresholds (g→kg, ml→L).
  - Recap: month boundaries, empty previous month, delta calculations.
- **E2E (`test-e2e.html`)** — seed localStorage, load app in iframe, assert heatmap cells,
  run facts, pattern facts, superlatives, totals, and recap render with expected values;
  assert below-threshold and no-data empty states.
- All existing tests must keep passing.

## Boundaries

- **Always:** keep stat logic in pure top-level functions; use `getShotStatsDate` for all
  shot-date logic; use design tokens; write unit tests alongside each compute function;
  gate pattern facts behind minimum-data thresholds; update CLAUDE.md module/pattern docs
  when done.
- **Ask first:** adding any localStorage key; adding any dependency; changing the Shot or
  Bean schema; reordering/removing existing Stats cards; any animation; deviating from the
  Mon-start week convention.
- **Never:** external chart libraries; motivational mechanics (toasts, nudges, goals,
  progress framing); social/sharing features in this round; confetti or celebratory sound;
  hardcoding freshness day numbers; breaking existing tests; modifying SPEC.md (the pivot
  spec) as part of this work.

## Success Criteria

- [x] Heatmap renders 13 columns (12 full weeks + current), correct Monday alignment, correct intensity per day.
- [x] Run facts show correct current and longest brew-day runs for seeded fixture data.
- [x] Day-of-week and brew-hour facts are correct for fixture data, and hidden below the data thresholds.
- [x] Brew-hour calculations exclude backdated shots.
- [x] Superlatives and fun totals match hand-calculated values, with correct unit formatting.
- [x] Monthly recap shows the last completed month with correct counts and deltas.
- [x] No copy anywhere in the new cards uses motivational framing (records, goals, encouragement).
- [x] All new compute functions have unit tests; all tests (old + new) pass in both test pages.
- [x] No new localStorage keys, no new dependencies, no console errors.

## Resolved Decisions (2026-06-09)

1. No "bags of beans" equivalent in fun totals.
2. Heatmap window: 12 full weeks + current week.
3. Best-week superlative: most *total* shots in a Mon–Sun week.
4. Everything lives in the Stats tab as cards/sections — no overlays, no one-time moments.
5. Minimum-data thresholds accepted as specced (10 shots / 3 weeks for day-of-week;
   10 same-day-logged shots for brew hour).

## Implementation Tasks

Ordered by dependency. Each task lands with its tests; all existing tests keep passing.

- [x] **1. Brew-day runs + heatmap data (compute)** — `computeBrewDayRuns` (current/longest,
  today-or-yesterday rule) and `computeHeatmapWeeks` (13 Mon-start columns, 0/1/2/3+ buckets).
  - Acceptance: correct values for fixtures covering gaps, boundaries, backdated and multi-shot days.
  - Verify: new unit tests green in `tests.html`.
  - Files: `index.html`, `tests.html`
- [x] **2. Brew rhythm card (UI)** — heatmap grid + run facts copy in the Stats pane.
  - Acceptance: renders per spec at top of Stats; cells expose "{date}: N shots" via title/aria-label;
    matches design tokens; observational copy only.
  - Verify: manual check on mobile width; e2e assertion for cell counts and run text.
  - Files: `index.html`, `test-e2e.html`
- [x] **3. Brew patterns (compute)** — `computeDayOfWeekPattern` and `computeBrewHourPattern`
  (same-day-logged filter, modal hour, threshold gating).
  - Acceptance: thresholds gate exactly at the boundary; backdated shots excluded from brew hour; tie handling defined and tested.
  - Verify: unit tests green.
  - Files: `index.html`, `tests.html`
- [x] **4. Brew patterns card (UI)** — headline facts + Mon–Sun bar distribution; "still
  learning your rhythm" empty state below threshold.
  - Acceptance: renders per spec; hidden facts below thresholds.
  - Verify: e2e with above- and below-threshold seeds.
  - Files: `index.html`, `test-e2e.html`
- [x] **5. Superlatives + fun totals (compute)** — `computeSuperlatives` (biggest day,
  longest run, best week by total shots) and `computeFunTotals` (g/kg, ml/L, min/h formatting).
  - Acceptance: hand-calculated fixture values match; tie rule for biggest day defined and tested; unit thresholds correct.
  - Verify: unit tests green.
  - Files: `index.html`, `tests.html`
- [x] **6. Superlatives + fun totals cards (UI)** — two Stats cards, observational copy.
  - Acceptance: renders per spec; empty states when no data.
  - Verify: e2e assertions.
  - Files: `index.html`, `test-e2e.html`
- [x] **7. Monthly recap (compute + UI)** — `computeMonthlyRecap` (last completed month,
  neutral deltas vs prior month) + recap card.
  - Acceptance: month boundaries correct; hidden when the month has no shots; deltas neutral in copy.
  - Verify: unit tests for boundaries/deltas; e2e render assertion.
  - Files: `index.html`, `tests.html`, `test-e2e.html`
- [x] **8. Docs** — update CLAUDE.md (new modules, Stats card order, patterns/conventions).
  - Acceptance: CLAUDE.md reflects shipped behavior; spec checked off.
  - Verify: review diff.
  - Files: `CLAUDE.md`, `SPEC-gamified-stats.md`
