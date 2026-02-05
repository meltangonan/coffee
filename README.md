Here is a rewritten version that is more coffee-native, more accurate in how espresso people actually talk, and slightly tighter. I kept your structure and intent, but adjusted language, framing, and a few terms to better match serious home barista culture.

You can paste this over your existing README.

---

# Coffee Journal

A lightweight journal for home espresso. Track your beans, log shots, save your dial-ins, and see when each coffee is at its best.

No fluff. No accounts. Just the stuff you actually care about at the machine.

---

## Who It’s For

**Home baristas** who:

* Pull a few shots a day and forget what worked last time
* Rotate through different roasters and origins
* Care about rest, peak, and fade, not just roast date
* Want a quick reference, not a full-blown café POS system

There’s no sign-up and nothing to install. Open it in a browser on your phone or laptop. All data stays local.

---

## What It Does

### Today

Your daily shot log.

Pick the coffee you’re pulling and log the shot: grind, dose, yield, and how it tasted. You can backdate shots if you forgot to log them earlier. The Today view shows everything pulled on that date so you can quickly edit or delete.

### Coffee (Beans)

Each coffee you’re working through lives here.

* **Add beans**
  Name, roaster, roast date, notes, and a 1–5 star rating for the bag.

* **Save a dial-in**
  Once you’ve pulled a shot you like, save the grind, dose, and yield as the bean’s *best dial-in*. When you buy the same coffee again, you can duplicate the bean and keep those settings, changing only the roast date.

* **Archive finished bags**
  When a bag is done, archive it instead of deleting. You can restore or duplicate it later and keep your history and settings.

* **Duplicate beans**
  From a bean’s detail page, duplicate it for a new bag of the same coffee. From the Add Bean form, you can also “Fill from previous bean” to copy name, roaster, notes, and dial-in from any past entry.

### Calendar

A monthly view showing each coffee’s **peak freshness window**, visualized as bars across the calendar. This makes it easy to see which coffees are peaking, which are still resting, and what to open next.

Peak is estimated at roughly **7–21 days post-roast**, which works well for most espresso.

### Freshness States

Each bean shows a simple freshness status:

* **Resting** (0–6 days)
  Early post-roast. Still off-gassing; extraction can be unstable.

* **At Peak** (7–21 days)
  Best balance of stable extraction and vibrant flavor.

* **Past Peak** (22+ days)
  Still brewable, but aromatics and clarity may start to fade.

These are guidelines, not rules. Taste always wins.

---

## How to Use It

**Open the app in your browser.**
If someone shared a link (for example via GitHub Pages or another static host), open it on your phone or computer.

* **First time?**
  The app may load with sample data so you can explore. To start fresh, clear this site’s localStorage or open it in a private window.

* **Add a bean**
  From the Coffee tab, or directly from Today if you have no beans yet.

* **Log a shot**
  From Today or from a bean’s detail page.

* **Delete a shot**
  Swipe left on mobile, or use the delete control on desktop.

---

## Add to Home Screen (Recommended)

For day-to-day use, save the app to your phone’s home screen. It opens full-screen, feels like a native app, and gives you one-tap access when you’re at the machine.

* **iPhone (Safari):**
  Open the app → Share → Add to Home Screen → name it → Add.

* **Android (Chrome):**
  Open the app → ⋮ menu → Add to Home screen or Install app.

This doesn’t move your data. It’s the same app, just launched like an app.

---

## Your Data

All data is stored locally in your browser using **localStorage**.

* No server
* No account
* No cloud sync

Your data persists on the same device and browser. It does not sync across devices.

If you need to move data manually, you can copy the `coffee_beans` and `coffee_shots` keys from localStorage using browser dev tools.

---

## Tips

* Tap a bean to see its full history and saved dial-in.
* Archive beans instead of deleting them so you can reuse settings later.
* When logging a shot from Today, the form preloads your last settings for that coffee.
* Backdate shots if you forgot to log them when pulling.
* Treat saved dial-ins as references, not absolutes. Adjust as the coffee ages.

---

## For Developers

Single-page app. No build step.

Open `index.html` directly, or serve the folder locally (for example `python3 -m http.server`). Deploy by hosting `index.html` (and optional `manifest.json`) on any static host.

---

If you want, next we can tighten the language even further around “best dial-in” vs “reference dial-in”, or add a short philosophy note about taste-first dialing.