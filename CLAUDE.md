# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Your Rules
- Ask: "Would a senior engineer say this is overcomplicated?" If yes, simplify
- Always think of engineering and software engineering/development best practices
- When uncertain, flag it explicitly rather than guessing and moving on
- Don't bulk-generate code without a clear, scoped task

## Project Overview

Coffee Bean Tracker — a mobile-first single-page application for tracking espresso beans, dialing in shots, monitoring freshness windows, and logging daily brewing. Built as a zero-dependency, zero-build single HTML file using Alpine.js 3.x with localStorage persistence. PWA-enabled for home screen install. No backend, no authentication (single-user personal tool).

## Running the App

There is no build step. Open `index.html` directly in a browser or serve it locally:

```
python3 -m http.server
```

Deploy by copying `index.html`, `manifest.json`, and `icons/` to any static host (GitHub Pages, Netlify, etc.).

### Running Tests

Serve the directory and open:
- `tests.html` — Unit tests for helper functions
- `test-e2e.html` — Integration tests that load the app in an iframe

## Architecture

The entire application lives in `index.html` (~2,300 lines) with three inline sections:

1. **CSS** (lines ~31-498): Design system with CSS variables, component styles, responsive layout, and spacing utilities. Uses "Warm Industrial Cafe" aesthetic with Playfair Display (headings) and DM Sans (body) fonts.
2. **HTML** (lines ~500-1330): Alpine.js template directives. Root element uses `x-data="app()" x-init="init()"`. Tab-based navigation (Today, Beans, Calendar) with no routing library.
3. **JavaScript** (lines ~1332-2301): Alpine components, helper functions, and main `app()` object.

### File Structure

```
index.html          — Entire app (CSS + HTML + JS)
manifest.json       — PWA manifest for home screen install
icons/              — App icons (SVG, PNG at 16/32/180/192/512px)
tests.html          — Unit tests
test-e2e.html       — Integration tests (iframe-based)
brainstorms/        — Design docs and decision records
```

### Core Abstractions

| Abstraction | What it represents | What it owns |
|-------------|-------------------|--------------|
| **Bean** | A coffee bean bag/batch | name, roaster, roastDate, rating, notes, isArchived, optimal settings |
| **Shot** | A single espresso pull | beanId (foreign key), grindSize, doseIn, yieldOut, extractionTime, rating, notes, shotDate, createdAt |
| **Freshness** | Bean age status | Derived from roastDate: resting/optimal/past |
| **Tab** | Navigation state | today/beans/calendar (swipeable on touch devices) |
| **View** | Sub-navigation in Beans tab | list/detail/form/archive |

### Key Constants

```javascript
const FRESHNESS_RESTING_DAYS = 7;   // Days 0-6: Resting
const FRESHNESS_OPTIMAL_DAYS = 21;  // Days 7-21: At Peak
                                    // Days 22+: Past Peak

// Espresso extraction standards (universal targets)
const EXTRACTION_TIME_FAST = 22;           // Below: under-extracted
const EXTRACTION_TIME_SLIGHTLY_FAST = 25;  // 22-24: slightly fast
const EXTRACTION_TIME_STANDARD_MAX = 30;   // 25-30: standard range
const EXTRACTION_TIME_SLIGHTLY_SLOW = 35;  // 31-35: slightly slow

const BREW_RATIO_VERY_LOW = 1.5;           // Below: very low yield
const BREW_RATIO_LOW = 1.8;               // 1.5-1.79: low yield
const BREW_RATIO_STANDARD_MAX = 2.2;      // 1.8-2.2: standard range
const BREW_RATIO_HIGH = 2.5;              // 2.21-2.5: high yield
```

### Key Functional Modules (all methods on the `app()` object)

