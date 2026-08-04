# Washington Care Access

Which Washington state hospitals provide reproductive health and end-of-life
services, based on the policies each facility files with the state Department
of Health.

Live at **https://wahealth.konnorkooi.com**

## Stack

| Concern    | Choice                                                  |
| ---------- | ------------------------------------------------------- |
| Framework  | Next.js 16 (App Router), static export                  |
| UI         | React 19, TypeScript (strict)                           |
| Styling    | Tailwind CSS v4 (CSS-first `@theme`, no JS config file) |
| Components | Radix primitives in the shadcn/ui style                 |
| Map        | MapLibre GL via react-map-gl — no API key, no billing   |
| URL state  | nuqs — filters and search live in the query string      |
| Data       | CSV → Zod validation → typed JSON, at build time        |
| Tests      | Vitest + Testing Library, Playwright                    |
| Deploy     | GitHub Actions → rsync → nginx                          |

## Getting started

```bash
npm install
npm run dev     # runs build:data first, then serves on :3000
```

No API keys or `.env` file are required. Map tiles come from
[OpenFreeMap](https://openfreemap.org/), which needs no account. To use a
different tile provider, set `NEXT_PUBLIC_MAP_STYLE_URL` — and update the CSP
in `deploy/security-headers.conf` to allow the new host, or the map will render
blank.

| Command              | What it does                                        |
| -------------------- | --------------------------------------------------- |
| `npm run build:data` | CSV → validated `src/data/generated/hospitals.json` |
| `npm run dev`        | Dev server                                          |
| `npm run build`      | Static export into `out/`                           |
| `npm run preview`    | Serve the built `out/` directory                    |
| `npm test`           | Unit tests                                          |
| `npm run test:e2e`   | Playwright (needs `npm run build` first)            |
| `npm run typecheck`  | `tsc --noEmit`                                      |
| `npm run lint`       | ESLint                                              |

## How the data works

The two CSVs in `public/data/` are the source of truth, edited by hand or
exported from a spreadsheet. `scripts/build-data.ts` turns them into typed JSON
at build time.

**`src/data/schema.ts` is the contract.** Every filterable service is declared
there once, with the exact CSV column it reads from. The build asserts that the
declarations and the CSV headers agree in both directions, and **fails** if they
don't.

That check exists because of a real bug: the previous version hardcoded filter
labels in the page component and matched them against raw CSV headers at
runtime. Two were misspelled relative to the data (`miscarraiges`, `materiasl`),
so those filters matched nothing — silently, forever. A mismatch is now a build
failure rather than a dead checkbox.

The build also:

- normalizes each cell to `yes` / `no` / `see-comments` / `unknown`. **`See
comments` is its own state**; the old code tested `=== "yes"` and so hid those
  facilities as though they were a "no".
- merges the two files into one record per hospital, using an explicit alias map
  (`CANONICAL_NAME_ALIASES`) for facilities spelled differently across files.
  Aliases are explicit rather than fuzzy-matched so a merge is always
  reviewable; the build _warns_ about unlisted near-duplicates.
- keeps facilities with no coordinates instead of dropping them, and marks them
  so the UI can say "not on the map".

### Changing the data

1. Edit the CSVs in `public/data/`.
2. `npm run build:data` — read the warnings; errors abort the build.
3. If a column was added or renamed, update `src/data/schema.ts` to match.

## Deploying

Pushing to `main` runs `.github/workflows/deploy.yml`, which typechecks, tests,
builds, and rsyncs `out/` to `/var/www/wahealth.konnorkooi.com/`.

Required repository secrets: `SSH_PRIVATE_KEY`, `REMOTE_HOST`, `REMOTE_USER`.

Server-side setup is one-time and documented at the top of
`deploy/nginx-wahealth.conf.example` — nginx server block, TLS via certbot, and
the security-headers snippet. The workflow only copies files; it never touches
nginx config.

## Gotcha: maplibre-gl is pinned to 5.x

react-map-gl 8 declares support for maplibre-gl >=4, but does **not** work with
maplibre-gl 6. Under v6 the map renders its basemap and looks nearly right, but
`load` never fires and no markers ever appear — with no error in the console.
Read the note at the top of `src/components/map/HospitalMap.tsx` before bumping
it.

## Data caveats

Facilities are listed as they appear in the state filings. A blank entry means
the facility did not answer that question — not that a service is unavailable.
Some filings are flagged by the state as using an outdated or incorrect form;
the UI surfaces those notes. Confirm directly with a hospital before relying on
anything here.

Source:
[Washington State Department of Health hospital policies](https://doh.wa.gov/data-statistical-reports/healthcare-washington/hospital-and-patient-data/hospital-policies)

## License

MIT
