"use client";

import { motion, AnimatePresence } from "motion/react";
import { Check, Lock } from "lucide-react";
import { cn } from "@/lib/cn";
import { LANES, NODES, STEPS_PER_LANE, type LaneId, type PathNode } from "@/lib/path/data";
import { laneDone, nodeStatus, type NodeStatus } from "@/lib/path/progress";
import { MiniBall } from "./MiniBall";

export type Orientation = "vertical" | "horizontal";

// Hřiště 40 × 20 m. Hráč jde od vlastní branky (start) k soupeřově (gól).
// Souřadnice uzlů jsou v procentech, aby šly přes SVG pozicovat HTML tlačítka.
const LANE_POS = [25, 50, 75];
const STEP_FROM = 86;
const STEP_TO = 20;

function nodePos(o: Orientation, laneIdx: number, step: number) {
  const along = STEP_FROM - ((STEP_FROM - STEP_TO) * step) / (STEPS_PER_LANE - 1);
  return o === "vertical" ? { left: LANE_POS[laneIdx], top: along } : { left: 100 - along, top: LANE_POS[laneIdx] };
}

function ballPos(o: Orientation, laneIdx: number, done: number) {
  // míček stojí na dalším uzlu; po dokončení lajny dojede do brankoviště
  if (done >= STEPS_PER_LANE) {
    return o === "vertical" ? { left: LANE_POS[laneIdx], top: 9 } : { left: 91, top: LANE_POS[laneIdx] };
  }
  const p = nodePos(o, laneIdx, done);
  return p;
}

export function Rink({
  completed,
  orientation,
  onNodeClick,
  highlightLane,
  selectedNode,
  goal = false,
  className,
  labels = true,
}: {
  completed: ReadonlySet<string>;
  orientation: Orientation;
  onNodeClick?: (node: PathNode, status: NodeStatus) => void;
  highlightLane?: LaneId | null;
  selectedNode?: string | null;
  goal?: boolean;
  className?: string;
  labels?: boolean;
}) {
  const v = orientation === "vertical";
  return (
    <div className={cn("w-full select-none", v ? "pb-8" : "pl-8", className)} style={{ containerType: "inline-size" }}>
    <div className="relative w-full" style={{ aspectRatio: v ? "1 / 1.85" : "1.85 / 1" }}>
      <RinkLines orientation={orientation} />

      {/* lajny: čárkovaná cesta, hotová část plnou čarou */}
      <svg className="absolute inset-0 size-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        {LANES.map((lane, i) => {
          const done = laneDone(completed, lane.id);
          const a = nodePos(orientation, i, 0);
          const b = v ? { left: LANE_POS[i], top: 9 } : { left: 91, top: LANE_POS[i] };
          const end = ballPos(orientation, i, done);
          const hl = highlightLane === lane.id;
          return (
            <g key={lane.id}>
              <line x1={a.left} y1={a.top} x2={b.left} y2={b.top} stroke="var(--line)" strokeWidth="0.6" strokeDasharray="5 6" vectorEffect="non-scaling-stroke" style={{ strokeWidth: 2 }} />
              <motion.line
                x1={a.left}
                y1={a.top}
                initial={false}
                animate={{ x2: end.left, y2: end.top }}
                transition={{ type: "spring", stiffness: 120, damping: 20 }}
                stroke="var(--accent)"
                vectorEffect="non-scaling-stroke"
                style={{ strokeWidth: hl ? 4 : 3, opacity: hl || !highlightLane ? 1 : 0.55 }}
                strokeLinecap="round"
              />
            </g>
          );
        })}
      </svg>

      {NODES.map((node) => {
        const laneIdx = LANES.findIndex((l) => l.id === node.lane);
        const status = nodeStatus(completed, node);
        const p = nodePos(orientation, laneIdx, node.step);
        const dim = highlightLane && highlightLane !== node.lane;
        return (
          <button
            key={node.id}
            type="button"
            onClick={() => onNodeClick?.(node, status)}
            disabled={!onNodeClick}
            aria-label={`${node.title}, ${status === "done" ? "hotovo" : status === "next" ? "další krok" : "zamčeno"}`}
            className={cn(
              "absolute z-10 grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full transition-[opacity,transform,background-color,border-color] duration-300 disabled:cursor-default",
              "size-[clamp(28px,7.5cqw,44px)] min-[420px]:size-[clamp(32px,8cqw,44px)]",
              status === "done" && "border-2 border-accent bg-accent text-accent-fg",
              status === "next" && "border-2 border-accent bg-bg text-accent-text",
              status === "locked" && "border-2 border-line bg-bg text-faint",
              dim && "opacity-40",
              selectedNode === node.id && "scale-125 ring-4 ring-accent-soft",
              onNodeClick && "hover:scale-110",
            )}
            style={{ left: `${p.left}%`, top: `${p.top}%` }}
          >
            {status === "done" && <Check className="size-1/2" strokeWidth={3} />}
            {status === "locked" && <Lock className="size-[40%]" />}
            {status === "next" && <span className="size-2 rounded-full bg-accent-text" />}
          </button>
        );
      })}

      {/* míček v každé lajně */}
      {LANES.map((lane, i) => {
        const done = laneDone(completed, lane.id);
        const p = ballPos(orientation, i, done);
        return (
          <motion.span
            key={lane.id}
            className="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-1/2"
            initial={false}
            animate={{ left: `${p.left}%`, top: `${p.top}%` }}
            transition={{ type: "spring", stiffness: 140, damping: 16 }}
            style={{ marginLeft: v ? 18 : 0, marginTop: v ? 0 : -18 }}
          >
            <MiniBall className="size-4 sm:size-5" />
          </motion.span>
        );
      })}

      {labels &&
        LANES.map((lane, i) => (
          <span
            key={lane.id}
            className={cn(
              "absolute z-10 text-center text-[11px] font-semibold whitespace-nowrap text-muted sm:text-xs",
              highlightLane === lane.id && "text-fg",
            )}
            style={
              v
                ? { left: `${LANE_POS[i]}%`, top: "calc(100% + 8px)", translate: "-50% 0" }
                : { right: "calc(100% + 6px)", top: `${LANE_POS[i]}%`, translate: "0 -50%", writingMode: "vertical-rl", rotate: "180deg" }
            }
          >
            {lane.short}
          </span>
        ))}

      <AnimatePresence>
        {goal && (
          <motion.div
            className="absolute inset-0 z-30 grid place-items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.span
              initial={{ scale: 0.3, rotate: -8 }}
              animate={{ scale: 1, rotate: -4 }}
              transition={{ type: "spring", stiffness: 260, damping: 12 }}
              className="font-wider rounded-2xl bg-accent px-6 py-3 text-5xl font-extrabold text-accent-fg shadow-[0_0_80px_var(--glow)] sm:text-7xl"
            >
              GÓL!
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    </div>
  );
}

