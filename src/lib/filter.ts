import type { Hospital, ProgramId, ServiceValue } from "@/data/schema";

/**
 * Service states that count as "this facility offers it" when filtering.
 *
 * "see-comments" is included deliberately. The previous implementation tested
 * `value.toLowerCase() === "yes"`, which lumped "See comments" in with "No"
 * and hid those facilities entirely — for someone looking for care, "the
 * policy has a caveat, read it" is a materially different answer from "no".
 * The UI labels these distinctly so the caveat is never mistaken for a plain
 * yes.
 */
export const MATCHING_SERVICE_VALUES: readonly ServiceValue[] = [
  "yes",
  "see-comments",
];

export interface FilterState {
  program: ProgramId;
  search: string;
  /** Service keys that must all be offered. */
  services: readonly string[];
}

export function hospitalOffers(
  hospital: Hospital,
  program: ProgramId,
  serviceKey: string,
): boolean {
  const value = hospital[program]?.services[serviceKey];
  return value !== undefined && MATCHING_SERVICE_VALUES.includes(value);
}

/** Case-insensitive match against hospital name or city. */
export function matchesSearch(hospital: Hospital, search: string): boolean {
  const term = search.trim().toLowerCase();
  if (!term) return true;
  return (
    hospital.name.toLowerCase().includes(term) ||
    (hospital.city?.toLowerCase().includes(term) ?? false)
  );
}

/**
 * Pure and synchronous so the UI can call it from a useMemo. The old version
 * ran filtering inside a useEffect that wrote the result back into state,
 * which meant every keystroke rendered twice and the list briefly showed
 * stale results.
 */
export function filterHospitals(
  hospitals: readonly Hospital[],
  { program, search, services }: FilterState,
): Hospital[] {
  return hospitals.filter((hospital) => {
    // A facility that never filed for this program has nothing to say here.
    if (hospital[program] === null) return false;
    if (!matchesSearch(hospital, search)) return false;
    return services.every((key) => hospitalOffers(hospital, program, key));
  });
}
