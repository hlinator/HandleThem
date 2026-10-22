"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Rink } from "@/components/rink/Rink";
import { LANES, type LaneId } from "@/lib/path/data";
import { hallProgress, laneDone, nextNode, recommendedLane } from "@/lib/path/progress";
import { cn } from "@/lib/cn";
import { useWide } from "@/lib/hooks/useWide";

const START = ["vedeni-1", "vedeni-2", "klicky-1", "hlava-1", "hlava-2", "hlava-3"];


export function RinkDemo() {
  const [completed, setCompleted] = useState<Set<string>>(() => new Set(START));
  const [picked, setPicked] = useState<LaneId | null>(null);
  const wide = useWide();
  const rec = recommendedLane(completed);
  const goal = hallProgress(completed).goal;
  const lane = picked ?? rec;

  const advance = (id: LaneId) => {
    const n = nextNode(completed, id);
    if (!n) return;
    setCompleted((prev) => new Set(prev).add(n.id));
    setPicked(null);
  };

  return (
    <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="mx-auto w-full max-w-[380px] lg:max-w-none">
        <Rink completed={completed} orientation={wide ? "horizontal" : "vertical"} highlightLane={goal ? null : lane} goal={goal} />
      </div>
      <div className="flex flex-col gap-3">
        <p className="text-sm text-muted">{goal ? "Hala hotová. Další hala čeká." : "Vyber, kterou lajnu dnes posuneš:"}</p>
        {LANES.map((l) => {
          const done = laneDone(completed, l.id);
          const next = nextNode(completed, l.id);
          const on = lane === l.id && !goal;
          return (
            <button
              key={l.id}
              type="button"
              disabled={!next}
              onPointerEnter={() => setPicked(l.id)}
              onFocus={() => setPicked(l.id)}
              onClick={() => advance(l.id)}
              className={cn(
                "relative flex items-center gap-4 rounded-2xl border p-4 text-left transition-colors disabled:opacity-50",
                on ? "border-accent bg-accent-soft" : "border-line hover:border-faint",
              )}
            >
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="flex items-center gap-2 font-semibold">
                  {l.name}
                  {rec === l.id && <span className="rounded-full bg-fg px-2 py-0.5 text-[11px] font-bold text-bg">Doporučeno</span>}
                </span>
                <span className="truncate text-sm text-muted">{next ? next.title : "Lajna dojela k brance"}</span>
              </span>
              <span className="tnum text-sm text-muted">{done}/6</span>
            </button>
          );
        })}
        {goal && (
          <motion.button
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            type="button"
            onClick={() => setCompleted(new Set(START))}
            className="h-12 rounded-full bg-accent font-semibold text-accent-fg"
          >
            Zkusit znovu
          </motion.button>
        )}
      </div>
    </div>
  );
}
