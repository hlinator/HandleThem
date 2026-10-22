// Generátory podnětů převzaté z HandleThemFourMinigames.jsx, jen otypované.
import type { Difficulty, GameId } from "@/lib/games/meta";

export const COLORS = [
  { name: "červená", hex: "#ff4d4d" },
  { name: "modrá", hex: "#4d8bff" },
  { name: "zelená", hex: "#22d07a" },
  { name: "žlutá", hex: "#ffd60a" },
  { name: "oranžová", hex: "#ff9f1c" },
  { name: "fialová", hex: "#b15cff" },
  { name: "růžová", hex: "#ff5fa2" },
  { name: "tyrkysová", hex: "#27d6e6" },
] as const;

const COMMANDS = ["OTOČKA", "DŘEP", "VÝSKOK", "STŮJ", "VLEVO", "VPRAVO", "DOZADU", "KLEK", "DOTYK", "TLESK", "ZRYCHLI", "KLIČKA"];
const ARROWS = ["←", "→", "↑", "↓"];

export type ReactionMode = "numbers" | "colors" | "words" | "stroop" | "arrows";
export type EdgeType = "colors" | "arrows" | "numbers";

export const REACTION_MODES: Record<ReactionMode, { label: string; task: string }> = {
  numbers: { label: "Čísla", task: "Řekni číslo nahlas" },
  colors: { label: "Barvy", task: "Pojmenuj barvu" },
  words: { label: "Pokyny", task: "Proveď pohyb" },
  stroop: { label: "Stroop", task: "Řekni barvu písma, slovo ignoruj" },
  arrows: { label: "Šipky", task: "Klička daným směrem" },
};

export type Stim = {
  key: string;
  text?: string;
  color?: string;
  circle?: string;
  cluster?: { text?: string; hex?: string }[];
  pos?: { left: number; top: number };
  small?: boolean;
};

export type GameSettings = {
  game: GameId;
  difficulty: Difficulty;
  /** sekundy; null = bez limitu */
  duration: number | null;
  sound: boolean;
  modes: ReactionMode[];
  edgeType: EdgeType;
  flashType: "numbers" | "colors";
  rounds: number;
};

export function defaultSettings(game: GameId, difficulty: Difficulty = "med"): GameSettings {
  return {
    game,
    difficulty,
    duration: 60,
    sound: true,
    modes: ["numbers", "colors"],
    edgeType: "colors",
    flashType: "numbers",
    rounds: 5,
  };
}

const rand = <T,>(a: readonly T[]) => a[Math.floor(Math.random() * a.length)];

export const PRESETS = {
  reaction: {
    easy: { speed: 2.0, gap: 0.2, randomPos: false, progressive: false },
    med: { speed: 1.4, gap: 0, randomPos: false, progressive: false },
    hard: { speed: 0.9, gap: 0, randomPos: true, progressive: true },
  },
  peripheral: {
    easy: { spread: "near", flash: 0.55, speed: 2.0 },
    med: { spread: "far", flash: 0.4, speed: 1.6 },
    hard: { spread: "far", flash: 0.25, speed: 1.2 },
  },
  zablesk: {
    easy: { count: 3, flash: 0.5, speed: 3.0 },
    med: { count: 4, flash: 0.38, speed: 2.5 },
    hard: { count: 5, flash: 0.25, speed: 2.0 },
  },
  tracking: {
    easy: { dots: 6, targets: 2, speed: 85, track: 4 },
    med: { dots: 8, targets: 3, speed: 145, track: 6 },
    hard: { dots: 10, targets: 4, speed: 205, track: 7 },
  },
} as const;

const PERI_FAR = [
  { left: 8, top: 12 }, { left: 50, top: 8 }, { left: 92, top: 12 }, { left: 92, top: 50 },
  { left: 92, top: 88 }, { left: 50, top: 92 }, { left: 8, top: 88 }, { left: 8, top: 50 },
];
const PERI_NEAR = [
  { left: 26, top: 28 }, { left: 50, top: 22 }, { left: 74, top: 28 }, { left: 78, top: 50 },
  { left: 74, top: 72 }, { left: 50, top: 78 }, { left: 26, top: 72 }, { left: 22, top: 50 },
];

