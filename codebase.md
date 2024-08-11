# tsconfig.json

```json
{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}

```

# tailwind.config.ts

```ts
import type { Config } from 'tailwindcss';
import type { PluginAPI } from 'tailwindcss/types/config';

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    fontFamily: {
      poppins: ['Poppins', 'sans-serif'],
    },
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        lightblue: {
          DEFAULT: '#8FC1E3',
          foreground: 'hsl(var(--primary-foreground))',
        },
        darkgreen: {
          DEFAULT: '#687864',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        midblue: {
          DEFAULT: '#5085A5',
          foreground: 'hsl(var(--accent-foreground))',
        },
        darkblue: '#31708E',
        graywhite: '#F7F9FB',
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: '#8FC1E3', // lightblue
          secondary: '#687864', // darkgreen
          accent: '#5085A5', // midblue
          neutral: '#3d4451', // default DaisyUI neutral color
          'base-100': '#F7F9FB', // graywhite
          info: '#2094f3', // default DaisyUI info color
          success: '#009485', // default DaisyUI success color
          warning: '#ff9900', // default DaisyUI warning color
          error: '#ff5724', // default DaisyUI error color
        },
      },
    ],
  },
  plugins: [
    require('tailwindcss-animate'),
    require('daisyui'),
    function (api: PluginAPI) {
      const { addBase, theme } = api;
      addBase({
        html: { fontFamily: theme('fontFamily.poppins') },
        body: { fontFamily: theme('fontFamily.poppins') },
      });
    },
  ],
};

export default config;

```

# postcss.config.mjs

```mjs
/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {},
  },
};

export default config;

```

# package.json

```json
{
  "name": "Washington-health-project",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "@radix-ui/react-accordion": "^1.1.2",
    "@radix-ui/react-checkbox": "^1.0.4",
    "@radix-ui/react-scroll-area": "^1.0.5",
    "@vis.gl/react-google-maps": "^1.0.2",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.1",
    "lucide-react": "^0.394.0",
    "mini-css-extract-plugin": "^2.9.0",
    "next": "^14.2.4",
    "react": "^18",
    "react-dom": "^18",
    "react-papaparse": "^4.4.0",
    "tailwind-merge": "^2.3.0",
    "tailwindcss-animate": "^1.0.7"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "daisyui": "^4.12.2",
    "eslint": "^8",
    "eslint-config-next": "14.2.4",
    "postcss": "^8",
    "tailwindcss": "^3.4.1",
    "typescript": "^5"
  }
}
```

# next.config.mjs

```mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_GOOGLE_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_API_KEY,
    NEXT_PUBLIC_MAP_ID: process.env.NEXT_PUBLIC_MAP_ID,
  },
};

export default nextConfig;

```

# components.json

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "src/app/globals.css",
    "baseColor": "slate",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils"
  }
}
```

# README.md

```md
Project Structure 

/public
  favicon.ico
  /images
    logo-removebg-preview.png
/src
  /components
    /ui
      Navbar.tsx
      Filters.tsx
      HospitalBlock.tsx
      MapComponent.tsx
      MapComponent.module.css
      ScrollArea.tsx
  /hooks
    useFetchHospitals.ts
  /styles
    globals.css
  /pages
    _document.tsx
    _app.js
    index.tsx
  metadata.ts
/tailwind.config.js











This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

\`\`\`bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

```

# .gitignore

```
# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

# dependencies
/node_modules
/.pnp
.pnp.js
.yarn/install-state.gz

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts

./vscode
```

# .eslintrc.json

```json
{
    "extends": "next/core-web-vitals"
  }

```

# src/metadata.ts

```ts
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Create Next App",
    description: "Generated by create next app",
};

```

# public/vercel.svg

This is a file of the type: SVG Image

# public/next.svg

This is a file of the type: SVG Image

# public/favicon.ico

This is a binary file of the type: Binary

# src/utils/renderProperty.tsx

```tsx
import React from "react";

const renderProperty = (label: string, value: any) => {
  const isYesNo = (val: any) => {
    return typeof val === "string" && (val.toLowerCase() === "yes" || val.toLowerCase() === "no");
  };

  const getClassName = (val: any) => {
    if (isYesNo(val)) {
      return val.toLowerCase() === "yes" ? "text-green-500" : "text-red-500";
    }
    return "";
  };

  return (
    <div className={getClassName(value)}>
      {label}: {value || "N/A"}
    </div>
  );
};

export default renderProperty;

```

# src/types/types.ts

```ts
// types/types.ts
export interface Hospital {
    id: string;
    Hospital: string;
    City?: string;
    State?: string;
    Lat: number;
    Long: number;
    [key: string]: any; // For dynamic properties
}

```

# src/styles/globals.css

