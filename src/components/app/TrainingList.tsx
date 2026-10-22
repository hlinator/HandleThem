"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useInView } from "motion/react";
import { GAMES, GAME_ORDER, type GameId } from "@/lib/games/meta";
import { GameIcon } from "@/components/games/GameIcon";
import { GamePreview } from "@/components/landing/GamePreview";
import { cn } from "@/lib/cn";

export function TrainingList() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-wider text-[clamp(30px,6vw,52px)] leading-none font-extrabold tracking-tight">Volný trénink</h1>
        <p className="mt-2 max-w-prose text-muted">Kterákoli minihra mimo stezku. Na stezce se tím neposuneš, ale do série se počítá a dostaneš +10 XP.</p>
      </div>
      <ul className="grid gap-4 sm:grid-cols-2">
        {GAME_ORDER.map((id) => (
          <Card key={id} id={id} />
        ))}
      </ul>
    </div>
  );
}

function Card({ id }: { id: GameId }) {
  const ref = useRef<HTMLLIElement>(null);
  const inView = useInView(ref, { margin: "-30% 0px -30% 0px" });
  const [hover, setHover] = useState(false);
  const active = hover || inView;
  const g = GAMES[id];
  return (
    <li ref={ref} onPointerEnter={() => setHover(true)} onPointerLeave={() => setHover(false)}>
      <Link href={`/trenink/${id}/`} className={cn("flex h-full flex-col overflow-hidden rounded-[28px] border bg-surface transition-colors", active ? "border-accent" : "border-line")}>
        <div data-theme="dark" className="relative aspect-[16/9] bg-[#06050b] text-fg">
          <GamePreview game={id} active={active} />
        </div>
        <div className="flex items-start gap-3 p-5">
          <GameIcon game={id} className="mt-1 size-6 text-accent-text" />
          <div className="flex-1">
            <div className="flex items-center justify-between gap-2">
              <h2 className="font-wide text-xl font-bold">{g.name}</h2>
              {id !== "reaction" && <span className="rounded-full border border-line px-2 py-0.5 text-[11px] text-muted">Premium, v ukázce odemčeno</span>}
            </div>
            <p className="text-sm text-muted">{g.skill}</p>
          </div>
        </div>
      </Link>
    </li>
  );
}
