import coreWebVitals from "eslint-config-next/core-web-vitals";
import typescript from "eslint-config-next/typescript";

/**
 * Flat config, using the native exports from eslint-config-next 16. The older
 * FlatCompat bridge is not used — it cannot serialise this config under
 * newer ESLint releases.
 */
const config = [
  { ignores: [".next/**", "node_modules/**", "out/**", "next-env.d.ts"] },
  ...coreWebVitals,
  ...typescript,
];

export default config;