```css
/* styles/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&display=swap');


@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;

    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;

    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;

    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;

    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;

    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;

    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;

    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;

    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 222.2 84% 4.9%;

    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;

    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;

    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;

    --primary: 210 40% 98%;
    --primary-foreground: 222.2 47.4% 11.2%;

    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;

    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;

    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;

    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;

    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 212.7 26.8% 83.9%;
  }
}

@layer base {
  * {
    @apply border-border;
    font-family: 'Poppins', sans-serif;
  }

  body {
    @apply bg-graywhite text-foreground;
    /* Use your graywhite color here */
  }
}
```

# src/pages/layout.tsx

```tsx
"use client";

import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}

```

# src/pages/index.tsx

```tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import Navbar from "@/components/ui/Navbar";
import HospitalBlock from "@/components/ui/HospitalBlock";
import MapComponent from "@/components/ui/MapComponent";
import Filters from "@/components/ui/Filters";
import ScrollArea from "@/components/ui/ScrollArea";
import Footer from "@/components/ui/Footer"; // Import the Footer component
import { useFetchHospitals, Hospital } from "@/hooks/useFetchHospitals";
import FooterKonnor from "@/components/ui/FooterKonnor";

const HomePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("reproductive");
  const { hospitals, filteredHospitals, setFilteredHospitals } =
    useFetchHospitals(activeTab);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedHospital, setExpandedHospital] = useState<Hospital | null>(
    null
  );
  const hospitalRefs = useRef<(HTMLDivElement | null)[]>([]);

  const reproductiveFilters = {
    "Medication abortion": false,
    "Surgical abortion": false,
    "Birth control": false,
    "Contraceptive counseling": false,
    "Hospital pharmacy dispenses contraception": false,
    "Removal of contraceptive devices": false,
    "Tubal ligations": false,
    Vasectomies: false,
    "Emergency Contraception w/SA": false,
    "Emergency Contraception w/out SA": false,
    "Infertility Counseling": false,
    "Infertility testing and diagnoses": false,
    "Infertility treatment including IVF": false,
    "HIV testing": false,
    "HIV treatment": false,
    "PrEP and PEP w/counseling": false,
    "STD testing/treatment": false,
    "Treating miscarriages and ectopic pregnancies": false,
    "Pregnancy counseling": false,
    "Pregnancy genetic counseling": false,
    "Pregnancy Labor and Delivery": false,
    "Pregnancy NICU": false,
    "Pregnancy prenatal care": false,
    "Pregnancy Postnatal Care": false,
    "Pregnancy Ultrasound": false,
  };

  const endOfLifeFilters = {
    "Behavioral/Substance?": false,
    "Recent enough for use?": false,
    "Incorrect form?": false,
    "Written Policies & Procedures on ACP and AD": false,
    "Offers info and support for ACP": false,
    "Asks patient about ACP": false,
    "Assists patients with ACP": false,
    "Provides EOL education": false,
    "Provides treatment option evaluation": false,
    "Provides hospice care": false,
    "Provides palliative care": false,
    "Provides spiritual care": false,
    "Provides ethics consultation services": false,
    "Provide referrals/resources for palliative care": false,
    "Provides pain and symptom consultation": false,
    "Reviews and Honors POLST": false,
    "DWD: allows providers to participate": false,
    "Provides DWD educational materials": false,
    "Pharmacies dispense DWD medication": false,
    "Patients can self-admin DWD medication at hospital": false,
  };

  const [checkboxFilters, setCheckboxFilters] = useState(reproductiveFilters);

  useEffect(() => {
    const newFilters =
      activeTab === "reproductive"
        ? { ...reproductiveFilters }
        : { ...endOfLifeFilters };
    setCheckboxFilters((prevFilters) => ({
      ...prevFilters,
      ...newFilters,
    }));
  }, [activeTab]);

  const handleMarkerClick = (hospital: Hospital) => {
    const index = hospitals.indexOf(hospital);
    if (index !== -1 && hospitalRefs.current[index]) {
      hospitalRefs.current[index]?.scrollIntoView({ behavior: "smooth" });
    }
    setExpandedHospital(hospital);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
  };

  useEffect(() => {
    const filtered = hospitals.filter((hospital) => {
      const matchesSearchTerm =
        hospital.Hospital.toLowerCase().includes(searchTerm) ||
        (hospital.City && hospital.City.toLowerCase().includes(searchTerm)) ||
        (hospital.State && hospital.State.toLowerCase().includes(searchTerm));

      const matchesCheckboxFilters = Object.entries(checkboxFilters).every(
        ([key, value]) =>
          !value || (hospital[key] && hospital[key].toLowerCase() === "yes")
      );

      return matchesSearchTerm && matchesCheckboxFilters;
    });

    setFilteredHospitals(filtered);
  }, [searchTerm, checkboxFilters, hospitals, setFilteredHospitals]);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    setCheckboxFilters((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSetExpandedHospital = (hospital?: Hospital) => {
    setExpandedHospital(hospital ?? null);
  };

  return (
    <div className="flex flex-col min-h-screen bg-graywhite font-poppins">
      <Navbar onTabChange={setActiveTab} />
      <div className="flex-1 w-full px-4 lg:px-40 mt-4 mb-5">
        <div className="flex flex-col lg:flex-row">
          <div className="flex flex-col w-full lg:w-2/3 p-5">
            <div className="flex flex-col flex-1">
              <div className="flex items-center justify-between p-3 border border-gray-300 rounded-md mb-5 bg-lightblue">
                <h2 className="text-xl mb-0">Hospital Search</h2>
                <input
                  type="text"
                  placeholder="Type here"
                  value={searchTerm}
                  onChange={handleSearch}
                  className="input input-bordered w-full lg:w-auto"
                />
              </div>
              <div className="flex-1 border border-gray-300 rounded-md min-h-[300px]">
                <MapComponent
                  apiKey={process.env.NEXT_PUBLIC_GOOGLE_API_KEY ?? ""}
                  mapId={process.env.NEXT_PUBLIC_MAP_ID ?? ""}
                  hospitals={filteredHospitals}
                  onMarkerClick={handleMarkerClick}
                />
              </div>
              <div className="mt-5">
                <Filters
                  checkboxFilters={checkboxFilters}
                  handleCheckboxChange={handleCheckboxChange}
                  filterOptions={Object.keys(checkboxFilters)}
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col w-full lg:w-1/3 p-5 h-full">
            <ScrollArea
              className="p-5 border border-gray-300 rounded-md bg-lightblue overflow-y-auto"
              style={{ height: "800px" }}>
              {filteredHospitals.map((hospital, index) => (
                <div
                  key={index}
                  ref={(el) => {
                    if (el) {
                      hospitalRefs.current[index] = el;
                    }
                  }}>
                  <HospitalBlock
                    key={hospital.id}
                    hospital={hospital}
                    expanded={expandedHospital === hospital}
                    setExpandedHospital={handleSetExpandedHospital}
                  />
                </div>
              ))}
            </ScrollArea>
          </div>
        </div>
      </div>
      <Footer />
      <FooterKonnor />
    </div>
  );
};

export default HomePage;

```

