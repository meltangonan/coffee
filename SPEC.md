# Coffee Bean Tracker — Technical Spec

*Status: v0 draft, 2026-05-18. Companion to PRD.md.*

## System Overview

Evolve the current single-HTML Alpine.js app into a multi-user web app with a public bean database and shareable bean pages. The core journal stays close to today's experience; Supabase replaces localStorage as the source of truth.

Two surfaces:

1. **App** (`/app`) — authenticated journal: log shots, manage beans, view calendar. Stays Alpine.js-based.
2. **Public** (`/`, `/beans/*`, `/roasters/*`) — unauthenticated bean pages, editorial, landing. Server-rendered for OG previews and SEO.

The single-HTML file at the current URL stays available as a read-only fallback for users who don't sign up.

## Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Frontend (app) | Alpine.js 3.x | Already there; preserves current UX and most of the code |
| Frontend (public) | Astro + Alpine islands | SSR for OG / SEO, Alpine for interactivity, no React tax |
| Backend | Supabase | Postgres + Auth + Storage + RLS in one place; generous free tier |
| Hosting | Vercel or Netlify | Both deploy Astro cleanly |
| Auth | Supabase Auth, magic-link email | Lowest friction; no password management |
| Database | Postgres (managed by Supabase) | Relational fits beans + shots + ratings + users |
| File storage | Supabase Storage | Bean photos, profile images, dial-in card PNGs |
| Image generation | satori + resvg via Supabase Edge Function | Server-side PNG rendering for share cards |
| Analytics | Plausible OR a `events` table in Postgres | Privacy-respecting; no Google |
| Email | Supabase Auth handles magic links; Resend if more is needed | Minimal surface |

## Commands

```
npm install            # install deps (Astro, Supabase client, Alpine, vitest, playwright)
npm run dev            # Astro dev server, app + public on the same port
npm run build          # static build of public pages, app bundle
npm run preview        # preview the production build locally
npm run test           # vitest unit tests
npm run test:e2e       # playwright end-to-end tests
npx supabase start     # local Supabase stack
npx supabase db reset  # rerun migrations against local DB
npx supabase db diff   # generate a new migration from local changes
```

## Architecture

```
+--------------------+         +----------------------+
| Astro public pages |<------->|     Supabase         |
| (SSR + Alpine)     |  HTTP   |  Postgres + RLS      |
+--------------------+         |  Auth                |
                               |  Storage             |
+--------------------+         |  Edge Functions      |
| App (Alpine SPA)   |<------->|                      |
| Authenticated      |  HTTPS  +----------------------+
+--------------------+
                                         |
                                         | server-rendered
                                         v
                               +--------------------+
                               | OG previews +      |
                               | dial-in card PNGs  |
                               +--------------------+
```

Public pages render server-side and hydrate Alpine for interactive bits. The authenticated app is client-rendered, talks directly to Supabase via the JS SDK, and all reads/writes are protected by RLS.

## Project Structure

```
coffee/
├── src/
│   ├── pages/                  # Astro pages (public surface)
│   │   ├── index.astro
│   │   ├── beans/[slug].astro
│   │   ├── roasters/[slug].astro
│   │   └── app/                # authenticated app shell
│   │       └── index.astro     # mounts the Alpine SPA
│   ├── app/                    # Alpine SPA code, ported from index.html
│   │   ├── app.js              # the app() factory
│   │   ├── components/         # stepper, datePicker, etc.
│   │   └── styles/             # CSS variables + shared design tokens
│   ├── lib/
│   │   ├── supabase.ts         # client init
│   │   ├── auth.ts
│   │   └── analytics.ts
│   └── content/                # editorial markdown
├── supabase/
│   ├── migrations/             # raw SQL migrations
│   ├── functions/              # edge functions
│   │   ├── dial-in-card/
│   │   ├── recommendations/
│   │   └── affiliate-click/
│   └── seed.sql                # seed catalog beans for dev
├── tests/
│   ├── unit/                   # vitest
│   └── e2e/                    # playwright
├── index.html                  # legacy single-file app (kept for fallback)
├── PRD.md
├── SPEC.md
├── AGENTS.md                   # canonical agent instructions
└── CLAUDE.md                   # imports AGENTS.md
```

## Data Model

All Postgres, UUID primary keys unless noted.

### `users` (managed by Supabase Auth, extended with profile)

- `id uuid pk`
- `email text`
- `username text unique` — slug for public profile URL
- `display_name text`
- `avatar_url text`
- `is_profile_public bool default false`
- `created_at timestamptz`

### `beans_catalog` — canonical beans, shared across users

