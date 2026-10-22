"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import Link from "next/link";
import { cn } from "@/lib/cn";

// Mini Periferie v hero: oči na křížku, klepni, když blikne dírka na okraji.
// Je to jen ochutnávka, skutečné minihry se hrají s míčkem u hokejky.

const ROUNDS = 5;
const WINDOW_MS = 1100;

type Phase = "idle" | "wait" | "lit" | "hit" | "miss" | "early" | "done";
type Hole = { x: number; y: number; s: number; ring: number; delay?: number };

function buildHoles(): Hole[] {
  const rings = [
    { n: 8, r: 0.37, s: 9.5, off: 0.39 },
    { n: 17, r: 0.73, s: 8.2, off: 0.1 },
  ];
  const holes: Hole[] = [];
  rings.forEach((ring, ri) => {
    for (let k = 0; k < ring.n; k++) {
      const a = (Math.PI * 2 * k) / ring.n + ring.off;
      holes.push({ x: ring.r * Math.cos(a), y: ring.r * Math.sin(a), s: ring.s, ring: ri });
    }
  });
  // úvodní animace: dírky nejblíž osmičce se rozsvítí postupně
  let order = 0;
  let last = -1;
  for (let i = 0; i <= 56; i++) {
    const t = (Math.PI * 2 * i) / 56;
    const d = 1 + Math.sin(t) ** 2;
    const lx = (0.82 * Math.cos(t)) / d;
    const ly = (1.6 * 0.82 * Math.sin(t) * Math.cos(t)) / d;
    let best = 0;
    let bestD = 99;
    holes.forEach((h, idx) => {
      const dist = (h.x - lx) ** 2 + (h.y - ly) ** 2;
      if (dist < bestD) {
        bestD = dist;
        best = idx;
      }
    });
    if (best !== last && holes[best].delay === undefined) holes[best].delay = order++ * 65;
    last = best;
  }
  return holes;
}

const randomDelay = () => 900 + Math.random() * 1500;
const pick = (arr: number[]) => arr[Math.floor(Math.random() * arr.length)];