# src/pages/_document.tsx

```tsx
// src/pages/_document.tsx
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        {/* Include other meta tags or links if necessary */}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

```

# src/pages/_app.js

```js
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;

```

# src/lib/utils.ts

```ts
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

```

# src/hooks/useFetchHospitals.ts

```ts
import { useEffect, useState } from "react";
import Papa from "papaparse";

export interface Hospital {
    id: string;
    Hospital: string;
    City?: string;
    State?: string;
    Lat: number;
    Long: number;
    [key: string]: any; // For dynamic properties
}

export const useFetchHospitals = (tab: string) => {
    const [hospitals, setHospitals] = useState<Hospital[]>([]);
    const [filteredHospitals, setFilteredHospitals] = useState<Hospital[]>([]);

    useEffect(() => {
        const csvFile = tab === "reproductive" ? "/data/reproductive.csv" : "/data/endoflife.csv";

        fetch(csvFile)
            .then((response) => response.text())
            .then((data) => {
                Papa.parse(data, {
                    header: true,
                    skipEmptyLines: true,
                    complete: (result) => {
                        const parsedData = result.data.map((hospital: any) => ({
                            ...hospital,
                            Lat: parseFloat(hospital.Lat),
                            Long: parseFloat(hospital.Long),
                        }));
                        setHospitals(parsedData);
                        setFilteredHospitals(parsedData);
                    },
                    error: (error: any) => {
                        console.error("Error parsing the CSV file:", error);
                    },
                });
            })
            .catch((error) => console.error("Error fetching the CSV file:", error));
    }, [tab]);

    return { hospitals, filteredHospitals, setFilteredHospitals };
};

```

# public/images/logo_nobg.png

This is a binary file of the type: Image

# public/images/logo.png

This is a binary file of the type: Image

# public/data/reproductive.csv

