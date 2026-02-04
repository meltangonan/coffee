---
date: 2026-01-25
updated: 2026-02-04
topic: coffee-bean-tracker
---

# Coffee Bean Tracker - Design Doc

## What We're Building

A personal web app for tracking espresso beans, dial-in settings, and freshness windows — with a daily tracking habit (MyFitnessPal-style) and a calendar view for freshness windows. Built for the morning coffee routine: quick to log, easy to reference, and satisfying to use daily.

The core use case: You buy a bag of beans from a local Chicago roaster. You enter the roast date and the app tells you when they're in their optimal 7-21 day window. As you dial in your shots, you log your settings. Once you nail it, you mark that as your "best recipe" so next time you buy that bean, you know exactly where to start.

**New in this update (2026-02-04):**
- **Daily tracking flow** — a MyFitnessPal-inspired daily logging experience. Open the app, log today's shot. Option to reuse the last settings for the bean you select, or enter fresh.
- **Calendar view** — monthly view showing colored horizontal bars for each active bean's freshness window. Beans overlap visually with distinct colors so you can see at a glance which beans are in their prime this week.

## Why This Approach

**Chosen: Static SPA with localStorage**

We considered a backend with database, but for a single-user personal tool:
- No authentication complexity
- Zero hosting costs (GitHub Pages / Netlify)
- Works offline (useful in the kitchen)
- Faster to build and iterate

Trade-off accepted: Data lives in one browser. For a personal morning coffee tool, this is fine.

## Key Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **Persistence** | localStorage | Simple, no backend, works offline |
| **Framework** | Vanilla JS or lightweight (Alpine/Petite-Vue) | Keep it simple, fast load times |
| **Freshness tracking** | Auto-calculated from roast date | User enters roast date, app shows status |
| **Shot logging** | Multiple shots per bean + "best recipe" flag | Captures experimentation AND quick reference |
| **Rating system** | Simple 1-5 stars | Fast to log, no friction in morning routine |
| **Alerts/notifications** | None | Just display status, no interruptions |
| **Calendar scope** | Active beans only | No need to clutter with finished bags |
| **Daily log reuse** | Per-bean last settings | Pick bean first, then offer to reuse that bean's last shot config |
| **Grind amount field** | Not tracked | Always max; no value in logging it |

## Data Model

```
Bean {
  id: string
  name: string           // "Kickstart"
  roaster: string        // "Dark Matter Coffee"
  roastDate: date        // 2026-01-15
  rating: number         // 1-5 stars (overall impression)
  notes: string          // optional free text
  createdAt: date
}

Shot {
  id: string
  beanId: string
  grindSize: number      // e.g., 5
  doseIn: number         // grams in, e.g., 16
  yieldOut: number       // grams out, e.g., 32
  rating: number         // 1-5 for this specific shot
  isBestRecipe: boolean  // mark as the "dialed-in" settings
  notes: string          // optional
  createdAt: date
}
```

## Core Screens

1. **Dashboard / Bean List**
   - Shows all beans with freshness status indicator
   - Quick-add new bean button
   - Tap bean to see details

2. **Bean Detail**
   - Bean info + roast date + freshness window display
   - "Best Recipe" card (if set) - the go-to settings
   - Shot history log
   - Add new shot button

3. **Add/Edit Bean Form**
   - Name, roaster, roast date, optional notes

4. **Log Shot Form**
   - Grind size, dose, yield, rating
   - Toggle for "mark as best recipe"

5. **Daily Log (new)**
   - MyFitnessPal-style daily entry point
   - Select a bean → app offers "Use last settings for [bean]?" with one tap to confirm
   - Or enter new settings manually
   - Shows today's log summary (what you pulled, when)
   - Designed to be the default landing experience over time

6. **Calendar View (new)**
   - Monthly calendar grid
   - Horizontal colored bars span across the days each active bean is in its optimal window
   - Each bean has a distinct color
   - Bars can overlap (multiple beans in window at the same time)
   - Quickly answers: "Which beans should I be using this week?"

## Visual Design Direction

**Aesthetic: Warm Industrial Café**

- **Palette**: Deep espresso (#2C1810), warm cream (#F5F0E8), amber accent (#D4A574), muted copper for alerts
- **Typography**: Characterful serif for headings (roaster label feel), clean geometric sans for data
- **Texture**: Subtle paper/grain texture, slight warmth - not sterile
- **Freshness indicator**: Visual arc or progress bar showing position in 7-21 day window

**Key UI element**: The freshness display should be immediately scannable - glance at your bean list and know which bags are in their prime.

## Real Bean Data (Reference)

These are actual beans and settings being tracked today, useful as seed data and for validating the data model:

| Bean | Roaster | Dose In | Yield Out | Grind Size | Rating | Notes |
|------|---------|---------|-----------|------------|--------|-------|
| Light Roast | Starbucks | 16g | — | 4 | — | — |
| Espresso Roast | Starbucks | 16g | — | 4 | — | Manually grind all |
| Guatemala David Solano | Temple | 18g | 31g | 6 | 4/5 | Good as a cortado |
| A Love Supreme | Dark Matter | 18g | 29g | 5 | 3/5 | Nothing special |
| Unicorn Blood | Dark Matter | 16g | 32g | 5 | 4/5 | Came out a bit fast, maybe +1g |
| Big Riff | Metric | 16g | 34g | 6 | — | — |
| Pilipinas | 4LW | 16g | — | 4 | — | — |

## Open Questions (Resolved in PRD where noted)

- ~~Should we support multiple "active" bags vs archived beans?~~ Start simple: just a list; archive is out of scope for v1 (PRD Out of Scope).
- ~~Export/backup functionality?~~ JSON export/import is "Could" in PRD; deferred to v2.
- **Daily log as default home?** Deferred: evaluate after using calendar + daily log (PRD Future Considerations).
- ~~Calendar: beans without a roast date?~~ Resolved: exclude them (PRD FR-5.5, Screen 5).

## Next Steps

→ ~~Update PRD with calendar and daily tracking requirements~~ ✅  
→ Build out the UI with the warm industrial café aesthetic  
→ Consider seed data import from the real bean list above (use 1–5 star scale for ratings)
