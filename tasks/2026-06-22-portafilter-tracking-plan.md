# Implementation Plan - Portafilter Tracking

## Objective

Record which portafilter was used for each shot and provide minimal management for
creating and renaming portafilters. Portafilters remain quiet supporting data inside
the shot workflow, not a new primary feature area.

Choosing a portafilter is metadata only. It must not change grind size, dose, yield,
extraction time, daily guidance, or the existing last-shot-first defaults.

## Locked Decisions

- Store portafilters as their own records with stable IDs and user-defined names.
- Store an optional `portafilterId` on each shot.
- Support creating and renaming portafilters from the shot form.
- Do not ship user-specific built-in names; an existing user creates "Breville Stock"
  and their other portafilter the first time they need them.
- Do not add a navigation tab or general equipment/settings area.
- Do not add delete/archive, dose profiles, filtering, statistics, or other equipment
  types in this version.
- For a new shot, preselect the most recently recorded valid portafilter across all
  shots. Leave it blank when no recorded choice exists.
- Editing a shot shows and preserves that shot's saved choice.
- Display the name in Today's shot list, bean shot history, and last-shot guidance.

## Data Model

Persist a new collection under `coffee_portafilters`:

```javascript
{
  id: string,          // crypto.randomUUID()
  name: string,        // required, trimmed, case-insensitively unique
  createdAt: string    // ISO timestamp
}
```

Add the optional reference to shots:

```javascript
{
  // existing shot fields...
  portafilterId: string // portafilter ID or empty string when unrecorded
}
```

Stable references let a rename update the displayed name everywhere without rewriting
shot records. A genuinely new piece of equipment should be added as a new record rather
than renaming an old one.

## User Flows

### Log with an existing portafilter

1. Open the existing shot form.
2. Review the preselected portafilter or choose another from the picker.
3. Enter or accept the existing recipe values and save.
4. The saved shot shows the portafilter name wherever that shot is summarized.

Changing the selector has no effect on any recipe field.

### Add a portafilter

1. Open "Manage" beside the Portafilter field.
2. Choose "Add Portafilter," enter a name, and save.
3. The new record is selected for the current shot and the compact manager closes.

### Rename a portafilter

1. Open "Manage" and choose Edit beside an existing name.
2. Save a non-empty, unique name.
3. The updated name appears on existing shot history because shots reference its ID.

### Edit or load legacy shots

- Editing a shot preserves its saved reference.
- Existing shots without `portafilterId` remain valid and display no label.
- A missing reference renders no misleading label and can be corrected while editing.

## Implementation Steps

### 1. Add persistence and helpers

In `index.html`:

- Add `portafilters` state and load/save it using `coffee_portafilters`.
- Add small helpers to find a portafilter, normalize and validate names, resolve a
  display label, and find the most recently used valid portafilter.
- Add create and rename methods with required-name and case-insensitive uniqueness
  validation.
- Extend `shotForm` with `portafilterId: ''`.
- Update `openShotForm`, `openShotFormForEdit`, and `saveShot` to initialize, preserve,
  and persist the reference.
- Leave `getShotNumericDefaults`, `getShotFormDefault`, and `getDailyGuidance` recipe
  selection unchanged.

### 2. Add compact management to the shot form

- Place a compact picker labeled "Portafilter" near the recipe fields, matching the
  existing coffee bean picker style.
- Add a low-emphasis "Manage" action beside the label.
- Keep the manager collapsed by default; when open, show the existing names, Add, and
  Edit actions inline within the shot panel.
- Reuse existing form, button, and error styles where possible.
- Preserve all in-progress shot values while the manager is opened or closed.
- Do not create nested overlays or a new navigation destination.

### 3. Show recorded context

- Add a compact name label to Today's shot cards.
- Add the same label to bean-detail shot rows.
- Include it in the Today tab's last-shot guidance so the referenced setup is clear.
- Render nothing for blank or unresolved references.

### 4. Extend backup compatibility

- Include `portafilters` in exported backups and increment the backup format version.
- Continue accepting older backups where the collection and shot reference are absent.
- Normalize imported portafilter records and reject empty or duplicate IDs/names.
- Merge portafilters before shots so imported shot references can resolve.
- Clear unknown imported references rather than dropping otherwise valid shots.
- Update import preview and confirmation counts to include new portafilters.

### 5. Protect behavior with tests

Add integration coverage in `test-e2e.html` for:

- Creating a non-empty, unique portafilter and persisting it.
- Renaming one and seeing the new name on previously saved shots.
- Rejecting blank and duplicate names without losing shot-form work.
- Saving, editing, changing, and clearing a shot's reference.
- Prefilling a new shot with the most recently recorded valid portafilter.
- Confirming selector and management actions never change numeric values or defaults.
- Loading legacy shots without the field and handling unresolved references.
- Import/export behavior for new and legacy backup shapes.

Add a Playwright smoke flow in `tests/smoke.spec.js` that creates a portafilter from the
shot form, saves a shot using it, and confirms its name renders without runtime errors.

### 6. Update project documentation

- Add the Portafilter schema, `coffee_portafilters` key, and optional shot reference to
  `AGENTS.md` and `CLAUDE.md`.
- Document that portafilters are record-only and do not participate in shot defaults.

## Acceptance Criteria

- A user can create and rename portafilters without leaving the shot workflow.
- A user can select a portafilter or leave it unrecorded on a shot.
- The saved name is visible in Today, bean history, and last-shot guidance.
- Renaming updates displayed history while preserving shot records.
- New shots reuse the latest valid selection without requiring another tap.
- Managing or selecting a portafilter never changes recipe fields or their defaults.
- Existing local data and older backups remain compatible.
- `npm test` passes.

## Explicitly Deferred

- Delete or archive behavior
- A dedicated equipment/settings screen
- Default doses or recipes per portafilter
- Other equipment types such as baskets, grinders, or machines
- Portafilter filters and statistics

## Expected Files

- `index.html`
- `test-e2e.html`
- `tests/smoke.spec.js`
- `AGENTS.md`
- `CLAUDE.md`
