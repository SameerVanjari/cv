# 001 — Remove animation from keyboard-triggered command palette

- **Status**: DONE
- **Commit**: 292bb9c
- **Severity**: HIGH
- **Category**: Purpose & frequency
- **Estimated scope**: 2 files, ~10 lines

## Problem

The command palette is opened via keyboard (`⌘J` / `Ctrl+J`) and can be toggled 100+ times/day. Per AUDIT §1, high-frequency keyboard actions must have **no animation**. Currently it animates on every open/close through `DialogContent`/`DialogOverlay`.

Evidence:

```tsx
// src/components/ui/dialog.tsx:21-28 — current
<DialogPrimitive.Overlay
  ref={ref}
  className={cn(
    "fixed inset-0 z-50 bg-black/20 data-[state=open]:animate-in  data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 print:hidden",
    className,
  )}
/>
```

```tsx
// src/components/ui/dialog.tsx:38-43 — current
<DialogPrimitive.Content
  ref={ref}
  className={cn(
    "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] print:hidden sm:rounded-lg",
    className,
  )}
>
```

```tsx
// src/components/ui/command.tsx:29-38 — current
const CommandDialog = ({ children, ...props }: CommandDialogProps) => {
  return (
    <Dialog {...props}>
      <DialogContent className="overflow-hidden p-0 shadow-lg">
        <Command className="...">
          {children}
        </Command>
      </DialogContent>
    </Dialog>
  );
};
```

```tsx
// src/components/command-menu.tsx:24-33 — trigger (keyboard, high frequency)
React.useEffect(() => {
  const down = (e: KeyboardEvent) => {
    if (e.key === "j" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      setOpen((open) => !open);
    }
  };
  document.addEventListener("keydown", down);
  return () => document.removeEventListener("keydown", down);
}, []);
```

The `duration-200` + `zoom-in-95`/`slide-in` combo makes every toggle feel sluggish on the exact action the user repeats most. Raycast and other command palettes use **zero** open/close animation for this reason.

## Target

Command palette opens/closes instantly with no motion. Non-command dialogs (if any) keep their current 200ms fade/zoom. Achieve by making `CommandDialog` opt-out of animation, not by globally removing dialog animation.

Target state:

```tsx
// src/components/ui/dialog.tsx — add opt-out prop (target)
// DialogContent accepts `disableAnimation?: boolean` — when true, no data-state animation classes
<DialogPrimitive.Content
  className={cn(
    "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg print:hidden sm:rounded-lg",
    !disableAnimation && "duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]",
    className,
  )}
/>
```

```tsx
// src/components/ui/command.tsx — target
<DialogContent disableAnimation className="overflow-hidden p-0 shadow-lg">
```

Overlay for command palette should also be instant: `DialogOverlay` with `disableAnimation` or rendered without `animate-in/out`.

Alternative acceptable target: keep `DialogContent` unchanged and override in `CommandDialog` via `className="duration-0 data-[state=open]:animate-none data-[state=closed]:animate-none"` — but prop approach is cleaner and respects repo conventions.

## Repo conventions to follow

- `cn()` utility from `@/lib/utils` for conditional classes — exemplar `src/components/ui/dialog.tsx:23` already uses it.
- `forwardRef` pattern for primitives — keep it.
- `motion` usage gates with `useReducedMotion` — not needed here; this is CSS-only.
- No new dependencies.

## Steps

1. **Read** `src/components/ui/dialog.tsx` and `src/components/ui/command.tsx` to confirm current signatures and that no other caller depends on animation being always-on.
2. **Edit `src/components/ui/dialog.tsx` — DialogOverlay**: Add optional `disableAnimation` prop to `DialogOverlay` (extend `ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>` with `disableAnimation?: boolean`). When `disableAnimation` is true, omit `data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0` and `duration-*` classes. Default `false` to preserve existing behavior for non-command dialogs.
3. **Edit `src/components/ui/dialog.tsx` — DialogContent**: Add `disableAnimation?: boolean` to `DialogContent` props (extend `ComponentPropsWithoutRef<typeof DialogPrimitive.Content>`). Move the entire animation tail (`duration-200 data-[state=open]:animate-in ... slide-in-from-top-[48%]`) into a conditional string included only when `!disableAnimation`. When disabled, base classes remain: `fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg print:hidden sm:rounded-lg`. Ensure `cn()` merges correctly.
4. **Edit `src/components/ui/command.tsx` — CommandDialog**: Pass `disableAnimation` to `DialogContent`. If you added it to `DialogOverlay`, also ensure overlay inside `DialogContent` portal respects it — either thread the prop through or render a custom `DialogOverlay` instance with `disableAnimation` inside `CommandDialog`. Simplest: change `CommandDialog` to render `<Dialog {...props}><DialogOverlay disableAnimation /><DialogPrimitive.Content disableAnimation ...>` or just `<DialogContent disableAnimation>`. Verify `DialogContent` renders its own `DialogOverlay` — if it does, you must update `DialogContent` to forward `disableAnimation` to its internal `DialogOverlay`.
5. **Verify** no other `DialogContent` call sites break: `grep -r "DialogContent" src/` — only `command.tsx` should use `disableAnimation`. Others keep animated behavior.

## Boundaries

- Do NOT change `src/components/command-menu.tsx` trigger logic or `cmdk` internals.
- Do NOT remove animation globally for all dialogs — only the command palette (keyboard path).
- Do NOT change markup/structure beyond adding the boolean prop and conditional classes.
- Do NOT add new dependencies or alter `tailwind.config.js`.
- If the file has drifted since `292bb9c` (e.g., DialogContent no longer renders Overlay internally), STOP and report instead of improvising.

## Verification

- **Mechanical**: `npm run lint` (or `bun run lint`) passes; `npm run build` succeeds; no TypeScript errors on `DialogContent` prop.
- **Feel check**: Run `npm run dev`, press `⌘J` (or `Ctrl+J`) repeatedly 10+ times rapidly.
  - Confirm: palette appears/disappears instantly with no fade/zoom/slide. No perceptible delay between keypress and content visibility.
  - Spam toggle mid-animation (if any residual) — no restart-from-zero glitch.
  - Open palette, then click overlay — should also close instantly.
  - Test non-command dialog (if any exists) still animates with 200ms fade/zoom — ensure you didn't globally disable.
  - In DevTools Animations panel, confirm zero `animate-in` keyframes fire for CommandDialog.
- **Done when**: `CommandDialog` open/close is instant; other dialogs retain 200ms animation; typecheck passes.
