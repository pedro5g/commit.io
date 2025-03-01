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
  ...tseslint.config(eslint.configs.recommended, ...tseslint.configs.strict, ...tseslint.configs.stylistic, {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.browser,
      },
    },
  }),
  includeIgnoreFile(gitignorePath),
]
