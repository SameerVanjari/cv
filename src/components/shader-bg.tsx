"use client";
import { motion, useReducedMotion } from "motion/react";

export function ShaderBg() {
  const reduce = useReducedMotion();
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* soft mesh */}
      <div className="absolute inset-0 mesh-gradient opacity-[0.9] dark:opacity-[0.6]" />
      {/* grid */}
      <div
        className="absolute inset-0 opacity-[0.04] dark:opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />
      {/* drifting blobs */}
      {!reduce && (
        <>
          <motion.div
            className="absolute -top-32 -left-32 h-[520px] w-[520px] rounded-full blur-[80px]"
            style={{ background: "radial-gradient(circle, rgba(20,184,166,0.22), transparent 70%)" }}
            animate={{ transform: ["translate(0px, 0px) scale(1)", "translate(30px, 20px) scale(1.05)", "translate(0px, 0px) scale(1)"] }}
            transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute top-[18%] -right-40 h-[560px] w-[560px] rounded-full blur-[90px]"
            style={{ background: "radial-gradient(circle, rgba(99,102,241,0.18), transparent 70%)" }}
            animate={{ transform: ["translate(0px, 0px) scale(1)", "translate(-24px, 16px) scale(1.08)", "translate(0px, 0px) scale(1)"] }}
            transition={{ duration: 16, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          />
          <motion.div
            className="absolute bottom-0 left-[30%] h-[420px] w-[700px] rounded-full blur-[80px]"
            style={{ background: "radial-gradient(circle, rgba(14,165,233,0.10), transparent 70%)" }}
            animate={{ transform: ["translate(0px, 0px) scale(1)", "translate(18px, 0px) scale(1.04)", "translate(0px, 0px) scale(1)"] }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
          />
        </>
      )}
      {/* vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/60 dark:to-zinc-950/40" />
    </div>
  );
}

export function OrbGlow({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden rounded-[2rem] ${className}`} aria-hidden>
      <div className="absolute -inset-[1px] rounded-[2rem] bg-gradient-to-br from-teal-500/20 via-indigo-500/10 to-sky-500/20 blur-xl" />
    </div>
  );
}
