import {
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
    throw new UnauthorizedException("Invalid refresh token")
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
    },
    refreshTokenSignOptions,
  )
  const accessToken = signJwtToken({
    userId: user.id,
  })

  return {
    accessToken,
    newRefreshToken,
  }
}
