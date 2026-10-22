import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/landing/SiteHeader";
import { SiteFooter } from "@/components/landing/SiteFooter";

export const metadata: Metadata = {
  title: "Jak jsem to postavil",
  description: "Případová studie projektu HandleThem: problém, návrh, práce s AI, kontrola výsledku.",
};

// Text je koncept v mém hlasu. Před odesláním do ANT studia ho ještě projdu a upravím.
const STEPS = [
  {
    title: "Co bylo potřeba vyřešit",
    body: [
      "Florbalisté trénují techniku hlavně na tréninku, dvakrát až třikrát týdně. Doma většinou nevědí, co přesně dělat, a nikdo je nedrží u pravidelnosti. Videa na YouTube nemají strukturu a neurovizuální trénink (reakce, periferní vidění) je dnes dostupný hlavně přes drahé vybavení ve větších klubech.",
      "Chtěl jsem webovou aplikaci, která hráči každý den nabídne jeden konkrétní krok na deset až patnáct minut a dá mu důvod se zítra vrátit.",
    ],
  },
  {
    title: "Co jsem navrhl",
    body: [
      "Stezku jako florbalové hřiště se třemi lajnami (vedení míčku, kličky, hlava nahoru). Hráč si každý den vybere, kterou lajnu posune, aplikace mu doporučí tu, která nejvíc zaostává. Když dojedou všechny tři k brance, padne gól a otevře se další hala.",
      "Čtyři minihry, které se hrají s míčkem u hokejky a očima na displeji. XP a deset ranků od Pralesa po Reprezentaci, body ale dostávám jen za pravidelnost, ne za výkon. Sérii počítám po týdnech a vynechaný týden jde doplnit.",
      "Technicky: Next.js 16, TypeScript, Tailwind 4 a Motion. Zatím jako statický export s ukázkovými daty v prohlížeči. Data jsou schovaná za jedním hookem, aby šla později vyměnit za Supabase bez přepisování obrazovek.",
    ],
  },
  {
    title: "Jak jsem zapojil AI",
    body: [
      "Nejdřív rešerše. S Claudem jsem prošel konkurenci, ceny a studie o retenci. Tři rozhodnutí se kvůli tomu změnila: série je týdenní místo denní, cena 99 Kč místo původních 149 až 199 Kč a zkušební doba 14 dní místo 7. Taky jsem z textů vyhodil všechno, co slibuje lepší výkon v zápase, protože to neumím doložit.",
      "Pak redesign. Můj první návrh vypadal jako průměrný web z AI: tři různé styly, emoji, vymyšlená čísla. AI dostala kontext (strategii, rešerši, starý kód miniher a tenhle inzerát) a měla nejdřív napsat plán a zeptat se, co je nejasné. Kód začal vznikat až po tom, co jsem plán schválil. Hlavní hratelné jádro miniher jsem převzal ze svého prototypu a AI ho jen otypovala a přestylovala.",
    ],
  },
  {
    title: "Jak jsem výsledek kontroloval",
    body: [
      "Logiku, na které stojí motivace (XP, ranky, týdenní série, doporučení lajny), pokrývají unit testy ve Vitestu, včetně okrajových případů jako přechod na zimní čas nebo doplnění vynechaného týdne.",
      "Playwright projde každou stránku na šířkách 360, 768 a 1280 px v tmavém i světlém režimu, ověří, že nic nepřetéká do strany, a uloží screenshot. Ty jsem procházel ručně. Další test projde celou lekci od Dnes až po výsledek a zkontroluje, že přibyly XP.",
      "Při instalaci npm audit našel kritickou zranitelnost ve verzi Next.js z původního návrhu, takže jsem aktualizoval na opravenou verzi.",
    ],
  },
  {
    title: "Co z toho vzniklo",
    body: [
      "Proklikatelná aplikace: landing s hratelnou ukázkou, obrazovka Dnes s výběrem lajny, hřiště se stezkou, přehrávač lekce, čtyři minihry, profil s ranky a ceník. Všechno responzivní od mobilu.",
      "Další krok je napojit Supabase (účty a ukládání tréninků) a Stripe v testovacím režimu.",
    ],
  },
];

export default function Page() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-20">
        <p className="text-sm text-muted">Případová studie</p>
        <h1 className="font-wider mt-2 text-[clamp(38px,7vw,72px)] leading-[0.95] font-extrabold tracking-tight">Jak jsem postavil HandleThem</h1>
        <p className="mt-6 text-lg leading-relaxed text-muted">
          Ondřej Hlinovský, junior frontend developer. Projekt dělám s parťákem, který má na starosti marketing a sociální sítě. Já řeším produkt a kód.
        </p>

        <ol className="mt-14 flex flex-col gap-14">
          {STEPS.map((s, i) => (
            <li key={s.title} className="grid gap-4 sm:grid-cols-[72px_minmax(0,1fr)]">
              <span className="font-wider text-5xl leading-none font-extrabold text-accent-text">{i + 1}</span>
              <div className="flex flex-col gap-4">
                <h2 className="font-wide text-2xl font-bold sm:text-3xl">{s.title}</h2>
                {s.body.map((p) => (
                  <p key={p.slice(0, 24)} className="leading-relaxed text-muted">
                    {p}
                  </p>
                ))}
              </div>
            </li>
          ))}
        </ol>

        <section className="mt-16 rounded-[32px] border border-accent bg-accent-soft p-6 sm:p-8">
          <h2 className="font-wide text-2xl font-bold">Co dnes díky AI dělám jinak než před půl rokem</h2>
          <p className="mt-4 leading-relaxed">
            Před půl rokem jsem AI psal „udělej mi komponentu“ a pak jsem výsledek opravoval. Dnes ji nejdřív nechám sepsat plán a zeptat se mě na nejasnosti, a kód přijmu až ve chvíli, kdy projde testy, které jsem si předem odsouhlasil.
          </p>
        </section>

        <div className="mt-12 flex flex-wrap gap-3">
          <Link href="/dnes/" className="inline-flex h-12 items-center rounded-full bg-accent px-6 font-semibold text-accent-fg">
            Otevřít aplikaci
          </Link>
          <Link href="/" className="inline-flex h-12 items-center rounded-full border border-line px-6 hover:border-fg">
            Zpátky na úvod
          </Link>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