- **Bean Management**: `saveBean`, `deleteBean`, `selectBean`, `updateBeanRating`, `archiveBean`, `unarchiveBean`, `duplicateFromArchive`, `duplicateBean` (pre-fill form from existing bean; used by "Fill from previous bean" and duplicate-from-detail), `fillBeanFormFrom` (fill form fields in modal context without navigating)
- **Bean Validation**: `normalizeBeanName` (trim + lowercase), `beanNameExists` (checks for duplicate names among active beans, used in Today picker flow)
- **Bean Form Context**: `openBeanForm` (supports `context` option: `'beans'` for Beans tab, `'today-picker'` for modal from Today), `openAddBeanFromToday` (opens modal form from daily picker), `cancelBeanForm` (handles cleanup for both contexts), `showBeanFormModal` (boolean for overlay display), `_pendingDuplicateBean` (temporary state carrying optimal settings through the duplicate flow)
- **Delete Confirmation**: `openDeleteBeanDialog`, `closeDeleteBeanDialog`, `confirmDeleteBean` — two-step confirmation via modal dialog before deleting a bean and its shots
- **Shot Logging**: `saveShot`, `deleteShot`, `openShotForm`, `openShotFormForEdit`, `closeShotForm`, `getShotFormDefault`, `getShotFormBestDialInComparison`, `getShotsForBean`, `getLastShot`; shot form includes optional `shotDate` (date picker) for backdating and `saveAsBestDialIn` checkbox to promote shot values to bean optimal settings
- **Daily Tracking**: `onDailyBeanSelect`, `openShotFormFromDaily`, `openShotFormFromBean`
- **Helpers**: `getBeanById`, `getBeanOccurrence` (occurrence count for beans with same name+roaster), `shotQualityLabel`, `shotQualityClass`, `normalizeRating` (converts legacy numeric ratings to string labels), `getShotAssessment` (returns `{ status, label }` — evaluates shot against espresso standards for extraction time and brew ratio)
- **Optimal Settings**: `startEditingOptimal`, `saveOptimalSettings`, `cancelEditingOptimal`
- **Freshness**: `getFreshness` — returns `{ status, label, detail }`
- **Tab Navigation**: `activateTab` (switches tab, resets beans view to list, scrolls to top), `tabPaneStyle` (controls visibility and swipe animation transforms)
- **Tab Swipe (Touch)**: `onTabSwipeStart`, `onTabSwipeMove`, `onTabSwipeEnd`, `resetTabSwipe` — edge-initiated horizontal swipe gesture to navigate between tabs on touch devices. Includes axis lock (horizontal vs vertical), boundary resistance, and blocked-target detection (inputs, modals, existing swipe containers).
- **Calendar**: `calendarWeeks`, `calendarBars`, `calendarBarsUnique`, `calendarBarsForWeek`, `getRangeBandStyle`
- **Computed Properties**: `todayShots` (filtered by `shotDate === today`), `selectedBean`, `sortedBeans`, `currentBeans`, `archivedBeans`, `todayFormatted`, `calendarMonthLabel`; `getUniqueBeanSources()` for "Fill from previous bean" picker (de-duped by name+roaster, best representative; supports `{ archivedOnly: true }` option for Today modal context)

### Data Model

Stored in localStorage under keys `coffee_beans` and `coffee_shots`.

**Bean Schema:**
```javascript
{
  id: string,              // crypto.randomUUID()
  name: string,            // required
  roaster: string,         // required
  roastDate: string,       // ISO date "YYYY-MM-DD" or empty
  rating: number|null,     // 1-5 stars or null
  notes: string,
  isArchived: boolean,
  optimalGrindSize: number|null,
  optimalDoseIn: number|null,
  optimalYieldOut: number|null,
  optimalExtractionTime: number|null, // seconds
  createdAt: string        // ISO timestamp
}
```

**Shot Schema:**
```javascript
{
  id: string,              // crypto.randomUUID()
  beanId: string,          // foreign key to bean.id
  grindSize: number,       // typically 1-30
  doseIn: number,          // grams, typically 14-22
  yieldOut: number|null,   // grams, typically 28-50
  extractionTime: number|null, // seconds, typically 20-35
  rating: string|null,     // 'bad'|'okay'|'great'|'perfect'
  notes: string,
  shotDate: string,        // ISO date "YYYY-MM-DD" — when the shot was made (defaults to today; backfill from createdAt if missing)
  createdAt: string        // ISO timestamp — when the record was logged
}
```

### Boundaries & Invariants

**Boundaries:**
- `app()` owns all state; Alpine components access via `this`
- Steppers access their form via `stForm()` which returns `this.shotForm` or `this.optimalForm`
- DatePicker accesses its model via `dpValue()`/`dpSetValue()` using dot-notation path
- Bean form can render in two contexts: inline (Beans tab, `beansView = 'form'`) or modal overlay (Today tab, `showBeanFormModal = true`)

