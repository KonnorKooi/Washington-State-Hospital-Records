"use client";

import Image from "next/image";

import type { ProgramId } from "@/data/schema";
import { cn } from "@/lib/utils";

const TABS: { id: ProgramId; label: string }[] = [
  { id: "reproductive", label: "Reproductive" },
  { id: "endOfLife", label: "End of life" },
];

/**
 * The program switcher is a real ARIA tablist. The previous Navbar kept its
 * own copy of the active tab in local state alongside the page's copy, so the
 * two could disagree; it now renders purely from the prop.
 */
export function SiteHeader({
  program,
  onProgramChange,
}: {
  program: ProgramId;
  onProgramChange: (program: ProgramId) => void;
}) {
  return (
    <header className="bg-darkblue shadow-md">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-3 sm:flex-row sm:items-center sm:justify-between lg:px-8">
        <div className="flex items-center gap-3">
          <Image
            src="/images/logo_nobg.png"
            alt=""
            width={40}
            height={40}
            className="size-8 sm:size-10"
            priority
          />
          <div>
            <p className="text-lg font-bold text-white sm:text-2xl">
              Washington Care Access
            </p>
            <p className="text-xs text-lightblue sm:text-sm">
              Transparency Initiative
            </p>
          </div>
        </div>

        <div
          role="tablist"
          aria-label="Care category"
          className="flex gap-1 sm:gap-2"
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
                onClick={() => onProgramChange(tab.id)}
                className={cn(
                  "border-b-4 px-3 py-1.5 text-sm font-medium transition-colors sm:px-4 sm:text-base",
                  selected
                    ? "border-white text-white"
                    : "border-transparent text-white/75 hover:border-white/50 hover:text-white",
                )}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
