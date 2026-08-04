import { describe, expect, it } from "vitest";

import {
  END_OF_LIFE_SERVICES,
  REPRODUCTIVE_SERVICES,
  canonicalizeName,
  normalizeFlag,
  normalizeServiceValue,
  splitNameAnnotation,
  toHospitalId,
} from "./schema";

describe("normalizeServiceValue", () => {
  it("maps the three states the source data actually uses", () => {
    expect(normalizeServiceValue("Yes")).toBe("yes");
    expect(normalizeServiceValue("No")).toBe("no");
    expect(normalizeServiceValue("See comments")).toBe("see-comments");
  });

  it("treats a blank cell as unreported rather than as a no", () => {
    expect(normalizeServiceValue("")).toBe("unknown");
    expect(normalizeServiceValue(undefined)).toBe("unknown");
    expect(normalizeServiceValue("   ")).toBe("unknown");
  });

  it("is tolerant of casing and stray whitespace", () => {
    expect(normalizeServiceValue("  YES ")).toBe("yes");
    expect(normalizeServiceValue("see  comments")).toBe("see-comments");
  });

  it("returns null for anything unrecognized so the build can fail loudly", () => {
    expect(normalizeServiceValue("Maybe")).toBeNull();
    expect(normalizeServiceValue("sometimes")).toBeNull();
  });
});

describe("normalizeFlag", () => {
  it("reads the TRUE/FALSE metadata columns", () => {
    expect(normalizeFlag("TRUE")).toBe(true);
    expect(normalizeFlag("FALSE")).toBe(false);
    expect(normalizeFlag("")).toBe(false);
    expect(normalizeFlag(undefined)).toBe(false);
  });
});

describe("splitNameAnnotation", () => {
  it("separates the ** notes that data entry appended to names", () => {
    expect(
      splitNameAnnotation(
        "Dayton General Hospital (Columbia County Public Hospital District #1) ** old/odd form",
      ),
    ).toEqual({
      name: "Dayton General Hospital (Columbia County Public Hospital District #1)",
      note: "old/odd form",
    });
    expect(
      splitNameAnnotation("Fred Hutchinson Cancer Care **incorrect form"),
    ).toEqual({
      name: "Fred Hutchinson Cancer Care",
      note: "incorrect form",
    });
  });

  it("leaves ordinary names untouched", () => {
    expect(splitNameAnnotation("Astria Sunnyside Hospital")).toEqual({
      name: "Astria Sunnyside Hospital",
    });
  });
});

describe("canonicalizeName", () => {
  it("resolves the known cross-file spelling variants", () => {
    expect(canonicalizeName("Astria Sunnyside Hospital")).toBe(
      "Astria Sunnyside Hospital and Clinics",
    );
    expect(
      canonicalizeName(
        "Arbor Health, Morton Hospital / Lew County Hospital District No.1",
      ),
    ).toBe(
      "Arbor Health, Morton Hospital / Lewis County Hospital District No.1",
    );
  });

  it("passes through names with no alias", () => {
    expect(canonicalizeName("BHC Fairfax Hospital Monroe")).toBe(
      "BHC Fairfax Hospital Monroe",
    );
  });
});

describe("toHospitalId", () => {
  it("produces stable url-safe slugs", () => {
    expect(toHospitalId("Astria Sunnyside Hospital and Clinics")).toBe(
      "astria-sunnyside-hospital-and-clinics",
    );
    expect(
      toHospitalId("Arbor Health, Morton Hospital / Lewis County Hospital"),
    ).toBe("arbor-health-morton-hospital-lewis-county-hospital");
  });

  it("expands ampersands so they do not vanish", () => {
    expect(toHospitalId("Peace & Health")).toBe("peace-and-health");
  });
});

describe("service definitions", () => {
  const all = [...REPRODUCTIVE_SERVICES, ...END_OF_LIFE_SERVICES];

  it("uses unique keys across both programs", () => {
    const keys = all.map((service) => service.key);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it("maps every key to a distinct CSV column", () => {
    const columns = all.map((service) => service.column);
    expect(new Set(columns).size).toBe(columns.length);
  });

  it("covers the service counts in the source files", () => {
    expect(REPRODUCTIVE_SERVICES).toHaveLength(26);
    expect(END_OF_LIFE_SERVICES).toHaveLength(17);
  });
});
