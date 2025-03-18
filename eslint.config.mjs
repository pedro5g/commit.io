import { includeIgnoreFile } from "@eslint/compat"
import path from "node:path"
import { fileURLToPath } from "node:url"
import globals from "globals"
import eslint from "@eslint/js"
import tseslint from "typescript-eslint"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const gitignorePath = path.resolve(__dirname, ".gitignore")

export default [
  ...tseslint.config(
    eslint.configs.recommended,
    ...tseslint.configs.strict,
    ...tseslint.configs.stylistic,
    {
      languageOptions: {
        globals: {
          ...globals.node,
          ...globals.browser,
        },
      },
      rules: {
        "@typescript-eslint/consistent-type-definitions": "off",
        "@typescript-eslint/no-unused-vars": "off",
        "@typescript-eslint/no-namespace": "off",
        "@typescript-eslint/no-inferrable-types": "off",
        "no-async-promise-executor": "off",
        "@typescript-eslint/no-extraneous-class": "off",
        "@typescript-eslint/no-empty-function": "off",
        "max-len": [
          "error",
          {
            code: 80,
            ignoreStrings: true,
            ignoreTemplateLiterals: true,
            ignoreUrls: true,
          },
        ],
      },
    },
  ),
  includeIgnoreFile(gitignorePath),
]
