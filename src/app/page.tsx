import { Suspense } from "react";

import { HospitalExplorer } from "@/app/_components/HospitalExplorer";
import { StaticDirectory } from "@/components/hospital/StaticDirectory";
import { SiteFooter } from "@/components/site/SiteFooter";
import { hospitals, hospitalsFile } from "@/data/hospitals";

/**
 * Server component: the hospital data is imported at build time and rendered
 * into the static HTML. The previous version fetched and parsed CSV in the
 * browser on every visit, so the page shipped empty to crawlers and showed a
 * blank list until the parse finished.
 *
 * StaticDirectory is what gets prerendered (see the note in that file); the
 * interactive explorer takes over on hydration.
 */
export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Suspense fallback={<StaticDirectory hospitals={hospitals} />}>
        <HospitalExplorer hospitals={hospitals} />
      </Suspense>
      <SiteFooter generatedAt={hospitalsFile.generatedAt} />
    </div>
  );
}
