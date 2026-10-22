"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { GameFrame, fmtTime, type GameSummary } from "./GameFrame";
import { FixationCross, Stimulus } from "./Stimulus";
import type { EngineConfig, GameSettings, Stim } from "./stimuli";

type Phase = "countdown" | "running" | "paused" | "done";

// Jádro z původního prototypu. Časování drží refy, protože setTimeout nevidí čerstvý state.
export function StimulusEngine({
  settings,
  config,
  onFinish,
}: {
  settings: GameSettings;
  config: EngineConfig;
  onFinish: (s: GameSummary) => void;
}) {
  const [phase, setPhase] = useState<Phase>("countdown");
  const [stim, setStim] = useState<Stim | null>(null);
  const [count, setCount] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [cd, setCd] = useState(3);

  const phaseRef = useRef<Phase>("countdown");
  const countRef = useRef(0);
  const prevKeyRef = useRef<string | null>(null);
  const runStartRef = useRef(0);
  const accumRef = useRef(0);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const audioRef = useRef<AudioContext | null>(null);
  const cycleRef = useRef<() => void>(() => {});
  const finishedRef = useRef(false);

  const add = (t: ReturnType<typeof setTimeout>) => {
    timersRef.current.push(t);
    return t;
  };
  const clearAll = () => {
    timersRef.current.forEach((t) => {
      clearTimeout(t);
      clearInterval(t);
    });
    timersRef.current = [];
  };
  const setPh = (p: Phase) => {
    phaseRef.current = p;
    setPhase(p);
  };
  const nowEl = () => accumRef.current + (phaseRef.current === "running" ? Date.now() - runStartRef.current : 0);

  const beep = () => {
    if (!settings.sound) return;
    try {
      const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = audioRef.current ?? new Ctx();
      audioRef.current = ctx;
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "sine";
      o.frequency.value = 680;
      g.gain.setValueAtTime(0.0001, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.22, ctx.currentTime + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.12);
      o.connect(g);
      g.connect(ctx.destination);
      o.start();
      o.stop(ctx.currentTime + 0.13);
    } catch {
      // bez zvuku se hrát dá
    }
  };

  const finish = () => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    const secs = Math.round(nowEl() / 1000);
    clearAll();
    setPh("done");
    onFinish({ game: settings.game, reps: countRef.current, secs });
  };

  const tick = () => {
    if (phaseRef.current !== "running") return;
    const e = nowEl();
    setElapsed(e);
    if (settings.duration && e / 1000 >= settings.duration) finish();
  };

  useEffect(() => {
    cycleRef.current = () => {
      if (phaseRef.current !== "running") return;
      const el = nowEl();
      const st = config.generate(prevKeyRef.current, settings);
      prevKeyRef.current = st.key;
      setStim(st);
      countRef.current += 1;
      setCount(countRef.current);
      beep();
      const showMs = config.showMs(settings, el);
      const cycleMs = config.cycleMs(settings, el);
      add(
        setTimeout(() => {
          if (phaseRef.current !== "running") return;
          setStim(null);
          add(setTimeout(() => phaseRef.current === "running" && cycleRef.current(), Math.max(0, cycleMs - showMs)));
        }, showMs),
      );
    };
  });

  useEffect(() => {
    let c = 3;
    const id = setInterval(() => {
      c -= 1;
      if (c <= 0) {
        clearInterval(id);
        accumRef.current = 0;
        runStartRef.current = Date.now();
        setPh("running");
        add(setInterval(tick, 200));
        cycleRef.current();
      } else setCd(c);
    }, 800);
    timersRef.current.push(id);
    return () => clearAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- spouští se jen jednou po mountu
  }, []);

  const pause = () => {
    if (phaseRef.current !== "running") return;
    accumRef.current += Date.now() - runStartRef.current;
    setPh("paused");
    clearAll();
    setStim(null);
  };
  const resume = () => {
    runStartRef.current = Date.now();
    setPh("running");
    add(setInterval(tick, 200));
    cycleRef.current();
  };

  const remaining = settings.duration ? settings.duration * 1000 - elapsed : null;

  return (
    <GameFrame
      game={settings.game}
      stats={
        <>
          <span>{count} podnětů</span>
          <span>{remaining !== null ? fmtTime(remaining) : fmtTime(elapsed)}</span>
        </>
      }
      ring={remaining !== null && settings.duration ? remaining / (settings.duration * 1000) : null}
      paused={phase === "paused"}
      onPause={pause}
      onResume={resume}
      onStop={finish}
      countdown={phase === "countdown" ? cd : null}
      legend={config.legend(settings)}
    >
      {config.fixation && phase !== "countdown" && <FixationCross />}
      {phase === "running" && stim && (
        <motion.div
          key={stim.key + count}
          initial={{ opacity: 0, scale: 0.82 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.14, ease: "easeOut" }}
          className="absolute z-10 -translate-x-1/2 -translate-y-1/2 text-center"
          style={{ left: stim.pos ? `${stim.pos.left}%` : "50%", top: stim.pos ? `${stim.pos.top}%` : "50%" }}
          aria-live="off"
        >
          <Stimulus stim={stim} />
        </motion.div>
      )}
    </GameFrame>
  );
}