```csv
Hospital,Address,City,State,Zip Code,Contact,Phone number,Date signed,Behavioral/Substance?,Medication abortion,Referrals for abortions,Surgical abortion,Birth control,Contraceptive counseling,Hospital pharmacy dispenses contraception,Removal of contraceptive devices,Tubal ligations,Vasectomies,Emergency Contraception w/SA,Emergency Contraception w/out SA,Infertility Counseling,Infertility testing and diagnoses,Infertility treatment including IVF,HIV testing,HIV treatment,PrEP and PEP w/counseling,STD testing/treatment,Treating miscarraiges and ectopic pregnancies,Pregnancy counseling,Pregnancy genetic counseling,Pregnancy Labor and Delivery,Pregnancy NICU,Pregnancy prenatal care,Pregnancy Postnatal Care,Pregnancy Ultrasound,Additional Comments,Lat,Long
Acadia Cascade Behavioral Health,,Burien,WA,,,,,TRUE,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
"Arbor Health, Morton Hospital / Lew County Hospital District No.1","521 Adams Avenue, PO Box 1138",Morton,WA,98356,Specialty Clinic,360-496-3641,9/13/2019,FALSE,No,Yes,No,Yes,Yes,No,Yes,Yes,Yes,Yes,Yes,Yes,Yes,No,Yes,No,See comments,Yes,See comments,Yes,No,See comments,No,No,No,No,Yes,46.55552,-122.28005
Astria Regional Medical Center (formerly Yakima Regional Medical & Cardiac Center),110 South 9th Avenue,Yakima,WA,98902,Sara Williamson CNO,509-454-6192,09/24/2019,FALSE,No,No,No,Yes,Yes,No,Yes,No,Yes,Yes,Yes,No,No,No,Yes,Yes,No,Yes,No,Yes,No,Yes,No,Yes,Yes,Yes,Yes,45.81488,-122.73829
Astria Sunnyside Hospital and Clinics,1016 Tacoma Ave,Sunnyside,WA,98944,Cynthia Lewis,509-837-1500,10/03/2019,FALSE,No,No,No,Yes,Yes,Yes,Yes,Yes,Yes,Yes,No,No,No,No,Yes,Yes,Yes,Yes,Yes,Yes,Yes,Yes,No,Yes,Yes,Yes,Yes,46.323021,-120.006607
Astria Toppenish Hospital,502 West 4th Ave,Toppenish,WA,98948,Tarra Palomarez,509-865-1520,07/27/2021,FALSE,No,No,No,No,Yes,No,No,Yes,No,Yes,Yes,No,No,No,Yes,Yes,Yes,Yes,Yes,Yes,Yes,Yes,No,Yes,Yes,Yes,No,46.37131,-120.31668
BHC Fairfax Hospital,,Kirkland,WA,,,,,TRUE,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
BHC Fairfax Hospital Monroe,,Monroe,WA,,,,,TRUE,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
BHC Fairfax Hospital North,,Everett,WA,,,,,TRUE,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
Cascade Medical Center / Chelan County Public Hospital District No. 1,817 Commerical street,Leavenworth,WA,98826,Diane Blake,509-548-5815,08/26/2019,FALSE,No,No,No,No,Yes,Yes,Yes,No,No,Yes,Yes,No,No,No,Yes,Yes,Yes,Yes,No,No,No,No,No,No,No,No,Yes,47.59447,-120.66073
Columbia Basin Hospital,200 Nat Washington Way,Ephrata,WA,98823,Vicki Polhamus,509-717-5211,08/21/2019,FALSE,No,No,No,No,No,No,No,No,No,Yes,No,No,No,No,No,No,No,Yes,See comments,No,No,No,No,No,No,See comments,Yes,47.31433,-119.54596
Confluence Health Hospital,1201 S. Miller Street,Wenatchee,WA,98801,Kelly Allen,509-663-8711,06/12/2023,FALSE,No,Yes,No,Yes,Yes,Yes,Yes,Yes,Yes,Yes,Yes,Yes,Yes,Yes,Yes,Yes,Yes,Yes,Yes,Yes,Yes,Yes,Yes,Yes,Yes,Yes,No,47.4067273,-120.3211376
Coulee Medical Center,411 Fortuyn Road,Grand Coulee,WA,99133,Ramona Hicks,509-633-6333,08/29/2019,FALSE,Yes,Yes,No,No,Yes,See comments,No,Yes,No,Yes,Yes,No,No,No,Yes,Yes,No,Yes,Yes,Yes,No,Yes,No,Yes,Yes,Yes,Yes,47.9421323,-119.0075727
Dayton General Hospital (Columbia County Public Hospital District #1),1012 South 3rd St.,Dayton,WA,99382,Shane McGuire,509-282-2531,08/23/2019,FALSE,No,No,No,No,No,No,No,No,No,See comments,No,No,No,No,No,No,No,Yes,See comments,No,No,See comments,No,No,No,See comments,Yes,46.3120361,-117.9705178
East Adams Rural Hospital,903 S Adams St,Ritzville,WA,99169,Corey Fedie,509-59?-1200,08/22/2019,FALSE,No,Yes,Yes,No,No,Yes,No,No,Yes,Yes,No,No,No,No,Yes,Yes,Yes,Yes,Yes,Yes,Yes,See comments,No,See comments,See comments,Yes,Yes,47.1212651,-118.3718322
EvergreenHealth Medical Center,12040 NE 128th Street,Kirkland,WA,98034,Mary Shepler,425-899-3479,11/25/2019,FALSE,Yes,Yes,Yes,Yes,Yes,Yes,Yes,Yes,Yes,Yes,Yes,Yes,Yes,No,Yes,Yes,Yes,Yes,Yes,Yes,Yes,Yes,Yes,Yes,Yes,Yes,No,47.7164381,-122.1802051
EvergreenHealth Monroe (formerly Valley General Hospital) (Snohomich County Public Hospital District No. 1),14701 179th Ave SE,Monroe,WA,98272,Sarah Macht,360-794-1403,09/23/2020,FALSE,See comments,See comments,See comments,No,Yes,No,No,No,No,Yes,Yes,No,No,No,Yes,Yes,Yes,Yes,Yes,No,No,No,No,No,No,Yes,Yes,47.864109,-121.989532
Ferry County Memorial Hospital (Ferry County Public Hospital District),36 Klondike Rd,Republic,WA,99166,Aaron Edwards,509-775-3333,08/29/2019,FALSE,See comments,See comments,See comments,No,No,No,No,No,No,Yes,Yes,No,No,No,Yes,No,No,Yes,Yes,See comments,See comments,See comments,See comments,See comments,See comments,See comments,Yes,48.6522021,-118.7337345
Forks Community Hospital,530 Bogachiel Way,Forks,WA,98331,Kelly Thompson,360-374-6271 ext. 327,02/13/2024,FALSE,No,Yes,No,Yes,Yes,No,Yes,See comments,No,Yes,Yes,No,No,No,Yes,No,Yes,Yes,See comments,Yes,Yes,Yes,No,Yes,Yes,Yes,Yes,47.9463652,-124.3932652
Fred Hutchinson Cancer Care (formerly Seattle Cancer Care Alliance) **incorrect form,1959 NE Pacific Street,Seattle,WA,98195,Accreditation and Regulatory Affairs,206-606-6588,04/13/2023,FALSE,No,Yes,No,See comments,Yes,Yes,Yes,No,No,No,No,Yes,No,No,Yes,No,Yes,Yes,No,Yes,No,No,No,No,No,No,Yes,47.6494115,-122.3076383
```

