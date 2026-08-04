import { SERVICE_STATE } from "@/components/service/state";
import type { ServiceDefinition, ServiceValue } from "@/data/schema";

/**
 * One service and its answer, in the expanded facility detail.
 *
 * Replaces the old renderProperty helper, which printed `label: value` and
 * coloured it green or red. Two problems that fixes: colour was the only
 * signal (fails WCAG 1.4.1 Use of Color), and anything that wasn't literally
 * "yes"/"no" — including every "See comments" — rendered as unstyled text
 * indistinguishable from a "no".
 *
 * The answer is right-aligned in its own column so a reader can run their eye
 * down the answers without re-reading each label, which the previous inline
 * "label — Offered" run-on made impossible.
 */
export function ServiceRow({
  service,
  value,
}: {
  service: ServiceDefinition;
  value: ServiceValue;
}) {
  const { label, Icon, text } = SERVICE_STATE[value];

  return (
    <div className="flex items-baseline justify-between gap-3 py-1.5">
      <div className="min-w-0">
        <span className="text-sm text-ink">{service.label}</span>
        {service.hint ? (
          <p className="text-2xs text-ink-subtle">{service.hint}</p>
        ) : null}
      </div>
      <span
        className={`flex shrink-0 items-center gap-1.5 text-xs font-semibold ${text}`}
      >
        <Icon className="size-3.5" strokeWidth={3} aria-hidden="true" />
        {label}
      </span>
    </div>
  );
}
