# Coffee Journal

A mobile-first single-page app for tracking espresso beans, dialing in shots, monitoring freshness windows, and logging daily brewing.

Built as a single HTML file with [Alpine.js](https://alpinejs.dev/) 3.x and localStorage. No backend, no build step, no dependencies to install.

## Features

- **Bean Management** — Add beans with roaster, roast date, rating, and notes. Archive old beans to keep your list clean.
- **Shot Logging** — Track grind size, dose, yield, and quality (bad/okay/perfect) for each pull. Edit or delete any shot.
- **Optimal Settings** — Save your dialed-in grind/dose/yield per bean, independent of the shot log.
- **Quick Log** — Select a bean and reuse your last shot settings with one tap, or adjust before logging.
- **Freshness Tracking** — Automatic freshness status based on roast date: Resting (<7 days), Optimal (7-21 days), Past Peak (>21 days).
- **Calendar View** — Monthly calendar with colored bars showing each bean's optimal freshness window.

## Getting Started

No build step required. Open `index.html` directly in a browser, or serve it locally:

```
python3 -m http.server
```

Deploy by copying `index.html` to any static host (GitHub Pages, Netlify, etc.).

## Tech Stack

- **Alpine.js 3.x** — Reactive UI via CDN
- **localStorage** — Data persistence (`coffee_beans`, `coffee_shots`)
- **Playfair Display + DM Sans** — Typography via Google Fonts
- **Zero dependencies** — No npm, no bundler, no framework beyond Alpine

## Data

All data is stored in the browser's localStorage. On first load, seed data is generated to demonstrate the app. Clear localStorage to reset.
