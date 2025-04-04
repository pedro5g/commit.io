import {
  ErrorCode,
  NotFoundException,
  prisma,
  refreshTokenSignOptions,
  signJwtToken,
  UnauthorizedException,
  verifyJwtToken,
} from "@commit.oi/shared"
import { RefreshDTO } from "../dtos/refresh-dto"

export const refreshService = async ({ refreshToken }: RefreshDTO) => {
  const { payload } = verifyJwtToken(refreshToken, {
    secret: refreshTokenSignOptions.secret,
  })

  if (!payload) {
    throw new UnauthorizedException(
      "Invalid refresh token",
      ErrorCode.AUTH_INVALID_TOKEN,
    )
  }

  const user = await prisma.user.findUnique({
    where: {
      id: payload.userId,
    },
  })

  if (!user) {
    throw new NotFoundException("User not found")
  }

  const newRefreshToken = signJwtToken(
    {
      userId: user.id,
      name: user.userName,
      email: user.email,
      accountProvider: payload.accountProvider,
    },
    refreshTokenSignOptions,
  )
  const accessToken = signJwtToken({
    userId: user.id,
    accountProvider: payload.accountProvider,
  })

  return {
    accessToken,
    newRefreshToken,
  }
}
