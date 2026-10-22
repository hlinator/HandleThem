"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { SessionResult } from "@/lib/demo/store";
import { GAMES } from "@/lib/games/meta";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { summaryLine, type GameSummary } from "@/components/games/GameShell";
import { GameIcon } from "@/components/games/GameIcon";

/** výsledek po lekci i volném tréninku: XP, posun v ranku, případné povýšení */
export function ResultPanel({
  title,
  summary,
  result,
  extra,
  children,
}: {
  title: string;
  summary: GameSummary;
  result: SessionResult;
  extra?: React.ReactNode;
  children?: React.ReactNode;
}) {
  const [shownXp, setShownXp] = useState(0);
  const [progress, setProgress] = useState(result.before.progress);
  const line = summaryLine(summary);
  const total = result.base + result.bonus;

  useEffect(() => {
    // nejdřív odpočítám XP, pak dojede ukazatel ranku
    const t1 = setTimeout(() => setShownXp(total), 250);
    const t2 = setTimeout(() => setProgress(result.levelUp ? 1 : result.after.progress), 900);
    const t3 = result.levelUp ? setTimeout(() => setProgress(result.after.progress), 1700) : undefined;
    return () => [t1, t2, t3].forEach((t) => t && clearTimeout(t));
  }, [total, result]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-2 rounded-[32px] border border-line bg-surface px-6 py-10 text-center">
        <span className="text-sm text-muted">{title}</span>
        <span className="font-wider tnum text-[clamp(64px,16vw,112px)] leading-none font-extrabold text-accent-text">
          +<AnimatedNumber value={shownXp} />
        </span>
        <span className="text-lg font-semibold">XP</span>
        {result.bonus > 0 && (
          <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.8, type: "spring" }} className="mt-2 rounded-full bg-fg px-3 py-1 text-sm font-semibold text-bg">
            včetně +{result.bonus} za 3 tréninky v týdnu
          </motion.span>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex items-center gap-4 rounded-[28px] border border-line p-5">
          <GameIcon game={summary.game} className="size-8 text-accent-text" />
          <div>
            <div className="font-wide text-2xl font-bold">{line.big}</div>
            <div className="text-sm text-muted">
              {GAMES[summary.game].name}: {line.label}
            </div>
          </div>
        </div>
        <div className="relative flex flex-col gap-3 overflow-hidden rounded-[28px] border border-line p-5">
          <div className="flex items-baseline justify-between gap-2">
            <AnimatePresence mode="wait">
              <motion.span key={progress === 1 ? "x" : result.after.level} initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="font-semibold">
                {(progress === 1 && result.levelUp ? result.before : result.after).rank.name} {(progress === 1 && result.levelUp ? result.before : result.after).tier}
              </motion.span>
            </AnimatePresence>
            <span className="text-sm text-muted">level {result.after.level}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-line">
            <motion.div className="h-full rounded-full bg-accent" initial={{ width: `${result.before.progress * 100}%` }} animate={{ width: `${progress * 100}%` }} transition={{ duration: 0.6, ease: "easeOut" }} />
          </div>
          {result.levelUp && (
            <motion.span initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.6 }} className="text-sm font-semibold text-accent-text">
              Povýšení! Teď jsi {result.after.rank.name} {result.after.tier}.
            </motion.span>
          )}
        </div>
      </div>
      {extra}
      {children && <div className="flex flex-wrap gap-3">{children}</div>}
    </div>
  );
}
