# 003 — Fix prefers-reduced-motion that nukes all motion

- **Status**: DONE
- **Commit**: 292bb9c
- **Severity**: MEDIUM
- **Category**: Accessibility
- **Estimated scope**: 1 file, ~15 lines

## Problem

`globals.css` implements `prefers-reduced-motion` by nuking **all** animation and transition durations, violating AUDIT §6. Reduced motion should be *fewer and gentler*, not zero — keep opacity/color transitions that aid comprehension, drop position/scale movement.

Current:

```css
/* src/app/globals.css:107-110 — current */
@media (prefers-reduced-motion: reduce) {
  .shimmer::after { display: none; }
  .pill-bob { animation: none !important; }
  * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
}
```

The `* { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }` kills even the `Dialog` fade (`opacity`) that helps users understand open/close, and kills `transition-colors` on buttons that are comprehension aids. It also uses `!important` which overrides every component.

Positive examples in repo that already branch correctly and would be broken by this hammer:

```tsx
// src/components/motion.tsx:17-20 — correct per-component branching
const reduce = useReducedMotion();
return (
  <motion.div
    initial={reduce ? false : { opacity: 0, y }}
    transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
>
```

```tsx
// src/components/about-illustration.tsx:133-138 — correct
@media (prefers-reduced-motion: reduce) {
  .illustration-line-1, ... { animation: none !important; }
  .illustration-line-1, ... { stroke-dashoffset: 0 !important; }
}
```

These per-component guards are good; the global `*` undoes their nuance.

## Target

Replace the global nuke with a targeted reset that preserves `opacity` and `color` transitions, only dropping movement:

```css
/* target */
@media (prefers-reduced-motion: reduce) {
  .shimmer::after { display: none; }
  .pill-bob { animation: none !important; }
  /* Keep opacity/color transitions; drop transform/position motion */
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
  /* Re-enable opacity/color transitions that aid comprehension */
  /* Approach A: allowlist — re-enable for specific properties via later rule */
  /* Or approach B: override only movement properties */

  /* Preferred: scope to transform/translate/rotate/scale/filter, keep opacity/color */
  /* If not feasible with pure CSS, at minimum remove the global * rule and rely on per-component useReducedMotion */
}
```

Better minimal target (copy AUDIT pattern verbatim):

```css
/* minimal target — keep opacity/color, drop movement */
@media (prefers-reduced-motion: reduce) {
  .shimmer::after { display: none; }
  .pill-bob,
  .illustration-float-1, .illustration-float-2, .illustration-float-3, .illustration-float-4,
  .illustration-dash, .illustration-dash-2,
  .mesh-gradient, .shader-blob {
    animation: none !important;
  }
  /* Do NOT globally kill transitions — let per-component useReducedMotion handle it */
  /* If a global fallback is desired, only kill transform-related transitions */
  * {
    scroll-behavior: auto !important;
  }
}
```

And in JS, gate movement via `useReducedMotion()` (already done in `motion.tsx` and `page.tsx`) — ensure `Dialog` overlay fade is *kept* under reduced motion (opacity only, no zoom/slide).

## Repo conventions to follow

- Per-component branching via `useReducedMotion()` is the repo's correct pattern — exemplar `src/components/motion.tsx:17` and `src/app/page.tsx:97`:
  ```tsx
  const reduce = useReducedMotion();
  initial={reduce ? false : { opacity: 0, y }}
  ```
  Follow this, don't add a new hook.
- `about-illustration.tsx` already correctly disables `animation` but restores `stroke-dashoffset: 0` so content remains visible — imitate that (disable motion but ensure end state is visible).
- Keep `.pill-bob { animation: none !important; }` and `@media (hover: none)` block at `globals.css:112-114` — don't touch it.

## Steps

