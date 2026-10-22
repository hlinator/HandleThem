"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useInView } from "motion/react";
import { GAMES, GAME_ORDER, type GameId } from "@/lib/games/meta";
import { GameIcon } from "@/components/games/GameIcon";
import { cn } from "@/lib/cn";
import { GamePreview } from "./GamePreview";

export function GamesShowcase() {
  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {GAME_ORDER.map((id) => (
        <GameCard key={id} id={id} />
      ))}
    </ul>
  );
}

function GameCard({ id }: { id: GameId }) {
  const g = GAMES[id];
  const ref = useRef<HTMLLIElement>(null);
  // na mobilu nejde hover, tak náhled běží, když je karta uprostřed obrazovky
  const inView = useInView(ref, { margin: "-35% 0px -35% 0px" });
  const [hover, setHover] = useState(false);
  const active = hover || inView;

  return (
    <li ref={ref} onPointerEnter={() => setHover(true)} onPointerLeave={() => setHover(false)}>
      <Link
        href={`/trenink/${id}/`}
        onFocus={() => setHover(true)}
        onBlur={() => setHover(false)}
        className={cn(
          "group flex h-full flex-col overflow-hidden rounded-[28px] border bg-surface transition-colors duration-300",
          active ? "border-accent" : "border-line",
        )}
      >
        <div data-theme="dark" className="relative aspect-[16/10] bg-[#06050b] text-fg">
          <GamePreview game={id} active={active} />
          <span className="absolute top-4 left-4 rounded-full border border-line bg-[#06050b]/70 px-3 py-1 text-xs text-muted">{g.answer}</span>
        </div>
        <div className="flex flex-1 flex-col gap-2 p-6">
          <div className="flex items-center gap-3">
            <GameIcon game={id} className={cn("size-6 transition-colors", active ? "text-accent-text" : "text-muted")} />
            <h3 className="font-wide text-2xl font-bold">{g.name}</h3>
          </div>
          <p className="text-muted">{g.tag}</p>
          <span className="mt-auto pt-3 text-sm font-semibold text-accent-text underline-offset-4 group-hover:underline">Vyzkoušet hru</span>
        </div>
      </Link>
    </li>
  );
}
