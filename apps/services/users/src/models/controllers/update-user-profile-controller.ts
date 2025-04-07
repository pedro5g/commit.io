import { asyncHandler, HTTP_STATUS } from "@commit.oi/shared"
import { updateUserProfileSchema } from "../../validators"
import { updateUserProfileService } from "../services/update-user-profile"

export const updateUserProfileController = asyncHandler(async (req, res) => {
  const id = req.user.id
  const { userName, bio } = updateUserProfileSchema.parse(req.body)

  const { userUpdated } = await updateUserProfileService({ id, userName, bio })

  res.status(HTTP_STATUS.OK).json({
    ok: true,
    message: "Profile updated successfully",
    userUpdated,
  })
})
