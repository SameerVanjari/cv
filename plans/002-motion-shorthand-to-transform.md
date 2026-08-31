# 002 — Replace Framer Motion x/y/scale shorthands with hardware-accelerated transform

- **Status**: DONE
- **Commit**: 292bb9c
- **Severity**: HIGH
- **Category**: Performance
- **Estimated scope**: 3 files, ~15 motion nodes

## Problem

Framer Motion `x`/`y`/`scale` shorthand props run on the main thread, not the compositor, and drop frames under load. Per AUDIT §5, the target is the full `transform` string (e.g., `animate={{ transform: "translateX(100px)" }}`) which is hardware-accelerated.

Current code uses shorthands everywhere:

```tsx
// src/components/motion.tsx:19-23 — current
<motion.div
  initial={reduce ? false : { opacity: 0, y }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, amount: 0.2 }}
  transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
>
```

```tsx
// src/components/motion.tsx:53-57 — current
<motion.div
  variants={{
    hidden: reduce ? { opacity: 1 } : { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
  }}
>
```

```tsx
// src/components/motion.tsx:98 — current
<motion.div ref={ref} style={{ x: sx, y: sy }} className={className}>
```

```tsx
// src/components/motion.tsx:110-115 — current
<motion.div
  initial={{ y: 0 }}
  whileInView={{ y: [offset, 0] }}
  viewport={{ once: true }}
  transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
>
```

```tsx
// src/app/page.tsx:99-106 — current Reveal duplicate
<motion.div
  initial={reduce ? { opacity: 0 } : { opacity: 0, y }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, amount: 0.22 }}
  transition={ reduce ? { duration: 0.2, delay } : { type: "spring", bounce: 0, duration: 0.55, delay } }
>
```

```tsx
// src/app/page.tsx:122-126 — current SpringCard
<motion.div
  whileHover={reduce ? undefined : { y: -3 }}
  whileTap={reduce ? undefined : { scale: 0.985 }}
  transition={{ type: "spring", bounce: 0, duration: 0.35 }}
>
```

```tsx
// src/app/page.tsx:219-222 — current nav CTA
<motion.a
  whileTap={reduce ? undefined : { scale: 0.97 }}
  transition={{ duration: 0.1 }}
>
```

```tsx
// src/app/page.tsx:263 — current CTA
<motion.a href="#projects" whileTap={reduce ? undefined : { scale: 0.97 }} transition={{ type: "spring", bounce: 0, duration: 0.3 }}>
```

```tsx
// src/app/page.tsx:292 — current hero card
<motion.div initial={reduce ? { opacity: 0 } : { opacity: 0, y: 10, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={...}>
```

```tsx
// src/components/shader-bg.tsx:22-26 — current
<motion.div
  animate={{ x: [0, 30, 0], y: [0, 20, 0], scale: [1, 1.05, 1] }}
  transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
/>
```

Each of these animates layout-adjacent properties via JS tick, not compositor `transform`.

## Target

All animated motion uses `transform` string so the browser composites on the GPU:

```tsx
// target pattern — Reveal
<motion.div
  initial={reduce ? false : { opacity: 0, transform: "translateY(18px)" }}
  whileInView={{ opacity: 1, transform: "translateY(0px)" }}
  viewport={{ once: true, amount: 0.2 }}
  transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
>
```

```tsx
// target — whileHover/whileTap
<motion.div
  whileHover={reduce ? undefined : { transform: "translateY(-3px)" }}
  whileTap={reduce ? undefined : { transform: "scale(0.985)" }}
>
```

```tsx
// target — Magnetic (spring-driven)
 // Instead of style={{ x: sx, y: sy }}, use transform strings via useMotionValue + useSpring driving a transform template
 // e.g., const tx = useTransform(sx, v => `translateX(${v}px)`) — but AUDIT target is direct transform string
 // Minimal change: keep motion values but set via `style={{ transform: useTransform(...) }}` or keep sx/sy but apply as `transform` via motion template
 // Accepted target: retain useSpring but apply as `style={{ transform: useTransform([sx,sy], ([x,y]) => `translate(${x}px, ${y}px)`) }}`
```

```tsx
// target — shader blobs
<motion.div
  animate={{ transform: ["translate(0px, 0px) scale(1)", "translate(30px, 20px) scale(1.05)", "translate(0px, 0px) scale(1)"] }}
  transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
/>
```

For `scale` and combined `y + scale` (hero card), use: `transform: "translateY(10px) scale(0.98)"`.

## Repo conventions to follow

- Existing easing gate: `useReducedMotion()` returns boolean and branches `initial`/`whileHover` to `undefined`/`false`. Keep that pattern — exemplar `src/app/page.tsx:124-126`:
  ```tsx
  whileHover={reduce ? undefined : { y: -3 }}
  ```
  becomes `whileHover={reduce ? undefined : { transform: "translateY(-3px)" }}`
- `motion/react` import is `from "motion/react"` — keep it.
- Keep `viewport={{ once: true }}` and `transition` shapes unchanged except for prop name.

## Steps