# public/data/endoflife.csv

```csv
Hospital,Address,City,State,Zip Code,Phone number,Contact,Date signed,Behavioral/Substance?,Recent enough for use?,Incorrect form?,Written Policies & Procedures on ACP and AD,Offers info and support for ACP,Asks patient about ACP,Assists patients with ACP,Provides EOL education,Provides treatment option evaluation,Provides hospice care,Provides palliative care,Provides spiritual care,Provides ethics consultation services,Provide referrals/resources for palliative care,Provides pain and symptom consultation,Reviews and Honors POLST,DWD: allows providers to participate,Provides DWD educational materiasl,Pharmacies dispense DWD medication,Patients can self-admin DWD medication at hospital,Comments?,Lat,Long
Acadia Cascade Behavioral Health,,Burien,WA,,,,,TRUE,FALSE,FALSE,,,,,,,,,,,,,,,,,,,,
"Arbor Health, Morton Hospital / Lewis County Hospital District No.1","521 Adams Avenue, PO Box 1138",Morton,WA,98356,360-496-3525,Robert Mach,11/16/2023,FALSE,TRUE,FALSE,Yes,Yes,Yes,Yes,Yes,Yes,Yes,No,Yes,Yes,Yes,Yes,Yes,No,Yes,No,No,No,46.55552,-122.28005
Astria Regional Medical Center (formerly Yakima Regional Medical & Cardiac Center),,,,,,,,FALSE,FALSE,FALSE,,,,,,,,,,,,,,,,,,,,
Astria Sunnyside Hospital,,,,,,,,FALSE,FALSE,FALSE,,,,,,,,,,,,,,,,,,,,
Astria Toppenish Hospital,?? Links to wrong form,,,,,,,FALSE,FALSE,FALSE,,,,,,,,,,,,,,,,,,,,
BHC Fairfax Hospital,,Kirkland,WA,,,,,TRUE,FALSE,FALSE,,,,,,,,,,,,,,,,,,,47.67551,-122.203362
BHC Fairfax Hospital Monroe,,Monroe,WA,,,,,TRUE,FALSE,FALSE,,,,,,,,,,,,,,,,,,,47.85211,-121.9824
BHC Fairfax Hospital North,,Everett,WA,,,,,TRUE,FALSE,FALSE,,,,,,,,,,,,,,,,,,,47.97913,-122.195892
Cascade Medical Center / Chelan County Public Hospital District No. 1,817 Commerical street,Leavenworth,WA,98826,Natasha Pierstrup,509-548-5815,12/22/2023,FALSE,TRUE,FALSE,Yes,Yes,Yes,Yes,Yes,Yes,No,No,Yes,No,Yes,Yes,Yes,Yes,Yes,No,No,Yes,47.594471,-120.660728
Columbia Basin Hospital,200 Nat Washington Way,Ephrata,WA,98823,Vicki Polhamus,509-717-5211,01-02-2024,FALSE,TRUE,FALSE,Yes,Yes,Yes,No,Yes,No,Yes,No,No,No,No,No,Yes,No,Yes,No,No,No,47.3144428,-119.5463633
Confluence Health Hospital,1201 S. Miller Street,Wenatchee,WA,98801,Sarah Brown,509-662-1511,12/31/2023,FALSE,TRUE,FALSE,Yes,Yes,Yes,Yes,Yes,Yes,Yes,Yes,Yes,Yes,Yes,Yes,Yes,Yes,Yes,Yes,No,No,47.4234599,-120.310349
Coulee Medical Center,411 Fortuyn Road,Grand Coulee,WA,99133,Ramona Hicks,509-449-8097,02/20/2024,FALSE,TRUE,FALSE,Yes,No,Yes,Yes,Yes,No,No,No,No,No,Yes,No,Yes,No,No,No,No,No,47.94238281,-119.005867
Dayton General Hospital (Columbia County Public Hospital District #1) ** old/odd form,1012 South 3rd St.,Dayton,WA,99382,Shane McGuire,509-282-2531,12/26/2023,FALSE,TRUE,FALSE,Yes,Yes,Yes,Yes,Yes,Yes,No,Yes,Yes,Yes,Yes,Yes,Yes,See comments,See comments,See comments,See comments,No,46.3120361,-117.9705178
East Adams Rural Hospital,,,,,,,,FALSE,FALSE,FALSE,,,,,,,,,,,,,,,,,,,,
EvergreenHealth Medical Center (King County Public Hospital District #2),12040 NE 128th Street,Kirkland,WA,98034,Mary Shepler,425-899-3479,11/17/2023,FALSE,TRUE,FALSE,Yes,Yes,Yes,Yes,Yes,Yes,Yes,Yes,Yes,Yes,Yes,Yes,Yes,Yes,Yes,Yes,No,No,47.7164381,-122.1802051
EvergreenHealth Monroe (formerly Valley General Hospital) (Snohomich County Public Hospital District No. 1),14701 179th Ave SE,Monroe,WA,98272,Megan Wirsching,360-794-189,01/16/2024,FALSE,TRUE,FALSE,Yes,Yes,Yes,Yes,Yes,Yes,No,No,No,Yes,Yes,Yes,Yes,No,No,No,No,No,47.8642196,-121.9894561
Ferry County Memorial Hospital (Ferry County Public Hospital District),36 Klondike Rd,Republic,WA,99166,Jennifer Reed,509-775-8242,01/16/2024,FALSE,TRUE,FALSE,Yes,Yes,Yes,Yes,Yes,Yes,Yes,Yes,Yes,Yes,Yes,Yes,Yes,Yes,Yes,Yes,Yes,Yes,48.6522021,-118.7337345
Forks Community Hospital,530 Bogachiel Way,Forks,WA,98331,Kelly Thompson,360-374-6271,11/16/2023,FALSE,TRUE,FALSE,Yes,Yes,Yes,Yes,Yes,Yes,Yes,Yes,Yes,Yes,Yes,Yes,Yes,Yes,Yes,No,No,No,47.9463652,-124.3932652
```

