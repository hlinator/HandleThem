import { describe, expect, it } from "vitest";
import { NODES, LANES, STEPS_PER_LANE } from "./data";
import { laneDone, nodeStatus, nextNode, recommendedLane, hallProgress } from "./progress";

const set = (...ids: string[]) => new Set(ids);

describe("data stezky", () => {
  it("má v každé lajně stejný počet uzlů s unikátním id", () => {
    for (const lane of LANES) {
      expect(NODES.filter((n) => n.lane === lane.id)).toHaveLength(STEPS_PER_LANE);
    }
    expect(new Set(NODES.map((n) => n.id)).size).toBe(NODES.length);
  });
});

describe("laneDone", () => {
  it("počítá jen souvislou řadu od začátku", () => {
    expect(laneDone(set("vedeni-1", "vedeni-2"), "vedeni")).toBe(2);
    // vedeni-3 bez vedeni-2 se nepočítá
    expect(laneDone(set("vedeni-1", "vedeni-3"), "vedeni")).toBe(1);
  });
});

describe("nodeStatus a nextNode", () => {
  it("první uzel je hned dostupný, další zamčené", () => {
    const empty = set();
    expect(nodeStatus(empty, NODES[0])).toBe("next");
    expect(nodeStatus(empty, NODES[1])).toBe("locked");
    expect(nextNode(empty, "klicky")?.id).toBe("klicky-1");
  });

  it("po dokončení celé lajny už další krok není", () => {
    const all = set(...NODES.filter((n) => n.lane === "hlava").map((n) => n.id));
    expect(nextNode(all, "hlava")).toBeNull();
  });
});

describe("recommendedLane", () => {
  it("doporučí lajnu, která nejvíc zaostává", () => {
    expect(recommendedLane(set("vedeni-1", "vedeni-2", "klicky-1", "hlava-1"))).toBe("klicky");
  });

  it("při shodě vybere první lajnu", () => {
    expect(recommendedLane(set())).toBe("vedeni");
  });

  it("vrátí null, když je hala hotová", () => {
    expect(recommendedLane(set(...NODES.map((n) => n.id)))).toBeNull();
  });
});

describe("hallProgress", () => {
  it("hlásí gól až po všech třech lajnách", () => {
    const allButOne = NODES.slice(0, -1).map((n) => n.id);
    expect(hallProgress(set(...allButOne)).goal).toBe(false);
    expect(hallProgress(set(...NODES.map((n) => n.id))).goal).toBe(true);
  });
});
