import { ServiceRow } from "@/components/hospital/ServiceRow";
import { CoverageBar } from "@/components/service/state";
import { Logo } from "@/components/site/Logo";
import {
  groupRuns,
  PROGRAMS,
  SERVICES_BY_PROGRAM,
  type Hospital,
  type ProgramId,
} from "@/data/schema";
import { coverageFor } from "@/lib/coverage";

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
      <header className="border-b border-black/10 bg-header">
        <div className="mx-auto flex max-w-[1600px] items-center gap-2.5 px-4 py-2.5 lg:px-8">
          <Logo className="size-8 shrink-0" />
          <div className="leading-tight">
            <p className="text-base font-bold tracking-tight text-header-ink">
              Washington Care Access
            </p>
            <p className="text-2xs text-header-ink-muted">
              What each hospital told the state it provides
            </p>
          </div>
        </div>
      </header>

      <main
        id="main"
        className="mx-auto w-full max-w-[1600px] flex-1 px-4 py-8 lg:px-8"
      >
        <h1 className="text-2xl font-bold tracking-tight text-ink">
          Hospital care directory
        </h1>
        <p className="mt-1.5 max-w-2xl text-sm text-ink-muted">
          Reproductive health and end-of-life services reported by{" "}
          {hospitals.length} Washington state facilities. Enable JavaScript to
          search, filter by service, compare every facility side by side, and
          view them on a map.
        </p>

        <div className="mt-6 grid gap-3 lg:grid-cols-2 2xl:grid-cols-3">
          {hospitals.map((hospital) => (
            <article
              key={hospital.id}
              className="rounded-xl border border-line bg-surface p-4"
            >
              <h2 className="text-sm font-semibold text-ink">
                {hospital.name}
              </h2>
              <p className="text-xs text-ink-subtle">
                {[hospital.city, hospital.state].filter(Boolean).join(", ") ||
                  "Location not reported"}
              </p>

              {PROGRAMS.map((program) => {
                const record = hospital[program];
                if (!record) return null;
                const coverage = coverageFor(hospital, program);
                return (
                  <details key={program} className="group mt-3">
                    <summary className="cursor-pointer list-none text-xs font-semibold text-brand">
                      {PROGRAM_LABELS[program]}
                      {coverage ? (
                        <span className="tnum ml-1.5 font-normal text-ink-subtle">
                          {coverage.yes} of {coverage.total} offered
                        </span>
                      ) : null}
                    </summary>
                    {coverage ? (
                      <CoverageBar {...coverage} className="mt-2" />
                    ) : null}
                    {groupRuns(SERVICES_BY_PROGRAM[program]).map((run) => (
                      <section key={run.group} className="mt-3">
                        <h3 className="mb-1 text-2xs font-semibold tracking-wide text-ink-subtle uppercase">
                          {run.group}
                        </h3>
                        <div className="divide-y divide-line rounded-lg border border-line px-2.5">
                          {run.services.map((service) => (
                            <ServiceRow
                              key={service.key}
                              service={service}
                              value={record.services[service.key] ?? "unknown"}
                            />
                          ))}
                        </div>
                      </section>
                    ))}
                    {record.comments ? (
                      <p className="mt-3 rounded-lg bg-surface-sunken p-3 text-xs text-ink-muted">
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
