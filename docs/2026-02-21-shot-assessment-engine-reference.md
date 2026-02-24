---
date: 2026-02-21
topic: shot-assessment-engine-reference
type: reference
---

# Shot Assessment Engine — Complete Reference

All shots have `doseIn`, `yieldOut`, and `extractionTime` (required, > 0).
Assumes 18g dose throughout examples. Target yield is always dose × 2 (1:2 ratio).

## Constants

| Constant | Value | Meaning |
|----------|-------|---------|
| `EXTRACTION_TIME_FAST` | 22s | Below: under-extracted |
| `EXTRACTION_TIME_SLIGHTLY_FAST` | 25s | 22–24s: slightly under |
| `EXTRACTION_TIME_STANDARD_MAX` | 30s | 25–30s: standard range |
| `EXTRACTION_TIME_SLIGHTLY_SLOW` | 35s | 31–35s: slightly over |
| `BREW_RATIO_VERY_LOW` | 1.5 | Below + slow flow: choked |
| `BREW_RATIO_LOW` | 1.8 | Below: "Pull longer" zone |
| `BREW_RATIO_NEAR_TARGET_LOW` | 1.9 | Near-target lower bound (inclusive) |
| `BREW_RATIO_NEAR_TARGET_HIGH` | 2.2 | Near-target upper bound (inclusive) |
| `FLOW_RATE_CHOKE_MAX` | 1.0 g/s | Choking threshold (with ratio < 1.5) |
| `FLOW_RATE_FAST_SLIGHT` | 1.6 g/s | Over-target flow starts getting fast |
| `FLOW_RATE_FAST` | 1.8 g/s | Over-target flow is clearly fast |

## How It Works

1. **Choking check** — ratio < 1.5 AND flow rate < 1.0 g/s (`FLOW_RATE_CHOKE_MAX`) → short-circuit
2. **Choose assessment time**:
   - ratio < 1.9 → use projected time `(dose × 2 ÷ yield) × time`
   - ratio ≥ 1.9 → use actual extraction time
3. **Assess chosen time** against extraction time bands
4. **Append yield advice** when ratio is clearly off-target:
   - ratio < 1.8 → `Pull longer` (if assessment time ≤ 30s)
   - ratio > 2.2 and assessment time ≥ 25s:
     - flow < 1.6 g/s → `Good flow → cut sooner`
     - flow 1.6–1.79 g/s → `Fast flow + over target → go slightly finer` + `Cut sooner`
     - flow ≥ 1.8 g/s → `Fast flow + over target → go finer` + `Cut sooner`

## Flow Rate

Formula: `flowRate = yieldOut / extractionTime` (g/s)

Shot cards display flow rate after time, e.g. `25s (1.5 g/s)`.

### Flow-Rate Ranges (Reference)

| Flow rate | Case | Engine behavior |
|---|---|---|
| `< 1.0 g/s` | Very restricted flow | If ratio `< 1.5`, classify as `Choked/channeled → go coarser` |
| `1.0–1.59 g/s` | Moderate flow | If ratio > 2.2 and assessment time ≥ 25s, stays `Good flow → cut sooner` |
| `1.6–1.79 g/s` | Slightly fast | If ratio > 2.2 and assessment time ≥ 25s, `go slightly finer` + `Cut sooner` |
| `≥ 1.8 g/s` | Fast flow | If ratio > 2.2 and assessment time ≥ 25s, `go finer` + `Cut sooner` |

Outside the choking and over-target cut-sooner branch, flow rate is still informational and assessment remains time/ratio-driven.

## All Outcomes

### Choking (checked first)

| # | Condition | Output | Color |
|---|-----------|--------|-------|
| 0 | Ratio < 1.5 AND flow < 1.0 g/s | Choked/channeled → go coarser | amber |

> **8g out in 30s** (18g dose) — ratio 0.44, flow 0.27 g/s → `Choked/channeled → go coarser`
>
> **20g out in 35s** (18g dose) — ratio 1.11, flow 0.57 g/s → `Choked/channeled → go coarser`

Not choking if flow is high (shot stopped early, not stuck):
> **21g out in 3s** (18g dose) — ratio 1.17, flow 7.0 g/s → falls through to projection (under-extracted)

---

### Assessment time < 22s (under-extracted → go finer)

| # | Yield zone | Output | Color |
|---|------------|--------|-------|
| 1 | Below 1.8 | Under-extracted → go finer / Pull longer | amber |
| 2 | 1.8–2.2 | Under-extracted → go finer | amber |
| 3 | Above 2.2 | Under-extracted → go finer | amber |

> **#1 — 25g out in 10s** → ratio 1.39, projected (36/25)×10 = 14.4s
> `Under-extracted → go finer` + `Pull longer`
> *Grind is way too coarse and they stopped early.*

> **#2 — 36g out in 18s** → ratio 2.0, assessed by actual time = 18s
> `Under-extracted → go finer`
> *Hit target yield but flow was way too fast.*

> **#3 — 46g out in 20s** → ratio 2.56, assessed by actual time = 20s
> `Under-extracted → go finer`
> *Overran target and flow was genuinely fast.*

---

### Assessment time 22–24s (slightly under-extracted → go slightly finer)

