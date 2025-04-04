import { asyncHandler, HTTP_STATUS } from "@commit.oi/shared"
import { profileService } from "../services/profile-service"

export const profileController = asyncHandler(async (req, res) => {
  const { id, accountProvider } = req.user

  const { userAccount } = await profileService({ userId: id, accountProvider })

  res
    .status(HTTP_STATUS.OK)
    .json({ ok: true, message: "Request successfully", userAccount })
})
