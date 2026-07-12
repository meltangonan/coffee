---
name: Coffee Journal
description: A lightweight local-first journal for home espresso — warm, calm, precise.
colors:
  espresso: "#2C1810"
  espresso-light: "#3D2820"
  cream: "#F5F0E8"
  cream-dark: "#EDE6DA"
  surface-white: "#FFFFFF"
  amber: "#D4A574"
  amber-light: "#E8C9A0"
  amber-dark: "#B8864E"
  text-secondary: "#6B5B4E"
  text-muted: "#9B8B7E"
  freshness-resting: "#8B9DAF"
  freshness-optimal: "#7BA05B"
  freshness-past: "#A0695B"
  great-blue: "#4F6FA5"
typography:
  display:
    fontFamily: "Playfair Display, Georgia, serif"
    fontSize: "28px"
    fontWeight: 700
    lineHeight: 1.2
  headline:
    fontFamily: "Playfair Display, Georgia, serif"
    fontSize: "22px"
    fontWeight: 600
    lineHeight: 1.3
  title:
    fontFamily: "Playfair Display, Georgia, serif"
    fontSize: "18px"
    fontWeight: 600
    lineHeight: 1.3
  body:
    fontFamily: "DM Sans, Helvetica Neue, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "DM Sans, Helvetica Neue, sans-serif"
    fontSize: "13px"
    fontWeight: 500
    lineHeight: 1.4
rounded:
  sm: "6px"
  md: "10px"
  lg: "14px"
  pill: "20px"
spacing:
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "24px"
components:
  button-primary:
    backgroundColor: "{colors.espresso}"
    textColor: "{colors.cream}"
    rounded: "{rounded.md}"
    padding: "12px 24px"
    height: "44px"
  button-primary-hover:
    backgroundColor: "{colors.espresso-light}"
  button-amber:
    backgroundColor: "{colors.amber}"
    textColor: "{colors.espresso}"
    rounded: "{rounded.md}"
    padding: "12px 24px"
    height: "44px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.text-secondary}"
    rounded: "{rounded.md}"
    padding: "12px 16px"
  input:
    backgroundColor: "{colors.surface-white}"
    textColor: "{colors.espresso}"
    rounded: "{rounded.md}"
    padding: "12px 14px"
    height: "44px"
  card:
    backgroundColor: "{colors.surface-white}"
    textColor: "{colors.espresso}"
    rounded: "{rounded.md}"
    padding: "16px"
  badge:
    rounded: "{rounded.pill}"
    padding: "4px 10px"
---

# Design System: Coffee Journal

## 1. Overview

**Creative North Star: "The Barista's Notebook"**

Coffee Journal looks and feels like a well-kept paper notebook that lives next to the espresso machine: warm pages, dark ink, exact numbers written in a steady hand. The palette is literal coffee — espresso ink on steamed-cream paper with caramel-amber accents — but the discipline is a working tool's, not a café's décor. Serif headings (Playfair Display) give the journal its handwritten warmth; DM Sans carries the data cleanly. Density is generous: one column, big touch targets, room to breathe, because the user has one free hand and ten seconds.

