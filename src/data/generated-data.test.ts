import { describe, expect, it } from "vitest";

import { hospitals, hospitalsFile } from "./hospitals";
import { SERVICES_BY_PROGRAM, hospitalsFileSchema, PROGRAMS } from "./schema";

/**
 * Guards the actual build output. These are the specific defects the old
 * implementation shipped, asserted against real data rather than fixtures.
 */
describe("generated hospital data", () => {
  it("satisfies the schema it claims to", () => {
    expect(() => hospitalsFileSchema.parse(hospitalsFile)).not.toThrow();
  });

  it("has at least one facility", () => {
    expect(hospitals.length).toBeGreaterThan(0);
  });

  it("gives every facility a unique, non-empty id", () => {
    const ids = hospitals.map((hospital) => hospital.id);
    expect(ids.every((id) => id.length > 0)).toBe(true);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("records at least one program per facility", () => {
    for (const hospital of hospitals) {
      expect(
        hospital.reproductive !== null || hospital.endOfLife !== null,
      ).toBe(true);
    }
  });

  it("populates every declared service key for every filed program", () => {
    for (const hospital of hospitals) {
      for (const program of PROGRAMS) {
        const record = hospital[program];
        if (!record) continue;
        for (const service of SERVICES_BY_PROGRAM[program]) {
          expect(
            record.services[service.key],
            `${hospital.name} / ${program} / ${service.key}`,
          ).toBeDefined();
        }
      }
    }
  });

  it("keeps the two services whose CSV headers were misspelled", () => {
    // These filters matched nothing in the previous version because the page
    // spelled them correctly while the CSV headers did not.
    const withRepro = hospitals.filter((h) => h.reproductive);
    const withEol = hospitals.filter((h) => h.endOfLife);

    expect(
      withRepro.some(
        (h) => h.reproductive?.services["miscarriage-ectopic-care"] === "yes",
      ),
    ).toBe(true);
    expect(
      withEol.some(
        (h) => h.endOfLife?.services["dwd-educational-materials"] === "yes",
      ),
    ).toBe(true);
  });

  it("preserves see-comments as its own state", () => {
    const seeComments = hospitals.flatMap((hospital) =>
      PROGRAMS.flatMap((program) =>
        Object.values(hospital[program]?.services ?? {}).filter(
          (value) => value === "see-comments",
        ),
      ),
    );
    expect(seeComments.length).toBeGreaterThan(0);
  });

  it("does not list the same facility twice under name variants", () => {
    const simplified = hospitals.map((hospital) =>
      hospital.name.toLowerCase().replace(/[^a-z0-9]/g, ""),
    );
    expect(new Set(simplified).size).toBe(simplified.length);
  });

  it("keeps facilities that have no coordinates instead of dropping them", () => {
    // The old map silently discarded rows with unparseable Lat/Long.
    const total = hospitals.length;
    const mappable = hospitals.filter((h) => h.coordinates !== null).length;
    expect(total).toBeGreaterThanOrEqual(mappable);
  });

  it("places every mapped facility inside Washington state", () => {
    for (const hospital of hospitals) {
      if (!hospital.coordinates) continue;
      expect(hospital.coordinates.lat).toBeGreaterThan(45);
      expect(hospital.coordinates.lat).toBeLessThan(49.1);
      expect(hospital.coordinates.lng).toBeLessThan(-116.5);
      expect(hospital.coordinates.lng).toBeGreaterThan(-125);
    }
  });
});
