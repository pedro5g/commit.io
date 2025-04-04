import { UnauthorizedException } from "../exceptions"
import {
  accessTokenSignOptions,
  ErrorCode,
  HTTP_STATUS,
  verifyJwtToken,
} from "../utils"
import { asyncHandler } from "./async-handler"

export const isAuthenticated = asyncHandler(async (req, res, next) => {
  const accessToken = req.cookies["accessToken"] as string | undefined

  if (!accessToken) {
    res.status(HTTP_STATUS.UNAUTHORIZED).json({
      ok: false,
      message: "UNAUTHORIZED",
      errorCode: ErrorCode.AUTH_TOKEN_NOT_FOUND,
    })
    return
  }

  const { payload } = verifyJwtToken(accessToken, accessTokenSignOptions)

  if (!payload) {
    res.status(HTTP_STATUS.UNAUTHORIZED).json({
      ok: false,
      message: "UNAUTHORIZED",
      errorCode: ErrorCode.AUTH_TOKEN_NOT_FOUND,
    })
    return
  }

  req.user = {
    id: payload.userId,
    name: payload.name,
    email: payload.email,
    accountProvider: payload.accountProvider,
  }
  next()
})