The system explicitly rejects the four anti-references from PRODUCT.md: fitness-app gamification, café-POS density, the generic cool-gray SaaS dashboard, and Instagram-café twee. Color is never decorative cheer; every non-neutral hue in the system means something (freshness state, shot quality, a bean's calendar ribbon).

**Key Characteristics:**
- Warm, calm, precise — café warmth carried by type and color, not ornament
- Mobile-first single column (max 600px), thumb-reachable, 44px minimum targets
- Semantic color: hue = state, never mood
- Paper-like depth: espresso-tinted shadows, cards resting on cream
- Subtle grain: a faint SVG noise texture on the body background keeps the cream from feeling sterile

## 2. Colors

Literal coffee tones as neutrals, with a small set of semantic hues that always carry meaning.

### Primary
- **Espresso Ink** (#2C1810): The brand's dark brown — primary text, the tab bar, primary buttons, and heading color. It is the "ink" of the notebook; nearly every dark pixel in the app is this hue. Hover state lightens to **Warmed Espresso** (#3D2820).

### Secondary
- **Caramel Amber** (#D4A574): The single accent. Active tab tint, focused input borders, the amber CTA button, and "Okay" quality tint. Ramp: **Light Caramel** (#E8C9A0) for hovers, **Toasted Caramel** (#B8864E) for text-on-light and active states.

### Tertiary (semantic state hues — never decorative)
- **Resting Slate** (#8B9DAF): Freshness "Resting" (days 0–6). Cool and patient.
- **Peak Leaf** (#7BA05B): Freshness "At Peak" (days 7–21) and "Perfect" shot quality.
- **Past-Peak Clay** (#A0695B): Freshness "Past Peak" (day 22+), "Bad" shot quality, and destructive actions.
- **Great Blue** (#4F6FA5): "Great" shot quality. Deliberately distinct from Peak Leaf so Great and Perfect never blur together. Each state hue has a matched 12–18% opacity tint for badge backgrounds.

### Neutral
- **Steamed Cream** (#F5F0E8): The page background — the notebook's paper, textured with faint grain.
- **Cream Shadow** (#EDE6DA): Recessed surfaces (legend wells, grouped lists).
- **Card White** (#FFFFFF): Card and input surfaces, floating on the cream.
- **Roast Brown** (#6B5B4E): Secondary text. **Faded Roast** (#9B8B7E): Muted text, placeholders, timestamps.
- Borders are espresso at low alpha (rgba(44,24,16,0.06–0.15)), never gray.

### Named Rules
**The One-Hue-Ink Rule.** All dark UI — text, nav, borders, shadows — derives from Espresso Ink (#2C1810). Pure black and cool gray are prohibited anywhere in the interface.

**The Semantic Color Rule.** Amber is the only color allowed to be "just accent". Slate, leaf, clay, and blue may appear only when they encode freshness, quality, or a calendar bean identity (JS `BAR_COLORS`). A colored element must be answerable to "what state does this express?"

## 3. Typography

**Display Font:** Playfair Display (with Georgia, serif)
**Body Font:** DM Sans (with Helvetica Neue, sans-serif)

**Character:** A classic serif-over-sans pairing: Playfair gives headings the warmth of a hand-lettered menu board; DM Sans keeps numbers and metadata legible at arm's length on a phone. The contrast axis (high-contrast serif vs. low-contrast geometric sans) is what makes the pairing read as deliberate.

### Hierarchy
- **Display / `.heading-xl`** (700, 28px, 1.2): Tab page titles. One per screen.
- **Headline / `.heading-lg`** (600, 22px, 1.3): Section and modal titles.
- **Title / `.heading-md`** (600, 18px, 1.3): Card titles — bean names use this voice.
- **Body** (400–500, 15–16px, ~1.5): DM Sans. Form inputs are 16px minimum (prevents iOS zoom-on-focus).
- **Label** (500, 11–13px, +0.2–0.3px tracking): Badges, tab labels, timestamps, legend text — always DM Sans, never the serif.

### Named Rules
**The Serif-Is-For-Names Rule.** Playfair Display appears only on headings and bean names. Data, numbers, buttons, and labels are always DM Sans. A serif number in this app is a bug.

## 4. Elevation

Depth is ambient and paper-like: white cards rest on the cream background the way loose pages rest on a counter. Every shadow is tinted with Espresso Ink (rgba(44,24,16,…)) at low opacity — never gray-black — so elevation feels warm and barely-there. Hover lifts a card 1px with a slightly deeper shadow; press settles it back down. Modals get the one deep shadow in the system.

### Shadow Vocabulary
- **Rest** (`--shadow-sm`: 0 1px 3px rgba(44,24,16,0.06), 0 1px 2px rgba(44,24,16,0.04)): Cards at rest.
- **Hover** (`--shadow`: 0 2px 8px rgba(44,24,16,0.08), 0 1px 3px rgba(44,24,16,0.06)): Interactive lift, button hover.
- **Raised** (`--shadow-lg`: 0 4px 16px rgba(44,24,16,0.10), 0 2px 6px rgba(44,24,16,0.06)): Card hover, dropdowns.
- **Overlay** (`--shadow-xl`: 0 8px 30px rgba(44,24,16,0.14), 0 4px 10px rgba(44,24,16,0.08)): Modals and sheets only.

### Named Rules
**The Warm Shadow Rule.** Shadow color is always rgba(44,24,16, α). A neutral black shadow (rgba(0,0,0,…)) is prohibited — it instantly cools the page and breaks the paper illusion.

## 5. Components

Tactile and unhurried: everything is sized for one thumb at a hot machine — 44px minimum targets, gentle 10px radii, soft transitions around 0.2s ease.

### Buttons
- **Shape:** Gently rounded (10px radius), 44px minimum height, 12px × 24px padding.
- **Primary:** Espresso Ink background, Steamed Cream text. Hover warms to #3D2820, lifts 1px with the Hover shadow; active settles flat.
- **Amber:** Caramel Amber background, Espresso Ink text, weight 600 — the "warm CTA" for add-bean and log-shot moments.
- **Ghost:** Transparent, Roast Brown text; hover gets a 4% espresso wash. **Secondary-solid:** 8% espresso wash. **Danger:** Past-Peak Clay, transparent until hover.

### Chips / Badges
- **Style:** Pill-shaped (20px radius), 4px × 10px padding, 12px 500-weight DM Sans.
- **State:** Each quality/freshness badge pairs its state hue as text with the same hue at 12–18% opacity as background — colored, but quiet. Color is never the only signal; the label text always names the state.

### Cards / Containers
- **Corner Style:** 10px radius.
- **Background:** Card White on Steamed Cream.
- **Shadow Strategy:** Rest shadow + 1px espresso border at 7% opacity; hover raises to the Raised shadow with a 1px lift (pointer devices only).
- **Internal Padding:** 16px. Cards are list rows, not dashboards — one bean or one shot per card, quality badge pinned to the top-right corner.

### Inputs / Fields
- **Style:** Card White background, 1.5px espresso border at 12% opacity, 10px radius, 16px text (iOS zoom guard), 44px minimum height.
- **Focus:** Border turns Caramel Amber with a soft 3px amber glow ring (rgba(212,165,116,0.15)) — the system's only glow.
- **Stepper (signature input):** A three-part control — [−][value][+] — sharing one bordered container; 44px square tap zones, centered value. Empty steppers show the smart default as a placeholder; the first tap adopts it.

### Navigation
- **Style:** Fixed bottom tab bar in Espresso Ink (the one large dark surface), four items, safe-area aware, 64px tall.
- **States:** Inactive labels are cream at 50% opacity; the active tab is Caramel Amber. 22px SVG icons — always SVG, never emoji.
- **Mobile:** Edge-initiated horizontal swipe switches tabs with axis-lock and boundary resistance; swipe is disabled while any overlay is open.

## 6. Do's and Don'ts

### Do:
- **Do** derive every dark pixel from Espresso Ink (#2C1810) — text, borders, shadows, nav.
- **Do** keep touch targets at 44px minimum and form text at 16px; the user is standing at a machine.
- **Do** pair every state color with a text label (freshness and quality are never color-only).
- **Do** use SVG icons drawn in the ink color; keep them at 20–22px.
- **Do** keep stats copy observational — facts, no cheering (per PRODUCT.md's voice).
- **Do** respect `prefers-reduced-motion`: hover lifts and pane transitions collapse to instant state changes.

### Don't:
- **Don't** ship fitness-app gamification: no streak flames, badges, confetti, progress rings, or records-to-beat.
- **Don't** drift toward the generic SaaS dashboard: no cool grays, KPI hero cards, or sparklines-everywhere. Stat tiles exist (Home), but they speak in the app's warm palette and observational voice.
- **Don't** go café-POS dense — one column, one card per record, generous padding.
- **Don't** go Instagram-café twee: no script fonts, no decorative illustrations, no latte-art motifs.
- **Don't** use emoji anywhere in the UI — icons are SVG, always.
- **Don't** use pure black, cool-gray borders, or neutral black shadows; warmth is structural, not optional.
- **Don't** remove substance while polishing: the shot-card bars, blue "Great", Home stat tiles, and portafilter-first ordering are intentional decisions — restyle them if needed, never delete them.
