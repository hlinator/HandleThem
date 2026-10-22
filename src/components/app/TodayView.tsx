"use client";

import Link from "next/link";
import { Dumbbell } from "lucide-react";
import { useDemo } from "@/lib/demo/store";
import { LanePicker } from "./LanePicker";
import { CrewCard, RankCard, WeekCard } from "./Cards";

const DATE = new Intl.DateTimeFormat("cs-CZ", { weekday: "long", day: "numeric", month: "long" });

export function TodayView() {
  const { state, today } = useDemo();
  const [y, m, d] = today.split("-").map(Number);
  const date = DATE.format(new Date(y, m - 1, d));
  const trainedToday = state.sessions.some((s) => s.day === today);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <span className="text-sm text-muted first-letter:uppercase">{date}</span>
        <h1 className="font-wider text-[clamp(32px,6vw,52px)] leading-none font-extrabold tracking-tight">
          {trainedToday ? "Dnes máš hotovo." : `Ahoj, ${state.nameVocative ?? state.name}.`}
        </h1>
        {trainedToday && <p className="mt-1 text-muted">Chceš ještě? Posuň další lajnu nebo si dej volný trénink.</p>}
      </div>

      <LanePicker />

      <div className="grid gap-4 md:grid-cols-2">
        <WeekCard />
        <RankCard />
        <CrewCard />
        <Link href="/trenink/" className="group flex flex-col justify-between gap-6 rounded-[28px] border border-line p-5 transition-colors hover:border-accent sm:p-6">
          <Dumbbell className="size-7 text-accent-text transition-transform group-hover:-rotate-12" />
          <span>
            <span className="block text-xl font-semibold">Volný trénink</span>
            <span className="text-sm text-muted">Kterákoli ze čtyř miniher mimo stezku. +10 XP.</span>
          </span>
        </Link>
      </div>
    </div>
  );
}
