import Link from "next/link";
import { SiteHeader } from "@/components/landing/SiteHeader";
import { SiteFooter } from "@/components/landing/SiteFooter";
import { BallDemo } from "@/components/landing/BallDemo";
import { LessonScrubber } from "@/components/landing/LessonScrubber";
import { RinkDemo } from "@/components/landing/RinkDemo";
import { GamesShowcase } from "@/components/landing/GamesShowcase";
import { RankLadder } from "@/components/landing/RankLadder";
import { StreakDemo } from "@/components/landing/StreakDemo";
import { Pricing } from "@/components/landing/Pricing";
import { Faq } from "@/components/landing/Faq";
import { FinalCta } from "@/components/landing/FinalCta";
import { cn } from "@/lib/cn";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 pt-10 pb-20 sm:px-6 sm:pt-16 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-16 lg:pb-28">
          <div className="flex flex-col gap-7">
            <h1 className="font-wide text-[clamp(44px,8.6vw,88px)] leading-[0.94] font-extrabold tracking-[-0.035em]">
              Patnáct minut florbalu. Každý den, doma.
            </h1>
            <p className="max-w-[34em] text-lg leading-relaxed text-muted sm:text-xl">
              Krátký cvik s hokejkou a minihra, kterou hraješ s hlavou nahoru. Každý den posuneš míček o kus blíž k brance a po cestě rosteš z Pralesa až do Reprezentace.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Link href="/dnes/" className="inline-flex h-14 items-center rounded-full bg-accent px-7 text-lg font-semibold text-accent-fg transition hover:brightness-110">
                Vyzkoušej trénink
              </Link>
              <a href="#lekce" className="inline-flex h-14 items-center rounded-full border border-line px-6 text-[17px] transition-colors hover:border-fg">
                Jak lekce probíhá
              </a>
            </div>
            <p className="text-sm text-faint">Bez registrace. Funguje v prohlížeči na telefonu, tabletu i notebooku.</p>
          </div>
          <BallDemo />
        </section>

        <Section id="lekce" title="Jedna lekce, deset až patnáct minut." lead="Telefon položíš dva metry od sebe a cvičíš s hokejkou. Velká čísla uvidíš a pípnutí uslyšíš i z dálky, na displej sahat nemusíš.">
          <LessonScrubber />
        </Section>

        <Section
          id="stezka"
          tone="surface"
          title="Cesta na branku."
          lead="Stezka je hřiště se třemi lajnami. Každý den si vybereš, kterou posuneš. Doporučíme tu, která nejvíc zaostává, ale rozhodnutí je tvoje. Když dojedou všechny tři k brance, padne gól a otevře se další hala."
        >
          <RinkDemo />
        </Section>

        <Section
          id="minihry"
          title="Čtyři minihry. Hraješ je s míčkem u hokejky."
          lead="Oči máš na displeji, míček vedeš po paměti. Reaguješ nahlas nebo pohybem, jen ve hře Sled klepeš. Hry počítají jen to, co se dá opravdu změřit."
        >
          <GamesShowcase />
        </Section>

        <Section
          id="ranky"
          tone="surface"
          title="Z Pralesa do Reprezentace."
          lead="Deset ranků, každý se třemi stupni. Body dostáváš za odtrénované dny, ne za výkon. Rank tedy ukazuje, jak poctivě trénuješ, ne kdo je talentovanější."
        >
          <RankLadder />
        </Section>

        <Section id="serie" title="Série po týdnech. Zápas ji nepřeruší." lead="Stačí jeden trénink za týden. Když týden vynecháš kvůli turnaji nebo nemoci, doplníš ho. A s partou se neporovnáváš ve výkonu, jen v tom, kdo je pravidelný.">
          <StreakDemo />
        </Section>

        <Section id="cenik" tone="surface" title="Začni zdarma." lead="Základní trénink je zdarma napořád. Premium odemkne všechny lajny a minihry.">
          <Pricing />
        </Section>

        <Section id="otazky" title="Časté otázky">
          <Faq />
        </Section>

        <div className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
          <FinalCta />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

function Section({
  id,
  title,
  lead,
  tone,
  children,
}: {
  id: string;
  title: string;
  lead?: string;
  tone?: "surface";
  children: React.ReactNode;
}) {
  return (
    <section id={id} className={cn("scroll-mt-16 border-t border-line", tone === "surface" && "bg-surface/60")}>
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-20 sm:px-6 sm:py-28">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
          <h2 className="font-wider max-w-[14em] text-[clamp(34px,5.6vw,60px)] leading-[0.98] font-extrabold tracking-[-0.03em]">{title}</h2>
          {lead && <p className="max-w-[32em] text-[17px] leading-relaxed text-muted lg:pb-1">{lead}</p>}
        </div>
        {children}
      </div>
    </section>
  );
}
