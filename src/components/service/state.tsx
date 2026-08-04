import { Check, CircleHelp, Info, Minus, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import type { ServiceValue } from "@/data/schema";

/**
 * One source of truth for how each of the four service states looks and
 * reads, shared by the detail rows, the matrix cells and the legend.
 *
 * Every state has both a colour and a distinct glyph. The old renderProperty
 * helper used colour alone (WCAG 1.4.1) and had no representation at all for
 * "see comments" or a blank cell, so both rendered as unstyled text that was
 * indistinguishable from a "no".
 */
export const SERVICE_STATE: Record<
  ServiceValue,
  {
    /** Sentence-style label used in the detail view. */
    label: string;
    /** Terse label used in legends and cell tooltips. */
    short: string;
    Icon: LucideIcon;
    /** Text colour for icon-and-label presentations. */
    text: string;
    /** Chip colours for the dense matrix cells. */
    chip: string;
  }
> = {
  yes: {
    label: "Offered",
    short: "Offered",
    Icon: Check,
    text: "text-service-yes",
    chip: "bg-cell-yes text-cell-yes-ink",
  },
  no: {
    label: "Not offered",
    short: "Not offered",
    Icon: X,
    text: "text-service-no",
    chip: "bg-cell-no text-cell-no-ink",
  },
  "see-comments": {
    label: "See comments",
    short: "See comments",
    Icon: Info,
    text: "text-service-partial",
    chip: "bg-cell-partial text-cell-partial-ink",
  },
  unknown: {
    label: "Not reported",
    short: "Not reported",
    Icon: CircleHelp,
    text: "text-service-unknown",
    chip: "bg-transparent text-cell-unknown-ink ring-1 ring-line ring-inset",
  },
};

/** Compact glyph set for the matrix, where a 20px chip has no room for an icon label. */
export const CELL_GLYPH: Record<ServiceValue, LucideIcon> = {
  yes: Check,
  no: X,
  "see-comments": Info,
  unknown: Minus,
};

/**
 * A stacked proportional bar: offered / see-comments / not offered / blank.
 * Reads as a single glanceable measure of how completely a facility answered
 * and how much it offers, without hiding the difference between the two.
 */
export function CoverageBar({
  yes,
  partial,
  no,
  total,
  className = "",
}: {
  yes: number;
  partial: number;
  no: number;
  total: number;
  className?: string;
}) {
  const pct = (n: number) => (total === 0 ? 0 : (n / total) * 100);
  return (
    <span
      className={`flex h-1.5 w-full overflow-hidden rounded-full bg-line ${className}`}
      aria-hidden="true"
    >
      <span className="bg-cell-yes" style={{ width: `${pct(yes)}%` }} />
      <span className="bg-cell-partial" style={{ width: `${pct(partial)}%` }} />
      <span className="bg-cell-no" style={{ width: `${pct(no)}%` }} />
    </span>
  );
}

/** The four-state key, shown once per view rather than repeated per row. */
export function ServiceLegend({ className = "" }: { className?: string }) {
  return (
    <ul className={`flex flex-wrap items-center gap-x-4 gap-y-1 ${className}`}>
      {(
        [
          "yes",
          "see-comments",
          "no",
          "unknown",
        ] as const satisfies ServiceValue[]
      ).map((value) => {
        const { short, chip, Icon } = SERVICE_STATE[value];
        return (
          <li
            key={value}
            className="flex items-center gap-1.5 text-2xs text-ink-muted"
          >
            <span
              className={`grid size-4 place-items-center rounded-[3px] ${chip}`}
            >
              <Icon className="size-3" strokeWidth={3} aria-hidden="true" />
            </span>
            {short}
          </li>
        );
      })}
    </ul>
  );
}