1. **Read** `src/components/motion.tsx`, `src/app/page.tsx`, `src/components/shader-bg.tsx` at the lines cited above to confirm current prop names.
2. **Edit `src/components/motion.tsx` — Reveal**: Replace `initial={{ opacity:0, y }}` with `initial={reduce ? false : { opacity:0, transform: `translateY(${y}px)` }}` and `whileInView={{ opacity:1, y:0 }}` with `whileInView={{ opacity:1, transform:"translateY(0px)" }}`. Keep `useReducedMotion` guard.
3. **Edit `src/components/motion.tsx` — Stagger**: Replace child variants `hidden: { opacity:0, y:16 }` with `hidden: { opacity:0, transform:"translateY(16px)" }` and `show: { opacity:1, y:0 }` with `show: { opacity:1, transform:"translateY(0px)" }}`. Keep `reduce` branch (`{ opacity:1 }` unchanged — no transform when reduced).
4. **Edit `src/components/motion.tsx` — Magnetic**: Replace `style={{ x: sx, y: sy }}` with a compositor-friendly transform. Use `useTransform` to map springs to a transform string: `const transform = useTransform([sx, sy], ([x,y]) => `translate(${x}px, ${y}px)`)` and then `style={{ transform }}`. Add `useTransform` import already present. Verify types.
5. **Edit `src/components/motion.tsx` — Parallax**: Replace `initial={{ y:0 }}` / `whileInView={{ y:[offset,0] }}` with `initial={{ transform:"translateY(0px)" }}` / `whileInView={{ transform:[`translateY(${offset}px)`, "translateY(0px)"] }}`.
6. **Edit `src/app/page.tsx` — Reveal (local duplicate, line 99)**: Same transform replacement as step 2, but this one uses spring transition. Replace `initial={reduce ? {opacity:0} : {opacity:0, y}}` with `initial={reduce ? {opacity:0, transform:"translateY(0px)"} : {opacity:0, transform:`translateY(${y}px)`}}` (keep reduced branch minimal) and `whileInView={{opacity:1, y:0}}` with `whileInView={{opacity:1, transform:"translateY(0px)"}}`.
7. **Edit `src/app/page.tsx` — SpringCard (line 122)**: Replace `whileHover={{ y:-3 }}` with `whileHover={{ transform:"translateY(-3px)" }}` and `whileTap={{ scale:0.985 }}` with `whileTap={{ transform:"scale(0.985)" }}`. Keep `reduce` guard.
8. **Edit `src/app/page.tsx` — all whileTap scale instances** (lines 219, 263, 267, 514): Replace `whileTap={{ scale:0.97 }}` and `whileHover={{ y:-1 }}` (skills pill) with `transform` equivalents: `"scale(0.97)"`, `"translateY(-1px)"`.
9. **Edit `src/app/page.tsx` — Hero card (line 292)**: Replace `initial={{ opacity:0, y:10, scale:0.98 }}` with `initial={{ opacity:0, transform:"translateY(10px) scale(0.98)" }}` and `animate={{ opacity:1, y:0, scale:1 }}` with `animate={{ opacity:1, transform:"translateY(0px) scale(1)" }}`.
10. **Edit `src/components/shader-bg.tsx` — 3 blobs**: Replace each `animate={{ x:[...], y:[...], scale:[...] }}` with single `transform` array: `animate={{ transform: ["translate(0px,0px) scale(1)", "translate(30px,20px) scale(1.05)", "translate(0px,0px) scale(1)"] }}` etc., preserving the three distinct duration/delay values (14s, 16s delay1, 18s delay0.6).
11. **Typecheck** — ensure `transform` accepts string arrays (Motion does). If type errors, use `as any` minimal assertion.

## Boundaries

- Do NOT change easing curves, durations, or `viewport` options — only the prop name/value shape.
- Do NOT change CSS `transform-origin` or layout.
- Do NOT add new dependencies.
- Do NOT modify `globals.css` or `tailwind.config.js` in this plan.
- If a `transform` string conflicts with existing `transform` from CSS (e.g., `pill-bob` rotate variable), STOP — those elements use CSS `transform` already; Motion's `transform` will override. For those, keep as-is or report.

## Verification

- **Mechanical**: `npm run build` succeeds; `tsc --noEmit` passes; no motion prop type errors.
- **Feel check**: Run `npm run dev`, scroll through page:
  - Reveal entrances still slide up from 16-18px with fade, no jitter.
  - Hover SpringCards lift 3px smoothly; press scales to 0.985/0.97 crisply.
  - Magnetic button (if rendered via `Magnetic`) follows cursor without lag and snaps back with spring when leaving.
  - Shader blobs drift slowly without dropping frames — test with Chrome DevTools Performance: record 10s scroll, confirm `Update Layer Tree` not spiking, FPS stays near 60 on 6x CPU slowdown.
  - In DevTools, inspect computed style during animation — `transform` is `matrix(...)` composited, not layout-triggering.
- **Done when**: No `x`, `y`, or `scale` shorthand remains in `motion.*` props across the three files; all use `transform`; build passes and motion feels identical but smoother under load.
