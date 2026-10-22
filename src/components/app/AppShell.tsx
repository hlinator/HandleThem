"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { CalendarCheck, Dumbbell, Route, UserRound } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { ThemeToggle } from "@/components/brand/ThemeToggle";
import { RankChip } from "./RankChip";
import { cn } from "@/lib/cn";

const NAV = [
  { href: "/dnes/", label: "Dnes", icon: CalendarCheck },
  { href: "/stezka/", label: "Stezka", icon: Route },
  { href: "/trenink/", label: "Trénink", icon: Dumbbell },
  { href: "/profil/", label: "Profil", icon: UserRound },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const isActive = (href: string) => path === href || path === href.slice(0, -1) || path.startsWith(href);

  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-[240px_minmax(0,1fr)]">
      {/* desktop: boční panel */}
      <aside className="sticky top-0 hidden h-dvh flex-col gap-8 border-r border-line p-5 lg:flex">
        <Link href="/" aria-label="HandleThem, úvod">
          <Logo />
        </Link>
        <nav aria-label="Aplikace" className="flex flex-col gap-1">
          {NAV.map((n) => {
            const on = isActive(n.href);
            return (
              <Link key={n.href} href={n.href} aria-current={on ? "page" : undefined} className={cn("relative flex h-12 items-center gap-3 rounded-2xl px-4 font-semibold transition-colors", on ? "text-fg" : "text-muted hover:text-fg")}>
                {on && <motion.span layoutId="side-active" className="absolute inset-0 rounded-2xl bg-accent-soft ring-1 ring-accent/60" transition={{ type: "spring", stiffness: 420, damping: 34 }} />}
                <n.icon className="relative size-5" />
                <span className="relative">{n.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto flex flex-col gap-4">
          <Link href="/predplatne/" className="rounded-2xl border border-line p-4 text-sm transition-colors hover:border-accent">
            <span className="block font-semibold">Premium</span>
            <span className="text-muted">Všechny lajny a minihry, 14 dní zdarma.</span>
          </Link>
          <ThemeToggle />
        </div>
      </aside>

      <div className="flex min-w-0 flex-col">
        {/* mobil: horní lišta */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-line bg-bg/85 px-4 backdrop-blur-md sm:px-6 lg:justify-end">
          <Link href="/" aria-label="HandleThem, úvod" className="lg:hidden">
            <Logo compact />
          </Link>
          <div className="flex items-center gap-2">
            <RankChip />
            <ThemeToggle className="lg:hidden" />
          </div>
        </header>

        <main className="mx-auto w-full max-w-5xl flex-1 px-4 pt-6 pb-32 sm:px-6 lg:pt-10 lg:pb-16">{children}</main>
      </div>

      {/* mobil: spodní navigace */}
      <nav aria-label="Aplikace" className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-bg/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden">
        <ul className="mx-auto grid max-w-md grid-cols-4">
          {NAV.map((n) => {
            const on = isActive(n.href);
            return (
              <li key={n.href}>
                <Link href={n.href} aria-current={on ? "page" : undefined} className={cn("relative flex h-16 flex-col items-center justify-center gap-1 text-xs font-semibold", on ? "text-fg" : "text-muted")}>
                  {on && <motion.span layoutId="tab-active" className="absolute top-0 h-0.5 w-10 rounded-full bg-accent" transition={{ type: "spring", stiffness: 420, damping: 34 }} />}
                  <n.icon className={cn("size-5 transition-transform", on && "-translate-y-0.5 text-accent-text")} />
                  {n.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
