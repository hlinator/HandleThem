"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { Clock, X } from "lucide-react";
import { Rink } from "@/components/rink/Rink";
import { useDemo } from "@/lib/demo/store";
import { HALL, LANES, NODES, STEPS_PER_LANE, laneById, type PathNode } from "@/lib/path/data";
import { hallProgress, nextNode, nodeStatus, recommendedLane } from "@/lib/path/progress";
import { GAMES, DIFFICULTY_LABEL } from "@/lib/games/meta";
import { GameIcon } from "@/components/games/GameIcon";
import { cn } from "@/lib/cn";
import { useWide } from "@/lib/hooks/useWide";


export function PathView() {
  const { completed } = useDemo();
  const wide = useWide();
  const [sel, setSel] = useState<PathNode | null>(null);
  const hall = hallProgress(completed);
  const rec = recommendedLane(completed);

  useEffect(() => {
    if (!sel) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSel(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [sel]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="text-sm text-muted">{HALL.next ? `Po gólu: ${HALL.next}` : ""}</span>
          <h1 className="font-wider text-[clamp(30px,6vw,52px)] leading-none font-extrabold tracking-tight">{HALL.name}</h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="tnum text-sm text-muted">
            {hall.total}/{hall.max} uzlů
          </span>
          <span className="h-2 w-32 overflow-hidden rounded-full bg-line">
            <motion.span className="block h-full bg-accent" initial={false} animate={{ width: `${(hall.total / hall.max) * 100}%` }} />
          </span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="mx-auto w-full max-w-[420px] lg:max-w-none">
          <Rink
            completed={completed}
            orientation={wide ? "horizontal" : "vertical"}
            onNodeClick={(n) => setSel(n)}
            selectedNode={sel?.id}
            highlightLane={sel?.lane ?? null}
            goal={hall.goal}
          />
        </div>
        <ul className="grid gap-2 self-start sm:grid-cols-3 lg:grid-cols-1">
          {LANES.map((l) => {
            const n = nextNode(completed, l.id);
            const done = hall.perLane.find((p) => p.lane === l.id)!.done;
            return (
              <li key={l.id}>
                <button type="button" disabled={!n} onClick={() => n && setSel(n)} className="flex w-full flex-col gap-2 rounded-2xl border border-line p-4 text-left transition-colors hover:border-accent disabled:opacity-60">
                  <span className="flex items-center justify-between gap-2 font-semibold">
                    {l.name}
                    {rec === l.id && <span className="rounded-full bg-fg px-2 py-0.5 text-[11px] font-bold text-bg">Doporučeno</span>}
                  </span>
                  <span className="text-sm text-muted">{l.about}</span>
                  <span className="tnum text-sm">
                    {`${done}/${STEPS_PER_LANE}${n ? `, další: ${n.title}` : ", u branky"}`}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <AnimatePresence>
        {sel && (
          <>
            <motion.button
              type="button"
              aria-label="Zavřít detail"
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-[2px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSel(null)}
            />
            <NodeSheet node={sel} onClose={() => setSel(null)} />
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function NodeSheet({ node, onClose }: { node: PathNode; onClose: () => void }) {
  const { completed } = useDemo();
  const status = nodeStatus(completed, node);
  const lane = laneById(node.lane);
  const blocker = status === "locked" ? NODES.find((n) => n.lane === node.lane && n.step === node.step - 1) : null;
  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-labelledby="node-title"
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ type: "spring", stiffness: 340, damping: 34 }}
      className="fixed inset-x-0 bottom-0 z-50 mx-auto flex max-w-lg flex-col gap-5 rounded-t-[32px] border border-line bg-surface p-6 pb-[max(24px,env(safe-area-inset-bottom))] shadow-2xl sm:bottom-6 sm:rounded-[32px]"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className="text-sm text-muted">
            {lane.name}, krok {node.step + 1} z {STEPS_PER_LANE}
          </span>
          <h2 id="node-title" className="font-wider mt-1 text-3xl leading-none font-extrabold tracking-tight">
            {node.title}
          </h2>
        </div>
        <button type="button" onClick={onClose} aria-label="Zavřít" className="grid size-11 shrink-0 place-items-center rounded-full border border-line">
          <X className="size-5" />
        </button>
      </div>
      <div className="flex flex-wrap gap-2 text-sm">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1">
          <Clock className="size-3.5" /> {node.minutes} min
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1">
          <GameIcon game={node.game.id} className="size-3.5" /> {GAMES[node.game.id].name}, {DIFFICULTY_LABEL[node.game.difficulty].toLowerCase()}
        </span>
      </div>
      <ul className="flex flex-col gap-2">
        {node.cues.map((c) => (
          <li key={c} className="flex gap-3">
            <span className="mt-2 size-1.5 shrink-0 rounded-full bg-accent-text" />
            {c}
          </li>
        ))}
      </ul>
      {status === "locked" ? (
        <p className={cn("rounded-2xl border border-line p-4 text-sm text-muted")}>Odemkne se po kroku „{blocker?.title}“.</p>
      ) : (
        <Link href={`/lekce/${node.id}/`} className="flex h-14 items-center justify-center rounded-full bg-accent text-lg font-semibold text-accent-fg hover:brightness-110">
          {status === "done" ? "Zopakovat lekci" : "Začít lekci"}
        </Link>
      )}
    </motion.div>
  );
}
