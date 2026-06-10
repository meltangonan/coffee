# Implementation Plan — Shot Stats & Per-Bean Trends

Spec: `brainstorms/2026-05-22-shot-stats-spec.md` — objective, scope, acceptance
criteria (§2), boundaries (§6). This plan converts that spec into a dependency-ordered,
vertically-sliced build with checkpoints. Task checklist: `tasks/todo.md`.

## Approach

**Vertical slices.** Every task after the foundation delivers one complete user-visible
path — helper → stat function → getter → UI → tests — and is mergeable on its own. No
horizontal "all logic, then all UI" layering.

**Pure functions + thin getters.** `tests.html` unit-tests *copies* of app helper
functions — its script block is literally headed "Helper functions (extracted from app)".
So each stat computation is written as a standalone pure function — `computeShotCounts(shots, refDate)`,
`computeMostPulledBeans(shots, beans, limit)`, etc. — taking explicit arguments. The
`app()` getters (`statsTotalShots`, …) become one-line wrappers passing `this.shots` /
`this.beans`. This keeps the logic unit-testable in `tests.html` and the getters trivial.
> This refines spec §3, which listed getters only. Flagged for review.

## Component dependency graph

```
TAB_ORDER + tab-bar button + Stats .tab-pane shell      Phase 0
        │
        ├──> Shot counts card                           Slice 1  ─┐
        ├──> Most-pulled beans card                      Slice 2   ├ Phase 1
        └──> Quality breakdown card                      Slice 3  ─┘

Per-bean trend charts (in existing bean detail view)     Phase 2  — independent

Polish + docs                                            Phase 3  — depends on all
```

Facts that shape the graph (verified in `index.html`):
- `TAB_ORDER` (`index.html:2093`, currently `['today','beans','calendar','stats']`) is the
  single source of truth; `activateTab` (`:2519`), `getTabIndex` (`:2515`),
  `getAdjacentTabForOffset` (`:2568`) and the swipe gesture handle 4 tabs generically.
- `tabPaneStyle(tab)` (`:2533`) is generic — new `.tab-pane` divs need no special JS.
- `isTabSwipeBlockedTarget` (`:2563`) already blocks `.panel` / interactive elements;
  static SVG charts need no addition.
- Slices 1–3 each render a card inside the Stats tab → all depend on Phase 0 and are done.
- Slice 4 renders into the existing bean detail view (`index.html:931`) and reads only
  existing shot data → no dependency on Phase 0; can be built at any point.

## Phases & checkpoints

### Phase 0 — Foundation: Stats tab reachable
Add `'stats'` to `TAB_ORDER`; add a 4th `.tab-bar` button after Calendar (`index.html:1741`);
add a `.tab-pane` div bound to `tabPaneStyle('stats')` containing only the empty state.
Add the two new constants. Complete path: user taps and swipes to a Stats tab.

→ **CHECKPOINT A — human review.** Stats tab reachable by tap and by swipe;
Today/Coffee/Calendar and their swipe still work; empty state renders. Stop here.

### Phase 1 — Aggregate stat cards (Slices 1–3, sequential)
Each slice: pure compute fn + getter + card UI + CSS + unit tests + e2e assertion.
- Slice 1 — Shot counts (`getWeekStart`, `getMonthStart`, `computeShotCounts`).
- Slice 2 — Most-pulled bean sources (`computeMostPulledBeans`), grouped by normalized
  bean name + roaster so copied bags count together.
- Slice 3 — Quality breakdown.

→ **CHECKPOINT B.** Stats tab aggregate cards populated; `tests.html` + `test-e2e.html`
all green. Done after user feedback removed aggregate grind/dial-in cards.

### Phase 2 — Per-bean trend charts (Slice 4)
`getBeanShotTrend` + `buildTrendPath` + three mini SVG charts in bean detail + the
`<2 shots` fallback. This is the next implementation phase.

→ **CHECKPOINT C.** Charts render at ≥2 shots, fallback at <2; tests green.

### Phase 3 — Polish & docs
Manual mobile pass (4-tab nav layout, swipe, charts at narrow widths); update `CLAUDE.md`
(Tab abstraction → 4 values; new Stats tab, stat modules, constants).

→ **FINAL CHECKPOINT — human review.** Full manual pass on a mobile viewport.

## Testing

No build step. To verify: run `python3 -m http.server`, then open
`http://localhost:8000/tests.html` (unit) and `/test-e2e.html` (integration).
- New pure functions must be copied into the `tests.html` helper block to be unit-tested
  (existing repo pattern — `test`, `assert`, `assertEqual`, `assertDeepEqual`).
- `test-e2e.html` loads `index.html` in an iframe and asserts on live `app` state — used
  for getter behaviour and rendered DOM.

## Risks & decisions to flag

- **Pure-fn refactor of stat getters** — refines spec §3 (see Approach). Confirm with the
  user; it is the cleanest way to keep logic unit-testable given the `tests.html` pattern.
- **4-tab nav layout** — `.tab-bar` currently holds 3 buttons; verify 4 fit the mobile
  width without crowding (may need a small CSS tweak). The Beans tab label in the UI is
  "Coffee", not "Beans".
- **`tests.html` duplication** — copied helpers can drift from the app; keep the pure
  functions small, self-contained, and identical to the app copy.
- Three flagged spec decisions remain open (calendar week Mon–Sun; three static
  sparklines; archived beans included in aggregates) — see spec §2 and the handoff doc.
