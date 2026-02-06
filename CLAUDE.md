# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Your Rules
- Ask: "Would a senior engineer say this is overcomplicated?" If yes, simplify
- Always think of engineering and software engineering/development best practices
- When uncertain, flag it explicitly rather than guessing and moving on
- Don't bulk-generate code without a clear, scoped task

## Project Overview

Coffee Bean Tracker — a mobile-first single-page application for tracking espresso beans, dialing in shots, monitoring freshness windows, and logging daily brewing. Built as a zero-dependency, zero-build single HTML file using Alpine.js 3.x with localStorage persistence. No backend, no authentication (single-user personal tool).

## Running the App

There is no build step. Open `index.html` directly in a browser or serve it locally:

```
python3 -m http.server
```

Deploy by copying `index.html` to any static host (GitHub Pages, Netlify, etc.).

### Running Tests

Serve the directory and open:
- `tests.html` — Unit tests for helper functions
- `test-e2e.html` — Integration tests that load the app in an iframe

## Architecture

The entire application lives in `index.html` (~1,890 lines) with three inline sections:

1. **CSS** (lines ~29-480): Design system with CSS variables, component styles, responsive layout, and spacing utilities. Uses "Warm Industrial Café" aesthetic with Playfair Display (headings) and DM Sans (body) fonts.
2. **HTML** (lines ~482-1193): Alpine.js template directives. Root element uses `x-data="app()" x-init="init()"`. Tab-based navigation (Today, Beans, Calendar) with no routing library.
3. **JavaScript** (lines ~1194-1888): Alpine components, helper functions, and main `app()` object.

### Core Abstractions

| Abstraction | What it represents | What it owns |
|-------------|-------------------|--------------|
| **Bean** | A coffee bean bag/batch | name, roaster, roastDate, rating, notes, isArchived, optimal settings |
| **Shot** | A single espresso pull | beanId (foreign key), grindSize, doseIn, yieldOut, extractionTime, rating, notes, shotDate, createdAt |
| **Freshness** | Bean age status | Derived from roastDate: resting/optimal/past |
| **Tab** | Navigation state | today/beans/calendar |
| **View** | Sub-navigation in Beans tab | list/detail/form/archive |

### Key Constants

```javascript
const FRESHNESS_RESTING_DAYS = 7;   // Days 0-6: Resting
const FRESHNESS_OPTIMAL_DAYS = 21;  // Days 7-21: At Peak
                                    // Days 22+: Past Peak
```

### Key Functional Modules (all methods on the `app()` object)

- **Bean Management**: `saveBean`, `deleteBean`, `selectBean`, `updateBeanRating`, `archiveBean`, `unarchiveBean`, `duplicateFromArchive`, `duplicateBean` (pre-fill form from existing bean; used by "Fill from previous bean" and duplicate-from-detail)
- **Shot Logging**: `saveShot`, `deleteShot`, `openShotForm`, `openShotFormForEdit`, `closeShotForm`, `getShotFormDefault`, `getShotsForBean`, `getLastShot`; shot form includes optional `shotDate` (date picker) for backdating
- **Daily Tracking**: `onDailyBeanSelect`, `openShotFormFromDaily`, `openShotFormFromBean`
- **Helpers**: `getBeanById`, `getBeanOccurrence` (occurrence count for beans with same name+roaster), `shotQualityLabel`, `shotQualityClass`
- **Optimal Settings**: `startEditingOptimal`, `saveOptimalSettings`, `cancelEditingOptimal`
- **Freshness**: `getFreshness` — returns `{ status, label, detail }`
- **Calendar**: `calendarWeeks`, `calendarBars`, `calendarBarsUnique`, `calendarBarsForWeek`, `getRangeBandStyle`
- **Computed Properties**: `todayShots` (filtered by `shotDate === today`), `selectedBean`, `sortedBeans`, `currentBeans`, `archivedBeans`, `todayFormatted`, `calendarMonthLabel`; `getUniqueBeanSources()` for "Fill from previous bean" picker (de-duped by name+roaster, best representative)

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
  rating: string|null,     // 'bad'|'okay'|'perfect'
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

