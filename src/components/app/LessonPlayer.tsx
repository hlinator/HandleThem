"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { Clock, Play, TriangleAlert, X } from "lucide-react";
import { useDemo, type SessionResult } from "@/lib/demo/store";
import { STEPS_PER_LANE, laneById, nodeById } from "@/lib/path/data";
import { laneDone } from "@/lib/path/progress";
import { GAMES } from "@/lib/games/meta";
import { DrillDiagram } from "@/components/landing/DrillDiagram";
import { GameShell, type GameSummary } from "@/components/games/GameShell";
import { GameIcon } from "@/components/games/GameIcon";
import { defaultSettings } from "@/components/games/stimuli";
import { ThemeToggle } from "@/components/brand/ThemeToggle";
import { ResultPanel } from "./ResultPanel";
import { cn } from "@/lib/cn";

type Step = "intro" | "warmup" | "drill" | "game" | "result";
const ORDER: Step[] = ["warmup", "drill", "game", "result"];
const LABEL: Record<Step, string> = { intro: "", warmup: "Rozcvička", drill: "Cvik", game: "Minihra", result: "Výsledek" };

const WARMUP = ["Kroužení zápěstím", "Kotníky a lýtka", "Výpady na místě", "Rychlé doteky s míčkem"];
const WARMUP_SECS = 120;
const DRILL_SECS = 360;
const GAME_SECS = 45;

