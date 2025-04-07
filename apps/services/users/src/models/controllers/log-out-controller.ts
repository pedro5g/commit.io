import { asyncHandler, HTTP_STATUS } from "@commit.oi/shared"

export const logOutController = asyncHandler(async (_req, res) => {
  res
    .clearCookie("accessToken")
    .clearCookie("refreshToken")
    .status(HTTP_STATUS.OK)
    .json({
      ok: true,
      message: "Log out successfully",
    })
})