function reactionStim(modes: ReactionMode[], prevKey: string | null): Stim {
  let s: Stim;
  let guard = 0;
  do {
    const type = rand(modes);
    if (type === "numbers") {
      const n = 1 + Math.floor(Math.random() * 99);
      s = { key: `n${n}`, text: String(n) };
    } else if (type === "colors") {
      const c = rand(COLORS);
      s = { key: `c${c.hex}`, circle: c.hex };
    } else if (type === "words") {
      const w = rand(COMMANDS);
      s = { key: `w${w}`, text: w };
    } else if (type === "stroop") {
      const word = rand(COLORS);
      let ink = rand(COLORS);
      // stroop musí mít jinou barvu písma než slovo
      for (let g = 0; ink.name === word.name && g < 12; g++) ink = rand(COLORS);
      s = { key: `s${word.name}${ink.hex}`, text: word.name.toUpperCase(), color: ink.hex };
    } else {
      const a = rand(ARROWS);
      s = { key: `a${a}`, text: a };
    }
    guard++;
  } while (s.key === prevKey && guard < 6);
  return s;
}

/** konfigurace intervalových her pro StimulusEngine */
export type EngineConfig = {
  generate: (prevKey: string | null, s: GameSettings) => Stim;
  showMs: (s: GameSettings, elapsedMs: number) => number;
  cycleMs: (s: GameSettings, elapsedMs: number) => number;
  fixation: boolean;
  legend: (s: GameSettings) => string[];
};

const reaction: EngineConfig = {
  generate(prev, s) {
    const p = PRESETS.reaction[s.difficulty];
    const st = reactionStim(s.modes.length ? s.modes : ["numbers"], prev);
    if (p.randomPos) st.pos = { left: 14 + Math.random() * 72, top: 20 + Math.random() * 60 };
    return st;
  },
  showMs(s, el) {
    const p = PRESETS.reaction[s.difficulty];
    let ms = p.speed * 1000;
    // zrychlování: každých 15 s o 150 ms, minimum 450 ms
    if (p.progressive) ms = Math.max(450, ms - Math.floor(el / 15000) * 150);
    return ms;
  },
  cycleMs(s, el) {
    return reaction.showMs(s, el) + PRESETS.reaction[s.difficulty].gap * 1000;
  },
  fixation: false,
  legend: (s) => s.modes.map((m) => REACTION_MODES[m].task),
};

const peripheral: EngineConfig = {
  generate(_prev, s) {
    const p = PRESETS.peripheral[s.difficulty];
    const pos = rand(p.spread === "near" ? PERI_NEAR : PERI_FAR);
    let st: Stim;
    if (s.edgeType === "colors") st = { key: "", circle: rand(COLORS).hex, small: true };
    else if (s.edgeType === "arrows") st = { key: "", text: rand(ARROWS), small: true };
    else st = { key: "", text: String(1 + Math.floor(Math.random() * 9)), small: true };
    st.pos = pos;
    st.key = `${st.circle ?? st.text}${pos.left}_${pos.top}_${Math.random()}`;
    return st;
  },
  showMs: (s) => PRESETS.peripheral[s.difficulty].flash * 1000,
  cycleMs: (s) => PRESETS.peripheral[s.difficulty].speed * 1000,
  fixation: true,
  legend: () => ["Oči pořád na křížku uprostřed", "Pojmenuj, co blikne v okraji"],
};

const zablesk: EngineConfig = {
  generate(_prev, s) {
    const p = PRESETS.zablesk[s.difficulty];
    const cluster = Array.from({ length: p.count }, () =>
      s.flashType === "colors" ? { hex: rand(COLORS).hex } : { text: String(1 + Math.floor(Math.random() * 9)) },
    );
    return { key: `z${Math.random()}`, cluster };
  },
  showMs: (s) => PRESETS.zablesk[s.difficulty].flash * 1000,
  cycleMs: (s) => PRESETS.zablesk[s.difficulty].speed * 1000,
  fixation: false,
  legend: () => ["Znaky jen probliknou", "Po zhasnutí je vyjmenuj nahlas"],
};

export const ENGINE_CONFIGS = { reaction, peripheral, zablesk } as const;

export function settingsSummary(s: GameSettings) {
  if (s.game === "reaction") {
    const p = PRESETS.reaction[s.difficulty];
    return `Podnět každých ${p.speed.toFixed(1).replace(".", ",")} s${p.randomPos ? ", náhodná pozice" : ""}${p.progressive ? ", postupně zrychluje" : ""}`;
  }
  if (s.game === "peripheral") {
    const p = PRESETS.peripheral[s.difficulty];
    return `Bliknutí ${Math.round(p.flash * 1000)} ms, ${p.spread === "far" ? "daleko od středu" : "blízko středu"}`;
  }
  if (s.game === "zablesk") {
    const p = PRESETS.zablesk[s.difficulty];
    return `${p.count} ${p.count >= 5 ? "znaků" : "znaky"} na ${Math.round(p.flash * 1000)} ms`;
  }
  const p = PRESETS.tracking[s.difficulty];
  return `${p.dots} míčků, z toho ${p.targets} cílové, ${p.track} s pohybu`;
}