export function BallDemo() {
  const holes = useMemo(() => buildHoles(), []);
  const outer = useMemo(() => holes.map((h, i) => (h.ring === 1 ? i : -1)).filter((i) => i >= 0), [holes]);
  const [phase, setPhase] = useState<Phase>("idle");
  const [lit, setLit] = useState(-1);
  const [results, setResults] = useState<(number | null)[]>([]);
  const [intro, setIntro] = useState(true);
  const litAt = useRef(0);
  const resultsRef = useRef<(number | null)[]>([]);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const reduce = useReducedMotion();

  // náklon míčku za kurzorem
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [9, -9]), { stiffness: 120, damping: 14 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-9, 9]), { stiffness: 120, damping: 14 });

  const clear = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };
  useEffect(() => {
    const t = setTimeout(() => setIntro(false), 2800);
    return () => {
      clearTimeout(t);
      clear();
    };
  }, []);

  const arm = () => {
    clear();
    timers.current.push(
      setTimeout(() => {
        const i = pick(outer);
        litAt.current = performance.now();
        setLit(i);
        setPhase("lit");
        timers.current.push(
          setTimeout(() => {
            setLit(-1);
            record(null);
          }, WINDOW_MS),
        );
      }, randomDelay()),
    );
  };

  const record = (ms: number | null) => {
    clear();
    const next = [...resultsRef.current, ms];
    resultsRef.current = next;
    setResults(next);
    if (next.length >= ROUNDS) return setPhase("done");
    setPhase(ms === null ? "miss" : "hit");
    timers.current.push(
      setTimeout(() => {
        setPhase("wait");
        arm();
      }, 750),
    );
  };

  const start = () => {
    clear();
    setIntro(false);
    resultsRef.current = [];
    setResults([]);
    setLit(-1);
    setPhase("wait");
    arm();
  };

  const tap = () => {
    if (phase === "idle" || phase === "done") return start();
    if (phase === "early") {
      setPhase("wait");
      return arm();
    }
    if (phase === "wait") {
      clear();
      return setPhase("early");
    }
    if (phase === "lit") {
      const ms = Math.round(performance.now() - litAt.current);
      setLit(-1);
      record(ms);
    }
  };

  const hits = results.filter((r): r is number => r !== null);
  const avg = hits.length ? Math.round(hits.reduce((a, b) => a + b, 0) / hits.length) : null;
  const last = results[results.length - 1];
  const attempt = Math.min(results.length + 1, ROUNDS);

  const status: Record<Phase, [string, string]> = {
    idle: ["Klepni na míček", "Oči nech na křížku uprostřed. Jakmile blikne dírka na okraji, klepni."],
    wait: ["Oči na křížek…", `Pokus ${attempt} z ${ROUNDS}`],
    lit: ["Teď!", `Pokus ${attempt} z ${ROUNDS}`],
    hit: [`${last ?? 0} ms`, `Pokus ${results.length} z ${ROUNDS}`],
    miss: ["Ujelo ti to", `Pokus ${results.length} z ${ROUNDS}`],
    early: ["Moc brzo", "Počkej, až dírka blikne. Klepni a jedeme dál."],
    done: [
      avg !== null ? `Průměr ${avg} ms` : "Nic nechytnuto",
      `Chytil jsi ${hits.length} z ${ROUNDS}. Tohle je tvoje výchozí číslo. V aplikaci uvidíš, jak se mění.`,
    ],
  };

  return (
    <div className="flex w-full flex-col items-center gap-5">
      <div
        className="w-full max-w-[440px]"
        style={{ perspective: 900 }}
        onPointerMove={(e) => {
          if (reduce) return;
          const r = e.currentTarget.getBoundingClientRect();
          mx.set((e.clientX - r.left) / r.width - 0.5);
          my.set((e.clientY - r.top) / r.height - 0.5);
        }}
        onPointerLeave={() => {
          mx.set(0);
          my.set(0);
        }}
      >
        <motion.button
          type="button"
          onClick={tap}
          aria-label={phase === "idle" || phase === "done" ? "Začít ukázku Periferie" : "Klepnout"}
          style={{ rotateX: rx, rotateY: ry }}
          whileTap={{ scale: 0.985 }}
          className="relative block aspect-square w-full rounded-full border border-line shadow-[0_40px_120px_-40px_var(--glow)]"
        >
          <span
            className="absolute inset-0 rounded-full"
            style={{ background: "radial-gradient(circle at 34% 28%, var(--ball-hi), var(--ball) 68%)" }}
          />
          {holes.map((h, i) => (
            <span
              key={i}
              aria-hidden="true"
              className="absolute block -translate-x-1/2 -translate-y-1/2 rounded-full transition-[background-color,box-shadow] duration-75"
              style={{
                left: `${50 + h.x * 43}%`,
                top: `${50 + h.y * 43}%`,
                width: `${h.s}%`,
                aspectRatio: "1",
                background: i === lit ? "var(--fg)" : "var(--hole)",
                boxShadow:
                  i === lit
                    ? "0 0 0 3px var(--accent-text), 0 0 30px 8px var(--glow)"
                    : "inset 0 2px 3px rgb(0 0 0 / 0.35)",
              }}
            >
              {intro && h.delay !== undefined && (
                <span
                  className="ht-flash absolute inset-0 rounded-full bg-accent"
                  style={{ animationDelay: `${h.delay}ms` }}
                />
              )}
            </span>
          ))}
          {/* fixační křížek místo středové dírky */}
          <span aria-hidden="true" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-accent-text">
            <svg viewBox="0 0 40 40" className="size-[clamp(28px,9vw,44px)]" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
              <path d="M20 6v28M6 20h28" />
            </svg>
          </span>
        </motion.button>
      </div>

      <div role="status" aria-live="polite" className="flex min-h-[88px] w-full max-w-[440px] flex-col items-center gap-1 text-center">
        <motion.span
          key={status[phase][0]}
          initial={{ y: 8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="font-wide tnum text-2xl font-bold tracking-tight sm:text-3xl"
        >
          {status[phase][0]}
        </motion.span>
        <span className="text-sm leading-relaxed text-muted sm:text-[15px]">{status[phase][1]}</span>
      </div>

      <div className="flex gap-1.5" aria-label="Tvoje pokusy">
        {Array.from({ length: ROUNDS }, (_, i) => {
          const r = results[i];
          const has = i < results.length;
          return (
            <motion.span
              key={i}
              initial={false}
              animate={{ scale: has ? [1.25, 1] : 1 }}
              className={cn(
                "tnum grid h-9 w-14 place-items-center rounded-xl border text-sm sm:w-16",
                has && r !== null && "border-accent bg-accent-soft text-fg",
                has && r === null && "border-line text-faint line-through",
                !has && "border-line text-faint",
              )}
            >
              {has ? (r ?? "–") : "·"}
            </motion.span>
          );
        })}
      </div>

      {phase === "done" && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap justify-center gap-2">
          <Link href="/dnes/" className="inline-flex h-12 items-center rounded-full bg-accent px-6 font-semibold text-accent-fg hover:brightness-110">
            Pokračovat v aplikaci
          </Link>
          <button type="button" onClick={start} className="h-12 rounded-full border border-line px-5 hover:border-accent-text">
            Hrát znovu
          </button>
        </motion.div>
      )}
    </div>
  );
}
