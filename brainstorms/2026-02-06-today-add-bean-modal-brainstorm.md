---
date: 2026-02-06
topic: today-add-bean-modal
---

# Today Add Bean Modal

## What We're Building

In the `Today` tab bean selector, add a final dropdown option: `Add a new bean`. Selecting this option opens the existing add-bean flow in a modal over the current `Today` view.

This keeps users in context while creating a bean and returns them directly to selection behavior without navigating away.

## Why This Approach

- Keeps the user in the `Today` workflow (lowest friction)
- Avoids layout clutter from inline forms
- Reduces context loss compared to full-page navigation

## Key Decisions

- **Dropdown option**: Add `Add a new bean` as the final option in the `Today` bean dropdown
- **Entry behavior**: Selecting that option opens an add-bean modal
- **Save behavior**: On successful save, close modal and auto-select the newly created bean in `Today`
- **Cancel behavior**: On cancel, close modal and reset `Today` bean state to no selection with placeholder `Choose a coffee bean.`
- **Duplicate handling**: In this modal flow, duplicates are blocked
- **Duplicate normalization**: Duplicate checks are case-insensitive and trim surrounding whitespace

## Validation Rules

Before creating a bean from this modal, normalize input as:
- trim leading/trailing spaces
- compare in case-insensitive form

If normalized name already exists, show validation error and prevent save.

## Open Questions

None.

## Next Steps

→ Implement modal trigger and state transitions in `Today` bean selector flow.
