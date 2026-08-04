import { describe, expect, it } from "vitest";

import type { Hospital, ProgramRecord, ServiceValue } from "@/data/schema";

import { filterHospitals, hospitalOffers, matchesSearch } from "./filter";

function record(services: Record<string, ServiceValue>): ProgramRecord {
  return { services };
}

function hospital(overrides: Partial<Hospital> & { id: string }): Hospital {
  return {
    name: overrides.id,
    coordinates: { lat: 47.6, lng: -122.3 },
    isBehavioralOrSubstance: false,
    reproductive: null,
    endOfLife: null,
    ...overrides,
  };
}

const seattle = hospital({
  id: "seattle",
  name: "Seattle General",
  city: "Seattle",
  reproductive: record({ "birth-control": "yes", vasectomy: "no" }),
  endOfLife: record({ "hospice-care": "yes" }),
});

const spokane = hospital({
  id: "spokane",
  name: "Spokane Memorial",
  city: "Spokane",
  reproductive: record({ "birth-control": "see-comments", vasectomy: "yes" }),
});

const tacoma = hospital({
  id: "tacoma",
  name: "Tacoma Behavioral",
  city: "Tacoma",
  reproductive: record({ "birth-control": "unknown", vasectomy: "no" }),
});

const all = [seattle, spokane, tacoma];

const base = { program: "reproductive" as const, search: "", services: [] };

describe("hospitalOffers", () => {
  it("counts an explicit yes", () => {
    expect(hospitalOffers(seattle, "reproductive", "birth-control")).toBe(true);
  });

  it('counts "see comments" as offered, since the caveat is not a no', () => {
    expect(hospitalOffers(spokane, "reproductive", "birth-control")).toBe(true);
  });

  it("does not count a no or an unreported value", () => {
    expect(hospitalOffers(seattle, "reproductive", "vasectomy")).toBe(false);
    expect(hospitalOffers(tacoma, "reproductive", "birth-control")).toBe(false);
  });

  it("does not count a service from a program the facility never filed", () => {
    expect(hospitalOffers(spokane, "endOfLife", "hospice-care")).toBe(false);
  });
});

describe("matchesSearch", () => {
  it("matches on name or city, case-insensitively", () => {
    expect(matchesSearch(seattle, "seattle general")).toBe(true);
    expect(matchesSearch(seattle, "SEATTLE")).toBe(true);
    expect(matchesSearch(spokane, "spok")).toBe(true);
  });

  it("treats an empty or whitespace-only term as no filter", () => {
    expect(matchesSearch(tacoma, "")).toBe(true);
    expect(matchesSearch(tacoma, "   ")).toBe(true);
  });

  it("does not match unrelated text", () => {
    expect(matchesSearch(seattle, "portland")).toBe(false);
  });
});

describe("filterHospitals", () => {
  it("returns every facility in the program when nothing is selected", () => {
    expect(filterHospitals(all, base).map((h) => h.id)).toEqual([
      "seattle",
      "spokane",
      "tacoma",
    ]);
  });

  it("excludes facilities with no filing for the active program", () => {
    const result = filterHospitals(all, { ...base, program: "endOfLife" });
    expect(result.map((h) => h.id)).toEqual(["seattle"]);
  });

  it('includes "see comments" facilities — the regression that hid them', () => {
    const result = filterHospitals(all, {
      ...base,
      services: ["birth-control"],
    });
    expect(result.map((h) => h.id)).toEqual(["seattle", "spokane"]);
  });

  it("requires every selected service, not just one", () => {
    // Spokane offers both (birth-control as "see comments", vasectomy "yes").
    // Seattle offers only birth-control, so the AND drops it.
    const result = filterHospitals(all, {
      ...base,
      services: ["birth-control", "vasectomy"],
    });
    expect(result.map((h) => h.id)).toEqual(["spokane"]);
  });

  it("returns nothing when no facility offers the whole combination", () => {
    const result = filterHospitals(all, {
      ...base,
      search: "seattle",
      services: ["birth-control", "vasectomy"],
    });
    expect(result).toEqual([]);
  });

  it("combines search with service filters", () => {
    const result = filterHospitals(all, {
      ...base,
      search: "spokane",
      services: ["vasectomy"],
    });
    expect(result.map((h) => h.id)).toEqual(["spokane"]);
  });

  it("returns nothing for an unknown service key rather than everything", () => {
    expect(
      filterHospitals(all, { ...base, services: ["not-a-real-service"] }),
    ).toEqual([]);
  });
});
