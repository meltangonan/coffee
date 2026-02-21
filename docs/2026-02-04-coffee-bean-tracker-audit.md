# Coffee Bean Tracker — PRD & Brainstorm Audit

**Date**: 2026-02-04  
**Scope**: PRD (`2026-01-25-coffee-bean-tracker-prd.md`) and Design Doc (`2026-01-25-coffee-bean-tracker-brainstorm.md`)  
**Goal**: Ensure product and engineering readiness for MVP implementation.

---

## Executive Summary

**Verdict: Ship-ready with minor clarifications.**  
*All recommended edits below have been applied to the PRD and brainstorm (2026-02-04).*

The PRD and brainstorm are well-structured, aligned with each other, and suitable for MVP. The audit identified a handful of ambiguities (boundaries, "today," empty states, calendar past bars) and one inconsistency (rating scale in reference data). Recommended fixes are small, additive clarifications — no scope cuts or structural changes needed.

---

## Product Management Audit

### Strengths

| Area | Assessment |
|------|------------|
| **Problem statement** | Clear, user-centric, and specific (three pains called out). |
| **Persona** | Defined and narrow (solo home barista, 1–2 drinks/day). |
| **Requirements structure** | FRs have IDs, priorities (Must/Should/Could), and are grouped by capability. |
| **Traceability** | User flows → screens → FRs; out-of-scope and future work are explicit. |
| **Success criteria** | Qualitative metrics are appropriate for a personal tool; time targets (< 5s, < 30s) are testable. |
| **Scope control** | Out-of-scope and future considerations are listed; no feature creep in MVP. |

### Gaps / Clarifications Needed

1. **Freshness window boundaries (FR-2.1, FR-2.2)**  
   - PRD says "roast date + 7 days (start) to roast date + 21 days (end)" and "Optimal (7–21 days)."  
   - **Issue**: Exact boundaries (day 7 and day 21 inclusive vs exclusive) are not stated.  
   - **Recommendation**: Define explicitly, e.g. "Optimal = 7 ≤ days since roast ≤ 21 (inclusive)." Prevents implementation drift and edge-case bugs.

2. **Definition of "today" (FR-4.x, Daily Log)**  
   - Daily log is "today's shot" and "today's entries."  
   - **Issue**: Timezone/date source not specified (device local date vs UTC, etc.).  
   - **Recommendation**: State that "today" is the device’s local date (or user’s current date). One sentence in NFRs or assumptions is enough.

3. **Empty states**  
   - **Issue**: No explicit spec for: no beans yet, no shots for a bean, no shots today.  
   - **Recommendation**: Add a short "Empty states" subsection (e.g. first-time: "Add your first bean"; bean with no shots: "Log your first shot"; daily log empty: "No shots logged today"). Ensures consistent UX and avoids ad-hoc copy during build.

4. **Calendar: bars entirely in the past**  
   - FR-5 says "only active (non-archived) beans" and "only beans with a roast date."  
   - **Issue**: Unclear whether we show a bean’s bar when its optimal window is entirely in the past for the visible month.  
   - **Recommendation**: Decide and document: e.g. "Show only beans whose optimal window overlaps the visible month" OR "Show all active beans; bars entirely in the past are muted/grayed." Prevents rework during implementation.

---

## Software Engineering Audit

### Strengths

| Area | Assessment |
|------|------------|
| **Data model** | Brainstorm defines Bean and Shot with fields and types; aligns with PRD (ids, roast date, shot params, best recipe, createdAt). |
| **Persistence** | localStorage, no backend — appropriate for single-user MVP and matches NFR-4. |
| **Tech constraints** | No external APIs, mobile-first, load time target — all implementable with static SPA. |
| **NFRs** | Clear priorities; accessibility (contrast) called out. |

### Clarifications

5. **Offline (NFR-3)**  
   - "Works offline after initial load" implies caching of the app (e.g. service worker).  
   - **Recommendation**: If MVP ships without a service worker, note in PRD: "NFR-3 deferred to post-MVP; app requires network for first load." Avoids over-promising.

6. **Implicit fields**  
   - Shot history "newest first" and "today's entries" require `createdAt` (or equivalent). Brainstorm has it; PRD doesn’t list it in UI specs.  
   - **Verdict**: Acceptable; implementation will use createdAt. Optional: add one line in PRD that shot/bean lists are ordered by creation/time where relevant.

---

## Consistency Check (PRD vs Brainstorm)

| Item | PRD | Brainstorm | Status |
|------|-----|------------|--------|
| Persistence | localStorage | localStorage | OK |
| Freshness window | 7–21 days | 7–21 days | OK |
| Rating | 1–5 stars | 1–5 stars | OK |
| Best Recipe | One per bean | One per bean | OK |
| Daily log reuse | Last settings per bean | Last settings per bean | OK |
| Calendar | Monthly, colored bars, overlap | Same | OK |
| **Reference data ratings** | — | 7/10, 5/10 in table | **Fix**: Use 1–5 scale so seed data matches product (e.g. 4/5, 3/5). |

---

## Edge Cases to Decide (Optional but Useful)

- **Roast date in the future** (e.g. pre-ordered beans): App would show "Resting" with negative days until optimal. Either allow and document, or show a simple "Not yet rested" state.
- **Two beans same name/roaster**: No uniqueness constraint in PRD. Fine for MVP; no change needed unless you want to add "no duplicate name+roaster" later.
- **Bean with no shots**: Best Recipe card doesn’t show; shot history empty. Already implied by PRD; no doc change required.

---

## Recommended PRD Edits (Summary)

1. **FR-2.1 / FR-2.2**: State that optimal window is **inclusive** (e.g. "7 ≤ days since roast ≤ 21").  
2. **Assumptions or NFR**: Add "Daily log uses the device’s local date for 'today'."  
3. **New subsection**: "Empty states" — first-time (no beans), bean with no shots, daily log with no entries.  
4. **FR-5 / Screen 5**: Clarify calendar rule for beans whose window is entirely in the past (show only overlapping, or show all with past bars muted).  
5. **NFR-3**: If offline is post-MVP, add "Deferred to post-MVP" and note first load requires network.

---

## Recommended Brainstorm Edits (Summary)

1. **Real Bean Data**: Change 7/10 → 4/5 and 5/10 → 3/5 (or equivalent) so reference data uses 1–5 scale.  
2. **Open Questions**: Mark resolved items (e.g. "Calendar: exclude beans without roast date" → resolved in PRD FR-5.5 / Screen 5) and leave only open ones or remove section if all resolved.

---

## Final Checklist Before Implementation

- [ ] Apply boundary and "today" clarifications in PRD.  
- [ ] Add empty states to PRD.  
- [ ] Clarify calendar past-window behavior in PRD.  
- [ ] Note NFR-3 deferral if not doing service worker in MVP.  
- [ ] Fix brainstorm reference data to 1–5 scale; tidy open questions.  
- [ ] Optional: Add one line that lists/summaries use creation time ordering where relevant.

After these edits, the PRD and brainstorm are in strong shape for a confident, focused MVP build.
