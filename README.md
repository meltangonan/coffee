# Coffee Journal

A simple app for home espresso enthusiasts to track their beans, dial in shots, and monitor freshness.

## What It Does

**Track your beans** — Add each bag of coffee with the roaster name and roast date. Rate them 1-5 stars, add tasting notes, and archive old bags when they're done.

**Log your shots** — Record grind size, dose, and yield for each pull. Mark shots as bad, okay, or perfect to track your dial-in progress.

**Save your best settings** — Once you've dialed in a bean, save the optimal grind/dose/yield. These stay with the bean even as you log more experimental shots.

**Know when to drink it** — Freshness tracking tells you when each bean is:
- **Resting** (0-6 days) — Still off-gassing, extraction may be inconsistent
- **At Peak** (7-21 days) — Sweet spot for most espresso
- **Past Peak** (22+ days) — Still drinkable, but flavors fade

**Plan your rotation** — The calendar view shows colored bars for each bean's optimal window, so you can see at a glance what's peaking this month.

## Quick Start

Just open `index.html` in your browser. That's it.

To serve locally (useful for mobile testing):
```
python3 -m http.server
```
Then visit `http://localhost:8000` on any device on your network.

## Your Data

Everything is saved in your browser's localStorage. Your data stays on your device — there's no account, no cloud sync, no backend.

**First time?** The app loads with sample data so you can explore. Clear your browser's localStorage to start fresh.

**Switching browsers/devices?** Your data doesn't sync automatically. Export isn't built in yet, but you can copy the `coffee_beans` and `coffee_shots` keys from localStorage if needed.

## Tips

- **Swipe left** on any shot to reveal the delete button (on mobile)
- **Tap a bean** in the list to see its full history and optimal settings
- **Archive** beans you've finished instead of deleting — you can easily "bring back" the same coffee when you buy it again, and it remembers your settings
- **Quick log** — Select a bean on the Today tab and it opens the shot form pre-filled with your last settings

## Design Philosophy

This is a single HTML file with no build step, no dependencies to install, and no server required. It runs entirely in your browser.

Why? Because coffee logging should be fast and friction-free. Open tab, log shot, done.
