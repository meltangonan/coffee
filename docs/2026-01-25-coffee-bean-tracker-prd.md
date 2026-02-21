---
date: 2026-01-25
updated: 2026-02-04
topic: coffee-bean-tracker
type: prd
---

# Coffee Bean Tracker - Product Requirements Document

## Overview

**Product**: Coffee Bean Tracker
**Type**: Personal web application (single-user, no auth)
**Platform**: Mobile-first responsive web app
**Tech**: Static SPA with localStorage persistence

## Problem Statement

Home espresso enthusiasts buy various beans and need to:
1. Remember which grind/dose/yield settings worked for each bean
2. Track when beans are in their optimal freshness window (7-21 days post-roast)
3. Remember which beans they liked and which to repurchase

Currently this lives in memory, notes apps, or gets forgotten.

## User Persona

**Solo home barista** with a prosumer espresso machine (e.g., Breville Barista Express). Makes 1-2 drinks per day, experiments with local roasters, wants consistency without extensive note-taking.

## Functional Requirements

### FR-1: Bean Management

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-1.1 | User can add a new bean with: name, roaster, roast date | Must |
| FR-1.2 | User can edit bean details | Must |
| FR-1.3 | User can delete a bean (with confirmation) | Must |
| FR-1.4 | User can add optional notes to a bean | Should |
| FR-1.5 | User can rate a bean 1-5 stars (overall impression) | Must |
| FR-1.6 | User can view a list of all beans | Must |

### FR-2: Freshness Tracking

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-2.1 | App calculates freshness window: roast date + 7 days (start) to roast date + 21 days (end); boundaries inclusive (7 ≤ days since roast ≤ 21 = Optimal) | Must |
| FR-2.2 | Bean displays current freshness status: "Resting" (< 7 days), "Optimal" (7–21 days inclusive), "Past Peak" (> 21 days) | Must |
| FR-2.3 | Freshness status is visually distinct (color/icon) | Must |
| FR-2.4 | Bean detail shows days until optimal / days remaining in window | Should |

### FR-3: Shot Logging

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-3.1 | User can log a shot with: grind size, dose (g), yield (g) | Must |
| FR-3.2 | User can rate individual shots 1-5 stars | Must |
| FR-3.3 | User can mark a shot as "Best Recipe" | Must |
| FR-3.4 | Only one shot per bean can be "Best Recipe" (marking new one clears old) | Must |
| FR-3.5 | User can add optional notes to a shot | Should |
| FR-3.6 | User can view shot history for a bean (newest first) | Must |
| FR-3.7 | User can delete a shot | Should |
| FR-3.8 | Best Recipe is prominently displayed on bean detail page | Must |

### FR-4: Daily Tracking (MyFitnessPal-style)

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-4.1 | User can open a daily log view to record today's shot | Must |
| FR-4.2 | User selects a bean first, then enters shot details | Must |
| FR-4.3 | After selecting a bean, app offers to reuse that bean's last logged settings (grind size, dose, yield) with one tap | Must |
| FR-4.4 | User can decline reuse and enter settings manually | Must |
| FR-4.5 | Daily log shows a summary of today's entries (bean used, settings, time) | Should |
| FR-4.6 | User can log multiple shots per day | Should |

### FR-5: Calendar View (Freshness Windows)

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-5.1 | User can view a monthly calendar showing freshness windows as horizontal bars | Must |
| FR-5.2 | Each active bean is assigned a distinct color | Must |
| FR-5.3 | Bars span from roast date + 7 days to roast date + 21 days across the calendar grid | Must |
| FR-5.4 | Overlapping bars are visually stacked or layered so both are visible | Must |
| FR-5.5 | Only active (non-archived) beans with a roast date are shown; only beans whose optimal window overlaps the visible month are displayed (bars entirely in the past for that month are not shown) | Must |
| FR-5.6 | User can navigate between months (prev/next) | Should |
| FR-5.7 | Today's date is highlighted on the calendar | Should |
| FR-5.8 | A legend or labels identify which color maps to which bean | Must |

### FR-6: Data Persistence

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-6.1 | All data persists in browser localStorage | Must |
| FR-6.2 | App loads existing data on startup | Must |
| FR-6.3 | Data saves automatically on changes | Must |
| FR-6.4 | User can export all data as JSON | Could |
| FR-6.5 | User can import data from JSON | Could |

## Non-Functional Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| NFR-1 | Mobile-first responsive design (works on phone in kitchen) | Must |
| NFR-2 | Page load < 2 seconds on 3G | Should |
| NFR-3 | Works offline after initial load (may require service worker; defer to post-MVP if not in scope) | Should |
| NFR-4 | No external API dependencies | Must |
| NFR-6 | "Today" for daily log uses the device's local date | Must |
| NFR-5 | Accessible color contrast ratios | Should |

## Assumptions

- **Today**: Daily log and "today's entries" use the device's local date (no timezone override).
- **Ordering**: Shot history and today's log are ordered by creation time (newest first) using a persisted timestamp (e.g. `createdAt`).

## Empty States

| Context | Behavior |
|--------|----------|
| No beans yet | Dashboard shows empty state with clear CTA: "Add your first bean" (or equivalent). |
| Bean has no shots | Bean detail shows empty shot history with CTA: "Log your first shot" (or equivalent). Best Recipe card is hidden. |
| Daily log, no shots today | Daily log shows empty state: "No shots logged today" and focuses on bean selector + log flow. |

