---
name: Coffee Journal
description: A lightweight local-first journal for home espresso — warm, calm, precise.
colors:
  espresso: "#2B1C17"
  espresso-light: "#3A2923"
  cream: "#F4F0E9"
  cream-dark: "#EAE3D9"
  surface-white: "#FFFDF9"
  amber: "#B77A4A"
  amber-light: "#D8B28D"
  amber-dark: "#9A6840"
  text-secondary: "#675850"
  text-muted: "#6F6058"
  rule: "#DDD4C8"
  freshness-resting: "#516779"
  freshness-optimal: "#4E6F37"
  freshness-past: "#824E43"
  great-blue: "#4F6FA5"
typography:
  chart-micro:
    fontFamily: "DM Sans, Helvetica Neue, sans-serif"
    fontSize: "9px"
    fontWeight: 700
    lineHeight: 1.2
  chart-axis:
    fontFamily: "DM Sans, Helvetica Neue, sans-serif"
    fontSize: "10px"
    fontWeight: 600
    lineHeight: 1.2
  micro-label:
    fontFamily: "DM Sans, Helvetica Neue, sans-serif"
    fontSize: "11px"
    fontWeight: 600
    lineHeight: 1.3
  caption:
    fontFamily: "DM Sans, Helvetica Neue, sans-serif"
    fontSize: "12px"
    fontWeight: 500
    lineHeight: 1.4
  display:
    fontFamily: "Newsreader, Georgia, serif"
    fontSize: "28px"
    fontWeight: 600
    lineHeight: 1.15
  headline:
    fontFamily: "Newsreader, Georgia, serif"
    fontSize: "22px"
    fontWeight: 600
    lineHeight: 1.2
  title:
    fontFamily: "Newsreader, Georgia, serif"
    fontSize: "18px"
    fontWeight: 600
    lineHeight: 1.25
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
  metadata:
    fontFamily: "DM Sans, Helvetica Neue, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.5
  input:
    fontFamily: "DM Sans, Helvetica Neue, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.5
  datepicker-title:
    fontFamily: "Newsreader, Georgia, serif"
    fontSize: "17px"
    fontWeight: 600
    lineHeight: 1.3
  compact-title:
    fontFamily: "Newsreader, Georgia, serif"
    fontSize: "20px"
    fontWeight: 600
    lineHeight: 1.3
  panel-title:
    fontFamily: "Newsreader, Georgia, serif"
    fontSize: "21px"
    fontWeight: 600
    lineHeight: 1.3
  metric:
    fontFamily: "DM Sans, Helvetica Neue, sans-serif"
    fontSize: "24px"
    fontWeight: 700
    lineHeight: 1.2
  empty-title:
    fontFamily: "Newsreader, Georgia, serif"
    fontSize: "26px"
    fontWeight: 600
    lineHeight: 1.2
  home-display:
    fontFamily: "Newsreader, Georgia, serif"
    fontSize: "32px"
    fontWeight: 700
    lineHeight: 1.1
  desktop-display:
    fontFamily: "Newsreader, Georgia, serif"
    fontSize: "34px"
    fontWeight: 700
    lineHeight: 1.2
  desktop-home-display:
    fontFamily: "Newsreader, Georgia, serif"
    fontSize: "38px"
    fontWeight: 700
    lineHeight: 1.1
rounded:
  chart: "3px"
  micro: "4px"
  sm: "6px"
  control: "8px"
  counter: "9px"
  md: "10px"
  panel: "12px"
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
    backgroundColor: "transparent"
    textColor: "{colors.espresso}"
    rounded: "0"
    padding: "14px 0"
  badge:
    rounded: "{rounded.pill}"
    padding: "4px 10px"
---

# Design System: Coffee Journal

## 1. Overview

**Creative North Star: "The Quiet Logbook"**

Coffee Journal feels like a precise countertop logbook: warm enough to belong beside the espresso machine, disciplined enough to disappear while the user records a shot. The interface does not imitate paper. Its character comes from warm mineral surfaces, espresso ink, a quiet serif for names, aligned measurements, and fine rules that make records easy to scan. Newsreader carries page titles and bean names; DM Sans carries controls, data, and every number.

