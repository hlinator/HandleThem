export type Rank = {
  id: string;
  name: string;
  /** XP, od kterých rank začíná */
  from: number;
  /** jedna věta pod názvem ranku */
  line: string;
};

export const RANKS: Rank[] = [
  { id: "prales", name: "Prales", from: 0, line: "Hokejka v ruce, míček někde pod gaučem." },
  { id: "vesnice", name: "Vesnický přeborník", from: 300, line: "Doma tě už znají." },
  { id: "okres", name: "Okresní přebor", from: 800, line: "Pravidelnost začíná být vidět." },
  { id: "regionalka", name: "Regionálka", from: 1500, line: "Trénuješ, i když se nikdo nedívá." },
  { id: "divize", name: "Divize", from: 2500, line: "Doma máš vyšlapanou cestičku." },
  { id: "narodni", name: "Národní liga", from: 3800, line: "Tréninkový návyk máš v kapse." },
  { id: "prvniliga", name: "1. liga", from: 5400, line: "Míček poslouchá na slovo." },
  { id: "superliga", name: "Superliga", from: 7200, line: "Nejvyšší česká soutěž." },
  { id: "ssl", name: "SSL", from: 9400, line: "Švédská liga, nejlepší na světě." },
  { id: "repre", name: "Reprezentace", from: 12000, line: "Dres se lvem. Rok a čtvrt poctivé práce." },
];

/** šířka posledního pásma, aby i Reprezentace měla tři stupně */
const LAST_BAND = 3000;
const TIERS = ["III", "II", "I"] as const;
export type Tier = (typeof TIERS)[number];

export type RankState = {
  rank: Rank;
  rankIndex: number;
  tier: Tier;
  /** 1–30 */
  level: number;
  /** 0–1 v rámci aktuálního stupně */
  progress: number;
  /** XP, kdy přijde další stupeň; null na úplném vrcholu */
  nextAt: number | null;
  /** název dalšího milníku (stupeň nebo rank) */
  nextLabel: string | null;
};

function bandEnd(i: number) {
  return i < RANKS.length - 1 ? RANKS[i + 1].from : RANKS[i].from + LAST_BAND;
}

export function rankIndexFor(xp: number) {
  let i = 0;
  while (i < RANKS.length - 1 && xp >= RANKS[i + 1].from) i++;
  return i;
}

export function rankFor(rawXp: number): RankState {
  const xp = Math.max(0, Math.floor(rawXp));
  const i = rankIndexFor(xp);
  const rank = RANKS[i];
  const start = rank.from;
  const end = bandEnd(i);
  const step = (end - start) / TIERS.length;
  const t = Math.min(TIERS.length - 1, Math.floor((xp - start) / step));
  const tierStart = start + t * step;
  const tierEnd = tierStart + step;
  const isTop = i === RANKS.length - 1 && t === TIERS.length - 1;

  let nextLabel: string | null = null;
  if (!isTop) {
    nextLabel = t < TIERS.length - 1 ? `${rank.name} ${TIERS[t + 1]}` : RANKS[i + 1]?.name ?? null;
  }

  return {
    rank,
    rankIndex: i,
    tier: TIERS[t],
    level: i * TIERS.length + t + 1,
    progress: isTop ? Math.min(1, (xp - tierStart) / step) : (xp - tierStart) / step,
    nextAt: isTop ? null : Math.round(tierEnd),
    nextLabel,
  };
}

export const MAX_XP_SHOWN = RANKS[RANKS.length - 1].from + LAST_BAND;
