import { LANES, NODES, STEPS_PER_LANE, type LaneId, type PathNode } from "./data";

export type NodeStatus = "done" | "next" | "locked";

/** v každé lajně se postupuje popořadě, takže stačí počet hotových uzlů */
export function laneDone(completed: ReadonlySet<string>, lane: LaneId) {
  let n = 0;
  while (n < STEPS_PER_LANE && completed.has(`${lane}-${n + 1}`)) n++;
  return n;
}

export function nodeStatus(completed: ReadonlySet<string>, node: PathNode): NodeStatus {
  const done = laneDone(completed, node.lane);
  if (node.step < done) return "done";
  if (node.step === done) return "next";
  return "locked";
}

export function nextNode(completed: ReadonlySet<string>, lane: LaneId): PathNode | null {
  const done = laneDone(completed, lane);
  if (done >= STEPS_PER_LANE) return null;
  return NODES.find((n) => n.lane === lane && n.step === done) ?? null;
}

/** doporučená lajna = ta, která nejvíc zaostává; při shodě vyhrává pořadí lajn */
export function recommendedLane(completed: ReadonlySet<string>): LaneId | null {
  let best: LaneId | null = null;
  let bestDone = Infinity;
  for (const lane of LANES) {
    const d = laneDone(completed, lane.id);
    if (d < STEPS_PER_LANE && d < bestDone) {
      best = lane.id;
      bestDone = d;
    }
  }
  return best;
}

export function hallProgress(completed: ReadonlySet<string>) {
  const perLane = LANES.map((l) => ({ lane: l.id, done: laneDone(completed, l.id) }));
  const total = perLane.reduce((a, b) => a + b.done, 0);
  const max = LANES.length * STEPS_PER_LANE;
  return { perLane, total, max, goal: total === max };
}
