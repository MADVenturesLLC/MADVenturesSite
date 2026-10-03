import next from "eslint-config-next";
import nextTs from "eslint-config-next/typescript";

/**
 * eslint-config-next 16 ships native flat configs, so no FlatCompat bridge
 * (and therefore no @eslint/eslintrc dependency) is required.
 */
const config = [
  ...next,
  ...nextTs,
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "next-env.d.ts",
      // Preserved pre-migration static build. Not part of the application.
      "migration-reference/**",
    ],
  },
];

export default config;
