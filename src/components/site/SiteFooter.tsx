const SOURCE_URL =
  "https://doh.wa.gov/data-statistical-reports/healthcare-washington/hospital-and-patient-data/hospital-policies";

/**
 * Brand marks stay as inline SVG paths (carried over from the previous
 * footer). lucide-react 1.x removed its brand icons over trademark concerns,
 * so there is no icon-set equivalent to switch to.
 */
const LINKS = [
  {
    href: "https://github.com/KonnorKooi",
    label: "GitHub",
    path: "M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z",
  },
  {
    href: "https://www.linkedin.com/in/konnor-kooi-93b83a281/",
    label: "LinkedIn",
    path: "M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854zm4.943 12.248V6.169H2.542v7.225zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248S2.4 3.226 2.4 3.934c0 .694.521 1.248 1.327 1.248zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016l.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225z",
  },
  {
    href: "https://www.instagram.com/konnorkooi/",
    label: "Instagram",
    path: "M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.9 3.9 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599s.453.546.598.92c.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.5 2.5 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.5 2.5 0 0 1-.92-.598 2.5 2.5 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233s.008-2.388.046-3.231c.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92s.546-.453.92-.598c.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92m-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217m0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334",
  },
];

/**
 * The two previous footers are merged into one, and each icon link now has an
 * accessible name — the old ones were unlabelled, so a screen reader
 * announced three anonymous links.
 */
export function SiteFooter({ generatedAt }: { generatedAt: string }) {
  const built = new Date(generatedAt);
  return (
    <footer className="mt-10 border-t border-lightblue/40 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        <p className="text-sm">
          All data is sourced from{" "}
          <a
            href={SOURCE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-darkblue underline underline-offset-2"
          >
            the Washington State Department of Health
          </a>
          , which publishes the reproductive health and end-of-life policies
          each facility files with the state.
        </p>
        <p className="mt-2 text-sm text-gray-600">
          Facilities are listed as they appear in the source filings. A blank
          entry means the facility did not answer that question — not that the
          service is unavailable. Confirm directly with the hospital before
          relying on anything here.
        </p>

        <div className="mt-6 flex flex-col gap-4 border-t border-lightblue/40 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-gray-600">
            <p className="font-medium text-gray-800">Konnor Kooi</p>
            <p>WWU Computer Science</p>
            <p className="mt-1">
              Data built{" "}
              <time dateTime={generatedAt}>
                {built.toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            </p>
          </div>
          <nav aria-label="Social links" className="flex gap-4">
            {LINKS.map(({ href, label, path }) => (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded p-1 text-darkblue hover:opacity-70"
              >
                <svg
                  viewBox="0 0 16 16"
                  className="size-6 fill-current"
                  aria-hidden="true"
                >
                  <path d={path} />
                </svg>
                <span className="sr-only">{label}</span>
              </a>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
