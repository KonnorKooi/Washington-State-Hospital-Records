import { z } from "zod";

/**
 * The contract between the CSV files and the app.
 *
 * Every service the UI can filter on is declared here exactly once. The build
 * script (scripts/build-data.ts) asserts that this list and the CSV headers
 * agree, and fails the build if they drift apart.
 *
 * This exists because the previous version hardcoded filter labels in the page
 * component and compared them against raw CSV headers at runtime. Two of them
 * were misspelled relative to the data ("miscarriages" vs the CSV's
 * "miscarraiges", "materials" vs "materiasl"), so those filters silently
 * matched nothing, forever, with no error anywhere. A mismatch is now a build
 * failure instead of a dead checkbox.
 */

export interface ServiceDefinition {
  /** Stable identifier used in URLs and as the key in generated JSON. */
  readonly key: string;
  /** Exact CSV column header this service reads from. */
  readonly column: string;
  /** Human-readable label shown in the filter list and hospital detail. */
  readonly label: string;
  /** Optional expansion for abbreviations that are opaque on their own. */
  readonly hint?: string;
}

export const REPRODUCTIVE_SERVICES = [
  {
    key: "medication-abortion",
    column: "Medication abortion",
    label: "Medication abortion",
  },
  {
    key: "abortion-referrals",
    column: "Referrals for abortions",
    label: "Referrals for abortions",
  },
  {
    key: "surgical-abortion",
    column: "Surgical abortion",
    label: "Surgical abortion",
  },
  { key: "birth-control", column: "Birth control", label: "Birth control" },
  {
    key: "contraceptive-counseling",
    column: "Contraceptive counseling",
    label: "Contraceptive counseling",
  },
  {
    key: "pharmacy-contraception",
    column: "Hospital pharmacy dispenses contraception",
    label: "Pharmacy dispenses contraception",
  },
  {
    key: "contraceptive-device-removal",
    column: "Removal of contraceptive devices",
    label: "Removal of contraceptive devices",
  },
  {
    key: "tubal-ligation",
    column: "Tubal ligations",
    label: "Tubal ligations",
  },
  { key: "vasectomy", column: "Vasectomies", label: "Vasectomies" },
  {
    key: "emergency-contraception-sa",
    column: "Emergency Contraception w/SA",
    label: "Emergency contraception after sexual assault",
    hint: "Provided to patients reporting sexual assault.",
  },
  {
    key: "emergency-contraception-no-sa",
    column: "Emergency Contraception w/out SA",
    label: "Emergency contraception without sexual assault",
    hint: "Provided on request, unrelated to sexual assault.",
  },
  {
    key: "infertility-counseling",
    column: "Infertility Counseling",
    label: "Infertility counseling",
  },
  {
    key: "infertility-testing",
    column: "Infertility testing and diagnoses",
    label: "Infertility testing and diagnosis",
  },
  {
    key: "ivf",
    column: "Infertility treatment including IVF",
    label: "Infertility treatment, including IVF",
  },
  { key: "hiv-testing", column: "HIV testing", label: "HIV testing" },
  { key: "hiv-treatment", column: "HIV treatment", label: "HIV treatment" },
  {
    key: "prep-pep",
    column: "PrEP and PEP w/counseling",
    label: "PrEP and PEP with counseling",
    hint: "Pre- and post-exposure prophylaxis for HIV.",
  },
  {
    key: "std-testing",
    column: "STD testing/treatment",
    label: "STI testing and treatment",
  },
  {
    key: "miscarriage-ectopic-care",
    column: "Treating miscarriages and ectopic pregnancies",
    label: "Treating miscarriages and ectopic pregnancies",
  },
  {
    key: "pregnancy-counseling",
    column: "Pregnancy counseling",
    label: "Pregnancy counseling",
  },
  {
    key: "pregnancy-genetic-counseling",
    column: "Pregnancy genetic counseling",
    label: "Pregnancy genetic counseling",
  },
  {
    key: "labor-and-delivery",
    column: "Pregnancy Labor and Delivery",
    label: "Labor and delivery",
  },
  {
    key: "nicu",
    column: "Pregnancy NICU",
    label: "NICU",
    hint: "Neonatal intensive care unit.",
  },
  {
    key: "prenatal-care",
    column: "Pregnancy prenatal care",
    label: "Prenatal care",
  },
  {
    key: "postnatal-care",
    column: "Pregnancy Postnatal Care",
    label: "Postnatal care",
  },
  {
    key: "pregnancy-ultrasound",
    column: "Pregnancy Ultrasound",
    label: "Pregnancy ultrasound",
  },
] as const satisfies readonly ServiceDefinition[];

