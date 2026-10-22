"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { GameId } from "@/lib/games/meta";
import { rankFor, type RankState } from "@/lib/progress/ranks";
import { nodeById } from "@/lib/path/data";
import { addDays, sessionsInWeek, todayLocal } from "@/lib/progress/streak";
import { xpForSession, type SessionKind } from "@/lib/progress/xp";

// Demo data v localStorage. Později to nahradí Supabase (tabulky sessions + profiles),
// rozhraní useDemo() by mělo zůstat stejné.

export type Session = { day: string; kind: SessionKind; game: GameId; nodeId?: string };

export type DemoState = {
  v: 1;
  name: string;
  /** 5. pád pro pozdrav */
  nameVocative: string;
  xp: number;
  completed: string[];
  sessions: Session[];
};

export type SessionResult = {
  kind: SessionKind;
  nodeId?: string;
  game: GameId;
  base: number;
  bonus: number;
  before: RankState;
  after: RankState;
  /** povýšení na nový stupeň nebo rank */
  levelUp: boolean;
};

const KEY = "handlethem-demo-v1";

export function seedState(today = todayLocal()): DemoState {
  const back = [2, 5, 9, 13, 16, 22, 29, 36];
  // nejstarší lekce odpovídají hotovým uzlům, ať historie sedí se stezkou
  const lessons = ["vedeni-2", "hlava-3", "klicky-1", "hlava-2", "vedeni-1", "hlava-1"];
  let li = 0;
  return {
    v: 1,
    name: "Kuba",
    nameVocative: "Kubo",
    xp: 1240,
    completed: ["vedeni-1", "vedeni-2", "klicky-1", "hlava-1", "hlava-2", "hlava-3"],
    sessions: back
      .map((d, i): Session => {
        if (i % 3 === 2) return { day: addDays(today, -d), kind: "free", game: "tracking" };
        const k = li++;
        return { day: addDays(today, -d), kind: "lesson", game: nodeById(lessons[k])!.game.id, nodeId: lessons[k] };
      })
      .reverse(),
  };
}

function load(): DemoState | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as DemoState;
    return parsed?.v === 1 ? parsed : null;
  } catch {
    return null;
  }
}

function save(s: DemoState) {
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    // privátní okno apod., demo pojede i bez uložení
  }
}

type Ctx = {
  state: DemoState;
  completed: ReadonlySet<string>;
  days: string[];
  today: string;
  lastResult: SessionResult | null;
  finishSession: (s: { kind: SessionKind; game: GameId; nodeId?: string }) => SessionResult;
  reset: () => void;
};

const DemoContext = createContext<Ctx | null>(null);

export function DemoProvider({ children }: { children: ReactNode }) {
  const [today] = useState(() => todayLocal());
  const [state, setState] = useState<DemoState>(() => seedState(today));
  const [lastResult, setLastResult] = useState<SessionResult | null>(null);

  useEffect(() => {
    const stored = load();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydratace z localStorage až po mountu
    if (stored) setState(stored);
  }, []);

  const finishSession: Ctx["finishSession"] = useCallback(
    ({ kind, game, nodeId }) => {
      const days = state.sessions.map((s) => s.day);
      const { base, bonus, total } = xpForSession(kind, sessionsInWeek(days, today));
      const before = rankFor(state.xp);
      const after = rankFor(state.xp + total);
      const completed =
        nodeId && !state.completed.includes(nodeId) ? [...state.completed, nodeId] : state.completed;
      const next: DemoState = {
        ...state,
        xp: state.xp + total,
        completed,
        sessions: [...state.sessions, { day: today, kind, game, nodeId }],
      };
      const result: SessionResult = { kind, nodeId, game, base, bonus, before, after, levelUp: after.level > before.level };
      setState(next);
      save(next);
      setLastResult(result);
      return result;
    },
    [state, today],
  );

  const reset = useCallback(() => {
    const fresh = seedState(today);
    setState(fresh);
    setLastResult(null);
    try {
      localStorage.removeItem(KEY);
    } catch {}
  }, [today]);

  const value = useMemo<Ctx>(
    () => ({
      state,
      completed: new Set(state.completed),
      days: state.sessions.map((s) => s.day),
      today,
      lastResult,
      finishSession,
      reset,
    }),
    [state, today, lastResult, finishSession, reset],
  );

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

export function useDemo() {
  const ctx = useContext(DemoContext);
  if (!ctx) throw new Error("useDemo musí být uvnitř <DemoProvider>");
  return ctx;
}
