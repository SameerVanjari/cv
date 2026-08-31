# 004 — Tokenize easing and enforce duration budget

- **Status**: DONE
- **Commit**: 292bb9c
- **Severity**: MEDIUM
- **Category**: Cohesion & tokens + Easing & duration
- **Estimated scope**: 4 files, ~20 lines

## Problem

Easing and durations are hand-typed and inconsistent, violating AUDIT §2 and §7. The repo has **no CSS easing tokens**, yet the same curve is duplicated as a JS array, and durations exceed the UI budget.

Evidence — duplicated curve:

```tsx
// src/components/motion.tsx:23 — current
transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
```

```tsx
// src/components/motion.tsx:57 — current
show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
```

```tsx
// src/components/motion.tsx:115 — current
transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
```

```css
/* src/components/about-illustration.tsx:111 — current */
.illustration-line-1 { animation: drawLine 0.95s cubic-bezier(0.16,1,0.3,1) forwards; }
```

No `globals.css` token like `--ease-out` exists:

```css
/* src/app/globals.css:5-27 — current :root has only color/radius tokens, no --ease-* or --duration-* */
:root {
  --background: 0 0% 100%;
  --foreground: 240 10% 3.9%;
  /* ... no easing tokens ... */
  --radius: 0.75rem;
}
```

Duration budget violated (AUDIT §2: UI <300ms, modals/drawers 200-500ms, marketing can be longer):

| Location | Duration | Budget | Finding |
|----------|----------|--------|---------|
| `motion.tsx:23` Reveal | 0.7s (700ms) | 200-500ms for entrances | Too slow, feels sluggish |
| `motion.tsx:57` Stagger child | 0.6s (600ms) | <300ms ideal for list entrances | Too slow |
| `page.tsx:105` Reveal spring | 0.55s (550ms) | 200-500ms | Upper edge, plus stagger delay up to 0.24s → ~0.8s total cascade |
| `motion.tsx:115` Parallax | 1.2s | Marketing 1s+ is okay but borderline crisp | Could be tighter |
| `about-illustration.tsx:111` drawLine | 0.95s | Marketing/illustrative — exempt but should use token | Inconsistent |
| `tailwind.config.js:71` accordion-down | 0.2s | OK (within 150-250ms) | Good |
| `dialog.tsx` duration-200 | 200ms | OK | Good |

The `0.7s` + `delay` + `staggerChildren 0.08` cascade is the main feel-breaker: scrolling through Experience/Projects reveals children sequentially over ~800ms, blocking perceived completeness.

## Target

Introduce tokenized easing in `globals.css` and tighten durations to budget. Use AUDIT's strong curves verbatim:

```css
/* target — src/app/globals.css :root addition */
:root {
  /* existing tokens ... */
  --ease-out: cubic-bezier(0.23, 1, 0.32, 1);        /* strong ease-out for UI */
  --ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);    /* strong ease-in-out for on-screen movement */
  --ease-drawer: cubic-bezier(0.32, 0.72, 0, 1);     /* iOS-like drawer curve */
  --ease-emphasized: cubic-bezier(0.16, 1, 0.3, 1);  /* current curve, kept as token for marketing reveals */
  --duration-fast: 160ms;
  --duration-medium: 240ms;
  --duration-entrance: 320ms;
}
```

```tsx
// target — Reveal (motion.tsx:23)
transition={{ duration: 0.32, delay, ease: [0.23, 1, 0.32, 1] }} // 320ms, var(--ease-out)
// or if keeping JS ease, reference token via CSS var in style? Prefer JS cubic array matching token:
ease: [0.23, 1, 0.32, 1]
```

```tsx
// target — Stagger child (motion.tsx:57)
show: { opacity: 1, y: 0, transition: { duration: 0.32, ease: [0.23, 1, 0.32, 1] } }
// plus staggerChildren 0.06 (was 0.08) for tighter group entrance per AUDIT 30-80ms
```

```tsx
// target — page.tsx Reveal spring
transition={ reduce ? { duration: 0.2, delay } : { type: "spring", bounce: 0, duration: 0.42, delay } } // was 0.55 → 0.42
```

```css
/* target — about-illustration drawLine */
.illustration-line-1 { animation: drawLine 0.52s var(--ease-emphasized) forwards; } /* was 0.95s */
```

Parallax `1.2s` can stay (marketing) or tighten to `0.9s` — keep if deliberate.

## Repo conventions to follow

