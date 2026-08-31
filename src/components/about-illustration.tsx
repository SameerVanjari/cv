"use client";

export function AboutIllustration() {
  return (
    <div
      aria-hidden
      className="relative mt-6 overflow-hidden rounded-xl border border-zinc-200/60 bg-zinc-50/70 dark:border-zinc-800 dark:bg-zinc-800/30"
    >
      {/* subtle grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035] dark:opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      />
      {/* teal glow */}
      <div className="pointer-events-none absolute -top-8 -right-8 h-32 w-32 rounded-full bg-teal-500/10 blur-2xl dark:bg-teal-500/15" />
      <div className="pointer-events-none absolute -bottom-6 -left-6 h-24 w-24 rounded-full bg-indigo-500/10 blur-2xl dark:bg-indigo-500/10" />

      <svg
        viewBox="0 0 400 132"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative h-[132px] w-full"
        role="img"
      >
        {/* Laptop base */}
        <g className="illustration-laptop">
          {/* screen */}
          <rect x="118" y="18" width="164" height="78" rx="9" className="fill-white dark:fill-zinc-900 stroke-zinc-200 dark:stroke-zinc-700" strokeWidth="1.2" />
          {/* screen inner */}
          <rect x="126" y="26" width="148" height="62" rx="6" className="fill-zinc-50 dark:fill-zinc-800/60 stroke-zinc-200/70 dark:stroke-zinc-700/60" strokeWidth="1" />
          {/* window dots */}
          <circle cx="138" cy="34" r="2.2" className="fill-zinc-200 dark:fill-zinc-600" />
          <circle cx="145.5" cy="34" r="2.2" className="fill-zinc-200 dark:fill-zinc-600" />
          <circle cx="153" cy="34" r="2.2" className="fill-teal-500/80" />

          {/* code lines — animated draw */}
          <g className="stroke-zinc-300 dark:stroke-zinc-600" strokeWidth="1.6" strokeLinecap="round">
            <path d="M138 48 H208" className="illustration-line-1" />
            <path d="M138 55.5 H225" className="illustration-line-2" />
            <path d="M138 63 H192" className="illustration-line-3" />
            <path d="M138 70.5 H218" className="illustration-line-4" />
            <path d="M138 78 H202" className="illustration-line-5" />
          </g>
          {/* cursor blink */}
          <rect x="204" y="75.5" width="2" height="5" rx="0.7" className="fill-teal-500 illustration-cursor" />

          {/* laptop base */}
          <path d="M108 96 H292 L286 104 H114 Z" className="fill-zinc-900 dark:fill-zinc-100 stroke-zinc-900 dark:stroke-zinc-100" strokeWidth="1" />
          <rect x="174" y="101" width="52" height="2.2" rx="1.1" className="fill-white/40 dark:fill-zinc-900/40" />
        </g>

        {/* floating brackets left — code */}
        <g className="illustration-float-1">
          <rect x="42" y="28" width="38" height="38" rx="8" className="fill-white dark:fill-zinc-800 stroke-zinc-200 dark:stroke-zinc-700" strokeWidth="1.1" />
          <text x="61" y="52" textAnchor="middle" fontSize="13" fontFamily="var(--font-mono)" className="fill-zinc-700 dark:fill-zinc-300 font-medium">
            {"</>"}
          </text>
        </g>

        {/* floating layers right */}
        <g className="illustration-float-2">
          <rect x="320" y="22" width="38" height="38" rx="8" className="fill-white dark:fill-zinc-800 stroke-zinc-200 dark:stroke-zinc-700" strokeWidth="1.1" />
          <g transform="translate(334 34)" className="stroke-zinc-700 dark:stroke-zinc-300" strokeWidth="1.3" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <rect x="0" y="6" width="10" height="7" rx="1.2" />
            <rect x="2" y="3" width="10" height="7" rx="1.2" />
            <rect x="4" y="0" width="10" height="7" rx="1.2" className="fill-teal-500/10 stroke-teal-500" />
          </g>
        </g>

        {/* floating spark bottom */}
        <g className="illustration-float-3">
          <rect x="38" y="88" width="32" height="32" rx="8" className="fill-teal-500 dark:fill-teal-500" />
          <path d="M54 98 L54 106 M50 102 H58" className="stroke-white" strokeWidth="1.6" strokeLinecap="round" />
          <circle cx="54" cy="104" r="1" className="fill-white" />
        </g>

        {/* floating grid/spark right bottom */}
        <g className="illustration-float-4">
          <rect x="328" y="88" width="32" height="32" rx="8" className="fill-white dark:fill-zinc-800 stroke-zinc-200 dark:stroke-zinc-700" strokeWidth="1.1" />
          <g transform="translate(336 96)" className="stroke-zinc-400 dark:stroke-zinc-500" strokeWidth="1.1">
            <rect x="1" y="1" width="5" height="5" rx="1" className="fill-zinc-900 dark:fill-zinc-200 stroke-zinc-900 dark:stroke-zinc-200" />
            <rect x="8.5" y="1" width="5" height="5" rx="1" />
            <rect x="1" y="8.5" width="5" height="5" rx="1" />
            <rect x="8.5" y="8.5" width="5" height="5" rx="1" />
          </g>
        </g>

        {/* connecting dashed lines */}
        <path d="M80 47 L108 58" className="stroke-zinc-200 dark:stroke-zinc-700 illustration-dash" strokeWidth="1" strokeDasharray="3 4" strokeLinecap="round" />
        <path d="M284 40 L318 42" className="stroke-zinc-200 dark:stroke-zinc-700 illustration-dash" strokeWidth="1" strokeDasharray="3 4" strokeLinecap="round" />
        <path d="M70 88 L108 92" className="stroke-zinc-200 dark:stroke-zinc-700 illustration-dash-2" strokeWidth="1" strokeDasharray="3 4" strokeLinecap="round" />
        <path d="M292 96 L326 104" className="stroke-zinc-200 dark:stroke-zinc-700 illustration-dash-2" strokeWidth="1" strokeDasharray="3 4" strokeLinecap="round" />
      </svg>

      {/* caption */}
      <div className="pointer-events-none flex items-center justify-between border-t border-zinc-200/60 bg-white/60 px-3 py-2 backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/50">
        <span className="font-mono text-[10px] tracking-[0.12em] text-zinc-500 dark:text-zinc-400">SYSTEM · DESIGN → CODE</span>
        <span className="flex items-center gap-1.5 font-mono text-[10px] text-zinc-400 dark:text-zinc-500">
          <span className="size-1 rounded-full bg-emerald-500 animate-pulse" /> live preview
        </span>
      </div>

      <style>{`
        .illustration-line-1, .illustration-line-2, .illustration-line-3, .illustration-line-4, .illustration-line-5 {
          stroke-dasharray: 120;
          stroke-dashoffset: 120;
          animation: drawLine 0.52s var(--ease-emphasized) forwards;
        }
        .illustration-line-2 { animation-delay: 0.06s; }
        .illustration-line-3 { animation-delay: 0.12s; }
        .illustration-line-4 { animation-delay: 0.18s; }
        .illustration-line-5 { animation-delay: 0.24s; }
        @keyframes drawLine { to { stroke-dashoffset: 0; } }

        .illustration-cursor { animation: cursorBlink 0.85s steps(1) infinite; }
        @keyframes cursorBlink { 0%, 49% { opacity: 1; } 50%, 100% { opacity: 0; } }

        .illustration-float-1 { animation: floatA 2.6s ease-in-out infinite alternate; }
        .illustration-float-2 { animation: floatB 2.9s ease-in-out infinite alternate; animation-delay: 0.35s; }
        .illustration-float-3 { animation: floatA 2.4s ease-in-out infinite alternate; animation-delay: 0.18s; }
        .illustration-float-4 { animation: floatB 2.5s ease-in-out infinite alternate; animation-delay: 0.55s; }
        @keyframes floatA { from { transform: translateY(-2.5px); } to { transform: translateY(3px); } }
        @keyframes floatB { from { transform: translateY(2.5px); } to { transform: translateY(-3px); } }

        .illustration-dash { animation: dashMove 5.5s linear infinite; }
        .illustration-dash-2 { animation: dashMove 6.5s linear infinite reverse; }
        @keyframes dashMove { to { stroke-dashoffset: -40; } }

        @media (prefers-reduced-motion: reduce) {
          .illustration-line-1, .illustration-line-2, .illustration-line-3, .illustration-line-4, .illustration-line-5,
          .illustration-float-1, .illustration-float-2, .illustration-float-3, .illustration-float-4,
          .illustration-cursor, .illustration-dash, .illustration-dash-2 { animation: none !important; }
          .illustration-line-1, .illustration-line-2, .illustration-line-3, .illustration-line-4, .illustration-line-5 { stroke-dashoffset: 0 !important; }
        }
      `}</style>
    </div>
  );
}
