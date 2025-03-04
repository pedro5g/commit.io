import path from "node:path"
import { z } from "zod"
import { logger } from "../logger"
import { config } from "dotenv"
import { dirname } from "../dirname"

config({ path: path.resolve(dirname, ".env") })

const envSchema = z.object({
  NODE_ENV: z.enum(["dev", "test", "prod"]).default("dev"),
  USER_PORT: z.coerce.number(),
  APP_ORIGEM: z.string().url(),
  PREFIX_URL: z.string(),
})

const _env = envSchema.safeParse(process.env)

if (!_env.success) {
  logger.error("Invalid environments variables", _env.error.flatten())
  throw new Error("Invalid environments variables ❌❌❌❌")
}

export const env = _env.data
export type Env = z.infer<typeof envSchema>
