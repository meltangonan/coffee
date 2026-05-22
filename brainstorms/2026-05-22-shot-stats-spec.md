# SPEC: Shot Stats & Per-Bean Trends

> Status: Approved — revised after Checkpoint B feedback
> Created: 2026-05-22
> Feature: A "Stats" tab with app-wide brewing stats, plus per-bean trend charts in bean detail.
> Scope: Built on the current single-HTML app (`index.html`), not the Supabase pivot in `SPEC.md`.

## 1. Objective

Turn the dial-in journal into something that also rewards the user for logging. Today the
app helps dial in shots day after day; it does not let the user *see their data over time*.

This feature adds two things:

1. **A new "Stats" tab** — app-wide aggregate stats: how many shots logged (total / this
   month / this week), which beans were pulled most, and quality breakdowns.
2. **Per-bean trend charts** — inside each bean's detail view, small visualizations of how
   grind size, brew ratio, and extraction time moved across that bean's life.

**Target user:** The single home-barista user of this personal tool. Home baristas are
data nerds — seeing their own trends is intrinsically motivating. This is the engagement
layer that makes a daily-logging habit feel worthwhile.

**Inspiration, not scope:** Spotify Wrapped's *principle* (your own data, made delightful)
informs the tone. The literal Wrapped recap moment and social/friend comparison are
explicitly **out of scope for v1** (see §6).

### Non-goals (v1)

- No "Wrapped"-style periodic recap screen.
- No sharing, image export, or social/friend comparison.
- No charting library — charts are hand-rolled SVG (revisit only per §6).
- No backend, no new localStorage keys, no data-model changes.

## 2. Scope & Acceptance Criteria

### 2.1 Stats Tab

A 4th top-level tab, **Stats**, added after Calendar. Tab order becomes:
`Today → Beans → Calendar → Stats`.

- [ ] Stats tab appears in the tab nav and activates via tap and via swipe navigation.
- [ ] Tab swipe adjacency is updated (Calendar ↔ Stats); `activateTab` / `tabPaneStyle` /
      swipe logic handle 4 tabs correctly; existing tabs and swipe still work.
- [ ] **Shot counts card** — shows three numbers: total shots (all time), shots this
      month, shots this week.
- [ ] **Most-pulled beans card** — ranked list of up to `STATS_TOP_BEANS_LIMIT` (5)
      bean sources by shot count, each with its count. Bags copied from another bean are
      grouped by normalized `name + roaster`, archived bags are included, and a group is
      marked archived only when all bags in the group are archived.
- [ ] **Quality breakdown card** — count + percentage of shots rated bad / okay / great /
      perfect; shots with no rating are excluded from the percentage base.
- [ ] **Empty state** — when no shots exist, the tab shows a friendly prompt to log a
      shot instead of empty/zeroed cards.
- [ ] Stats are computed only from `shots` / `beans` state — purely derived, never persisted.

**Time windows:** "This week" = current calendar week (Monday–Sunday). "This month" =
current calendar month. All time filtering uses each shot's `shotDate` (with `createdAt`
fallback), consistent with the existing `todayShots` computed property.

### 2.2 Per-Bean Trend Charts

Inside the existing bean detail view, a trends section is added.

- [ ] Three mini trend charts render: **grind size**, **brew ratio**, **extraction time** —
      each plotting that metric across the bean's shots in chronological order
      (sorted by `shotDate`, then `createdAt`).
- [ ] Charts render only when the bean has at least `BEAN_TREND_MIN_SHOTS` (2) shots.
      With 0–1 shots, a short message is shown ("Log a couple of shots to see trends").
- [ ] Each chart is a static inline SVG: a line through the data points, y-axis scaled to
      the metric's min–max (with small padding), and the latest value labeled.
- [ ] Charts handle a flat series (all values equal) without divide-by-zero — render a
      centered flat line.
- [ ] Charts use the existing design tokens / palette and match the compact, mobile-first
      card aesthetic (consistent with the shot-bar and calendar-bar visualizations).
- [ ] Charts are non-interactive in v1 (no tooltips/tap targets) so they never interfere
      with tab swipe.

### 2.3 Out of Scope (v1)

Wrapped recap screen, sharing/export, friend comparison, chart interactivity, any new
data field or localStorage key. See §6 for what triggers a conversation.

## 3. Architecture & Project Structure

Built on the **current zero-build single-HTML app** (Alpine.js 3.x + localStorage). The
entire app stays in `index.html`. No build step, no new files for the feature itself.

```
index.html
  ├─ CSS  (~31-498)    + .stats-* card styles, .trend-chart styles, 4-tab nav layout
  ├─ HTML (~500-1330)  + Stats tab pane; + trends section in bean detail view
  └─ JS   (~1332-2301) + STATS_* / BEAN_TREND_* constants
                       + stat computed properties / helpers on app()
                       + chart-geometry helper(s)
tests.html             + unit tests for stat + trend helpers
test-e2e.html          + integration tests for the Stats tab and bean-detail charts
```

### New JS surface (all on the `app()` object)

