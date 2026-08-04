import coreWebVitals from "eslint-config-next/core-web-vitals";
import typescript from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier";

// `next lint` was removed in Next 16, so ESLint runs directly.
// eslint-config-next 16 ships native flat configs, so no FlatCompat shim.
const config = [
  {
    ignores: [
      ".next/**",
      "out/**",
      "node_modules/**",
      "src/data/generated/**",
      "playwright-report/**",
      "test-results/**",
    ],
  },
  ...coreWebVitals,
  ...typescript,
  prettier,
  {
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports", fixStyle: "inline-type-imports" },
      ],
    },
  },
];

export default config;
