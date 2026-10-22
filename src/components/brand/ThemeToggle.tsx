"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/cn";

type Theme = "dark" | "light";

export function ThemeToggle({ className }: { className?: string }) {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const t = document.documentElement.dataset.theme;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- motiv už nastavil inline skript v <head>
    if (t === "light") setTheme("light");
  }, []);

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("ht-theme", next);
    } catch {}
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === "dark" ? "Přepnout na světlý režim" : "Přepnout na tmavý režim"}
      className={cn(
        "relative grid size-11 place-items-center overflow-hidden rounded-full border border-line text-fg transition-colors hover:border-accent-text",
        className,
      )}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={theme}
          initial={{ y: 18, rotate: -90, opacity: 0 }}
          animate={{ y: 0, rotate: 0, opacity: 1 }}
          exit={{ y: -18, rotate: 90, opacity: 0 }}
          transition={{ type: "spring", stiffness: 420, damping: 26 }}
          className="grid place-items-center"
        >
          {theme === "dark" ? <Sun className="size-[18px]" /> : <Moon className="size-[18px]" />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