1. **Read** `src/app/globals.css:107-114` and `src/components/motion.tsx:17-28`, `src/app/page.tsx:97-110` to confirm existing `useReducedMotion` usage.
2. **Edit `src/app/globals.css`**: Replace the global nuke block:
   ```css
   @media (prefers-reduced-motion: reduce) {
     .shimmer::after { display: none; }
     .pill-bob { animation: none !important; }
     * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
   }
   ```
   With a targeted version that **does not** kill `transition-duration` globally:
   ```css
   @media (prefers-reduced-motion: reduce) {
     .shimmer::after { display: none; }
     .pill-bob { animation: none !important; }
     .illustration-float-1, .illustration-float-2, .illustration-float-3, .illustration-float-4,
     .illustration-dash, .illustration-dash-2 { animation: none !important; }
     /* Keep opacity/color transitions for comprehension; just ensure no infinite motion */
     * {
       scroll-behavior: auto !important;
     }
     /* Optional: limit animation to 1 iteration so one-shot fades still run briefly */
     *, *::before, *::after {
       animation-duration: 0.01ms !important;
       animation-iteration-count: 1 !important;
     }
     /* Do NOT set transition-duration globally — rely on useReducedMotion per component */
   }
   ```
   If you keep `animation-duration`, ensure `illustration-line-*` still has `stroke-dashoffset: 0` fallback (add if not global):
   ```css
   .illustration-line-1, .illustration-line-2, .illustration-line-3, .illustration-line-4, .illustration-line-5 { stroke-dashoffset: 0 !important; }
   ```
3. **Verify `Dialog` under reduced motion**: In `src/components/ui/dialog.tsx`, ensure overlay fade is not killed. With the new CSS, `data-[state=open]:fade-in-0` uses `opacity` animation — it will still be allowed to run as a 0.01ms fade (effectively instant but comprehension preserved). If you removed `transition-duration` nuke, the 200ms opacity transition will remain but be perceived as instant; alternatively, add explicit reduced-motion handling in `DialogContent` to keep `fade` but drop `zoom`/`slide`:
   ```tsx
   // optional enhancement in dialog.tsx — keep fade, drop zoom/slide under reduced motion
   // via CSS: @media (prefers-reduced-motion: reduce) { [data-state] { --tw-enter-scale: 1; --tw-enter-translate-x: 0; } }
   ```
   Only add this if the global fix alone doesn't preserve comprehension.
4. **Do not touch** `@media (hover: none)` block or grain/mesh styles.
5. **Build check**: Ensure no `!important` cascade breaks `print` styles.

## Boundaries

- Do NOT remove `useReducedMotion` branching in `motion.tsx`/`page.tsx`/`shader-bg.tsx` — that code is correct.
- Do NOT add new JS dependencies or change `Motion` imports.
- Do NOT globally re-enable all motion — only preserve `opacity`/`color`/`background-color` comprehension aids.
- Do NOT modify `about-illustration.tsx` — its local reduced-motion block is exemplar.
- If drift since `292bb9c` shows `globals.css` no longer has the `*` rule, mark plan DONE and report.

## Verification

- **Mechanical**: `npm run build` passes; `npm run lint` passes.
- **Feel check**:
  1. In Chrome DevTools → Rendering panel → Emulate `prefers-reduced-motion: reduce`.
  2. Reload page, scroll: `Reveal` entrances should be instant or opacity-only (no `translateY` slide). Confirm no drift.
  3. Press `⌘J`: command palette should open instantly with fade only (if kept) or instant — but not with zoom/slide movement.
  4. Hover skill pills and project cards: no `translateY` lift, but `hover:bg-*` color change (if any) should still transition.
  5. Check `AboutIllustration` SVG: code lines should be fully drawn (`stroke-dashoffset: 0`), no draw animation, cursor not blinking, floats static.
  6. Toggle back to `no-preference`: all motion returns normally.
  7. In DevTools Animations panel, confirm no infinite `pill-bob` or `floatA` keyframes fire under reduced.
- **Done when**: Reduced motion drops all `transform`/`translate`/`scale` movement but preserves `opacity` comprehension fades; no global `* { transition-duration: 0.01ms !important }` remains; build passes.
