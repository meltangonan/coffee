---
date: 2026-02-05
topic: duplicate-bean-anywhere
---

# Duplicate Bean from Anywhere

## What We're Building

Add the ability to duplicate beans from two new entry points:

1. **Bean detail page** — A subtle "Duplicate" button in the header (left of Edit), available for both current and archived beans
2. **Add Bean form** — A "Fill from previous" link that opens a picker to copy from an existing bean

The picker shows a de-duplicated list of all beans (current + archived), grouped by unique name+roaster combinations. When the same coffee appears multiple times, the system picks the best source: preferring beans with optimal settings filled in, then falling back to most recent.

## Why This Approach

Currently, "duplicate from archive" only appears in the Today tab empty state — a rare scenario once you're actively tracking beans. Users want to:
- Quickly add a new bag of a coffee they've bought before (same name/roaster)
- Copy optimal dial-in settings from a previous bag
- Do this from natural places: the bean they're looking at, or while adding a new bean

We chose:
- **Two entry points** (detail page + form) rather than three, to avoid cluttering the archive list
- **De-duped list** so users see "Big Riff — Blue Bottle" once, not 5 times
- **Prefer beans with settings** so the duplicate carries forward dial-in knowledge
- **Pre-fill form** (not instant create) so users can adjust roast date before saving

## Key Decisions

- **Button placement on detail page**: Left of Edit button, subtle styling (ghost/icon style, not prominent amber button) to avoid accidental clicks
- **"Fill from previous" in form**: Small link below the form title, opens a picker overlay/dropdown
- **De-dupe logic**: Group by `name.toLowerCase() + roaster.toLowerCase()`, pick best representative
- **Best representative selection**: Prefer bean with optimalGrindSize/optimalDoseIn/optimalYieldOut filled → then most recent by roastDate (or createdAt)
- **What gets copied**: name, roaster, notes, rating, optimalGrindSize, optimalDoseIn, optimalYieldOut
- **Roast date**: Defaults to today (not copied from source)
- **Destination**: Always opens Add Bean form (never direct create)

## Open Questions

- None — ready for implementation

## Next Steps

→ Plan implementation details