/** čáry florbalového hřiště: mantinel, středová čára, body pro vhazování, brankoviště */
function RinkLines({ orientation }: { orientation: Orientation }) {
  const v = orientation === "vertical";
  const W = v ? 200 : 370;
  const H = v ? 370 : 200;
  // kreslím na výšku a pro šířku jen otočím skupinu
  return (
    <svg className="absolute inset-0 size-full" viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
      <g transform={v ? undefined : `translate(${W} 0) rotate(90)`}>
        <rect x="3" y="3" width="194" height="364" rx="34" fill="var(--surface)" stroke="var(--line)" strokeWidth="2" />
        <line x1="3" y1="185" x2="197" y2="185" stroke="var(--line)" strokeWidth="2" />
        <circle cx="100" cy="185" r="3" fill="var(--line)" />
        {[
          [40, 185], [160, 185], [40, 70], [160, 70], [40, 300], [160, 300],
        ].map(([x, y]) => (
          <path key={`${x}-${y}`} d={`M${x - 4} ${y}h8M${x} ${y - 4}v8`} stroke="var(--line)" strokeWidth="2" />
        ))}
        {/* soupeřova branka nahoře */}
        <rect x="55" y="16" width="90" height="40" rx="3" fill="none" stroke="var(--line)" strokeWidth="2" />
        <rect x="80" y="22" width="40" height="14" rx="2" fill="var(--accent-soft)" stroke="var(--accent)" strokeWidth="2" />
        {/* vlastní branka dole */}
        <rect x="55" y="314" width="90" height="40" rx="3" fill="none" stroke="var(--line)" strokeWidth="2" />
        <rect x="80" y="334" width="40" height="14" rx="2" fill="none" stroke="var(--line)" strokeWidth="2" />
      </g>
    </svg>
  );
}
