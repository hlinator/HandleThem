import type { GameId } from "@/lib/games/meta";

// Jednobarevné ikony her. Hry se odlišují tvarem, ne barvou.
export function GameIcon({ game, className = "size-7" }: { game: GameId; className?: string }) {
  const common = {
    viewBox: "0 0 32 32",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className,
    "aria-hidden": true,
  };
  if (game === "reaction")
    return (
      <svg {...common}>
        <path d="M18 3 7 18h6l-2 11 12-16h-7z" fill="currentColor" stroke="none" />
      </svg>
    );
  if (game === "peripheral")
    return (
      <svg {...common}>
        <path d="M16 11v10M11 16h10" />
        <circle cx="5" cy="5" r="2.2" fill="currentColor" stroke="none" />
        <circle cx="27" cy="5" r="2.2" fill="currentColor" stroke="none" />
        <circle cx="5" cy="27" r="2.2" fill="currentColor" stroke="none" />
        <circle cx="27" cy="27" r="2.2" fill="currentColor" stroke="none" />
      </svg>
    );
  if (game === "zablesk")
    return (
      <svg {...common}>
        <circle cx="16" cy="16" r="2.8" fill="currentColor" stroke="none" />
        <path d="M16 4v5M16 23v5M4 16h5M23 16h5M8 8l3.2 3.2M20.8 20.8 24 24M24 8l-3.2 3.2M8 24l3.2-3.2" />
      </svg>
    );
  return (
    <svg {...common}>
      <path d="M7 21Q16 5 26 21" strokeDasharray="3 3" opacity="0.55" />
      <circle cx="7" cy="21" r="3.4" fill="currentColor" stroke="none" />
      <circle cx="18" cy="10" r="3" fill="currentColor" stroke="none" opacity="0.45" />
      <circle cx="26" cy="21" r="3" fill="currentColor" stroke="none" opacity="0.45" />
    </svg>
  );
}
