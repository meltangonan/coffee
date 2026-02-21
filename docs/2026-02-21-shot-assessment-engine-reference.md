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
| `BREW_RATIO_STANDARD_MAX` | 2.2 | Above: "Cut sooner" zone |

## How It Works

1. **Choking check** — ratio < 1.5 AND flow rate < 1.0 g/s → short-circuit
2. **Project time** — `(dose × 2 ÷ yield) × time` → what extraction time *would be* at 1:2
3. **Assess projected time** against extraction time bands
4. **Append yield advice** if ratio is outside the 1.8–2.2 standard range

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

### Projected time < 22s (under-extracted → go finer)

| # | Yield zone | Output | Color |
|---|------------|--------|-------|
| 1 | Below 1.8 | Under-extracted → go finer / Pull longer | amber |
| 2 | 1.8–2.2 | Under-extracted → go finer | amber |
| 3 | Above 2.2 | Under-extracted → go finer | amber |

> **#1 — 25g out in 10s** → ratio 1.39, projected (36/25)×10 = 14.4s
> `Under-extracted → go finer` + `Pull longer`
> *Grind is way too coarse and they stopped early.*

> **#2 — 36g out in 18s** → ratio 2.0, projected = 18s (at target, no adjustment)
> `Under-extracted → go finer`
> *Hit target yield but flow was way too fast.*

> **#3 — 46g out in 25s** → ratio 2.56, projected (36/46)×25 = 19.6s
> `Under-extracted → go finer`
> *Overran target and flow was still fast. No "Cut sooner" — grind is the main fix.*

---

### Projected time 22–24s (slightly under-extracted → go slightly finer)

| # | Yield zone | Output | Color |
|---|------------|--------|-------|
| 4 | Below 1.8 | Slightly under-extracted → go slightly finer / Pull longer | amber |
| 5 | 1.8–2.2 | Slightly under-extracted → go slightly finer | amber |
| 6 | Above 2.2 | Slightly under-extracted → go slightly finer | amber |

> **#4 — 30g out in 20s** → ratio 1.67, projected (36/30)×20 = 24s
> `Slightly under-extracted → go slightly finer` + `Pull longer`
> *Slightly fast flow and stopped a bit early.*

> **#5 — 36g out in 23s** → ratio 2.0, projected = 23s
> `Slightly under-extracted → go slightly finer`
> *Hit target yield, just a touch fast.*

---

### Projected time 25–30s (standard range)

| # | Yield zone | Output | Color |
|---|------------|--------|-------|
| 7 | Below 1.8 | Good flow → pull longer | amber |
| 8 | 1.8–2.2 | Well-extracted | green |
| 9 | Above 2.2 | Good flow → cut sooner | amber |

> **#7 — 30g out in 21s** → ratio 1.67, projected (36/30)×21 = 25.2s
> `Good flow → pull longer`
> *Flow rate is good — just need to let it run to target yield.*

> **#8 — 36g out in 27s** → ratio 2.0, projected = 27s
> `Well-extracted`
> *The ideal shot. Nothing to change.*

> **#8 — 34g out in 27s** → ratio 1.89, projected (36/34)×27 = 28.6s
> `Well-extracted`
> *Close enough to target (1.89 is within 1.8–2.2). No "Pull longer" needed.*

> **#9 — 40g out in 30s** → ratio 2.22, projected (36/40)×30 = 27s
> `Good flow → cut sooner`
> *Flow rate is good — just went a bit past target yield.*

---

### Projected time 31–35s (slightly over-extracted → go slightly coarser)

| # | Yield zone | Output | Color |
|---|------------|--------|-------|
| 10 | Below 1.8 | Slightly over-extracted → go slightly coarser | amber |
| 11 | 1.8–2.2 | Slightly over-extracted → go slightly coarser | amber |
| 12 | Above 2.2 | Slightly over-extracted → go slightly coarser | amber |

> **#11 — 36g out in 33s** → ratio 2.0, projected = 33s
> `Slightly over-extracted → go slightly coarser`
> *A touch slow. One click coarser should do it.*

Yield zone doesn't matter here — grind is the only fix. No "Pull longer" or "Cut sooner" appended.

---

### Projected time > 35s (over-extracted → go coarser)

| # | Yield zone | Output | Color |
|---|------------|--------|-------|
| 13 | Below 1.8 | Over-extracted → go coarser | amber |
| 14 | 1.8–2.2 | Over-extracted → go coarser | amber |
| 15 | Above 2.2 | Over-extracted → go coarser | amber |

> **#13 — 30g out in 30s** → ratio 1.67, projected (36/30)×30 = 36s
> `Over-extracted → go coarser`
> *Slow flow even though yield is low. No "Pull longer" — pulling longer into over-extraction would make it worse.*

> **#14 — 36g out in 40s** → ratio 2.0, projected = 40s
> `Over-extracted → go coarser`
> *Way too slow.*

---

## Summary

- **16 total outcomes**: 1 choking + 15 projection-based (5 time bands × 3 yield zones)
- **Green (well-extracted)**: only outcome #8 — projected time 25–30s AND ratio within 1.8–2.2
- **"Pull longer"**: only when ratio < 1.8 AND projected time ≤ 30s (rows 1, 4, 7)
- **"Cut sooner"**: only when ratio > 2.2 AND projected time ≥ 25s (row 9 only in practice)
- **Over/slightly over** (rows 10–15): never append yield advice — grind is the sole fix
- **Choking**: overrides everything when ratio < 1.5 AND flow < 1.0 g/s
