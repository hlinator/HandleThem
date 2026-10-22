"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Check } from "lucide-react";
import { useDemo } from "@/lib/demo/store";
import { CREW } from "@/lib/demo/crew";
import { rankFor } from "@/lib/progress/ranks";
import { currentWeekDays, daysSinceLast, sessionsInWeek, weeklyStreak } from "@/lib/progress/streak";
import { WEEKLY_GOAL } from "@/lib/progress/xp";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { cn } from "@/lib/cn";

const DAY_LABELS = ["Po", "Út", "St", "Čt", "Pá", "So", "Ne"];

export function plural(n: number, one: string, few: string, many: string) {
  return n === 1 ? one : n >= 2 && n <= 4 ? few : many;
}

export function WeekCard() {
  const { days, today } = useDemo();
  const { weeks, currentWeekDone } = weeklyStreak(days, today);
  const since = daysSinceLast(days, today);
  const thisWeek = sessionsInWeek(days, today);
  const week = currentWeekDays(days, today);

  return (
    <section className="flex flex-col gap-5 rounded-[28px] border border-line p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-sm text-muted">Série</h2>
          <p className="font-wider tnum text-4xl leading-none font-extrabold">
            <AnimatedNumber value={weeks} /> <span className="text-xl font-bold">{plural(weeks, "týden", "týdny", "týdnů")}</span>
          </p>
        </div>
        <span className="rounded-full border border-line px-3 py-1 text-xs text-muted">
          {since === null ? "Zatím bez tréninku" : since === 0 ? "Dnes máš odtrénováno" : `${since} ${plural(since, "den", "dny", "dní")} od tréninku`}
        </span>
      </div>
      <ul className="grid grid-cols-7 gap-1.5">
        {week.map((d, i) => (
          <li key={d.day} className="flex flex-col items-center gap-1.5">
            <motion.span
              initial={false}
              animate={{ scale: d.trained ? [1.2, 1] : 1 }}
              className={cn(
                "grid aspect-square w-full max-w-10 place-items-center rounded-full border-2",
                d.trained ? "border-accent bg-accent text-accent-fg" : d.isToday ? "border-accent-text border-dashed" : "border-line",
                d.isFuture && "opacity-50",
              )}
            >
              {d.trained && <Check className="size-4" strokeWidth={3} />}
            </motion.span>
            <span className={cn("text-xs", d.isToday ? "font-bold text-fg" : "text-faint")}>{DAY_LABELS[i]}</span>
          </li>
        ))}
      </ul>
      <p className="text-sm text-muted">
        {currentWeekDone
          ? thisWeek >= WEEKLY_GOAL
            ? "Týdenní cíl splněný, bonus +30 XP máš."
            : `Tento týden ${thisWeek}× z ${WEEKLY_GOAL}. Za třetí trénink je bonus +30 XP.`
          : "Tento týden ještě nic. Stačí jeden trénink a série pokračuje."}
      </p>
    </section>
  );
}

export function RankCard({ big = false }: { big?: boolean }) {
  const { state } = useDemo();
  const r = rankFor(state.xp);
  return (
    <section className="flex flex-col gap-4 rounded-[28px] border border-line p-5 sm:p-6">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-sm text-muted">Rank, level {r.level}</h2>
        <Link href="/profil/" className="text-sm text-accent-text hover:underline">
          Všechny ranky
        </Link>
      </div>
      <p className={cn("font-wider leading-none font-extrabold tracking-tight", big ? "text-[clamp(36px,7vw,64px)]" : "text-3xl")}>
        {r.rank.name} <span className="text-accent-text">{r.tier}</span>
      </p>
      <p className="text-sm text-muted">{r.rank.line}</p>
      <div className="h-2 overflow-hidden rounded-full bg-line">
        <motion.div className="h-full rounded-full bg-accent" initial={false} animate={{ width: `${r.progress * 100}%` }} transition={{ type: "spring", stiffness: 120, damping: 20 }} />
      </div>
      <div className="flex justify-between text-sm text-muted">
        <span className="tnum" data-testid="xp-total">
          {state.xp.toLocaleString("cs-CZ")} XP
        </span>
        {r.nextAt !== null && <span className="tnum">ještě {(r.nextAt - state.xp).toLocaleString("cs-CZ")} XP na {r.nextLabel}</span>}
      </div>
    </section>
  );
}

export function CrewCard() {
  const { days, today } = useDemo();
  const me = sessionsInWeek(days, today);
  const rows = [{ name: "Ty", thisWeek: me, me: true }, ...CREW.map((c) => ({ ...c, me: false }))].sort((a, b) => b.thisWeek - a.thisWeek);
  return (
    <section className="flex flex-col gap-4 rounded-[28px] border border-line p-5 sm:p-6">
      <div>
        <h2 className="text-sm text-muted">Parta tento týden</h2>
        <p className="text-sm text-faint">Kolikrát trénovali, ne jak dobře.</p>
      </div>
      <motion.ul layout className="flex flex-col gap-3">
        {rows.map((c) => (
          <motion.li layout key={c.name} className="flex items-center gap-3">
            <span className={cn("grid size-9 shrink-0 place-items-center rounded-full text-sm font-bold", c.me ? "bg-accent text-accent-fg" : "bg-surface-2")}>{c.name[0]}</span>
            <span className={cn("w-16 shrink-0", c.me && "font-bold")}>{c.name}</span>
            <span className="flex flex-1 gap-1">
              {Array.from({ length: 5 }, (_, k) => (
                <span key={k} className={cn("h-2 flex-1 rounded-full", k < c.thisWeek ? (c.me ? "bg-accent" : "bg-fg/70") : "bg-line")} />
              ))}
            </span>
            <span className="tnum w-7 text-right text-sm text-muted">{c.thisWeek}×</span>
          </motion.li>
        ))}
      </motion.ul>
    </section>
  );
}
