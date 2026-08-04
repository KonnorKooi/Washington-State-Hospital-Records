import generated from "./generated/hospitals.json";
import type { HospitalsFile } from "./schema";

/**
 * The build-time output of scripts/build-data.ts.
 *
 * Imported directly rather than fetched at runtime, so the data ships inside
 * the HTML: no loading spinner, no client-side CSV parsing, and hospital names
 * are visible to search engines.
 */
export const hospitalsFile = generated as HospitalsFile;
export const hospitals = hospitalsFile.hospitals;
