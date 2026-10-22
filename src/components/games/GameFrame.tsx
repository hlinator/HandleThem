"use client";

import type { ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Pause, Play, X } from "lucide-react";
import { GAMES, type GameId } from "@/lib/games/meta";
import { GameIcon } from "./GameIcon";

export type GameSummary = {
  game: GameId;
  secs: number;
  reps?: number;
  correct?: number;
  possible?: number;
  rounds?: number;
};

export const fmtTime = (ms: number) => {
  const t = Math.max(0, Math.floor(ms / 1000));
  return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, "0")}`;
};

/** společný obal miniher: horní lišta, odpočet, legenda. Vždy tmavý, kvůli kontrastu z dálky. */
export function GameFrame({
  game,
  stats,
  ring,
  paused,
  onPause,
  onResume,
  onStop,
  countdown,
  legend,
  children,
}: {
  game: GameId;
  stats: ReactNode;
  /** 0–1, kolik času zbývá; null když hra nemá limit */
  ring: number | null;
  paused?: boolean;
  onPause?: () => void;
  onResume?: () => void;
  onStop: () => void;
  countdown: number | null;
  legend?: string[];
  children: ReactNode;
}) {
  const R = 15;
  const C = 2 * Math.PI * R;
  return (
    <div data-theme="dark" className="fixed inset-0 z-50 overflow-hidden bg-[#06050b] text-fg">
      <div className="absolute inset-x-0 top-0 z-30 flex items-center justify-between gap-3 px-4 pt-[max(14px,env(safe-area-inset-top))] sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <span className="relative grid size-11 shrink-0 place-items-center text-accent-text">
            {ring !== null && (
              <svg viewBox="0 0 36 36" className="absolute inset-0 -rotate-90" aria-hidden="true">
                <circle cx="18" cy="18" r={R} fill="none" stroke="var(--line)" strokeWidth="2.5" />
                <circle
                  cx="18"
                  cy="18"
                  r={R}
                  fill="none"
                  stroke="var(--accent)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeDasharray={C}
                  strokeDashoffset={C * (1 - ring)}
                  style={{ transition: "stroke-dashoffset 200ms linear" }}
                />
              </svg>
            )}
            <GameIcon game={game} className="size-5" />
          </span>
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold">{GAMES[game].name}</div>
            <div className="tnum flex gap-3 text-sm text-muted">{stats}</div>
          </div>
        </div>
        <div className="flex gap-2">
          {onPause && !paused && countdown === null && (
            <button type="button" onClick={onPause} className="grid size-11 place-items-center rounded-full border border-line hover:border-accent-text" aria-label="Pozastavit">
              <Pause className="size-4" />
            </button>
          )}
          {onResume && paused && (
            <button type="button" onClick={onResume} className="grid size-11 place-items-center rounded-full border border-line hover:border-accent-text" aria-label="Pokračovat">
              <Play className="size-4" />
            </button>
          )}
          <button type="button" onClick={onStop} className="flex h-11 items-center gap-2 rounded-full border border-line px-4 text-sm hover:border-accent-text">
            <X className="size-4" />
            Konec
          </button>
        </div>
      </div>

      {children}

      <AnimatePresence>
        {countdown !== null && (
          <motion.div
            className="absolute inset-0 z-20 grid place-items-center bg-[#06050b]"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="flex flex-col items-center gap-6 px-6 text-center">
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={countdown}
                  initial={{ scale: 0.4, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 1.6, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 18 }}
                  className="font-wider block text-[clamp(7rem,32vmin,20rem)] leading-none font-extrabold text-accent-text"
                >
                  {countdown}
                </motion.span>
              </AnimatePresence>
              <p className="max-w-md text-base text-muted">{GAMES[game].howTo}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {paused && (
        <div className="absolute inset-0 z-20 grid place-items-center bg-[#06050b]/80 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4">
            <span className="font-wider text-5xl font-bold">Pauza</span>
            <button type="button" onClick={onResume} className="h-12 rounded-full bg-accent px-6 font-semibold text-accent-fg">
              Pokračovat
            </button>
          </div>
        </div>
      )}

      {legend && legend.length > 0 && (
        <div className="absolute inset-x-0 bottom-0 z-30 px-4 pb-[max(16px,env(safe-area-inset-bottom))] text-center text-sm leading-relaxed text-faint">
          {legend.map((l) => (
            <div key={l}>{l}</div>
          ))}
        </div>
      )}
    </div>
  );
}
