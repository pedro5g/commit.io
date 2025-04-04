import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const isServerSide = () => typeof window === "undefined"

export interface CookiesOpts {
  domain?: string | undefined
  encode?(value: string): string
  expires?: Date | undefined
  httpOnly?: boolean | undefined
  maxAge?: number | undefined
  partitioned?: boolean | undefined
  path?: string | undefined
  sameSite?: true | false | "lax" | "strict" | "none" | undefined
  secure?: boolean | undefined
}

export class Cookie {
  constructor(
    public key: string,
    public value: string,
    public opts: CookiesOpts = {},
  ) {}
}

export class CookieParser {
  static parser(plainCookies: string | string[]) {
    const cookiesStr = Array.isArray(plainCookies)
      ? plainCookies
      : [plainCookies]

    const cookies: Array<Cookie> = []
    cookiesStr.forEach((cookieStr) => {
      const parts = cookieStr.split(";").map((part) => part.trim())
      const [key_value, ...options] = parts
      const [key, value] = key_value.split("=")

      const cookieOptions: CookiesOpts = { path: "/" }

      options.forEach((option) => {
        if (option.toLowerCase() === "httponly") cookieOptions.httpOnly = true
        if (option.toLowerCase() === "secure") cookieOptions.secure = true
        if (option.toLowerCase().startsWith("samesite="))
          cookieOptions.sameSite = option.split("=")[1] as
            | "lax"
            | "strict"
            | "none"
        if (option.toLowerCase().startsWith("max-age="))
          cookieOptions.maxAge = parseInt(option.split("=")[1], 10)
        if (option.toLowerCase().startsWith("expires"))
          cookieOptions.expires = new Date(option.split("=")[1])
      })

      cookies.push(new Cookie(key.trim(), value.trim(), cookieOptions))
    })

    return cookies
  }
}
