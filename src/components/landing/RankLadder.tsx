"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { MAX_XP_SHOWN, RANKS, rankFor } from "@/lib/progress/ranks";
import { XP, WEEKLY_GOAL } from "@/lib/progress/xp";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { cn } from "@/lib/cn";

export function RankLadder() {
  const [xp, setXp] = useState(1240);
  const r = rankFor(xp);
  const weeks = Math.ceil(xp / (WEEKLY_GOAL * XP.lesson + XP.weeklyGoalBonus));

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,380px)] lg:gap-16">
      <div className="flex flex-col gap-6">
        <div className="relative overflow-hidden rounded-[32px] border border-line bg-surface p-6 sm:p-8">
          <span className="text-sm text-muted">Level {r.level}</span>
          <div className="mt-1 grid min-h-[2.1em] items-end text-[clamp(34px,6vw,64px)] sm:min-h-[1.1em]">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={r.rank.id}
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -40, opacity: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 24 }}
                className={cn(
                  "font-wider col-start-1 row-start-1 leading-[1.02] font-extrabold tracking-tight",
                  r.rank.name.length > 12 && "text-[0.72em]",
                )}
              >
                {r.rank.name}
              </motion.span>
            </AnimatePresence>
          </div>
          <div className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="font-wide text-lg font-bold text-accent-text">Stupeň {r.tier}</span>
            <span className="text-muted">{r.rank.line}</span>
          </div>
          <div className="mt-6 h-2 overflow-hidden rounded-full bg-line">
            <motion.div className="h-full rounded-full bg-accent" animate={{ width: `${r.progress * 100}%` }} transition={{ type: "spring", stiffness: 140, damping: 22 }} />
          </div>
          <div className="mt-2 flex justify-between text-sm text-muted">
            <span className="tnum">
              <AnimatedNumber value={xp} /> XP
            </span>
            <span>{r.nextLabel ? `Další: ${r.nextLabel}` : "Vrchol. Dres máš."}</span>
          </div>
        </div>

        <label className="flex flex-col gap-3">
          <span className="flex justify-between text-sm">
            <span className="font-semibold">Posuň XP a sleduj, kam se dostaneš</span>
            <span className="tnum text-muted">zhruba {weeks} {weeks === 1 ? "týden" : weeks < 5 ? "týdny" : "týdnů"}</span>
          </span>
          <input
            type="range"
            min={0}
            max={MAX_XP_SHOWN}
            step={20}
            value={xp}
            onChange={(e) => setXp(Number(e.target.value))}
            className="ht-range w-full"
            aria-valuetext={`${xp} XP, ${r.rank.name} ${r.tier}`}
          />
        </label>

        <ul className="grid gap-2 text-sm text-muted sm:grid-cols-3">
          <li className="rounded-2xl border border-line p-4">
            <span className="font-wide block text-xl font-bold text-fg">+{XP.lesson}</span>za lekci na stezce
          </li>
          <li className="rounded-2xl border border-line p-4">
            <span className="font-wide block text-xl font-bold text-fg">+{XP.freePlay}</span>za volnou minihru
          </li>
          <li className="rounded-2xl border border-line p-4">
            <span className="font-wide block text-xl font-bold text-fg">+{XP.weeklyGoalBonus}</span>za {WEEKLY_GOAL} tréninky v týdnu
          </li>
        </ul>
      </div>

      <ol className="flex flex-col-reverse" aria-label="Všechny ranky">
        {RANKS.map((rank, i) => {
          const on = i === r.rankIndex;
          const past = i < r.rankIndex;
          return (
            <li key={rank.id}>
              <button
                type="button"
                onClick={() => setXp(rank.from)}
                className={cn("relative flex w-full items-center justify-between gap-4 rounded-xl px-4 py-2.5 text-left transition-colors", on ? "text-fg" : past ? "text-muted" : "text-faint hover:text-muted")}
              >
                {on && <motion.span layoutId="rank-marker" className="absolute inset-0 rounded-xl bg-accent-soft ring-1 ring-accent" transition={{ type: "spring", stiffness: 400, damping: 34 }} />}
                <span className={cn("relative font-semibold", on && "font-wide")}>{rank.name}</span>
                <span className="tnum relative text-xs">{rank.from.toLocaleString("cs-CZ")} XP</span>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
