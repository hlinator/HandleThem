import { cn } from "@/lib/cn";

// ∞ = osmička, základní cvik vedení míčku
export function InfinityMark({ className, strokeWidth = 2.4 }: { className?: string; strokeWidth?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" aria-hidden="true" className={className}>
      <path d="M12 12c-2-2.7-4-4-6-4a4 4 0 0 0 0 8c2 0 4-1.3 6-4zm0 0c2 2.7 4 4 6 4a4 4 0 0 0 0-8c-2 0-4 1.3-6 4z" />
    </svg>
  );
}

export function Logo({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <InfinityMark className="size-8 text-accent-text" />
      {!compact && <span className="font-wide text-[19px] font-bold tracking-[-0.01em]">HandleThem</span>}
    </span>
  );
}
