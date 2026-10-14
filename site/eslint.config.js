// Flat ESLint config. Catches real bugs (hallucinated properties, unused
// symbols, unsafe patterns); formatting is Prettier's job, not ESLint's
// (eslint-config-prettier last turns off any rule that would fight it).
import js from "@eslint/js";
import ts from "typescript-eslint";
import astro from "eslint-plugin-astro";
import prettier from "eslint-config-prettier";
import globals from "globals";

export default ts.config(
  { ignores: ["dist/", ".astro/", "public/", "scripts/*.mjs", "review-design.mjs"] },

  js.configs.recommended,
  ...ts.configs.recommended,
  ...astro.configs.recommended,

  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
    rules: {
      // Allow intentionally-unused args prefixed with _
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      // Flag leftover debugging before it reaches a commit
      "no-console": ["warn", { allow: ["warn", "error"] }],
      eqeqeq: ["error", "smart"],
    },
  },

  // Plain JS/data files: no type-aware rules, looser return typing
  {
    files: ["**/*.js", "**/*.mjs"],
    ...ts.configs.disableTypeChecked,
    rules: {
      "@typescript-eslint/explicit-module-boundary-types": "off",
    },
  },

  // Prettier compatibility — keep last
  prettier
);
