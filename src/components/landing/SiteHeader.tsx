"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { ThemeToggle } from "@/components/brand/ThemeToggle";
import { cn } from "@/lib/cn";

const LINKS = [
  { href: "#lekce", label: "Jak to funguje" },
  { href: "#stezka", label: "Stezka" },
  { href: "#minihry", label: "Minihry" },
  { href: "#ranky", label: "Ranky" },
  { href: "#cenik", label: "Ceník" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b transition-colors duration-300",
        scrolled || open ? "border-line bg-bg/85 backdrop-blur-md" : "border-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 sm:px-6">
        <Link href="/" aria-label="HandleThem, úvod" className="shrink-0">
          <Logo />
        </Link>
        <nav aria-label="Hlavní" className="ml-6 hidden flex-1 gap-6 text-[15px] lg:flex">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className="text-muted transition-colors hover:text-fg">
              {l.label}
            </a>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          <Link
            href="/dnes/"
            className="hidden h-11 items-center rounded-full bg-fg px-5 text-[15px] font-semibold text-bg transition-transform hover:-translate-y-px sm:inline-flex"
          >
            Otevřít aplikaci
          </Link>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Zavřít menu" : "Otevřít menu"}
            className="grid size-11 place-items-center rounded-full border border-line lg:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-menu"
            aria-label="Mobilní"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 32 }}
            className="overflow-hidden lg:hidden"
          >
            <ul className="mx-auto flex max-w-6xl flex-col px-4 pb-5 sm:px-6">
              {LINKS.map((l, i) => (
                <motion.li key={l.href} initial={{ x: -12, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.04 * i }}>
                  <a href={l.href} onClick={() => setOpen(false)} className="font-wide block border-b border-line py-4 text-2xl font-bold">
                    {l.label}
                  </a>
                </motion.li>
              ))}
              <li className="pt-5">
                <Link href="/dnes/" className="flex h-12 items-center justify-center rounded-full bg-accent font-semibold text-accent-fg">
                  Otevřít aplikaci
                </Link>
              </li>
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
