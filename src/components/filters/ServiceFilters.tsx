"use client";

import { ChevronDown } from "lucide-react";
import { useId, useState } from "react";

import { Checkbox } from "@/components/ui/checkbox";
import type { ServiceDefinition } from "@/data/schema";
import { cn } from "@/lib/utils";

/**
 * The filter list is generated from the service definitions in
 * src/data/schema.ts, which the build validates against the CSV headers. That
 * is the structural fix for the two filters that used to be permanently dead:
 * a label that doesn't correspond to a real column can no longer exist.
 */
export function ServiceFilters({
  services,
  selected,
  onChange,
  onClear,
}: {
  services: readonly ServiceDefinition[];
  selected: readonly string[];
  onChange: (key: string, checked: boolean) => void;
  onClear: () => void;
}) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  return (
    <section className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center justify-between gap-2 p-4">
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((value) => !value)}
          className="flex flex-1 items-center justify-between gap-2 text-left"
        >
          <span className="text-lg font-semibold">
            Filter by service
            {selected.length > 0 ? (
              <span className="ml-2 rounded-full bg-darkblue px-2 py-0.5 text-xs font-medium text-white">
                {selected.length}
              </span>
            ) : null}
          </span>
          <ChevronDown
            className={cn("size-5 transition-transform", open && "rotate-180")}
            aria-hidden="true"
          />
        </button>
        {selected.length > 0 ? (
          <button
            type="button"
            onClick={onClear}
            className="rounded text-sm text-darkblue underline underline-offset-2"
          >
            Clear
          </button>
        ) : null}
      </div>

      <div id={panelId} hidden={!open} className="border-t border-gray-100 p-4">
        <fieldset>
          <legend className="mb-3 text-sm text-gray-600">
            Show only facilities that offer all of the selected services.
            Facilities whose filing says &ldquo;see comments&rdquo; are
            included, and labelled as such.
          </legend>
          <ul className="grid gap-3 sm:grid-cols-2">
            {services.map((service) => {
              const checked = selected.includes(service.key);
              return (
                <li key={service.key}>
                  <label className="flex cursor-pointer items-start gap-2">
                    <Checkbox
                      checked={checked}
                      onCheckedChange={(value) =>
                        onChange(service.key, value === true)
                      }
                      className="mt-0.5"
                    />
                    <span className="text-sm text-gray-800">
                      {service.label}
                    </span>
                  </label>
                </li>
              );
            })}
          </ul>
        </fieldset>
      </div>
    </section>
  );
}
