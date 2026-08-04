"use client";

import { AlertTriangle, ChevronDown, MapPinOff } from "lucide-react";
import { useEffect, useRef } from "react";

import { ServiceRow } from "@/components/hospital/ServiceRow";
import {
  SERVICES_BY_PROGRAM,
  type Hospital,
  type ProgramId,
} from "@/data/schema";
import { cn } from "@/lib/utils";

/**
 * A hospital summary that expands to the full service list.
 *
 * Expansion is driven by `expanded` (compared by id upstream, not by object
 * identity as before) and the toggle is a real <button>, so it is reachable
 * and operable from the keyboard — the previous card was a div with an
 * onClick handler and no role, tabindex, or key handling.
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
  const panelId = `hospital-panel-${hospital.id}`;

  return (
    <article
      ref={ref}
      className={cn(
        "mb-3 rounded-lg border bg-white shadow-sm transition-shadow",
        expanded ? "border-darkblue shadow-md" : "border-gray-200",
      )}
    >
      <h3>
        <button
          type="button"
          aria-expanded={expanded}
          aria-controls={panelId}
          onClick={() => onToggle(expanded ? null : hospital.id)}
          className="flex w-full items-start justify-between gap-3 rounded-lg p-4 text-left hover:bg-gray-50"
        >
          <span className="min-w-0">
            <span className="block font-semibold text-gray-900">
              {hospital.name}
            </span>
            <span className="mt-0.5 block text-sm text-gray-600">
              {[hospital.city, hospital.state].filter(Boolean).join(", ") ||
                "Location not reported"}
            </span>
          </span>
          <ChevronDown
            className={cn(
              "mt-1 size-5 shrink-0 text-gray-500 transition-transform",
              expanded && "rotate-180",
            )}
            aria-hidden="true"
          />
        </button>
      </h3>

      <div id={panelId} hidden={!expanded} className="px-4 pb-4">
        {record === null ? (
          <p className="text-sm text-gray-600">
            This facility has no filing on record for this category.
          </p>
        ) : (
          <>
            <dl className="mb-3 grid gap-1 text-sm text-gray-700">
              {hospital.address ? (
                <div className="flex gap-2">
                  <dt className="font-medium">Address</dt>
                  <dd>{hospital.address}</dd>
                </div>
              ) : null}
              {hospital.phone ? (
                <div className="flex gap-2">
                  <dt className="font-medium">Phone</dt>
                  <dd>
                    <a
                      className="text-darkblue underline underline-offset-2"
                      href={`tel:${hospital.phone.replace(/[^\d+]/g, "")}`}
                    >
                      {hospital.phone}
                    </a>
                  </dd>
                </div>
              ) : null}
              {record.dateSigned ? (
                <div className="flex gap-2">
                  <dt className="font-medium">Policy signed</dt>
                  <dd>{record.dateSigned}</dd>
                </div>
              ) : null}
            </dl>

            {!hospital.coordinates ? (
              <p className="mb-3 flex items-center gap-2 rounded bg-gray-50 p-2 text-xs text-gray-600">
                <MapPinOff className="size-4 shrink-0" aria-hidden="true" />
                No coordinates on file, so this facility does not appear on the
                map.
              </p>
            ) : null}

            {record.incorrectForm || hospital.dataQualityNotes?.length ? (
              <p className="mb-3 flex items-start gap-2 rounded bg-amber-50 p-2 text-xs text-service-partial">
                <AlertTriangle
                  className="mt-0.5 size-4 shrink-0"
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

            <div className="divide-y divide-gray-100">
              {services.map((service) => (
                <ServiceRow
                  key={service.key}
                  service={service}
                  value={record.services[service.key] ?? "unknown"}
                />
              ))}
            </div>

            {record.comments ? (
              <div className="mt-3 rounded bg-gray-50 p-3">
                <p className="text-xs font-medium text-gray-700">
                  Comments from the filing
                </p>
                <p className="mt-1 text-sm whitespace-pre-line text-gray-700">
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
