import { asyncHandler, HTTP_STATUS } from "@commit.oi/shared"
import { refreshService } from "../services/refresh-service"

export const refreshController = asyncHandler(async (req, res) => {
  const refreshToken = (req.cookies["refreshToken"] as string) || ""

  const { newRefreshToken, accessToken } = await refreshService({
    refreshToken,
  })

  res
    .setAuthCookies({ accessToken, refreshToken: newRefreshToken })
    .status(HTTP_STATUS.OK)
    .send({ ok: true, message: "Session revalidated successfully" })
})
