---
date: 2026-02-20
topic: save-shot-as-best-dial-in
---

# Save Shot as Best Dial-In

## What We're Building

A checkbox on the shot log form that lets users promote the current shot's parameters (grind, dose, yield, extraction time) to the bean's "best dial-in" settings — without navigating to the bean detail page and manually editing optimal settings.

## User Story

> I've been pulling multiple shots experimenting with a bean. I just logged a shot that nailed it. I want to save these settings as my best dial-in right here, without leaving the shot form. But I want to see what the current best dial-in is first, so I can be sure I want to replace it.

## Chosen Approach

**Checkbox on the shot form + inline comparison on toggle.**

### Flow

1. User fills in shot form as usual (grind, dose, yield, time, rating, notes)
2. Below the Save Shot button: a subtle checkbox labeled "Save as best dial-in"
3. Checking the box reveals an inline comparison panel:
   - Shows **Current → New** for grind, dose, yield, time
   - If no current best dial-in exists, left side shows "Not set"
   - If all values are identical, shows a note like "Same as current best dial-in"
4. Unchecking hides the comparison (cancels the intent)
5. Hitting **Save Shot** saves the shot AND updates the bean's optimal settings
6. Checkbox resets to unchecked on next form open

### Why This Approach

- **Minimal friction**: One checkbox, no extra modals or navigation
- **Confirmation built-in**: The comparison panel serves as both confirmation and review — user sees exactly what's changing before committing
- **Single save action**: No two-step confirm after saving; the checkbox IS the confirmation intent
- **Reversible**: User can always edit best dial-in from the bean detail page if needed

## Key Decisions

- **Trigger**: Checkbox below Save Shot button (not on shot cards in history)
- **Confirmation**: Inline comparison that appears on checkbox toggle (not a separate modal or post-save dialog)
- **Timing**: Comparison appears immediately on check; both shot and best dial-in save together on Save Shot
- **Scope**: Updates all four optimal fields (grindSize, doseIn, yieldOut, extractionTime) from the shot form values

## Edge Cases

- **No existing best dial-in**: Show "Not set" on the current side
- **Values identical**: Show "Same as current best dial-in" message (still allow save)
- **Editing an existing shot**: Checkbox available — user can re-promote edited values
- **Null shot fields**: Only update best dial-in fields that have non-null values in the shot form
- **Archived beans**: Checkbox should still work (user might be editing a shot for an archived bean's history, though this is rare since shot form isn't typically opened for archived beans)

## Open Questions

None — ready for implementation.

## Next Steps

→ Proceed to implementation planning
