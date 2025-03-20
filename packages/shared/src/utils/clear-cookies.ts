import { Response } from "express"
import { REFRESH_PATH } from "../constants"

export function clearAuthenticationCookies(res: Response) {
  return res.clearCookie("accessToken").clearCookie("refreshToken", {
    path: REFRESH_PATH,
  })
}
