import { describe, expect, it } from "vitest";
import { RANKS, rankFor } from "./ranks";
import { xpForSession, XP } from "./xp";
import { weeklyStreak, daysSinceLast, weekStart, weekStrip, currentWeekDays } from "./streak";

describe("rankFor", () => {
  it("začíná v Pralese na levelu 1", () => {
    const r = rankFor(0);
    expect(r.rank.name).toBe("Prales");
    expect(r.tier).toBe("III");
    expect(r.level).toBe(1);
    expect(r.progress).toBe(0);
  });

  it("přesně na hranici je hráč už v novém ranku", () => {
    expect(rankFor(299).rank.id).toBe("prales");
    expect(rankFor(300).rank.id).toBe("vesnice");
    expect(rankFor(300).tier).toBe("III");
  });

  it("dělí rank na tři stupně", () => {
    // Prales 0–300 -> stupně po 100 XP
    expect(rankFor(99).tier).toBe("III");
    expect(rankFor(100).tier).toBe("II");
    expect(rankFor(250).tier).toBe("I");
    expect(rankFor(250).nextLabel).toBe("Vesnický přeborník");
    expect(rankFor(150).nextLabel).toBe("Prales I");
  });

  it("má 30 levelů a vrchol bez dalšího cíle", () => {
    const top = rankFor(1_000_000);
    expect(top.rank.id).toBe("repre");
    expect(top.level).toBe(RANKS.length * 3);
    expect(top.nextAt).toBeNull();
    expect(top.progress).toBe(1);
  });

  it("záporné nebo desetinné XP nerozbije výpočet", () => {
    expect(rankFor(-50).level).toBe(1);
    expect(rankFor(300.9).rank.id).toBe("vesnice");
  });

  it("první povýšení přijde do dvou týdnů při 3 lekcích týdně", () => {
    const perWeek = 3 * XP.lesson + XP.weeklyGoalBonus;
    expect(perWeek * 2).toBeGreaterThanOrEqual(RANKS[1].from);
  });
});

describe("xpForSession", () => {
  it("dá bonus jen za třetí trénink v týdnu", () => {
    expect(xpForSession("lesson", 0).total).toBe(50);
    expect(xpForSession("lesson", 2).total).toBe(80);
    expect(xpForSession("lesson", 3).bonus).toBe(0);
    expect(xpForSession("free", 2).total).toBe(40);
  });
});

describe("weekStart", () => {
  it("vrací pondělí, neděle patří do předchozího týdne", () => {
    expect(weekStart("2026-10-22")).toBe("2026-10-19"); // čtvrtek
    expect(weekStart("2026-10-25")).toBe("2026-10-19"); // neděle
    expect(weekStart("2026-10-26")).toBe("2026-10-26"); // pondělí
  });

  it("zvládne přechod na zimní čas (25. 10. 2026)", () => {
    expect(weekStart("2026-10-27")).toBe("2026-10-26");
  });
});

describe("weeklyStreak", () => {
  const today = "2026-10-22";

  it("bez tréninků je série nula", () => {
    expect(weeklyStreak([], today)).toEqual({ weeks: 0, currentWeekDone: false });
  });

  it("počítá týdny v řadě včetně aktuálního", () => {
    const days = ["2026-10-20", "2026-10-14", "2026-10-06", "2026-10-01"];
    expect(weeklyStreak(days, today)).toEqual({ weeks: 4, currentWeekDone: true });
  });

  it("aktuální týden bez tréninku sérii nepřeruší", () => {
    const days = ["2026-10-14", "2026-10-06"];
    expect(weeklyStreak(days, today)).toEqual({ weeks: 2, currentWeekDone: false });
  });

  it("vynechaný týden sérii přeruší", () => {
    const days = ["2026-10-20", "2026-10-06", "2026-09-29"];
    expect(weeklyStreak(days, today).weeks).toBe(1);
  });

  it("doplněný týden sérii zase spojí", () => {
    const days = ["2026-10-20", "2026-10-06", "2026-09-29"];
    expect(weeklyStreak([...days, "2026-10-15"], today).weeks).toBe(4);
  });

  it("více tréninků v jednom týdnu se počítá jako jeden týden", () => {
    const days = ["2026-10-19", "2026-10-20", "2026-10-21"];
    expect(weeklyStreak(days, today).weeks).toBe(1);
  });
});

describe("daysSinceLast", () => {
  it("vrátí null bez tréninku a ignoruje budoucí data", () => {
    expect(daysSinceLast([], "2026-10-22")).toBeNull();
    expect(daysSinceLast(["2026-10-20", "2026-10-30"], "2026-10-22")).toBe(2);
    expect(daysSinceLast(["2026-10-22"], "2026-10-22")).toBe(0);
  });
});

describe("weekStrip a currentWeekDays", () => {
  it("vrátí týdny od nejstaršího a označí aktuální", () => {
    const strip = weekStrip(["2026-10-20", "2026-10-21", "2026-10-07"], "2026-10-22", 3);
    expect(strip.map((w) => w.start)).toEqual(["2026-10-05", "2026-10-12", "2026-10-19"]);
    expect(strip.map((w) => w.count)).toEqual([1, 0, 2]);
    expect(strip[2].isCurrent).toBe(true);
  });

  it("vrátí 7 dnů od pondělí", () => {
    const week = currentWeekDays(["2026-10-20"], "2026-10-22");
    expect(week).toHaveLength(7);
    expect(week[1]).toMatchObject({ day: "2026-10-20", trained: true });
    expect(week[3].isToday).toBe(true);
    expect(week[4].isFuture).toBe(true);
  });
});
