"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "motion/react";
import { cn } from "@/lib/cn";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { DrillDiagram } from "./DrillDiagram";

const PHASES = [
  { id: "rozcvicka", title: "Rozcvička", time: "2 min", text: "Zápěstí, kotníky a pár rychlých dotyků s míčkem, ať se nezraníš." },
  { id: "cvik", title: "Cvik s hokejkou", time: "6 min", text: "Cvičíš souběžně s videem. Každý cvik má tři úrovně, začneš na té nejlehčí." },
  { id: "minihra", title: "Minihra", time: "3 min", text: "Pořád vedeš míček, jen oči máš na displeji a reaguješ na podněty." },
  { id: "vysledek", title: "Výsledek", time: "+50 XP", text: "Míček na stezce se posune o uzel a přibudou body do ranku." },
] as const;

const STEP_MS = 4800;

export function LessonScrubber() {
  const [active, setActive] = useState(0);
  const [auto, setAuto] = useState(true);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.4 });

  useEffect(() => {
    if (!auto || !inView) return;
    const t = setTimeout(() => setActive((a) => (a + 1) % PHASES.length), STEP_MS);
    return () => clearTimeout(t);
  }, [active, auto, inView]);

  return (
    <div ref={ref} className="grid items-center gap-10 lg:grid-cols-[1fr_minmax(0,420px)] lg:gap-16">
      <div className="flex flex-col gap-2">
        <ol className="flex flex-col">
          {PHASES.map((p, i) => {
            const on = i === active;
            return (
              <li key={p.id}>
                <button
                  type="button"
                  onClick={() => {
                    setActive(i);
                    setAuto(false);
                  }}
                  aria-current={on ? "step" : undefined}
                  className={cn("group relative flex w-full gap-4 py-4 text-left sm:gap-6", i > 0 && "border-t border-line")}
                >
                  <span className={cn("font-wider tnum w-10 shrink-0 text-4xl leading-none font-extrabold transition-colors sm:w-12 sm:text-5xl", on ? "text-accent-text" : "text-line group-hover:text-faint")}>
                    {i + 1}
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col gap-1">
                    <span className="flex items-baseline justify-between gap-3">
                      <span className={cn("text-xl font-semibold transition-colors sm:text-2xl", on ? "text-fg" : "text-muted")}>{p.title}</span>
                      <span className="tnum shrink-0 text-sm text-muted">{p.time}</span>
                    </span>
                    <AnimatePresence initial={false}>
                      {on && (
                        <motion.span
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="block overflow-hidden text-[15px] leading-relaxed text-muted"
                        >
                          {p.text}
                        </motion.span>
                      )}
                    </AnimatePresence>
                    <span className="mt-2 block h-0.5 overflow-hidden rounded-full bg-line">
                      {on && (
                        <motion.span
                          key={`${active}-${auto}`}
                          className="block h-full bg-accent"
                          initial={{ width: auto ? "0%" : "100%" }}
                          animate={{ width: "100%" }}
                          transition={{ duration: auto && inView ? STEP_MS / 1000 : 0, ease: "linear" }}
                        />
                      )}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
        {!auto && (
          <button type="button" onClick={() => setAuto(true)} className="self-start text-sm text-muted underline-offset-4 hover:text-fg hover:underline">
            Přehrávat automaticky
          </button>
        )}
      </div>

      {/* telefon položený na zemi, dva metry od hráče */}
      <div className="mx-auto w-full max-w-[340px] lg:max-w-none">
        <div className="relative aspect-[10/16] overflow-hidden rounded-[36px] border border-line bg-[#06050b] p-5 shadow-[0_30px_100px_-40px_var(--glow)]" data-theme="dark">
          <AnimatePresence mode="wait">
            <motion.div
              key={PHASES[active].id}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.25 }}
              className="flex size-full flex-col text-fg"
            >
              <PhaseScreen id={PHASES[active].id} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function PhaseScreen({ id }: { id: (typeof PHASES)[number]["id"] }) {
  if (id === "rozcvicka") return <WarmupScreen />;
  if (id === "cvik")
    return (
      <div className="flex size-full flex-col justify-between">
        <span className="text-sm text-muted">Cvik 2 ze 3</span>
        <DrillDiagram className="w-full" />
        <div>
          <div className="font-wide text-3xl font-bold">Osmičky v pohybu</div>
          <div className="mt-1 text-muted">Hokejka nízko, hlava nahoru</div>
        </div>
      </div>
    );
  if (id === "minihra") return <MiniGameScreen />;
  return (
    <div className="flex size-full flex-col items-center justify-center gap-3 text-center">
      <span className="text-sm text-muted">Lekce hotová</span>
      <span className="font-wider text-6xl font-extrabold text-accent-text">
        +<AnimatedNumber value={50} />
      </span>
      <span className="text-lg font-semibold">XP</span>
      <div className="mt-4 flex gap-2">
        {[1, 1, 1, 0, 0, 0].map((d, i) => (
          <motion.span
            key={i}
            initial={{ scale: i === 2 ? 0 : 1 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 300, damping: 12 }}
            className={cn("size-4 rounded-full border-2", d ? "border-accent bg-accent" : "border-line")}
          />
        ))}
      </div>
      <span className="text-sm text-muted">Vedení míčku 3 ze 6</span>
    </div>
  );
}

function WarmupScreen() {
  const [left, setLeft] = useState(120);
  useEffect(() => {
    const t = setInterval(() => setLeft((s) => (s <= 100 ? 120 : s - 1)), 1000);
    return () => clearInterval(t);
  }, []);
  const C = 2 * Math.PI * 70;
  return (
    <div className="flex size-full flex-col items-center justify-center gap-6">
      <div className="relative grid size-52 place-items-center">
        <svg viewBox="0 0 160 160" className="absolute inset-0 -rotate-90" aria-hidden="true">
          <circle cx="80" cy="80" r="70" fill="none" stroke="var(--line)" strokeWidth="6" />
          <circle cx="80" cy="80" r="70" fill="none" stroke="var(--accent)" strokeWidth="6" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - left / 120)} style={{ transition: "stroke-dashoffset 1s linear" }} />
        </svg>
        <span className="font-wider tnum text-6xl font-extrabold">
          {Math.floor(left / 60)}:{String(left % 60).padStart(2, "0")}
        </span>
      </div>
      <span className="text-center text-lg font-semibold">Kroužení zápěstím</span>
    </div>
  );
}

const MINI = [
  { text: "27" },
  { circle: "#4d8bff" },
  { text: "←" },
  { text: "84" },
  { circle: "#ffd60a" },
  { text: "VÝSKOK" },
];

function MiniGameScreen() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % MINI.length), 1000);
    return () => clearInterval(t);
  }, []);
  const s = MINI[i];
  return (
    <div className="flex size-full flex-col">
      <div className="flex justify-between text-sm text-muted">
        <span>Reakce</span>
        <span className="tnum">0:{String(48 - (i % 10)).padStart(2, "0")}</span>
      </div>
      <div className="grid flex-1 place-items-center">
        <AnimatePresence mode="popLayout">
          <motion.span
            key={i}
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.14 }}
            className="block"
          >
            {"circle" in s ? (
              <span className="block size-32 rounded-full" style={{ background: s.circle, boxShadow: `0 0 50px ${s.circle}aa` }} />
            ) : (
              <span className={cn("font-wider block leading-none font-extrabold", s.text!.length > 3 ? "text-4xl" : "text-8xl")}>{s.text}</span>
            )}
          </motion.span>
        </AnimatePresence>
      </div>
      <span className="text-center text-sm text-faint">Řekni nahlas, co vidíš</span>
    </div>
  );
}
