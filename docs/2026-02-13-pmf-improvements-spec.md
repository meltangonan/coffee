---
date: 2026-02-13
topic: pmf-improvements-spec
type: product-spec
---

# Coffee Bean Tracker - PMF Validation Spec

## 1. Objective

Validate whether Coffee Bean Tracker can move from a personal tracker to a repeat-use product by improving the core user outcome:

**Help users pull a better next shot faster, with less effort.**

## 2. Product Hypotheses

1. If users receive clear next-shot recommendations, they will reach satisfying shots faster.
2. If logging is near one-tap, users will log more consistently.
3. If data feels safe and portable, users will trust the app long-term.
4. If progress is visible, users will return more often and stay engaged per bean lifecycle.

## 3. Target User

Home espresso enthusiasts who:
- Brew at least several times per week.
- Adjust grind/dose/yield manually.
- Want consistency without spreadsheet-level complexity.

## 4. Success Metrics (PMF Signals)

### Primary
- D7 retention of new users
- Average logs per active user per week
- Percent of sessions completing a shot log in under 10 seconds
- Self-reported "shot quality improved" after one week

### Secondary
- Percent of logs using recommendation acceptance or minor adjustment
- Bean-level reuse rate (same bean used across multiple sessions)
- Export usage rate (trust indicator)

## 5. Scope (Phase 1)

### In Scope
- Recommendation card for next shot
- Quick log mode with one-tap defaults
- Backup reliability flow (export/import hardening)
- Simple progress indicators per bean
- Short first-run onboarding focused on first value

### Out of Scope
- Social/community features
- Marketplace/inventory/ordering
- Full multi-device real-time sync with accounts
- Complex predictive AI models

## 6. Functional Requirements

### FR-A: Next-Shot Recommendation

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-A.1 | After bean selection, app displays a recommendation card before logging | Must |
| FR-A.2 | Card includes suggested adjustment for at least grind and one of dose/yield | Must |
| FR-A.3 | Card includes one-line rationale referencing recent shot outcome | Must |
| FR-A.4 | Card includes confidence level (high/medium/low) | Should |
| FR-A.5 | User can accept suggestion in one tap or edit manually | Must |

### FR-B: Quick Log Flow

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-B.1 | User can log with "same as last shot" in one tap | Must |
| FR-B.2 | Most common adjustments are immediately accessible (+/- controls) | Must |
| FR-B.3 | Advanced/optional fields are collapsed by default | Should |
| FR-B.4 | Existing full-form flow remains available | Must |

### FR-C: Data Trust Baseline

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-C.1 | User can export all data in a portable format | Must |
| FR-C.2 | User can import with clear conflict behavior and validation | Must |
| FR-C.3 | App communicates backup status and guidance clearly | Should |

### FR-D: Progress Feedback

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-D.1 | Bean detail includes simple trend indicator for dial-in stability | Should |
| FR-D.2 | Bean detail shows recipe confidence indicator | Should |
| FR-D.3 | App highlights lightweight milestones tied to consistency | Could |

### FR-E: Onboarding

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-E.1 | First-run flow gets user from zero to first logged shot quickly | Must |
| FR-E.2 | Onboarding explains recommendation value in plain language | Must |
| FR-E.3 | User can skip/exit onboarding at any point | Must |

## 7. User Stories and Acceptance Criteria

### Story 1: Guided Next Shot
As a home barista, I want a clear suggestion before pulling my next shot so I can improve without guessing.

Acceptance Criteria:
- Recommendation appears after selecting a bean with prior shot data.
- Recommendation can be applied in one action.
- User can override with manual edits without losing control.

### Story 2: Fast Repeat Logging
As a daily user, I want to log a common shot in seconds so tracking does not interrupt brewing.

Acceptance Criteria:
- "Same as last shot" flow completes a valid log quickly.
- Quick controls support small adjustments without opening a full form.

### Story 3: Confidence in Data
As a long-term user, I want to know my logs are recoverable so I can rely on the app.

Acceptance Criteria:
- Export produces complete data.
- Import handles invalid/partial data with user-friendly messaging.

### Story 4: Visible Improvement
As a learning user, I want to see whether I am becoming more consistent with a bean.

Acceptance Criteria:
- Bean detail presents at least one simple trend signal.
- Signal is understandable without technical coffee jargon.

## 8. Non-Functional Requirements

| ID | Requirement |
|----|-------------|
| NFR-1 | Core logging interactions should feel immediate on mobile devices |
| NFR-2 | New features must not make the common path longer than current flow |
| NFR-3 | Recommendation logic must be explainable (no black-box behavior) |
| NFR-4 | UI language remains concise and beginner-friendly |

## 9. Risks and Mitigations

1. Risk: Recommendations feel wrong and reduce trust.
Mitigation: Conservative rules, transparent rationale, always allow override.

2. Risk: Added features increase complexity.
Mitigation: Keep quick path minimal; hide advanced options by default.

3. Risk: Data trust remains weak without full sync.
Mitigation: Make export/import robust first; measure demand before sync investment.

## 10. Rollout Plan

1. Release recommendation card + quick log as a combined core-loop upgrade.
2. Release data trust improvements (export/import UX and validation).
3. Release progress indicators and onboarding polish.
4. Evaluate retention and behavior metrics before expanding scope.

## 11. Open Questions

1. What is the minimum recommendation logic that feels useful but safe?
2. How should confidence be communicated without overpromising?
3. What metric threshold would justify investing in account-based sync?
4. Which single progress indicator is most understandable for target users?