## User Flows

### Flow 1: Add New Bean

```
Dashboard → "Add Bean" button → Form (name, roaster, roast date) → Save → Return to Dashboard
```

### Flow 2: Log a Shot

```
Dashboard → Tap Bean → Bean Detail → "Log Shot" button → Form (grind, dose, yield, rating) → Save → Return to Bean Detail
```

### Flow 3: Check Best Recipe

```
Dashboard → Tap Bean → View "Best Recipe" card at top of Bean Detail
```

### Flow 4: Morning Routine (Primary) — Updated

```
Open App → Daily Log → Select bean → "Use last settings?" → Confirm or adjust → Log shot → Make coffee
```

### Flow 5: Quick Repeat (Daily Tracking)

```
Open App → Daily Log → Select bean → "Use last settings for [bean]?" → Tap "Yes" → Shot logged
```

### Flow 6: Check Freshness Calendar

```
Open App → Calendar tab → View monthly bars → See which beans are in their optimal window this week
```

## UI Specifications

### Screen 0: Daily Log (new — potential default landing)

**Layout**:
- Date header (today's date)
- Bean selector (dropdown or card picker)
- After selecting bean: "Use last settings?" prompt with pre-filled values
- Confirm button to log with one tap, or edit fields to customize
- Today's shot log summary below (list of shots pulled today)

**Reuse behavior**:
- Pulls the most recent shot logged for the selected bean
- Pre-fills: grind size, dose in, yield out
- User can accept as-is or modify any field before saving

### Screen 1: Dashboard (Bean List)

**Layout**:
- Header with app title
- Bean cards in a vertical list
- Floating "Add Bean" button

**Bean Card displays**:
- Bean name (primary)
- Roaster name (secondary)
- Freshness status badge (Resting / Optimal / Past Peak)
- Star rating (if rated)
- Visual indicator if Best Recipe exists

### Screen 2: Bean Detail

**Layout**:
- Back navigation
- Bean info header (name, roaster, rating)
- Freshness display (status + days info)
- Best Recipe card (if exists) - prominent placement
- Shot history list
- "Log Shot" button

**Best Recipe Card displays**:
- Grind size
- Dose (g in)
- Yield (g out)
- Ratio calculated (e.g., "1:2")

### Screen 3: Add/Edit Bean Form

**Fields**:
- Bean name (text, required)
- Roaster (text, required)
- Roast date (date picker, required)
- Rating (1-5 stars, optional)
- Notes (textarea, optional)

### Screen 4: Log Shot Form

**Fields**:
- Grind size (number input)
- Dose in grams (number input, step 0.1)
- Yield in grams (number input, step 0.1)
- Rating (1-5 stars)
- Mark as Best Recipe (toggle)
- Notes (textarea, optional)

### Screen 5: Calendar View (new)

**Layout**:
- Month/year header with prev/next navigation
- Standard monthly calendar grid (7 columns, 4-6 rows)
- Today's date highlighted
- Horizontal colored bars spanning each bean's optimal window (roast date + 7 to roast date + 21)
- Legend at bottom mapping colors to bean names

**Bar behavior**:
- Each active bean gets a distinct color from a predefined palette
- Bars that overlap are stacked vertically within the day cells (not hidden)
- Bars extend across week boundaries seamlessly
- Only beans with a roast date whose optimal window overlaps the visible month are shown (no bars entirely in the past for that month)

## Visual Design

**Aesthetic**: Warm Industrial Café

| Element | Specification |
|---------|---------------|
| Primary color | Espresso brown (#2C1810) |
| Background | Warm cream (#F5F0E8) |
| Accent | Amber/copper (#D4A574) |
| Freshness: Resting | Muted blue-gray |
| Freshness: Optimal | Warm green/amber |
| Freshness: Past Peak | Muted red/brown |
| Calendar bean bars | Distinct hues from a warm palette (terracotta, sage, mustard, plum, teal, etc.) |
| Heading font | Serif with character (e.g., Fraunces, Playfair) |
| Body font | Clean geometric sans (e.g., DM Sans, Satoshi) |
| Border radius | Soft but not pill-shaped (8-12px) |
| Shadows | Warm, subtle, layered |

## Success Metrics

Since this is a personal tool, success is qualitative:
- Can quickly find best recipe for a bean (< 5 seconds)
- Can log a shot in < 30 seconds
- Freshness status is glanceable from bean list
- Enjoyable to use as part of morning routine

## Out of Scope (v1)

- User accounts / authentication
- Cloud sync / multi-device
- Brew timer
- Bean inventory quantities
- Purchase tracking / price
- Sharing recipes
- Complex tasting notes / flavor wheels
- Push notifications
- Grind amount tracking (always max — no value in logging)

## Future Considerations (v2+)

- JSON export/import for backup
- "Archive" for finished bags
- Bean photos
- Brew ratio calculator
- PWA for home screen install
- Daily log as default home screen (evaluate after using calendar + daily log for a while)
- Weekly/daily view for calendar (start with monthly only)
- Shot streaks / consistency tracking (gamification)
