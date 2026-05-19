# Coffee Bean Tracker — Product Requirements Document

*Status: v0 draft, 2026-05-18. Iterate freely.*

## Vision

A beautiful, free coffee journal that helps home baristas remember what works, find beans they'll love, and improve their shots — built native to the communities where these conversations already happen.

Today's competitors are split: Beanconqueror is powerful but intimidating; Respresso is a bean database without a journal; spreadsheets and Notes solve memory poorly and ignore everything else. We sit in the middle with taste.

## The Problem

Home baristas have three persistent pains:

1. **Memory.** "What worked last time with this bean?" The information is scattered or lost.
2. **Discovery.** Thousands of roasters, thousands of beans. "What should I try next?" has no good answer.
3. **Improvement.** "Am I getting better?" Without structured tracking, it's pure vibes.

Today's solutions each under-serve at least one:

- **Notes / spreadsheets** — solve memory poorly, ignore discovery and improvement
- **Beanconqueror** — solves memory but is overwhelming; doesn't help discovery; pedagogy is buried
- **Respresso** — partial discovery, no journal
- **Trade Coffee / Atlas Coffee Club** — discovery via paid subscription, but lock you into one channel and don't track what you actually drank

## Target Users

**Primary: The Dialed-In Enthusiast** (~70% of MVP focus)

- Owns a machine + grinder, $1k+ in gear
- Drinks specialty coffee from 3-10 different roasters per year
- Currently tracks shots in Notes, a spreadsheet, or memory
- Active or lurker in /r/espresso, follows roasters on Instagram
- Pain: information rot, can't reproduce yesterday's great shot

**Secondary: The New Espresso Owner** (~30% of MVP focus)

- First 6 months with their machine
- Has heard of Beanconqueror, found it overwhelming
- Doesn't yet know what "dialing in" means precisely
- Pain: paralysis from too many options, no framework

The secondary user *graduates into* the primary user. Designing for the enthusiast lets us catch the new owner with opinionated onboarding (sensible defaults, a guided first-shot flow, "why was this shot bad?" assessment).

**Not the target (MVP):** competitive baristas, cafe owners (B2B is a separate product later), drip-only home brewers, decaf-only drinkers.

## What We Build (MVP)

