"use client";

import { motion } from "motion/react";
import { RotateCcw } from "lucide-react";
import { useDemo } from "@/lib/demo/store";
import { RANKS, rankFor } from "@/lib/progress/ranks";
import { weekStrip, weeklyStreak } from "@/lib/progress/streak";
import { GAMES } from "@/lib/games/meta";
import { nodeById } from "@/lib/path/data";
import { GameIcon } from "@/components/games/GameIcon";
import { RankCard, plural } from "./Cards";
import { cn } from "@/lib/cn";

const DAY = new Intl.DateTimeFormat("cs-CZ", { weekday: "short", day: "numeric", month: "numeric" });

export function ProfileView() {
  const { state, days, today, reset } = useDemo();
  const r = rankFor(state.xp);
  const strip = weekStrip(days, today, 10);
  const max = Math.max(3, ...strip.map((w) => w.count));
  const { weeks } = weeklyStreak(days, today);
  const lessons = state.sessions.filter((s) => s.kind === "lesson").length;
  const recent = [...state.sessions].sort((a, b) => (a.day < b.day ? 1 : -1)).slice(0, 6);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-wider text-[clamp(30px,6vw,52px)] leading-none font-extrabold tracking-tight">{state.name}</h1>

      <RankCard big />

      <dl className="grid grid-cols-3 gap-3">
        {[
          [state.sessions.length, plural(state.sessions.length, "trénink", "tréninky", "tréninků")],
          [lessons, plural(lessons, "lekce", "lekce", "lekcí")],
          [weeks, plural(weeks, "týden v řadě", "týdny v řadě", "týdnů v řadě")],
        ].map(([n, l]) => (
          <div key={String(l)} className="rounded-[24px] border border-line p-4">
            <dt className="sr-only">{l}</dt>
            <dd className="font-wider tnum text-3xl font-extrabold sm:text-4xl">{n}</dd>
            <dd className="text-sm text-muted">{l}</dd>
          </div>
        ))}
      </dl>

      <section className="flex flex-col gap-4 rounded-[28px] border border-line p-5 sm:p-6">
        <h2 className="text-sm text-muted">Posledních 10 týdnů</h2>
        <div className="flex h-32 items-end gap-1.5 sm:gap-2">
          {strip.map((w, i) => (
            <div key={w.start} className="flex h-full flex-1 flex-col justify-end gap-1">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${Math.max(w.count ? 10 : 3, (w.count / max) * 100)}%` }}
                transition={{ delay: i * 0.04, type: "spring", stiffness: 160, damping: 20 }}
                className={cn("mx-auto w-full max-w-10 rounded-lg", w.count === 0 ? "bg-line" : w.isCurrent ? "bg-accent" : "bg-fg/75")}
                title={`${w.count}×`}
              />
            </div>
          ))}
        </div>
        <p className="text-sm text-muted">Každý sloupec je jeden týden. Šedý proužek znamená týden bez tréninku.</p>
      </section>

      <section className="flex flex-col gap-3 rounded-[28px] border border-line p-5 sm:p-6">
        <h2 className="text-sm text-muted">Poslední tréninky</h2>
        <ul className="divide-y divide-line">
          {recent.map((s, i) => {
            const [y, m, d] = s.day.split("-").map(Number);
            return (
              <li key={`${s.day}-${i}`} className="flex items-center gap-4 py-3">
                <GameIcon game={s.game} className="size-6 text-accent-text" />
                <span className="flex-1">
                  <span className="block font-semibold">{s.nodeId ? nodeById(s.nodeId)?.title : `Volný trénink: ${GAMES[s.game].name}`}</span>
                  <span className="text-sm text-muted">{DAY.format(new Date(y, m - 1, d))}</span>
                </span>
                <span className="tnum text-sm text-muted">{s.kind === "lesson" ? "+50" : "+10"} XP</span>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="flex flex-col gap-3 rounded-[28px] border border-line p-5 sm:p-6">
        <h2 className="text-sm text-muted">Žebříček ranků</h2>
        <ol className="flex flex-col-reverse gap-1">
          {RANKS.map((rank, i) => (
            <li key={rank.id} className={cn("flex items-center justify-between rounded-xl px-3 py-2 text-sm", i === r.rankIndex ? "bg-accent-soft font-semibold ring-1 ring-accent" : i < r.rankIndex ? "text-muted" : "text-faint")}>
              <span>{rank.name}</span>
              <span className="tnum">{rank.from.toLocaleString("cs-CZ")} XP</span>
            </li>
          ))}
        </ol>
      </section>

      <button type="button" onClick={reset} className="inline-flex h-12 items-center gap-2 self-start rounded-full border border-line px-5 text-sm hover:border-fg">
        <RotateCcw className="size-4" /> Vrátit ukázková data
      </button>
    </div>
  );
}
