/**
 * Build-time data pipeline: CSV -> validate -> normalize -> merge -> JSON.
 *
 * Run by `npm run build:data` (wired to prebuild/predev). Exits non-zero on
 * any structural problem so bad data fails CI instead of rendering as blank
 * cells in production.
 *
 * Fatal (build fails):
 *   - a CSV header that isn't declared in src/data/schema.ts, or vice versa
 *   - a service cell whose value we don't recognize
 *   - two different hospitals slugifying to the same id
 *
 * Warning (build continues, logged loudly):
 *   - a row with missing/unparseable coordinates
 *   - two hospital names similar enough to be the same facility but not
 *     listed in CANONICAL_NAME_ALIASES
 */
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

import Papa from "papaparse";

import {
  EXTRA_COLUMNS,
  IDENTITY_COLUMNS,
  KNOWN_DISTINCT_FACILITIES,
  SERVICES_BY_PROGRAM,
  canonicalizeName,
  coordinatesSchema,
  hospitalsFileSchema,
  normalizeFlag,
  normalizeServiceValue,
  splitNameAnnotation,
  toHospitalId,
  type Coordinates,
  type Hospital,
  type ProgramId,
  type ProgramRecord,
  type ServiceValue,
} from "../src/data/schema.js";

const rootDir = join(dirname(fileURLToPath(import.meta.url)), "..");
const outFile = join(rootDir, "src/data/generated/hospitals.json");

const SOURCES: Record<ProgramId, string> = {
  reproductive: "public/data/reproductive.csv",
  endOfLife: "public/data/endoflife.csv",
};

const errors: string[] = [];
const warnings: string[] = [];

function fail(message: string) {
  errors.push(message);
}

function warn(message: string) {
  warnings.push(message);
}

type Row = Record<string, string | undefined>;

function readCsv(file: string): { rows: Row[]; headers: string[] } {
  const text = readFileSync(join(rootDir, file), "utf8");
  const parsed = Papa.parse<Row>(text, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (header) => header.trim(),
  });

  for (const error of parsed.errors) {
    fail(`${file}: parse error on row ${error.row ?? "?"}: ${error.message}`);
  }

  return { rows: parsed.data, headers: parsed.meta.fields ?? [] };
}

/**
 * The guardrail that kills the dead-filter class of bug: the declared service
 * list and the CSV header row must agree exactly, in both directions.
 */
function checkHeaders(program: ProgramId, file: string, headers: string[]) {
  const expected = new Set<string>([
    ...IDENTITY_COLUMNS,
    ...EXTRA_COLUMNS[program],
    ...SERVICES_BY_PROGRAM[program].map((service) => service.column),
  ]);
  const actual = new Set(headers.filter((header) => header.length > 0));

  for (const column of expected) {
    if (!actual.has(column)) {
      fail(
        `${file}: schema declares column "${column}" but the CSV has no such header. ` +
          `Either the CSV header changed or src/data/schema.ts is out of date.`,
      );
    }
  }
  for (const column of actual) {
    if (!expected.has(column)) {
      fail(
        `${file}: CSV has undeclared column "${column}". ` +
          `Add it to src/data/schema.ts (as a service or in IDENTITY_COLUMNS/EXTRA_COLUMNS) or remove it.`,
      );
    }
  }
}

