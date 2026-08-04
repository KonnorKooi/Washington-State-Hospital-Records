import { Check, CircleHelp, Info, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import type { ServiceDefinition, ServiceValue } from "@/data/schema";

const PRESENTATION: Record<
  ServiceValue,
  { label: string; Icon: LucideIcon; className: string }
> = {
  yes: { label: "Offered", Icon: Check, className: "text-service-yes" },
  no: { label: "Not offered", Icon: X, className: "text-service-no" },
  "see-comments": {
    label: "See comments",
    Icon: Info,
    className: "text-service-partial",
  },
  unknown: {
    label: "Not reported",
    Icon: CircleHelp,
    className: "text-service-unknown",
  },
};

/**
 * Replaces the old renderProperty helper, which printed `label: value` and
 * coloured it green or red. Two problems that fixes: colour was the only
 * signal (fails WCAG 1.4.1 Use of Color), and anything that wasn't literally
 * "yes"/"no" — including every "See comments" — rendered as unstyled text
 * indistinguishable from a "no".
 */
export function ServiceRow({
  service,
  value,
}: {
  service: ServiceDefinition;
  value: ServiceValue;
}) {
  const { label, Icon, className } = PRESENTATION[value];

  return (
    <div className="flex items-start gap-2 py-1">
      <Icon
        className={`mt-0.5 size-4 shrink-0 ${className}`}
        aria-hidden="true"
      />
      <div className="min-w-0 text-sm">
        <span className="text-gray-900">{service.label}</span>{" "}
        <span className={`font-medium ${className}`}>— {label}</span>
        {service.hint ? (
          <p className="text-xs text-gray-500">{service.hint}</p>
        ) : null}
      </div>
    </div>
  );
}
