import {
  SERVICES_BY_PROGRAM,
  type Hospital,
  type ProgramId,
  type ServiceValue,
} from "@/data/schema";

/**
 * How many of a program's services a facility reports offering.
 *
 * The four states are counted separately rather than reduced to a percentage
 * because "did not answer" and "answered no" are genuinely different, and
 * collapsing them would let a facility that skipped half the form look the
 * same as one that answered no to half of it.
 */
export interface Coverage {
  yes: number;
  partial: number;
  no: number;
  unknown: number;
  /** Number of services in the program — the denominator for all of the above. */
  total: number;
  /** Services answered at all. `yes + partial + no`. */
  answered: number;
}

export function coverageFor(
  hospital: Hospital,
  program: ProgramId,
): Coverage | null {
  const record = hospital[program];
  const services = SERVICES_BY_PROGRAM[program];
  if (!record) return null;

  const tally: Record<ServiceValue, number> = {
    yes: 0,
    no: 0,
    "see-comments": 0,
    unknown: 0,
  };
  for (const service of services) {
    tally[record.services[service.key] ?? "unknown"] += 1;
  }

  return {
    yes: tally.yes,
    partial: tally["see-comments"],
    no: tally.no,
    unknown: tally.unknown,
    total: services.length,
    answered: tally.yes + tally.no + tally["see-comments"],
  };
}

export const SORT_MODES = ["name", "coverage"] as const;
export type SortMode = (typeof SORT_MODES)[number];

/**
 * Sorting is applied after filtering so the ranking reflects what is on
 * screen. Coverage sort is descending and falls back to name, so the order is
 * total rather than leaving ties to the engine's stability guarantees.
 */
export function sortHospitals(
  hospitals: readonly Hospital[],
  program: ProgramId,
  mode: SortMode,
): Hospital[] {
  const sorted = [...hospitals];
  if (mode === "name") {
    return sorted.sort((a, b) => a.name.localeCompare(b.name));
  }
  return sorted.sort((a, b) => {
    const scoreA = coverageFor(a, program)?.yes ?? -1;
    const scoreB = coverageFor(b, program)?.yes ?? -1;
    return scoreB - scoreA || a.name.localeCompare(b.name);
  });
}
