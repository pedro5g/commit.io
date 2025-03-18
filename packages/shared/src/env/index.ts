import path from "node:path"
import { z } from "zod"
import { logger } from "../logger"
import { config } from "dotenv"
import { dirname } from "../dirname"

config({ path: path.resolve(dirname, ".env") })
type StringValue = `${number}${"m" | "h" | "d"}`
const expiresAtSchema = z
  .string()
  .refine(
    (expiresAt) => {
      // Match number + unit (m = minutes, h = hours, d = days)
      return expiresAt.match(/^(\d+)([mhd])$/)
    },
    { message: 'Invalid format. Use "15m", "1h", or "2d".' },
  )
  .transform((value) => value as StringValue)

const envSchema = z.object({
  NODE_ENV: z.enum(["dev", "test", "prod"]).default("dev"),
  USER_PORT: z.coerce.number(),
  APP_ORIGEM: z.string().url(),
  PREFIX_URL: z.string(),
  JWT_PUBLIC_SECRET: z.string(),
  JWT_EXPIRES_IN: expiresAtSchema,
  REFRESH_SECRET: z.string(),
  REFRESH_EXPIRES_IN: expiresAtSchema,
  RABBITMQ_CONNECTION_URL: z.string().url(),
  RESEND_API_KEY: z.string(),
})

const _env = envSchema.safeParse(process.env)

if (!_env.success) {
  logger.error("Invalid environments variables", _env.error.flatten())
  throw new Error("Invalid environments variables ❌❌❌❌")
}

export const env = _env.data
export type Env = z.infer<typeof envSchema>
