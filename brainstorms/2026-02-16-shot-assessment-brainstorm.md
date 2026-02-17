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
- **Missing data**: Show nothing if there isn't enough data (no time AND no ratio). If only time is missing, assess ratio alone. If only ratio is missing (no yield), assess time alone.
- **Logic is numbers-driven**: Based on extraction time and ratio, not the subjective user rating.
- **Dose is excluded**: Dose is a fixed starting point, not a dialing-in variable. The engine never recommends dose changes.
- **Recommendations are directional**: "Try going finer" not "Try grind 4." Avoids false precision.

## Assessment Engine

### Signals (in priority order)

1. **Extraction time** (primary) — diagnostic for grind correctness
2. **Brew ratio** (secondary) — validates yield against 1:2 standard target
3. **Best dial-in data** (enhancement, future consideration) — personal context when available

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

| Time | Ratio | Assessment | Recommendation |
|------|-------|-----------|----------------|
| Fast | Standard | Under-extracted | Try going finer |
| Slightly fast | Standard | Slightly under-extracted | Try going slightly finer |
| Standard | Standard | Well-extracted | *(none)* |
| Slightly slow | Standard | Slightly over-extracted | Try going slightly coarser |
| Slow | Standard | Over-extracted | Try going coarser |
| Standard | Low (<1:1.8) | Yield below standard | Try pulling a bit longer |
| Standard | High (>2.2) | Yield past standard | Try cutting closer to 1:2 |
| Fast | High | Under-extracted | Try going finer · Cut closer to 1:2 |
| Slow | Low | Over-extracted | Try going coarser · Pull a bit longer |
| — | Standard | *(time missing)* | Ratio looks good |
| Standard | — | *(ratio missing)* | Time in range |
| — | — | *(both missing)* | *(show nothing)* |

### Display Examples

**Well-extracted shot:**
```
Ethiopian Yirgacheffe
Grind 5 · 18g → 36g (1:2.0) · 27s
                                              [Great]
✓ Well-extracted                              (green)
```

**Fast extraction:**
```
Ethiopian Yirgacheffe
Grind 6 · 18g → 36g (1:2.0) · 20s
                                              [Okay]
Under-extracted · Try going finer             (amber)
```

**Time fine, ratio off:**
```
Ethiopian Yirgacheffe
Grind 5 · 18g → 45g (1:2.5) · 28s
                                              [Okay]
Yield past standard · Try cutting closer to 1:2  (amber)
```

**Both off:**
```
Ethiopian Yirgacheffe
Grind 8 · 18g → 45g (1:2.5) · 19s
                                              [Bad]
Under-extracted · Try going finer · Cut closer to 1:2  (amber)
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
