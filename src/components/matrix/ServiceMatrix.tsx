"use client";

import { useCallback, useRef } from "react";

import { CELL_GLYPH, SERVICE_STATE } from "@/components/service/state";
import {
  groupRuns,
  shortLabel,
  SERVICES_BY_PROGRAM,
  type Hospital,
  type ProgramId,
} from "@/data/schema";
import { coverageFor } from "@/lib/coverage";
import { cn } from "@/lib/utils";

/**
 * Every facility against every service, in one grid.
 *
 * This is the view the dataset actually wants. The card list answers "what
 * does this one hospital offer", one hospital at a time; the underlying data
 * is a 19 x 26 matrix, and questions like "who near me does labor and
 * delivery" or "how unusual is it to refuse abortion referrals" are only
 * answerable by seeing the whole thing at once.
 *
 * Layout notes:
 *  - `border-separate` rather than `border-collapse`: collapsed borders are
 *    dropped on `position: sticky` cells in every engine, which would leave
 *    the pinned header and name column without their outlines.
 *  - The facility column and both header rows are sticky, so a cell in the
 *    bottom-right still has a readable row and column label.
 */

const GROUP_ROW_HEIGHT = 26;
const NAME_COL_WIDTH = 340;
const CELL_COL_WIDTH = 34;