- `id uuid pk`
- `slug text unique` (e.g. `sey-coffee-kieni`)
- `roaster_name text`
- `bean_name text`
- `origin text` (country or "Blend")
- `region text` (nullable)
- `process text` (`Washed`, `Natural`, `Honey`, ...)
- `varietal text` (nullable)
- `roast_level text` (`Light`, `Light-Medium`, `Medium`, `Medium-Dark`, `Dark`)
- `tasting_notes text[]`
- `roaster_url text` — deep link to the roaster's product page
- `affiliate_links jsonb` — provider → url map
- `image_url text`
- `is_verified bool default false` — admin-curated vs user-submitted
- `submitted_by uuid references users(id)` (nullable for seeded)
- `created_at timestamptz`
- Unique constraint on `(roaster_name, bean_name)`

### `beans` — a user's personal bean instance (mostly mirrors today's schema)

- `id uuid pk`
- `user_id uuid references users(id)`
- `catalog_id uuid references beans_catalog(id)` (nullable — user can log unlisted beans)
- `name text` (denormalized; may differ from catalog)
- `roaster text` (denormalized)
- `roast_date date`
- `rating int` (1-5)
- `notes text`
- `is_archived bool`
- `optimal_grind_size numeric`
- `optimal_dose_in numeric`
- `optimal_yield_out numeric`
- `optimal_extraction_time int`
- `created_at timestamptz`

### `shots`

- `id uuid pk`
- `user_id uuid references users(id)`
- `bean_id uuid references beans(id)`
- `grind_size numeric`
- `dose_in numeric`
- `yield_out numeric`
- `extraction_time int`
- `rating text` (`bad`|`okay`|`great`|`perfect`)
- `notes text`
- `shot_date date`
- `created_at timestamptz`

### `bean_aggregates` — denormalized for fast public reads

Trigger-maintained on inserts/updates to `beans` and `shots`.

- `catalog_id uuid pk`
- `avg_user_rating numeric`
- `num_ratings int`
- `median_grind numeric`
- `median_dose numeric`
- `median_yield numeric`
- `median_extraction_time int`
- `popular_tasting_notes text[]`
- `updated_at timestamptz`

### `dial_in_cards` — cache for shareable PNG metadata

- `id uuid pk`
- `user_id uuid`
- `bean_id uuid`
- `shot_id uuid` (nullable)
- `image_path text` — Supabase Storage path
- `share_slug text unique`
- `created_at timestamptz`

### `events` — lightweight analytics

- `id bigserial pk`
- `user_id uuid` (nullable)
- `event_name text`
- `properties jsonb`
- `created_at timestamptz`

## Row-Level Security

- `beans`, `shots`, `dial_in_cards`: user reads/writes only their own rows
- `beans_catalog`: anyone reads; authenticated users insert (rate-limited); only admin updates verified rows
- `bean_aggregates`: public read; only triggers / server writes
- `users`: public read of profile fields when `is_profile_public = true`; user reads/writes own row
- `events`: insert-only from authenticated or anonymous; no client reads

RLS is the only authorization mechanism. No service-key reads happen from the client.

## Migration From Current App

Existing users have data in localStorage (`coffee_beans`, `coffee_shots`, `coffee_portafilters`). On first sign-in:

1. JS shim detects existing localStorage data
2. Prompt: *"We found your existing beans, shots, and portafilters. Import?"*
3. On accept:
   - Match each local bean to `beans_catalog` by fuzzy `(roaster, name)` match; suggest but don't force
   - Insert into `beans` with `catalog_id` if matched
   - Insert shots referencing the new bean IDs
   - Clear localStorage on success
4. Keep the legacy `index.html` available at a stable URL as a read-only fallback for users who never sign up

We don't break anyone's flow.

## Auth Model

- Supabase magic-link email only in v1
- No passwords, no OAuth providers (add Apple/Google later if friction is observed)
- Anonymous browsing allowed for public bean pages and editorial
- Account required for: logging, rating, submitting catalog entries, sharing dial-in cards

## API Surface

Most reads/writes use Supabase JS SDK directly against RLS-protected tables. Server endpoints (Supabase Edge Functions) are needed for:

- `POST /api/dial-in-card` — render PNG via satori + resvg, write to Storage, return URL
- `POST /api/beans/submit` — create catalog entry with light moderation queue (spam filtering, rate limit)
- `GET /api/recommendations/:catalog_id` — content-based "find similar" (server-side because it joins many catalog rows; centralizes sort logic)
- `POST /api/affiliate-click` — log event before redirecting to affiliate URL

## Critical User Flows

### Flow 1 — Sign up + first shot

1. User lands on a public bean page (from a Reddit link, say)
2. Clicks "Log this in your journal"
3. Magic-link sign in
4. Returned to a pre-filled bean entry pointing at the catalog item
5. Logs first shot
6. Activation event fires

Target: 50% of signups activate within 24h.

