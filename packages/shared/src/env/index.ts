import path from "node:path"
import { z } from "zod"
import { logger } from "@commit.oi/shared/src/logger"
import { config } from "dotenv"
import { __dirname } from "../dirname"

config({ path: path.resolve(__dirname, ".env") })

const envSchema = z.object({
  USER_PORT: z.coerce.number(),
})

const _env = envSchema.safeParse(process.env)

if (!_env.success) {
  logger.error("Invalid environments variables", _env.error.flatten())
  throw new Error("Invalid environments variables ❌❌❌❌")
}

export const env = _env.data
export type Env = z.infer<typeof envSchema>
