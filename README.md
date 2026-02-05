# Coffee Journal

A simple web app for home espresso enthusiasts: track your beans, log your shots, dial in your grind, and see at a glance when each coffee is at its best.

---

## Who It’s For

**Home baristas** who:

- Pull 1–2 shots a day and want to remember what worked
- Buy from different roasters and forget which settings suited which bean
- Care about freshness (resting vs peak vs past peak) and want to plan their rotation
- Don’t want a heavy app — just a quick way to log and look things up

No account, no install. Open the link, use it on your phone or laptop. Your data stays in your browser.

---

## What It Does

### Today

Your daily log. Pick which bean you’re pulling, then log the shot (grind, dose, yield, how it tasted). You can backdate a shot if you forgot to log it yesterday. Today’s list shows everything you pulled “today” so you can edit or delete from there.

### Coffee (Beans)

- **Add beans** — Name, roaster, roast date. Rate the bag 1–5 stars and add notes.
- **Save optimal settings** — Once a bean is dialed in, save grind/dose/yield on the bean. Next time you add the same coffee (e.g. “Fill from previous bean”), those settings copy over; you only change the roast date.
- **Archive** — When a bag is finished, archive it. You can bring it back later (e.g. when you buy the same coffee again) and duplicate it so you keep your settings.
- **Duplicate** — From a bean’s detail page you can duplicate it (new bag, same coffee). From the “Add bean” form you can choose “Fill from previous bean” to copy name, roaster, notes, and optimal settings from any past or current bean.

### Calendar

A month view with colored bars for each bean’s **peak freshness window** (about 7–21 days after roast). See which beans are in the sweet spot this month and plan what to open next.

### Freshness

Each bean shows a status:

- **Resting** (0–6 days) — Still off-gassing; extraction can be inconsistent.
- **At Peak** (7–21 days) — Sweet spot for most espresso.
- **Past Peak** (22+ days) — Still drinkable; flavors gradually fade.

---

## How to Use It

**Just open the app in your browser.**  
If someone shared a link with you (e.g. GitHub Pages or a static host), open that URL on your phone or computer. No sign-up, no install.

- **First time?** The app may load with sample data so you can click around. To start with a clean slate, clear your browser’s localStorage for this site (or use a private window and clear data when you’re done testing).
- **Add a bean** from the Coffee tab (or from Today if you have no beans yet).
- **Log a shot** from Today by choosing a bean and filling in the form, or from a bean’s detail page.
- **Swipe left** on a shot (on mobile) to reveal the delete button.

---

## Add to Home Screen (Recommended)

For the best experience on your phone, **save the app to your home screen**. It will open in its own window (no browser bar), feel like a native app, and give you a one-tap shortcut when you’re at the machine.

- **iPhone (Safari):** Open the app in Safari → tap the **Share** button (square with arrow) → **Add to Home Screen** → name it (e.g. “Coffee Journal”) → **Add**.
- **Android (Chrome):** Open the app in Chrome → tap the **⋮** menu → **Add to Home screen** or **Install app** → confirm.

Your data still lives in the browser for that “install”; it’s the same app, just launched from your home screen.

---

## Your Data

Everything is stored in your browser’s **localStorage**. There is no server, no account, and no cloud sync. Data stays on the device you’re using.

- **Same browser, same device** — Your beans and shots persist between visits.
- **Different browser or device** — Data does not sync. Export isn’t built in yet; if you need to move data, you can copy the `coffee_beans` and `coffee_shots` keys from localStorage (e.g. via DevTools).

---

## Tips

- **Swipe left** on any shot to reveal the delete button (on mobile).
- **Tap a bean** in the list to see its full history and optimal settings.
- **Archive** beans when you’re done instead of deleting — you can restore or duplicate them when you buy the same coffee again, and it keeps your settings.
- **Quick log** — On the Today tab, select a bean and the shot form opens with your last settings for that bean; adjust and save.
- **Backdate a shot** — In the shot form, use the date picker next to “How was this shot?” to log a shot for a past date.

---

## For Developers

Single HTML file, no build step. Open `index.html` directly or serve the folder (e.g. `python3 -m http.server`) for local or mobile testing. Deploy by hosting `index.html` (and optional `manifest.json`) on any static host.
