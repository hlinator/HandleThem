"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { useDemo } from "@/lib/demo/store";
import { rankFor } from "@/lib/progress/ranks";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";

export function RankChip() {
  const { state } = useDemo();
  const r = rankFor(state.xp);
  const R = 16;
  const C = 2 * Math.PI * R;
  return (
    <Link href="/profil/" className="flex h-11 items-center gap-3 rounded-full border border-line py-1 pr-4 pl-1 transition-colors hover:border-accent" aria-label={`${r.rank.name} ${r.tier}, ${state.xp} XP`}>
      <span className="relative grid size-9 place-items-center">
        <svg viewBox="0 0 36 36" className="absolute inset-0 -rotate-90" aria-hidden="true">
          <circle cx="18" cy="18" r={R} fill="none" stroke="var(--line)" strokeWidth="3" />
          <motion.circle cx="18" cy="18" r={R} fill="none" stroke="var(--accent)" strokeWidth="3" strokeLinecap="round" strokeDasharray={C} animate={{ strokeDashoffset: C * (1 - r.progress) }} transition={{ type: "spring", stiffness: 80, damping: 18 }} />
        </svg>
        <span className="font-wide tnum text-xs font-bold">{r.level}</span>
      </span>
      <span className="flex flex-col leading-tight">
        <span className="max-w-[9.5rem] truncate text-sm font-semibold">
          {r.rank.name} {r.tier}
        </span>
        <span className="tnum text-xs text-muted">
          <AnimatedNumber value={state.xp} /> XP
        </span>
      </span>
    </Link>
  );
}
