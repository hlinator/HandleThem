// XP jen za dokončení a pravidelnost, nikdy za výkon (viz docs/specs/postup.md)
export const XP = {
  lesson: 50,
  freePlay: 10,
  weeklyGoalBonus: 30,
} as const;

export const WEEKLY_GOAL = 3;

export type SessionKind = "lesson" | "free";

/**
 * XP za nový trénink. `sessionsThisWeekBefore` = kolik tréninků už v týdnu bylo.
 * Bonus padne jen jednou, právě za ten trénink, kterým se splní týdenní cíl.
 */
export function xpForSession(kind: SessionKind, sessionsThisWeekBefore: number) {
  const base = kind === "lesson" ? XP.lesson : XP.freePlay;
  const hitsGoal = sessionsThisWeekBefore + 1 === WEEKLY_GOAL;
  return { base, bonus: hitsGoal ? XP.weeklyGoalBonus : 0, total: base + (hitsGoal ? XP.weeklyGoalBonus : 0) };
}
