"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { Clock, Play } from "lucide-react";
import { useDemo } from "@/lib/demo/store";
import { LANES, STEPS_PER_LANE, type LaneId } from "@/lib/path/data";
import { laneDone, nextNode, recommendedLane } from "@/lib/path/progress";
import { GAMES } from "@/lib/games/meta";
import { GameIcon } from "@/components/games/GameIcon";
import { cn } from "@/lib/cn";

// Výchozí volba je doporučená lajna, takže stačí jedno klepnutí na „Začít“.
export function LanePicker() {
  const { completed } = useDemo();
  const rec = recommendedLane(completed);
  const [picked, setPicked] = useState<LaneId | null>(null);
  const lane = picked ?? rec;
  const node = lane ? nextNode(completed, lane) : null;

  if (!rec || !lane || !node) {
    return (
      <div className="rounded-[32px] border border-accent bg-accent-soft p-6 sm:p-8">
        <p className="font-wider text-4xl font-extrabold">Gól! Hala 1 je hotová.</p>
        <p className="mt-2 text-muted">Další hala se připravuje. Zatím si dej volný trénink.</p>
        <Link href="/trenink/" className="mt-6 inline-flex h-12 items-center rounded-full bg-accent px-6 font-semibold text-accent-fg">
          Volný trénink
        </Link>
      </div>
    );
  }

  return (
    <section aria-labelledby="today-title" className="overflow-hidden rounded-[32px] border border-line bg-surface">
      <div className="flex flex-col gap-1 px-5 pt-5 sm:px-7 sm:pt-7">
        <h2 id="today-title" className="text-sm text-muted">
          Kterou lajnu dnes posuneš?
        </h2>
      </div>
      <div role="radiogroup" aria-label="Lajna" className="grid gap-2 p-3 sm:grid-cols-3 sm:p-5">
        {LANES.map((l) => {
          const n = nextNode(completed, l.id);
          const done = laneDone(completed, l.id);
          const on = l.id === lane;
          return (
            <button
              key={l.id}
              type="button"
              role="radio"
              aria-checked={on}
              disabled={!n}
              onClick={() => setPicked(l.id)}
              className={cn(
                "relative flex flex-col gap-3 rounded-2xl border p-4 text-left transition-colors disabled:opacity-40",
                on ? "border-accent" : "border-line hover:border-faint",
              )}
            >
              {on && <motion.span layoutId="lane-pick" className="absolute inset-0 rounded-2xl bg-accent-soft" transition={{ type: "spring", stiffness: 420, damping: 36 }} />}
              <span className="relative flex items-center justify-between gap-2">
                <span className="font-semibold">{l.name}</span>
                {rec === l.id && <span className="rounded-full bg-fg px-2 py-0.5 text-[11px] font-bold text-bg">Doporučeno</span>}
              </span>
              <span className="relative flex gap-1" aria-label={`${done} z ${STEPS_PER_LANE}`}>
                {Array.from({ length: STEPS_PER_LANE }, (_, i) => (
                  <span key={i} className={cn("h-1.5 flex-1 rounded-full", i < done ? "bg-accent" : i === done ? "bg-accent/40" : "bg-line")} />
                ))}
              </span>
              <span className="relative truncate text-sm text-muted">{n ? n.title : "Dojela k brance"}</span>
            </button>
          );
        })}
      </div>

      <div className="border-t border-line p-5 sm:p-7">
        <AnimatePresence mode="wait">
          <motion.div
            key={node.id}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"
          >
            <div className="flex flex-col gap-2">
              <span className="text-sm text-muted">
                {LANES.find((x) => x.id === lane)!.name}, krok {node.step + 1} z {STEPS_PER_LANE}
              </span>
              <span className="font-wider text-[clamp(30px,6vw,48px)] leading-none font-extrabold tracking-tight">{node.title}</span>
              <span className="flex flex-wrap gap-2 pt-1 text-sm">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1">
                  <Clock className="size-3.5" /> {node.minutes} min
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1">
                  <GameIcon game={node.game.id} className="size-3.5" /> {GAMES[node.game.id].name}
                </span>
                <span className="inline-flex items-center rounded-full border border-line px-3 py-1">+50 XP</span>
              </span>
            </div>
            <Link
              href={`/lekce/${node.id}/`}
              className="inline-flex h-14 shrink-0 items-center justify-center gap-2 rounded-full bg-accent px-8 text-lg font-semibold text-accent-fg transition hover:brightness-110"
            >
              <Play className="size-5 fill-current" /> Začít trénink
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
