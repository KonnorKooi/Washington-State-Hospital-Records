"use client";

import { AlertTriangle, ChevronDown, MapPinOff, Phone } from "lucide-react";
import { useEffect, useRef } from "react";

import { ServiceRow } from "@/components/hospital/ServiceRow";
import { CoverageBar } from "@/components/service/state";
import {
  groupRuns,
  SERVICES_BY_PROGRAM,
  type Hospital,
  type ProgramId,
} from "@/data/schema";
import { coverageFor } from "@/lib/coverage";
import { cn } from "@/lib/utils";

/**
 * A hospital summary that expands to the full service list.
 *
 * Expansion is driven by `expanded` (compared by id upstream, not by object
 * identity as before) and the toggle is a real <button>, so it is reachable
 * and operable from the keyboard — the previous card was a div with an
 * onClick handler and no role, tabindex, or key handling.
 *
 * The collapsed state now carries a coverage bar and count. Previously a
 * closed card showed only a name and a city, so scanning the list told you
 * nothing about the data and every comparison required opening cards one at a
 * time.
 */
export function HospitalCard({
  hospital,
  program,
  expanded,
  onToggle,
}: {
  hospital: Hospital;
  program: ProgramId;
  expanded: boolean;
  onToggle: (id: string | null) => void;
}) {
  const ref = useRef<HTMLElement>(null);
  const wasExpanded = useRef(expanded);

  // Scroll into view when this card becomes the selected one (e.g. via a map
  // click), but not on first mount, which would hijack the initial scroll.
  useEffect(() => {
    if (expanded && !wasExpanded.current) {
      ref.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
    wasExpanded.current = expanded;
  }, [expanded]);

  const record = hospital[program];
  const services = SERVICES_BY_PROGRAM[program];
  const coverage = coverageFor(hospital, program);
  const panelId = `hospital-panel-${hospital.id}`;

  return (
    <article
      ref={ref}
      className={cn(
        "overflow-hidden rounded-xl border bg-surface transition-colors",
        expanded
          ? "border-brand ring-1 ring-brand/30"
          : "border-line hover:border-line-strong",
      )}
    >
      <h3>
        <button
          type="button"
          aria-expanded={expanded}
          aria-controls={panelId}
          onClick={() => onToggle(expanded ? null : hospital.id)}
          className="flex w-full items-start gap-3 p-3 text-left hover:bg-surface-sunken"
        >
          <span className="min-w-0 flex-1">
            <span className="block text-sm leading-snug font-semibold text-ink">
              {hospital.name}
            </span>
            <span className="mt-0.5 block text-xs text-ink-subtle">
              {[hospital.city, hospital.state].filter(Boolean).join(", ") ||
                "Location not reported"}
            </span>

            {coverage ? (
              <span className="mt-2 flex items-center gap-2">
                <CoverageBar {...coverage} className="max-w-[9rem]" />
                <span className="tnum text-2xs font-semibold whitespace-nowrap text-ink-muted">
                  {coverage.yes}
                  <span className="font-normal text-ink-subtle">
                    {" "}
                    of {coverage.total} offered
                  </span>
                </span>
              </span>
            ) : (
              <span className="mt-2 block text-2xs text-ink-subtle">
                No filing on record
              </span>
            )}
          </span>

          <ChevronDown
            className={cn(
              "mt-0.5 size-4 shrink-0 text-ink-subtle transition-transform",
              expanded && "rotate-180",
            )}
            aria-hidden="true"
          />
        </button>
      </h3>

      <div
        id={panelId}
        hidden={!expanded}
        className="border-t border-line px-3 pt-3 pb-4"
      >
        {record === null ? (
          <p className="text-sm text-ink-muted">
            This facility has no filing on record for this category.
          </p>
        ) : (
          <>
            <dl className="mb-3 grid gap-1.5 text-xs text-ink-muted">
              {hospital.address ? (
                <div>
                  <dt className="sr-only">Address</dt>
                  <dd>
                    {hospital.address}
                    {hospital.zip ? `, ${hospital.zip}` : ""}
                  </dd>
                </div>
              ) : null}
              {hospital.phone ? (
                <div>
                  <dt className="sr-only">Phone</dt>
                  <dd>
                    <a
                      className="inline-flex items-center gap-1.5 font-medium text-brand hover:underline"
                      href={`tel:${hospital.phone.replace(/[^\d+]/g, "")}`}
                    >
                      <Phone className="size-3.5" aria-hidden="true" />
                      {hospital.phone}
                    </a>
                  </dd>
                </div>
              ) : null}
              {record.dateSigned ? (
                <div className="flex gap-1.5">
                  <dt className="text-ink-subtle">Policy signed</dt>
                  <dd className="tnum">{record.dateSigned}</dd>
                </div>
              ) : null}
            </dl>

            {!hospital.coordinates ? (
              <p className="mb-3 flex items-center gap-2 rounded-lg bg-surface-sunken p-2 text-2xs text-ink-muted">
                <MapPinOff className="size-3.5 shrink-0" aria-hidden="true" />
                No coordinates on file, so this facility does not appear on the
                map.
              </p>
            ) : null}

            {record.incorrectForm || hospital.dataQualityNotes?.length ? (
              <p className="mb-3 flex items-start gap-2 rounded-lg border border-service-partial/30 bg-service-partial/10 p-2 text-2xs text-service-partial">
                <AlertTriangle
                  className="mt-px size-3.5 shrink-0"
                  aria-hidden="true"
                />
                <span>
                  {record.incorrectForm
                    ? "The state flagged this filing as using an incorrect form. "
                    : null}
                  {hospital.dataQualityNotes?.join("; ")}
                </span>
              </p>
            ) : null}

            {/* Grouped, so a 26-item list reads as five short ones. */}
            {groupRuns(services).map((run) => (
              <section key={run.group} className="mt-3 first:mt-0">
                <h4 className="mb-1 text-2xs font-semibold tracking-wide text-ink-subtle uppercase">
                  {run.group}
                </h4>
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
              <div className="mt-3 rounded-lg bg-surface-sunken p-3">
                <p className="text-2xs font-semibold tracking-wide text-ink-subtle uppercase">
                  Comments from the filing
                </p>
                <p className="mt-1 text-xs whitespace-pre-line text-ink-muted">
                  {record.comments}
                </p>
              </div>
            ) : null}
          </>
        )}
      </div>
    </article>
  );
}
