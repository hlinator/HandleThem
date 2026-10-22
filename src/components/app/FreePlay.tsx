"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useDemo, type SessionResult } from "@/lib/demo/store";
import type { GameId } from "@/lib/games/meta";
import { GameSetup } from "@/components/games/GameSetup";
import { GameShell, type GameSummary } from "@/components/games/GameShell";
import { defaultSettings } from "@/components/games/stimuli";
import { ResultPanel } from "./ResultPanel";

type View = "setup" | "play" | "done";

export function FreePlay({ game }: { game: GameId }) {
  const { finishSession } = useDemo();
  const [settings, setSettings] = useState(() => defaultSettings(game));
  const [view, setView] = useState<View>("setup");
  const [summary, setSummary] = useState<GameSummary | null>(null);
  const [result, setResult] = useState<SessionResult | null>(null);

  const onFinish = (s: GameSummary) => {
    setSummary(s);
    setResult(finishSession({ kind: "free", game }));
    setView("done");
  };

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-6">
      <Link href="/trenink/" className="inline-flex items-center gap-2 self-start text-sm text-muted hover:text-fg">
        <ArrowLeft className="size-4" /> Všechny minihry
      </Link>
      {view === "setup" && <GameSetup settings={settings} onChange={setSettings} onStart={() => setView("play")} />}
      {view === "play" && <GameShell settings={settings} onFinish={onFinish} />}
      {view === "done" && summary && result && (
        <ResultPanel title="Trénink hotový" summary={summary} result={result}>
          <button type="button" onClick={() => setView("play")} className="h-12 rounded-full bg-accent px-6 font-semibold text-accent-fg">
            Hrát znovu
          </button>
          <Link href="/dnes/" className="inline-flex h-12 items-center rounded-full border border-line px-6 hover:border-fg">
            Zpátky na Dnes
          </Link>
        </ResultPanel>
      )}
    </div>
  );
}
