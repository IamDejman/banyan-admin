import js from "@eslint/js";
import typescript from "@typescript-eslint/eslint-plugin";
import typescriptParser from "@typescript-eslint/parser";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";

export default [
  {
    ignores: [".next/**", "node_modules/**", "out/**", "build/**", "dist/**"],
  },
  js.configs.recommended,
  {
    files: ["**/*.{ts,tsx,js,jsx}"],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.node,
        ...globals.browser,
        ...globals.es2021,
        // Allow using the React and NodeJS namespaces in types without importing them everywhere
        React: "readonly",
        NodeJS: "readonly",
      },
    },
    plugins: {
      react,
      "react-hooks": reactHooks,
      "@typescript-eslint": typescript,
    },
    rules: {
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "no-console": "off",
      // Relax React Compiler strictness for now to avoid noisy errors
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/purity": "off",
      "react-hooks/incompatible-library": "off",
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
];
