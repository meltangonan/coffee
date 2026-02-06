---
date: 2026-02-06
topic: cross-device-sync-code
---

# Approach B: Cross-Device Sync via Sync Code

## What We're Building

Replace localStorage-only persistence with cloud sync using a shareable "sync code" — a random passphrase or UUID that acts as a namespace for the user's data. No email, no password, no account creation. Enter the same code on any device to access the same beans and shots.

## Why This Approach

- Lowest friction for a personal tool — no sign-up flow, no email required
- Matches the app's "zero-ceremony" philosophy
- Still achieves the core goal: same data on phone and laptop
- Managed backend (Firebase/Supabase) means near-zero ops burden

## How It Works

1. **First launch**: App generates a random sync code (e.g., UUID like `a3f8c1d2-...` or a memorable 4-word passphrase like `maple-tiger-cloud-seven`)
2. **User saves their code**: Displayed prominently with a "Copy" button. Stored locally so they don't need to re-enter on the same device.
3. **On another device**: User taps "I have a sync code" and pastes it in. App connects to the same cloud namespace.
4. **Ongoing**: All writes go to both localStorage (offline cache) and the cloud. On load, cloud data is fetched and merged with local data.

## Backend Options

### Option 1: Firebase Realtime Database (Recommended)

```
/sync/{syncCode}/beans/{beanId} → bean object
/sync/{syncCode}/shots/{shotId} → shot object
```

- **Free tier**: 1GB stored, 10GB/month transfer — more than enough
- **Client SDK**: `firebase/database` — can use CDN script tag, no build step needed
- **Security rules**: Allow read/write only when path matches the provided sync code
- **Realtime**: Built-in listeners for live updates across tabs/devices

### Option 2: Supabase

- PostgreSQL-based, REST API
- Free tier: 500MB database, 1GB storage
- Requires slightly more setup (table schema, row-level security)
- Better if you later want SQL queries or relational integrity

### Option 3: Simple JSON Blob API

- Services like JSONBin, Cloudflare KV, or a tiny Cloudflare Worker
- Simplest possible: PUT/GET a JSON blob keyed by sync code
- No realtime, no conflict resolution — last write wins
- Most fragile but most minimal

**Recommendation**: Firebase Realtime Database. CDN-loadable (no build step), generous free tier, realtime listeners, and security rules that match the sync code pattern naturally.

## Sync Strategy

### Write Path
```
User action → Update Alpine state → Save to localStorage (immediate) → Push to Firebase (async)
```

### Read Path (on load)
```
App init → Load from localStorage (instant) → Fetch from Firebase → Merge → Re-render
```

### Conflict Resolution

Since this is single-user across devices (not collaborative), conflicts are rare but possible (e.g., edit the same bean on two devices while offline).

**Strategy: Last-write-wins by `updatedAt` timestamp**

- Add an `updatedAt` field to both beans and shots
- On merge, for each record: keep the version with the later `updatedAt`
- Deletions tracked via a `deletedAt` field (soft delete) so they propagate across devices

### Schema Changes

```javascript
// Both beans and shots get:
updatedAt: string    // ISO timestamp, updated on every save
deletedAt: string|null  // ISO timestamp if deleted, null if active
```

## Sync Code Design

### Format Options

| Format | Example | Entropy | UX |
|--------|---------|---------|-----|
| UUID | `a3f8c1d2-7e4b-...` | Very high | Hard to type manually |
| 4-word passphrase | `maple-tiger-cloud-seven` | ~52 bits (2048-word list) | Easy to read/type |
| 6-char alphanumeric | `X7kM2p` | ~36 bits | Short but guessable |

**Recommendation**: 4-word passphrase from a curated word list. Easy to read aloud, type on mobile, and remember short-term. Display the raw UUID underneath as a fallback for copy/paste.

### Security Considerations

- Anyone with the code can read/write the data — acceptable for a personal tool
- Firebase security rules restrict access to only the matching sync code path
- No PII stored (no email, no name) — the data is beans and shots
- If paranoid: add optional client-side encryption (AES with a user-chosen PIN), but this is probably YAGNI

## UI Changes

### New: Settings / Sync Section

Accessible from a gear icon or "Sync" link in the app header.

**States:**

1. **No sync configured**:
   - "Sync across devices" button
   - Tapping generates a new code and shows it

2. **Sync active**:
   - Shows the current sync code (masked by default, tap to reveal)
   - "Copy code" button
   - Last synced timestamp
   - "Disconnect" option (reverts to local-only)

3. **Join existing sync**:
   - "I have a sync code" → text input → Connect

### Sync Status Indicator

Small icon in the header:
- Cloud with checkmark: synced
- Cloud with spinner: syncing
- Cloud with X: offline/error (still works locally)

## Migration Path

### From localStorage-only to sync-enabled

1. User enables sync → generates code
2. All existing localStorage data is pushed to Firebase as the initial state
3. Future operations write to both
4. If user later disables sync, localStorage continues to work independently

### Data Migration

- Add `updatedAt` to all existing records (set to `createdAt` as default)
- Add `deletedAt: null` to all existing records
- No breaking changes to existing schema — additive only

## Implementation Scope

### Phase 1: Core Sync (MVP)
- Firebase Realtime Database setup
- Sync code generation and entry UI
- Push/pull on save and load
- Last-write-wins merge
- Sync status indicator

### Phase 2: Polish
- Realtime listeners (live updates when editing on two devices simultaneously)
- Offline queue (save writes when offline, push when reconnected)
- Sync conflict UI (show "updated on another device" toast)

### Phase 3: Nice-to-Have
- Optional PIN encryption
- QR code for sync code (scan instead of type)
- Export/import as backup alongside sync

## Dependencies Added

```html
<!-- Firebase SDK via CDN — no build step -->
<script src="https://www.gstatic.com/firebasejs/10.x/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.x/firebase-database-compat.js"></script>
```

Adds ~30-40KB gzipped. No other dependencies.

## Cost

Firebase free tier (Spark plan):
- 1GB Realtime Database storage
- 10GB/month download
- 100 simultaneous connections

For a single-user coffee tracker, you'd use <0.1% of these limits.

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| User loses sync code | Display prominently, offer "copy to clipboard." Data still in localStorage on original device. |
| Sync code guessed/shared | Low-value data (coffee notes). Could add optional PIN. |
| Firebase free tier changes | Data exportable. Could migrate to another backend. |
| Merge conflicts | Last-write-wins is simple and sufficient for single-user. |
| Offline edits lost | localStorage always has the latest local state as fallback. |

## Open Questions

- Should the sync code be generated automatically on first launch, or only when the user opts in?
- Word list for passphrases: use an existing standard (BIP39, EFF dice list) or curate a shorter coffee-themed one?
- Should "Disconnect" delete cloud data or just unlink the local device?

## Next Steps

When ready to implement, run this through planning to get file-level implementation steps. The core work is:
1. Firebase project setup + security rules
2. Sync module (JS functions for push/pull/merge)
3. Settings UI for sync code management
4. Wiring save/load to use sync module
