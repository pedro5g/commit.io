import { Response, CookieOptions } from "express"
import { REFRESH_PATH } from "../constants"
import { add } from "./date-time"
import { env } from "../env"

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

const defaults: CookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === "prod" ? true : false,
  sameSite: env.NODE_ENV === "prod" ? "strict" : "lax",
}

export function getRefreshTokenCookieOptions(): CookieOptions {
  const expiresIn = env.REFRESH_EXPIRES_IN
  const expires = calculateExpirationDate(expiresIn)
  return { ...defaults, expires, path: REFRESH_PATH }
}
export function getAccessTokenCookieOptions(): CookieOptions {
  const expiresIn = env.JWT_EXPIRES_IN
  const expires = calculateExpirationDate(expiresIn)
  return { ...defaults, expires, path: "/" }
}

export function clearAuthenticationCookies(res: Response) {
  return res.clearCookie("accessToken").clearCookie("refreshToken", {
    path: REFRESH_PATH,
  })
}