- Computed: `statsTotalShots`, `statsShotsThisWeek`, `statsShotsThisMonth`,
  `statsMostPulledBeans`, `statsQualityBreakdown`, `statsHasData`.
- Pure helpers: `getWeekStart(date)` / `getMonthStart(date)` (window boundaries),
  `computeShotCounts(shots, refDate)`, `computeMostPulledBeans(shots, beans, limit)`,
  `computeQualityBreakdown(shots)`, `getBeanShotTrend(beanId, metric)` (chronological
  series for a metric), and `buildTrendPath(series)` (series → SVG path/point geometry).
  The `app()` getters are thin wrappers around these pure functions.
- Constants (in the constants block, near `FRESHNESS_*`):
  `STATS_TOP_BEANS_LIMIT = 5`, `BEAN_TREND_MIN_SHOTS = 2`.

Stat computations are read-only getters derived from `beans` and `shots`. No mutation,
no `saveBeans()` / `saveShots()` calls — there is nothing to persist.

## 4. Code Style

Match the existing codebase exactly:

- Alpine.js patterns — stats exposed as computed getters / methods on `app()`; templates
  use `x-data="app()"` directives. No new Alpine component unless a chart genuinely needs
  one (a `sparkline()` component is acceptable if it reduces template duplication).
- No magic numbers — thresholds and limits go in the constants block as named constants.
  Reuse existing `BREW_RATIO_*` / `EXTRACTION_TIME_*` constants where assessment applies.
- Hand-rolled inline SVG for charts, in the spirit of the existing shot-bar and
  calendar-bar visualizations. No external library.
- CSS uses the existing design tokens (`--espresso`, `--cream`, `--amber`, freshness
  colors, `--radius*`) and spacing utilities. No inline styles where a utility/class fits.
- Reuse existing helpers — `getBeanById`, `getShotsForBean`, `getBeanOccurrence`,
  `shotQualityLabel`/`shotQualityClass`, brew-ratio math — rather than reimplementing.
- Keep it simple: a senior engineer should not call this overcomplicated. Prefer a few
  focused getters over a generic stats engine.

## 5. Testing Strategy

Follow the existing two-file approach; run by serving the directory and opening each file.

**`tests.html` — unit tests** for the new pure functions:

- Week/month boundary helpers (`getWeekStart`, `getMonthStart`) incl. month/year edges.
- Count aggregations: total / week / month with shots inside and outside each window;
  shots with missing `shotDate` falling back to `createdAt`.
- `computeMostPulledBeans` ranking, including ties, copied-bag grouping by normalized
  `name + roaster`, and archived group marking.
- Quality summaries, including unrated shots excluded from quality %.
- `getBeanShotTrend` chronological ordering and `buildTrendPath` geometry, including
  edge cases: no shots, single shot, flat (all-equal) series.

**`test-e2e.html` — integration tests:**

- Stats tab appears, activates, and renders computed numbers from seeded state.
- Empty state shows when no shots are seeded.
- Bean detail renders the three trend charts with ≥2 shots, and the fallback message
  with <2 shots.
- Existing tab swipe still navigates correctly across all 4 tabs.

All new logic must have unit coverage before the feature is considered done.

## 6. Boundaries

### Always

- Keep the app zero-dependency and zero-build — hand-rolled inline SVG for all charts.
- Treat stats as strictly read-only — never mutate or migrate `beans` / `shots` data
  from any stats or chart code path.
- Use `shotDate` (with `createdAt` fallback) for all time filtering, consistent with
  `todayShots`.
- Put new thresholds/limits in the constants block as named constants; reuse existing
  `FRESHNESS_*`, `BREW_RATIO_*`, `EXTRACTION_TIME_*` where relevant.
- When adding the 4th tab, update the tab list, `activateTab`, `tabPaneStyle`, swipe
  adjacency, and `isTabSwipeBlockedTarget` as needed — and verify existing tabs/swipe.
- Match the existing design tokens and component styles.
- Add unit + e2e tests for all new logic.
- Keep the feature scoped — flag anything that starts to feel overcomplicated.

### Ask first

- Adding a charting library — only revisit if hand-rolled SVG proves clearly inadequate
  for the trend charts; not a v1 assumption.
- Any new `localStorage` key or any change to the Bean / Shot schema.
- Making charts interactive (tooltips, tap targets, metric toggles).
- Building the "Wrapped"-style recap moment, or any sharing / image export.
- Any social or friend-comparison feature.

### Never

- No backend, no network calls, no analytics/telemetry.
- No build step or bundler.
- Don't break the existing Today / Beans / Calendar tabs or swipe navigation.
- Don't add data fields or run migrations purely to support stats — stats must be
  derivable from the current data model.

## 7. Implementation Plan

The build is planned separately as a dependency-ordered, vertically-sliced task list with
checkpoints between phases:

- `tasks/plan.md` — phases, component dependency graph, checkpoints, risks.
- `tasks/todo.md` — the task checklist, each task with acceptance criteria and verification.

The plan refines §3: stat computations are implemented as **pure functions** taking
explicit `(shots, beans, …)` arguments, with the `app()` getters as thin wrappers — so the
logic is unit-testable via `tests.html`, which tests copied helper functions.
