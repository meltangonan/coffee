
# Coffee Journal

A lightweight journal for home espresso. Track your beans, log shots, and see when each coffee is at its best.

No fluff. No accounts. Just the stuff you actually care about at the machine.

---

## Who It's For

**Home baristas** who:

* Pull a few shots a day and forget what worked last time
* Rotate through different roasters and origins
* Care about rest, peak, and fade, not just roast date
* Want a quick reference, not a full-blown cafe POS system

There's no sign-up and nothing to install. Open it in a browser on your phone or laptop. All data stays local.

---

## What It Does

### Home

Your starting point at the machine.

Home opens with your all-time shot count and current brew-day streak. Pick the coffee you're pulling and log the shot: grind, dose, yield, extraction time, and how it tasted.

Recent Shots shows the latest three pulls across all beans, including the date each was pulled. Each card keeps the ratio, notes, assessment, portafilter, edit, and delete details close at hand. You can backdate shots if you forgot to log them earlier.

If you don't have any beans yet, Home walks you through adding your first one or restoring a previously archived bean.

You can also add a new bean directly from Home without leaving the tab. The app validates the name and auto-selects the new bean so you can start logging right away.

### Beans

Each coffee you're working through lives here.

* **Add beans**
  Name, roaster, roast date, notes, and a 1-5 star rating for the bag.

* **Use the last shot as your starting point**
  Each new shot starts from the most recent shot logged for that same bag. If there is no shot history yet, the app uses the standard defaults: grind 5, 18g in, 36g out, 25s.

* **Archive finished bags**
  Use the Current and Archive tabs to keep active bags separate from finished ones. Archive a bag instead of deleting it so you can restore or duplicate it later and keep your history.

* **Duplicate beans**
  From a bean's detail page, duplicate it for a new bag of the same coffee. From the Add Bean form, you can also "Fill from previous bean" to copy identity details like name, roaster, and notes from a past entry.

* **Delete beans**
  Deleting a bean permanently removes it and all its shot history. The app asks you to confirm before deleting, showing you how many shots will be lost.

### Calendar

A monthly view showing each coffee's **peak freshness window**, visualized as colored bars across the calendar. This makes it easy to see which coffees are peaking, which are still resting, and what to open next.

Peak is estimated at roughly **7-21 days post-roast**, which works well for most espresso.

### Freshness States

Each bean shows a simple freshness status:

* **Resting** (0-6 days)
  Early post-roast. Still off-gassing; extraction can be unstable.

* **At Peak** (7-21 days)
  Best balance of stable extraction and vibrant flavor.

* **Past Peak** (22+ days)
  Still brewable, but aromatics and clarity may start to fade.

These are guidelines, not rules. Taste always wins.

---

## How to Use It

**Open the app in your browser.**
If someone shared a link (for example via GitHub Pages or another static host), open it on your phone or computer.

* **First time?**
  The app starts empty. Add your first bean from the Beans tab or directly from Home and start logging.

* **Add a bean**
  From the Beans tab, or directly from Home if you have no beans yet.

* **Log a shot**
  From Home or from a bean's detail page.

* **Edit a shot**
  Tap any shot card to reopen the form with its values pre-filled.

* **Delete a shot**
  Swipe left on mobile, or use the delete control on desktop. The app asks you to confirm first.

* **Switch tabs**
  Tap the tab bar at the bottom, or swipe from the edge of the screen on mobile to move between Home, Beans, Calendar, and Stats.

---

## Add to Home Screen (Recommended)

For day-to-day use, save the app to your phone's home screen. It opens full-screen, feels like a native app, and gives you one-tap access when you're at the machine.

* **iPhone (Safari):**
  Open the app -> Share -> Add to Home Screen -> name it -> Add.

* **Android (Chrome):**
  Open the app -> menu -> Add to Home screen or Install app.

This doesn't move your data. It's the same app, just launched like an app.

---

## Your Data

All data is stored locally in your browser using **localStorage**.

* No server
* No account
* No cloud sync

Your data persists on the same device and browser. It does not sync across devices.

If you need to move data manually, you can copy the `coffee_beans`, `coffee_shots`, and `coffee_portafilters` keys from localStorage using browser dev tools.

---

## Tips

* Tap a bean to see its full shot history.
* Archive beans instead of deleting them so the history stays available.
* When logging a shot, numeric fields show placeholder defaults from that bean's most recent shot, or app defaults (5 / 18g / 36g / 25s) when there is no history. Saving without touching those fields still logs those default values.
* Portafilters are optional shot context. You can add or rename them from the shot form, and selecting one does not change shot defaults.
* Backdate shots if you forgot to log them when pulling.
* Shot cards show ratio (1:X.X) and notes inline so you can compare at a glance.
* Swipe from the edge of the screen to quickly navigate between tabs.
* Use "Fill from previous bean" when adding a new bag of a coffee you've had before to carry over its identity details only.

---

## For Developers

Single-page app. No build step.

Open `index.html` directly, or serve the folder locally (for example `python3 -m http.server`). Deploy by hosting `index.html`, `manifest.json`, and the `icons/` directory on any static host.