- Tokens live in `src/app/globals.css` under `@layer base { :root { ... } }` — exemplar lines 5-27. Add easing tokens there, not in `tailwind.config.js`.
- Tailwind already extends via `tailwind.config.js` — but easing tokens are CSS vars for Motion/JS usage, not Tailwind `transitionTimingFunction`. Keep them as CSS vars.
- Motion `ease` prop accepts `cubicBezier` array `[x1,y1,x2,y2]` — map `--ease-out: cubic-bezier(0.23,1,0.32,1)` to `ease: [0.23, 1, 0.32, 1]` in JS.
- Existing `duration` tokens are not present; introduce `--duration-*` as specified and use in both CSS (`animation: ... var(--duration-entrance)`) and JS (`duration: 0.32` matching `320ms`).

## Steps

1. **Read** `src/app/globals.css:5-27`, `src/components/motion.tsx:23,57,115`, `src/app/page.tsx:104-105`, `src/components/about-illustration.tsx:107-117`, `tailwind.config.js:70-73`.
2. **Edit `src/app/globals.css` — add tokens**: Inside `:root { ... }` after `--radius`, add:
   ```css
   --ease-out: cubic-bezier(0.23, 1, 0.32, 1);
   --ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);
   --ease-drawer: cubic-bezier(0.32, 0.72, 0, 1);
   --ease-emphasized: cubic-bezier(0.16, 1, 0.3, 1);
   --duration-fast: 160ms;
   --duration-medium: 240ms;
   --duration-entrance: 320ms;
   ```
   Also add to `.dark` if needed (inherit, no need to duplicate).
3. **Edit `src/components/motion.tsx` — Reveal**: Change `transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}` to `transition={{ duration: 0.32, delay, ease: [0.23, 1, 0.32, 1] }}` (use `var(--ease-out)` equivalent). Keep `delay` param.
4. **Edit `src/components/motion.tsx` — Stagger**: Change child `transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }` to `duration: 0.32, ease: [0.23, 1, 0.32, 1]` and change `staggerChildren: reduce ? 0 : stagger` default `stagger = 0.08` to `0.06` (or keep prop but change default to 0.06) per AUDIT 30-80ms stagger guidance. Update default param `stagger = 0.06`.
5. **Edit `src/components/motion.tsx` — Parallax**: Optionally tighten `duration: 1.2` to `0.9` and `ease: [0.16,1,0.3,1]` to `ease: [0.23,1,0.32,1]` or keep as `var(--ease-emphasized)` if marketing page length justifies. Document choice in comment.
6. **Edit `src/app/page.tsx` — local Reveal**: Change `transition={ reduce ? { duration: 0.2, delay } : { type: "spring", bounce: 0, duration: 0.55, delay } }` to `duration: 0.42` (was 0.55) — keeps spring feel but snaps faster. Keep `bounce: 0`.
7. **Edit `src/components/about-illustration.tsx`**: Replace `animation: drawLine 0.95s cubic-bezier(0.16,1,0.3,1) forwards;` with `animation: drawLine 0.52s var(--ease-emphasized) forwards;` and adjust delays from `0.1/0.2/0.3/0.4s` to `0.06/0.12/0.18/0.24s` for tighter cascade. Keep `@keyframes drawLine` unchanged.
8. **Optional**: Add Tailwind `transitionTimingFunction` extension in `tailwind.config.js` mapping `ease-out` to `var(--ease-out)` for future `duration-*` usage — not required but nice for cohesion.

## Boundaries

- Do NOT change `tailwind.config.js` accordion `0.2s ease-out` — it is already within budget and correct per AUDIT (entering/exiting → ease-out).
- Do NOT change `src/components/shader-bg.tsx` drift durations (14-18s) — they are constant marketing motion, exempt as `linear` vs `easeInOut` is low leverage.
- Do NOT change `Dialog` `duration-200` — correct.
- Do NOT add new dependencies.
- If a step doesn't match code since `292bb9c` (e.g., motion.tsx already uses tokens), STOP and report.

## Verification

- **Mechanical**: `npm run lint` and `npm run build` pass. Grep for `[0.16, 1, 0.3, 1]` should return only the token definition or zero hits (all replaced by `[0.23, 1, 0.32, 1]` or `var(--ease-out)`).
- **Feel check**:
  - Run `npm run dev`, scroll slowly through Experience and Projects.
  - Confirm: reveals snap in ~320ms, not 700ms. Group stagger feels like quick cascade (30-60ms between cards), not a slow waterfall. No content appears sluggish.
  - In DevTools Animations panel, set playback to 10% and confirm each reveal's `opacity + transform` completes within ~320ms + delay. Previously 700ms will now feel ~2× faster and more responsive.
  - Check illustration: code lines draw in ~520ms total, still legible but quicker.
  - Toggle `prefers-reduced-motion` — entrances should be instant/opacity-only (handled by plan 003, but durations still respected when not reduced).
- **Done when**: No duration >500ms remains on scroll reveals; easing is tokenized in `globals.css` and all JS uses `[0.23,1,0.32,1]`; stagger default is 0.06s; build passes.