# src/components/ui/checkbox.tsx

```tsx
"use client"

import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { Check } from "lucide-react"

import { cn } from "@/lib/utils"

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn("flex items-center justify-center text-current")}
    >
      <Check className="h-4 w-4" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }

```

# src/components/ui/ScrollArea.tsx

```tsx
// src/components/ui/ScrollArea.tsx
"use client";

import * as React from "react";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";

import { cn } from "@/lib/utils"; // Ensure this import path is correct

const ScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root>
>(({ className, children, ...props }, ref) => (
  <ScrollAreaPrimitive.Root
    ref={ref}
    className={cn("relative overflow-hidden", className)}
    {...props}>
    <ScrollAreaPrimitive.Viewport className="h-full w-full rounded-[inherit]">
      {children}
    </ScrollAreaPrimitive.Viewport>
    <ScrollBar />
    <ScrollAreaPrimitive.Corner />
  </ScrollAreaPrimitive.Root>
));
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName;

const ScrollBar = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>
>(({ className, orientation = "vertical", ...props }, ref) => (
  <ScrollAreaPrimitive.ScrollAreaScrollbar
    ref={ref}
    orientation={orientation}
    className={cn(
      "flex touch-none select-none transition-colors",
      orientation === "vertical" &&
        "h-full w-2.5 border-l border-l-transparent p-[1px]",
      orientation === "horizontal" &&
        "h-2.5 flex-col border-t border-t-transparent p-[1px]",
      className
    )}
    {...props}>
    <ScrollAreaPrimitive.ScrollAreaThumb className="relative flex-1 rounded-full bg-border" />
  </ScrollAreaPrimitive.ScrollAreaScrollbar>
));
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName;

export { ScrollArea, ScrollBar };
export default ScrollArea;

```

