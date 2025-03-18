import { add, env, express } from "@commit.oi/shared"
import { randomUUID } from "node:crypto"

export function calculateExpirationDate(expiresIn: string): Date {
  const match = expiresIn.match(/^(\d+)([mhd])$/)
  if (!match) throw new Error('Invalid format. Use "15m", "1h", or "2d".')
  const [, value, unit] = match
  const expirationDate = new Date()

  switch (unit) {
    case "m":
      return add(expirationDate, { minutes: parseInt(value) })
    case "h":
      return add(expirationDate, { hours: parseInt(value) })
    case "d":
      return add(expirationDate, { days: parseInt(value) })
    default:
      throw new Error('Invalid unit. Use "m", "h", or "d".')
  }
}

const defaults: express.CookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === "prod" ? true : false,
  sameSite: env.NODE_ENV === "prod" ? "strict" : "lax",
}

export function getRefreshTokenCookieOptions(): express.CookieOptions {
  const expiresIn = env.REFRESH_EXPIRES_IN
  const expires = calculateExpirationDate(expiresIn)
  return { ...defaults, expires, path: "/" }
}
export function getAccessTokenCookieOptions(): express.CookieOptions {
  const expiresIn = env.JWT_EXPIRES_IN
  const expires = calculateExpirationDate(expiresIn)
  return { ...defaults, expires, path: "/" }
}

export const genRandomCode = () => {
  return randomUUID().replaceAll("-", "").trim().slice(0, 10)
}
