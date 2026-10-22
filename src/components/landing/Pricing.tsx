"use client";

import { useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { Segmented } from "@/components/games/GameSetup";

// Ceny podle rešerše: 99 Kč/měs., 790 Kč/rok, 14 dní zkušební doba.
export const PRICES = { monthly: 99, yearly: 790, trialDays: 14 };

const FREE = ["Jedna lekce denně na stezce", "Minihra Reakce ve volném tréninku", "Týdenní série, XP a ranky", "Parta: kolik trénují kamarádi"];
const PREMIUM = ["Neomezeně lekcí a všechny lajny", "Všechny čtyři minihry a obtížnosti", "Historie tréninků a osobní křivka ve hře Sled", "Další haly, jak budou přibývat"];

export function Pricing({ ctaHref = "/predplatne/" }: { ctaHref?: string }) {
  const [period, setPeriod] = useState<"monthly" | "yearly">("yearly");
  const yearly = period === "yearly";
  return (
    <div className="flex flex-col gap-8">
      <div className="w-full max-w-xs">
        <Segmented
          name="pricing"
          value={period}
          onChange={setPeriod}
          options={[
            { value: "monthly", label: "Měsíčně" },
            { value: "yearly", label: "Ročně" },
          ]}
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <article className="flex flex-col gap-6 rounded-[32px] border border-line p-6 sm:p-8">
          <div>
            <h3 className="text-xl font-semibold">Zdarma</h3>
            <p className="font-wider mt-2 text-5xl font-extrabold">0 Kč</p>
            <p className="mt-2 text-sm text-muted">Napořád, bez karty.</p>
          </div>
          <List items={FREE} />
          <Link href="/dnes/" className="mt-auto flex h-12 items-center justify-center rounded-full border border-line font-semibold hover:border-fg">
            Začít zdarma
          </Link>
        </article>
        <article className="relative flex flex-col gap-6 overflow-hidden rounded-[32px] border-2 border-accent bg-accent-soft p-6 sm:p-8">
          <div>
            <h3 className="text-xl font-semibold">Premium</h3>
            <p className="font-wider tnum mt-2 text-5xl font-extrabold">
              <AnimatedNumber value={yearly ? PRICES.yearly : PRICES.monthly} /> Kč
            </p>
            <p className="mt-2 text-sm text-muted">
              {yearly ? `za rok, vychází na ${Math.round(PRICES.yearly / 12)} Kč měsíčně` : "měsíčně, zrušíš kdykoli"}
            </p>
          </div>
          <List items={PREMIUM} />
          <Link href={ctaHref} className="mt-auto flex h-12 items-center justify-center rounded-full bg-accent font-semibold text-accent-fg hover:brightness-110">
            Vyzkoušet {PRICES.trialDays} dní zdarma
          </Link>
        </article>
      </div>
      <p className="text-sm text-muted">Trenéři a kluby: klubovou licenci pro celý tým připravujeme. Napiš nám a domluvíme pilot na sezónu.</p>
    </div>
  );
}

function List({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-col gap-3">
      {items.map((t) => (
        <li key={t} className="flex gap-3 leading-snug">
          <Check className="mt-0.5 size-4 shrink-0 text-accent-text" strokeWidth={3} />
          <span>{t}</span>
        </li>
      ))}
    </ul>
  );
}