export const END_OF_LIFE_SERVICES = [
  {
    key: "acp-written-policies",
    column: "Written Policies & Procedures on ACP and AD",
    label: "Written policies on advance care planning and directives",
    hint: "ACP = advance care planning; AD = advance directive.",
  },
  {
    key: "acp-info-and-support",
    column: "Offers info and support for ACP",
    label: "Offers information and support for advance care planning",
  },
  {
    key: "acp-asks-patient",
    column: "Asks patient about ACP",
    label: "Asks patients about advance care planning",
  },
  {
    key: "acp-assists-patient",
    column: "Assists patients with ACP",
    label: "Assists patients with advance care planning",
  },
  {
    key: "eol-education",
    column: "Provides EOL education",
    label: "Provides end-of-life education",
  },
  {
    key: "treatment-option-evaluation",
    column: "Provides treatment option evaluation",
    label: "Provides treatment option evaluation",
  },
  {
    key: "hospice-care",
    column: "Provides hospice care",
    label: "Provides hospice care",
  },
  {
    key: "palliative-care",
    column: "Provides palliative care",
    label: "Provides palliative care",
  },
  {
    key: "spiritual-care",
    column: "Provides spiritual care",
    label: "Provides spiritual care",
  },
  {
    key: "ethics-consultation",
    column: "Provides ethics consultation services",
    label: "Provides ethics consultation services",
  },
  {
    key: "palliative-referrals",
    column: "Provide referrals/resources for palliative care",
    label: "Provides referrals and resources for palliative care",
  },
  {
    key: "pain-symptom-consultation",
    column: "Provides pain and symptom consultation",
    label: "Provides pain and symptom consultation",
  },
  {
    key: "honors-polst",
    column: "Reviews and Honors POLST",
    label: "Reviews and honors POLST",
    hint: "Portable Orders for Life-Sustaining Treatment.",
  },
  {
    key: "dwd-providers-participate",
    column: "DWD: allows providers to participate",
    label: "Allows providers to participate in Death with Dignity",
  },
  {
    key: "dwd-educational-materials",
    column: "Provides DWD educational materials",
    label: "Provides Death with Dignity educational materials",
  },
  {
    key: "dwd-pharmacy-dispenses",
    column: "Pharmacies dispense DWD medication",
    label: "Pharmacies dispense Death with Dignity medication",
  },
  {
    key: "dwd-self-admin-on-site",
    column: "Patients can self-admin DWD medication at hospital",
    label: "Patients may self-administer Death with Dignity medication on site",
  },
] as const satisfies readonly ServiceDefinition[];

export const PROGRAMS = ["reproductive", "endOfLife"] as const;
export type ProgramId = (typeof PROGRAMS)[number];

export const SERVICES_BY_PROGRAM: Record<
  ProgramId,
  readonly ServiceDefinition[]
> = {
  reproductive: REPRODUCTIVE_SERVICES,
  endOfLife: END_OF_LIFE_SERVICES,
};

/** Columns that describe the facility rather than a service it offers. */
export const IDENTITY_COLUMNS = [
  "Hospital",
  "Address",
  "City",
  "State",
  "Zip Code",
  "Phone number",
  "Contact",
  "Date signed",
  "Behavioral/Substance?",
  "Lat",
  "Long",
] as const;

/** Extra non-service columns, per file. */
export const EXTRA_COLUMNS: Record<ProgramId, readonly string[]> = {
  reproductive: ["Additional Comments"],
  endOfLife: ["Recent enough for use?", "Incorrect form?", "Comments?"],
};

/**
 * How a service cell is interpreted.
 *
 * "see-comments" is its own state rather than being folded into "no". The
 * previous filter tested `value.toLowerCase() === "yes"`, which quietly
 * excluded every "See comments" hospital — 33 cells across the two files.
 */
export const SERVICE_VALUES = ["yes", "no", "see-comments", "unknown"] as const;
export type ServiceValue = (typeof SERVICE_VALUES)[number];

const CELL_TO_SERVICE_VALUE = new Map<string, ServiceValue>([
  ["yes", "yes"],
  ["y", "yes"],
  ["true", "yes"],
  ["no", "no"],
  ["n", "no"],
  ["false", "no"],
  ["see comments", "see-comments"],
  ["see comment", "see-comments"],
  ["", "unknown"],
  ["n/a", "unknown"],
  ["unknown", "unknown"],
]);

/**
 * Normalize one raw CSV cell. Returns null for values we don't recognize so
 * the caller can fail the build with a precise message rather than guessing.
 */
