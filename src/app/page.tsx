"use client";
import { RESUME_DATA } from "@/data/resume-data";
import { ShaderBg } from "@/components/shader-bg";
import { motion, useReducedMotion } from "motion/react";
import highlights from "../../projects-highlights.json";
import {
  ArrowUpRight,
  GlobeIcon,
  MailIcon,
  PhoneIcon,
  Code2,
  Layers,
  Zap,
  Github,
  ExternalLink,
  Gamepad2,
  Building2,
  Box,
  Copy,
  Star,
} from "lucide-react";
import { GitHubIcon, LinkedInIcon, XIcon } from "@/components/icons";
import { AboutIllustration } from "@/components/about-illustration";
import { useState, useRef, useEffect } from "react";

const CURATED_IDS = [
  "tuscani-villa",
  "chess-game",
  "zitics-com",
  "3d-restaurant-menus",
  "21-global-replica",
  "nobel-portfolio-redesign",
  "3d-visualization-portfolio",
] as const;

const CURATED = highlights.projects
  .filter((p) => (CURATED_IDS as readonly string[]).includes(p.id))
  .sort((a, b) => CURATED_IDS.indexOf(a.id as any) - CURATED_IDS.indexOf(b.id as any));

const EXPERIENCE = [
  {
    company: "Zitics Pvt Ltd",
    link: "https://zitics.com/",
    role: "Senior Frontend Developer",
    meta: ["On-site", "Pune, India"],
    period: "Jul 2024 — Present",
    bullets: [
      "Built reusable component library adopted platform-wide → faster shipping, consistent UI.",
      "Led AI-features frontend (React + TypeScript) wired to intelligent backend workflows.",
      "Optimized REST integration & client data-flow — snappier loads, fewer waterfalls.",
      "Shipped marketing site end-to-end (SVG line animations, lead & career flows) → more inbound.",
      "Mentored 3 juniors on patterns, reviews, and component API design.",
      "Architected micro-frontend with Module Federation — independent feature deploys.",
    ],
    stack: ["React", "TypeScript", "Next.js", "Module Federation", "Tailwind"],
  },
  {
    company: "CXR.Agency",
    link: "https://cxr.agency",
    role: "Frontend Developer",
    meta: ["Remote"],
    period: "Apr 2023 — Jun 2024",
    bullets: [
      "Shipped Figma-faithful, responsive UIs for eCommerce, gaming & enterprise clients.",
      "Created shared React kit → cut duplication, accelerated cross-project delivery.",
      "Hit 90+ Lighthouse via Core Web Vitals tuning, code-splitting & WCAG compliance.",
      "Agile, reviews, CI/CD — consistent on-time delivery.",
    ],
    stack: ["React", "Next.js", "Figma Systems", "Lighthouse 90+", "WCAG"],
  },
  {
    company: "Cemtrex Labs",
    link: "https://cemtrexlabs.com",
    role: "Frontend Developer",
    meta: ["On-site", "Amravati, India"],
    period: "Apr 2022 — Mar 2023",
    bullets: [
      "Built SSR/SSG dashboards & admin panels (React + Next.js) for enterprise clients.",
      "Shipped performant landing pages with modern CSS and performance-first patterns.",
      "Grew full-stack chops: Next App Router + AdonisJS APIs & data modeling.",
    ],
    stack: ["Next.js", "SSR/SSG", "AdonisJS", "CSS"],
  },
];

function Reveal({
  children,
  delay = 0,
  y = 14,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.22 }}
      transition={
        reduce ? { duration: 0.2, delay } : { type: "spring", bounce: 0, duration: 0.55, delay }
      }
    >
      {children}
    </motion.div>
  );
}

function SpringCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      whileHover={reduce ? undefined : { y: -3 }}
      whileTap={reduce ? undefined : { scale: 0.985 }}
      transition={{ type: "spring", bounce: 0, duration: 0.35 }}
    >
      {children}
    </motion.div>
  );
}

function DraggablePill({
  children,
  className,
  bobDelay = 0,
  rotate = 0,
  constraintsRef,
  zIndex = 10,
  bobClass = "",
}: {
  children: React.ReactNode;
  className: string;
  bobDelay?: number;
  rotate?: number;
  constraintsRef: React.RefObject<HTMLDivElement>;
  zIndex?: number;
  bobClass?: string;
}) {
  const reduce = useReducedMotion();
  const [isDragging, setIsDragging] = useState(false);
  const [isCoarse, setIsCoarse] = useState(false);
  useEffect(() => {
    const m = window.matchMedia("(hover: none), (pointer: coarse)");
    const update = () => setIsCoarse(m.matches);
    update();
    m.addEventListener("change", update);
    return () => m.removeEventListener("change", update);
  }, []);
  const disableMotion = reduce || isCoarse;
  if (disableMotion) {
    return (
      <div className={className} style={rotate ? ({ "--pill-rotate": `${rotate}deg`, rotate: `${rotate}deg` } as React.CSSProperties) : undefined}>
        {children}
      </div>
    );
  }
  return (
    <motion.div
      className={`${className} ${!isDragging ? `pill-bob ${bobClass}` : "pill-dragging"} cursor-grab active:cursor-grabbing select-none touch-manipulation transition-[transform] duration-160 ease-out hover:scale-[1.02] active:scale-[0.97]`}
      style={
        {
          "--pill-rotate": `${rotate}deg`,
          zIndex: isDragging ? 50 : zIndex,
          willChange: isDragging ? "transform" : undefined,
        } as React.CSSProperties
      }
      drag
      dragMomentum={false}
      dragElastic={0.32}
      dragConstraints={constraintsRef}
      dragTransition={{ power: 0.22, timeConstant: 240 }}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={() => setIsDragging(false)}
    >
      {children}
    </motion.div>
  );
}

