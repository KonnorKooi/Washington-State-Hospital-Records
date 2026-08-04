"use client";

import { Logo } from "@/components/site/Logo";
import type { ProgramId } from "@/data/schema";
import { cn } from "@/lib/utils";

const TABS: { id: ProgramId; label: string; blurb: string }[] = [
  {
    id: "reproductive",
    label: "Reproductive",
    blurb: "Abortion, contraception, fertility and pregnancy care",
  },
  {
    id: "endOfLife",
    label: "End of life",
    blurb:
      "Advance care planning, hospice, palliative care and Death with Dignity",
  },
];

/**
 * The program switcher is a real ARIA tablist. The previous Navbar kept its
 * own copy of the active tab in local state alongside the page's copy, so the
 * two could disagree; it now renders purely from the prop.
 *
 * The header is sticky and short: on a page whose job is scanning a long grid,
 * the category you are looking at needs to stay visible, but it should cost as
 * little vertical space as possible.
 */
export function SiteHeader({
  program,
  onProgramChange,
}: {
  program: ProgramId;
  onProgramChange: (program: ProgramId) => void;
}) {
  const active = TABS.find((tab) => tab.id === program) ?? TABS[0]!;

  return (
    <header className="sticky top-0 z-50 border-b border-black/10 bg-header">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-2 px-4 py-2.5 sm:flex-row sm:items-center sm:justify-between sm:gap-6 lg:px-8">
        <div className="flex items-center gap-2.5">
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

        {/* Segmented control rather than underlined tabs: with only two
            options, a bounded switch reads as a choice between two datasets,
            which is what it is. */}
        <div
          role="tablist"
          aria-label="Care category"
          className="flex shrink-0 gap-0.5 rounded-lg bg-black/25 p-0.5"
        >
          {TABS.map((tab) => {
            const selected = tab.id === program;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                id={`tab-${tab.id}`}
                aria-selected={selected}
                aria-controls="program-panel"
                title={tab.blurb}
                onClick={() => onProgramChange(tab.id)}
                className={cn(
                  "rounded-md px-3 py-1.5 text-sm font-medium transition-colors sm:px-4",
                  selected
                    ? "bg-header-ink text-header shadow-sm"
                    : "text-header-ink-muted hover:bg-white/10 hover:text-header-ink",
                )}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        Showing {active.label} services: {active.blurb}.
      </p>
    </header>
  );
}
