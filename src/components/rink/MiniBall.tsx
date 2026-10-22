// malý florbalový míček s dírkami, značka pozice na hřišti
export function MiniBall({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={className} aria-hidden="true">
      <circle cx="10" cy="10" r="9" fill="var(--fg)" stroke="var(--accent)" strokeWidth="1.5" />
      {[
        [10, 10], [10, 4.6], [10, 15.4], [4.8, 7.6], [15.2, 7.6], [4.8, 12.4], [15.2, 12.4],
      ].map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="1.35" fill="var(--bg)" />
      ))}
    </svg>
  );
}