export function ServiceMatrix({
  hospitals,
  program,
  selectedId,
  onSelect,
}: {
  hospitals: readonly Hospital[];
  program: ProgramId;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}) {
  const services = SERVICES_BY_PROGRAM[program];
  const runs = groupRuns(services);
  const colsRef = useRef<HTMLTableColElement[]>([]);

  /*
   * Crosshair highlight. Tracking the hovered column in React state would
   * re-render all ~500 cells on every pointer move; instead the <col>
   * element's own background is set imperatively, which the browser paints
   * behind the whole column for free. Cell chips sit on transparent
   * backgrounds so the band shows through.
   */
  const highlightColumn = useCallback((index: number | null) => {
    colsRef.current.forEach((col, i) => {
      if (col)
        col.style.backgroundColor = i === index ? "var(--tw-col-hl)" : "";
    });
  }, []);

  const handleCellHover = useCallback(
    (event: React.MouseEvent<HTMLTableSectionElement>) => {
      const cell = (event.target as HTMLElement).closest("[data-col]");
      const raw = cell?.getAttribute("data-col");
      highlightColumn(raw === null || raw === undefined ? null : Number(raw));
    },
    [highlightColumn],
  );

  if (hospitals.length === 0) {
    return (
      <p className="rounded-xl border border-line bg-surface p-6 text-sm text-ink-muted">
        No facilities match these filters. Try clearing a service filter or
        broadening your search.
      </p>
    );
  }

  return (
    <div
      className="overflow-auto rounded-xl border border-line bg-surface"
      style={
        {
          maxHeight: "min(78vh, 900px)",
          // Consumed by highlightColumn above; kept in CSS so it can be a
          // theme-aware colour rather than a hardcoded rgba.
          "--tw-col-hl":
            "color-mix(in srgb, var(--color-brand) 9%, transparent)",
        } as React.CSSProperties
      }
    >
      <table className="w-full table-fixed border-separate border-spacing-0 text-left">
        <caption className="sr-only">
          Services reported by each facility. Columns are services; rows are
          facilities.
        </caption>

        {/*
         * Explicit widths, plus a trailing auto-width spacer column. Without
         * the spacer a `w-full` table hands all its slack to the first
         * column, which stretched the facility name cell to three times the
         * width it needs and pushed the grid off the right of the screen.
         */}
        <colgroup>
          <col style={{ width: NAME_COL_WIDTH }} />
          {services.map((service, index) => (
            <col
              key={service.key}
              style={{ width: CELL_COL_WIDTH }}
              ref={(node) => {
                if (node) colsRef.current[index] = node;
              }}
            />
          ))}
          <col />
        </colgroup>

        <thead>
          {/* Group band: turns 26 undifferentiated columns into five sections. */}
          <tr>
            <th
              scope="col"
              className="sticky top-0 left-0 z-40 border-b border-line bg-surface-sunken px-3 text-2xs font-semibold tracking-wide text-ink-subtle uppercase"
              style={{ height: GROUP_ROW_HEIGHT }}
            >
              <span className="sr-only">Facility</span>
            </th>
            {runs.map((run) => (
              <th
                key={run.group}
                scope="colgroup"
                colSpan={run.services.length}
                title={run.group}
                className="sticky top-0 z-30 border-b border-l border-line bg-surface-sunken px-2 text-2xs font-semibold tracking-wide text-ink-subtle uppercase"
                style={{ height: GROUP_ROW_HEIGHT }}
              >
                <span className="block truncate">{run.group}</span>
              </th>
            ))}
            <th
              aria-hidden="true"
              className="sticky top-0 z-30 border-b border-l border-line bg-surface-sunken"
              style={{ height: GROUP_ROW_HEIGHT }}
            />
          </tr>

          {/* Service band: vertical labels, the only way 26 fit on screen. */}
          <tr>
            <th
              scope="col"
              className="sticky left-0 z-40 border-b border-line bg-surface-sunken px-3 pb-2 align-bottom text-xs font-semibold text-ink"
              style={{ top: GROUP_ROW_HEIGHT }}
            >
              Facility
            </th>
            {services.map((service, index) => (
              <th
                key={service.key}
                scope="col"
                className="sticky z-30 h-44 border-b border-line bg-surface-sunken p-0 align-bottom font-medium"
                style={{ top: GROUP_ROW_HEIGHT }}
                onMouseEnter={() => highlightColumn(index)}
                onMouseLeave={() => highlightColumn(null)}
              >
                <span
                  className="matrix-vlabel mx-auto block h-[160px] pb-2 text-2xs text-ink-muted"
                  title={
                    service.hint
                      ? `${service.label} — ${service.hint}`
                      : service.label
                  }
                >
                  {shortLabel(service)}
                </span>
              </th>
            ))}
            <th
              aria-hidden="true"
              className="sticky z-30 border-b border-line bg-surface-sunken"
              style={{ top: GROUP_ROW_HEIGHT }}
            />
          </tr>
        </thead>

        <tbody
          onMouseOver={handleCellHover}
          onMouseLeave={() => highlightColumn(null)}
        >
          {hospitals.map((hospital) => {
            const record = hospital[program];
            const coverage = coverageFor(hospital, program);
            const selected = hospital.id === selectedId;

            return (
              <tr key={hospital.id} className="group/row">
                <th
                  scope="row"
                  className={cn(
                    "sticky left-0 z-20 border-b border-line p-0 text-left align-middle font-normal",
                    selected ? "bg-brand-subtle" : "bg-surface",
                    "group-hover/row:bg-surface-sunken",
                  )}
                >
                  <button
                    type="button"
                    onClick={() => onSelect(selected ? null : hospital.id)}
                    aria-pressed={selected}
                    className="flex w-full items-center gap-2 px-3 py-1.5 text-left"
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-xs font-medium text-ink">
                        {hospital.name}
                      </span>
                      <span className="block truncate text-2xs text-ink-subtle">
                        {hospital.city ?? "Location not reported"}
                      </span>
                    </span>
                    {coverage ? (
                      <span className="tnum shrink-0 rounded bg-surface-sunken px-1.5 py-0.5 text-2xs font-semibold text-ink-muted group-hover/row:bg-surface">
                        {coverage.yes}
                        <span className="text-ink-subtle">
                          /{coverage.total}
                        </span>
                      </span>
                    ) : null}
                  </button>
                </th>

                {services.map((service, index) => {
                  const value = record?.services[service.key] ?? "unknown";
                  const { chip, short } = SERVICE_STATE[value];
                  const Glyph = CELL_GLYPH[value];
                  return (
                    <td
                      key={service.key}
                      data-col={index}
                      className={cn(
                        "border-b border-l border-line p-0 text-center",
                        "group-hover/row:bg-brand-subtle/40",
                      )}
                    >
                      <span
                        className={cn(
                          "m-[3px] grid size-[26px] place-items-center rounded-[4px]",
                          chip,
                        )}
                        title={`${hospital.name} — ${service.label}: ${short}`}
                      >
                        <Glyph
                          className="size-3.5"
                          strokeWidth={3}
                          aria-hidden="true"
                        />
                        <span className="sr-only">{short}</span>
                      </span>
                    </td>
                  );
                })}
                <td aria-hidden="true" className="border-b border-line" />
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
