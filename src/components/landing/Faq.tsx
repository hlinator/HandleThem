import { Plus } from "lucide-react";

const QA = [
  {
    q: "Měří aplikace, jestli hraju líp?",
    a: "Ne. Vědomě neměříme techniku ani herní výkon, žádná kamera. Hra Sled si měří úspěšnost a ta slouží jen jako tvoje osobní křivka. XP a ranky dostáváš za to, že trénuješ pravidelně.",
  },
  {
    q: "Co k tomu potřebuju?",
    a: "Hokejku, míček a prostor zhruba 2 × 2 metry. Telefon nebo tablet položíš kousek od sebe, aby byl vidět. Nic dalšího si kupovat nemusíš.",
  },
  {
    q: "Pro koho to je?",
    a: "Pro hráče od 13 let, kteří chtějí trénovat i mezi tréninky v klubu, a pro dospělé hobby hráče. Pro mladší hráče chystáme rodičovský účet.",
  },
  {
    q: "Co když týden vynechám kvůli zápasu nebo nemoci?",
    a: "Série se počítá po týdnech a vynechaný týden můžeš doplnit. Vynechat jeden týden je normální tréninkový život, ne důvod začínat od nuly.",
  },
];

export function Faq() {
  return (
    <div className="divide-y divide-line border-y border-line">
      {QA.map((item) => (
        <details key={item.q} className="group py-2">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-4 text-lg font-semibold sm:text-xl [&::-webkit-details-marker]:hidden">
            {item.q}
            <Plus className="size-5 shrink-0 text-accent-text transition-transform duration-300 group-open:rotate-45" />
          </summary>
          <p className="max-w-prose pb-4 leading-relaxed text-muted">{item.a}</p>
        </details>
      ))}
    </div>
  );
}
