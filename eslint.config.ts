import tsPlugin from "@typescript-eslint/eslint-plugin";
import parser from "@typescript-eslint/parser";

export default {
  files: ["**/*.{js,ts,jsx,tsx}"],
  languageOptions: {
    parser: parser,
    parserOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
    },
  },
  plugins: {
    "@typescript-eslint": tsPlugin,
  },
  rules: {
    ...Object.fromEntries(
      Object.entries(tsPlugin.rules).map(([ruleName, rule]) => [
        `@typescript-eslint/${ruleName}`,
        rule["recommended"] ? "warn" : "off",
      ])
    ),
  },
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
};
