// Týdenní série s doplněním (Strava/Hevy model z rešerše).
// Data jsou lokální dny ve formátu YYYY-MM-DD, počítám v UTC kvůli přechodu na letní čas.

const DAY = 86_400_000;

function toMs(day: string) {
  const [y, m, d] = day.split("-").map(Number);
  return Date.UTC(y, m - 1, d);
}

function fromMs(ms: number) {
  return new Date(ms).toISOString().slice(0, 10);
}

export function addDays(day: string, n: number) {
  return fromMs(toMs(day) + n * DAY);
}

/** pondělí týdne, do kterého den patří */
export function weekStart(day: string) {
  const ms = toMs(day);
  const dow = (new Date(ms).getUTCDay() + 6) % 7; // po = 0
  return fromMs(ms - dow * DAY);
}

export function todayLocal(now = new Date()) {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/**
 * Kolik týdnů v řadě má hráč aspoň jeden trénink.
 * Aktuální týden je pořád „otevřený“: když v něm ještě nic není, série se nepřeruší.
 */
export function weeklyStreak(days: string[], today: string) {
  const weeks = new Set(days.map(weekStart));
  const current = weekStart(today);
  const currentWeekDone = weeks.has(current);
  let cursor = currentWeekDone ? current : addDays(current, -7);
  let count = 0;
  while (weeks.has(cursor)) {
    count++;
    cursor = addDays(cursor, -7);
  }
  return { weeks: count, currentWeekDone };
}

export function daysSinceLast(days: string[], today: string): number | null {
  const past = days.filter((d) => d <= today);
  if (past.length === 0) return null;
  const last = past.reduce((a, b) => (a > b ? a : b));
  return Math.round((toMs(today) - toMs(last)) / DAY);
}

export function sessionsInWeek(days: string[], anyDayOfWeek: string) {
  const w = weekStart(anyDayOfWeek);
  return days.filter((d) => weekStart(d) === w).length;
}

export type WeekCell = { start: string; count: number; isCurrent: boolean };

/** posledních `n` týdnů od nejstaršího po aktuální */
export function weekStrip(days: string[], today: string, n: number): WeekCell[] {
  const current = weekStart(today);
  const out: WeekCell[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const start = addDays(current, -7 * i);
    out.push({ start, count: sessionsInWeek(days, start), isCurrent: i === 0 });
  }
  return out;
}

/** dny aktuálního týdne po–ne a jestli se v nich trénovalo */
export function currentWeekDays(days: string[], today: string) {
  const start = weekStart(today);
  const set = new Set(days);
  return Array.from({ length: 7 }, (_, i) => {
    const day = addDays(start, i);
    return { day, trained: set.has(day), isToday: day === today, isFuture: day > today };
  });
}