export function normalizeServiceValue(
  raw: string | undefined,
): ServiceValue | null {
  const cleaned = (raw ?? "").trim().toLowerCase().replace(/\s+/g, " ");
  return CELL_TO_SERVICE_VALUE.get(cleaned) ?? null;
}

/** "Yes"/"No"/blank in a boolean metadata column (not a service). */
export function normalizeFlag(raw: string | undefined): boolean {
  const cleaned = (raw ?? "").trim().toLowerCase();
  return cleaned === "true" || cleaned === "yes";
}

export const coordinatesSchema = z.object({
  lat: z.number().min(45).max(49.1),
  lng: z.number().min(-125).max(-116.5),
});
export type Coordinates = z.infer<typeof coordinatesSchema>;

export const programRecordSchema = z.object({
  services: z.record(z.string(), z.enum(SERVICE_VALUES)),
  comments: z.string().optional(),
  dateSigned: z.string().optional(),
  contact: z.string().optional(),
  /** endOfLife only: the filing is current enough to rely on. */
  recentEnoughForUse: z.boolean().optional(),
  /** endOfLife only: the facility submitted the wrong form. */
  incorrectForm: z.boolean().optional(),
});
export type ProgramRecord = z.infer<typeof programRecordSchema>;

export const hospitalSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip: z.string().optional(),
  phone: z.string().optional(),
  /**
   * null when the source data has no usable Lat/Long. Such hospitals are kept
   * and surfaced as "location unavailable" rather than dropped — the old map
   * silently discarded 9 of 35 rows.
   */
  coordinates: coordinatesSchema.nullable(),
  isBehavioralOrSubstance: z.boolean(),
  /**
   * Notes the state's data entry appended to the facility name itself, e.g.
   * "old/odd form", "incorrect form". Surfaced in the UI so a caveat attached
   * to a filing isn't lost.
   */
  dataQualityNotes: z.array(z.string()).optional(),
  reproductive: programRecordSchema.nullable(),
  endOfLife: programRecordSchema.nullable(),
});
export type Hospital = z.infer<typeof hospitalSchema>;

export const hospitalsFileSchema = z.object({
  generatedAt: z.string(),
  sources: z.array(
    z.object({ program: z.enum(PROGRAMS), file: z.string(), rows: z.number() }),
  ),
  hospitals: z.array(hospitalSchema),
});
export type HospitalsFile = z.infer<typeof hospitalsFileSchema>;

/**
 * Trailing "** note" markers that data entry stuffed into the Hospital name
 * field, e.g. "Dayton General Hospital (...) ** old/odd form". Split out so
 * the note is preserved but the name still matches across files.
 */
export function splitNameAnnotation(raw: string): {
  name: string;
  note?: string;
} {
  const match = raw.match(/^(.*?)\s*\*\*\s*(.+?)\s*$/);
  if (!match?.[1] || !match[2]) return { name: raw.trim() };
  return { name: match[1].trim(), note: match[2].trim() };
}

/**
 * The same facility is spelled differently across the two source files.
 * Mapping is explicit rather than fuzzy so a merge is always reviewable —
 * automatic similarity matching risks silently combining two genuinely
 * different hospitals. Keys are variants, values are the canonical name.
 *
 * The build script flags any *unlisted* near-duplicate pair so new variants
 * surface as a warning instead of quietly becoming a duplicate map pin.
 */
export const CANONICAL_NAME_ALIASES: Readonly<Record<string, string>> = {
  // "Lew County" is a typo for "Lewis County" in reproductive.csv.
  "Arbor Health, Morton Hospital / Lew County Hospital District No.1":
    "Arbor Health, Morton Hospital / Lewis County Hospital District No.1",
  // endoflife.csv omits "and Clinics".
  "Astria Sunnyside Hospital": "Astria Sunnyside Hospital and Clinics",
  // reproductive.csv omits the hospital district qualifier.
  "EvergreenHealth Medical Center":
    "EvergreenHealth Medical Center (King County Public Hospital District #2)",
};

/**
 * Names that *look* like variants of each other but are genuinely separate
 * facilities. Listing them keeps the near-duplicate warning actionable
 * instead of crying wolf on every build.
 */
export const KNOWN_DISTINCT_FACILITIES: readonly string[] = [
  // Three separate Fairfax Behavioral Health campuses: Kirkland, Monroe, Everett.
  "BHC Fairfax Hospital",
  "BHC Fairfax Hospital Monroe",
  "BHC Fairfax Hospital North",
];

export function canonicalizeName(name: string): string {
  return CANONICAL_NAME_ALIASES[name] ?? name;
}

/** Slugify a hospital name into a stable, URL-safe id. */
export function toHospitalId(name: string): string {
  return name
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
