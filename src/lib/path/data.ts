import type { GameId, Difficulty } from "@/lib/games/meta";

export type LaneId = "vedeni" | "klicky" | "hlava";

export type Lane = {
  id: LaneId;
  name: string;
  short: string;
  /** co lajna trénuje, jedna věta */
  about: string;
};

export const LANES: Lane[] = [
  { id: "vedeni", name: "Vedení míčku", short: "Vedení", about: "Osmičky, tempo a kontrola míčku na malém prostoru." },
  { id: "klicky", name: "Kličky", short: "Kličky", about: "Přetahy, otočky a změny směru." },
  { id: "hlava", name: "Hlava nahoru", short: "Hlava", about: "Minihry, které hraješ s míčkem u hokejky a očima na displeji." },
];

export type PathNode = {
  id: string;
  lane: LaneId;
  /** pořadí v lajně od 0 */
  step: number;
  title: string;
  minutes: number;
  /** krátký popis cviku pro přehrávač */
  cues: string[];
  game: { id: GameId; difficulty: Difficulty };
};

export const HALL = { id: "hala-1", name: "Hala 1: Základy", next: "Hala 2: Pod tlakem" };

type Seed = [title: string, minutes: number, cues: string[], game: GameId, difficulty: Difficulty];

const SEEDS: Record<LaneId, Seed[]> = {
  vedeni: [
    ["Vedení na místě", 10, ["Míček před tělem", "Krátké doteky forhend–bekhend", "Kolena pokrčená"], "reaction", "easy"],
    ["Osmičky kolem nohou", 11, ["Osmička mezi chodidly", "Hokejka nízko", "Pomalu, pak tempo"], "reaction", "easy"],
    ["Osmičky v pohybu", 12, ["Osmička za chůze", "Dva kroky vpřed, dva vzad", "Hlava nahoru"], "peripheral", "easy"],
    ["Vedení v kruhu", 12, ["Kruh kolem kuželu", "Míček na vnější straně", "Změň směr na signál"], "reaction", "med"],
    ["Změna tempa", 13, ["Pomalu–rychle–pomalu", "Míček nesmí utéct", "Dýchej"], "peripheral", "med"],
    ["Vedení s hlavou nahoru", 14, ["Oči na displeji", "Míček cítíš hokejkou", "Reaguj na podnět"], "zablesk", "med"],
  ],
  klicky: [
    ["Přetah", 10, ["Míček z forhendu na bekhend", "Rychlý pohyb zápěstí", "Tělo nízko"], "reaction", "easy"],
    ["Klička na bekhend", 11, ["Nájezd, přetah, odjezd", "Rameno jde s míčkem", "Opakuj na obě strany"], "reaction", "easy"],
    ["Otočka", 12, ["Otočka přes záda", "Míček chráníš tělem", "Výjezd do strany"], "peripheral", "easy"],
    ["Kombinace přetahů", 12, ["Dva přetahy za sebou", "Malý prostor 2 × 2 m", "Zrychli ve druhé půlce"], "zablesk", "easy"],
    ["Klička v pohybu", 13, ["Přetah za pohybu", "Krok do strany", "Hlava nahoru po kličce"], "reaction", "med"],
    ["Klička na signál", 14, ["Směr podle šipky", "Reaguj hned", "Míček stále u hokejky"], "reaction", "hard"],
  ],
  hlava: [
    ["Reakce: čísla a barvy", 8, ["Veď míček na místě", "Číslo nebo barvu řekni nahlas", "Nedívej se dolů"], "reaction", "easy"],
    ["Periferie zblízka", 8, ["Oči na křížku", "Pojmenuj, co blikne v okraji", "Hokejka v pohybu"], "peripheral", "easy"],
    ["Záblesk: tři znaky", 9, ["Znaky jen probliknou", "Vyjmenuj je po zhasnutí", "Pořád veď míček"], "zablesk", "easy"],
    ["Sled: dva míčky", 9, ["Zapamatuj si cíle", "Sleduj je očima", "Pak je označ"], "tracking", "easy"],
    ["Periferie zdaleka", 10, ["Podněty v rozích", "Hlavou nehýbej", "Odpovídej nahlas"], "peripheral", "med"],
    ["Sled: tři míčky", 10, ["Víc míčků, víc pohybu", "Dýchej klidně", "Označ správné"], "tracking", "med"],
  ],
};

export const NODES: PathNode[] = (Object.keys(SEEDS) as LaneId[]).flatMap((lane) =>
  SEEDS[lane].map(([title, minutes, cues, game, difficulty], step) => ({
    id: `${lane}-${step + 1}`,
    lane,
    step,
    title,
    minutes,
    cues,
    game: { id: game, difficulty },
  })),
);

export const STEPS_PER_LANE = 6;

export function nodeById(id: string) {
  return NODES.find((n) => n.id === id);
}

export function laneById(id: LaneId) {
  return LANES.find((l) => l.id === id)!;
}