| # | Yield zone | Output | Color |
|---|------------|--------|-------|
| 4 | Below 1.8 | Slightly under-extracted → go slightly finer / Pull longer | amber |
| 5 | 1.8–2.2 | Slightly under-extracted → go slightly finer | amber |
| 6 | Above 2.2 | Slightly under-extracted → go slightly finer | amber |

> **#4 — 30g out in 20s** → ratio 1.67, projected (36/30)×20 = 24s
> `Slightly under-extracted → go slightly finer` + `Pull longer`
> *Slightly fast flow and stopped a bit early.*

> **#5 — 36g out in 23s** → ratio 2.0, assessed by actual time = 23s
> `Slightly under-extracted → go slightly finer`
> *Hit target yield, just a touch fast.*

---

### Assessment time 25–30s (standard range)

| # | Yield zone | Output | Color |
|---|------------|--------|-------|
| 7 | Below 1.8 | Good flow → pull longer | amber |
| 8 | 1.8–2.2 | Well-extracted | green |
| 9 | Above 2.2 | Cut sooner (flow-tuned) | amber |

> **#7 — 30g out in 21s** → ratio 1.67, projected (36/30)×21 = 25.2s
> `Good flow → pull longer`
> *Flow rate is good — just need to let it run to target yield.*

> **#8 — 36g out in 27s** → ratio 2.0, assessed by actual time = 27s
> `Well-extracted`
> *The ideal shot. Nothing to change.*

> **#8 — 34g out in 27s** → ratio 1.89, projected (36/34)×27 = 28.6s
> `Well-extracted`
> *Within the acceptable window and the assessment time lands in 25–30s.*

> **#8 — 37g out in 25s** → ratio 2.06 (near-target), assessed by actual time = 25s
> `Well-extracted`
> *Near-target shots use actual time to avoid over-correcting tiny yield drift.*

> **#8 — 40g out in 30s** → ratio 2.22, assessed by actual time = 30s
> `Well-extracted`
> *Now considered close enough to target with stable time.*

> **#8 — 40g out in 25s** → ratio 2.22, assessed by actual time = 25s
> `Well-extracted`
> *Mild overrun is tolerated in the 1.8–2.2 window.*

> **#9 — 44g out in 25s** → ratio 2.44, flow 1.76 g/s, assessed by actual time = 25s
> `Fast flow + over target → go slightly finer` + `Cut sooner`
> *Over target with slightly fast flow, so tighten grind and stop earlier.*

> **#9 — 46g out in 25s** → ratio 2.56, flow 1.84 g/s, assessed by actual time = 25s
> `Fast flow + over target → go finer` + `Cut sooner`
> *Clearly fast overrun: both grind and stop point need correction.*

---

### Assessment time 31–35s (slightly over-extracted → go slightly coarser)

| # | Yield zone | Output | Color |
|---|------------|--------|-------|
| 10 | Below 1.8 | Slightly over-extracted → go slightly coarser | amber |
| 11 | 1.8–2.2 | Slightly over-extracted → go slightly coarser | amber |
| 12 | Above 2.2 | Slightly over-extracted → go slightly coarser / Cut sooner | amber |

> **#11 — 36g out in 33s** → ratio 2.0, assessed by actual time = 33s
> `Slightly over-extracted → go slightly coarser`
> *A touch slow. One click coarser should do it.*

> **#12 — 43g out in 32s** → ratio 2.39, flow 1.34 g/s, assessed by actual time = 32s
> `Slightly over-extracted → go slightly coarser` + `Cut sooner`
> *Slightly slow overrun: reduce resistance a bit and stop earlier.*

For 31–35s shots, `Cut sooner` is appended only when ratio is above 2.2.

---

### Assessment time > 35s (over-extracted → go coarser)

| # | Yield zone | Output | Color |
|---|------------|--------|-------|
| 13 | Below 1.8 | Over-extracted → go coarser | amber |
| 14 | 1.8–2.2 | Over-extracted → go coarser | amber |
| 15 | Above 2.2 | Over-extracted → go coarser / Cut sooner | amber |

> **#13 — 30g out in 30s** → ratio 1.67, projected (36/30)×30 = 36s
> `Over-extracted → go coarser`
> *Slow flow even though yield is low. No "Pull longer" — pulling longer into over-extraction would make it worse.*

> **#14 — 36g out in 40s** → ratio 2.0, assessed by actual time = 40s
> `Over-extracted → go coarser`
> *Way too slow.*

For >35s shots, `Cut sooner` is appended only when ratio is above 2.2.

---

## Summary

- **16 total outcomes**: 1 choking + 15 time-band/yield combinations
- **Asymmetric guardrail**: ratio < 1.9 uses projected time; ratio ≥ 1.9 uses actual extraction time
- **Green (well-extracted)**: assessment time 25–30s AND ratio within 1.8–2.2
- **"Pull longer"**: only when ratio < 1.8 AND assessment time ≤ 30s (rows 1, 4, 7)
- **Over-target tuning**: when ratio > 2.2 and assessment time ≥ 25s, `cut sooner` is always included, with flow-based grind guidance (`<1.6` good flow, `1.6–1.79` slightly finer, `≥1.8` finer)
- **Over/slightly over**: if ratio is above 2.2, `Cut sooner` is appended alongside coarsening guidance
- **Choking**: overrides everything when ratio < 1.5 AND flow < 1.0 g/s