**Invariants:**
- A bean always has `name` and `roaster` (enforced in `saveBean`)
- A shot always has a valid `beanId` (enforced in `saveShot`)
- Archived beans don't appear in `currentBeans` or the daily picker
- Archiving a bean closes any open shot form referencing it
- Shot form defaults respect edited values when editing (via `getShotFormDefault`)
- Deleting a bean requires confirmation via the delete dialog modal
- Bean names are validated for uniqueness (case-insensitive) when adding from the Today picker flow
- Tab swipe gestures are blocked when overlays (shot form, bean modal, delete dialog) are open

### Alpine.js Components

| Component | Purpose | Form it uses |
|-----------|---------|--------------|
| `stepper()` | Numeric +/- input for shot form | `shotForm` |
| `optimalStepper()` | Numeric +/- input for optimal settings | `optimalForm` |
| `datePicker()` | Calendar date selector (roast date, shot date) | Dynamic via `dpModelKey` (e.g. `beanForm.roastDate`, `shotForm.shotDate`) |

Both `stepper` and `optimalStepper` are created by `createStepper(formName)` — a factory that parameterizes which form object the stepper reads/writes. The date picker uses a capture-phase document click listener for outside-click dismissal (avoids conflicts with `@click.stop` in modals).

### UI Patterns

**Tab Swipe Navigation (Touch):**
- Edge-initiated: swipe must start within the outer 28% of the content area width
- Axis lock: first 10px of movement determines horizontal vs vertical; vertical aborts the gesture
- Blocked targets: inputs, textareas, buttons, links, dropdowns, modals, existing swipe containers
- Boundary resistance: 0.28x damping when swiping past first/last tab
- Threshold: 18% of viewport width (min 56px) to commit tab change
- Both current and adjacent tab panes are rendered simultaneously during the gesture via absolute positioning

**Swipe-to-Delete (Mobile):**
- Touch gesture on shot cards: 36px threshold reveals a 72px delete action area
- Uses `touch-action: pan-y` on swipe containers to prevent scroll conflicts
- Disabled for archived beans

**Confirmation Dialogs:**
- **Shot deletion**: Local `confirmDelete` state — first tap shows "Delete?" confirmation, second tap deletes. Used in both Today and Bean detail views.
- **Bean deletion**: Modal dialog (`showDeleteBeanDialog`) with warning icon, bean name, shot count, Cancel/Delete buttons. Triggered from bean detail view.

**Shot History Toggle:**
- Bean detail shows first 5 shots with a "View all X shots" button to expand
- Local `showAllShots` state in `x-data`

**Shot Card Display Format:**
```
Grind 5 · 16g -> 32g (1:2.0) · 25s
Notes: Sweet with chocolate notes...        [Perfect]
```
- Ratio calculated as `yieldOut / doseIn`, shown as `1:X.X`
- Extraction time appended as `· Xs` (only if present)
- Notes truncated with ellipsis, max 80 characters
- Quality badge: Bad / Okay / Great / Perfect

**Bean Form — Two Contexts:**
- **Beans tab** (`beansView = 'form'`): Inline form with "Fill from previous bean" showing all beans (current + archived)
- **Today tab** (`showBeanFormModal = true`): Modal overlay with "Fill from previous bean" showing archived beans only. Validates bean name uniqueness. On save, auto-selects the new bean in the daily picker.

**Restore from Archive (Today Tab):**
- When no active beans exist, an expandable archive picker appears below the "Add Coffee Bean" CTA
- Shows up to 5 archived beans; links to full archive view if more exist
- Uses `duplicateFromArchive` to create a new active bean from an archived one

### Design Tokens

CSS variables define the full design system:

```css
/* Colors */
--espresso: #2C1810        /* Dark brown, primary text */
--cream: #F5F0E8           /* Background */
--amber: #D4A574           /* Accent, highlights */
--freshness-resting: #8B9DAF
--freshness-optimal: #7BA05B
--freshness-past: #A0695B

/* Typography */
--font-heading: 'Playfair Display'
--font-body: 'DM Sans'

/* Spacing */
--radius: 10px
--radius-sm: 6px
--radius-lg: 14px
```

Calendar bar colors are defined in JS `BAR_COLORS` array. Spacing utilities (`.mb-8` through `.mb-24`, `.mt-24`) and `.form-actions` are used in place of inline styles.

### PWA Support

