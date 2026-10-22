import Link from "next/link";
import { Logo } from "@/components/brand/Logo";

export function SiteFooter() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-12 sm:flex-row sm:items-start sm:justify-between sm:px-6">
        <div className="flex flex-col gap-3">
          <Logo />
          <p className="max-w-xs text-sm text-muted">Florbal doma, každý den jeden krok. Vyrobeno v Česku.</p>
        </div>
        <nav aria-label="Patička" className="grid grid-cols-2 gap-x-10 gap-y-3 text-sm">
          <Link href="/dnes/" className="text-muted hover:text-fg">Aplikace</Link>
          <Link href="/case-study/" className="text-muted hover:text-fg">Jak jsem to postavil</Link>
          <a href="#cenik" className="text-muted hover:text-fg">Ceník</a>
          <Link href="/predplatne/" className="text-muted hover:text-fg">Předplatné</Link>
        </nav>
      </div>
      <div className="mx-auto max-w-6xl px-4 pb-10 text-xs text-faint sm:px-6">© 2026 HandleThem. Ukázkový projekt, data v aplikaci jsou demo.</div>
    </footer>
  );
}
