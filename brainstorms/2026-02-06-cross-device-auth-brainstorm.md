---
date: 2026-02-06
topic: cross-device-auth
---

# Approach C: Cross-Device Sync via Traditional Auth

## What We're Building

Add user authentication (email/password or OAuth) so data is tied to a user account. Users sign in on any device to access their beans and shots. Uses a managed auth provider (Firebase Auth or Supabase Auth) to avoid building auth infrastructure from scratch.

## Why This Approach

- Familiar UX — users know how email/password and "Sign in with Google" work
- Account recovery built in (password reset, email verification)
- Stronger security model — data access requires authentication, not just a shared code
- Foundation for any future multi-user features (sharing, public profiles — even if unlikely)
- Industry-standard approach with well-documented implementation paths

## How It Works

1. **First launch**: App shows a sign-in/sign-up screen
2. **Sign up**: User creates account with email/password or taps "Sign in with Google"
3. **Authenticated**: App fetches user's data from the cloud, merges with any local data
4. **On another device**: User signs in with same credentials → same data appears
5. **Ongoing**: All writes go to both localStorage (offline cache) and the cloud, scoped to the user's UID

## Backend Options

### Option 1: Firebase Auth + Realtime Database (Recommended)

**Auth methods available:**
- Email/password (simplest to implement)
- Google OAuth (one-tap sign-in, very low friction on mobile)
- Apple Sign-In (required if distributing via App Store, optional for web)
- Anonymous auth (upgrade to full account later — nice migration path)

**Database structure:**
```
/users/{uid}/beans/{beanId} → bean object
/users/{uid}/shots/{shotId} → shot object
```

**Security rules:**
```json
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid"
      }
    }
  }
}
```

### Option 2: Supabase Auth + PostgreSQL

- Email/password, OAuth providers (Google, GitHub, Apple)
- Row-level security policies tied to `auth.uid()`
- PostgreSQL gives you SQL queries, joins, constraints
- Slightly more setup but more powerful long-term

**Recommendation**: Firebase. CDN-loadable (preserves the no-build-step approach), excellent mobile OAuth UX, and the auth + database integration is seamless.

## Auth Flow Design

### Sign Up (New User)

```
Landing screen → "Create Account" or "Sign in with Google"
  → Email/password: enter email + password → verify email (optional) → done
  → Google: tap → OAuth popup/redirect → done
→ Generate UID → Create /users/{uid}/ namespace
→ If localStorage has existing data → push to cloud as initial state
→ App loads normally
```

### Sign In (Returning User, New Device)

```
Landing screen → "Sign In" or "Sign in with Google"
  → Enter credentials → authenticated
→ Fetch /users/{uid}/ data from cloud
→ If localStorage has data from a previous anonymous session → offer to merge or discard
→ App loads with cloud data
```

### Session Persistence

Firebase Auth persists the session in the browser (IndexedDB). Users stay signed in until they explicitly sign out. No need to re-enter credentials on every visit.

### Sign Out

- Clear in-memory state
- Optionally clear localStorage (or keep as offline cache)
- Return to sign-in screen

## Auth Methods — Detailed Comparison

| Method | Friction | Implementation | Recovery | Notes |
|--------|----------|---------------|----------|-------|
| Email/Password | Medium — must type email + choose password | Simple — Firebase handles everything | Password reset via email | Most universal |
| Google OAuth | Low — one tap on mobile | Medium — need Google Cloud Console setup | Automatic (Google account) | Best mobile UX |
| Anonymous → Upgrade | Zero initially — defer auth | Medium — handle upgrade flow | None until upgraded | Good migration from current local-only |
| Magic Link (email) | Low — no password to remember | Medium — Firebase supports this | Click link in email | Modern, passwordless |

### Recommended Combo

Start with **Google OAuth + Email/Password**. Covers the majority of users with two options:
- Google for low-friction mobile sign-in
- Email/password for users who prefer not to use Google

### Optional: Anonymous Auth Migration Path

This is a nice middle ground that preserves the current "just works" feel:

1. On first launch, silently create an anonymous Firebase account
2. App works exactly as before — no sign-in screen
3. When user wants to sync, prompt them to "link" their anonymous account to email/Google
4. Data is already in Firebase under their anonymous UID, which gets preserved when they link

This means the app still feels local-first and zero-friction on first use.

## Sync Strategy

Same as Approach B, but scoped to authenticated UID instead of sync code:

### Write Path
```
User action → Update Alpine state → Save to localStorage → Push to Firebase /users/{uid}/
```

### Read Path
```
App init → Check auth state → If signed in: fetch from Firebase → Merge with localStorage → Render
                            → If not signed in: use localStorage only (or show sign-in screen)
```

### Conflict Resolution

**Last-write-wins by `updatedAt`** — identical to Approach B.

### Schema Changes

```javascript
// Both beans and shots get:
updatedAt: string       // ISO timestamp, updated on every save
deletedAt: string|null  // ISO timestamp if soft-deleted, null if active
```

## UI Changes

### New: Auth Screen

Shown when not authenticated (unless using anonymous auth path).

**Design**: Full-screen, centered, minimal. Matches the "Warm Industrial Cafe" aesthetic.

