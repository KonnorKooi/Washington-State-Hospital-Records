"use client";

import { SlidersHorizontal, X } from "lucide-react";
import { useId } from "react";

import { Checkbox } from "@/components/ui/checkbox";
import { groupRuns, type ServiceDefinition } from "@/data/schema";

/**
 * The filter list is generated from the service definitions in
 * src/data/schema.ts, which the build validates against the CSV headers. That
 * is the structural fix for the two filters that used to be permanently dead:
 * a label that doesn't correspond to a real column can no longer exist.
 *
 * Open/closed state lives with the caller now rather than inside this
 * component, because the panel is shared by both views and the toolbar button
 * that opens it sits outside this subtree.
 */
export function ServiceFilters({
  services,
  selected,
  onChange,
  onClear,
  onClose,
}: {
  services: readonly ServiceDefinition[];
  selected: readonly string[];
  onChange: (key: string, checked: boolean) => void;
  onClear: () => void;
  onClose: () => void;
}) {
  const headingId = useId();

  return (
    <section
      aria-labelledby={headingId}
      className="rounded-xl border border-line bg-surface p-4"
    >
      <div className="mb-3 flex items-start justify-between gap-4">
        <div>
          <h2
            id={headingId}
            className="flex items-center gap-2 text-sm font-semibold text-ink"
          >
            <SlidersHorizontal className="size-4 text-ink-subtle" aria-hidden />
            Filter by service
          </h2>
          <p className="mt-0.5 max-w-2xl text-xs text-ink-muted">
            Shows only facilities that offer <em>all</em> of the selected
            services. Filings that say &ldquo;see comments&rdquo; count as
            offered, and stay labelled as such.
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {selected.length > 0 ? (
            <button
              type="button"
              onClick={onClear}
              className="rounded-md px-2 py-1 text-xs font-medium text-brand hover:bg-brand-subtle"
            >
              Clear {selected.length}
            </button>
          ) : null}
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-ink-subtle hover:bg-surface-sunken hover:text-ink"
          >
            <X className="size-4" aria-hidden="true" />
            <span className="sr-only">Close filters</span>
          </button>
        </div>
      </div>

      {/* Banded by group so 26 checkboxes are five short lists, not one wall. */}
      <div className="columns-1 gap-x-8 sm:columns-2 xl:columns-3">
        {groupRuns(services).map((run) => (
          <fieldset key={run.group} className="mb-5 break-inside-avoid">
            <legend className="mb-1.5 text-2xs font-semibold tracking-wide text-ink-subtle uppercase">
              {run.group}
            </legend>
            <ul className="space-y-1.5">
              {run.services.map((service) => {
                const checked = selected.includes(service.key);
                return (
                  <li key={service.key}>
                    <label className="flex cursor-pointer items-start gap-2 rounded-md py-0.5 hover:text-ink">
                      <Checkbox
                        checked={checked}
                        onCheckedChange={(value) =>
                          onChange(service.key, value === true)
                        }
                        className="mt-px"
                      />
                      <span
                        className={
                          checked
                            ? "text-xs font-medium text-ink"
                            : "text-xs text-ink-muted"
                        }
                      >
                        {service.label}
                      </span>
                    </label>
                  </li>
                );
              })}
            </ul>
          </fieldset>
        ))}
      </div>
    </section>
  );
}