### Flow 2 — Find similar bean

1. From a bean detail in the journal, click "Find similar"
2. Server returns top 5 catalog beans matched on `(origin, process, roast_level, overlapping tasting_notes)`
3. User opens one → public bean page → can add to their journal

### Flow 3 — Share dial-in card

1. From a shot, click "Share dial-in"
2. Edge function renders PNG with shot params, bean, roaster, username
3. User gets a unique URL + downloadable image
4. Posting the URL on Reddit yields a proper OG preview (the Astro public page)

### Flow 4 — Add unlisted bean

1. Search catalog → no result
2. "Add this bean" form (roaster, name, origin, process, tasting notes)
3. Submitted with `is_verified = false`
4. Visible to submitter immediately; appears publicly after light moderation
5. Moderation: rate limits + admin review weekly; obvious spam auto-filtered

## Public Bean Pages

URL: `/beans/{slug}` (e.g. `/beans/sey-coffee-kieni`)

Server-rendered (Astro). Contains:

- Roaster, bean name, origin, process, roast level
- Tasting notes
- Aggregate dial-in (median grind / dose / yield / extraction)
- Community rating
- 3-5 sample shots (anonymized unless owner has `is_profile_public`)
- "Find similar" linklist
- "Buy this bean" affiliate CTA
- "Log this in your journal" CTA

Must work without JS for OG previews. Astro handles this.

## Build Sequence

Aligned with the PRD roadmap.

**Phase 1 — Backend Foundation (weeks 1-6)**

1. Create Supabase project; write schema + RLS as migrations
2. Add Astro shell; mount the existing app at `/app`
3. Wire Supabase Auth (magic link)
4. Port `coffee_beans`, `coffee_shots`, and `coffee_portafilters` flows from localStorage to Supabase tables; keep the UI identical
5. Build localStorage → Supabase import flow

**Phase 2 — Catalog (weeks 7-9)**

1. Seed `beans_catalog` with 200 hand-curated entries
2. Public bean page in Astro
3. Bean search; link user beans to catalog entries
4. User-submitted bean flow + moderation queue

**Phase 3 — Community + Sharing (weeks 10-12)**

1. `bean_aggregates` trigger + view
2. Dial-in card image generation (edge function)
3. Public profiles (opt-in)
4. Share flows from the journal

**Phase 4 — Discovery (weeks 13-15)**

1. Find similar (content-based)
2. Top of the month
3. First editorial post

**Phase 5 — Affiliate + Growth (weeks 16+)**

1. Affiliate link slots on bean pages
2. Click tracking via edge function
3. Reddit / social cadence begins
4. Iterate from real data

## Code Style

- Keep Alpine.js for app interactivity. Don't migrate to React/Vue.
- Astro components for public pages, with Alpine islands for client interactivity (one vocabulary across both surfaces)
- Plain SQL in `supabase/migrations/`. No ORM.
- TypeScript for Astro pages and edge functions; vanilla JS for the Alpine app is fine.
- One CSS system across both surfaces — port current CSS variables to a shared layer.
- No build complexity beyond `astro build` and Supabase migrations.
- Match the current app's aesthetic restraint in every new surface.

## Testing Strategy

- **Unit tests (vitest):** pure helpers — freshness, shot quality, brew ratio, recommendation scoring. Port existing `tests.html` cases.
- **Integration tests:** RLS policies, explicitly. Every table has a "user A cannot read user B's rows" test.
- **End-to-end (Playwright):** signup → log first shot, find similar → add to journal, share dial-in card.
- **Manual checklist:** public bean pages render without JS, OG previews look right on Reddit / Twitter / iMessage.
- Smoke test against staging before each public release.

## Boundaries

**Always:**

- Server-render public pages; client-render the app
- Enforce RLS on every table; no service-key reads from the client
- Validate user-submitted catalog entries before publishing
- Log analytics events without PII
- Match the current app's aesthetic restraint in any new surface

**Ask first:**

- Adding paid features
- Adding any tracking that crosses domains
- Partnership commitments
- Breaking changes to the data model after launch

**Never:**

- Sell user data
- Add ads to the app
- Bypass RLS with the service role for client-driven actions
- Ship "recommendations" that are pure popularity-sort
- Break the legacy single-HTML fallback for existing users without an import path

## Open Questions

- Moderation queue from day one, or trust users + retroactive moderation? (Lean retroactive with rate limits.)
- Public shot data: full history (anonymized) or only aggregates? (Lean aggregates for v1; revisit privacy concerns.)
- Editorial: Astro markdown pages, or a CMS? (Lean markdown; no CMS yet.)
- Image generation library: satori (JSX) vs `@vercel/og` vs canvas. Spike before committing.
- Custom domain + brand name decision before month 3.
