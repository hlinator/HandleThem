"use client";

import Link from "next/link";
import { motion } from "motion/react";

export function FinalCta() {
  return (
    <div className="relative flex flex-col items-center gap-8 overflow-hidden rounded-[40px] border border-line bg-surface px-6 py-16 text-center sm:py-24">
      <svg viewBox="0 0 24 24" className="w-40 text-accent-text sm:w-56" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
        <motion.path
          d="M12 12c-2-2.7-4-4-6-4a4 4 0 0 0 0 8c2 0 4-1.3 6-4zm0 0c2 2.7 4 4 6 4a4 4 0 0 0 0-8c-2 0-4 1.3-6 4z"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 1.6, ease: "easeInOut" }}
        />
      </svg>
      <h2 className="font-wider max-w-3xl text-[clamp(34px,6vw,64px)] leading-[0.98] font-extrabold tracking-tight">První osmička je za patnáct minut.</h2>
      <p className="max-w-md text-lg text-muted">Bez registrace si projdeš první lekci. Účet si založíš, až budeš chtít uložit postup.</p>
      <Link href="/dnes/" className="inline-flex h-14 items-center rounded-full bg-accent px-8 text-lg font-semibold text-accent-fg hover:brightness-110">
        Začít první trénink
      </Link>
    </div>
  );
}
