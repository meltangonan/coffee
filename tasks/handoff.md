# Handoff — Shot Stats & Per-Bean Trends feature

> **Starting a new session?** Give the agent this file. It is the entry point — it links
> the spec, plan, and task list, and captures context that lives in none of them.

## What the next session is doing

Implementing a new **Stats** feature for the Coffee Bean Tracker (`index.html`): a 4th
"Stats" tab with app-wide brewing stats, plus per-bean trend charts in the bean detail
view. Inspired by Spotify Wrapped's *principle* (your own data, made delightful) — not its
recap format.

## Artifacts — read these first, do not re-derive them

Each serves a distinct purpose; read in this order:

1. **`brainstorms/2026-05-22-shot-stats-spec.md`** — the **spec**: the *what and why*.
   Objective (§1), scope + acceptance criteria (§2), architecture / new JS surface (§3),
   code style (§4), testing (§5), boundaries (§6). The contract — stable.
2. **`tasks/plan.md`** — the **plan**: the *how and in what order*. Dependency graph,
   phases, checkpoints, risks. The strategy.
3. **`tasks/todo.md`** — the **task list**: the *do this now*. Checkbox tasks, each with
   acceptance criteria and verification steps. The working surface — **execute it top to
   bottom**; it changes as work progresses.
4. **This file** — orientation + decisions captured nowhere else + current state.

Do not confuse the stats spec with the root `SPEC.md` — that is a different document, the
Supabase public-app pivot spec. This feature is built on the **current** single-HTML app.

## Project context

- Single-HTML zero-build app (Alpine.js 3.x + localStorage). All app code in `index.html`
  (~3,200 lines). Tests: `tests.html` (unit), `test-e2e.html` (iframe integration).
- Read `CLAUDE.md` for architecture, abstractions, constants, conventions.
- `tests.html` unit-tests *copied* helper functions (its script is headed "Helper
  functions (extracted from app)"). This drove a plan decision — see below.

## Decisions locked in (from user Q&A)

- Built on the current single-HTML app — not the Supabase pivot.
- Charts: hand-rolled inline SVG, zero-dependency. A chart library is "ask first".
- v1 is a plain stats dashboard — no Wrapped recap, no sharing, no friend comparison.
- Placement: new Stats tab (aggregates) + per-bean charts in bean detail.
- The plan (`tasks/plan.md`) is **approved** by the user.

## Decisions to confirm with the user before/while implementing

- **Pure-functions refactor** (plan refinement of spec §3): stat logic is written as pure
  functions `computeShotCounts(shots, refDate)` etc. taking explicit args, with `app()`
  getters as thin wrappers — so logic is unit-testable in `tests.html`. The user approved
  the plan that contains this; treat as accepted. See `tasks/plan.md` "Approach" + "Risks".
- Three spec decisions Claude made and flagged but the user has **not explicitly
  confirmed** (treat as accepted; offer a chance to adjust):
  - "This week" = current calendar week, Monday–Sunday; "this month" = calendar month.
  - Per-bean charts = three static, non-interactive mini sparklines (grind / brew ratio /
    extraction time).
  - Aggregate stats include archived beans' shots; most-pulled groups copied bags by
    normalized `name + roaster`, and marks a group archived only when all bags are archived.
- Checkpoint B user feedback removed aggregate grind and dial-in summary cards from the
  Stats tab; those metrics remain bean-specific through Phase 2 trend charts.

## Current state

- Phase 0 and Phase 1 implemented through Checkpoint B.
- Spec, plan, and task list were revised after Checkpoint B feedback: aggregate grind and
  dial-in cards removed; most-pulled now groups copied bags by normalized bean source.
- `index.html`, `tests.html`, `test-e2e.html`, and `tests/smoke.spec.js` have feature
  changes.
- Next action: `tasks/todo.md` task **2.1** (trend data + chart geometry) after user
  approval to continue past Checkpoint B.

## Watch-outs

- `TAB_ORDER` (`index.html:2093`) is the single source of truth for tabs and now includes
  `'stats'`; `activateTab`/`getTabIndex`/`getAdjacentTabForOffset`/swipe handle 4 tabs
  generically. `tabPaneStyle(tab)` is already generic.
- The `.tab-bar` now holds 4 buttons. UI label for the Beans tab is "Coffee".
- Stats are strictly read-only — never call `saveBeans()`/`saveShots()` from stats code.
- No new localStorage keys, no Bean/Shot schema changes (spec §6).
- `buildTrendPath` must guard the flat-series (all-equal values) divide-by-zero.
- **Stop at each checkpoint** (A after Phase 0, B after Phase 1, C after Phase 2, plus a
  final review) — checkpoints A and final are explicit human-review gates.

## Suggested skills for the next session

- `incremental-implementation` — execute `tasks/todo.md` one slice at a time, honoring
  the checkpoints.
- `test-driven-development` — each slice pairs a pure function with unit tests in
  `tests.html`; write tests alongside.
- `frontend-design` / `frontend-ui-engineering` — Phase 2 chart UI and Phase 3 mobile
  polish, kept consistent with the "Warm Industrial Cafe" design system.
- `code-review-and-quality` — at checkpoint C and final review before merge.
