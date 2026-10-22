"use client";

import { useEffect, useRef, useState } from "react";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { GameFrame, type GameSummary } from "./GameFrame";
import { PRESETS, type GameSettings } from "./stimuli";

type Phase = "countdown" | "show" | "move" | "pick" | "result";
type Dot = { id: number; isTarget: boolean; selected: boolean };
type Phys = { id: number; x: number; y: number; vx: number; vy: number };

const DOT_R = 26;

// Sled: fyzika běží přes requestAnimationFrame a píše rovnou do style.transform,
// přes React state by to při 60 fps zbytečně překreslovalo celý strom.
export function TrackingGame({ settings, onFinish }: { settings: GameSettings; onFinish: (s: GameSummary) => void }) {
  const cfg = PRESETS.tracking[settings.difficulty];
  const totalRounds = settings.rounds;
  const [phase, setPhase] = useState<Phase>("countdown");
  const [round, setRound] = useState(1);
  const [cd, setCd] = useState(3);
  const [dots, setDots] = useState<Dot[]>([]);
  const [score, setScore] = useState({ correct: 0, possible: 0 });
  const [roundHit, setRoundHit] = useState(0);

  const areaRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef(0);
  const lastTsRef = useRef(0);
  const physRef = useRef<Phys[]>([]);
  const elRefs = useRef<Record<number, HTMLButtonElement | null>>({});
  const sizeRef = useRef({ w: 0, h: 0 });
  const phaseRef = useRef<Phase>("countdown");
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const scoreRef = useRef({ correct: 0, possible: 0 });
  const startRef = useRef(0);

  const setPh = (p: Phase) => {
    phaseRef.current = p;
    setPhase(p);
  };
  const add = (t: ReturnType<typeof setTimeout>) => timersRef.current.push(t);
  const clearTimers = () => {
    timersRef.current.forEach((t) => clearTimeout(t));
    timersRef.current = [];
  };
  const place = () =>
    physRef.current.forEach((p) => {
      const el = elRefs.current[p.id];
      if (el) el.style.transform = `translate(${p.x - DOT_R}px, ${p.y - DOT_R}px)`;
    });

  const step = (ts: number) => {
    const dt = Math.min(0.05, (ts - lastTsRef.current) / 1000);
    lastTsRef.current = ts;
    const { w, h } = sizeRef.current;
    for (const p of physRef.current) {
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      if (p.x < DOT_R) { p.x = DOT_R; p.vx *= -1; }
      if (p.x > w - DOT_R) { p.x = w - DOT_R; p.vx *= -1; }
      if (p.y < DOT_R) { p.y = DOT_R; p.vy *= -1; }
      if (p.y > h - DOT_R) { p.y = h - DOT_R; p.vy *= -1; }
    }
    place();
    rafRef.current = requestAnimationFrame(step);
  };

  const buildRound = () => {
    const rect = areaRef.current!.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;
    sizeRef.current = { w, h };
    const idx = [...Array(cfg.dots).keys()].sort(() => Math.random() - 0.5);
    const targets = new Set(idx.slice(0, cfg.targets));
    // na úzkém mobilu zpomalím, jinak se míčky odráží moc často
    const speed = cfg.speed * Math.min(1, w / 700 + 0.35);
    physRef.current = Array.from({ length: cfg.dots }, (_, i) => {
      const a = Math.random() * Math.PI * 2;
      return { id: i, x: DOT_R + Math.random() * (w - 2 * DOT_R), y: DOT_R + Math.random() * (h - 2 * DOT_R), vx: Math.cos(a) * speed, vy: Math.sin(a) * speed };
    });
    setDots(physRef.current.map((p) => ({ id: p.id, isTarget: targets.has(p.id), selected: false })));
    setRoundHit(0);
    requestAnimationFrame(place);
    setPh("show");
    add(
      setTimeout(() => {
        setPh("move");
        lastTsRef.current = performance.now();
        rafRef.current = requestAnimationFrame(step);
        add(
          setTimeout(() => {
            cancelAnimationFrame(rafRef.current);
            setPh("pick");
          }, cfg.track * 1000),
        );
      }, 2000),
    );
  };

  useEffect(() => {
    let c = 3;
    const id = setInterval(() => {
      c -= 1;
      if (c <= 0) {
        clearInterval(id);
        startRef.current = Date.now();
        buildRound();
      } else setCd(c);
    }, 800);
    timersRef.current.push(id);
    return () => {
      clearTimers();
      cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- jen při mountu
  }, []);

  const selectedCount = dots.filter((d) => d.selected).length;

  const toggle = (id: number) => {
    if (phaseRef.current !== "pick") return;
    setDots((prev) => {
      const d = prev.find((x) => x.id === id)!;
      const sel = prev.filter((x) => x.selected).length;
      if (!d.selected && sel >= cfg.targets) return prev;
      return prev.map((x) => (x.id === id ? { ...x, selected: !x.selected } : x));
    });
  };

  const evaluate = () => {
    const hit = dots.filter((d) => d.selected && d.isTarget).length;
    const ns = { correct: scoreRef.current.correct + hit, possible: scoreRef.current.possible + cfg.targets };
    scoreRef.current = ns;
    setScore(ns);
    setRoundHit(hit);
    setPh("result");
  };

  const end = (rounds: number) => {
    clearTimers();
    cancelAnimationFrame(rafRef.current);
    onFinish({
      game: "tracking",
      correct: scoreRef.current.correct,
      possible: scoreRef.current.possible,
      rounds,
      secs: Math.round((Date.now() - startRef.current) / 1000),
    });
  };

  const advance = () => {
    if (round >= totalRounds) end(totalRounds);
    else {
      setRound((r) => r + 1);
      buildRound();
    }
  };

  const look = (d: Dot) => {
    if (phase === "show" && d.isTarget) return "target";
    if (phase === "pick" && d.selected) return "target";
    if (phase === "result") {
      if (d.isTarget && d.selected) return "hit";
      if (d.selected) return "wrong";
      if (d.isTarget) return "missed";
    }
    return "idle";
  };

  return (
    <GameFrame
      game="tracking"
      stats={
        <>
          <span>
            Kolo {round}/{totalRounds}
          </span>
          <span>
            {score.correct}/{score.possible} správně
          </span>
        </>
      }
      ring={phase === "countdown" ? null : (round - (phase === "result" ? 0 : 1)) / totalRounds}
      onStop={() => end(round - 1)}
      countdown={phase === "countdown" ? cd : null}
    >
      <div ref={areaRef} className="absolute inset-x-3 top-20 bottom-32 rounded-[28px] border border-line/60 sm:inset-x-6">
        {dots.map((d) => {
          const l = look(d);
          return (
            <button
              key={d.id}
              type="button"
              ref={(el) => {
                elRefs.current[d.id] = el;
              }}
              onClick={() => toggle(d.id)}
              disabled={phase !== "pick"}
              aria-label={`Míček ${d.id + 1}${d.selected ? ", označený" : ""}`}
              aria-pressed={d.selected}
              className={cn(
                "absolute top-0 left-0 grid place-items-center rounded-full transition-[background-color,box-shadow,outline-color] duration-200 disabled:cursor-default",
                l === "idle" && "bg-[#3a3450]",
                l === "target" && "bg-accent shadow-[0_0_26px_var(--glow)]",
                l === "hit" && "bg-ok text-[#06050b]",
                l === "wrong" && "bg-[#ff5d5d] text-[#06050b]",
                l === "missed" && "bg-[#2a2440] outline-[3px] outline-offset-0 outline-dashed outline-warn",
              )}
              style={{ width: DOT_R * 2, height: DOT_R * 2 }}
            >
              {l === "hit" && <Check className="size-6" strokeWidth={3} />}
              {l === "wrong" && <X className="size-6" strokeWidth={3} />}
            </button>
          );
        })}
      </div>

      <div className="absolute inset-x-0 bottom-0 z-30 flex min-h-28 flex-col items-center justify-center gap-3 px-4 pb-[max(20px,env(safe-area-inset-bottom))] text-center">
        {phase === "show" && <p className="text-lg font-semibold text-accent-text">Zapamatuj si zvýrazněné míčky</p>}
        {phase === "move" && <p className="text-muted">Sleduj je očima</p>}
        {phase === "pick" && (
          <>
            <p className="text-muted">
              Označ {cfg.targets} míčky ({selectedCount}/{cfg.targets})
            </p>
            <button
              type="button"
              disabled={selectedCount !== cfg.targets}
              onClick={evaluate}
              className="h-12 rounded-full bg-accent px-7 font-semibold text-accent-fg transition-opacity disabled:opacity-40"
            >
              Vyhodnotit
            </button>
          </>
        )}
        {phase === "result" && (
          <>
            <p className="font-wide text-xl font-bold">
              {roundHit}/{cfg.targets} správně
            </p>
            <button type="button" onClick={advance} className="h-12 rounded-full bg-accent px-7 font-semibold text-accent-fg">
              {round >= totalRounds ? "Zobrazit výsledek" : "Další kolo"}
            </button>
          </>
        )}
      </div>
    </GameFrame>
  );
}
