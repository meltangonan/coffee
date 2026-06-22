---
date: 2026-06-22
topic: today-view-shot-history
---

# Today View Shot History

## What We're Building

Add a secondary `View Shot History` action to the selected-bean guidance card in the `Today` tab. The action lets a user reference earlier shots before deciding how to adjust and log the next one.

Selecting the action opens that bean's existing detail page in the `Beans` tab, where the shot history is already displayed.

## Why This Approach

The bean detail page already owns shot-history display and behavior. Linking to it keeps the `Today` workflow focused and avoids duplicating a second shot list, expansion state, or editing behavior.

## Key Decisions

- **Presentation**: Use a secondary button while keeping `Log Shot` as the primary action.
- **Visibility**: Show `View Shot History` only when the selected bean has at least two logged shots.
- **Destination**: Open the selected bean's detail page in the `Beans` tab.
- **Scroll position**: Open the detail page at the top and preserve its normal navigation behavior.
- **History display**: Reuse the existing five-shot preview and `View all` expansion on bean detail.
- **Scope**: Do not embed additional shot cards or a separate history view in the `Today` tab.

## Acceptance Criteria

- A selected bean with fewer than two shots does not show `View Shot History`.
- A selected bean with at least two shots shows `View Shot History` as a secondary action.
- Selecting the action activates the `Beans` tab and opens the matching bean detail page.
- The detail page starts at the top and exposes its existing shot history.
- `Log Shot` remains available as the primary action and keeps its current behavior.
- Automated tests protect the visibility threshold and navigation behavior.

## Open Questions

None.

## Next Steps

Proceed to implementation planning and testing.