function optional(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function parseCoordinates(row: Row, label: string): Coordinates | null {
  const rawLat = optional(row["Lat"]);
  const rawLng = optional(row["Long"]);
  if (!rawLat || !rawLng) return null;

  const parsed = coordinatesSchema.safeParse({
    lat: Number(rawLat),
    lng: Number(rawLng),
  });
  if (!parsed.success) {
    warn(
      `${label}: coordinates "${rawLat}, ${rawLng}" are missing or outside Washington state — ` +
        `hospital will be listed but not shown on the map.`,
    );
    return null;
  }
  return parsed.data;
}

function buildProgramRecord(
  program: ProgramId,
  row: Row,
  label: string,
): ProgramRecord {
  const services: Record<string, ServiceValue> = {};

  for (const service of SERVICES_BY_PROGRAM[program]) {
    const value = normalizeServiceValue(row[service.column]);
    if (value === null) {
      fail(
        `${label}: column "${service.column}" has unrecognized value ` +
          `"${row[service.column]}". Expected one of Yes / No / See comments / blank.`,
      );
      services[service.key] = "unknown";
      continue;
    }
    services[service.key] = value;
  }

  const record: ProgramRecord = {
    services,
    comments: optional(
      program === "reproductive"
        ? row["Additional Comments"]
        : row["Comments?"],
    ),
    dateSigned: optional(row["Date signed"]),
    contact: optional(row["Contact"]),
  };

  if (program === "endOfLife") {
    record.recentEnoughForUse = normalizeFlag(row["Recent enough for use?"]);
    record.incorrectForm = normalizeFlag(row["Incorrect form?"]);
  }

  return record;
}

/** Flag likely-unlisted name variants so they don't become duplicate pins. */
function reportNearDuplicates(names: string[]) {
  const simplify = (name: string) =>
    name.toLowerCase().replace(/[^a-z0-9]/g, "");
  const knownDistinct = new Set(KNOWN_DISTINCT_FACILITIES.map(simplify));

  for (let i = 0; i < names.length; i += 1) {
    for (let j = i + 1; j < names.length; j += 1) {
      const a = simplify(names[i]!);
      const b = simplify(names[j]!);
      if (a === b) continue;
      if (knownDistinct.has(a) && knownDistinct.has(b)) continue;
      // One name fully containing the other is the pattern every real variant
      // in this dataset follows ("X" vs "X (King County ...)").
      if (a.startsWith(b) || b.startsWith(a)) {
        warn(
          `Possible duplicate facility, not merged: "${names[i]}" vs "${names[j]}". ` +
            `If these are the same hospital, add an entry to CANONICAL_NAME_ALIASES in src/data/schema.ts.`,
        );
      }
    }
  }
}

function main() {
  const hospitalsByName = new Map<string, Hospital>();
  const idOwner = new Map<string, string>();
  const sources: { program: ProgramId; file: string; rows: number }[] = [];

  for (const program of ["reproductive", "endOfLife"] as const) {
    const file = SOURCES[program];
    const { rows, headers } = readCsv(file);
    checkHeaders(program, file, headers);
    sources.push({ program, file, rows: rows.length });

    rows.forEach((row, index) => {
      const rawName = optional(row["Hospital"]);
      if (!rawName) {
        fail(`${file} row ${index + 2}: missing Hospital name.`);
        return;
      }

      const { name: strippedName, note } = splitNameAnnotation(rawName);
      const name = canonicalizeName(strippedName);
      const label = `${file} row ${index + 2} (${name})`;
      const id = toHospitalId(name);

      const previousOwner = idOwner.get(id);
      if (previousOwner && previousOwner !== name) {
        fail(
          `${label}: id "${id}" collides with "${previousOwner}". ` +
            `Two different hospitals cannot share a slug — disambiguate the names.`,
        );
        return;
      }
      idOwner.set(id, name);

      const coordinates = parseCoordinates(row, label);
      const record = buildProgramRecord(program, row, label);

      const existing = hospitalsByName.get(name);
      if (existing) {
        existing[program] = record;
        // Prefer whichever file actually has the field populated.
        existing.address ??= optional(row["Address"]);
        existing.city ??= optional(row["City"]);
        existing.state ??= optional(row["State"]);
        existing.zip ??= optional(row["Zip Code"]);
        existing.phone ??= optional(row["Phone number"]);
        existing.coordinates ??= coordinates;
        existing.isBehavioralOrSubstance ||= normalizeFlag(
          row["Behavioral/Substance?"],
        );
        if (note) {
          existing.dataQualityNotes = [
            ...new Set([...(existing.dataQualityNotes ?? []), note]),
          ];
        }
        return;
      }

      hospitalsByName.set(name, {
        id,
        name,
        address: optional(row["Address"]),
        city: optional(row["City"]),
        state: optional(row["State"]),
        zip: optional(row["Zip Code"]),
        phone: optional(row["Phone number"]),
        coordinates,
        isBehavioralOrSubstance: normalizeFlag(row["Behavioral/Substance?"]),
        dataQualityNotes: note ? [note] : undefined,
        reproductive: program === "reproductive" ? record : null,
        endOfLife: program === "endOfLife" ? record : null,
      });
    });
  }

  const hospitals = [...hospitalsByName.values()].sort((a, b) =>
    a.name.localeCompare(b.name),
  );

  reportNearDuplicates(hospitals.map((hospital) => hospital.name));

  for (const warning of warnings) {
    console.warn(`  warn  ${warning}`);
  }

  if (errors.length > 0) {
    console.error(`\n${errors.length} data error(s):\n`);
    for (const error of errors) console.error(`  error  ${error}`);
    console.error(
      "\nBuild aborted — fix the source data or src/data/schema.ts.\n",
    );
    process.exit(1);
  }

  const payload = hospitalsFileSchema.parse({
    generatedAt: new Date().toISOString(),
    sources,
    hospitals,
  });

  mkdirSync(dirname(outFile), { recursive: true });
  const json = `${JSON.stringify(payload, null, 2)}\n`;
  writeFileSync(outFile, json);

  const withCoords = hospitals.filter((h) => h.coordinates !== null).length;
  const both = hospitals.filter(
    (h) => h.reproductive !== null && h.endOfLife !== null,
  ).length;

  console.log(
    [
      `\n  ${relative(rootDir, outFile)}`,
      `  ${hospitals.length} hospitals  (${both} with both programs)`,
      `  ${withCoords} mappable, ${hospitals.length - withCoords} without coordinates`,
      `  ${warnings.length} warning(s)`,
      `  sha ${createHash("sha256").update(json).digest("hex").slice(0, 12)}\n`,
    ].join("\n"),
  );
}

main();
