"use client";

import { motion } from "motion/react";
import { Check, Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/cn";
import { DIFFICULTY_LABEL, GAMES, type Difficulty } from "@/lib/games/meta";
import { GameIcon } from "./GameIcon";
import { REACTION_MODES, settingsSummary, type GameSettings, type ReactionMode } from "./stimuli";

const DIFFS: Difficulty[] = ["easy", "med", "hard"];

// Žádné posuvníky: jen tři obtížnosti a pár voleb (zásada „max dvě tapnutí do tréninku“).
export function GameSetup({
  settings,
  onChange,
  onStart,
}: {
  settings: GameSettings;
  onChange: (s: GameSettings) => void;
  onStart: () => void;
}) {
  const g = GAMES[settings.game];
  const set = (patch: Partial<GameSettings>) => onChange({ ...settings, ...patch });
  const toggleMode = (m: ReactionMode) =>
    set({ modes: settings.modes.includes(m) ? settings.modes.filter((x) => x !== m) : [...settings.modes, m] });
  const disabled = settings.game === "reaction" && settings.modes.length === 0;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start gap-4">
        <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-accent-soft text-accent-text">
          <GameIcon game={settings.game} className="size-8" />
        </span>
        <div>
          <h1 className="font-wide text-3xl font-bold tracking-tight sm:text-4xl">{g.name}</h1>
          <p className="mt-1 text-muted">{g.skill}</p>
        </div>
      </div>

      <p className="max-w-prose leading-relaxed text-muted">{g.howTo}</p>

      <Field label="Obtížnost" hint={settingsSummary(settings)}>
        <Segmented
          value={settings.difficulty}
          options={DIFFS.map((d) => ({ value: d, label: DIFFICULTY_LABEL[d] }))}
          onChange={(v) => set({ difficulty: v })}
        />
      </Field>

      {settings.game === "reaction" && (
        <Field label="Co trénovat" hint={disabled ? "Vyber aspoň jeden typ podnětu." : undefined} hintTone={disabled ? "warn" : undefined}>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(REACTION_MODES) as ReactionMode[]).map((m) => (
              <Chip key={m} active={settings.modes.includes(m)} onClick={() => toggleMode(m)}>
                {REACTION_MODES[m].label}
              </Chip>
            ))}
          </div>
        </Field>
      )}

      {settings.game === "peripheral" && (
        <Field label="Co bliká v okraji">
          <div className="flex flex-wrap gap-2">
            {([["colors", "Barvy"], ["arrows", "Šipky"], ["numbers", "Čísla"]] as const).map(([v, l]) => (
              <Chip key={v} active={settings.edgeType === v} onClick={() => set({ edgeType: v })}>
                {l}
              </Chip>
            ))}
          </div>
        </Field>
      )}

      {settings.game === "zablesk" && (
        <Field label="Znaky">
          <div className="flex flex-wrap gap-2">
            {([["numbers", "Čísla"], ["colors", "Barvy"]] as const).map(([v, l]) => (
              <Chip key={v} active={settings.flashType === v} onClick={() => set({ flashType: v })}>
                {l}
              </Chip>
            ))}
          </div>
        </Field>
      )}

      {settings.game === "tracking" ? (
        <Field label="Počet kol">
          <div className="flex flex-wrap gap-2">
            {[3, 5, 8].map((r) => (
              <Chip key={r} active={settings.rounds === r} onClick={() => set({ rounds: r })}>
                {r}
              </Chip>
            ))}
          </div>
        </Field>
      ) : (
        <Field label="Délka">
          <div className="flex flex-wrap gap-2">
            {[30, 60, 90, 120].map((d) => (
              <Chip key={d} active={settings.duration === d} onClick={() => set({ duration: d })}>
                {d} s
              </Chip>
            ))}
          </div>
        </Field>
      )}

      {settings.game !== "tracking" && (
        <button
          type="button"
          onClick={() => set({ sound: !settings.sound })}
          aria-pressed={settings.sound}
          className="flex items-center justify-between gap-4 rounded-2xl border border-line p-4 text-left"
        >
          <span>
            <span className="block font-semibold">Zvukový signál</span>
            <span className="block text-sm text-muted">Pípnutí při každém podnětu, když se zrovna nedíváš.</span>
          </span>
          {settings.sound ? <Volume2 className="size-5 text-accent-text" /> : <VolumeX className="size-5 text-faint" />}
        </button>
      )}

      <button
        type="button"
        disabled={disabled}
        onClick={onStart}
        className="h-14 rounded-full bg-accent text-lg font-semibold text-accent-fg transition-[filter,opacity] hover:brightness-110 disabled:opacity-40"
      >
        Spustit
      </button>
    </div>
  );
}

function Field({ label, hint, hintTone, children }: { label: string; hint?: string; hintTone?: "warn"; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      <span className="text-sm font-semibold">{label}</span>
      {children}
      {hint && <span className={cn("text-sm", hintTone === "warn" ? "text-warn" : "text-faint")}>{hint}</span>}
    </div>
  );
}

export function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "flex h-11 items-center gap-1.5 rounded-full border px-4 text-sm font-semibold transition-colors",
        active ? "border-accent bg-accent-soft text-fg" : "border-line text-muted hover:border-faint",
      )}
    >
      {active && <Check className="size-3.5 text-accent-text" strokeWidth={3} />}
      {children}
    </button>
  );
}

export function Segmented<T extends string>({
  value,
  options,
  onChange,
  name = "seg",
}: {
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
  name?: string;
}) {
  return (
    <div role="radiogroup" className="relative flex rounded-full border border-line p-1">
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(o.value)}
            className={cn("relative h-10 flex-1 rounded-full text-sm font-semibold transition-colors", active ? "text-bg" : "text-muted hover:text-fg")}
          >
            {active && (
              <motion.span
                layoutId={`seg-${name}`}
                className="absolute inset-0 rounded-full bg-fg"
                transition={{ type: "spring", stiffness: 500, damping: 36 }}
              />
            )}
            <span className="relative">{o.label}</span>
          </button>
        );
      })}
    </div>
  );
}