**Invariants:**
- A bean always has `name` and `roaster` (enforced in `saveBean`)
- A shot always has a valid `beanId` (enforced in `saveShot`)
- Archived beans don't appear in `currentBeans` or the daily picker
- Archiving a bean closes any open shot form referencing it
- Shot form defaults respect edited values when editing (via `getShotFormDefault`)

### Alpine.js Components

| Component | Purpose | Form it uses |
|-----------|---------|--------------|
| `stepper()` | Numeric +/- input for shot form | `shotForm` |
| `optimalStepper()` | Numeric +/- input for optimal settings | `optimalForm` |
| `datePicker()` | Calendar date selector (roast date, shot date) | Dynamic via `dpModelKey` (e.g. `beanForm.roastDate`, `shotForm.shotDate`) |

### UI Patterns

**Swipe-to-Delete (Mobile):**
- Touch gesture on shot cards: 36px threshold reveals a 72px delete action area
- Uses `touch-action: pan-y` on swipe containers to prevent scroll conflicts
- Disabled for archived beans

**Confirmation Dialog:**
- Local `confirmDelete` state: first tap shows "Delete?" confirmation, second tap deletes
- Used on shot deletion in both Today and Bean detail views

**Shot History Toggle:**
- Bean detail shows first 5 shots with a "View all X shots" button to expand
- Local `showAllShots` state in `x-data`

**Shot Card Display Format:**
```
Grind 5 · 16g → 32g (1:2.0) · 25s
Notes: Sweet with chocolate notes...        [Perfect]
```
- Ratio calculated as `yieldOut / doseIn`, shown as `1:X.X`
- Extraction time appended as `· Xs` (only if present)
- Notes truncated with ellipsis, max 80 characters
- Quality badge: Bad / Okay / Perfect

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

## Development Patterns

### When Editing Shot Form Logic
- Use `getShotFormDefault(field)` to get initial values — it handles both new shots and edits
- Shot form includes `shotDate` (defaults to today for new shots; existing shots use `shotDate || createdAt` for display/filtering)
- Always call `closeShotForm()` to close — it handles cleanup for both tabs

### When Adding New Freshness-Related Logic
- Use `FRESHNESS_RESTING_DAYS` and `FRESHNESS_OPTIMAL_DAYS` constants
- Don't hardcode 7 or 21 anywhere

### When Adding New Bean/Shot Operations
- Always call `saveBeans()` or `saveShots()` after mutations
- Check if operation should close related forms (see `archiveBean` pattern)
- Update `dailySelectedBeanId` if the operation affects the selected bean

### When Modifying Forms
- Forms are Alpine component-scoped (`x-data`)
- Stepper components need `x-init` with `stInit(field, min, max, default)`
- Steppers select all text on focus (`stOnFocus`) for easy value replacement
- Stepper buttons use `touch-action: manipulation` to prevent double-tap zoom on mobile
- When a stepper field is empty/null, clicking +/- sets it to the default value (not increment from 0)
- Always reset form state on open and close

### When Adding Extraction Time / New Shot Fields
- Shot form defaults: grindSize=5, doseIn=16, yieldOut=32, extractionTime=25
- New fields should be nullable (optional) — the app handles null gracefully in display
- `init()` runs migrations on load to backfill new fields on existing data (e.g. `optimalExtractionTime` seeded from first shot)

## Documentation

- `brainstorms/2026-01-25-coffee-bean-tracker-prd.md` — Product requirements
- `brainstorms/2026-01-25-coffee-bean-tracker-brainstorm.md` — Design decisions
- `brainstorms/2026-02-04-coffee-bean-tracker-audit.md` — PRD/design audit and next steps
- `brainstorms/2026-02-05-shot-date-picker-brainstorm.md` — Shot date picker (backdate shots)
- `brainstorms/2026-02-05-duplicate-bean-anywhere-brainstorm.md` — Duplicate / Fill from previous bean

## Testing

- `tests.html` — Unit tests for pure functions (date helpers, rating normalization, freshness logic)
- `test-e2e.html` — Integration tests that load the actual app and verify Alpine state/behavior

Run by opening in browser after starting local server.
