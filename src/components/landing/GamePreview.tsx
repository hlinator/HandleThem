"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { GameId } from "@/lib/games/meta";

// Živé náhledy miniher v kartách na landingu. Běží jen když je karta aktivní.
export function GamePreview({ game, active }: { game: GameId; active: boolean }) {
  if (game === "reaction") return <ReactionPreview active={active} />;
  if (game === "peripheral") return <PeripheralPreview active={active} />;
  if (game === "zablesk") return <FlashPreview active={active} />;
  return <TrackingPreview active={active} />;
}

function useTick(active: boolean, ms: number) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!active) return;
    const t = setInterval(() => setN((x) => x + 1), ms);
    return () => clearInterval(t);
  }, [active, ms]);
  return n;
}

const R_ITEMS = ["7", "#ff4d4d", "→", "42", "#22d07a", "↑", "15", "#ffd60a"];

function ReactionPreview({ active }: { active: boolean }) {
  const n = useTick(active, 900);
  const item = R_ITEMS[n % R_ITEMS.length];
  return (
    <div className="grid size-full place-items-center">
      <AnimatePresence mode="popLayout">
        <motion.span key={n} initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
          {item.startsWith("#") ? (
            <span className="block size-16 rounded-full" style={{ background: item, boxShadow: `0 0 30px ${item}88` }} />
          ) : (
            <span className="font-wider block text-6xl leading-none font-extrabold">{item}</span>
          )}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

const EDGE = [
  [12, 18], [50, 12], [88, 18], [90, 50], [88, 82], [50, 88], [12, 82], [10, 50],
];

function PeripheralPreview({ active }: { active: boolean }) {
  const n = useTick(active, 850);
  const [x, y] = EDGE[(n * 3) % EDGE.length];
  return (
    <div className="relative size-full">
      <svg viewBox="0 0 40 40" className="absolute top-1/2 left-1/2 size-9 -translate-x-1/2 -translate-y-1/2 text-accent-text" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" aria-hidden="true">
        <path d="M20 6v28M6 20h28" />
      </svg>
      {active && (
        <motion.span
          key={n}
          className="absolute size-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-fg"
          style={{ left: `${x}%`, top: `${y}%` }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: [0, 1, 1, 0], scale: [0.5, 1, 1, 0.8] }}
          transition={{ duration: 0.5, times: [0, 0.15, 0.7, 1] }}
        />
      )}
    </div>
  );
}

function FlashPreview({ active }: { active: boolean }) {
  const n = useTick(active, 1600);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    if (!active) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- krátké probliknutí po každém tiku
    setShown(true);
    const t = setTimeout(() => setShown(false), 420);
    return () => clearTimeout(t);
  }, [n, active]);
  const digits = [(n * 7 + 3) % 9 + 1, (n * 5 + 1) % 9 + 1, (n * 3 + 5) % 9 + 1];
  return (
    <div className="flex size-full items-center justify-center gap-4">
      {digits.map((d, i) => (
        <span key={i} className="font-wider w-9 text-center text-5xl leading-none font-extrabold transition-opacity duration-75" style={{ opacity: shown ? 1 : 0 }}>
          {d}
        </span>
      ))}
      {!shown && <span className="absolute text-sm text-faint">Co tam bylo?</span>}
    </div>
  );
}

const TRACKS = [
  { x: [10, 70, 30, 85], y: [20, 60, 80, 30], target: true },
  { x: [80, 20, 60, 15], y: [70, 30, 15, 65], target: true },
  { x: [45, 85, 10, 55], y: [50, 15, 40, 85] },
  { x: [25, 50, 85, 40], y: [85, 20, 60, 25] },
  { x: [65, 15, 45, 75], y: [25, 75, 55, 10] },
];

function TrackingPreview({ active }: { active: boolean }) {
  const loop = useTick(active, 6000);
  return (
    <div className="relative size-full">
      {TRACKS.map((t, i) => (
        <motion.span
          key={`${i}-${loop}`}
          className="absolute size-6 -translate-x-1/2 -translate-y-1/2 rounded-full"
          initial={{ left: `${t.x[0]}%`, top: `${t.y[0]}%`, backgroundColor: t.target ? "var(--accent)" : "#3a3450" }}
          animate={
            active
              ? {
                  left: t.x.map((v) => `${v}%`),
                  top: t.y.map((v) => `${v}%`),
                  backgroundColor: t.target ? ["var(--accent)", "var(--accent)", "#3a3450", "#3a3450"] : "#3a3450",
                }
              : undefined
          }
          transition={{ duration: 5.6, ease: "easeInOut", times: [0, 0.35, 0.7, 1] }}
        />
      ))}
    </div>
  );
}
