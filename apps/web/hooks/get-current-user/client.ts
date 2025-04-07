import { UserAccount } from "@/@types"
import { CookieParser } from "@/lib/utils"

export type BrowserCookieOpts = {
  days?: number
  sameSite?: "Lax" | "Strict" | "None"
  maxAge?: number
  secure?: boolean
}

export const getCookies = () => {
  const _cookiesStr = document.cookie ? document.cookie.split("; ") : []
  const __cookies = CookieParser.parser(_cookiesStr)
  const cookie = CookieParser.fromEntries(__cookies)
  return cookie
}

export const getCookie = (key: string) => {
  const _cookies = getCookies()
  const cookie = _cookies?.[key]
  if (!cookie) return undefined
  return cookie
}

export const setCookie = (
  name: string,
  value: string,
  options: BrowserCookieOpts = {},
) => {
  const { days = 7, maxAge, sameSite = "Lax", secure = false } = options

  let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`

  if (days && !maxAge) {
    const expires = new Date()
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000)
    cookieString += `;
     expires=${expires.toUTCString()}`
  }

  if (maxAge) {
    cookieString += `; max-age=${maxAge}`
  }

  cookieString += `; path=/`
  cookieString += `; SameSite=${sameSite}`
  if (secure) cookieString += `; Secure`

  document.cookie = cookieString
}

export const hasCookie = (key: string) => {
  if (!key) return false
  const _cookies = getCookies()
  if (!_cookies) {
    return false
  }
  return Object.prototype.hasOwnProperty.call(_cookies, key)
}

export const deleteCookie = (key: string, opts?: BrowserCookieOpts) => {
  setCookie(key, "", { ...opts, maxAge: -1 })
}

export const getCurrentUser = () => {
  const userAccount = getCookie("user-account")
  if (!userAccount) return null
  return JSON.parse(decodeURIComponent(userAccount.value)) as UserAccount
}
