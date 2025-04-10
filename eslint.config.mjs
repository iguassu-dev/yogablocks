import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];

/** @type {import('eslint').Linter.FlatConfig[]} */
const config = [
  {
    ignores: [".next/**"],
    // (Other existing config like rules, plugins, extends, etc.)
  },
  // (Your other config blocks if you have any)
];

export default eslintConfig;
