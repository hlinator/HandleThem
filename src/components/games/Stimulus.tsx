import type { Stim } from "./stimuli";

// Velikosti počítané na telefon ležící dva metry od hráče.
export function Stimulus({ stim }: { stim: Stim }) {
  if (stim.cluster) {
    const n = stim.cluster.length;
    return (
      <div className="flex items-center justify-center" style={{ gap: "clamp(12px,4vmin,34px)" }}>
        {stim.cluster.map((it, i) =>
          it.hex ? (
            <span
              key={i}
              className="block rounded-full"
              style={{
                width: `clamp(46px, ${Math.max(8, 22 / n)}vmin, ${Math.max(66, 150 - n * 14)}px)`,
                aspectRatio: "1",
                background: it.hex,
                boxShadow: `0 0 30px ${it.hex}`,
              }}
            />
          ) : (
            <span
              key={i}
              className="font-wider font-extrabold leading-none text-fg"
              style={{ fontSize: `clamp(2.2rem, ${Math.max(7, 16 / n)}vmin, ${Math.max(3.4, 9.5 - n * 0.6)}rem)` }}
            >
              {it.text}
            </span>
          ),
        )}
      </div>
    );
  }

  if (stim.circle) {
    const d = stim.small ? "clamp(80px,13vmin,150px)" : "clamp(150px,36vmin,440px)";
    return (
      <span
        className="block rounded-full"
        style={{ width: d, height: d, background: stim.circle, boxShadow: `0 0 60px ${stim.circle}aa, inset 0 0 50px rgb(255 255 255 / 0.18)` }}
      />
    );
  }

  return (
    <span
      className="block font-wider font-extrabold leading-none"
      style={{
        fontSize: stim.small ? "clamp(2.6rem,11vmin,7rem)" : "clamp(4.5rem,26vmin,22rem)",
        color: stim.color ?? "var(--fg)",
        textShadow: stim.color ? `0 0 40px ${stim.color}66` : "0 0 50px var(--glow)",
      }}
    >
      {stim.text}
    </span>
  );
}

export function FixationCross() {
  return (
    <div className="pointer-events-none absolute top-1/2 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2" aria-hidden="true">
      <svg viewBox="0 0 40 40" className="size-[clamp(40px,9vmin,72px)] text-accent-text" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <path d="M20 6v28M6 20h28" />
      </svg>
    </div>
  );
}