# src/components/ui/Navbar.tsx

```tsx
import React, { useState } from "react";
import Image from "next/image";

const Navbar = ({ onTabChange }: { onTabChange: (tab: string) => void }) => {
  const [activeTab, setActiveTab] = useState("reproductive");

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    onTabChange(tab);
  };

  return (
    <div className="navbar bg-darkblue flex flex-col lg:flex-row">
      <div className="flex-1 flex items-center">
        <Image src="/images/logo_nobg.png" alt="Logo" width={40} height={40} />
        <div className="ml-2 text-2xl text-graywhite">
          WA Care Access Transparency
        </div>
      </div>
      <div className="flex-none mt-2 lg:mt-0">
        <div
          role="tablist"
          className="tabs tabs-boxed flex flex-row lg:flex-row">
          <a
            role="tab"
            className={`tab ${
              activeTab === "reproductive" ? "tab-active" : ""
            }`}
            onClick={() => handleTabChange("reproductive")}>
            Reproductive Info
          </a>
          <a
            role="tab"
            className={`tab ${activeTab === "end_of_life" ? "tab-active" : ""}`}
            onClick={() => handleTabChange("end_of_life")}>
            End of Life Services Info
          </a>
        </div>
      </div>
    </div>
  );
};

export default Navbar;

```

# src/components/ui/MapComponent.tsx

```tsx
import React, { useState } from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  InfoWindow,
  useAdvancedMarkerRef,
} from "@vis.gl/react-google-maps";
import styles from "./MapComponent.module.css";

interface MapComponentProps {
  apiKey: string;
  mapId: string;
  hospitals: any[];
  onMarkerClick: (hospital: any) => void;
}

const MapComponent: React.FC<MapComponentProps> = ({
  apiKey,
  mapId,
  hospitals,
  onMarkerClick,
}) => {
  const [infowindowOpen, setInfowindowOpen] = useState(false);
  const [mapCenter, setMapCenter] = useState({
    lat: 47.2,
    lng: -121,
  });
  const [mapZoom, setMapZoom] = useState(7);

  const handleCameraChange = (ev: { detail: { center: any; zoom: any } }) => {
    const { center, zoom } = ev.detail;
    setMapCenter(center);
    setMapZoom(zoom);
  };

  const filteredHospitals = hospitals.filter((hospital) => {
    const lat = parseFloat(hospital.Lat);
    const long = parseFloat(hospital.Long);
    return !isNaN(lat) && !isNaN(long);
  });

  return (
    <APIProvider
      apiKey={apiKey}
      onLoad={() => console.log("Maps API has loaded.")}>
      <div className={styles.mapContainer}>
        <Map
          zoom={mapZoom}
          center={mapCenter}
          mapId={mapId}
          streetViewControl={false}
          fullscreenControl={false}
          onCameraChanged={handleCameraChange}>
          {filteredHospitals.map((hospital, index) => {
            const lat = parseFloat(hospital.Lat);
            const long = parseFloat(hospital.Long);

            return (
              <AdvancedMarker
                key={index}
                onClick={() => {
                  onMarkerClick(hospital);
                  setInfowindowOpen(true);
                }}
                position={{ lat: lat, lng: long }}
                title={hospital.Hospital}
              />
            );
          })}
        </Map>
      </div>
    </APIProvider>
  );
};

export default MapComponent;

```

# src/components/ui/MapComponent.module.css

```css
.mapContainer {
  height: 100%;
  width: 100%;
}

@media (max-width: 768px) {
  .mapContainer {
    height: 400px; /* Adjust height for smaller screens */
  }
}

```

# src/components/ui/HospitalBlock.tsx

```tsx
import React, { useEffect, useRef } from "react";
import renderProperty from "../../utils/renderProperty";
import { Hospital } from "../../types/types";

const HospitalBlock = ({
  hospital,
  expanded,
  setExpandedHospital,
}: {
  hospital: Hospital;
  expanded: boolean;
  setExpandedHospital: (hospital?: Hospital) => void;
}) => {
  const blockRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (expanded && blockRef.current) {
      blockRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [expanded]);

  const toggleExpanded = (hospital?: Hospital) => {
    setExpandedHospital(expanded ? undefined : hospital);
  };

  return (
    <div
      ref={blockRef}
      className="border p-4 rounded-md cursor-pointer mb-4 bg-graywhite"
      onClick={() => toggleExpanded(hospital)}>
      <div className="font-bold">{hospital.Hospital}</div>
      <div>
        {hospital.City}, {hospital.State}
      </div>
      {expanded && (
        <div className="mt-4 space-y-2">
          {Object.keys(hospital).map(
            (key) =>
              key !== "Hospital" &&
              key !== "City" &&
              key !== "State" &&
              key !== "Lat" &&
              key !== "Long" &&
              renderProperty(key, hospital[key])
          )}
        </div>
      )}
    </div>
  );
};

export default HospitalBlock;

```

