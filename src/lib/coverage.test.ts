import { describe, expect, it } from "vitest";

import {
  END_OF_LIFE_SERVICES,
  groupRuns,
  REPRODUCTIVE_SERVICES,
  shortLabel,
  SERVICES_BY_PROGRAM,
  type Hospital,
  type ProgramId,
  type ServiceDefinition,
} from "@/data/schema";
import { coverageFor, sortHospitals } from "@/lib/coverage";

function hospital(
  name: string,
  services: Record<string, "yes" | "no" | "see-comments">,
  program: ProgramId = "reproductive",
): Hospital {
  const record = { services };
  return {
    id: name.toLowerCase().replace(/\W+/g, "-"),
    name,
    coordinates: null,
    isBehavioralOrSubstance: false,
    reproductive: program === "reproductive" ? record : null,
    endOfLife: program === "endOfLife" ? record : null,
  };
}

describe("coverageFor", () => {
  it("counts each state separately and treats missing keys as unreported", () => {
    const total = REPRODUCTIVE_SERVICES.length;
    const subject = hospital("Test", {
      "birth-control": "yes",
      vasectomy: "yes",
      "surgical-abortion": "no",
      "medication-abortion": "see-comments",
    });

    expect(coverageFor(subject, "reproductive")).toEqual({
      yes: 2,
      no: 1,
      partial: 1,
      unknown: total - 4,
      answered: 4,
      total,
    });
  });

  it("keeps 'did not answer' distinct from 'answered no'", () => {
    // The whole point of four states: a facility that skipped the form must
    // not read as one that answered no to everything.
    const blank = coverageFor(hospital("Blank", {}), "reproductive");
    const refused = coverageFor(
      hospital(
        "Refused",
        Object.fromEntries(
          REPRODUCTIVE_SERVICES.map((service) => [service.key, "no" as const]),
        ),
      ),
      "reproductive",
    );

    expect(blank?.unknown).toBe(REPRODUCTIVE_SERVICES.length);
    expect(blank?.answered).toBe(0);
    expect(refused?.unknown).toBe(0);
    expect(refused?.answered).toBe(REPRODUCTIVE_SERVICES.length);
    expect(blank?.yes).toBe(refused?.yes);
  });

  it("returns null when the facility never filed for the program", () => {
    expect(coverageFor(hospital("Test", {}), "endOfLife")).toBeNull();
  });
});

describe("sortHospitals", () => {
  const few = hospital("Zeta", { "birth-control": "yes" });
  const many = hospital("Alpha", {
    "birth-control": "yes",
    vasectomy: "yes",
    "hiv-testing": "yes",
  });
  const none = hospital("Mid", {});

  it("sorts by name", () => {
    expect(
      sortHospitals([few, many, none], "reproductive", "name").map(
        (h) => h.name,
      ),
    ).toEqual(["Alpha", "Mid", "Zeta"]);
  });

  it("sorts by services offered, descending, breaking ties by name", () => {
    const tie = hospital("Beta", { "birth-control": "yes" });
    expect(
      sortHospitals([few, many, none, tie], "reproductive", "coverage").map(
        (h) => h.name,
      ),
    ).toEqual(["Alpha", "Beta", "Zeta", "Mid"]);
  });

  it("does not mutate the input", () => {
    const input = [few, many];
    sortHospitals(input, "reproductive", "coverage");
    expect(input.map((h) => h.name)).toEqual(["Zeta", "Alpha"]);
  });
});

describe("service presentation metadata", () => {
  const all: readonly ServiceDefinition[] = [
    ...REPRODUCTIVE_SERVICES,
    ...END_OF_LIFE_SERVICES,
  ];

  it("gives every service a group", () => {
    for (const service of all) {
      expect(service.group, service.key).toBeTruthy();
    }
  });

  it("keeps every group contiguous, so the matrix bands do not repeat", () => {
    // groupRuns collapses adjacent same-group services. If a service were
    // filed under a group it is not next to, that group would appear twice.
    for (const services of Object.values(SERVICES_BY_PROGRAM)) {
      const runs = groupRuns(services);
      const groups = runs.map((run) => run.group);
      expect(new Set(groups).size).toBe(groups.length);
      expect(runs.flatMap((run) => run.services)).toEqual([...services]);
    }
  });

  it("keeps matrix labels short enough for a vertical column header", () => {
    // The header is a fixed height; a longer label wraps to a second vertical
    // line, and past roughly this length it wraps to a third and clips.
    for (const service of all) {
      expect(shortLabel(service).length, service.key).toBeLessThanOrEqual(40);
    }
  });
});
