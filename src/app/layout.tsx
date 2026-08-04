import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import "./globals.css";

// Replaces the v3 `addBase` font plugin plus the bare Poppins reference that
// was never actually loaded — next/font self-hosts the files and avoids a
// render-blocking request to Google.
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

const title = "Washington Care Access";
const description =
  "Find which Washington state hospitals provide reproductive health and end-of-life services, based on the policies each facility filed with the state.";

export const metadata: Metadata = {
  title: {
    default: title,
    template: `%s | ${title}`,
  },
  description,
  applicationName: title,
  openGraph: {
    title,
    description,
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title,
    description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={poppins.variable}>
      <body className="min-h-screen antialiased">
        <a
          href="#main"
          className="sr-only rounded bg-darkblue px-4 py-2 text-white focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50"
        >
          Skip to main content
        </a>
        <NuqsAdapter>{children}</NuqsAdapter>
      </body>
    </html>
  );
}
