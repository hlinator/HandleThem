"use client";

import { StimulusEngine } from "./StimulusEngine";
import { TrackingGame } from "./TrackingGame";
import { ENGINE_CONFIGS, type GameSettings } from "./stimuli";
import type { GameSummary } from "./GameFrame";

export type { GameSummary };

/** jediný vstup do miniher pro lekce i volný trénink */
export function GameShell({ settings, onFinish }: { settings: GameSettings; onFinish: (s: GameSummary) => void }) {
  if (settings.game === "tracking") return <TrackingGame settings={settings} onFinish={onFinish} />;
  return <StimulusEngine settings={settings} config={ENGINE_CONFIGS[settings.game]} onFinish={onFinish} />;
}

export function summaryLine(s: GameSummary) {
  if (s.possible !== undefined) {
    const pct = s.possible ? Math.round(((s.correct ?? 0) / s.possible) * 100) : 0;
    return { big: `${pct} %`, label: `${s.correct}/${s.possible} míčků správně` };
  }
  return { big: String(s.reps ?? 0), label: `podnětů za ${s.secs} s` };
}
