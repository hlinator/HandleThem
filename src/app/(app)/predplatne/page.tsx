import type { Metadata } from "next";
import { Pricing } from "@/components/landing/Pricing";

export const metadata: Metadata = { title: "Předplatné" };

export default function Page() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-wider text-[clamp(30px,6vw,52px)] leading-none font-extrabold tracking-tight">Předplatné</h1>
        <p className="mt-2 max-w-prose text-muted">Platí většinou rodič, takže to píšeme narovinu: žádná reklama, zrušíš kdykoli a prvních 14 dní neplatíš nic.</p>
      </div>
      <Pricing ctaHref="#brzy" />
      <p id="brzy" className="scroll-mt-24 rounded-2xl border border-dashed border-line p-5 text-sm text-muted">
        Tohle je ukázková verze, platba zatím není zapnutá. Všechno z Premium máš v ukázce odemčené.
      </p>
    </div>
  );
}