```
┌──────────────────────────┐
│                          │
│    ☕ Coffee Bean Tracker │
│                          │
│  [Sign in with Google]   │
│                          │
│  ── or ──                │
│                          │
│  Email: [____________]   │
│  Password: [_________]   │
│                          │
│  [Sign In]  [Create Account] │
│                          │
│  Forgot password?        │
│                          │
└──────────────────────────┘
```

### New: Account Section in Settings

- Signed-in indicator (email or "Google account")
- "Sign Out" button
- "Delete Account" option (with confirmation)
- Last synced timestamp

### Sync Status Indicator

Same as Approach B:
- Cloud with checkmark: synced
- Cloud with spinner: syncing
- Cloud with X: offline/error

### Header Change

Replace or augment the header with a small user avatar/icon (for Google) or email initial, indicating signed-in state.

## Migration Path

### From localStorage-only to auth-enabled

**Option A: Hard cutover**
1. Deploy auth-enabled version
2. New users must sign up
3. Existing users sign up → local data pushed to cloud as initial state
4. Clean but forces action from existing users

**Option B: Gradual with anonymous auth (Recommended)**
1. Deploy with anonymous auth — app works identically to today
2. Add "Sync your data" prompt that links to account creation
3. Users who link get cloud sync; others continue local-only
4. No disruption for existing users

### Data Migration

Same as Approach B — additive fields only:
- Add `updatedAt` (default: `createdAt`)
- Add `deletedAt: null`

## Implementation Scope

### Phase 1: Core Auth (MVP)
- Firebase project setup (Auth + Realtime Database)
- Google OAuth configuration
- Email/password sign-up/sign-in
- Auth state management (signed in / signed out)
- Auth screen UI
- Push/pull data on sign-in
- Security rules

### Phase 2: Sync & Polish
- Last-write-wins merge logic
- Sync status indicator
- Sign-out flow
- Session persistence
- Password reset flow

### Phase 3: Nice-to-Have
- Anonymous auth → upgrade flow
- Apple Sign-In
- Magic link (passwordless email)
- Account deletion (data cleanup)
- "Sync your data" prompt for anonymous users

## Dependencies Added

```html
<!-- Firebase SDK via CDN -->
<script src="https://www.gstatic.com/firebasejs/10.x/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.x/firebase-auth-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.x/firebase-database-compat.js"></script>
```

Adds ~50-60KB gzipped (auth module is larger than database alone).

## External Setup Required

Unlike Approach B (which only needs a Firebase project + database), this also requires:

1. **Firebase Console**: Enable Authentication, configure sign-in providers
2. **Google Cloud Console**: Configure OAuth consent screen (for Google Sign-In)
3. **Authorized domains**: Add your deployment domain to Firebase Auth settings
4. **Apple Developer Account**: Only if adding Apple Sign-In (optional)

Setup time: ~30-60 minutes for Firebase + Google OAuth.

## Cost

Same Firebase free tier (Spark plan):
- 1GB Realtime Database storage
- 10GB/month download
- **Auth: 50,000 monthly active users free** (you'll use 1)
- Phone auth has different limits but not relevant here

Effectively free for personal use.

## Privacy & Compliance Considerations

Since you're collecting email addresses (even if just your own):

- Firebase stores auth data (email, OAuth tokens) in Google's infrastructure
- If you ever share this app, you'd technically need a privacy policy
- GDPR: right to deletion — account deletion should wipe cloud data
- For personal use only: none of this matters practically

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Auth adds friction to a personal tool | Anonymous auth path lets you defer sign-in |
| OAuth popup blocked on mobile | Firebase handles redirect fallback automatically |
| Forgot password with no recovery email | Firebase password reset handles this |
| Google OAuth requires Cloud Console setup | One-time setup, well-documented |
| More complex than sync code approach | Managed by Firebase — you write minimal auth code |
| User locked out of Google account | Email/password as fallback auth method |

## Comparison with Approach B (Sync Code)

| Dimension | Sync Code (B) | Auth (C) |
|-----------|--------------|----------|
| User friction | Very low (no account) | Low-medium (sign-up required) |
| Security | Moderate (code = access) | Strong (auth required) |
| Account recovery | None (lose code = lose access) | Password reset, OAuth |
| Implementation effort | Simpler | More complex |
| Dependencies size | ~35KB | ~55KB |
| External setup | Firebase project only | Firebase + OAuth console |
| Future extensibility | Limited | Strong foundation |

## Open Questions

- Should we require auth on first launch, or use anonymous auth and prompt to upgrade?
- Google OAuth only, or also email/password from the start?
- Should sign-out clear localStorage (clean slate) or keep it (offline fallback)?
- Do we need email verification, or is it overkill for a personal tool?

## Next Steps

When ready to implement, run this through planning to get file-level implementation steps. The core work is:
1. Firebase project setup + Auth configuration + OAuth consent screen
2. Auth screen UI (sign-in/sign-up)
3. Auth state management (listener for sign-in/sign-out)
4. Sync module (push/pull/merge, identical to Approach B)
5. Wiring save/load to use sync module when authenticated
6. Account settings UI
