import path from "node:path"
import { fileURLToPath } from "node:url"

const dirname = path.dirname(fileURLToPath(import.meta.url))
export const __dirname = path.resolve(dirname, "../../../")