- `manifest.json` provides installability metadata (name, icons, theme color, display mode)
- `icons/` directory contains app icons at multiple sizes (16, 32, 180, 192, 512px) plus an SVG source
- Apple-specific meta tags for iOS home screen (`apple-mobile-web-app-capable`, `apple-mobile-web-app-status-bar-style`)
- CSS handles iOS standalone mode layout quirks (100vh workaround for WebKit bug 254868)
- `crypto.randomUUID` polyfill for older browsers

## Development Patterns

### When Editing Shot Form Logic
- Use `getShotFormDefault(field)` to get initial values — it handles both new shots and edits
- For new shots, numeric form values start as `null` and render fallback values via stepper placeholders
- New shot defaults for `grindSize`/`doseIn`/`yieldOut`/`extractionTime` use bean best dial-in, then app defaults
- `saveShot()` resolves untouched `null` numeric fields to `getShotFormDefault(field)` so placeholder defaults are persisted
- Shot form includes `shotDate` (defaults to today for new shots; existing shots use `shotDate || createdAt` for display/filtering)
- Always call `closeShotForm()` to close — it handles cleanup for both tabs

### When Editing Best Dial-In Settings
- `startEditingOptimal()` keeps missing fields as `null` so placeholders show app defaults without mutating data
- `saveOptimalSettings()` treats untouched `null` values as explicit defaults and persists app defaults
- `cancelEditingOptimal()` exits edit mode without changing persisted optimal settings

### When Adding New Freshness-Related Logic
- Use `FRESHNESS_RESTING_DAYS` and `FRESHNESS_OPTIMAL_DAYS` constants
- Don't hardcode 7 or 21 anywhere

### When Adding New Bean/Shot Operations
- Always call `saveBeans()` or `saveShots()` after mutations
- Check if operation should close related forms (see `archiveBean` pattern)
- Update `dailySelectedBeanId` if the operation affects the selected bean
- If deleting a bean, also delete its shots and clean up any open modals/views

### When Modifying Forms
- Forms are Alpine component-scoped (`x-data`)
- Stepper components need `x-init` with `stInit(field, min, max, default)`
- Steppers select all text on focus (`stOnFocus`) for easy value replacement
- Stepper buttons use `touch-action: manipulation` to prevent double-tap zoom on mobile
- When a stepper field is empty/null, clicking +/- sets it to the default value (not increment from 0)
- Always reset form state on open and close
- Bean form supports two contexts (`beanFormContext`): check which context when modifying save/cancel logic

### When Adding Extraction Time / New Shot Fields
- Shot form defaults: grindSize=5, doseIn=18, yieldOut=36, extractionTime=25
- New fields should be nullable (optional) — the app handles null gracefully in display
- `init()` runs migrations on load to backfill new fields on existing data (e.g. `optimalExtractionTime` seeded from first shot)

### When Modifying Tab Navigation
- Tab swipe state is tracked across multiple properties (`tabSwipeTracking`, `tabSwipeAxis`, `tabSwipeOffsetX`, etc.)
- `resetTabSwipe()` must always be called to clean up — never leave swipe state hanging
- `isTabSwipeBlockedTarget()` prevents swipe conflicts with interactive elements; update the selector list if adding new interactive containers
- Swipe is disabled when any overlay is open (`showShotForm`, `showBeanFormModal`, `showDeleteBeanDialog`)

## Documentation

- `brainstorms/2026-01-25-coffee-bean-tracker-prd.md` — Product requirements
- `brainstorms/2026-01-25-coffee-bean-tracker-brainstorm.md` — Design decisions
- `brainstorms/2026-02-04-coffee-bean-tracker-audit.md` — PRD/design audit and next steps
- `brainstorms/2026-02-05-shot-date-picker-brainstorm.md` — Shot date picker (backdate shots)
- `brainstorms/2026-02-05-duplicate-bean-anywhere-brainstorm.md` — Duplicate / Fill from previous bean
- `brainstorms/2026-02-06-today-add-bean-modal-brainstorm.md` — Add Bean modal from Today tab
- `brainstorms/2026-02-06-cross-device-sync-code-brainstorm.md` — Cross-device sync (code approach)
- `brainstorms/2026-02-06-cross-device-auth-brainstorm.md` — Cross-device auth considerations
- `brainstorms/2026-02-20-save-shot-as-best-dial-in-brainstorm.md` — Save shot as best dial-in

## Testing

- `tests.html` — Unit tests for pure functions (date helpers, rating normalization, freshness logic)
- `test-e2e.html` — Integration tests that load the actual app and verify Alpine state/behavior

Run by opening in browser after starting local server.
