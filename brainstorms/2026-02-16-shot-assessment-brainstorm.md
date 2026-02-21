---
date: 2026-02-16
topic: shot-assessment
type: product-brainstorm
---

# Shot Assessment & Recommendation

## What We're Building

A lightweight, per-shot assessment line that appears on every logged shot card. It evaluates the shot against universal espresso standards and gives directional recommendations when something's off. No separate cards, modals, or CTAs — just a color-coded label integrated into the existing shot card.

## Why This Approach

- **After logging, not before pulling** — fits the user's natural workflow (pull, taste, then open app to log). Pre-shot guidance would overlap with the existing best dial-in pre-fill.
- **On the shot card itself** — zero extra UI when you don't need it; always there when you click back to review a shot.
- **Minimal label style** — matches the existing terse shot card format (`Grind 5 · 18g → 36g`). No conversational text or heavy content.
- **Universal standards as foundation** — works from the very first shot. No need for historical data to be useful.

## Key Decisions

- **Timing**: After logging only. No pre-shot recommendation card (best dial-in already serves that role).
- **Display**: Always shown on every shot. Good shots get acknowledgment ("Well-extracted"), problem shots get a directional recommendation.
- **Tone**: Minimal label style — e.g., `Under-extracted · Try going finer`
- **Styling**: Color-coded — green for well-extracted, amber/warm for needs adjustment.
- **All fields required**: Every shot has grindSize, doseIn, yieldOut, and extractionTime (all > 0). No null/missing data cases.
- **Logic is numbers-driven**: Based on extraction time and ratio, not the subjective user rating.
- **Dose is excluded**: Dose is a fixed starting point, not a dialing-in variable. The engine never recommends dose changes.
- **Recommendations are directional**: "Try going finer" not "Try grind 4." Avoids false precision.

## Assessment Engine

### Signals (in priority order)

1. **Extraction time** (primary) — diagnostic for grind correctness
2. **Brew ratio** (secondary) — validates yield against 1:2 standard target
3. **Best dial-in data** (enhancement, future consideration) — personal context when available

### Projected Time (Universal Flow Rate Correction)

Actual extraction time doesn't reflect grind correctness when yield differs from target. The engine always computes **projected time** = (target yield / actual yield) × actual time, and assesses *that* instead of the raw time.

- **Below target yield**: Projected time is longer (user stopped early, projects forward)
- **Above target yield**: Projected time is shorter (user overran, projects backward)
- **At target yield (1:2)**: Projected time equals raw time
- **No yield data**: Use raw time (no projection possible)

When projected time lands in standard range but user stopped early: "Good flow → pull longer"
When projected time lands in standard range but user overran target: "Good flow → cut sooner"

### Universal Espresso Standards (sources below)

**Extraction time:**
| Range | Status |
|-------|--------|
| < 22s | Fast — likely under-extracted |
| 22-24s | Slightly fast — may be under-extracted |
| 25-30s | Standard range |
| 31-35s | Slightly slow — may be over-extracted |
| > 35s | Slow — likely over-extracted |

**Brew ratio (yield / dose):**
| Range | Status |
|-------|--------|
| < 1:1.5 | Very low yield |
| 1:1.5-1:1.8 | Yield on the low side |
| 1:1.8-2.2 | Standard range |
| 1:2.2-2.5 | Yield on the high side |
| > 1:2.5 | High yield |

### Recommendation Matrix

| Projected time | Yield vs target | Assessment | Recommendation |
|----------------|-----------------|-----------|----------------|
| *n/a* | Very low (<1:1.5) + flow < 1 g/s | **Choked/channeled** | **Go coarser** (overrides everything) |
| Fast | Below | Under-extracted | Go finer + Pull longer |
| Slightly fast | Below | Slightly under-extracted | Go slightly finer + Pull longer |
| Standard | Below | Good flow | Pull longer |
| Slightly slow | Below | Slightly over-extracted | Go slightly coarser |
| Slow | Below | Over-extracted | Go coarser |
| Fast | Above | Under-extracted | Go finer |
| Slightly fast | Above | Slightly under-extracted | Go slightly finer |
| Standard | Above | Good flow | Cut sooner |
| Slightly slow | Above | Slightly over-extracted | Go slightly coarser |
| Slow | Above | Over-extracted | Go coarser |
| Standard | At target | Well-extracted | *(none)* |
| — | — | *(both missing)* | *(show nothing)* |

