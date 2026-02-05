---
date: 2026-02-05
topic: shot-date-picker
---

# Shot Date Picker

## What We're Building

Add a `shotDate` field to shots with a date picker in the shot form, allowing users to log shots for past dates (e.g., "forgot to log yesterday"). The date picker uses the existing `datePicker` component, same style as roast date selection.

## Why This Approach

- Separate `shotDate` from `createdAt` keeps data clean—`createdAt` is "when logged," `shotDate` is "when consumed"
- Reuses existing `datePicker` component for consistency
- Positioned inline with rating tags to minimize visual weight (since it's usually "today")

## Key Decisions

- **New field `shotDate`**: ISO date string "YYYY-MM-DD", separate from `createdAt` timestamp
- **UI position**: To the right of rating tags (bad/okay/perfect), above notes
- **Default behavior**: New shots default to today; edit shows existing value
- **Migration**: Existing shots without `shotDate` derive it from `createdAt`
- **Today's shots filtering**: Filter by `shotDate === today`, sort by `createdAt` descending

## Schema Change

```javascript
// Shot gets new field:
shotDate: string  // "YYYY-MM-DD" — the date the shot was made
// createdAt remains unchanged — when the record was logged
```

## UI Layout

```
[Bad] [Okay] [Perfect]     [📅 Feb 5, 2026]

[Notes textarea]
```

## Open Questions

None—ready for implementation.

## Next Steps

→ Plan implementation details
