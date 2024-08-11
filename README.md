# Washington Health Project

This project is a web application that provides information about healthcare services in Washington state, focusing on reproductive health and end-of-life services.

## Features

-   Interactive map of Washington state hospitals
-   Detailed information about each hospital's services
-   Filtering options for specific healthcare services
-   Responsive design for desktop and mobile devices

## Project Structure

```
/
├── public/
│   ├── data/
│   │   ├── endoflife.csv
│   │   └── reproductive.csv
│   ├── images/
│   │   ├── logo.png
│   │   └── logo_nobg.png
│   └── favicon.ico
├── src/
│   ├── components/
│   │   └── ui/
│   │       ├── Filters.tsx
│   │       ├── Footer.tsx
│   │       ├── FooterKonnor.tsx
│   │       ├── HospitalBlock.tsx
│   │       ├── MapComponent.tsx
│   │       ├── MapComponent.module.css
│   │       ├── Navbar.tsx
│   │       └── ScrollArea.tsx
│   ├── hooks/
│   │   └── useFetchHospitals.ts
│   ├── lib/
│   │   └── utils.ts
│   ├── pages/
│   │   ├── _app.js
│   │   ├── _document.tsx
│   │   └── index.tsx
│   ├── styles/
│   │   └── globals.css
│   ├── types/
│   │   └── types.ts
│   └── utils/
│       └── renderProperty.tsx
├── .eslintrc.json
├── .gitignore
├── next.config.mjs
├── package.json
├── postcss.config.mjs
├── tailwind.config.ts
└── tsconfig.json
```

## Getting Started

1. Clone the repository
2. Install dependencies:
    ```
    npm install
    ```
3. Set up environment variables:
    - Create a `.env.local` file in the root directory
    - Add the following variables:
        ```
        NEXT_PUBLIC_GOOGLE_API_KEY=your_google_maps_api_key
        NEXT_PUBLIC_MAP_ID=your_google_maps_id
        ```
4. Run the development server:
    ```
    npm run dev
    ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Technologies Used

-   Next.js
-   React
-   TypeScript
-   Tailwind CSS
-   DaisyUI
-   Google Maps API

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).

## Todo

-- Consolidating styles and ensuring consistent use of Tailwind CSS throughout the project.
-- Improving accessibility by adding proper ARIA labels and roles where necessary.
-- Enhancing error handling and loading states for data fetching.
-- Adding unit and integration tests to ensure reliability.
-- Optimizing performance, particularly for the map component and large data sets.
-- Implementing server-side rendering or static site generation for improved SEO and initial load times.
-- Adding more detailed documentation for each component and function.
