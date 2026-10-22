"use client";

import { useReducedMotion } from "motion/react";

// Pohled shora na osmičku kolem chodidel. Míček jezdí po dráze přes SVG animateMotion.
const PATH = "M100 60c-22-30-44-44-66-44a44 44 0 0 0 0 88c22 0 44-14 66-44zm0 0c22 30 44 44 66 44a44 44 0 0 0 0-88c-22 0-44 14-66 44z";

export function DrillDiagram({ className, speed = 3.2 }: { className?: string; speed?: number }) {
  const reduce = useReducedMotion();
  return (
    <svg viewBox="-12 0 224 120" className={className} role="img" aria-label="Osmička s míčkem kolem chodidel">
      <path d={PATH} fill="none" stroke="var(--line)" strokeWidth="10" strokeLinecap="round" />
      <path d={PATH} fill="none" stroke="var(--accent)" strokeWidth="2" strokeDasharray="4 7" strokeLinecap="round" opacity="0.8" />
      {/* chodidla */}
      <ellipse cx="34" cy="60" rx="9" ry="16" fill="var(--surface-2)" stroke="var(--faint)" strokeWidth="1.5" />
      <ellipse cx="166" cy="60" rx="9" ry="16" fill="var(--surface-2)" stroke="var(--faint)" strokeWidth="1.5" />
      <g>
        <circle r="8" fill="var(--fg)" stroke="var(--accent)" strokeWidth="2" />
        <circle r="1.6" cx="-3" cy="-2" fill="var(--bg)" />
        <circle r="1.6" cx="3" cy="-2" fill="var(--bg)" />
        <circle r="1.6" cx="0" cy="3" fill="var(--bg)" />
        {!reduce ? (
          <animateMotion dur={`${speed}s`} repeatCount="indefinite" path={PATH} rotate="auto" />
        ) : (
          <animateMotion dur="0.01s" fill="freeze" path={PATH} />
        )}
      </g>
    </svg>
  );
}
