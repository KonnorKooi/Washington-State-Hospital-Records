"use client";

import dynamic from "next/dynamic";
import {
  parseAsArrayOf,
  parseAsString,
  parseAsStringLiteral,
  useQueryState,
} from "nuqs";
import { useCallback, useMemo } from "react";

import { ServiceFilters } from "@/components/filters/ServiceFilters";
import { HospitalCard } from "@/components/hospital/HospitalCard";
import { SiteHeader } from "@/components/site/SiteHeader";
import { PROGRAMS, SERVICES_BY_PROGRAM, type Hospital } from "@/data/schema";
import { filterHospitals } from "@/lib/filter";

// MapLibre touches window/document on import, so it must stay out of the
// prerendered HTML. The list below the map is the non-JS fallback.
const HospitalMap = dynamic(
  () => import("@/components/map/HospitalMap").then((m) => m.HospitalMap),
  {
    ssr: false,
    loading: () => (
      <div className="grid h-full place-items-center text-sm text-gray-500">
        Loading map…
      </div>
    ),
  },
);

/**
 * Owns all explorer state, held in the URL rather than component state so a
 * filtered view is linkable and the back button works. This replaces the old
 * arrangement where the fetch hook owned a `filteredHospitals` setter that the
 * page wrote derived results back into through an effect.
 */
export function HospitalExplorer({
  hospitals,
}: {
  hospitals: readonly Hospital[];
}) {
  const [program, setProgram] = useQueryState(
    "program",
    parseAsStringLiteral(PROGRAMS).withDefault("reproductive"),
  );
  const [search, setSearch] = useQueryState(
    "q",
    parseAsString.withDefault("").withOptions({ throttleMs: 200 }),
  );
  const [selectedServices, setSelectedServices] = useQueryState(
    "services",
    parseAsArrayOf(parseAsString).withDefault([]),
  );
  const [selectedId, setSelectedId] = useQueryState("hospital", parseAsString);

  const services = SERVICES_BY_PROGRAM[program];

  // Derived, not stored. Recomputes on change instead of round-tripping
  // through an effect and a second render.
  const visible = useMemo(
    () =>
      filterHospitals(hospitals, {
        program,
        search,
        services: selectedServices,
      }),
    [hospitals, program, search, selectedServices],
  );

  const handleProgramChange = useCallback(
    (next: (typeof PROGRAMS)[number]) => {
      void setProgram(next);
      // Service keys are program-specific; carrying them across would filter
      // on keys that don't exist in the new program.
      void setSelectedServices(null);
      void setSelectedId(null);
    },
    [setProgram, setSelectedServices, setSelectedId],
  );

  const handleServiceChange = useCallback(
    (key: string, checked: boolean) => {
      void setSelectedServices((current) => {
        const base = current ?? [];
        const next = checked
          ? [...base, key]
          : base.filter((item) => item !== key);
        return next.length > 0 ? next : null;
      });
    },
    [setSelectedServices],
  );

  return (
    <>
      <SiteHeader program={program} onProgramChange={handleProgramChange} />

      <main
        id="main"
        className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 lg:px-8"
      >
        <div
          id="program-panel"
          role="tabpanel"
          aria-labelledby={`tab-${program}`}
          className="flex flex-col gap-6 lg:flex-row"
        >
          <div className="flex w-full flex-col gap-6 lg:w-2/3">
            <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
              <label
                htmlFor="hospital-search"
                className="block text-sm font-medium text-gray-700"
              >
                Search by hospital or city
              </label>
              <input
                id="hospital-search"
                type="search"
                value={search}
                onChange={(event) => void setSearch(event.target.value || null)}
                placeholder="e.g. Yakima"
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-darkblue"
              />
            </div>

            <div className="h-[380px] overflow-hidden rounded-lg border border-gray-200 shadow-sm lg:h-[480px]">
              <HospitalMap
                hospitals={visible}
                selectedId={selectedId}
                onSelect={(id) => void setSelectedId(id)}
              />
            </div>

            <ServiceFilters
              services={services}
              selected={selectedServices}
              onChange={handleServiceChange}
              onClear={() => void setSelectedServices(null)}
            />
          </div>

          <div className="w-full lg:w-1/3">
            <div
              aria-live="polite"
              className="mb-2 text-sm font-medium text-gray-700"
            >
              {visible.length} of {hospitals.length} facilities
            </div>
            <div className="max-h-[640px] overflow-y-auto pr-1 lg:max-h-[860px]">
              {visible.length === 0 ? (
                <p className="rounded-lg border border-gray-200 bg-white p-4 text-sm text-gray-600">
                  No facilities match these filters. Try clearing a service
                  filter or broadening your search.
                </p>
              ) : (
                visible.map((hospital) => (
                  <HospitalCard
                    key={hospital.id}
                    hospital={hospital}
                    program={program}
                    expanded={hospital.id === selectedId}
                    onToggle={(id) => void setSelectedId(id)}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
