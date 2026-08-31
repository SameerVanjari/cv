# 005 — Gate hover motion and add stagger to project grid

- **Status**: DONE
- **Commit**: 292bb9c
- **Severity**: LOW
- **Category**: Accessibility + Cohesion & tokens (Missed opportunity)
- **Estimated scope**: 2 files, ~15 lines

## Problem

Two polish issues that compound:

**A. Ungated hover motion fires false hovers on touch.** Per AUDIT §6, hover motion must be wrapped in `@media (hover: hover) and (pointer: fine)`, else touch devices fire a sticky hover on tap.

Current:

```tsx
// src/app/page.tsx:265-266 — current
<span className="flex size-6 items-center justify-center rounded-full bg-white text-zinc-900 transition-transform group-hover:rotate-45 dark:bg-zinc-900 dark:text-white"><ArrowUpRight className="size-3.5" /></span>
// parent: className="group ..."
// Hover triggers even on touch, causing the arrow to stay rotated after tap
```

```tsx
// src/app/page.tsx:301 — current
<a key={s.name} href={s.url} target="_blank" className="flex size-8 items-center justify-center rounded-full bg-white/90 text-zinc-900 backdrop-blur hover:scale-105 transition-transform dark:bg-zinc-900/90 dark:text-white"><s.icon className="size-4" /></a>
```

```tsx
// src/app/page.tsx:514 — current
<motion.span key={s} whileHover={reduce ? undefined : { y: -1 }} whileTap={reduce ? undefined : { scale: 0.97 }} className="... hover:border-zinc-900 hover:bg-zinc-900 hover:text-white">
```

```css
/* src/app/globals.css — no hover gating exists for .pill-bob hover, but pill-bob itself is correctly gated via @media (hover: none) */
@media (hover: none), (pointer: coarse) {
  .pill-bob { animation: none !important; }
}
```

Only `pill-bob` is gated; the generic `hover:scale-105` and `group-hover:rotate-45` are not.

**B. Project grid lacks proper stagger.** Per AUDIT §7, everything-at-once group entrances should use 30-80ms stagger. Currently `src/app/page.tsx:387-494` renders each project card as an individual `<Reveal delay={0.04 * idx}>` with hand-tuned delays, not a shared `Stagger` container that sequences smoothly and non-blockingly.

```tsx
// src/app/page.tsx:388-401 — current
<Reveal delay={0.04} y={10} className="md:col-span-8 flex h-full">
  <SpringCard>...</SpringCard>
</Reveal>
<Reveal delay={0.08} y={10} className="md:col-span-4 flex h-full">
  <SpringCard>...</SpringCard>
</Reveal>
{CURATED.slice(2, 5).map((p, i) => (
  <Reveal key={p.id} delay={0.1 + i * 0.05} y={10} className="md:col-span-4 flex h-full">
```

Stagger is manual, delays up to 0.3s, and not using the existing `Stagger` component from `src/components/motion.tsx:31-64` which already implements `staggerChildren` correctly with `useReducedMotion` gating.

## Target

**A. Gate hover:**

```css
/* target — src/app/globals.css additions */
@media (hover: hover) and (pointer: fine) {
  .hover-scale-105:hover { transform: scale(1.05); }
  .group:hover .group-hover-rotate-45 { transform: rotate(45deg); }
  /* Or use Tailwind's hover: prefix but wrap in media query via CSS layer */
}
```

Simpler Tailwind-native target: keep `hover:scale-105` class but ensure it only applies on fine pointer by adding a CSS override that resets it on coarse:

```css
/* target — globals.css */
@media (hover: none), (pointer: coarse) {
  .hover\:scale-105:hover { transform: none !important; }
  .group-hover\:rotate-45 { transform: none !important; }
  /* Or scope to specific elements */
}
```

JS target for Motion `whileHover`:

```tsx
// target — gate whileHover behind hover capability
const canHover = typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
whileHover={reduce || !canHover ? undefined : { transform: "translateY(-1px)" }}
```

**B. Stagger:**

Wrap the grid in `Stagger` from `@/components/motion` (or inline equivalent) with `stagger={0.06}` (60ms) and remove per-card `delay` props. Stagger must not block interaction (AUDIT §7).

```tsx
// target — src/app/page.tsx
<Stagger stagger={0.06} className="mt-7 grid gap-4 md:grid-cols-12">
  <motion.div variants={staggerItemVariants} className="md:col-span-8">...</motion.div>
  <motion.div variants={staggerItemVariants} className="md:col-span-4">...</motion.div>
  ...
</Stagger>
```

Or minimally: replace manual `delay` values with a shared stagger container, keeping `Reveal` but driving via `staggerChildren`.

## Repo conventions to follow