The system explicitly rejects the four anti-references from PRODUCT.md: fitness-app gamification, café-POS density, the generic cool-gray SaaS dashboard, and Instagram-café twee. Color is never decorative cheer; every non-neutral hue in the system means something (freshness state, shot quality, a bean's calendar ribbon).

**Key Characteristics:**
- Warm, calm, precise — café warmth carried by type and color, never costume
- Mobile-first single column (max 600px), thumb-reachable, 44px minimum targets
- Semantic color: hue = state, never mood
- Open-ledger structure: whitespace and hairlines group records before containers do
- Bound sections only where containment helps interaction, comparison, or focus
- No paper grain, café illustration, ornamental texture, or decorative elevation

## 2. Colors

Coffee-derived neutrals remain recognizable, but the palette is less yellow and more mineral. Non-neutral hues always carry meaning.

### Primary
- **Espresso Ink** (#2B1C17): The brand's dark brown — primary text, the tab bar, primary buttons, and heading color. It is the logbook's ink; nearly every dark pixel in the app derives from this hue. Hover state lightens to **Warmed Espresso** (#3A2923).

### Secondary
- **Deep Caramel** (#9A6840): The single brand accent. It marks primary actions, active navigation, links, and focus. It is deliberately rarer and deeper than the previous amber. **Caramel** (#B77A4A) fills primary warm actions; **Light Caramel** (#D8B28D) supports restrained hover and dark-surface states.

### Tertiary (semantic state hues — never decorative)
- **Resting Slate** (#516779): Freshness "Resting" (days 0–6). Cool and patient.
- **Peak Leaf** (#4E6F37): Freshness "At Peak" (days 7–21) and "Perfect" shot quality.
- **Past-Peak Clay** (#824E43): Freshness "Past Peak" (day 22+), "Bad" shot quality, and destructive actions.
- **Great Blue** (#4F6FA5): "Great" shot quality. Deliberately distinct from Peak Leaf so Great and Perfect never blur together. Each state hue has a matched 12–18% opacity tint for badge backgrounds.

### Neutral
- **Warm Mineral** (#F4F0E9): The untextured page background. Warm, but not yellow, parchment-like, or faux-paper.
- **Inset Mineral** (#EAE3D9): Recessed and grouped surfaces.
- **Soft White** (#FFFDF9): Inputs, dropdowns, overlays, and the few bound sections that need separation.
- **Roast Brown** (#675850): Secondary text. **Muted Roast** (#6F6058): timestamps, placeholders, and compact secondary information. Muted text remains WCAG-AA readable; hierarchy comes from size and weight rather than low contrast.
- **Rule** (#DDD4C8): The default hairline between ledger rows and sections. Borders no longer depend on many slightly different alpha values.

### Named Rules
**The One-Hue-Ink Rule.** All dark UI — text, nav, borders, shadows — derives from Espresso Ink (#2C1810). Pure black and cool gray are prohibited anywhere in the interface.

**The Semantic Color Rule.** Amber is the only color allowed to be "just accent". Slate, leaf, clay, and blue may appear only when they encode freshness, quality, or a calendar bean identity (JS `BAR_COLORS`). A colored element must be answerable to "what state does this express?"

## 3. Typography

**Display Font:** Newsreader (with Georgia, serif)
**Body Font:** DM Sans (with Helvetica Neue, sans-serif)

**Character:** Newsreader is literary without feeling like a menu or fashion masthead. It gives titles and bean names a quiet logbook voice. DM Sans keeps measurements and controls legible at arm's length. Their contrast is deliberate, but the serif stays rare enough to remain meaningful.

### Hierarchy
- **Display / `.heading-xl`** (600, 28px, 1.15): Tab page titles. One per screen.
- **Headline / `.heading-lg`** (600, 22px, 1.2): Modal titles and bean-detail names.
- **Title / `.heading-md`** (600, 18px, 1.25): Major section titles and bean names.
- **Body** (400–500, 15–16px, ~1.5): DM Sans. Form inputs are 16px minimum (prevents iOS zoom-on-focus).
- **Label** (500, 11–13px, +0.2–0.3px tracking): Badges, tab labels, timestamps, legend text — always DM Sans, never the serif.
- **Compact data steps** (9, 10, 11, 12, 13, 14, 15, 16px): Used deliberately for chart axes, metadata, controls, and body copy. Reserve 9–10px for supplementary chart labels; touch controls and form inputs remain 14–16px.

### Named Rules
**The Serif-Is-For-Names Rule.** Newsreader appears only on page titles, modal titles, empty-state titles, and bean names. Section labels, data, numbers, buttons, and controls are always DM Sans. A serif metric is a bug.

**The Measurement-Grid Rule.** A recipe is not a decorative sentence. When space allows, show Grind, Dose, Yield, and Time as aligned labeled fields. Compact fallbacks use commas or natural-language arrows, never dot-separated fragments.

## 4. Elevation

The default interface is flat. Whitespace, rules, and surface contrast establish hierarchy before shadows do. Ordinary records, bean rows, shot rows, calendars, and stats sections do not float. Elevation is functional: dropdowns, date pickers, sheets, modals, toasts, and the sticky shot-form action may rise above content.

### Shadow Vocabulary
- **None** (`--shadow-sm`: none): Records, cards, grouped report sections, and passive surfaces.
- **Raised** (`--shadow`: 0 2px 8px rgba(43,28,23,0.10)): Dropdowns and sticky actions.
- **Overlay** (`--shadow-xl`: 0 12px 32px rgba(43,28,23,0.18)): Modals, sheets, toasts, and date pickers only.

### Named Rules
**The Earned-Elevation Rule.** A shadow must explain stacking or movement. Passive content never receives elevation merely to look polished. When elevation is necessary, its color derives from Espresso Ink.

## 5. Components

Quiet and direct: everything is sized for one thumb at a hot machine—44px minimum targets, 8–10px control radii, and short state transitions. Familiar controls should look familiar.

### Buttons
- **Shape:** Gently rounded (10px radius), 44px minimum height, 12px × 24px padding.
- **Primary:** Espresso Ink background, Warm Mineral text. Hover warms to #3A2923; active darkens without lifting.
- **Caramel:** Caramel background, Espresso Ink text, weight 600—the warm CTA for add-bean and log-shot moments. Use at most one prominent caramel action per view.
- **Ghost:** Transparent, Roast Brown text; hover gets a 4% espresso wash. **Secondary-solid:** 8% espresso wash. **Danger:** Past-Peak Clay, transparent until hover.

### Chips / Badges
- **Style:** Pill-shaped (20px radius), 4px × 10px padding, 12px 500-weight DM Sans.
- **State:** Each quality/freshness badge pairs its state hue as text with the same hue at 12–18% opacity as background — colored, but quiet. Color is never the only signal; the label text always names the state.

### Ledger Rows / Bound Sections
- **Ledger row:** Transparent background, 14–16px vertical padding, Rule hairline beneath. Used for beans, recent shots, shot history, facts, and ranked lists.
- **Bound section:** Soft White background, 1px Rule border, 8–10px radius, no shadow. Used only when several controls or comparisons need a shared boundary: active-bean recall, forms, and report groups.
- **Overlay surface:** Soft White with Overlay shadow. Used for dropdowns, date pickers, sheets, dialogs, and toasts.
- **No nested cards:** Inside a bound section, use spacing, columns, and rules—not smaller filled cards.

### Inputs / Fields
- **Style:** Soft White background, 1px Rule border, 8px radius, 16px text (iOS zoom guard), 44px minimum height.
- **Focus:** Border turns Deep Caramel with a restrained 2px focus ring—the system's only glow.
- **Stepper (signature input):** A three-part control — [−][value][+] — sharing one bordered container; 44px square tap zones, centered value. Empty steppers show the smart default as a placeholder; the first tap adopts it.

### Navigation
- **Style:** Fixed bottom tab bar in Espresso Ink (the one large dark surface), four items, safe-area aware, 64px tall.
- **States:** Inactive labels are Warm Mineral at 62% opacity; the active tab is Light Caramel. 22px SVG icons—always SVG, never emoji.
- **Mobile:** Edge-initiated horizontal swipe switches tabs with axis-lock and boundary resistance; swipe is disabled while any overlay is open.

## 6. Do's and Don'ts

### Do:
- **Do** derive every dark pixel from Espresso Ink (#2C1810) — text, borders, shadows, nav.
- **Do** keep touch targets at 44px minimum and form text at 16px; the user is standing at a machine.
- **Do** pair every state color with a text label (freshness and quality are never color-only).
- **Do** use SVG icons drawn in the ink color; keep them at 20–22px.
- **Do** keep stats copy observational — facts, no cheering (per PRODUCT.md's voice).
- **Do** group repeated records with rules and alignment before reaching for cards.
- **Do** format recipe values as aligned labeled measurements whenever space allows.
- **Do** respect `prefers-reduced-motion`: pane transitions collapse to instant state changes.

### Don't:
- **Don't** ship fitness-app gamification: no streak flames, badges, confetti, progress rings, or records-to-beat.
- **Don't** drift toward the generic SaaS dashboard: no cool grays, KPI hero cards, or sparklines-everywhere. Home stat tiles remain, but read as one ruled summary rather than two floating cards.
- **Don't** go café-POS dense—one column, aligned records, and enough room to operate one-handed.
- **Don't** go Instagram-café twee: no script fonts, no decorative illustrations, no latte-art motifs.
- **Don't** imitate paper: no grain, torn edges, tape, ruled-paper backgrounds, or faux physical texture.
- **Don't** put every section in a white rounded card or pair passive content with a decorative shadow.
- **Don't** use tiny uppercase tracked headings as the default section cadence.
- **Don't** separate recipe fragments with centered dots.
- **Don't** use emoji anywhere in the UI — icons are SVG, always.
- **Don't** use pure black, cool-gray borders, or neutral black shadows; warmth is structural, not optional.
- **Don't** remove substance while polishing: the shot-card bars, blue "Great", Home stat tiles, Calendar ribbons, and portafilter-first ordering are intentional decisions—restyle them if needed, never delete them.
