"use client";

import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { Plus } from "lucide-react";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { CREW } from "@/lib/demo/crew";
import { addDays, todayLocal, weekStart } from "@/lib/progress/streak";
import { cn } from "@/lib/cn";

const INITIAL = [2, 1, 3, 0, 1, 2, 3, 1];
const MISSED = 3;

function runFromEnd(counts: number[]) {
  let n = 0;
  for (let i = counts.length - 1; i >= 0 && counts[i] > 0; i--) n++;
  return n;
}

export function StreakDemo() {
  const [counts, setCounts] = useState(INITIAL);
  const streak = runFromEnd(counts);
  const fixed = counts[MISSED] > 0;
  const starts = useMemo(() => {
    const current = weekStart(todayLocal());
    return INITIAL.map((_, i) => addDays(current, -7 * (INITIAL.length - 1 - i)));
  }, []);
  const label = (d: string) => `${Number(d.slice(8))}.${Number(d.slice(5, 7))}.`;
  const max = Math.max(...counts, 4);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="flex flex-col gap-6 rounded-[32px] border border-line bg-surface p-6 sm:p-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="text-sm text-muted">Série</span>
            <div className="font-wider tnum text-6xl leading-none font-extrabold">
              <AnimatedNumber value={streak} />
              <span className="ml-2 text-2xl font-bold">{streak === 1 ? "týden" : streak < 5 ? "týdny" : "týdnů"}</span>
            </div>
          </div>
          <span className="rounded-full border border-line px-3 py-1.5 text-sm text-muted">2 dny od posledního tréninku</span>
        </div>

        <div className="grid grid-cols-8 items-end gap-1.5 sm:gap-2" style={{ height: 150 }}>
          {counts.map((c, i) => (
            <div key={starts[i]} className="flex h-full flex-col items-center justify-end gap-2">
              {i === MISSED && !fixed ? (
                <button
                  type="button"
                  onClick={() => setCounts((p) => p.map((v, j) => (j === MISSED ? 1 : v)))}
                  className="grid h-full w-full place-items-center rounded-xl border-2 border-dashed border-warn text-warn transition-colors hover:bg-warn/10"
                  aria-label={`Doplnit trénink do týdne od ${label(starts[i])}`}
                >
                  <Plus className="size-5" />
                </button>
              ) : (
                <motion.div
                  initial={false}
                  animate={{ height: `${Math.max(8, (c / max) * 100)}%` }}
                  transition={{ type: "spring", stiffness: 200, damping: 18 }}
                  className={cn("w-full rounded-xl", i === MISSED ? "bg-warn" : i === counts.length - 1 ? "bg-accent" : "bg-fg/80")}
                />
              )}
              <span className="tnum text-[10px] text-faint sm:text-xs">{label(starts[i])}</span>
            </div>
          ))}
        </div>
        <p className="min-h-12 text-sm text-muted">
          {fixed
            ? "Doplněno. Týden se započítal a série se zase spojila."
            : "V týdnu od " + label(starts[MISSED]) + " byl turnaj. Klepni na prázdný týden a doplň trénink, který jsi stejně udělal."}
        </p>
      </div>

      <div className="flex flex-col gap-5 rounded-[32px] border border-line p-6 sm:p-8">
        <div>
          <span className="text-sm text-muted">Parta tento týden</span>
          <p className="mt-1 text-lg font-semibold">Kolikrát trénovali, ne jak dobře.</p>
        </div>
        <ul className="flex flex-col gap-4">
          {[{ name: "Ty", thisWeek: 3, me: true }, ...CREW].map((c, i) => (
            <li key={c.name} className="flex items-center gap-4">
              <span className={cn("grid size-10 shrink-0 place-items-center rounded-full text-sm font-bold", "me" in c ? "bg-accent text-accent-fg" : "bg-surface-2")}>{c.name[0]}</span>
              <span className="w-16 shrink-0 font-semibold">{c.name}</span>
              <div className="flex flex-1 gap-1">
                {Array.from({ length: 5 }, (_, k) => (
                  <motion.span
                    key={k}
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 * i + 0.05 * k }}
                    className={cn("h-2.5 flex-1 origin-left rounded-full", k < c.thisWeek ? ("me" in c ? "bg-accent" : "bg-fg/80") : "bg-line")}
                  />
                ))}
              </div>
              <span className="tnum w-8 text-right text-sm text-muted">{c.thisWeek}×</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