# src/components/ui/FooterKonnor.tsx

```tsx
import React from "react";

const FooterKonnor: React.FC = () => {
  return (
    <footer className="footer px-10 py-4 border-t bg-base-200 text-base-content border-base-300">
      <aside className="items-center grid-flow-col">
        <svg
          width="24"
          height="24"
          viewBox="0 0 16 16"
          xmlns="http://www.w3.org/2000/svg"
          fillRule="evenodd"
          clipRule="evenodd"
          className="fill-current">
          <path d="M1.5 0A1.5 1.5 0 0 0 0 1.5v7A1.5 1.5 0 0 0 1.5 10H6v1H1a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1h-5v-1h4.5A1.5 1.5 0 0 0 16 8.5v-7A1.5 1.5 0 0 0 14.5 0zm0 1h13a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-7a.5.5 0 0 1 .5-.5M12 12.5a.5.5 0 1 1 1 0 .5.5 0 0 1-1 0m2 0a.5.5 0 1 1 1 0 .5.5 0 0 1-1 0M1.5 12h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1 0-1M1 14.25a.25.25 0 0 1 .25-.25h5.5a.25.25 0 1 1 0 .5h-5.5a.25.25 0 0 1-.25-.25" />
        </svg>
        <p>
          Konnor Kooi <br />
          WWU Computer Science
        </p>
      </aside>
      <nav className="md:place-self-center md:justify-self-end">
        <div className="grid grid-flow-col gap-4">
          <a
            href="https://github.com/KonnorKooi"
            target="_blank"
            rel="noopener noreferrer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              width="24"
              height="24">
              <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"></path>
            </svg>
          </a>
          <a
            href="https://www.linkedin.com/in/konnor-kooi-93b83a281/"
            target="_blank"
            rel="noopener noreferrer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="currentColor"
              viewBox="0 0 16 16">
              <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854zm4.943 12.248V6.169H2.542v7.225zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248S2.4 3.226 2.4 3.934c0 .694.521 1.248 1.327 1.248zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016l.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225z" />
            </svg>
          </a>
          <a
            href="https://www.instagram.com/konnorkooi/"
            target="_blank"
            rel="noopener noreferrer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="currentColor"
              viewBox="0 0 16 16">
              <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.9 3.9 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599s.453.546.598.92c.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.5 2.5 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.5 2.5 0 0 1-.92-.598 2.5 2.5 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233s.008-2.388.046-3.231c.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92s.546-.453.92-.598c.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92m-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217m0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334" />
            </svg>
          </a>
        </div>
      </nav>
    </footer>
  );
};

export default FooterKonnor;

```

# src/components/ui/Footer.tsx

```tsx
import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="footer footer-center p-10 bg-base-300 text-primary-content">
      <aside>
        <p className="font-bold">
          All data is sourced from <br />
          <a
            href="https://doh.wa.gov/data-statistical-reports/healthcare-washington/hospital-and-patient-data/hospital-policies"
            target="_blank"
            rel="noopener noreferrer"
            className="link link-hover underline">
            The Washington State Department of Health.
          </a>
        </p>
        <p>Copyright © 2024 - All right reserved</p>
      </aside>
    </footer>
  );
};

export default Footer;

```

# src/components/ui/Filters.tsx

```tsx
import React, { ChangeEvent } from "react";

type CheckboxChangeHandler = (event: ChangeEvent<HTMLInputElement>) => void;

const Filters = ({
  checkboxFilters,
  handleCheckboxChange,
  filterOptions = []
}: {
  checkboxFilters: Record<string, boolean>;
  handleCheckboxChange: CheckboxChangeHandler;
  filterOptions: string[];
}) => {
  return (
    <details className="collapse collapse-arrow bg-lightblue">
      <summary className="collapse-title text-xl font-medium">Filters</summary>
      <div className="collapse-content bg-lightblue ">
        <div className="grid grid-cols-2 gap-4 mt-3">
          {filterOptions.map((key) => (
            <label key={key} className="flex items-center space-x-2">
              <input
                type="checkbox"
                name={key}
                checked={checkboxFilters[key]}
                onChange={handleCheckboxChange}
                className="checkbox h-5 w-5 text-darkgreen"
              />
              <span className="text-gray-700">{key}</span>
            </label>
          ))}
        </div>
      </div>
    </details>
  );
};

export default Filters;

```

