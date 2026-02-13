---
date: 2026-02-13
topic: pmf-improvements-functional
type: product-brainstorm
---

# Coffee Bean Tracker - PMF Improvement Brief (Functional/User Perspective)

## Context

This app appears to have strong "PMF of one" potential (for a dedicated solo user), but weak evidence of broader product-market fit today.

The likely gap is not build quality. The likely gap is outcome clarity:
- Users can log data.
- Users are less clearly helped to make better coffee faster and more consistently.

This brief focuses on user-facing improvements that increase real-world value without overcomplicating the product.

## Product Direction (Simple and Defensible)

Position the app as:

**"A daily espresso coach that helps me pull a better next shot in under 10 seconds."**

This shifts the core promise from passive tracking to active guidance.

## Improvement 1: Next-Shot Guidance (Highest Value)

### User Problem
- I logged previous shots, but I still decide adjustments by guesswork.
- Logging feels pointless if it does not change what I do next.

### Functional Improvement
- After bean selection, show a compact "Next Shot Suggestion" card:
  - Suggested grind change (finer/coarser by a small step)
  - Suggested yield or dose adjustment
  - Short reason based on last shot quality and extraction time
  - Confidence indicator (high/medium/low) based on amount and recency of data

### User Experience Goals
- A user can accept recommendation in one tap.
- A user can see "why" in one sentence.
- A user can override instantly without penalty.

### Scope Guardrails
- Start with transparent rule-based logic (not ML).
- Keep recommendations intentionally conservative.
- Avoid pretending precision when data quality is low.

### Success Signal
- Higher percent of sessions where users follow suggested changes.
- Faster "good shot" convergence per bean.

## Improvement 2: Near One-Tap Logging

### User Problem
- Repeated manual entry is friction.
- Users abandon habit if logging takes effort during brewing.

### Functional Improvement
- Create a "Quick Log" mode:
  - Defaults to last bean + last settings
  - Prominent +/- controls for only the most adjusted fields
  - Optional fields hidden behind "More details"
  - One-tap "Same as last shot" action

### User Experience Goals
- Typical shot can be logged in under 10 seconds.
- Advanced users can still record full detail when needed.
- No sense of form fatigue.

### Scope Guardrails
- Do not add extra required fields.
- Minimize screen changes and modal depth.
- Preserve current full-form flow as fallback.

### Success Signal
- Increased logging frequency per active user.
- Lower partial/abandoned logs.

## Improvement 3: Data Trust (Backup and Cross-Device Continuity)

### User Problem
- localStorage-only creates fear of loss.
- Users hesitate to rely on the app for months of dial-in history.

### Functional Improvement
- Add a reliability baseline:
  - Guided export reminders (manual backup flow)
  - Simple import validation and merge behavior
  - Optional lightweight sync later (phase 2) if adoption justifies it

### User Experience Goals
- User always knows data can be recovered.
- Backup/import feels safe and predictable.
- No surprise overwrites.

### Scope Guardrails
- Start with robust export/import before introducing full auth/sync complexity.
- Keep backup language plain and non-technical.

### Success Signal
- More users keep historical data over longer windows.
- Fewer trust-related drop-offs.

## Improvement 4: Progress Feedback That Feels Useful

### User Problem
- Logging history is visible, but progress is not obvious.
- Users need motivation and evidence that they are improving.

### Functional Improvement
- Add simple progress surfaces per bean:
  - "Dial-in stability" trend (e.g., reduced variability over recent shots)
  - "Current confidence in recipe" indicator
  - Milestones (e.g., first stable recipe, X good shots in a row)

### User Experience Goals
- User can answer: "Am I getting better with this bean?"
- Feedback encourages continued use without gamification noise.

### Scope Guardrails
- Keep metrics interpretable.
- Avoid dense dashboards.

### Success Signal
- Increased repeat usage on the same bean across days.
- Positive self-report on confidence and consistency.

## Improvement 5: Sharper Onboarding and Positioning

### User Problem
- New users may not quickly understand "why this app over a notes app."

### Functional Improvement
- Add focused first-run guidance:
  - Short setup: add one bean + log first shot
  - Explain immediate value: "We will suggest your next adjustment."
  - Show one example recommendation after first log

### User Experience Goals
- Time-to-first-value under 2 minutes.
- Clear benefit before user fatigue.

### Scope Guardrails
- No long tutorials.
- No forced walkthrough after first-time setup.

### Success Signal
- Higher first-session completion of core loop.
- Better day-1 to day-7 retention.

## Prioritized Rollout (Lean)

1. Next-Shot Guidance
2. Near One-Tap Logging
3. Data Trust (export/import hardening)
4. Progress Feedback
5. Onboarding refinement

Rationale: Improve daily value loop first, then reliability and retention layers.

## What Not to Do Yet

- Do not build social/community features now.
- Do not add complex AI claims.
- Do not expand into inventory/shopping workflows unless users explicitly pull for it.

The core risk is solving too many adjacent problems before the "better next shot" loop is undeniable.