Two surfaces that reinforce each other: **the journal** (your data) and **the database** (everyone's data).

### Journal — already mostly here

- Log shots: grind, dose, yield, time, rating, notes
- Track beans: roaster, name, roast date, freshness window
- "Best dial-in" per bean
- Daily picker on Today tab
- Calendar view

### Database — new

- Canonical bean catalog: roaster + bean + origin + process + tasting notes
- Seeded with ~200 beans from top roasters (Sey, Onyx, Black & White, George Howell, Tim Wendelboe, etc.)
- Users add missing beans; community curates
- Public bean pages, indexable, shareable
- Aggregate community rating + median dial-in per bean

### Discovery

- "Find similar" — content-based: origin, process, tasting notes
- "Top of this month" — editorial + algorithmic mix
- "Roasters to know" — curated lists

### Community Artifacts

- Shareable dial-in cards: a beautiful image you can post to Reddit / Instagram with your shot parameters, bean, and username
- Public profiles, opt-in, so users can show off their shelf
- Bean pages have direct deep-links that render nicely as OG previews

### Affiliate

- Each bean page has a "Buy this bean" CTA routing through Trade Coffee, Drink Trade, the roaster's Shopify, or Amazon when applicable
- No paywalled features

## What We're Not Building (MVP)

- Brew methods beyond espresso (V60, French press) — explicit scope cut
- Roaster onboarding / B2B portal
- Mobile native apps — PWA only
- ML-based recommendations — content-based + editorial only
- Cloud sync without an account — accounts now required for sync
- Premium tier

## Differentiation

| | Beanconqueror | Respresso | Spreadsheets | Us |
|---|:-:|:-:|:-:|:-:|
| Beautiful | – | partial | – | yes |
| Logs shots well | yes | partial | yes | yes |
| Bean database | – | yes | – | yes |
| Recommendations | – | – | – | yes |
| Free | yes | yes | yes | yes |
| Easy onboarding | – | partial | n/a | yes |

The defensible position is **taste + data + community**. Beanconqueror won't copy taste (wrong DNA). Spreadsheets won't gain a database. Trade Coffee won't add a journal.

## Growth Strategy

Primary channel: **community-led, with social as amplifier.**

### Community

- Native to /r/espresso. Don't post launches; participate. Become known as a helpful regular over months, not weeks.
- Discord presence in 2-3 active coffee servers
- Direct outreach to roasters whose beans you seed ("we added your beans, here's how the page looks")
- Beautiful artifacts that beg to be shared (the dial-in cards are the primary viral hook)

### Social

- Instagram: curated bean photography, weekly "what we'd drink"
- Twitter / Bluesky: dial-in tips, opinions, replies in the coffee corner
- TikTok (maybe): short shot-pulling videos, "why your shot is fast"

### Editorial

- One curated post per week ("This week's beans"), published as a public page and amplified across all channels
- Becomes the brand voice over time

### SEO (tailwind, not primary)

- Bean pages indexed for "{roaster} {bean} dial in" type queries
- Compounds slowly; sets up year-2 growth

### What we don't do

- Paid ads (wrong audience match, wrong margins)
- Influencer pays
- Press releases

## Partnerships

Phased honestly:

1. **Now → 5k users.** Use public affiliate programs only. No partner conversations.
2. **5k → 25k users.** Pitch warm partnerships. By then you have intent data (revealed taste preference) partners can't get themselves. Trade, Atlas, Bean Box, and individual specialty roasters become real conversations.
3. **25k+ users.** Custom integrations: featured placements, co-branded curation, possibly white-label bean pages for roasters.

Do not chase partnerships before you have distribution. Partners move on value exchanges, and you bring nothing yet.

## Monetization

100% free. Revenue path:

- **Now:** Affiliate links on bean pages. Realistic income at 1k engaged users: ~$50-200/mo. At 10k: ~$500-2k/mo.
- **Year 2 (if it grows):** Transparent featured roaster placements. Possibly a curated subscription with revenue share.
- **Never:** Ads. Selling user data. Paywalling the journal.

If the math doesn't sustain at 10k users, revisit then. For the first year, treat this as a labor of love that pays for hosting.

## Success Metrics

For the first 6 months, optimize for **engaged users who would tell a friend**, not raw signups.

- **North Star:** Weekly Active Users who logged ≥3 shots that week
- **Acquisition:** Signups per week from organic channels (Reddit referral, direct, search)
- **Activation:** % of signups who log their first shot within 24h (target: 50%)
- **Retention:** Week-4 retention of activated users (target: 30%)
- **Sharing:** Dial-in cards shared per week (target: ramp 0 → 100/wk in 6 months)
- **Catalog growth:** Beans added by users per week (target: ramp 0 → 50/wk)

**6-month target:** 1,000 WAU at the ≥3 shots/week threshold.
**12-month target:** 5,000 WAU at the same threshold.

These are starting targets; revise after 60 days of real data.

## Roadmap (Indicative)

- **Month 1-2:** Backend foundation — Supabase, auth, port journal to authenticated state, localStorage import
- **Month 3:** Bean database v0 — seed 200 beans, public bean pages, search
- **Month 4:** Community artifacts — dial-in cards, public profiles, aggregate ratings
- **Month 5:** Discovery — find similar, top of the month, first editorial drops
- **Month 6:** Affiliate live, growth cadence begins

Slip buffer: assume +30-50%. Solo dev, side-project pace.

## Risks

- **Affiliate revenue is thin at small scale.** Mitigation: keep ops costs near zero (Supabase free tier covers a lot); accept this is a side project until it's not.
- **Reddit is a fickle channel.** Mitigation: build presence over months; don't optimize for any single post.
- **Bean database cold start.** Mitigation: seed it ourselves; never gate first-time experience on community contribution.
- **Beanconqueror notices and competes.** Mitigation: they won't copy taste; compete on what they can't replicate.
- **Recommendations feel hollow.** Mitigation: editorial first, content-based second; never ship a "recommendation" that's just popularity-sorted.

## Open Questions

- Public profiles default-off or default-on? (Recommend default-off, explicit opt-in.)
- Localization — English-only for v1, but consider EU coffee community early.
- Keep "Coffee Bean Tracker" or rebrand before public launch? Worth deciding pre-month-3.
- How aggressive on moderating user-submitted bean entries? (See SPEC.)
