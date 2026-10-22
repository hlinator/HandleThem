export type GameId = "reaction" | "peripheral" | "zablesk" | "tracking";
export type Difficulty = "easy" | "med" | "hard";

export type GameMeta = {
  id: GameId;
  name: string;
  /** co hra trénuje */
  skill: string;
  tag: string;
  howTo: string;
  /** jak se hraje: nahlas / pohybem / klepnutím */
  answer: string;
  /** měří hra něco, nebo jen počítá objem? */
  measured: boolean;
};

export const GAMES: Record<GameId, GameMeta> = {
  reaction: {
    id: "reaction",
    name: "Reakce",
    skill: "Rychlá reakce a přepínání pozornosti",
    tag: "Podnět se střídá, ty hned reaguješ.",
    howTo: "Veď míček s hlavou nahoru. Jakmile se objeví číslo, barva nebo pokyn, řekni ho nahlas nebo ho proveď.",
    answer: "Nahlas nebo pohybem",
    measured: false,
  },
  peripheral: {
    id: "peripheral",
    name: "Periferie",
    skill: "Periferní vidění a přehled",
    tag: "Oči na středu, vnímej celé hřiště.",
    howTo: "Dívej se pořád na křížek uprostřed. Co blikne v okraji, pojmenuj, a očima přitom nehni.",
    answer: "Nahlas",
    measured: false,
  },
  zablesk: {
    id: "zablesk",
    name: "Záblesk",
    skill: "Rychlé rozpoznání a paměťový rozsah",
    tag: "Zachyť a zapamatuj si, co problikne.",
    howTo: "Na zlomek vteřiny se ukáže několik znaků. Zapamatuj si je a po zhasnutí je vyjmenuj nahlas.",
    answer: "Nahlas",
    measured: false,
  },
  tracking: {
    id: "tracking",
    name: "Sled",
    skill: "Sledování více objektů najednou",
    tag: "Udrž v hlavě víc míčků v pohybu.",
    howTo: "Zapamatuj si zvýrazněné míčky. Pak se všechny rozjedou, ty je sleduješ očima a po zastavení označíš ty správné.",
    answer: "Klepnutím",
    measured: true,
  },
};

export const GAME_ORDER: GameId[] = ["reaction", "peripheral", "zablesk", "tracking"];

export const DIFFICULTY_LABEL: Record<Difficulty, string> = {
  easy: "Lehká",
  med: "Střední",
  hard: "Těžká",
};

export function isGameId(v: string): v is GameId {
  return (GAME_ORDER as string[]).includes(v);
}