export function LessonPlayer({ nodeId }: { nodeId: string }) {
  const node = nodeById(nodeId)!;
  const lane = laneById(node.lane);
  const { finishSession, completed } = useDemo();
  const [step, setStep] = useState<Step>("intro");
  const [summary, setSummary] = useState<GameSummary | null>(null);
  const [result, setResult] = useState<SessionResult | null>(null);

  const onGameFinish = (s: GameSummary) => {
    setSummary(s);
    setResult(finishSession({ kind: "lesson", game: node.game.id, nodeId: node.id }));
    setStep("result");
  };

  const settings = { ...defaultSettings(node.game.id, node.game.difficulty), duration: GAME_SECS, rounds: 3 };
  const idx = ORDER.indexOf(step);
  const doneInLane = laneDone(completed, node.lane);

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-line bg-bg/85 px-4 backdrop-blur-md sm:px-6">
        <Link href="/dnes/" aria-label="Ukončit lekci" className="grid size-11 shrink-0 place-items-center rounded-full border border-line hover:border-fg">
          <X className="size-5" />
        </Link>
        <ol className="flex flex-1 gap-1.5" aria-label="Průběh lekce">
          {ORDER.map((s, i) => (
            <li key={s} className="flex flex-1 flex-col gap-1">
              <span className="h-1.5 overflow-hidden rounded-full bg-line">
                <motion.span className="block h-full bg-accent" initial={false} animate={{ width: i < idx ? "100%" : i === idx ? "50%" : "0%" }} />
              </span>
              <span className={cn("hidden text-xs sm:block", i === idx ? "text-fg" : "text-faint")}>{LABEL[s]}</span>
            </li>
          ))}
        </ol>
        <ThemeToggle />
      </header>

      {/* mimo animovaný obal: transform rodiče by rozbil position: fixed hry */}
      {step === "game" && <GameShell settings={settings} onFinish={onGameFinish} />}

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 py-8 sm:px-6 sm:py-12">
        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.22 }} className="flex flex-1 flex-col">
            {step === "intro" && (
              <div className="flex flex-1 flex-col gap-6">
                <span className="text-sm text-muted">
                  {lane.name}, krok {node.step + 1} z {STEPS_PER_LANE}
                </span>
                <h1 className="font-wider text-[clamp(40px,9vw,80px)] leading-[0.95] font-extrabold tracking-tight">{node.title}</h1>
                <div className="flex flex-wrap gap-2 text-sm">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5">
                    <Clock className="size-4" /> {node.minutes} min
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5">
                    <GameIcon game={node.game.id} className="size-4" /> {GAMES[node.game.id].name}
                  </span>
                </div>
                <ol className="flex flex-col gap-3">
                  {(["Rozcvička, 2 minuty", `Cvik: ${node.cues.join(", ").toLowerCase()}`, `Minihra ${GAMES[node.game.id].name}, ${GAME_SECS} sekund`] as const).map((t, i) => (
                    <li key={t} className="flex gap-4 rounded-2xl border border-line p-4">
                      <span className="font-wider text-2xl leading-none font-extrabold text-accent-text">{i + 1}</span>
                      <span className="leading-snug">{t}</span>
                    </li>
                  ))}
                </ol>
                <p className="flex gap-3 rounded-2xl bg-surface p-4 text-sm text-muted">
                  <TriangleAlert className="size-5 shrink-0 text-warn" />
                  Uvolni si kolem sebe aspoň 2 × 2 metry a telefon polož tak, abys na něj viděl i při cvičení.
                </p>
                <button type="button" onClick={() => setStep("warmup")} className="mt-auto inline-flex h-14 items-center justify-center gap-2 rounded-full bg-accent text-lg font-semibold text-accent-fg hover:brightness-110 sm:self-start sm:px-10">
                  <Play className="size-5 fill-current" /> Jdeme na to
                </button>
              </div>
            )}

            {step === "warmup" && <Countdown key="w" secs={WARMUP_SECS} items={WARMUP} title="Rozcvička" onDone={() => setStep("drill")} skipLabel="Přeskočit rozcvičku" />}

            {step === "drill" && (
              <div className="flex flex-1 flex-col gap-6">
                <div>
                  <span className="text-sm text-muted">Cvik s hokejkou</span>
                  <h2 className="font-wider text-[clamp(32px,7vw,60px)] leading-none font-extrabold tracking-tight">{node.title}</h2>
                </div>
                <div className="relative overflow-hidden rounded-[32px] border border-line bg-surface p-6 sm:p-10">
                  <DrillDiagram className="w-full" speed={2.6} />
                  <span className="absolute top-4 left-4 rounded-full border border-line bg-bg/70 px-3 py-1 text-xs text-muted">Video natáčíme, zatím ukázka dráhy</span>
                </div>
                <BigTimer secs={DRILL_SECS} />
                <ul className="grid gap-2 sm:grid-cols-3">
                  {node.cues.map((c) => (
                    <li key={c} className="rounded-2xl border border-line p-4 text-[15px]">
                      {c}
                    </li>
                  ))}
                </ul>
                <button type="button" onClick={() => setStep("game")} className="mt-auto inline-flex h-14 items-center justify-center rounded-full bg-accent text-lg font-semibold text-accent-fg hover:brightness-110 sm:self-start sm:px-10">
                  Hotovo, jdu na minihru
                </button>
              </div>
            )}

            {step === "result" && summary && result && (
              <ResultPanel
                title="Lekce hotová"
                summary={summary}
                result={result}
                extra={
                  <div className="flex flex-col gap-3 rounded-[28px] border border-line p-5">
                    <span className="text-sm text-muted">{lane.name}</span>
                    <div className="flex gap-1.5">
                      {Array.from({ length: STEPS_PER_LANE }, (_, i) => (
                        <motion.span
                          key={i}
                          initial={{ scaleX: i === node.step ? 0 : 1 }}
                          animate={{ scaleX: 1 }}
                          transition={{ delay: 0.6, type: "spring", stiffness: 200, damping: 16 }}
                          className={cn("h-2.5 flex-1 origin-left rounded-full", i < doneInLane ? "bg-accent" : "bg-line")}
                        />
                      ))}
                    </div>
                    <span className="text-sm">{doneInLane >= STEPS_PER_LANE ? "Lajna dojela k brance." : `Míček se posunul na krok ${doneInLane + 1}.`}</span>
                  </div>
                }
              >
                <Link href="/dnes/" className="inline-flex h-12 items-center rounded-full bg-accent px-6 font-semibold text-accent-fg">
                  Zpátky na Dnes
                </Link>
                <Link href="/stezka/" className="inline-flex h-12 items-center rounded-full border border-line px-6 hover:border-fg">
                  Ukázat stezku
                </Link>
              </ResultPanel>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

function useCountdown(secs: number, onDone?: () => void) {
  const [left, setLeft] = useState(secs);
  useEffect(() => {
    const t = setInterval(() => setLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, []);
  useEffect(() => {
    if (left === 0) onDone?.();
  }, [left, onDone]);
  return left;
}

const mmss = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

function BigTimer({ secs }: { secs: number }) {
  const left = useCountdown(secs);
  return (
    <div className="flex items-baseline gap-3">
      <span className="font-wider tnum text-[clamp(56px,14vw,104px)] leading-none font-extrabold">{mmss(left)}</span>
      <span className="text-muted">zbývá</span>
    </div>
  );
}

function Countdown({ secs, items, title, onDone, skipLabel }: { secs: number; items: string[]; title: string; onDone: () => void; skipLabel: string }) {
  const left = useCountdown(secs, onDone);
  const per = secs / items.length;
  const current = Math.min(items.length - 1, Math.floor((secs - left) / per));
  const C = 2 * Math.PI * 70;
  return (
    <div className="flex flex-1 flex-col items-center gap-8 text-center">
      <span className="text-sm text-muted">{title}</span>
      <div className="relative grid size-[min(78vw,340px)] place-items-center">
        <svg viewBox="0 0 160 160" className="absolute inset-0 -rotate-90" aria-hidden="true">
          <circle cx="80" cy="80" r="70" fill="none" stroke="var(--line)" strokeWidth="5" />
          <circle cx="80" cy="80" r="70" fill="none" stroke="var(--accent)" strokeWidth="5" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - left / secs)} style={{ transition: "stroke-dashoffset 1s linear" }} />
        </svg>
        <span className="font-wider tnum text-[clamp(64px,18vw,112px)] leading-none font-extrabold">{mmss(left)}</span>
      </div>
      <AnimatePresence mode="wait">
        <motion.span key={current} initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -12, opacity: 0 }} className="font-wide text-2xl font-bold sm:text-3xl">
          {items[current]}
        </motion.span>
      </AnimatePresence>
      <button type="button" onClick={onDone} className="mt-auto h-12 rounded-full border border-line px-6 hover:border-fg">
        {skipLabel}
      </button>
    </div>
  );
}