**Key rules:**
- **Choking override:** Very low ratio (< 1:1.5) AND low flow rate (< 1.0 g/s) means the puck was choking. Fix is always "go coarser" regardless of time. Very low ratio with high flow rate (e.g. 21g in 3s) is NOT choking — it's a fast shot that was stopped early.
- **Universal projection:** The engine always projects time to target yield (1:2 ratio) using `(targetYield / actualYield) × actualTime`. This corrects for both early stops and overruns.
- **"Pull longer":** Only appended when yield is below target AND projected time is not over-extracted (no point pulling longer into over-extraction).
- **"Cut sooner":** Only appended when yield is above target AND projected time is not under-extracted (the grind issue is the primary fix when flow is fast).
- **No independent yield recommendations:** Yield is a consequence of grind + time. "Pull longer" and "Cut sooner" are yield-target reminders, not standalone recommendations — they only appear alongside grind advice or when projected time is in the standard range.

### Display Examples

**Well-extracted shot (36g in 27s):**
```
Ethiopian Yirgacheffe
Grind 5 · 18g → 36g (1:2.0) · 27s           [Great]
Well-extracted                                (green)
```

**Fast extraction (36g in 20s):**
```
Ethiopian Yirgacheffe
Grind 6 · 18g → 36g (1:2.0) · 20s           [Okay]
Under-extracted → go finer                    (amber)
```

**Stopped early, grind slightly off (30g in 20s, projected 24s):**
```
Ethiopian Yirgacheffe
Grind 6 · 18g → 30g (1:1.7) · 20s           [Okay]
Slightly under-extracted → go slightly finer  (amber)
Pull longer
```

**Stopped early, good flow (30g in 21s, projected 25.2s):**
```
Ethiopian Yirgacheffe
Grind 5 · 18g → 30g (1:1.7) · 21s           [Okay]
Good flow → pull longer                       (amber)
```

**Overran target, good flow (40g in 30s, projected 27s):**
```
Ethiopian Yirgacheffe
Grind 5 · 18g → 40g (1:2.2) · 30s           [Okay]
Good flow → cut sooner                        (amber)
```

**Choked (8g in 30s, flow 0.27 g/s):**
```
Ethiopian Yirgacheffe
Grind 3 · 18g → 8g (1:0.4) · 30s            [Bad]
Choked/channeled → go coarser                 (amber)
```

## Sources

- [SCA - Defining the Ever-Changing Espresso](https://sca.coffee/sca-news/25-magazine/issue-3/defining-ever-changing-espresso-25-magazine-issue-3)
- [La Marzocco - Espresso Brew Ratios](https://home.lamarzoccousa.com/using-espresso-brew-ratios/)
- [Flair Espresso - Brew Ratios Guide](https://flairespresso.com/learn/espresso-guide/brew-ratios/)
- [Perfect Daily Grind - Dialling In Espresso](https://perfectdailygrind.com/2020/07/a-guide-to-dialling-in-espresso/)
- [Espresso Aficionados - Dialling In Basics](https://espressoaf.com/guides/beginner.html)
- [Breville - How to Dial In Espresso](https://www.breville.com/us/en/blog/coffee-and-espresso/how-to-dial-in-espresso.html)
- [Bean Ground - Dialing In Espresso](https://www.beanground.com/dialing-in-espresso/)
- [Nucleus Coffee - Dialing In Guide](https://nucleuscoffee.com/en/blogs/specialty-coffee/dialing-in-espresso-grinder)

## Resolved Questions

1. **Best dial-in data**: v1 uses universal standards only. Personal dial-in enhancement is a future iteration.
2. **Colors**: Reuse existing design tokens — `--freshness-optimal` (green) for well-extracted, `--freshness-past` (warm) for needs adjustment.
3. **Tappable detail**: No. One-liner is enough. No expand/collapse behavior.

## Next Steps

→ Plan implementation when ready
