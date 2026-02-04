# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Coffee Bean Tracker — a mobile-first single-page application for tracking espresso beans, dialing in shots, monitoring freshness windows, and logging daily brewing. Built as a zero-dependency, zero-build single HTML file using Alpine.js 3.x with localStorage persistence. No backend, no authentication (single-user personal tool).

## Running the App

There is no build step. Open `index.html` directly in a browser or serve it locally:

```
python3 -m http.server
```

Deploy by copying `index.html` to any static host (GitHub Pages, Netlify, etc.).

## Architecture

The entire application lives in `index.html` (~1,220 lines) with three inline sections:

1. **CSS** (lines ~11-282): Design system with CSS variables, component styles, responsive layout, and spacing utilities. Uses "Warm Industrial Café" aesthetic with Playfair Display (headings) and DM Sans (body) fonts.
2. **HTML** (lines ~283-765): Alpine.js template directives. Root element uses `x-data="app()" x-init="init()"`. Tab-based navigation (Today, Beans, Calendar) with no routing library.
3. **JavaScript** (lines ~767-1221): `createStepper()` factory for Alpine.js stepper components, helper functions (`normalizeRating`, `isSameDay`, `addDays`, `daysBetween`), main `app()` object, and seed data generator.

### Key Functional Modules (all methods on the `app()` object)

- **Bean Management**: `saveBean`, `deleteBean`, `selectBean`, `updateBeanRating` — CRUD with name+roaster required
- **Shot Logging**: `saveShot`, `deleteShot`, `openShotFormForEdit` — tracks grind size, dose, yield, quality rating (bad/okay/perfect)
- **Daily Tracking**: `onDailyBeanSelect`, `logQuickShot`, `logQuickShotForBean`, `openShotFormFromDaily` — MFP-style daily log with "use last settings" reuse
- **Optimal Settings**: `startEditingOptimal`, `saveOptimalSettings` — per-bean grind/dose/yield settings (independent of shot log)
- **Freshness**: `getFreshness` — Resting (<7d), Optimal (7-21d inclusive), Past Peak (>21d) from roast date
- **Calendar**: `calendarWeeks`, `calendarBars`, `getBarStyle` — monthly grid with colored bean freshness window bars

### Data Model

Stored in localStorage under keys `coffee_beans` and `coffee_shots`. Beans have id, name, roaster, roastDate, rating (1-5), notes, isArchived, optimalGrindSize, optimalDoseIn, optimalYieldOut, createdAt. Shots reference beanId and store grindSize, doseIn, yieldOut, rating ('bad'|'okay'|'perfect'|null), isBestRecipe, notes, createdAt.

### Design Tokens

CSS variables define the full design system: `--espresso` (dark), `--cream` (background), `--amber` (accents), freshness state colors (`--freshness-optimal`, `--freshness-resting`, `--freshness-past`), shadow scale, and border radii. Calendar bar colors are defined in the JS `BAR_COLORS` array. Spacing utilities (`.mb-8` through `.mb-24`, `.mt-24`) and `.form-actions` are used in place of inline styles.

## Documentation

- `brainstorms/2026-01-25-coffee-bean-tracker-prd.md` — Product requirements
- `brainstorms/2026-01-25-coffee-bean-tracker-brainstorm.md` — Design decisions
- `brainstorms/2026-02-04-coffee-bean-tracker-audit.md` — PRD/design audit and next steps
