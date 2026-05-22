# TODO — Shot Stats & Per-Bean Trends

Plan: `tasks/plan.md`. Spec + full acceptance criteria:
`brainstorms/2026-05-22-shot-stats-spec.md` §2. Work top to bottom; do not cross a
CHECKPOINT until its criteria pass.

## Phase 0 — Foundation

- [x] **0.1 — Stats tab shell + navigation**
  - Add `'stats'` to `TAB_ORDER` (`index.html:2093`).
  - Add a 4th `.tab-bar` button after Calendar (`index.html:1741`) — label "Stats" + icon.
  - Add a `.tab-pane` div bound to `tabPaneStyle('stats')` containing only the empty state.
  - Add `STATS_TOP_BEANS_LIMIT = 5` and `BEAN_TREND_MIN_SHOTS = 2` to the constants block.
  - Acceptance: spec §2.1 — tab appears, activates by tap + swipe; empty state shows.
  - Verify: open `index.html` — tap all 4 tabs; swipe Calendar↔Stats and across all tabs;
    confirm Today/Coffee/Calendar and their swipe are unaffected. Run `test-e2e.html` — green.

### ▸ CHECKPOINT A — human review before starting Phase 1.

## Phase 1 — Aggregate stat cards

- [x] **1.1 — Shot counts card**
  - Pure: `getWeekStart(date)`, `getMonthStart(date)`, `computeShotCounts(shots, refDate)`.
  - Getters: `statsTotalShots` / `statsShotsThisWeek` / `statsShotsThisMonth` wrap the pure fn.
  - UI: card in the Stats pane — total / this month / this week.
  - Acceptance: spec §2.1 shot-counts card; week = Mon–Sun, month = calendar month; filter
    on `shotDate` with `createdAt` fallback.
  - Verify: copy pure fns into `tests.html`; add unit tests (month/year edges, `shotDate`
    fallback, window membership); run `tests.html`. Add a `test-e2e.html` count assertion.

- [x] **1.2 — Most-pulled beans card**
  - Pure: `computeMostPulledBeans(shots, beans, limit)`; getter `statsMostPulledBeans`.
  - UI: ranked list (top `STATS_TOP_BEANS_LIMIT`), count each grouped bean source, bag
    count when multiple bags are grouped, archived groups marked subtly.
  - Acceptance: spec §2.1 most-pulled card.
  - Verify: unit tests for ranking order, ties, copied-bag grouping, archived-group
    marking; e2e assertion.

- [x] **1.3 — Quality breakdown card**
  - Pure: `computeQualityBreakdown` + getter.
  - UI: quality breakdown.
  - Acceptance: spec §2.1 quality card (unrated shots excluded from %).
  - Verify: unit tests incl. unrated-shot exclusion and empty-data; e2e assertion.

### ▸ CHECKPOINT B — Stats tab aggregate cards populated; `tests.html` + `test-e2e.html` all green.

## Phase 2 — Per-bean trend charts

- [x] **2.1 — Trend data + chart geometry**
  - Pure: `getBeanShotTrend(beanId, metric)` (chronological series), `buildTrendPath(series)`
    (SVG geometry) — guard the flat-series (all-equal) divide-by-zero.
  - Verify: copy into `tests.html`; unit tests for ordering, 0/1-shot, flat series.

- [x] **2.2 — Per-bean charts UI**
  - Trends section in bean detail (`index.html:931`): three mini SVG charts (grind /
    brew ratio / extraction time) + `<2 shots` fallback message. `.trend-chart` CSS.
  - Acceptance: spec §2.2 — render at ≥`BEAN_TREND_MIN_SHOTS`, static, design tokens.
  - Verify: `test-e2e.html` — bean with ≥2 shots shows charts; bean with <2 shows fallback.

### ▸ CHECKPOINT C — charts render correctly; tests green.

## Phase 3 — Polish & docs

- [ ] **3.1 — Manual mobile pass** — 4-tab nav layout, swipe, charts at narrow widths.
- [ ] **3.2 — Update `CLAUDE.md`** — Tab abstraction = 4 values; document the new Stats
  tab, the stat modules, and the `STATS_*` / `BEAN_TREND_*` constants.

### ▸ FINAL CHECKPOINT — human review.
