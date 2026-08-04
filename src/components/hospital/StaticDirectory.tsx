import { ServiceRow } from "@/components/hospital/ServiceRow";
import {
  PROGRAMS,
  SERVICES_BY_PROGRAM,
  type Hospital,
  type ProgramId,
} from "@/data/schema";

const PROGRAM_LABELS: Record<ProgramId, string> = {
  reproductive: "Reproductive health services",
  endOfLife: "End-of-life services",
};

/**
 * A non-interactive, fully server-rendered directory of every facility.
 *
 * This is the Suspense fallback for HospitalExplorer, which is deliberate
 * rather than incidental: the explorer reads URL state via useSearchParams,
 * so Next cannot prerender it and emits the fallback into the static HTML
 * instead. Making that fallback the complete directory means the exported
 * page ships all the data as real markup — crawlers and readers with
 * JavaScript disabled get the whole dataset, and everyone else sees it
 * replaced by the interactive version at hydration.
 *
 * Expansion uses native <details>, so it works with no JavaScript at all.
 */
export function StaticDirectory({
  hospitals,
}: {
  hospitals: readonly Hospital[];
}) {
  return (
    <>
      <header className="bg-darkblue shadow-md">
        <div className="mx-auto max-w-7xl px-4 py-3 lg:px-8">
          <p className="text-lg font-bold text-white sm:text-2xl">
            Washington Care Access
          </p>
          <p className="text-xs text-lightblue sm:text-sm">
            Transparency Initiative
          </p>
        </div>
      </header>

      <main
        id="main"
        className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 lg:px-8"
      >
        <h1 className="text-2xl font-semibold text-gray-900">
          Hospital care directory
        </h1>
        <p className="mt-1 max-w-3xl text-sm text-gray-600">
          Reproductive health and end-of-life services reported by{" "}
          {hospitals.length} Washington state facilities. Enable JavaScript to
          search, filter by service, and view these facilities on a map.
        </p>

        <div className="mt-6 grid gap-3">
          {hospitals.map((hospital) => (
            <article
              key={hospital.id}
              className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
            >
              <h2 className="font-semibold text-gray-900">{hospital.name}</h2>
              <p className="text-sm text-gray-600">
                {[hospital.city, hospital.state].filter(Boolean).join(", ") ||
                  "Location not reported"}
              </p>

              {PROGRAMS.map((program) => {
                const record = hospital[program];
                if (!record) return null;
                return (
                  <details key={program} className="mt-3">
                    <summary className="cursor-pointer text-sm font-medium text-darkblue">
                      {PROGRAM_LABELS[program]}
                    </summary>
                    <div className="mt-2 divide-y divide-gray-100">
                      {SERVICES_BY_PROGRAM[program].map((service) => (
                        <ServiceRow
                          key={service.key}
                          service={service}
                          value={record.services[service.key] ?? "unknown"}
                        />
                      ))}
                    </div>
                    {record.comments ? (
                      <p className="mt-2 rounded bg-gray-50 p-2 text-sm text-gray-700">
                        {record.comments}
                      </p>
                    ) : null}
                  </details>
                );
              })}
            </article>
          ))}
        </div>
      </main>
    </>
  );
}