export default function Page() {
  const reduce = useReducedMotion();
  const heroRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const copyEmail = async () => {
    await navigator.clipboard.writeText(RESUME_DATA.contact.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };

  return (
    <main className="relative min-h-screen overflow-clip bg-[#fcfcf9] dark:bg-zinc-950 selection:bg-teal-500 selection:text-white">
      {/* NAV — minimalist, matches page bg, translucent */}
      <header className="sticky top-0 z-40 border-b border-zinc-200/70 bg-[#fcfcf9]/75 backdrop-blur-xl supports-[backdrop-filter]:bg-[#fcfcf9]/70 dark:border-zinc-800 dark:bg-zinc-950/70 dark:supports-[backdrop-filter]:bg-zinc-950/60">
        <div className="mx-auto flex h-[64px] max-w-[1200px] items-center justify-between px-4 md:px-8">
          <a href="#" className="flex items-center gap-3">
            <span className="flex size-8 items-center justify-center rounded-full bg-zinc-900 text-[12.5px] font-bold tracking-tight text-white dark:bg-white dark:text-zinc-900">
              SV
            </span>
            <span className="font-mono text-[11px] font-medium tracking-[0.14em] text-zinc-600 dark:text-zinc-400">
              SAMEER VANJARI — 2026
            </span>
          </a>
          <nav className="hidden items-center gap-5 md:flex">
            <a href="#work" className="font-mono text-xs tracking-wide text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors">Work</a>
            <a href="#projects" className="font-mono text-xs tracking-wide text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors">Projects</a>
            <a href="#skills" className="font-mono text-xs tracking-wide text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors">Skills</a>
            <span className="h-4 w-px bg-zinc-200 dark:bg-zinc-800" />
            <motion.a
              href={`mailto:${RESUME_DATA.contact.email}`}
              whileTap={reduce ? undefined : { scale: 0.97 }}
              transition={{ duration: 0.1 }}
              className="inline-flex items-center gap-1.5 rounded-full bg-zinc-900 px-4 py-2 font-mono text-xs font-medium text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
            >
              <MailIcon className="size-3.5" /> Contact
            </motion.a>
          </nav>
          <a href={`mailto:${RESUME_DATA.contact.email}`} className="inline-flex size-8 items-center justify-center rounded-full bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 md:hidden">
            <MailIcon className="size-4" />
          </a>
        </div>
      </header>

      {/* HERO */}
      <section className="relative">
        <ShaderBg />
        <div className="relative mx-auto grid max-w-[1200px] gap-10 px-4 py-10 md:grid-cols-[1.18fr_0.82fr] md:items-center md:px-8 md:py-16 lg:py-[72px]">
          <div className="min-w-0">
            <Reveal>
              <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/20 bg-teal-500/10 px-3 py-1 backdrop-blur">
                <span className="size-1.5 animate-pulse rounded-full bg-teal-500" />
                <span className="font-mono text-[11px] font-semibold tracking-[0.14em] text-teal-700 dark:text-teal-300">AVAILABLE FOR REMOTE — VISA SPONSORSHIP OPEN</span>
              </div>
            </Reveal>
            <Reveal delay={0.06}>
              <h1 className="mt-6 font-[var(--font-display)] text-[36px] font-bold leading-[0.92] tracking-[-0.045em] text-zinc-900 dark:text-white md:text-[52px] lg:text-[60px]" style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.045em", lineHeight: 0.92 }}>
                Senior Frontend
                <br />
                <span className="bg-gradient-to-r from-teal-600 via-indigo-600 to-sky-600 bg-clip-text text-transparent dark:from-teal-300 dark:via-indigo-300 dark:to-sky-300">Engineer</span> crafting
                <br />
                fast, <span className="font-light italic tracking-tight" style={{ letterSpacing: "-0.03em" }}>resilient</span>
                <br />
                web experiences.
              </h1>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mt-5 max-w-[46ch] text-pretty text-[15px] leading-[1.7] text-zinc-600 dark:text-zinc-400" style={{ lineHeight: 1.7 }}>
                4+ years shipping React & Next.js at scale. Reusable systems, AI-powered features, and 90+ Lighthouse — built for teams that move fast without breaking.
              </p>
            </Reveal>
            <Reveal delay={0.16}>
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <motion.a href="#projects" whileTap={reduce ? undefined : { scale: 0.97 }} transition={{ type: "spring", bounce: 0, duration: 0.3 }} className="group inline-flex items-center gap-2 rounded-full bg-zinc-900 px-6 py-3 text-sm font-medium text-white shadow-[0_10px_28px_rgba(0,0,0,0.14)] hover:bg-black dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100" style={{ willChange: "transform" }}>
                  View selected work
                  <span className="flex size-6 items-center justify-center rounded-full bg-white text-zinc-900 transition-transform group-hover:rotate-45 dark:bg-zinc-900 dark:text-white"><ArrowUpRight className="size-3.5" /></span>
                </motion.a>
                <motion.button onClick={copyEmail} whileTap={reduce ? undefined : { scale: 0.97 }} transition={{ duration: 0.1 }} className="inline-flex items-center gap-2 rounded-full border border-zinc-900/10 bg-white px-5 py-3 text-sm font-medium text-zinc-900 hover:bg-zinc-50 dark:border-white/10 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800" style={{ willChange: "transform" }}>
                  <Copy className="size-4 opacity-60" />{copied ? "Copied!" : "Copy email"}
                </motion.button>
                <span className="hidden items-center gap-1.5 font-mono text-xs text-zinc-500 md:inline-flex"><span className="size-1 rounded-full bg-emerald-500" /> ssv6132@gmail.com · response &lt; 24h</span>
              </div>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="mt-10 grid grid-cols-3 gap-6 border-t border-zinc-200/60 pt-6 dark:border-zinc-800">
                {[
                  { k: "4+", v: "Years shipping" },
                  { k: "90+", v: "Lighthouse" },
                  { k: "8", v: "Featured builds" },
                ].map((s) => (
                  <div key={s.k}><div className="font-[var(--font-display)] text-2xl font-bold tracking-tight text-zinc-900 dark:text-white" style={{ letterSpacing: "-0.03em" }}>{s.k}</div><div className="font-mono text-[11px] tracking-wide text-zinc-500">{s.v}</div></div>
                ))}
              </div>
            </Reveal>
            <Reveal delay={0.24}>
              <div className="mt-6 flex flex-wrap items-center gap-2 font-mono text-xs text-zinc-500"><span className="inline-flex items-center gap-1.5"><GlobeIcon className="size-3" /> Pune, India — Remote worldwide</span><span className="hidden h-3 w-px bg-zinc-200 dark:bg-zinc-800 md:block" /><span className="hidden md:inline">Micro-frontends · Module Federation · SSR/SSG/ISR</span></div>
            </Reveal>
          </div>

          <Reveal delay={0.08}>
            <div ref={heroRef} className="relative mx-auto max-w-[420px]">
              <div aria-hidden className="absolute -inset-6 -z-10 rounded-[2.2rem] bg-gradient-to-br from-teal-500/20 via-indigo-500/15 to-sky-500/20 blur-2xl" />
              <motion.div initial={reduce ? { opacity: 0 } : { opacity: 0, y: 10, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={reduce ? { duration: 0.2 } : { type: "spring", bounce: 0, duration: 0.6 }} className="relative overflow-hidden rounded-[2rem] border border-zinc-200 bg-white p-3 shadow-[0_24px_64px_rgba(0,0,0,0.10)] dark:border-zinc-800 dark:bg-zinc-900">
                <div className="relative aspect-[4/3.4] overflow-hidden rounded-[1.4rem] bg-zinc-100 dark:bg-zinc-800">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img alt={RESUME_DATA.name} src={RESUME_DATA.avatarUrl} className="h-full w-full object-cover object-[50%_18%]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/0 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                    <div className="rounded-full bg-white/90 px-3 py-1.5 backdrop-blur font-mono text-[11px] font-semibold text-zinc-900 dark:bg-zinc-900/90 dark:text-white">● Open to new roles</div>
                    <div className="flex gap-1.5">
                      {RESUME_DATA.contact.social.map((s) => (
                        <a key={s.name} href={s.url} target="_blank" className="flex size-8 items-center justify-center rounded-full bg-white/90 text-zinc-900 backdrop-blur hover:scale-105 transition-transform dark:bg-zinc-900/90 dark:text-white"><s.icon className="size-4" /></a>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 p-3">
                  <DraggablePill constraintsRef={heroRef} bobDelay={0.4} bobClass="pill-bob-delay-2" rotate={0} className="rounded-2xl border border-zinc-200 bg-white p-3 shadow-[0_2px_12px_rgba(0,0,0,0.06)] dark:border-zinc-700 dark:bg-zinc-800">
                    <div className="flex items-center gap-1.5 font-mono text-[10px] tracking-[0.14em] text-zinc-500 dark:text-zinc-400"><Code2 className="size-3 text-zinc-400 dark:text-zinc-500" /> STACK FOCUS</div>
                    <div className="mt-1.5 text-sm font-semibold leading-none text-zinc-900 dark:text-white">React · Next.js · TS</div>
                    <div className="mt-1 font-mono text-[11px] text-zinc-500 dark:text-zinc-400">Three.js / WebGL / GLSL</div>
                  </DraggablePill>
                  <DraggablePill constraintsRef={heroRef} bobDelay={0.9} bobClass="pill-bob-delay-3" rotate={0} className="rounded-2xl border border-zinc-900 bg-zinc-900 p-3 text-white shadow-[0_4px_16px_rgba(0,0,0,0.16)] dark:border-white dark:bg-white dark:text-zinc-900 dark:shadow-[0_4px_16px_rgba(0,0,0,0.28)]">
                    <div className="flex items-center gap-1.5 font-mono text-[10px] tracking-[0.14em] text-zinc-400 dark:text-zinc-500"><Zap className="size-3" /> PERFORMANCE</div>
                    <div className="mt-1.5 text-sm font-semibold leading-none text-white dark:text-zinc-900">90+ Lighthouse</div>
                    <div className="mt-1 font-mono text-[11px] text-zinc-400 dark:text-zinc-500">Core Web Vitals tuned</div>
                  </DraggablePill>
                </div>
              </motion.div>
              <DraggablePill constraintsRef={heroRef} bobDelay={0} bobClass="" rotate={-1.8} className="absolute -left-3 top-6 hidden items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-2 shadow-[0_8px_24px_rgba(0,0,0,0.12)] md:inline-flex dark:border-zinc-800 dark:bg-zinc-900">
                <span className="size-2 rounded-full bg-emerald-500" /><span className="font-mono text-xs font-semibold tracking-wide text-zinc-900 dark:text-white">React Three Fiber</span>
              </DraggablePill>
              <DraggablePill constraintsRef={heroRef} bobDelay={1.1} bobClass="pill-bob-delay-1" rotate={2.4} className="absolute -right-2 bottom-28 hidden items-center gap-2 rounded-full border border-teal-500/20 bg-teal-600 px-3 py-2 text-white shadow-[0_8px_24px_rgba(20,184,166,0.28)] md:inline-flex dark:border-teal-500/30 dark:bg-teal-500 dark:text-white">
                <Layers className="size-3.5" /><span className="font-mono text-xs font-medium">Module Federation</span>
              </DraggablePill>
            </div>
          </Reveal>
        </div>
      </section>

      {/* TIMELINE — clean, no accent top line */}
      <section id="work" className="mx-auto max-w-[1200px] px-4 py-10 md:px-8 md:py-14">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="font-[var(--font-display)] text-[28px] font-bold leading-none tracking-tight text-zinc-900 dark:text-white md:text-[34px]" style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.04em", lineHeight: 1 }}>Experience</h2>
            <span className="font-mono text-xs tracking-wide text-zinc-500">2022 — Present · Pune & Remote · 3 roles</span>
          </div>
        </Reveal>

        <div className="relative mt-8 md:pl-10">
          {/* single continuous rail */}
          <div aria-hidden className="absolute left-[16px] top-2 hidden h-[calc(100%-16px)] w-px bg-zinc-200 dark:bg-zinc-800 md:block" />

          <div className="space-y-6">
            {EXPERIENCE.map((job, idx) => (
              <Reveal key={job.company} delay={idx * 0.07} y={12}>
                <SpringCard>
                  <div className="group relative rounded-[1.5rem] border border-zinc-200 bg-white p-5 shadow-[0_8px_32px_rgba(0,0,0,0.04)] md:p-6 dark:border-zinc-800 dark:bg-zinc-900">
                    {/* dot on rail */}
                    <span aria-hidden className="absolute left-[-34px] top-7 hidden size-[10px] rounded-full border-2 border-[#fcfcf9] bg-zinc-900 shadow-sm md:block dark:border-zinc-950 dark:bg-white" />
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <a href={job.link} target="_blank" className="font-[var(--font-display)] text-[19px] font-semibold tracking-tight text-zinc-900 hover:underline dark:text-white" style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.03em" }}>{job.company}</a>
                        <div className="mt-1 flex flex-wrap items-center gap-2">
                          <span className="font-mono text-xs font-medium text-zinc-700 dark:text-zinc-300">{job.role}</span>
                          <span className="hidden text-zinc-300 dark:text-zinc-600">·</span>
                          <span className="inline-flex gap-1.5">{job.meta.map((m) => (<span key={m} className="rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-0.5 font-mono text-[10px] font-medium tracking-wide text-zinc-600 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-300">{m}</span>))}</span>
                        </div>
                      </div>
                      <span className="shrink-0 rounded-full bg-zinc-900 px-3 py-1.5 font-mono text-[11px] font-semibold tracking-wide text-white dark:bg-white dark:text-zinc-900" style={{ letterSpacing: "0.06em" }}>{job.period}</span>
                    </div>
                    <ul className="mt-4 grid gap-1.5">
                      {job.bullets.map((b) => (
                        <li key={b} className="flex gap-2 text-pretty font-mono text-[12.5px] leading-relaxed text-zinc-600 dark:text-zinc-400"><span className="mt-[7px] size-1 shrink-0 rounded-full bg-zinc-400 dark:bg-zinc-600" /><span>{b}</span></li>
                      ))}
                    </ul>
                    <div className="mt-4 flex flex-wrap gap-1.5">{job.stack.map((t) => (<span key={t} className="rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-1 font-mono text-[10px] font-medium text-zinc-700 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-300">{t}</span>))}</div>
                  </div>
                </SpringCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* PROJECTS — fixed bento, col-span on Reveal, not inner */}
      <section id="projects" className="mx-auto max-w-[1200px] px-4 py-10 md:px-8 md:py-14">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="font-[var(--font-display)] text-[28px] font-bold leading-none tracking-tight text-zinc-900 dark:text-white md:text-[34px]" style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.04em" }}>Selected builds</h2>
              <p className="mt-2 max-w-[62ch] text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">Six highlights that map to the CV — real estate & 3D, game logic, WebXR, and pixel-perfect replicas. All live or open-source.</p>
            </div>
            <a href="https://github.com/SameerVanjari" target="_blank" className="hidden items-center gap-1.5 font-mono text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-white md:inline-flex"><Github className="size-3.5" /> github.com/SameerVanjari <ArrowUpRight className="size-3" /></a>
          </div>
        </Reveal>

        <div className="mt-7 grid gap-4 md:grid-cols-12 md:auto-rows-fr auto-rows-fr items-stretch">
          <Reveal delay={0.04} y={10} className="md:col-span-8 flex h-full">
            <SpringCard className="h-full w-full">
              <div className="group relative flex h-full min-h-[280px] flex-col overflow-hidden rounded-[1.5rem] border border-zinc-200 bg-white p-5 shadow-[0_8px_32px_rgba(0,0,0,0.04)] dark:border-zinc-800 dark:bg-zinc-900 md:p-6">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-teal-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="inline-flex items-center gap-1.5 rounded-full bg-teal-500/10 px-2.5 py-1 font-mono text-[10px] font-semibold tracking-[0.12em] text-teal-700 dark:text-teal-300"><Building2 className="size-3" /> FLAGSHIP · LIVE</div>
                <h3 className="mt-3 font-[var(--font-display)] text-[20px] font-semibold leading-tight tracking-tight text-zinc-900 dark:text-white" style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.03em" }}>{CURATED[0]?.title}</h3>
                <p className="mt-1 font-mono text-xs font-medium text-zinc-500">{CURATED[0]?.headline}</p>
                <p className="mt-3 line-clamp-3 text-pretty text-[13px] leading-relaxed text-zinc-600 dark:text-zinc-400">{CURATED[0]?.description}</p>
                <ul className="mt-3 grid gap-1">{(CURATED[0]?.features as string[] | undefined)?.slice(0, 3).map((f) => (<li key={f} className="flex gap-1.5 font-mono text-[11px] leading-relaxed text-zinc-600 dark:text-zinc-400"><span className="mt-1 size-1 rounded-full bg-teal-500" /> {f}</li>))}</ul>
                <div className="mt-auto flex flex-wrap gap-1.5 pt-4">{(CURATED[0]?.techStack as string[]).slice(0, 5).map((t) => (<span key={t} className="rounded-full bg-zinc-900 px-2.5 py-1 font-mono text-[10px] font-medium text-white dark:bg-white dark:text-zinc-900">{t}</span>))}</div>
                <div className="mt-4 flex gap-2">{CURATED[0]?.liveUrl && (<a href={CURATED[0].liveUrl as string} target="_blank" className="inline-flex items-center gap-1.5 rounded-full bg-zinc-900 px-3.5 py-1.5 text-xs font-medium text-white hover:bg-black dark:bg-white dark:text-zinc-900">Live <ExternalLink className="size-3" /></a>)}{CURATED[0]?.githubUrl && (<a href={CURATED[0]?.githubUrl as string} target="_blank" className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-3.5 py-1.5 text-xs font-medium hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-800"> <Github className="size-3.5" /> GitHub</a>)}</div>
              </div>
            </SpringCard>
          </Reveal>

          <Reveal delay={0.08} y={10} className="md:col-span-4 flex h-full">
            <SpringCard className="h-full w-full">
              <div className="flex h-full min-h-[280px] flex-col rounded-[1.5rem] border border-zinc-900 bg-zinc-900 p-6 text-white dark:border-zinc-800 dark:bg-white dark:text-zinc-900">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 font-mono text-[10px] tracking-wide dark:bg-zinc-900/10"><Gamepad2 className="size-3" /> 3D · INTERACTIVE</div>
                <h3 className="mt-3 font-[var(--font-display)] text-lg font-semibold tracking-tight" style={{ letterSpacing: "-0.03em" }}>{CURATED[1]?.title}</h3>
                <p className="mt-1 font-mono text-xs opacity-70">{CURATED[1]?.headline}</p>
                <p className="mt-3 text-sm leading-relaxed opacity-70 line-clamp-4">{CURATED[1]?.description}</p>
                <div className="mt-4 flex flex-wrap gap-1.5">{(CURATED[1]?.techStack as string[]).slice(0, 4).map((t) => (<span key={t} className="rounded-full bg-white/10 px-2 py-1 font-mono text-[10px] dark:bg-zinc-900/10">{t}</span>))}</div>
                <div className="mt-auto flex gap-2 pt-4 flex-wrap">
                  {(CURATED[1] as any)?.liveUrl && (
                    <a href={(CURATED[1] as any).liveUrl} target="_blank" className="inline-flex items-center gap-1.5 rounded-full bg-teal-500 px-3.5 py-1.5 text-xs font-medium text-white hover:bg-teal-600 dark:bg-teal-500 dark:hover:bg-teal-600">
                      Live <ExternalLink className="size-3" />
                    </a>
                  )}
                  <a href={CURATED[1]?.githubUrl as string} target="_blank" className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-xs font-medium text-zinc-900 dark:bg-zinc-900 dark:text-white"><Github className="size-3.5" /> Code</a>
                </div>
              </div>
            </SpringCard>
          </Reveal>

          {CURATED.slice(2, 5).map((p, i) => (
            <Reveal key={p.id} delay={0.1 + i * 0.05} y={10} className="md:col-span-4 flex h-full">
              <SpringCard className="h-full w-full">
                <div className="group flex h-full min-h-[280px] flex-col rounded-[1.5rem] border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
                  <div className="flex items-start justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-1 font-mono text-[10px] font-medium tracking-wide text-zinc-600 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-300">{i === 0 ? <Box className="size-3" /> : i === 1 ? <Copy className="size-3" /> : <Star className="size-3" />}{(p.category as string).split(" /")[0]}</span>
                    <span className="font-mono text-[10px] text-zinc-400">{(p.techStack as string[])[0]}</span>
                  </div>
                  <h3 className="mt-3 text-[15px] font-semibold leading-tight tracking-tight text-zinc-900 dark:text-white" style={{ letterSpacing: "-0.02em" }}>{p.title}</h3>
                  <p className="mt-1 font-mono text-[11px] leading-snug text-zinc-500 line-clamp-2 min-h-[2.2em]">{p.headline as string}</p>
                  <p className="mt-2 line-clamp-3 flex-1 font-mono text-[11px] leading-relaxed text-zinc-600 dark:text-zinc-400">{p.description as string}</p>
                  <div className="mt-3 flex flex-wrap gap-1">{(p.techStack as string[]).slice(0, 3).map((t) => (<span key={t} className="rounded-full border border-zinc-200 px-2 py-0.5 font-mono text-[10px] text-zinc-600 dark:border-zinc-800 dark:text-zinc-400">{t}</span>))}</div>
                  <div className="mt-auto flex gap-2 pt-4">
                    {(p as any).liveUrl && (<a href={(p as any).liveUrl} target="_blank" className="inline-flex items-center gap-1 rounded-full bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white dark:bg-white dark:text-zinc-900">Live <ExternalLink className="size-3" /></a>)}
                    {p.githubUrl && (<a href={p.githubUrl as string} target="_blank" className="inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-medium hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"><Github className="size-3" /> GitHub</a>)}
                  </div>
                </div>
              </SpringCard>
            </Reveal>
          ))}

          {/* bottom row — handles 6 or 7 curated */}
          {CURATED.length === 7 ? (
            <>
              {CURATED.slice(5, 7).map((p, i) => (
                <Reveal key={p.id} delay={0.26 + i * 0.05} y={10} className="md:col-span-4 flex h-full">
                  <SpringCard className="h-full w-full">
                    <div className="group flex h-full min-h-[280px] flex-col rounded-[1.5rem] border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
                      <div className="flex items-start justify-between gap-2">
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-1 font-mono text-[10px] font-medium tracking-wide text-zinc-600 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-300"><Star className="size-3" />{(p.category as string).split(" /")[0]}</span>
                        <span className="font-mono text-[10px] text-zinc-400">{(p.techStack as string[])[0]}</span>
                      </div>
                      <h3 className="mt-3 text-[15px] font-semibold leading-tight tracking-tight text-zinc-900 dark:text-white" style={{ letterSpacing: "-0.02em" }}>{p.title}</h3>
                      <p className="mt-1 font-mono text-[11px] leading-snug text-zinc-500 line-clamp-2 min-h-[2.2em]">{p.headline as string}</p>
                      <p className="mt-2 line-clamp-3 flex-1 font-mono text-[11px] leading-relaxed text-zinc-600 dark:text-zinc-400">{p.description as string}</p>
                      <div className="mt-3 flex flex-wrap gap-1">{(p.techStack as string[]).slice(0, 3).map((t) => (<span key={t} className="rounded-full border border-zinc-200 px-2 py-0.5 font-mono text-[10px] text-zinc-600 dark:border-zinc-800 dark:text-zinc-400">{t}</span>))}</div>
                      <div className="mt-auto flex gap-2 pt-4">
                        {(p as any).liveUrl && (<a href={(p as any).liveUrl} target="_blank" className="inline-flex items-center gap-1 rounded-full bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white dark:bg-white dark:text-zinc-900">Live <ExternalLink className="size-3" /></a>)}
                        {p.githubUrl && (<a href={p.githubUrl as string} target="_blank" className="inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-medium hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"><Github className="size-3" /> GitHub</a>)}
                      </div>
                    </div>
                  </SpringCard>
                </Reveal>
              ))}
            </>
          ) : (
            <Reveal delay={0.26} y={10} className="md:col-span-8 flex h-full">
              <SpringCard className="h-full w-full">
                <div className="relative flex h-full min-h-[220px] flex-col overflow-hidden rounded-[1.5rem] border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 md:p-6">
                  <div className="absolute -right-10 -top-10 size-48 rounded-full bg-gradient-to-br from-zinc-100 to-zinc-50 blur-2xl dark:from-zinc-800 dark:to-zinc-900" />
                  <h3 className="relative font-[var(--font-display)] text-[17px] font-semibold tracking-tight dark:text-white" style={{ letterSpacing: "-0.03em" }}>{CURATED[5]?.title}</h3>
                  <p className="relative mt-1 font-mono text-xs text-zinc-500">{CURATED[5]?.headline as string}</p>
                  <p className="relative mt-2 text-[13px] leading-relaxed text-zinc-600 dark:text-zinc-400 line-clamp-3">{CURATED[5]?.description as string}</p>
                  <div className="relative mt-3 flex flex-wrap gap-1.5">{(CURATED[5]?.techStack as string[]).slice(0, 5).map((t) => (<span key={t} className="rounded-full bg-zinc-900 px-2.5 py-1 font-mono text-[10px] text-white dark:bg-white dark:text-zinc-900">{t}</span>))}</div>
                  <div className="relative mt-4 flex gap-2">
                    {(CURATED[5] as any)?.liveUrl && (<a href={(CURATED[5] as any).liveUrl} target="_blank" className="inline-flex items-center gap-1.5 rounded-full bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white dark:bg-white dark:text-zinc-900">Live <ExternalLink className="size-3" /></a>)}
                    {CURATED[5]?.githubUrl && (<a href={CURATED[5]?.githubUrl as string} target="_blank" className="inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-medium hover:bg-zinc-50 dark:border-zinc-700"><Github className="size-3.5" /> GitHub</a>)}
                  </div>
                </div>
              </SpringCard>
            </Reveal>
          )}

          <Reveal delay={0.3} y={10} className="md:col-span-4 flex h-full">
            <div className="flex h-full min-h-[220px] flex-col rounded-[1.5rem] border border-dashed border-zinc-300 bg-zinc-50 p-5 dark:border-zinc-700 dark:bg-zinc-900/40">
              <div className="font-mono text-[11px] tracking-[0.14em] text-zinc-500">MORE ON GITHUB</div>
              <p className="mt-2 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">Also: <span className="font-medium">IronForge PT</span> (AI Studio + Motion), <span className="font-medium">Perspective Workforce</span> (corporate) & <span className="font-medium">Dry Cleaning Sample</span> (Next.js).</p>
              <a href="https://github.com/SameerVanjari" target="_blank" className="mt-4 inline-flex items-center gap-1.5 font-mono text-xs font-medium text-zinc-900 hover:underline dark:text-white"><Github className="size-3.5" /> github.com/SameerVanjari <ArrowUpRight className="size-3" /></a>
              <p className="mt-3 font-mono text-[11px] leading-relaxed text-zinc-500">Curated to highlight <span className="font-medium text-zinc-700 dark:text-zinc-300">React 19 / Next 15 / Three.js / WebXR / TanStack</span> depth.</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* SKILLS */}
      <section id="skills" className="mx-auto max-w-[1200px] px-4 md:px-8">
        <Reveal>
          <div className="rounded-[1.75rem] border border-zinc-200 bg-white p-6 shadow-[0_8px_40px_rgba(0,0,0,0.04)] dark:border-zinc-800 dark:bg-zinc-900 md:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div><h2 className="font-[var(--font-display)] text-2xl font-bold tracking-tight text-zinc-900 dark:text-white md:text-[28px]" style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.03em" }}>Skills & Tooling</h2><p className="mt-2 max-w-[60ch] text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">Frontend platform first — design systems to 3D — with enough backend to ship end-to-end.</p></div>
              <span className="hidden items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-2 font-mono text-xs text-zinc-600 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-300 md:inline-flex"><span className="size-1.5 rounded-full bg-teal-500" /> {RESUME_DATA.skills.length} technologies</span>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {[
                { label: "Core", items: ["TypeScript", "React.js", "Next.js", "JavaScript (ES6+)", "Node.js"] },
                { label: "Styling", items: ["Tailwind CSS", "Styled Components", "SASS", "Material UI", "Fluent UI"] },
                { label: "3D & Motion", items: ["Three.js", "React Three Fiber", "WebGL", "GLSL", "Motion"] },
                { label: "State & Data", items: ["Redux Toolkit", "Zustand", "Context API", "GraphQL", "REST APIs"] },
              ].map((g, gi) => (
                <motion.div key={g.label} initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ type: "spring", bounce: 0, duration: 0.5, delay: gi * 0.05 }} className="rounded-2xl border border-zinc-100 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-800/40">
                  <div className="font-mono text-[10px] tracking-[0.16em] text-zinc-500">{g.label.toUpperCase()}</div>
                  <div className="mt-3 flex flex-wrap gap-1.5">{g.items.map((s) => (<motion.span key={s} whileHover={reduce ? undefined : { y: -1 }} whileTap={reduce ? undefined : { scale: 0.97 }} className="cursor-default rounded-full border border-zinc-200 bg-white px-2.5 py-1 font-mono text-[11px] font-medium text-zinc-700 hover:border-zinc-900 hover:bg-zinc-900 hover:text-white dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-white dark:hover:text-zinc-900">{s}</motion.span>))}</div>
                </motion.div>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-1.5">{RESUME_DATA.skills.filter((s) => !["TypeScript","React.js","Next.js","JavaScript (ES6+)","Node.js","Tailwind CSS","Styled Components","SASS","Material UI","Fluent UI","Three.js","React Three Fiber","WebGL","GLSL","Redux Toolkit","Zustand","Context API","GraphQL","REST APIs"].includes(s)).map((skill) => (<span key={skill} className="rounded-full border border-zinc-200 bg-white px-3 py-1 font-mono text-[11px] font-normal text-zinc-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">{skill}</span>))}</div>
          </div>
        </Reveal>
      </section>

      {/* ABOUT + EDUCATION */}
      <section className="mx-auto max-w-[1200px] px-4 py-10 md:px-8 md:py-12">
        <div className="grid gap-6 md:grid-cols-[1.1fr_0.9fr]">
          <Reveal>
            <div className="rounded-[1.5rem] border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900"><h3 className="font-[var(--font-display)] text-lg font-semibold tracking-tight dark:text-white" style={{ letterSpacing: "-0.03em" }}>About</h3><p className="mt-2 text-pretty text-[13.5px] leading-relaxed text-zinc-600 dark:text-zinc-400">{RESUME_DATA.summary}</p><div className="mt-4 flex flex-wrap gap-2"><a href={RESUME_DATA.locationLink} target="_blank" className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-mono text-xs hover:bg-zinc-50 dark:border-zinc-800"><GlobeIcon className="size-3.5" /> {RESUME_DATA.location}</a><a href={`tel:${RESUME_DATA.contact.tel}`} className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-mono text-xs hover:bg-zinc-50 dark:border-zinc-800"><PhoneIcon className="size-3.5" /> {RESUME_DATA.contact.tel}</a></div>
              <AboutIllustration />
            </div>
          </Reveal>
          <Reveal delay={0.06}>
            <div className="space-y-6">
              <div className="rounded-[1.5rem] border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900"><div className="font-mono text-[11px] tracking-[0.14em] text-zinc-500">EDUCATION</div>{RESUME_DATA.education.map((e) => (<div key={e.school} className="mt-3 flex items-start justify-between gap-3"><div><div className="text-sm font-semibold text-zinc-900 dark:text-white">{e.school}</div><div className="mt-0.5 font-mono text-xs text-zinc-600 dark:text-zinc-400">{e.degree}</div></div><span className="shrink-0 rounded-full border px-3 py-1 font-mono text-xs dark:border-zinc-800">{e.start} — {e.end}</span></div>))}</div>
              <div className="relative overflow-hidden rounded-[1.5rem] bg-zinc-900 p-6 text-white dark:bg-white dark:text-zinc-900"><div className="absolute inset-0 bg-gradient-to-br from-teal-500/15 via-transparent to-indigo-500/15" /><div className="relative"><h3 className="font-[var(--font-display)] text-xl font-bold tracking-tight dark:text-zinc-900" style={{ letterSpacing: "-0.03em" }}>Let&apos;s build something fast.</h3><p className="mt-2 text-sm leading-relaxed opacity-70">Open to remote worldwide + on-site with visa sponsorship. Fast replies, clean handoffs.</p><div className="mt-5 flex flex-wrap gap-2"><a href={`mailto:${RESUME_DATA.contact.email}`} className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-zinc-900 hover:bg-zinc-100 dark:bg-zinc-900 dark:text-white"><MailIcon className="size-4" /> {RESUME_DATA.contact.email}</a><a href={`tel:${RESUME_DATA.contact.tel}`} className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-sm font-medium text-white hover:bg-white/10 dark:border-zinc-900/15 dark:text-zinc-900"><PhoneIcon className="size-4" /> Call</a></div><div className="mt-4 flex items-center gap-2"><a href={RESUME_DATA.contact.social[0].url} target="_blank" className="flex size-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/15"><GitHubIcon className="size-4" /></a><a href={RESUME_DATA.contact.social[1].url} target="_blank" className="flex size-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/15"><LinkedInIcon className="size-4" /></a><a href={RESUME_DATA.contact.social[2].url} target="_blank" className="flex size-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/15"><XIcon className="size-4" /></a><span className="ml-2 font-mono text-xs opacity-60">Response &lt; 24h</span></div></div></div>
            </div>
          </Reveal>
        </div>
      </section>

      <footer className="mx-auto max-w-[1200px] border-t border-zinc-200 px-4 py-8 font-mono text-xs text-zinc-500 dark:border-zinc-800 md:px-8">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between"><span>© 2026 Sameer Vanjari — Senior Frontend Engineer · Pune, India</span><span className="inline-flex items-center gap-3"><a href="#" className="hover:text-zinc-900 dark:hover:text-white">Back to top ↑</a><span className="size-1 rounded-full bg-zinc-300 dark:bg-zinc-700" /><span>Next.js · Motion · Tailwind · R3F</span></span></div>
      </footer>
    </main>
  );
}