- Existing hover gating pattern: `src/app/globals.css:112-114` already uses `@media (hover: none), (pointer: coarse) { .pill-bob { animation: none } }` — extend this pattern for hover resets.
- `useReducedMotion` gating is the JS pattern — exemplar `src/app/page.tsx:124` `whileHover={reduce ? undefined : { y: -3 }}`. Extend to also gate on `canHover`.
- `Stagger` component in `src/components/motion.tsx:31-64` is the exemplar for stagger — use it or imitate its `variants: { hidden:{}, show:{ transition:{ staggerChildren } } }` pattern. It already handles `reduce ? 0 : stagger`.

## Steps

1. **Read** `src/app/globals.css:112-114`, `src/app/page.tsx:263-267,301,514`, `src/components/motion.tsx:31-64`.
2. **Edit `src/app/globals.css` — add hover gating override** after the existing `@media (hover: none)` block:
   ```css
   @media (hover: hover) and (pointer: fine) {
     /* hover motion is allowed here — no override needed; this documents the intent */
   }
   @media (hover: none), (pointer: coarse) {
     /* reset hover-driven transforms that would stick on tap */
     .hover\:scale-105:hover { transform: none !important; }
     .group-hover\:rotate-45 { transform: none !important; }
     /* also reset skill pill hover lift if using Tailwind hover: */
     .hover\:scale-\[1\.02\]:hover { transform: none !important; }
   }
   ```
   Alternatively, wrap existing hover utilities in `@media (hover: hover) and (pointer: fine)` if rewriting classes to custom selectors.
3. **Edit `src/app/page.tsx` — whileHover gating for skill pills (line 514)**: Add hover-capability check alongside `reduce`:
   ```tsx
   const canHover = typeof window !== "undefined" ? window.matchMedia("(hover: hover) and (pointer: fine)").matches : false;
   // or use a hook
   whileHover={reduce || !canHover ? undefined : { transform: "translateY(-1px)" }}
   ```
   If adding a hook is out of scope for this LOW plan, at minimum wrap the `whileHover` in a CSS media query by moving the effect to a class: add `className="hover-lift"` and define `.hover-lift:hover { transform: translateY(-1px) }` inside `@media (hover: hover) and (pointer: fine)`.
4. **Edit `src/app/page.tsx` — project grid stagger**: Import `Stagger` from `@/components/motion` (currently unused in `page.tsx`). Replace the manual `Reveal` wrappers with a single `Stagger` container:
   - Wrap the grid `div` with `<Stagger stagger={0.06} className="mt-7 grid gap-4 md:grid-cols-12 ...">`
   - Inside, each card becomes `<motion.div variants={...}>` or keep `Reveal` but remove `delay` props so stagger drives sequencing.
   - Simplest: keep current `Reveal` structure but import `Stagger` and wrap — then delete `delay={0.04}`, `delay={0.08}`, `delay={0.1 + i*0.05}` etc., relying on `staggerChildren: 0.06`.
   - Ensure `Stagger`'s inner `motion.div` wrappers use `transform` not `y` (depends on plan 002 — if 002 not yet executed, keep `y` for now and note dependency).
5. **Verify** no `transition: all` or unintended hover persists on touch.

## Boundaries

- Do NOT change `DraggablePill` hover `hover:scale-[1.02]` beyond gating — keep its `transition-[transform] duration-160 ease-out` (correct).
- Do NOT introduce new JS libraries; a simple `matchMedia` check is sufficient.
- Do NOT change project card content/layout — only wrapper and hover classes.
- If `Stagger` component has drifted since `292bb9c` or causes double `whileInView`, STOP and report — the manual delays are acceptable fallback.
- This plan depends on plan 004 (easing tokens) for stagger value choice but can execute independently with hardcoded `0.06`.

## Verification

- **Mechanical**: `npm run lint` passes; `npm run build` passes.
- **Feel check — touch**:
  1. Run `npm run dev`, open Chrome DevTools → Rendering → Emulate `hover: none` / or test on real mobile device.
  2. Tap the CTA arrow (`View selected work` group): arrow should NOT stay rotated after tap.
  3. Tap hero social icons: they should NOT stay scaled at 1.05 after tap.
  4. Tap skill pills: no hover lift on touch, only press feedback on tap (scale 0.97).
- **Feel check — stagger**:
  1. On desktop, reload and scroll to `#projects` at normal speed.
  2. Confirm cards enter as quick cascade ~60ms apart, not all at once, not a slow 300ms waterfall. The cascade should be decorative and not block clickability — try clicking a card immediately as it enters; it should respond without waiting for stagger to finish.
  3. In Animations panel 10% playback, confirm staggerChildren timing: first card at 0ms, second at 60ms, third at 120ms etc.
  4. With `prefers-reduced-motion: reduce`, all cards appear at once with no stagger (due to `reduce ? 0 : stagger`).
- **Done when**: Hover motion is gated behind `(hover: hover) and (pointer: fine)` and does not stick on touch; project grid uses 60ms stagger via `Stagger` and manual delays are removed; build passes.
