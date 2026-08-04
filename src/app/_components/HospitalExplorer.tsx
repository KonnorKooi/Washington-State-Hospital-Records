"use client";

import {
  ArrowDownWideNarrow,
  Grid3x3,
  Map as MapIcon,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import dynamic from "next/dynamic";
import {
  parseAsArrayOf,
  parseAsString,
  parseAsStringLiteral,
  useQueryState,
} from "nuqs";
import { useCallback, useMemo, useState } from "react";

import { ServiceFilters } from "@/components/filters/ServiceFilters";
import { HospitalCard } from "@/components/hospital/HospitalCard";
import { ServiceMatrix } from "@/components/matrix/ServiceMatrix";
import { ServiceLegend } from "@/components/service/state";
import { SiteHeader } from "@/components/site/SiteHeader";
import { PROGRAMS, SERVICES_BY_PROGRAM, type Hospital } from "@/data/schema";
import { SORT_MODES, sortHospitals } from "@/lib/coverage";
import { filterHospitals } from "@/lib/filter";
import { cn } from "@/lib/utils";

// MapLibre touches window/document on import, so it must stay out of the
// prerendered HTML. The list below the map is the non-JS fallback.
const HospitalMap = dynamic(
  () => import("@/components/map/HospitalMap").then((m) => m.HospitalMap),
  {
    ssr: false,
    loading: () => (
      <div className="grid h-full place-items-center bg-surface-sunken text-xs text-ink-subtle">
        Loading map…
      </div>
    ),
  },
);

const VIEWS = ["map", "matrix"] as const;

const VIEW_META = {
  map: { label: "Map & list", Icon: MapIcon },
  matrix: { label: "Compare all", Icon: Grid3x3 },
} as const;

const SORT_LABELS = { name: "A–Z", coverage: "Most offered" } as const;

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
  const [view, setView] = useQueryState(
    "view",
    parseAsStringLiteral(VIEWS).withDefault("map"),
  );
  const [sort, setSort] = useQueryState(
    "sort",
    parseAsStringLiteral(SORT_MODES).withDefault("name"),
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

  // Panel visibility is ephemeral UI, not a view worth linking to, so unlike
  // everything above it stays in component state.
  const [filtersOpen, setFiltersOpen] = useState(false);

  const services = SERVICES_BY_PROGRAM[program];

  // Derived, not stored. Recomputes on change instead of round-tripping
  // through an effect and a second render.
  const visible = useMemo(
    () =>
      sortHospitals(
        filterHospitals(hospitals, {
          program,
          search,
          services: selectedServices,
        }),
        program,
        sort,
      ),
    [hospitals, program, search, selectedServices, sort],
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

  const filtered = search.trim() !== "" || selectedServices.length > 0;

  return (
    <>
      <SiteHeader program={program} onProgramChange={handleProgramChange} />

      <main
        id="main"
        className="mx-auto w-full max-w-[1600px] flex-1 px-4 pb-10 lg:px-8"
      >
        <div
          id="program-panel"
          role="tabpanel"
          aria-labelledby={`tab-${program}`}
        >
          {/* Toolbar: search, view, sort and filters in one band, so the
              controls stay together whichever view is showing. */}
          <div className="z-40 -mx-4 border-b border-line bg-canvas/90 px-4 py-3 backdrop-blur lg:sticky lg:top-[57px] lg:-mx-8 lg:px-8">
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative basis-full sm:max-w-xs sm:flex-1 sm:basis-auto">
                <label htmlFor="hospital-search" className="sr-only">
                  Search by hospital or city
                </label>
                <Search
                  className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-ink-subtle"
                  aria-hidden="true"
                />
                <input
                  id="hospital-search"
                  type="search"
                  value={search}
                  onChange={(event) =>
                    void setSearch(event.target.value || null)
                  }
                  placeholder="Search hospital or city"
                  className="w-full rounded-lg border border-line bg-surface py-1.5 pr-3 pl-8 text-sm text-ink placeholder:text-ink-subtle focus:border-brand"
                />
              </div>

              <ViewSwitch view={view} onChange={(next) => void setView(next)} />

              <button
                type="button"
                aria-expanded={filtersOpen}
                onClick={() => setFiltersOpen((open) => !open)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-sm font-medium transition-colors",
                  selectedServices.length > 0
                    ? "border-brand bg-brand-subtle text-brand"
                    : "border-line bg-surface text-ink-muted hover:text-ink",
                )}
              >
                <SlidersHorizontal className="size-4" aria-hidden="true" />
                <span className="sr-only sm:not-sr-only">
                  Filter by service
                </span>
                {selectedServices.length > 0 ? (
                  <span className="tnum rounded-full bg-brand px-1.5 text-2xs font-semibold text-brand-ink">
                    {selectedServices.length}
                  </span>
                ) : null}
              </button>

              <SortSwitch sort={sort} onChange={(next) => void setSort(next)} />

              <div className="ml-auto flex items-center gap-3">
                {filtered ? (
                  <button
                    type="button"
                    onClick={() => {
                      void setSearch(null);
                      void setSelectedServices(null);
                    }}
                    className="inline-flex items-center gap-1 rounded-md px-1.5 py-1 text-xs font-medium text-brand hover:bg-brand-subtle"
                  >
                    <X className="size-3.5" aria-hidden="true" />
                    Reset
                  </button>
                ) : null}
                <p
                  aria-live="polite"
                  className="tnum text-xs font-medium text-ink-muted"
                >
                  <span className="text-base font-bold text-ink">
                    {visible.length}
                  </span>{" "}
                  of {hospitals.length} facilities
                </p>
              </div>
            </div>

            {filtersOpen ? (
              <div className="mt-3">
                <ServiceFilters
                  services={services}
                  selected={selectedServices}
                  onChange={handleServiceChange}
                  onClear={() => void setSelectedServices(null)}
                  onClose={() => setFiltersOpen(false)}
                />
              </div>
            ) : null}
          </div>

          <div className="pt-4">
            {view === "matrix" ? (
              <>
                <ServiceLegend className="mb-2.5" />
                <ServiceMatrix
                  hospitals={visible}
                  program={program}
                  selectedId={selectedId}
                  onSelect={(id) => void setSelectedId(id)}
                />
                <p className="mt-2 text-2xs text-ink-subtle">
                  Scroll sideways for the remaining services. Select a facility
                  name to pin it, or switch to Map &amp; list for its full
                  filing.
                </p>
              </>
            ) : (
              <div className="grid gap-4 lg:grid-cols-[minmax(0,1.55fr)_minmax(22rem,1fr)]">
                <div className="lg:sticky lg:top-[124px] lg:self-start">
                  <div className="h-[46vh] min-h-[320px] overflow-hidden rounded-xl border border-line lg:h-[calc(100vh-13.5rem)]">
                    <HospitalMap
                      hospitals={visible}
                      selectedId={selectedId}
                      onSelect={(id) => void setSelectedId(id)}
                    />
                  </div>
                  <ServiceLegend className="mt-2.5" />
                </div>

                {/* Block flow, not flex: as flex children the cards were
                    shrunk to fit the scroller and lost their lower half. */}
                <div className="space-y-2 lg:max-h-[calc(100vh-9.5rem)] lg:overflow-y-auto lg:pr-1">
                  {visible.length === 0 ? (
                    <p className="rounded-xl border border-line bg-surface p-4 text-sm text-ink-muted">
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
            )}
          </div>
        </div>
      </main>
    </>
  );
}

function ViewSwitch({
  view,
  onChange,
}: {
  view: (typeof VIEWS)[number];
  onChange: (view: (typeof VIEWS)[number]) => void;
}) {
  return (
    <div
      role="group"
      aria-label="View"
      className="flex gap-0.5 rounded-lg border border-line bg-surface p-0.5"
    >
      {VIEWS.map((id) => {
        const { label, Icon } = VIEW_META[id];
        const active = id === view;
        return (
          <button
            key={id}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(id)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-sm font-medium transition-colors",
              active
                ? "bg-brand text-brand-ink"
                : "text-ink-muted hover:bg-surface-sunken hover:text-ink",
            )}
          >
            <Icon className="size-4" aria-hidden="true" />
            {label}
          </button>
        );
      })}
    </div>
  );
}

function SortSwitch({
  sort,
  onChange,
}: {
  sort: (typeof SORT_MODES)[number];
  onChange: (sort: (typeof SORT_MODES)[number]) => void;
}) {
  return (
    <div className="relative inline-flex items-center gap-1.5 rounded-lg border border-line bg-surface py-1.5 pr-2 pl-2.5 text-sm text-ink-muted">
      <ArrowDownWideNarrow className="size-4 shrink-0" aria-hidden="true" />
      <label htmlFor="sort-mode" className="sr-only">
        Sort facilities
      </label>
      <select
        id="sort-mode"
        value={sort}
        onChange={(event) =>
          onChange(event.target.value as (typeof SORT_MODES)[number])
        }
        className="appearance-none bg-transparent pr-1 font-medium text-ink focus:outline-none"
      >
        {SORT_MODES.map((mode) => (
          <option key={mode} value={mode}>
            {SORT_LABELS[mode]}
          </option>
        ))}
      </select>
    </div>
  );
}
